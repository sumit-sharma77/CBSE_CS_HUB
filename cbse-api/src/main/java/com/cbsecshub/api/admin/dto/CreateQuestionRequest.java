package com.cbsecshub.api.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateQuestionRequest(
    @NotNull Long topicId,
    @NotBlank String questionText,
    @NotBlank String type,
    @NotBlank String optionsJson,
    @NotBlank String correctOptionId,
    int difficultyWeight
) {}
