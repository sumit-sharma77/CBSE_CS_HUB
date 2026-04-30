package com.cbsecshub.api.webhook;

import com.cbsecshub.api.subscription.entity.Subscription;
import com.cbsecshub.api.subscription.repository.SubscriptionRepository;
import com.cbsecshub.api.webhook.entity.WebhookEvent;
import com.cbsecshub.api.webhook.repository.WebhookEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class WebhookService {

    private final SubscriptionRepository subscriptionRepository;
    private final WebhookEventRepository webhookEventRepository;

    @Transactional
    public boolean handle(String payload, String eventType, String razorpayEventId) {
        // Idempotency check
        Optional<WebhookEvent> existing = webhookEventRepository.findByRazorpayEventId(razorpayEventId);
        if (existing.isPresent()) {
            log.info("WEBHOOK duplicate event={} id={}", eventType, razorpayEventId);
            return false; // duplicate
        }

        WebhookEvent.Status status = WebhookEvent.Status.PROCESSED;
        try {
            processEvent(payload, eventType, razorpayEventId);
        } catch (Exception e) {
            log.error("WEBHOOK processing failed event={} id={}: {}", eventType, razorpayEventId, e.getMessage());
            status = WebhookEvent.Status.FAILED;
        }

        webhookEventRepository.save(WebhookEvent.builder()
            .razorpayEventId(razorpayEventId)
            .eventType(eventType)
            .payload(payload)
            .status(status)
            .processedAt(Instant.now())
            .build());

        return true;
    }

    private void processEvent(String payload, String eventType, String eventId) {
        JSONObject body = new JSONObject(payload);
        JSONObject subscriptionData = body.optJSONObject("payload") != null
            ? body.getJSONObject("payload").optJSONObject("subscription") != null
                ? body.getJSONObject("payload").getJSONObject("subscription").optJSONObject("entity")
                : null
            : null;

        if (subscriptionData == null) {
            log.warn("WEBHOOK no subscription entity in payload for event={}", eventType);
            return;
        }

        String rzSubId = subscriptionData.optString("id");
        if (rzSubId.isBlank()) return;

        Subscription sub = subscriptionRepository.findByRazorpaySubscriptionId(rzSubId).orElse(null);
        if (sub == null) {
            log.warn("WEBHOOK no subscription found for rzSubId={} event={}", rzSubId, eventType);
            return;
        }

        Instant now = Instant.now();
        switch (eventType) {
            case "subscription.activated" -> {
                sub.setStatus(Subscription.Status.ACTIVE);
                setCurrentPeriod(sub, subscriptionData);
                log.info("WEBHOOK subscription.activated userId={} rzSubId={}", sub.getUserId(), rzSubId);
            }
            case "subscription.charged" -> {
                sub.setStatus(Subscription.Status.ACTIVE);
                setCurrentPeriod(sub, subscriptionData);
                log.info("WEBHOOK subscription.charged userId={} rzSubId={}", sub.getUserId(), rzSubId);
            }
            case "subscription.cancelled" -> {
                sub.setStatus(Subscription.Status.CANCELLED);
                sub.setCancelledAt(now);
                log.info("WEBHOOK subscription.cancelled userId={} rzSubId={}", sub.getUserId(), rzSubId);
            }
            case "subscription.halted" -> {
                sub.setStatus(Subscription.Status.GRACE_PERIOD);
                sub.setGracePeriodEnd(now.plusSeconds(3 * 24 * 3600)); // 3 days
                log.info("WEBHOOK subscription.halted userId={} rzSubId={}", sub.getUserId(), rzSubId);
            }
            case "subscription.expired" -> {
                sub.setStatus(Subscription.Status.EXPIRED);
                log.info("WEBHOOK subscription.expired userId={} rzSubId={}", sub.getUserId(), rzSubId);
            }
            default -> log.debug("WEBHOOK unhandled event={}", eventType);
        }
        subscriptionRepository.save(sub);
    }

    private void setCurrentPeriod(Subscription sub, JSONObject subscriptionData) {
        long start = subscriptionData.optLong("current_start", 0);
        long end = subscriptionData.optLong("current_end", 0);
        if (start > 0) sub.setCurrentPeriodStart(Instant.ofEpochSecond(start));
        if (end > 0) sub.setCurrentPeriodEnd(Instant.ofEpochSecond(end));
    }
}
