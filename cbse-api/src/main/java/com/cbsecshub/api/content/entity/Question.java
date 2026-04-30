package com.cbsecshub.api.content.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "questions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "options", nullable = false, columnDefinition = "jsonb")
    private String optionsJson;

    @Column(name = "correct_option_id", nullable = false, length = 10)
    private String correctOptionId;

    @Column(name = "difficulty_weight", nullable = false)
    private Integer difficultyWeight = 1;

    @Column(name = "source_file", length = 255)
    private String sourceFile;

    @Column(name = "local_id", length = 100)
    private String localId;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (difficultyWeight == null) difficultyWeight = 1;
    }
}
