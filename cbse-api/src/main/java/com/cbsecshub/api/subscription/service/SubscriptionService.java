package com.cbsecshub.api.subscription.service;

import com.cbsecshub.api.subscription.dto.PlanDTO;
import com.cbsecshub.api.subscription.dto.SubscriptionDTO;
import com.cbsecshub.api.subscription.entity.Plan;
import com.cbsecshub.api.subscription.entity.Subscription;
import com.cbsecshub.api.subscription.repository.PlanRepository;
import com.cbsecshub.api.subscription.repository.SubscriptionRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;
    private final RazorpayClient razorpayClient;

    @Transactional
    public void createFreeSubscription(UUID userId) {
        Plan freePlan = planRepository.findAllByIsActiveTrueOrderByPriceInrAsc().stream()
            .filter(p -> "NONE".equals(p.getBillingCycle()))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("Free plan not found in DB — check V10 seed"));

        Subscription sub = Subscription.builder()
            .userId(userId)
            .planId(freePlan.getId())
            .status(Subscription.Status.FREE)
            .build();
        subscriptionRepository.save(sub);
    }

    public SubscriptionDTO getMySubscription(UUID userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription not found"));
        String planName = planRepository.findById(sub.getPlanId())
            .map(Plan::getName)
            .orElse("Unknown");
        return SubscriptionDTO.from(sub, planName);
    }

    public List<PlanDTO> getAllPlans() {
        return planRepository.findAllByIsActiveTrueOrderByPriceInrAsc()
            .stream()
            .map(PlanDTO::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, String> initiateCheckout(UUID userId, Long planId) {
        Plan plan = planRepository.findById(planId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));

        if (plan.getRazorpayPlanId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "This plan is not yet available for purchase");
        }

        try {
            JSONObject params = new JSONObject();
            params.put("plan_id", plan.getRazorpayPlanId());
            params.put("total_count", "YEARLY".equals(plan.getBillingCycle()) ? 12 : 120);
            params.put("quantity", 1);

            com.razorpay.Subscription rzSub = razorpayClient.subscriptions.create(params);
            String rzSubId = rzSub.get("id");
            String shortUrl = rzSub.get("short_url");

            Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElseGet(() -> Subscription.builder().userId(userId).build());
            sub.setPlanId(planId);
            sub.setStatus(Subscription.Status.PENDING);
            sub.setRazorpaySubscriptionId(rzSubId);
            subscriptionRepository.save(sub);

            return Map.of(
                "subscriptionId", rzSubId,
                "shortUrl", shortUrl != null ? shortUrl : ""
            );
        } catch (RazorpayException e) {
            log.error("Razorpay checkout failed for userId={} planId={}: {}", userId, planId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider error");
        }
    }

    @Transactional
    public void cancelSubscription(UUID userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (sub.getRazorpaySubscriptionId() != null) {
            try {
                JSONObject params = new JSONObject();
                params.put("cancel_at_cycle_end", 1);
                razorpayClient.subscriptions.cancel(sub.getRazorpaySubscriptionId(), params);
            } catch (RazorpayException e) {
                log.error("Razorpay cancel failed for userId={}: {}", userId, e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider error");
            }
        }
        sub.setStatus(Subscription.Status.CANCELLED);
        sub.setCancelledAt(java.time.Instant.now());
        subscriptionRepository.save(sub);
        log.info("SUBSCRIPTION cancel userId={}", userId);
    }

    public boolean hasActivePaidSubscription(UUID userId) {
        return subscriptionRepository.findActiveByUserId(userId).isPresent();
    }

    /**
     * Admin-only: directly activate a subscription for any user without Razorpay.
     * Creates or replaces the user's current subscription.
     */
    @Transactional
    public SubscriptionDTO grantSubscription(UUID userId, Long planId, int months) {
        Plan plan = planRepository.findById(planId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));

        Subscription sub = subscriptionRepository.findByUserId(userId)
            .orElseGet(() -> Subscription.builder().userId(userId).build());

        sub.setPlanId(planId);
        sub.setStatus(Subscription.Status.ACTIVE);
        sub.setRazorpaySubscriptionId(null); // manual — no Razorpay ID
        sub.setCurrentPeriodStart(java.time.Instant.now());
        sub.setCurrentPeriodEnd(java.time.Instant.now().plus(months * 30L, java.time.temporal.ChronoUnit.DAYS));
        sub.setGracePeriodEnd(null);
        sub.setCancelledAt(null);
        sub = subscriptionRepository.save(sub);

        log.info("ADMIN grant subscription userId={} planId={} months={}", userId, planId, months);
        return SubscriptionDTO.from(sub, plan.getName());
    }

    /**
     * Admin-only: downgrade a user to the free plan.
     */
    @Transactional
    public void revokeSubscription(UUID userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription not found"));

        Plan freePlan = planRepository.findAllByIsActiveTrueOrderByPriceInrAsc().stream()
            .filter(p -> "NONE".equals(p.getBillingCycle()))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("Free plan not found"));

        sub.setPlanId(freePlan.getId());
        sub.setStatus(Subscription.Status.FREE);
        sub.setRazorpaySubscriptionId(null);
        sub.setCurrentPeriodStart(null);
        sub.setCurrentPeriodEnd(null);
        sub.setGracePeriodEnd(null);
        sub.setCancelledAt(java.time.Instant.now());
        subscriptionRepository.save(sub);
        log.info("ADMIN revoke subscription userId={}", userId);
    }

    public List<SubscriptionDTO> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
            .map(sub -> {
                String name = planRepository.findById(sub.getPlanId())
                    .map(Plan::getName).orElse("Unknown");
                return SubscriptionDTO.from(sub, name);
            })
            .collect(Collectors.toList());
    }
}