package com.cbsecshub.api.test.service;

import com.cbsecshub.api.content.entity.Question;
import com.cbsecshub.api.test.entity.TestAttempt;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

/**
 * Calculates CBSE-pattern scores: +4 correct, -1 wrong, 0 skipped.
 */
@Service
public class ScoringService {

    public static final int CORRECT_POINTS = 4;
    public static final int WRONG_PENALTY  = -1;

    public record ScoreResult(
        int correctCount,
        int incorrectCount,
        int skippedCount,
        int rawScore,
        int maxScore,
        BigDecimal weightedScore
    ) {}

    public ScoreResult score(List<Question> questions, Map<String, String> answers) {
        int correct   = 0;
        int incorrect = 0;
        int skipped   = 0;
        double weightedSum  = 0.0;
        double totalWeight  = 0.0;

        for (Question q : questions) {
            String questionId = q.getId().toString();
            String selectedOption = answers.get(questionId);
            int weight = q.getDifficultyWeight() != null ? q.getDifficultyWeight() : 1;
            totalWeight += weight;

            if (selectedOption == null || selectedOption.isBlank()) {
                skipped++;
            } else if (selectedOption.equals(q.getCorrectOptionId())) {
                correct++;
                weightedSum += weight;
            } else {
                incorrect++;
            }
        }

        int raw = (correct * CORRECT_POINTS) + (incorrect * WRONG_PENALTY);
        int max = questions.size() * CORRECT_POINTS;

        BigDecimal weighted = totalWeight > 0
            ? BigDecimal.valueOf(weightedSum / totalWeight * 100).setScale(2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        return new ScoreResult(correct, incorrect, skipped, raw, max, weighted);
    }
}
