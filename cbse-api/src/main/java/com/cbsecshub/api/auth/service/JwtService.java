package com.cbsecshub.api.auth.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.access-expiry-seconds:900}")
    private long accessExpirySeconds;

    @Value("${app.jwt.refresh-expiry-seconds:604800}")
    private long refreshExpirySeconds;

    private SecretKey signingKey;

    @PostConstruct
    void init() {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException(
                "JWT_SECRET must be at least 32 characters. " +
                "Set the JWT_SECRET environment variable.");
        }
        byte[] keyBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(secret.getBytes())
        );
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(com.cbsecshub.api.user.entity.User user) {
        return buildToken(user, accessExpirySeconds, "access");
    }

    public String generateRefreshToken(com.cbsecshub.api.user.entity.User user) {
        return buildToken(user, refreshExpirySeconds, "refresh");
    }

    private String buildToken(com.cbsecshub.api.user.entity.User user, long ttlSeconds, String tokenType) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(user.getId().toString())
            .claims(Map.of(
                "email", user.getEmail(),
                "role",  user.getRole().name(),
                "type",  tokenType
            ))
            .id(UUID.randomUUID().toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(ttlSeconds)))
            .signWith(signingKey)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    public String extractSubject(String token) {
        return parseToken(token).getPayload().getSubject();
    }

    public String extractJti(String token) {
        return parseToken(token).getPayload().getId();
    }

    public String extractRole(String token) {
        return parseToken(token).getPayload().get("role", String.class);
    }

    public Instant extractExpiry(String token) {
        return parseToken(token).getPayload().getExpiration().toInstant();
    }

    private Jws<Claims> parseToken(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token);
    }
}
