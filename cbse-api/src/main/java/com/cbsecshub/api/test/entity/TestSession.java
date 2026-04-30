package com.cbsecshub.api.test.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "test_sessions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TestSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "topic_ids", nullable = false, columnDefinition = "jsonb")
    private String topicIdsJson;

    @Column(name = "question_ids", nullable = false, columnDefinition = "jsonb")
    private String questionIdsJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Mode mode;

    @Column(name = "question_count", nullable = false)
    private Integer questionCount;

    @Column(name = "time_limit_seconds", nullable = false)
    private Integer timeLimitSeconds;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.IN_PROGRESS;

    @Column(columnDefinition = "jsonb")
    private String answersJson;

    @PrePersist
    void prePersist() {
        if (startedAt == null) startedAt = Instant.now();
    }

    public enum Mode { QUICK, STANDARD, FULL }
    public enum Status { IN_PROGRESS, SUBMITTED, EXPIRED }
}
