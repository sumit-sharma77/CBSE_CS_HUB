package com.cbsecshub.api.subscription.controller;

import com.cbsecshub.api.subscription.service.EntitlementResult;
import com.cbsecshub.api.subscription.service.EntitlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/entitlement")
@RequiredArgsConstructor
public class EntitlementController {

    private final EntitlementService entitlementService;

    @GetMapping("/check")
    public EntitlementResult check(
            @AuthenticationPrincipal UUID userId,
            @RequestParam("topic") Long topicId) {
        return entitlementService.checkAccess(userId, topicId);
    }
}
