package com.cbsecshub.api.test.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "test_attempts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "session_id", nullable = false, unique = true)
    private UUID sessionId;

    @Column(name = "topic_ids", columnDefinition = "jsonb")
    private String topicIdsJson;

    @Column(length = 20)
    private String mode;

    @Column(name = "question_count")
    private Integer questionCount;

    @Column(name = "correct_count")
    private Integer correctCount = 0;

    @Column(name = "incorrect_count")
    private Integer incorrectCount = 0;

    @Column(name = "skipped_count")
    private Integer skippedCount = 0;

    @Column(name = "raw_score")
    private Integer rawScore = 0;

    @Column(name = "max_score")
    private Integer maxScore = 0;

    @Column(name = "weighted_score", precision = 6, scale = 2)
    private BigDecimal weightedScore = BigDecimal.ZERO;

    @Column(name = "percentile_rank", precision = 5, scale = 2)
    private BigDecimal percentileRank;

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
