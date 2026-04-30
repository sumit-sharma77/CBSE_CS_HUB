package com.cbsecshub.api.auth.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank @Size(max = 100)
    String displayName,

    @NotBlank @Email @Size(max = 255)
    String email,

    @NotBlank @Size(min = 8, max = 100)
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d).+$",
        message = "Password must contain at least one uppercase letter and one digit"
    )
    String password
) {}
