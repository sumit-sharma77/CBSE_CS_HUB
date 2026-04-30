package com.cbsecshub.api.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Maintains a Redis-backed blocklist for invalidated JWT JTI values.
 * Key format: blocklist:{jti}
 * Falls back gracefully when Redis is unavailable (local/dev profile).
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class TokenBlocklistService {

    private final StringRedisTemplate redisTemplate;
    private static final String PREFIX = "blocklist:";

    public void blockToken(String jti, long ttlSeconds) {
        try {
            redisTemplate.opsForValue().set(PREFIX + jti, "1", Duration.ofSeconds(ttlSeconds));
        } catch (Exception e) {
            log.debug("TokenBlocklist Redis unavailable, token blocklist skipped: {}", e.getMessage());
        }
    }

    public boolean isBlocked(String jti) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + jti));
        } catch (Exception e) {
            log.debug("TokenBlocklist Redis unavailable, treating token as not blocked: {}", e.getMessage());
            return false; // fail-open: allow token in local dev
        }
    }
}
