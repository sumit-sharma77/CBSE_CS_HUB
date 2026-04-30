package com.cbsecshub.api.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record GrantSubscriptionRequest(
    @NotNull UUID userId,
    @NotNull Long planId,
    @Min(1) int months
) {}
