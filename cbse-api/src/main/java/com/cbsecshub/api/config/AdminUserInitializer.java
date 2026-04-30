package com.cbsecshub.api.config;

import com.cbsecshub.api.subscription.service.SubscriptionService;
import com.cbsecshub.api.user.entity.User;
import com.cbsecshub.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates a default admin user on first boot if none exists.
 * Password is controlled by ADMIN_PASSWORD env var (default: Admin@1234).
 * Change it in production.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class AdminUserInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionService subscriptionService;

    @Value("${app.admin.email:admin@cbsecshub.local}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@1234}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByEmail(adminEmail)) {
            return; // already seeded
        }
        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setDisplayName("Admin");
        admin.setRole(User.Role.ADMIN);
        admin.setEmailVerified(true);
        userRepository.save(admin);
        subscriptionService.createFreeSubscription(admin.getId());
        log.info("Admin user created: {}", adminEmail);
    }
}
