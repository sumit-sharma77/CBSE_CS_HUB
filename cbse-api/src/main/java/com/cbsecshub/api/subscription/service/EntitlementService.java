package com.cbsecshub.api.subscription.service;

import com.cbsecshub.api.subscription.entity.Subscription;
import com.cbsecshub.api.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EntitlementService {

    private final SubscriptionRepository subscriptionRepository;
    private final StringRedisTemplate redisTemplate;

    private static final int FREE_DAILY_LIMIT = 10;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    public EntitlementResult checkAccess(UUID userId, Long topicId) {
        Subscription sub = subscriptionRepository.findByUserId(userId).orElse(null);
        if (sub == null) {
            return new EntitlementResult(false, 0, "No subscription found");
        }

        boolean isPaid = sub.getStatus() == Subscription.Status.ACTIVE
                      || sub.getStatus() == Subscription.Status.GRACE_PERIOD;

        if (isPaid) {
            return new EntitlementResult(true, null, "paid");
        }

        // Free user: check daily limit
        String today = LocalDate.now(IST).format(DATE_FMT);
        String key = "limit:" + userId + ":" + today + ":" + topicId;

        Long count = redisTemplate.opsForValue().increment(key);
        if (count == 1) {
            // Set TTL to midnight UTC+5:30 (IST)
            ZonedDateTime midnight = LocalDate.now(IST).plusDays(1).atStartOfDay(IST);
            long ttlSeconds = midnight.toEpochSecond() - Instant.now().getEpochSecond();
            redisTemplate.expire(key, Duration.ofSeconds(ttlSeconds));
        }

        if (count != null && count > FREE_DAILY_LIMIT) {
            return new EntitlementResult(false, FREE_DAILY_LIMIT,
                "Daily limit of " + FREE_DAILY_LIMIT + " questions per topic reached");
        }

        return new EntitlementResult(true, FREE_DAILY_LIMIT, "free");
    }
}
