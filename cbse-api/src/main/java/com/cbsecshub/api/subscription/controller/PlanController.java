package com.cbsecshub.api.subscription.controller;

import com.cbsecshub.api.subscription.dto.PlanDTO;
import com.cbsecshub.api.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plans")
@RequiredArgsConstructor
public class PlanController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public List<PlanDTO> getPlans() {
        return subscriptionService.getAllPlans();
    }
}
