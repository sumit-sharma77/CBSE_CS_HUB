package com.cbsecshub.api.badge.repository;

import com.cbsecshub.api.badge.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByUserId(UUID userId);
    boolean existsByUserIdAndBadgeType(UUID userId, Badge.BadgeType badgeType);
}
