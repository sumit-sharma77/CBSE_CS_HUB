package com.cbsecshub.api.test.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public record CreateTestSessionRequest(
    @NotEmpty List<Long> topicIds,
    @NotBlank String mode   // QUICK | STANDARD | FULL
) {}
