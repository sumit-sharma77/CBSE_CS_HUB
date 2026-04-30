package com.cbsecshub.api.test.dto;

public record QuestionResultDTO(
    Long questionId,
    String questionText,
    String optionsJson,
    String correctOptionId,
    String selectedOptionId,
    boolean isCorrect,
    int difficultyWeight
) {}
