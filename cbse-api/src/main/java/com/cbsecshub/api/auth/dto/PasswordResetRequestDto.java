package com.cbsecshub.api.auth.dto;

import jakarta.validation.constraints.*;

public record PasswordResetRequestDto(
    @NotBlank @Email @Size(max = 255)
    String email
) {}
