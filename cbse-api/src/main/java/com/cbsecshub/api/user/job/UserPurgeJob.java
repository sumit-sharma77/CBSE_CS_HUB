package com.cbsecshub.api.user.job;

import com.cbsecshub.api.user.entity.User;
import com.cbsecshub.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserPurgeJob {

    private final UserRepository userRepository;

    /**
     * Runs daily at 02:00 IST (20:30 UTC previous day).
     * Deletes users whose scheduled_purge_at <= now and have no active/grace-period subscription.
     */
    @Scheduled(cron = "0 30 20 * * ?", zone = "UTC")
    @Transactional
    public void purgeInactiveUsers() {
        List<User> eligible = userRepository.findPurgeEligible(Instant.now());
        if (eligible.isEmpty()) {
            log.info("UserPurgeJob: no users eligible for purge");
            return;
        }
        log.info("UserPurgeJob: purging {} user(s)", eligible.size());
        for (User user : eligible) {
            log.info("UserPurgeJob: purging userId={}", user.getId()); // no email/PII logged
        }
        userRepository.deleteAll(eligible);
        log.info("UserPurgeJob: purge complete");
    }
}
