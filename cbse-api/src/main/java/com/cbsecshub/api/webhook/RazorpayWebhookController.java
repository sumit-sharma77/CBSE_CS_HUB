package com.cbsecshub.api.webhook;

import com.razorpay.Utils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/v1/webhooks")
@Slf4j
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final WebhookService webhookService;

    @Value("${app.razorpay.webhook-secret:}")
    private String webhookSecret;

    @PostMapping("/razorpay")
    public ResponseEntity<Void> handleWebhook(
            HttpServletRequest request,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestHeader(value = "X-Razorpay-Event-Id", required = false) String eventId) {

        String payload = readBody(request);

        // Verify signature
        if (!verifySignature(payload, signature)) {
            log.warn("WEBHOOK invalid signature — rejected");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid webhook signature");
        }

        // Parse event type
        String eventType;
        String razorpayEventId = eventId != null ? eventId : java.util.UUID.randomUUID().toString();
        try {
            org.json.JSONObject body = new org.json.JSONObject(payload);
            eventType = body.optString("event", "unknown");
            if (razorpayEventId.isBlank()) {
                razorpayEventId = body.optString("id", java.util.UUID.randomUUID().toString());
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payload");
        }

        log.info("WEBHOOK received event={} id={}", eventType, razorpayEventId);
        webhookService.handle(payload, eventType, razorpayEventId);
        return ResponseEntity.ok().build();
    }

    private boolean verifySignature(String payload, String signature) {
        if (webhookSecret.isBlank()) {
            // Allow unsigned in local dev when secret not configured
            log.warn("RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification (dev only)");
            return true;
        }
        if (signature == null || signature.isBlank()) return false;
        try {
            return Utils.verifyWebhookSignature(payload, signature, webhookSecret);
        } catch (Exception e) {
            log.warn("Webhook signature verification error: {}", e.getMessage());
            return false;
        }
    }

    private String readBody(HttpServletRequest request) {
        try {
            return new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot read request body");
        }
    }
}
