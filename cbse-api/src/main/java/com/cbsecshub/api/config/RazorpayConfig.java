package com.cbsecshub.api.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${app.razorpay.key-id:}")
    private String keyId;

    @Value("${app.razorpay.key-secret:}")
    private String keySecret;

    @PostConstruct
    void validate() {
        // Warn rather than fail — allows local dev without Razorpay keys
        if (keyId.isBlank() || keySecret.isBlank()) {
            org.slf4j.LoggerFactory.getLogger(RazorpayConfig.class)
                .warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set — payment features will be unavailable");
        }
    }

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        if (keyId.isBlank() || keySecret.isBlank()) {
            // Return a dummy client that throws on use; avoids startup failure in dev
            return new RazorpayClient("rzp_test_placeholder", "placeholder_secret");
        }
        return new RazorpayClient(keyId, keySecret);
    }
}
