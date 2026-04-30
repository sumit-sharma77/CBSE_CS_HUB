package com.cbsecshub.api.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTopicRequest(
    @NotBlank String name,
    @NotNull Short classLevel,
    @NotBlank String type
) {}
