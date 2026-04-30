package com.cbsecshub.api.user.controller;

import com.cbsecshub.api.badge.entity.Badge;
import com.cbsecshub.api.badge.repository.BadgeRepository;
import com.cbsecshub.api.leaderboard.service.LeaderboardService;
import com.cbsecshub.api.test.repository.TestAttemptRepository;
import com.cbsecshub.api.user.dto.UserDTO;
import com.cbsecshub.api.user.entity.User;
import com.cbsecshub.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final TestAttemptRepository attemptRepository;
    private final BadgeRepository badgeRepository;
    private final LeaderboardService leaderboardService;

    @GetMapping("/me")
    public UserDTO getMe(@AuthenticationPrincipal UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return UserDTO.from(user);
    }

    @GetMapping("/me/progress")
    public Map<String, Object> getProgress(@AuthenticationPrincipal UUID userId) {
        long testsTaken = attemptRepository.countByUserId(userId);
        Long globalRank = leaderboardService.getGlobalRank(userId);
        Double globalScore = leaderboardService.getGlobalScore(userId);
        List<Badge> badges = badgeRepository.findByUserId(userId);
        return Map.of(
            "testsTaken",  testsTaken,
            "globalRank",  globalRank != null ? globalRank : -1,
            "globalScore", globalScore != null ? globalScore.longValue() : 0,
            "badgeCount",  badges.size(),
            "badges",      badges.stream().map(b -> b.getBadgeType().name()).toList()
        );
    }
}
