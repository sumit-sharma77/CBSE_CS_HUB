package com.cbsecshub.api.auth.service;

import com.cbsecshub.api.auth.dto.LoginRequest;
import com.cbsecshub.api.auth.dto.RegisterRequest;
import com.cbsecshub.api.subscription.service.SubscriptionService;
import com.cbsecshub.api.user.entity.User;
import com.cbsecshub.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlocklistService tokenBlocklistService;
    private final AuthenticationManager authenticationManager;
    private final SubscriptionService subscriptionService;

    @Value("${app.user.retention-days:1095}")
    private long retentionDays;

    @Transactional
    public TokenPair register(RegisterRequest dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User user = User.builder()
            .email(dto.email())
            .passwordHash(passwordEncoder.encode(dto.password()))
            .displayName(dto.displayName())
            .role(User.Role.STUDENT)
            .emailVerified(false)
            .scheduledPurgeAt(Instant.now().plus(retentionDays, ChronoUnit.DAYS))
            .build();
        user = userRepository.save(user);
        subscriptionService.createFreeSubscription(user.getId());
        log.info("AUTH_EVENT register userId={}", user.getId());
        return issueTokenPair(user);
    }

    @Transactional
    public TokenPair login(LoginRequest dto) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );
        User user = userRepository.findByEmail(dto.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Instant now = Instant.now();
        user.setLastLoginAt(now);
        user.setScheduledPurgeAt(now.plus(retentionDays, ChronoUnit.DAYS));
        userRepository.save(user);
        log.info("AUTH_EVENT login userId={}", user.getId());
        return issueTokenPair(user);
    }

    public void logout(String refreshToken) {
        if (refreshToken != null && jwtService.validateToken(refreshToken)) {
            String jti = jwtService.extractJti(refreshToken);
            long ttl = jwtService.extractExpiry(refreshToken)
                .minusSeconds(Instant.now().getEpochSecond()).getEpochSecond();
            tokenBlocklistService.blockToken(jti, Math.max(ttl, 1));
        }
        log.info("AUTH_EVENT logout");
    }

    public TokenPair refresh(String refreshToken) {
        if (refreshToken == null || !jwtService.validateToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }
        String jti = jwtService.extractJti(refreshToken);
        if (tokenBlocklistService.isBlocked(jti)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token revoked");
        }
        // Block the old refresh token
        long ttl = jwtService.extractExpiry(refreshToken)
            .minusSeconds(Instant.now().getEpochSecond()).getEpochSecond();
        tokenBlocklistService.blockToken(jti, Math.max(ttl, 1));

        String userId = jwtService.extractSubject(refreshToken);
        User user = userRepository.findById(java.util.UUID.fromString(userId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return issueTokenPair(user);
    }

    private TokenPair issueTokenPair(User user) {
        return new TokenPair(
            jwtService.generateAccessToken(user),
            jwtService.generateRefreshToken(user)
        );
    }
}
