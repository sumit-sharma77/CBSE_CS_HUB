package com.cbsecshub.api.user.repository;

import com.cbsecshub.api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    /**
     * Finds users eligible for purge: lastLoginAt before cutoff
     * AND they do NOT have an ACTIVE or GRACE_PERIOD subscription.
     */
    @Query("""
        SELECT u FROM User u
        WHERE u.scheduledPurgeAt < :now
          AND NOT EXISTS (
            SELECT 1 FROM Subscription s
            WHERE s.userId = u.id
              AND s.status IN ('ACTIVE', 'GRACE_PERIOD')
          )
        """)
    List<User> findPurgeEligible(@Param("now") Instant now);
}
