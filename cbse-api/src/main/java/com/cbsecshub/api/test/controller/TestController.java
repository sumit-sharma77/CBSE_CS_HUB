package com.cbsecshub.api.test.controller;

import com.cbsecshub.api.test.dto.*;
import com.cbsecshub.api.test.entity.TestAttempt;
import com.cbsecshub.api.test.service.TestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createSession(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody CreateTestSessionRequest body) {
        return testService.createSession(userId, body);
    }

    @GetMapping("/sessions/{sessionId}")
    public Map<String, Object> getSession(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID sessionId) {
        return testService.getSession(userId, sessionId);
    }

    @PostMapping("/sessions/{sessionId}/submit")
    public TestResultDTO submit(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID sessionId,
            @RequestBody SubmitTestRequest body) {
        return testService.submitTest(userId, sessionId, body);
    }

    @GetMapping("/sessions/{sessionId}/result")
    public TestResultDTO getResult(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID sessionId) {
        return testService.getResult(userId, sessionId);
    }

    @GetMapping("/history")
    public Page<TestAttempt> getHistory(
            @AuthenticationPrincipal UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return testService.getHistory(userId, PageRequest.of(page, size));
    }
}
