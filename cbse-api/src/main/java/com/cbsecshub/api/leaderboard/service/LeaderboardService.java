package com.cbsecshub.api.leaderboard.service;

import com.cbsecshub.api.leaderboard.dto.LeaderboardEntryDTO;
import com.cbsecshub.api.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LeaderboardService {

    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    private static final String GLOBAL_KEY  = "lb:global:alltime";
    private static final ZoneId IST          = ZoneId.of("Asia/Kolkata");

    public void recordAttempt(UUID userId, String topicIdsJson, int rawScore) {
        if (rawScore <= 0) return;
        String memberId = userId.toString();
        double score = rawScore;
        try {
            // Update global leaderboard
            redisTemplate.opsForZSet().incrementScore(GLOBAL_KEY, memberId, score);

            // Update weekly leaderboard
            String weekKey = weeklyKey();
            redisTemplate.opsForZSet().incrementScore(weekKey, memberId, score);

            // Update per-topic leaderboards
            List<Long> topicIds = objectMapper.readValue(topicIdsJson, new TypeReference<>() {});
            for (Long topicId : topicIds) {
                String topicKey = "lb:topic:" + topicId + ":alltime";
                redisTemplate.opsForZSet().incrementScore(topicKey, memberId, score);
            }

            // Push update to WebSocket subscribers
            pushUpdate(memberId);
        } catch (Exception e) {
            log.debug("Leaderboard Redis unavailable, skipping update: {}", e.getMessage());
        }
    }

    public List<LeaderboardEntryDTO> getGlobalTop10() {
        return getTop10(GLOBAL_KEY);
    }

    public List<LeaderboardEntryDTO> getWeeklyTop10() {
        return getTop10(weeklyKey());
    }

    public List<LeaderboardEntryDTO> getTopicTop10(Long topicId) {
        return getTop10("lb:topic:" + topicId + ":alltime");
    }

    public Long getGlobalRank(UUID userId) {
        try {
            Long rank = redisTemplate.opsForZSet().reverseRank(GLOBAL_KEY, userId.toString());
            return rank != null ? rank + 1 : null;
        } catch (Exception e) {
            log.debug("Leaderboard Redis unavailable for rank lookup: {}", e.getMessage());
            return null;
        }
    }

    public Long getWeeklyRank(UUID userId) {
        try {
            Long rank = redisTemplate.opsForZSet().reverseRank(weeklyKey(), userId.toString());
            return rank != null ? rank + 1 : null;
        } catch (Exception e) {
            log.debug("Leaderboard Redis unavailable for weekly rank: {}", e.getMessage());
            return null;
        }
    }

    public Double getGlobalScore(UUID userId) {
        try {
            return redisTemplate.opsForZSet().score(GLOBAL_KEY, userId.toString());
        } catch (Exception e) {
            log.debug("Leaderboard Redis unavailable for score lookup: {}", e.getMessage());
            return null;
        }
    }

    /** Resets the weekly leaderboard every Monday at 00:00 IST (18:30 UTC Sunday) */
    @Scheduled(cron = "0 30 18 * * SUN", zone = "UTC")
    public void resetWeeklyLeaderboard() {
        try {
            String previousWeekKey = weeklyKey(ZonedDateTime.now(IST).minusWeeks(1));
            redisTemplate.delete(previousWeekKey);
            log.info("Leaderboard weekly reset complete, cleared key: {}", previousWeekKey);
        } catch (Exception e) {
            log.debug("Leaderboard weekly reset skipped (Redis unavailable): {}", e.getMessage());
        }
    }

    private void pushUpdate(String userId) {
        try {
            messagingTemplate.convertAndSend("/topic/leaderboard", Map.of("userId", userId, "updated", true));
        } catch (Exception e) {
            log.debug("WebSocket push failed: {}", e.getMessage());
        }
    }

    private List<LeaderboardEntryDTO> getTop10(String key) {
        try {
            Set<ZSetOperations.TypedTuple<String>> tuples =
                redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, 9);
            if (tuples == null) return List.of();

            List<LeaderboardEntryDTO> result = new ArrayList<>();
            int rank = 1;
            for (ZSetOperations.TypedTuple<String> tuple : tuples) {
                UUID userId = UUID.fromString(Objects.requireNonNull(tuple.getValue()));
                String displayName = userRepository.findById(userId)
                    .map(u -> u.getDisplayName() != null ? u.getDisplayName() : "Anonymous")
                    .orElse("Anonymous");
                result.add(new LeaderboardEntryDTO(rank, userId, displayName,
                    tuple.getScore() != null ? tuple.getScore().longValue() : 0));
                rank++;
            }
            return result;
        } catch (Exception e) {
            log.debug("Leaderboard Redis unavailable, returning empty: {}", e.getMessage());
            return List.of();
        }
    }

    private String weeklyKey() {
        return weeklyKey(ZonedDateTime.now(IST));
    }

    private String weeklyKey(ZonedDateTime zdt) {
        int year = zdt.getYear();
        int week = zdt.get(WeekFields.ISO.weekOfWeekBasedYear());
        return "lb:global:week:" + year + "-" + String.format("%02d", week);
    }
}
