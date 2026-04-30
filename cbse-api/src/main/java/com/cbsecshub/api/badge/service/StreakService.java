package com.cbsecshub.api.badge.service;

import com.cbsecshub.api.badge.entity.Badge;
import com.cbsecshub.api.badge.repository.BadgeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class StreakService {

    private final StringRedisTemplate redisTemplate;
    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");
    private static final String KEY_LAST  = "streak:last:";
    private static final String KEY_COUNT = "streak:count:";
    private static final Duration EXPIRY   = Duration.ofDays(3);

    /**
     * Records a practice day and returns current streak count.
     */
    public int recordAndGet(UUID userId) {
        try {
            String today = LocalDate.now(IST).toString();
            String lastKey  = KEY_LAST  + userId;
            String countKey = KEY_COUNT + userId;

            String lastDay = redisTemplate.opsForValue().get(lastKey);

            if (today.equals(lastDay)) {
                // Already recorded today
                String c = redisTemplate.opsForValue().get(countKey);
                return c != null ? Integer.parseInt(c) : 1;
            }

            String yesterday = LocalDate.now(IST).minusDays(1).toString();
            int newCount;
            if (yesterday.equals(lastDay)) {
                // Extending streak
                String c = redisTemplate.opsForValue().get(countKey);
                newCount = (c != null ? Integer.parseInt(c) : 0) + 1;
            } else {
                // Streak broken
                newCount = 1;
            }

            redisTemplate.opsForValue().set(lastKey,  today,           EXPIRY);
            redisTemplate.opsForValue().set(countKey, String.valueOf(newCount), EXPIRY);
            return newCount;
        } catch (Exception e) {
            log.debug("Streak Redis unavailable, returning 0: {}", e.getMessage());
            return 0;
        }
    }
}
