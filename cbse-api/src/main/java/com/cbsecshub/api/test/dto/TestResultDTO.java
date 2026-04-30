package com.cbsecshub.api.test.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record TestResultDTO(
    UUID sessionId,
    String mode,
    int questionCount,
    int correctCount,
    int incorrectCount,
    int skippedCount,
    int rawScore,
    int maxScore,
    BigDecimal weightedScore,
    BigDecimal percentileRank,
    int timeTakenSeconds,
    Instant createdAt,
    List<QuestionResultDTO> questions
) {}
