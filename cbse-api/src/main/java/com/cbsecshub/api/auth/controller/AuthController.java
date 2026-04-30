package com.cbsecshub.api.auth.controller;

import com.cbsecshub.api.auth.dto.*;
import com.cbsecshub.api.auth.service.AuthService;
import com.cbsecshub.api.auth.service.CookieService;
import com.cbsecshub.api.auth.service.PasswordResetService;
import com.cbsecshub.api.auth.service.TokenPair;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest body) {
        TokenPair tokens = authService.register(body);
        return buildTokenResponse(tokens, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest body) {
        TokenPair tokens = authService.login(body);
        return buildTokenResponse(tokens, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {
        authService.logout(refreshToken);
        HttpHeaders headers = new HttpHeaders();
        cookieService.clearCookies().forEach(c ->
            headers.add(HttpHeaders.SET_COOKIE, c.toString()));
        return ResponseEntity.ok().headers(headers).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {
        TokenPair tokens = authService.refresh(refreshToken);
        return buildTokenResponse(tokens, HttpStatus.OK);
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<Void> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequestDto body) {
        // Always returns 200 — never discloses whether email exists
        passwordResetService.requestReset(body.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/password-reset-confirm")
    public ResponseEntity<Void> confirmPasswordReset(
            @Valid @RequestBody PasswordResetConfirmDto body) {
        passwordResetService.confirmReset(body.token(), body.newPassword());
        return ResponseEntity.ok().build();
    }

    private ResponseEntity<Void> buildTokenResponse(TokenPair tokens, HttpStatus status) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE,
            cookieService.createAccessCookie(tokens.accessToken()).toString());
        headers.add(HttpHeaders.SET_COOKIE,
            cookieService.createRefreshCookie(tokens.refreshToken()).toString());
        return ResponseEntity.status(status).headers(headers).build();
    }
}
