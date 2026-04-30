package com.cbsecshub.api.auth.service;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.Duration;
import java.util.List;

@Service
public class CookieService {

    @Value("${app.jwt.access-expiry-seconds:900}")
    private long accessExpirySeconds;

    @Value("${app.jwt.refresh-expiry-seconds:604800}")
    private long refreshExpirySeconds;

    public ResponseCookie createAccessCookie(String token) {
        return ResponseCookie.from("access_token", token)
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/api")
            .maxAge(Duration.ofSeconds(accessExpirySeconds))
            .build();
    }

    public ResponseCookie createRefreshCookie(String token) {
        return ResponseCookie.from("refresh_token", token)
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/api/v1/auth/refresh")
            .maxAge(Duration.ofSeconds(refreshExpirySeconds))
            .build();
    }

    public List<ResponseCookie> clearCookies() {
        ResponseCookie clearAccess = ResponseCookie.from("access_token", "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/api")
            .maxAge(Duration.ZERO)
            .build();

        ResponseCookie clearRefresh = ResponseCookie.from("refresh_token", "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/api/v1/auth/refresh")
            .maxAge(Duration.ZERO)
            .build();

        return List.of(clearAccess, clearRefresh);
    }
}
