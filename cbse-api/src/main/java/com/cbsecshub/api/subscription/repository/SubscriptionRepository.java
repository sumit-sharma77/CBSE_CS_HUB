package com.cbsecshub.api.subscription.repository;

import com.cbsecshub.api.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    Optional<Subscription> findByUserId(UUID userId);

    Optional<Subscription> findByRazorpaySubscriptionId(String razorpaySubscriptionId);

    @Query("SELECT s FROM Subscription s WHERE s.userId = :userId AND s.status IN ('ACTIVE', 'GRACE_PERIOD')")
    Optional<Subscription> findActiveByUserId(@Param("userId") UUID userId);
}
