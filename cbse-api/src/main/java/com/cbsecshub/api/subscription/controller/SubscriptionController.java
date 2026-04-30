package com.cbsecshub.api.subscription.controller;

import com.cbsecshub.api.subscription.dto.SubscriptionDTO;
import com.cbsecshub.api.subscription.service.SubscriptionService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/me")
    public SubscriptionDTO getMySubscription(@AuthenticationPrincipal UUID userId) {
        return subscriptionService.getMySubscription(userId);
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> initiateCheckout(
            @AuthenticationPrincipal UUID userId,
            @RequestBody Map<String, Long> body) {
        Long planId = body.get("planId");
        if (planId == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, "planId is required");
        }
        return subscriptionService.initiateCheckout(userId, planId);
    }

    @PostMapping("/cancel")
    public void cancelSubscription(@AuthenticationPrincipal UUID userId) {
        subscriptionService.cancelSubscription(userId);
    }
}
