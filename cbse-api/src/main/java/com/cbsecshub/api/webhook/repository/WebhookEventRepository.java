package com.cbsecshub.api.webhook.repository;

import com.cbsecshub.api.webhook.entity.WebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {
    Optional<WebhookEvent> findByRazorpayEventId(String razorpayEventId);
}
