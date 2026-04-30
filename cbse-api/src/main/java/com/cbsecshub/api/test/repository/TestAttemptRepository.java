package com.cbsecshub.api.test.repository;

import com.cbsecshub.api.test.entity.TestAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, UUID> {

    boolean existsBySessionId(UUID sessionId);

    Optional<TestAttempt> findBySessionId(UUID sessionId);

    Page<TestAttempt> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    long countByUserId(UUID userId);

    @Query("""
        SELECT COUNT(a) FROM TestAttempt a
        WHERE a.topicIdsJson = :topicIds
          AND a.mode = :mode
          AND a.createdAt >= :since
          AND a.rawScore <= :rawScore
        """)
    long countScoresBelow(
        @Param("topicIds") String topicIds,
        @Param("mode") String mode,
        @Param("since") Instant since,
        @Param("rawScore") int rawScore
    );

    @Query("""
        SELECT COUNT(a) FROM TestAttempt a
        WHERE a.topicIdsJson = :topicIds
          AND a.mode = :mode
          AND a.createdAt >= :since
        """)
    long countTotal(
        @Param("topicIds") String topicIds,
        @Param("mode") String mode,
        @Param("since") Instant since
    );
}
