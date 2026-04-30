package com.cbsecshub.api.subscription.service;

public record EntitlementResult(boolean allowed, Integer questionsLimit, String reason) {}
