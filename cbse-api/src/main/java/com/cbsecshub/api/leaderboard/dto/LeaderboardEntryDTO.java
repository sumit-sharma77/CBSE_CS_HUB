package com.cbsecshub.api.leaderboard.dto;

import java.util.UUID;

public record LeaderboardEntryDTO(
    int rank,
    UUID userId,
    String displayName,
    long cumulativeScore
) {}
