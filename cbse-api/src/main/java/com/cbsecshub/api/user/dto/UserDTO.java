package com.cbsecshub.api.user.dto;

import com.cbsecshub.api.user.entity.User;

import java.util.UUID;

public record UserDTO(
    UUID id,
    String email,
    String displayName,
    String avatarUrl,
    String role,
    boolean emailVerified
) {
    public static UserDTO from(User user) {
        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getDisplayName(),
            user.getAvatarUrl(),
            user.getRole().name(),
            user.isEmailVerified()
        );
    }
}
