package com.cbsecshub.api.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserRoleRequest(@NotBlank String role) {}
