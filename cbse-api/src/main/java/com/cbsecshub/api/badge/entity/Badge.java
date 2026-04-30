package com.cbsecshub.api.badge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "badges",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "badge_type"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "badge_type", nullable = false, length = 50)
    private BadgeType badgeType;

    @Column(name = "awarded_at", nullable = false, updatable = false)
    private Instant awardedAt;

    @PrePersist
    void prePersist() {
        if (awardedAt == null) awardedAt = Instant.now();
    }

    public enum BadgeType {
        FIRST_TEST,
        STREAK_3, STREAK_7, STREAK_30,
        PERFECT_SCORE,
        TOP_10_GLOBAL,
        TOP_3_GLOBAL,
        TEST_100, TEST_500
    }
}
