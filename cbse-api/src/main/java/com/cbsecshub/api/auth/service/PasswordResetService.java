package com.cbsecshub.api.auth.service;

import com.cbsecshub.api.auth.entity.PasswordResetToken;
import com.cbsecshub.api.auth.repository.PasswordResetTokenRepository;
import com.cbsecshub.api.user.entity.User;
import com.cbsecshub.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${SMTP_USER:noreply@cbsecshub.com}")
    private String fromAddress;

    @Value("${app.cors.origins:http://localhost:4200}")
    private String frontendOrigin;

    @Transactional
    public void requestReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Silently no-op — never disclose whether email exists
            log.debug("Password reset requested for unknown email");
            return;
        }
        User user = userOpt.get();

        // Generate 32 random bytes as raw token
        byte[] rawBytes = new byte[32];
        new SecureRandom().nextBytes(rawBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(rawBytes);
        String tokenHash = sha256Hex(rawToken);

        PasswordResetToken resetToken = PasswordResetToken.builder()
            .userId(user.getId())
            .tokenHash(tokenHash)
            .expiresAt(Instant.now().plus(1, ChronoUnit.HOURS))
            .used(false)
            .build();
        tokenRepository.save(resetToken);

        String resetUrl = frontendOrigin.split(",")[0].trim() + "/reset-password?token=" + rawToken;
        sendResetEmail(user.getEmail(), resetUrl);
    }

    @Transactional
    public void confirmReset(String rawToken, String newPassword) {
        String tokenHash = sha256Hex(rawToken);
        PasswordResetToken token = tokenRepository.findByTokenHashAndUsedFalse(tokenHash)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        User user = userRepository.findById(token.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
        log.info("AUTH_EVENT password_reset userId={}", user.getId());
    }

    private void sendResetEmail(String to, String resetUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject("Reset your CBSE CS Hub password");
            message.setText(
                "You requested a password reset.\n\n" +
                "Click the link below to set a new password (valid for 1 hour):\n" +
                resetUrl + "\n\n" +
                "If you did not request this, you can safely ignore this email.\n"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
            // Don't re-throw — the token is saved; email failure is non-fatal
        }
    }

    private String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
