package com.cbsecshub.api.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpsertPlanRequest(
    @NotBlank String name,
    @NotBlank String billingCycle,
    @NotNull BigDecimal priceInr,
    Integer maxQuestionsPerTopic,
    String razorpayPlanId,
    String features,
    boolean isActive
) {}
