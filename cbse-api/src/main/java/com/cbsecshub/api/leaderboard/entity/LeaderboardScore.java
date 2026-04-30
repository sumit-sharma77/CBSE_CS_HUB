package com.cbsecshub.api.leaderboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "leaderboard_scores")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LeaderboardScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 20)
    private String scope;

    @Column(name = "scope_key", nullable = false, length = 100)
    private String scopeKey;

    @Column(name = "cumulative_score", nullable = false)
    private Long cumulativeScore = 0L;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist @PreUpdate
    void preUpdate() { updatedAt = Instant.now(); }
}
