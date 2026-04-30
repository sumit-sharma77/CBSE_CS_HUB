package com.cbsecshub.api;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Container
    @SuppressWarnings("resource")
    static final GenericContainer<?> redis =
        new GenericContainer<>("redis:7-alpine").withExposedPorts(6379);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url",      postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.data.redis.url",
            () -> "redis://" + redis.getHost() + ":" + redis.getMappedPort(6379));
        registry.add("app.jwt.secret",
            () -> "testSecretKey12345678901234567890123456789012"); // 44 chars
        registry.add("app.jwt.access-token-expiry-minutes",  () -> "15");
        registry.add("app.jwt.refresh-token-expiry-days",    () -> "7");
        registry.add("app.user-retention-days",              () -> "30");
        registry.add("razorpay.key-id",     () -> "");
        registry.add("razorpay.key-secret", () -> "");
        registry.add("razorpay.webhook-secret", () -> "");
        registry.add("spring.mail.host",    () -> "localhost");
        registry.add("spring.mail.port",    () -> "25");
    }
}
