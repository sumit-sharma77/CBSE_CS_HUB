package com.cbsecshub.api.subscription.dto;

import com.cbsecshub.api.subscription.entity.Subscription;

import java.time.Instant;
import java.util.UUID;

public record SubscriptionDTO(
    UUID id,
    Long planId,
    String planName,
    String status,
    Instant currentPeriodEnd,
    Instant gracePeriodEnd
) {
    public static SubscriptionDTO from(Subscription sub, String planName) {
        return new SubscriptionDTO(
            sub.getId(),
            sub.getPlanId(),
            planName,
            sub.getStatus().name(),
            sub.getCurrentPeriodEnd(),
            sub.getGracePeriodEnd()
        );
    }
}
