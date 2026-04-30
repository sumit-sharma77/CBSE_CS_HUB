package com.cbsecshub.api.subscription.dto;

import com.cbsecshub.api.subscription.entity.Plan;
import com.fasterxml.jackson.annotation.JsonRawValue;

import java.math.BigDecimal;

public record PlanDTO(
    Long planId,
    String planName,
    String billingCycle,
    BigDecimal priceInr,
    Integer maxQuestionsPerTopic,
    @JsonRawValue String features,
    boolean isActive
) {
    public static PlanDTO from(Plan plan) {
        return new PlanDTO(
            plan.getId(),
            plan.getName(),
            plan.getBillingCycle(),
            plan.getPriceInr(),
            plan.getMaxQuestionsPerTopic(),
            plan.getFeatures(),
            plan.isActive()
        );
    }
}
