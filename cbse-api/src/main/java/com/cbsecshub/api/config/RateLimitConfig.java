package com.cbsecshub.api.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory rate limiter backed by Bucket4j.
 * Works for single-instance deployments without Redis.
 * For multi-instance deployments, replace with a Redis-backed ProxyManager.
 */
@Component
public class RateLimitConfig {

    private final ConcurrentHashMap<String, Bucket> store = new ConcurrentHashMap<>();

    /** 5 login attempts per IP per 15 minutes */
    public Bucket loginBucket(String ip) {
        return store.computeIfAbsent("rl:login:" + ip, k ->
            Bucket.builder()
                .addLimit(Bandwidth.simple(5, Duration.ofMinutes(15)))
                .build());
    }

    /** 10 registration attempts per IP per hour */
    public Bucket registerBucket(String ip) {
        return store.computeIfAbsent("rl:register:" + ip, k ->
            Bucket.builder()
                .addLimit(Bandwidth.simple(10, Duration.ofHours(1)))
                .build());
    }
}

