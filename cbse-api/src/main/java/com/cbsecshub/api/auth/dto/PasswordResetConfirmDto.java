package com.cbsecshub.api.auth.dto;

import jakarta.validation.constraints.*;

public record PasswordResetConfirmDto(
    @NotBlank
    String token,

    @NotBlank @Size(min = 8, max = 100)
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d).+$",
        message = "Password must contain at least one uppercase letter and one digit"
    )
    String newPassword
) {}
