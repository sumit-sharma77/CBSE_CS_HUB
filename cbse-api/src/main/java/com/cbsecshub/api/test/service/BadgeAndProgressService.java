package com.cbsecshub.api.test.service;

import com.cbsecshub.api.badge.entity.Badge;
import com.cbsecshub.api.badge.repository.BadgeRepository;
import com.cbsecshub.api.badge.service.StreakService;
import com.cbsecshub.api.leaderboard.service.LeaderboardService;
import com.cbsecshub.api.test.entity.TestAttempt;
import com.cbsecshub.api.test.repository.TestAttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class BadgeAndProgressService {

    private final BadgeRepository badgeRepository;
    private final StreakService streakService;
    private final LeaderboardService leaderboardService;
    private final TestAttemptRepository attemptRepository;

    public void processAttempt(UUID userId, TestAttempt attempt) {
        awardIfAbsent(userId, Badge.BadgeType.FIRST_TEST);

        // Perfect score badge
        if (attempt.getRawScore() != null && attempt.getMaxScore() != null
                && attempt.getMaxScore() > 0
                && attempt.getRawScore().equals(attempt.getMaxScore())) {
            awardIfAbsent(userId, Badge.BadgeType.PERFECT_SCORE);
        }

        // Streak badges
        int streak = streakService.recordAndGet(userId);
        if (streak >= 3)  awardIfAbsent(userId, Badge.BadgeType.STREAK_3);
        if (streak >= 7)  awardIfAbsent(userId, Badge.BadgeType.STREAK_7);
        if (streak >= 30) awardIfAbsent(userId, Badge.BadgeType.STREAK_30);

        // Volume badges
        long total = attemptRepository.countByUserId(userId);
        if (total >= 100)  awardIfAbsent(userId, Badge.BadgeType.TEST_100);
        if (total >= 500)  awardIfAbsent(userId, Badge.BadgeType.TEST_500);

        // Leaderboard badges
        Long globalRank = leaderboardService.getGlobalRank(userId);
        if (globalRank != null && globalRank <= 3)  awardIfAbsent(userId, Badge.BadgeType.TOP_3_GLOBAL);
        else if (globalRank != null && globalRank <= 10) awardIfAbsent(userId, Badge.BadgeType.TOP_10_GLOBAL);
    }

    private void awardIfAbsent(UUID userId, Badge.BadgeType type) {
        if (!badgeRepository.existsByUserIdAndBadgeType(userId, type)) {
            badgeRepository.save(Badge.builder().userId(userId).badgeType(type).build());
            log.info("Badge awarded: {} to user {}", type, userId);
        }
    }
}
