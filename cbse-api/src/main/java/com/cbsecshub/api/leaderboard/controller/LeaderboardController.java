package com.cbsecshub.api.leaderboard.controller;

import com.cbsecshub.api.leaderboard.dto.LeaderboardEntryDTO;
import com.cbsecshub.api.leaderboard.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/global")
    public Map<String, Object> getGlobal(@AuthenticationPrincipal UUID userId) {
        List<LeaderboardEntryDTO> top10 = leaderboardService.getGlobalTop10();
        Long rank = leaderboardService.getGlobalRank(userId);
        Double score = leaderboardService.getGlobalScore(userId);
        return Map.of("top10", top10, "myRank", rank != null ? rank : -1, "myScore", score != null ? score : 0);
    }

    @GetMapping("/weekly")
    public Map<String, Object> getWeekly(@AuthenticationPrincipal UUID userId) {
        List<LeaderboardEntryDTO> top10 = leaderboardService.getWeeklyTop10();
        Long rank = leaderboardService.getWeeklyRank(userId);
        return Map.of("top10", top10, "myRank", rank != null ? rank : -1);
    }

    @GetMapping("/topic/{topicId}")
    public List<LeaderboardEntryDTO> getTopic(@PathVariable Long topicId) {
        return leaderboardService.getTopicTop10(topicId);
    }
}
