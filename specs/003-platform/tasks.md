# Tasks: Feature 003 — Full-Stack Production Platform

**Feature Branch**: `003-platform`
**Input**: `specs/003-platform/plan.md`, `specs/003-platform/spec.md`
**Generated**: 2026-04-30
**Total Tasks**: 120 | **Phases**: 11 (Phase 0–10)

---

## Format

```
- [ ] TXXX [P] [Story?] [Size] Description — exact file path, class/method names, verification step
```

- **[P]** = can run in parallel (touches different files, no incomplete-task dependency)
- **[Story]** = user story label (US1–US8); omitted in Setup/Foundation/Polish phases
- **[S]** = < 2 h | **[M]** = 2–4 h | **[L]** = 4–8 h | **[XL]** = > 8 h

---

## Phase 0 — Scaffold (T001–T010)

**Purpose**: Repo skeleton, CI wiring, Angular core structure, Docker baseline. Must complete before any Phase 1 migration work.

- [ ] T001 [L] Create Maven Spring Boot 3.4.x project at `cbse-api/` — `pom.xml` with deps: `spring-boot-starter-web`, `spring-boot-starter-security`, `spring-boot-starter-data-jpa`, `spring-boot-starter-data-redis`, `spring-boot-starter-websocket`, `spring-boot-starter-validation`, `spring-boot-starter-mail`, `spring-boot-starter-actuator`; `flyway-core`; `io.jsonwebtoken:jjwt-api:0.12.x` + `jjwt-impl` + `jjwt-jackson`; `com.razorpay:razorpay-java:latest`; `com.bucket4j:bucket4j-core` + `bucket4j-redis`; `springdoc-openapi-starter-webmvc-ui:2.x`; `net.logstash.logback:logstash-logback-encoder:8.x`; `org.testcontainers:testcontainers-bom:1.20.x` (import BOM) + `testcontainers-postgresql` + `testcontainers-redis`; `lombok`; Java 21; verify `mvn clean compile` passes

- [ ] T002 [M] Create `cbse-api/src/main/resources/application.yml` — datasource (`DB_URL`, `DB_USER`, `DB_PASS`), JPA (`ddl-auto=validate`, `open-in-view=false`), Flyway (`baseline-on-migrate=true`), Redis (`REDIS_URL`), JWT config (`JWT_SECRET` from env, `JWT_ACCESS_EXPIRY_SECONDS` default 900, `JWT_REFRESH_EXPIRY_SECONDS` default 604800), mail (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`), logging (`LOG_LEVEL` env var, `logback-spring.xml`), virtual threads (`spring.threads.virtual.enabled=true`), `USER_RETENTION_DAYS` env var (default 1095), management endpoints (`/actuator/health` public), Swagger disabled by default (`SWAGGER_ENABLED:false`)

- [ ] T003 [M] Create `cbse-api/src/main/resources/logback-spring.xml` — `dev` profile: PatternLayoutEncoder to console; `docker` profile: `LogstashEncoder` JSON output including MDC fields `requestId` + `userId`; root level driven by `${LOG_LEVEL:-INFO}` env var; verify JSON output with `docker` Spring profile active

- [ ] T004 [M] Create `cbse-api/Dockerfile` — multi-stage: stage 1 `maven:3.9-eclipse-temurin-21` runs `mvn package -DskipTests`, copies jar; stage 2 `eclipse-temurin:21-jre-alpine`, non-root user, `EXPOSE 8080`, `ENTRYPOINT ["java","-jar","app.jar"]`; verify `docker build -t cbse-api .` produces image < 200 MB

- [ ] T005 [M] Create `docker-compose.yml` at repo root — services: `postgres` (`postgres:16-alpine`, healthcheck `pg_isready -U $DB_USER`, port 5432), `redis` (`redis:7-alpine`, healthcheck `redis-cli ping`, port 6379), `cbse-api` (build `./cbse-api`, `depends_on: {postgres: {condition: service_healthy}, redis: {condition: service_healthy}}`, port 8080, env from `.env`), `cbse-cs-hub` (`node:22`, `npm run start`, port 4200, env `apiUrl`); all secrets reference `.env` file; verify `docker-compose up -d` brings all containers healthy

- [ ] T006 [L] Create `.github/workflows/ci.yml` — triggers: `push` to `003-platform`; steps: `actions/checkout@v4`, `actions/setup-java@v4` (Java 21 temurin), `mvn verify` (Testcontainers auto-starts Docker), `docker build -t ghcr.io/${{ github.repository }}/cbse-api:${{ github.sha }} ./cbse-api`, `docker push` (on main); verify workflow file parses and Java step resolves

- [ ] T007 [M] Create Angular `src/app/core/` folder structure — `auth/auth.service.ts` (stub), `auth/auth.guard.ts` (stub), `auth/role.guard.ts` (stub), `subscription/subscription.service.ts` (stub), `subscription/entitlement.guard.ts` (stub), `interceptors/credentials.interceptor.ts` (adds `withCredentials: true` to all HTTP requests), `interceptors/error.interceptor.ts` (stub); register interceptors in `app.config.ts`; verify Angular compiles

- [ ] T008 [S] Create Angular `src/environments/environment.ts` (`apiUrl: 'http://localhost:8080/api/v1'`) and `environment.prod.ts` (`apiUrl` from build-time replacement token); update `proxy.conf.json` to proxy `/api/v1/*` → `http://localhost:8080`; add `"proxyConfig": "proxy.conf.json"` to `angular.json` serve options

- [ ] T009 [L] Create Angular shared UI components in `src/app/shared/ui/` — `button.component.ts` (variants: primary/secondary/ghost/danger, sizes: sm/md/lg, loading state), `card.component.ts` (header/body/footer slots), `badge.component.ts` (variants: success/warning/danger/info/neutral), `skeleton.component.ts` (animated pulse placeholder), `toast.component.ts` (auto-dismiss, variants), `modal.component.ts` (overlay + focus-trap), `progress-bar.component.ts` (animated fill, label); all Tailwind-based, consistent `@Input() variant` + `@Input() size` props; verify each renders in isolation

- [ ] T010 [M] Extend Angular Tailwind config — `tailwind.config.js`: custom brand colours (`brand-50…900`), success/warning/danger/info scales, extend `fontFamily` with Inter; import Inter in `src/styles.css` via Google Fonts; define CSS custom properties for 4px base spacing tokens; verify styles compile and brand colour appears in dev build

---

## Phase 1 — DB Migrations (T011–T023)

**Purpose**: All Flyway SQL migrations establishing the full schema. Must complete before any JPA entity work.

**⚠️ CRITICAL**: All JPA entities in Phase 2+ depend on these migrations being present.

- [ ] T011 [M] Create `cbse-api/src/main/resources/db/migration/V1__create_users.sql` — `users` table: `id UUID PK DEFAULT gen_random_uuid()`, `email VARCHAR(255) UNIQUE NOT NULL`, `password_hash VARCHAR(255) NOT NULL`, `display_name VARCHAR(100)`, `avatar_url VARCHAR(500)`, `role VARCHAR(20) NOT NULL DEFAULT 'STUDENT'`, `email_verified BOOL NOT NULL DEFAULT FALSE`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `last_login_at TIMESTAMPTZ`, `scheduled_purge_at TIMESTAMPTZ`; indexes: `idx_users_email ON users(email)`, `idx_users_purge ON users(scheduled_purge_at) WHERE scheduled_purge_at IS NOT NULL`; verify Flyway applies cleanly

- [ ] T012 [P] [M] Create `db/migration/V2__create_plans.sql` — `plans` table: `id BIGSERIAL PK`, `name VARCHAR(50) NOT NULL`, `billing_cycle VARCHAR(20) NOT NULL`, `price_inr NUMERIC(10,2) NOT NULL DEFAULT 0`, `razorpay_plan_id VARCHAR(100)`, `max_questions_per_topic INT` (NULL = unlimited), `features JSONB NOT NULL DEFAULT '{}'`, `is_active BOOL NOT NULL DEFAULT TRUE`, `created_at/updated_at TIMESTAMPTZ`

- [ ] T013 [P] [M] Create `db/migration/V3__create_subscriptions.sql` — `subscriptions` table: `id UUID PK`, `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `plan_id BIGINT NOT NULL REFERENCES plans(id)`, `razorpay_subscription_id VARCHAR(100) UNIQUE`, `status VARCHAR(20) NOT NULL DEFAULT 'FREE'` (FREE/ACTIVE/GRACE_PERIOD/EXPIRED/CANCELLED/PENDING), `current_period_start/end TIMESTAMPTZ`, `grace_period_end TIMESTAMPTZ`, `cancelled_at TIMESTAMPTZ`, `created_at/updated_at`; unique index `idx_subscriptions_user ON subscriptions(user_id)`; indexes on `razorpay_subscription_id`, `status`

- [ ] T014 [P] [M] Create `db/migration/V4__create_topics_questions.sql` — `topics` table: `id BIGSERIAL PK`, `name VARCHAR(100) NOT NULL`, `class_level SMALLINT NOT NULL`, `type VARCHAR(20) NOT NULL` (MCQ/SQL/PYTHON), `total_questions INT DEFAULT 0`, `created_at`; `questions` table: `id BIGSERIAL PK`, `topic_id BIGINT NOT NULL REFERENCES topics(id)`, `question_text TEXT NOT NULL`, `type VARCHAR(20) NOT NULL`, `options JSONB NOT NULL`, `correct_option_id VARCHAR(10) NOT NULL`, `difficulty_weight INT NOT NULL DEFAULT 1 CHECK(difficulty_weight BETWEEN 1 AND 3)`, `source_file VARCHAR(255)`, `created_at`; indexes: `idx_questions_topic ON questions(topic_id)`, `idx_questions_difficulty ON questions(topic_id, difficulty_weight)`

- [ ] T015 [P] [M] Create `db/migration/V5__create_test_sessions_attempts.sql` — `test_sessions` table: `id UUID PK`, `user_id UUID NOT NULL REFERENCES users(id)`, `topic_ids JSONB NOT NULL`, `question_ids JSONB NOT NULL`, `mode VARCHAR(20) NOT NULL` (QUICK/STANDARD/FULL), `question_count INT NOT NULL`, `time_limit_seconds INT NOT NULL`, `started_at TIMESTAMPTZ NOT NULL`, `submitted_at TIMESTAMPTZ`, `status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS'` (IN_PROGRESS/SUBMITTED/EXPIRED), `answers JSONB`; `test_attempts` table: `id UUID PK`, `user_id UUID NOT NULL REFERENCES users(id)`, `session_id UUID NOT NULL UNIQUE REFERENCES test_sessions(id)`, `topic_ids JSONB`, `question_count INT`, `correct_count INT`, `incorrect_count INT`, `skipped_count INT`, `raw_score INT`, `max_score INT`, `percentile_rank NUMERIC(5,2)`, `time_taken_seconds INT`, `created_at`; indexes on `user_id` and `status`

- [ ] T016 [P] [M] Create `db/migration/V6__create_leaderboard_scores.sql` — `leaderboard_scores` table: `id BIGSERIAL PK`, `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `scope VARCHAR(20) NOT NULL` (GLOBAL/WEEKLY/TOPIC), `scope_key VARCHAR(100) NOT NULL DEFAULT 'all'`, `cumulative_score BIGINT NOT NULL DEFAULT 0`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`; unique constraint `uq_lb_user_scope ON (user_id, scope, scope_key)`; index on `(scope, scope_key, cumulative_score DESC)`

- [ ] T017 [P] [M] Create `db/migration/V7__create_badges.sql` — `badges` table: `id BIGSERIAL PK`, `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `badge_type VARCHAR(30) NOT NULL` (BRONZE/SILVER/GOLD/PLATINUM/FIRST_TEST/WEEK_WARRIOR/CENTURY/SHARP_SHOOTER/TOPPER), `awarded_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `context TEXT`; unique constraint `uq_badges_user_type ON (user_id, badge_type)`; index on `user_id`

- [ ] T018 [P] [M] Create `db/migration/V8__create_webhook_events.sql` — `webhook_events` table: `id BIGSERIAL PK`, `razorpay_event_id VARCHAR(100) NOT NULL UNIQUE`, `event_type VARCHAR(50) NOT NULL`, `payload JSONB NOT NULL`, `status VARCHAR(20) NOT NULL` (PROCESSED/FAILED/DUPLICATE), `received_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `processed_at TIMESTAMPTZ`; index on `(razorpay_event_id, status)`

- [ ] T019 [P] [M] Create `db/migration/V9__create_password_reset_tokens.sql` — `password_reset_tokens` table: `id BIGSERIAL PK`, `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `token_hash VARCHAR(255) NOT NULL UNIQUE`, `expires_at TIMESTAMPTZ NOT NULL`, `used BOOL NOT NULL DEFAULT FALSE`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`; index on `(token_hash, used)`

- [ ] T020 [P] [S] Create `db/migration/V10__seed_plans.sql` — INSERT plans: Free (price 0, billing_cycle NONE, max_questions_per_topic 10), Basic Monthly (99.00, MONTHLY, unlimited), Basic Yearly (799.00, YEARLY, unlimited), Pro Monthly (199.00, MONTHLY, unlimited), Pro Yearly (1599.00, YEARLY, unlimited); `razorpay_plan_id` left NULL (populated post-deploy via env/admin API); `features` JSONB encodes tier capabilities

- [ ] T021 [P] [S] Create `db/migration/V11__seed_topics.sql` — INSERT all 19 topics: `cl12-python` (12, PYTHON), `cl12-sql` (12, SQL), `cl11-python` (11, PYTHON), `cl11-computer-fundamentals` (11, MCQ), `sql-aggregate`, `sql-group-by`, `sql-joins`, `sql-keys-constraints`, `sql-order-by`, `sql-select`, `sql-where` (all class 12, SQL), `py-conditions`, `py-dictionaries`, `py-functions`, `py-lists`, `py-loops`, `py-mixed`, `py-strings`, `py-variables` (all class 12, PYTHON); verify row count = 19

- [ ] T022 [M] Create Spring Boot `ContentSyncService` at `com.cbsecshub.api.content.ContentSyncService` — `@Component @EventListener(ApplicationReadyEvent)`; reads all JSON files from classpath `assets/content/**/*.json`; maps to `Question` entities; upserts idempotently by `(source_file, local_id)` unique key (INSERT … ON CONFLICT DO NOTHING); logs `Synced N questions from M files` at INFO; skips if `questions` table already has rows matching source file; create `db/migration/V12__seed_questions.sql` as a no-op placeholder with comment referencing `ContentSyncService`

- [ ] T023 [S] Create `db/migration/V13__ensure_purge_index.sql` — `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_purge ON users(scheduled_purge_at) WHERE scheduled_purge_at IS NOT NULL;` (idempotent; covers the case if V1 was applied before index was added); verify Flyway applies without error

---

**Checkpoint**: Full schema in place — Phase 2 entity/JPA work can begin

---

## Phase 2 — Auth Backend (T024–T040)

**Goal** (US1): Register + login + logout + token refresh + password reset fully functional with Testcontainers integration tests.

**Independent Test**: POST `/api/v1/auth/register` → 201, POST `/api/v1/auth/login` → 200 + `Set-Cookie` access + refresh; GET any protected endpoint without cookie → 401.

### Implementation — US1 Core Entities & Infrastructure

- [ ] T024 [M] [US1] Create `User` JPA entity `com.cbsecshub.api.user.entity.User` — all columns from V1 migration, `@Enumerated(EnumType.STRING) Role role` (STUDENT/ADMIN), implements `UserDetails` (`getAuthorities()` returns `ROLE_${role}`, `getUsername()` returns email, `isEnabled()` true); `@PreUpdate` sets `updated_at`; Lombok `@Builder @NoArgsConstructor @AllArgsConstructor`; verify Hibernate validates against V1 schema

- [ ] T025 [P] [S] [US1] Create `UserRepository` `com.cbsecshub.api.user.repository.UserRepository` extends `JpaRepository<User, UUID>` — custom methods: `Optional<User> findByEmail(String email)`, `boolean existsByEmail(String email)`, `@Query` findAllByScheduledPurgeAtBeforeAndSubscriptionStatusNotIn for purge job

- [ ] T026 [L] [US1] Create `JwtService` `com.cbsecshub.api.auth.service.JwtService` — `generateAccessToken(User)`: builds JWT with sub=userId, email claim, role claim, jti=UUID, expiry from `JWT_ACCESS_EXPIRY_SECONDS`; `generateRefreshToken(User)`: similar with longer TTL from `JWT_REFRESH_EXPIRY_SECONDS`; `validateToken(String token)`: parse + verify HMAC, return false on any exception; `extractUserId(String token)`: returns UUID sub; `extractJti(String token)`; `extractExpiry(String token)`; `@PostConstruct` validates `secret.length() >= 32` (fail-fast); uses JJWT 0.12.x `Jwts.builder()`

- [ ] T027 [S] [US1] Create `CookieService` `com.cbsecshub.api.auth.service.CookieService` — `ResponseCookie createAccessCookie(String token)`: httpOnly, Secure, SameSite=Strict, path=/api, maxAge=JWT_ACCESS_EXPIRY_SECONDS; `ResponseCookie createRefreshCookie(String token)`: path=/api/v1/auth/refresh, maxAge=JWT_REFRESH_EXPIRY_SECONDS; `List<ResponseCookie> clearCookies()`: two empty-value cookies with maxAge=0

- [ ] T028 [S] [US1] Create `TokenBlocklistService` `com.cbsecshub.api.auth.service.TokenBlocklistService` — uses `StringRedisTemplate`; `blockToken(String jti, long ttlSeconds)`: `SET blocklist:{jti} 1 EX {ttl}`; `isBlocked(String jti)`: check key existence; verify unit test with EmbeddedRedis or Testcontainers Redis

- [ ] T029 [M] [US1] Create `JwtAuthenticationFilter` `com.cbsecshub.api.auth.filter.JwtAuthenticationFilter` extends `OncePerRequestFilter` — extract `access_token` from cookies; call `JwtService.validateToken()`; check `TokenBlocklistService.isBlocked(jti)`; on valid: build `UsernamePasswordAuthenticationToken` with userId + role, set in `SecurityContextHolder`; on invalid: clear context, continue chain (401 returned by security config); skip filter for public endpoints list

- [ ] T030 [S] [US1] Create `RequestIdFilter` `com.cbsecshub.api.logging.RequestIdFilter` extends `OncePerRequestFilter` — read `X-Request-Id` header or generate `UUID.randomUUID().toString()`; `MDC.put("requestId", id)` and `MDC.put("userId", extractFromContext())`; add `X-Request-Id` to response header; `MDC.clear()` in finally block; `@Order(1)` to run first

- [ ] T031 [S] [US1] Create `UserDetailsServiceImpl` `com.cbsecshub.api.auth.service.UserDetailsServiceImpl` implements `UserDetailsService` — `loadUserByUsername(email)`: calls `UserRepository.findByEmail()`, throws `UsernameNotFoundException` if absent; returns `User` (already `UserDetails`)

- [ ] T032 [L] [US1] Create `SecurityConfig` `com.cbsecshub.api.config.SecurityConfig` — `@EnableWebSecurity`; stateless session (`SessionCreationPolicy.STATELESS`); CSRF disabled; CORS config (allowedOrigins from `CORS_ORIGINS` env, allowCredentials=true); permit: POST `/api/v1/auth/register`, POST `/api/v1/auth/login`, GET `/api/v1/plans`, POST `/api/v1/webhooks/razorpay`, `/actuator/health`, `/ws/**`; authenticate all others; add `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`; add `RequestIdFilter`; HTTP security headers: HSTS max-age=31536000, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin, CSP script-src 'self'; expose `AuthenticationManager` bean

- [ ] T033 [XL] [US1] Create `AuthService` `com.cbsecshub.api.auth.service.AuthService` — `register(RegisterRequest dto)`: validate unique email (409 on dup), bcrypt password (`BCryptPasswordEncoder`), build User (role=STUDENT, emailVerified=false), set `scheduledPurgeAt = now + USER_RETENTION_DAYS`, save User, call `SubscriptionService.createFreeSubscription(userId)`, return token pair; `login(LoginRequest dto)`: authenticate via `AuthenticationManager`, update `lastLoginAt` and `scheduledPurgeAt`, issue token pair; `logout(String refreshJti)`: block refresh jti in Redis, return clear-cookies; `refresh(String refreshToken)`: validate + check blocklist, issue new pair, block old jti; all methods log AUTH_EVENT at INFO (userId only, no PII)

- [ ] T034 [M] [US1] Create `AuthController` `com.cbsecshub.api.auth.controller.AuthController` — `POST /api/v1/auth/register` → 201; `POST /api/v1/auth/login` → 200 + cookies; `POST /api/v1/auth/logout` → 200 + clear cookies; `POST /api/v1/auth/refresh` → 200 + rotated cookies; `POST /api/v1/auth/password-reset-request` → 200 (always, never discloses email existence); `POST /api/v1/auth/password-reset-confirm` → 200; all request DTOs annotated with `@Valid` Bean Validation; `@RestControllerAdvice` returns RFC 7807 ProblemDetail on validation errors

- [ ] T035 [L] [US1] Create `PasswordResetService` `com.cbsecshub.api.auth.service.PasswordResetService` — `requestReset(email)`: look up user (silently no-op if not found), generate 32-byte `SecureRandom` token, SHA-256 hash, store in `password_reset_tokens` with `expires_at = now+1h`, send email via `JavaMailSender` (plain text link with raw token in URL); `confirmReset(rawToken, newPassword)`: hash token, look up by hash, check `!used && expires_at > now` (400 otherwise), bcrypt new password, update `users.password_hash`, mark token `used=true`; never logs token or password

- [ ] T036 [XL] [US1] Create `AuthIntegrationTest` `com.cbsecshub.api.auth.AuthIntegrationTest` extends `BaseIntegrationTest` — test cases: register happy path → 201 + `Location` header; duplicate email → 409; weak password → 400 with validation details; login success → 200 + two `Set-Cookie` headers (httpOnly); wrong password → 401; access protected endpoint with valid cookie → 200; access without cookie → 401; refresh rotates both tokens → old refresh blocked; logout → refresh cookie cleared + old jti blocked; password reset end-to-end (mock `JavaMailSender`, capture token from DB); create `BaseIntegrationTest` with `@Testcontainers @SpringBootTest(webEnvironment=RANDOM_PORT)` + `@Container` PostgreSQL 16 + Redis 7, `@DynamicPropertySource` injects JDBC URL + Redis URL

### Angular — US1 Frontend

- [ ] T037 [L] [US1] Implement Angular `AuthService` `src/app/core/auth/auth.service.ts` — `currentUser = signal<User | null>(null)`; `register(dto)`: POST `/api/v1/auth/register` withCredentials; `login(dto)`: POST `/api/v1/auth/login`, on success fetch `/api/v1/users/me` to populate signal; `logout()`: POST `/api/v1/auth/logout`, set signal null; `refreshToken()`: POST `/api/v1/auth/refresh`; on app bootstrap call `/api/v1/users/me` to restore session (catches 401 silently); update `ErrorInterceptor` to call `refreshToken()` on 401 then retry once

- [ ] T038 [S] [US1] Implement Angular `AuthGuard` `src/app/core/auth/auth.guard.ts` (canActivate: return `!!currentUser()`, redirect to `/login` with `returnUrl`) and `RoleGuard` `src/app/core/auth/role.guard.ts` (canActivate: check role claim, redirect to dashboard on mismatch); wire into `app.routes.ts`

- [ ] T039 [L] [US1] Create Angular `LoginComponent` `src/app/features/auth/login/login.component.ts` — reactive form: email (`required`, `email`), password (`required`, `minLength(8)`); inline validation messages on blur; loading signal (disables button, shows spinner); error banner (invalid credentials); link to `/register`; link to `/forgot-password`; on success navigate to `returnUrl` or `/practice`; Tailwind mobile-first card layout (max-w-md centered); verify renders at 360px

- [ ] T040 [L] [US1] Create Angular `RegisterComponent` `src/app/features/auth/register/register.component.ts` — reactive form: displayName (`required`, `maxLength(100)`), email, password (`required`, `minLength(8)`, pattern 1 uppercase + 1 digit), confirmPassword (cross-field `passwordsMatch` validator); all errors shown inline; on success auto-login and navigate to `/practice`; Tailwind card layout matching LoginComponent style; verify 409 duplicate email shows user-friendly message

**Checkpoint — US1 Complete**: Register → Login → refresh → logout end-to-end works; Testcontainers tests pass

---

## Phase 3 — Plans & Subscriptions (T041–T057)

**Goal** (US2, US3): Razorpay checkout, webhook processing, entitlement guard, subscription UI.

**Independent Test**: Seed DB with plans, log in as Free user, call `GET /api/v1/entitlement/check?topic=cl12-sql` → `{allowed: true, questionsLimit: 10}`; simulate `subscription.activated` webhook → subscription status changes to ACTIVE.

### Implementation — US2 Subscription Backend

- [ ] T041 [P] [M] [US2] Create `Plan` JPA entity `com.cbsecshub.api.subscription.entity.Plan` + `PlanRepository` extends `JpaRepository<Plan, Long>` — `findAllByIsActiveTrueOrderByPriceInrAsc()`; entity maps all V2 columns

- [ ] T042 [M] [US2] Create `Subscription` JPA entity `com.cbsecshub.api.subscription.entity.Subscription` + `SubscriptionRepository` — custom queries: `Optional<Subscription> findByUserId(UUID userId)`, `Optional<Subscription> findByRazorpaySubscriptionId(String id)`, `Optional<Subscription> findActiveByUserId(UUID userId)` (status IN (ACTIVE, GRACE_PERIOD)); status mapped as `@Enumerated(EnumType.STRING)`

- [ ] T043 [P] [S] [US2] Create `PlanController` `com.cbsecshub.api.subscription.controller.PlanController` — `GET /api/v1/plans` (public, no auth required): calls `PlanRepository.findAllByIsActiveTrueOrderByPriceInrAsc()`, returns `List<PlanDTO>`; verify returns 5 seeded plans from V10 migration

- [ ] T044 [P] [S] [US2] Create `RazorpayConfig` `com.cbsecshub.api.config.RazorpayConfig` — `@Configuration @Bean RazorpayClient razorpayClient()`: instantiates from `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` env vars; `@PostConstruct` validates both non-blank (fail-fast)

- [ ] T045 [XL] [US2] Create `SubscriptionService` `com.cbsecshub.api.subscription.service.SubscriptionService` — `createFreeSubscription(UUID userId)`: create Subscription(status=FREE, planId=Free plan id); `getMySubscription(UUID userId)`: fetch + map to DTO; `checkEntitlement(UUID userId, String requiredTier)`: query status (FREE/ACTIVE/GRACE_PERIOD); `initiateCheckout(UUID userId, Long planId)`: look up plan, call `razorpayClient.subscriptions.create(params)`, save Subscription(status=PENDING, razorpaySubscriptionId), return `{subscriptionId, shortUrl, keyId}`; `cancelSubscription(UUID userId)`: call `razorpayClient.subscriptions.cancel(id, params)`, update DB status=CANCELLED, cancelledAt=now

- [ ] T046 [M] [US2] Create `SubscriptionController` `com.cbsecshub.api.subscription.controller.SubscriptionController` — `POST /api/v1/subscriptions/checkout` (auth required) → delegates to `SubscriptionService.initiateCheckout()`; `GET /api/v1/subscriptions/me` → returns current subscription DTO; `POST /api/v1/subscriptions/cancel` → cancels; all return RFC 7807 ProblemDetail on errors

- [ ] T047 [L] [US2] Create `RazorpayWebhookController` `com.cbsecshub.api.webhook.RazorpayWebhookController` — `POST /api/v1/webhooks/razorpay` (no JWT auth, excluded in SecurityConfig); reads `X-Razorpay-Signature` header; verifies HMAC-SHA256 using `RAZORPAY_WEBHOOK_SECRET` env var + raw request body bytes (`Utils.verifyWebhookSignature`); returns 400 on invalid sig; delegates to `WebhookService.handle(event)`; returns 200

- [ ] T048 [L] [US2] Create `WebhookService` `com.cbsecshub.api.webhook.WebhookService` — `handle(String payload, String eventType, String razorpayEventId)`: call `WebhookIdempotencyService.checkAndRecord(razorpayEventId)` → return 200 immediately if DUPLICATE; switch eventType: `subscription.activated` → set ACTIVE + `currentPeriodStart/End`; `subscription.charged` → extend `currentPeriodEnd`; `subscription.cancelled` → set CANCELLED + `cancelledAt`; `subscription.halted` → set GRACE_PERIOD + `gracePeriodEnd = now+3d`; `subscription.expired` → set EXPIRED; log each event `{event, razorpayEventId, userId}` at INFO

- [ ] T049 [L] [US2] Create `SubscriptionIntegrationTest` — plan list returns 5 seeded plans; `initiateCheckout` returns Razorpay link (mock `RazorpayClient` via `@MockBean`); `webhook.activated` → subscription status ACTIVE verified in DB; duplicate webhook ignored (second call returns 200, DB unchanged); invalid signature → 400; missing subscription ID → 404

### Implementation — US3 Entitlement Backend

- [ ] T050 [L] [US3] Create `EntitlementService` `com.cbsecshub.api.subscription.EntitlementService` — `checkDailyLimit(UUID userId, Long topicId)`: for FREE users get Redis counter key `limit:{userId}:{date}:{topicId}`, INCR, set TTL to midnight UTC if new key, throw `DailyLimitExceededException` if counter > 10; `checkTierAccess(UUID userId, String feature)`: LEADERBOARD_RANK and FULL_CONTENT features require ACTIVE/GRACE_PERIOD Pro plan; return `EntitlementResult(allowed, questionsLimit, reason)`

- [ ] T051 [S] [US3] Create `EntitlementController` `com.cbsecshub.api.subscription.EntitlementController` — `GET /api/v1/entitlement/check?topic={topicId}` (auth required): calls `EntitlementService.checkDailyLimit + checkTierAccess`, returns `{allowed: bool, questionsLimit: int | null, reason: string}`; caches result in Redis for 60s per userId+topic key

### Angular — US2/US3 Frontend

- [ ] T052 [M] [US2] Implement Angular `SubscriptionService` `src/app/core/subscription/subscription.service.ts` — `currentPlan = signal<PlanDTO | null>(null)`; `getPlans()`: GET `/api/v1/plans`; `getMySubscription()`: GET `/api/v1/subscriptions/me`, updates signal; `initiateCheckout(planId)`: POST `/api/v1/subscriptions/checkout`, load Razorpay `checkout.js` lazily via DOM script injection, open checkout; `cancelSubscription()`: POST `/api/v1/subscriptions/cancel`

- [ ] T053 [S] [US3] Create Angular `EntitlementGuard` `src/app/core/subscription/entitlement.guard.ts` — `canActivate(route)`: calls `GET /api/v1/entitlement/check?topic={route.params.topicId}`; if `allowed=false` open `UpgradeModalComponent` and return false; if allowed return true

- [ ] T054 [L] [US2] Create Angular `PlansComponent` `src/app/features/subscription/plans/plans.component.ts` — 3-column responsive pricing grid (Free/Basic/Pro); each card: price, billing cycle toggle (monthly/yearly), features list, CTA button; Razorpay `checkout.js` loaded lazily on CTA click; current plan badge (highlighted card); Pro card marked "Recommended"; mobile: stacked single-column; verify renders at 360px with no overflow

- [ ] T055 [M] [US2] Create Angular `UpgradeModalComponent` `src/app/shared/ui/modal/upgrade-modal.component.ts` — extends `ModalComponent`; shows plan comparison table (Free vs Basic vs Pro feature rows); CTA "See Plans" navigates to `/plans`; opened by `EntitlementGuard` or any Pro-feature click; auto-opens on guard denial

- [ ] T056 [L] [US1] Create Angular `PasswordResetComponent` `src/app/features/auth/password-reset/password-reset.component.ts` — step 1 (no token in URL): email form, POST `/api/v1/auth/password-reset-request`, show "check your email" confirmation; step 2 (token query param present): new password + confirm form, POST `/api/v1/auth/password-reset-confirm`, on success navigate to `/login` with success toast; handles expired token (400 → user-friendly message)

- [ ] T057 [M] [US2] Create Angular `SubscriptionStatusComponent` `src/app/features/subscription/subscription-status/subscription-status.component.ts` — `@Input() layout: 'banner' | 'inline'`; shows: "Active — Pro (expires DD MMM)" / "X days remaining — renew" (warning colour < 7 days) / "Subscription expired" (danger) / "Free Plan — Upgrade"; shown in nav header and profile page; driven by `SubscriptionService.currentPlan` signal

**Checkpoint — US2/US3 Complete**: Checkout opens, webhook activates subscription, entitlement blocks Free users at >10 questions

---

## Phase 4 — Practice Tests (T058–T073)

**Goal** (US4, US5): Create session → take test → submit → score + rank displayed. History paginated.

**Independent Test**: As paid user POST `/api/v1/tests/sessions` → 201 with 25 questions; POST submit with all correct answers → raw score = 100, percentage = 100, badgesEarned includes FIRST_TEST.

### Implementation — US4 Practice Test Backend

- [ ] T058 [M] [US4] Create `Topic` JPA entity + `TopicRepository` (findByClassLevelAndType, findAll) and `Question` JPA entity + `QuestionRepository` (`findByTopicIdAndDifficultyWeightIn`, `countByTopicId`, `findBySourceFile`) — entities map V4 migration columns; `options` stored as `@JdbcTypeCode(SqlTypes.JSON)`

- [ ] T059 [M] [US4] Implement `ContentSyncService` (finalise from T022) `com.cbsecshub.api.content.ContentSyncService` — `@EventListener(ApplicationReadyEvent)`; scan `classpath*:assets/content/**/*.json` via `PathMatchingResourcePatternResolver`; parse each JSON array of questions; upsert each via `QuestionRepository.save()` guarded by `existsBySourceFileAndLocalId()`; log `ContentSync: inserted=N, skipped=M, files=K` at INFO

- [ ] T060 [S] [US4] Create `TestConfigValidator` `com.cbsecshub.api.test.service.TestConfigValidator` — validate: mode one of QUICK/STANDARD/FULL; all topicIds exist in DB; available question count per difficulty band meets minimum (QUICK: ≥10 total, STANDARD: ≥25 total, FULL: ≥50 total); throw `InsufficientQuestionsException` (400) with detail if not enough questions

- [ ] T061 [M] [US4] Create `QuestionSamplerService` `com.cbsecshub.api.test.service.QuestionSamplerService` — `sample(List<Long> topicIds, int count)`: fetch questions from DB grouped by difficulty (40% weight=1, 40% weight=2, 20% weight=3); Fisher-Yates shuffle on each group; if a difficulty band has insufficient questions fill from adjacent band with WARN log; return exactly `count` questions; unit test with known fixture data verifying distribution

- [ ] T062 [M] [US4] Create `TestSession` JPA entity + `TestSessionRepository` (findByIdAndUserId, findByUserIdAndStatus) and `TestAttempt` JPA entity + `TestAttemptRepository` (findByUserId paginated, findBySessionId, existsBySessionId) — maps V5 migration columns; `question_ids` and `answers` stored as `@JdbcTypeCode(SqlTypes.JSON)`

- [ ] T063 [L] [US5] Create `ScoringService` `com.cbsecshub.api.test.service.ScoringService` — `calculate(Map<Long, String> answers, List<Question> questions)`: CBSE formula +4 correct / -1 wrong / 0 skipped; rawScore = sum; maxScore = questionCount × 4; correctCount, incorrectCount, skippedCount; percentage = rawScore/maxScore × 100 (floor 0); returns `ScoringResult` record; unit test: 25 questions all correct → 100, 10 correct + 10 wrong + 5 skipped → 30, all wrong → negative clamped

- [ ] T064 [L] [US5] Create `RankCalculationService` `com.cbsecshub.api.test.service.RankCalculationService` — `calculatePercentile(int rawScore, String mode, List<Long> topicIds)`: query `test_attempts` for same mode + topicIds in last 30 days; countBelow = count where rawScore < thisScore; total = count; percentile = (countBelow / total) × 100 (2dp); if total < 10 return null (insufficient data); cache result in Redis `rank:cache:{mode}:{topicHash}` for 5 min; `getPercentileBadge(Double percentile)`: PLATINUM ≤1%, GOLD ≤10%, SILVER ≤25%, BRONZE ≤50%, else null

- [ ] T065 [XL] [US4] Create `TestService` `com.cbsecshub.api.test.service.TestService` — `createSession(UUID userId, TestConfigRequest config)`: check `EntitlementService.checkTierAccess(FULL_CONTENT)`, check `EntitlementService.checkDailyLimit()`, call `TestConfigValidator`, sample questions via `QuestionSamplerService`, save `TestSession(IN_PROGRESS)`, cache in Redis `test:session:{id}` (TTL = timeLimitSeconds + 60); `getSession(UUID userId, UUID sessionId)`: fetch from cache or DB, verify ownership (403 if mismatch), compute remainingSeconds = timeLimitSeconds - elapsed; `submitSession(UUID userId, UUID sessionId, SubmitRequest req)`: verify ownership + status=IN_PROGRESS + not expired (+10s grace), calculate score, calculate percentile, save `TestAttempt`, update `leaderboard_scores` via `LeaderboardService.updateScore()`, publish `LeaderboardUpdatedEvent`, call `BadgeService.evaluateAfterTest()` `@Async`, return `TestResultDTO`; `expireStaleSessions()`: `@Scheduled(fixedDelay=60000)` set IN_PROGRESS sessions past time limit to EXPIRED

- [ ] T066 [M] [US4] Create `TestController` `com.cbsecshub.api.test.controller.TestController` — `POST /api/v1/tests/sessions` → 201 + `Location: /api/v1/tests/sessions/{id}`; `GET /api/v1/tests/sessions/{id}` → session + remaining time; `POST /api/v1/tests/sessions/{id}/submit` → `TestResultDTO`; `GET /api/v1/tests/history?page=0&size=20` → `Page<TestAttemptSummaryDTO>` (sorted by createdAt DESC)

- [ ] T067 [S] [US5] Create `TestResultDTO` `com.cbsecshub.api.test.dto.TestResultDTO` — fields: `rawScore`, `maxScore`, `percentage`, `percentileRank` (null if < 10 data points), `rankBadge` (BRONZE/SILVER/GOLD/PLATINUM or null), `correctCount`, `incorrectCount`, `skippedCount`, `timeTakenSeconds`, `badgesEarned List<BadgeDTO>`, `topicBreakdown List<TopicBreakdownDTO>` (topicId, topicName, correct, total)

- [ ] T068 [XL] [US4] Create `TestIntegrationTest` — cases: create session returns 201 + 25 questions (Standard mode); get session returns remaining time; submit all correct → rawScore=100, maxScore=100; percentile calculated correctly with fixture data (insert 100 known attempts before test); expired session ID returns 410; double-submit returns 409; verify `BadgeService.evaluateAfterTest()` async call fired; verify leaderboard entry created in Redis

### Angular — US4/US5 Frontend

- [ ] T069 [L] [US4] Create Angular `TestConfigComponent` `src/app/features/practice-test/test-config/test-config.component.ts` — topic multi-select chips (grouped by class 11/12, type); mode cards (Quick/Standard/Full with question count + time limit + difficulty note); on Start: call `EntitlementGuard.checkTopic()`, then POST `/api/v1/tests/sessions`; loading overlay during API call; subscription required banner for Free users; verify renders at 360px

- [ ] T070 [XL] [US4] Create Angular `TestRunnerComponent` `src/app/features/practice-test/test-runner/test-runner.component.ts` — full-screen focus mode (hide nav); display question text with `<pre>` for SQL/Python (monospace); answer grid A/B/C/D buttons; countdown timer as signal (`setInterval`; auto-submit when reaches 0); progress bar (answered/total); prev/next navigation (signals); skip button; submit button → confirm dialog "X questions unanswered"; keyboard shortcuts 1–4 select option, ArrowRight next, ArrowLeft prev; on auto-submit POST to API then navigate to `/test/result/:id`; resume: on load call `GET /api/v1/tests/sessions/{id}`, restore answers from session storage, sync timer from `remainingSeconds`

- [ ] T071 [L] [US5] Create Angular `TestResultComponent` `src/app/features/practice-test/test-result/test-result.component.ts` — score card (big number + %, animated count-up); rank badge display (SVG icon, colour by tier, CSS entrance animation); percentile bar (filled); correct/incorrect/skipped summary chips; topic breakdown accordion (each topic: N/M correct, mini progress bar); badges earned section (animated scale-in on first view); buttons: "Try Again" (pre-fill same topics), "View Leaderboard"; verify renders at 360px

- [ ] T072 [M] [US4] Create Angular `PracticeHomeComponent` `src/app/features/practice-test/practice-home/practice-home.component.ts` — topic grid with class filter toggle (Cl11/Cl12); each topic card: name, question count badge, type icon (SQL/Python/MCQ), lock icon overlay for Free-plan-limited topics; click → navigate to `/test/config?topic={id}`; subscription tier indicator in header

- [ ] T073 [M] [US5] Create Angular `TestHistoryComponent` `src/app/features/practice-test/test-history/test-history.component.ts` — paginated table: date, topics, mode, score (N/M), percentage, percentile, rank badge chip; "Load more" pagination; click row → navigate to `/test/result/{attemptId}`; empty state illustration

**Checkpoint — US4/US5 Complete**: Full test flow end-to-end functional; history paginated; scores correct per CBSE formula

---

## Phase 5 — Leaderboard (T074–T083)

**Goal** (US6): Redis sorted-set leaderboard with WebSocket real-time updates; Pro vs Basic rank visibility.

**Independent Test**: Call `GET /api/v1/leaderboard/global` → top 10 entries; open WebSocket, submit a test, verify message received on socket within 3s.

- [ ] T074 [M] [US6] Create `RedisConfig` `com.cbsecshub.api.config.RedisConfig` — `@Configuration`; `StringRedisTemplate` bean; `RedisTemplate<String, Object>` with `GenericJackson2JsonRedisSerializer` for values, `StringRedisSerializer` for keys; `RedisConnectionFactory` from `REDIS_URL`; verify connection in unit test

- [ ] T075 [L] [US6] Create `LeaderboardService` `com.cbsecshub.api.leaderboard.service.LeaderboardService` — Redis sorted sets: `lb:global:alltime`, `lb:global:week:{yearWeek}` (TTL to next Monday 00:00 UTC), `lb:topic:{topicId}:alltime`; `updateScore(UUID userId, List<String> scopeKeys, long increment)`: `ZINCRBY` each set; `getTopN(String scope, String scopeKey, int n)`: `ZREVRANGE WITH SCORES`, enrich with user display names from Redis hash `user:meta:{userId}` (name + badge level), bust cache on update; `getUserRank(UUID userId, String scope, String scopeKey)`: `ZREVRANK + 1`; `getUserScore(UUID userId, String scope, String scopeKey)`: `ZSCORE`

- [ ] T076 [M] [US6] Create `LeaderboardController` `com.cbsecshub.api.leaderboard.controller.LeaderboardController` — `GET /api/v1/leaderboard/global`: top 10 + calling user's entry; `GET /api/v1/leaderboard/weekly`: current week scope; `GET /api/v1/leaderboard/topic/{topicId}`: topic-specific; all: for Free/Basic users set `rank=null, percentileBucket="Top X%"`; for Pro users include exact rank; all endpoints auth required

- [ ] T077 [S] [US6] Create `LeaderboardUpdatedEvent` `com.cbsecshub.api.leaderboard.event.LeaderboardUpdatedEvent` extends `ApplicationEvent` — fields: `String scope`, `String scopeKey`, `List<LeaderboardEntryDTO> top10`; published by `TestService` via `ApplicationEventPublisher` after each successful submission

- [ ] T078 [M] [US6] Create `LeaderboardWebSocketController` `com.cbsecshub.api.leaderboard.websocket.LeaderboardWebSocketController` — `@EventListener(LeaderboardUpdatedEvent)`; broadcasts `top10` snapshot to `/topic/leaderboard/global` and `/topic/leaderboard/weekly` via `SimpMessagingTemplate.convertAndSend()`; also sends to `/topic/leaderboard/topic-{topicId}` for topic-scoped updates

- [ ] T079 [M] [US6] Create `WebSocketConfig` `com.cbsecshub.api.config.WebSocketConfig` — `@EnableWebSocketMessageBroker`; SockJS fallback at `/ws/leaderboard`; message broker `/topic`; app destination prefix `/app`; CORS allowed origins from `CORS_ORIGINS` env var; set heartbeat `[25000, 25000]`

- [ ] T080 [M] [US6] Create `LeaderboardResetJob` `com.cbsecshub.api.leaderboard.job.LeaderboardResetJob` — `@Scheduled(cron="0 0 18 * * MON", zone="UTC")` (18:30 UTC = 00:00 IST Monday); `@Transactional`: fetch current week's top 3 from `lb:global:week:{prevWeek}`, save to `leaderboard_scores` DB table for history; new week key auto-created on first ZINCRBY; log `{event: WEEKLY_RESET, week: {yearWeek}, top3: [...]}` at INFO

- [ ] T081 [L] [US6] Create `LeaderboardIntegrationTest` — updateScore reflects in ZREVRANGE order; weekly key TTL > 0 and < 7 days; WebSocket message delivered (use `StompClient` in test via `WebSocketStompClient` + `SockJsClient`); Pro user sees exact rank; Free user rank field is null; duplicate score update is idempotent

### Angular — US6 Frontend

- [ ] T082 [L] [US6] Create Angular `LeaderboardComponent` `src/app/features/leaderboard/leaderboard/leaderboard.component.ts` — tabs: Global / Weekly / Topic (topic dropdown); SockJS+STOMP connect `@stomp/stompjs` on init, subscribe `/topic/leaderboard/{scope}`, disconnect on destroy; top-10 table: rank, avatar/initials, display name, score, tests count, badge chip; sticky "Your Rank" row at bottom (Pro: "Rank #X | Score Y", Free/Basic: "Top 25% | Score Y"); animate row update (highlight 1s) on WebSocket message; show skeleton on initial load; `takeUntilDestroyed()` for RxJS cleanup

- [ ] T083 [M] [US6] Create Angular `LeaderboardWebSocketService` `src/app/core/leaderboard/leaderboard-ws.service.ts` — `@Injectable({providedIn: 'root'})`; `@stomp/stompjs` `Client`; `connect(scope)`: connects to `/ws/leaderboard`, subscribes `/topic/leaderboard/{scope}`; `leaderboardUpdates$ = new Subject<LeaderboardUpdate>`; exponential back-off reconnect (1s → 2s → 4s → max 30s); `disconnect()` on destroy; verify auto-reconnect in unit test with mock SockJS

**Checkpoint — US6 Complete**: Real-time leaderboard working; Pro/Free rank visibility correct

---

## Phase 6 — Badges & Progress (T084–T094)

**Goal** (US7): Streaks, badge awards, user progress summary, profile + progress Angular screens.

**Independent Test**: Call `GET /api/v1/users/me/progress` → returns `currentStreak`, `totalTests`, `badges[]`; award FIRST_TEST after first submission.

- [ ] T084 [P] [M] [US7] Create `Badge` JPA entity `com.cbsecshub.api.badge.entity.Badge` + `BadgeRepository` — `findByUserId(UUID)`, `existsByUserIdAndBadgeType(UUID, BadgeType)`, `findByUserIdAndBadgeType(UUID, BadgeType)`; unique constraint on `(user_id, badge_type)` mirrors V7 migration

- [ ] T085 [M] [US7] Create `StreakService` `com.cbsecshub.api.badge.service.StreakService` — Redis hash `streak:{userId}` fields: `lastDate` (ISO date in IST), `currentStreak` (int), `longestStreak` (int); `updateStreak(UUID userId)`: get hash, compute today IST date; if `lastDate = yesterday` → HINCRBY currentStreak 1; if `lastDate = today` → no-op; else → HSET currentStreak 1; update longestStreak if currentStreak > longestStreak; HSET lastDate today; `getStreak(UUID userId)`: returns `StreakData` record; verify unit test: streak increments on consecutive days, resets on gap

- [ ] T086 [L] [US7] Create `BadgeService` `com.cbsecshub.api.badge.service.BadgeService` — `@Async evaluateAfterTest(UUID userId, TestResultDTO result)`: (a) FIRST_TEST: `TestAttemptRepository.countByUserId() == 1`; (b) SHARP_SHOOTER: `result.percentage >= 90`; (c) WEEK_WARRIOR: `StreakService.getStreak().currentStreak >= 7`; (d) CENTURY: `TestAttemptRepository.countByUserId() >= 100`; (e) TOPPER: `LeaderboardService.getUserRank() <= 10` for any scope; each: guard with `existsByUserIdAndBadgeType()` (idempotent), save Badge, add to returned list; log `{event: BADGE_AWARDED, userId, badgeType}` at INFO; `@EnableAsync` in `AsyncConfig`

- [ ] T087 [S] [US7] Create `UserProgressDTO` `com.cbsecshub.api.user.dto.UserProgressDTO` — fields: `testsTotal`, `testsThisWeek` (attempts in last 7 days), `avgScore` (avg percentage), `bestScore`, `currentStreak`, `longestStreak`, `badges List<BadgeDTO>`, `topicStats List<TopicStatDTO>` (topicId, topicName, testsCount, avgScore); computed by `UserService.getProgress(userId)`

- [ ] T088 [L] [US7] Create `UserController` `com.cbsecshub.api.user.controller.UserController` — `GET /api/v1/users/me` → `UserDTO` (id, email, displayName, avatarUrl, role, createdAt, subscription); `PUT /api/v1/users/me` → update displayName/avatarUrl (@Valid, `@Size(max=100)` displayName); `GET /api/v1/users/me/progress` → `UserProgressDTO`; `GET /api/v1/users/me/badges` → `List<BadgeDTO>`; on every GET /me: update `lastLoginAt` and `scheduledPurgeAt = now + USER_RETENTION_DAYS`

- [ ] T089 [L] [US7] Create `BadgeProgressIntegrationTest` — first test submission awards FIRST_TEST badge; score ≥ 90% awards SHARP_SHOOTER; simulate 7 consecutive days (mock IST clock) → WEEK_WARRIOR; 100th attempt awards CENTURY; `GET /me/progress` returns correct streak, testsTotal, badges list; `PUT /me` updates displayName persisted on next GET

### Angular — US7 Frontend

- [ ] T090 [M] [US7] Create Angular `ProfileComponent` `src/app/features/profile/profile/profile.component.ts` — display name inline edit (click-to-edit, PUT on blur/enter); avatar circle with initials fallback (first letter of displayName); subscription badge chip (Free/Basic/Pro colour); "Member since" formatted date; streak counter with flame icon; `SubscriptionStatusComponent` embedded; loading skeleton

- [ ] T091 [L] [US7] Create Angular `ProgressComponent` `src/app/features/profile/progress/progress.component.ts` — streak heatmap: 52-week CSS grid (7 rows × 52 cols), each cell coloured by activity level (0=neutral, 1=light, 2=medium, 3=dark brand colour); tooltip on hover showing date + tests count; topic performance horizontal bars (topicName + avgScore%); summary stats: total tests, avg score, best score; data from `GET /api/v1/users/me/progress`; verify heatmap renders at 360px without overflow

- [ ] T092 [M] [US7] Create Angular `BadgesComponent` `src/app/features/profile/badges/badges.component.ts` — badge grid (4 cols desktop, 2 cols mobile); earned: coloured icon + name + awarded date (animate scale-in on first render if newly awarded); locked: greyed-out icon + name + unlock condition text (e.g., "Take 7 tests in a row"); data from `GET /api/v1/users/me/badges`; compare against full badge type list to show locked ones

**Checkpoint — US7 Complete**: Profile, progress heatmap, badges display all functional; streaks track correctly

---

## Phase 7 — Maintenance & Purge (T093–T094)

**Goal** (NFR-017): Scheduled daily purge of inactive accounts.

- [ ] T093 [M] Create `UserPurgeJob` `com.cbsecshub.api.maintenance.UserPurgeJob` — `@Component @Scheduled(cron="0 0 20 * * *", zone="UTC")` (02:00 IST); reads `@Value("${USER_RETENTION_DAYS:1095}")` threshold; skip entirely if `USER_RETENTION_DAYS=0`; query `users WHERE scheduled_purge_at < NOW()` excluding users with subscription status IN (ACTIVE, GRACE_PERIOD); `@Transactional` hard-delete each user (cascade removes subscriptions, test_attempts, leaderboard_scores, badges); log per-deletion `{event: USER_PURGED, userId, reason: INACTIVITY, lastLoginAt}` at INFO; log job summary `{event: PURGE_JOB_COMPLETE, deleted: N, skipped: M}` at INFO

- [ ] T094 [M] Create `UserPurgeJobTest` `com.cbsecshub.api.maintenance.UserPurgeJobTest` extends `BaseIntegrationTest` — setup: insert 3 users: (A) active Pro subscription, (B) inactive past threshold, (C) inactive within threshold; run `userPurgeJob.runPurge()`; assert: only User B deleted; User A and C still exist; `leaderboard_scores` cascade deleted for B; audit log entry captured (mock Appender or @SpyBean Logger)

**Checkpoint — Phase 7 Complete**: Purge job safely deletes only eligible accounts; active subscribers protected

---

## Phase 8 — Angular UI Polish (T095–T101)

**Purpose**: Cross-cutting Angular UX: navigation, home page, routing, interceptors, toast, animations.

- [ ] T095 [L] Create Angular `AppComponent` nav `src/app/app.component.ts` — top nav bar: logo (link to /), Practice link, Leaderboard link, avatar/initials dropdown (displayName, subscription tier chip, Profile link, Logout); mobile: hamburger button → bottom-sheet drawer with same links; `@defer` (on idle) for icon imports; Angular `BreakpointObserver` for mobile detection; `AuthService.currentUser` signal drives login/logout state; `SubscriptionService.currentPlan` signal drives tier badge

- [ ] T096 [L] Create Angular `HomeComponent` `src/app/features/home/home.component.ts` — landing page (no auth required): hero section (headline, subheadline, "Start Learning Free" CTA → /register); 3 feature cards (Practice Tests / Leaderboard / Track Progress, icons, 1-line description); pricing preview strip (3 tier cards simplified); bottom CTA band; Intersection Observer via signal for entrance animations (Tailwind `transition opacity translate`); no auth redirect if already logged in

- [ ] T097 [M] Configure Angular routing `src/app/app.routes.ts` — lazy-load all feature modules (`loadComponent`); `AuthGuard` on `/practice`, `/test/**`, `/leaderboard`, `/profile/**`; `RoleGuard(ADMIN)` on `/admin/**`; redirect `/` to `/practice` if `currentUser()` not null, else to `/home`; redirect `/login` + `/register` to `/practice` if already logged in; `NotFoundComponent` for `**` route; `PreloadAllModules` strategy

- [ ] T098 [M] Implement Angular `ErrorInterceptor` `src/app/core/interceptors/error.interceptor.ts` — 401: attempt `AuthService.refreshToken()` once, retry original request; on second 401 call `AuthService.logout()` and navigate to `/login`; 403: open `UpgradeModalComponent`; 429: `ToastService.show('Too many requests — please wait', 'warning')`; 5xx: `ToastService.show('Something went wrong — request ID: {X-Request-Id}', 'error')` (extract `X-Request-Id` response header); log all 5xx to console.error

- [ ] T099 [M] Create Angular `ToastService` + `ToastComponent` `src/app/shared/ui/toast/` — `ToastService @Injectable({providedIn:'root'})`: `toasts = signal<Toast[]>([])`, `show(message, variant, duration=4000)` adds, auto-removes after duration; `ToastComponent`: positioned fixed bottom-right, `@for` over signal, `@defer` transition, slide-in CSS animation; variants: success (green), error (red), warning (amber), info (blue); stacks up to 5 at once; dismiss on click; keyboard ESC dismisses all

- [ ] T100 [M] Add Angular route transition animation `src/app/app.component.ts` — `@Component animations: [fadeInOut]`; `fadeInOut` = `trigger('fadeInOut', [transition(':enter', [style({opacity:0}), animate('200ms', style({opacity:1}))]), transition(':leave', [animate('200ms', style({opacity:0}))])])` on router outlet; all async routes show `SkeletonComponent` via `@defer (on immediate) { <router-outlet> } loading { <app-skeleton /> }`

- [ ] T101 [M] Create Angular `SubscriptionStatusBannerComponent` `src/app/features/subscription/subscription-status/subscription-status-banner.component.ts` — shown at top of `/practice` route only; computed signal: if `daysRemaining < 7 && > 0` → amber "X days remaining on Pro — renew now" with link; if expired → red "Subscription expired — renew to regain access" with link to /plans; if GRACE_PERIOD → orange "Grace period: X days until access revoked"; hide if status ACTIVE with > 7 days

---

## Phase 9 — Hardening (T102–T110)

**Purpose**: Rate limiting, security headers, load tests, OWASP scan, coverage gates, startup validation.

- [ ] T102 [L] Implement Bucket4j rate limiting `com.cbsecshub.api.security.RateLimitConfig` + `RateLimitFilter` — `RateLimitConfig`: define 3 buckets using `Bucket4j` + `RedisProxyManager`: (a) failed-login: 5 per IP per 15min (keyed `rl:login:{ip}`); (b) register: 10 per IP per hour (`rl:reg:{ip}`); (c) general API: 30 per userId per minute (`rl:api:{userId}`); `RateLimitFilter` extends `OncePerRequestFilter`: check bucket, on exceeded return 429 with `Retry-After` header (seconds until refill); add `@Order(2)` to run after `RequestIdFilter`; verify 6th login attempt returns 429

- [ ] T103 [S] Verify Spring Security HTTP response headers in `SecurityConfig` — confirm `headers().httpStrictTransportSecurity().maxAgeInSeconds(31536000)`, `frameOptions().deny()`, `contentTypeOptions().disable(false)`, custom `Referrer-Policy: strict-origin` via `headers().addHeaderWriter`, `Content-Security-Policy: default-src 'self'; script-src 'self' https://checkout.razorpay.com` via `headers().contentSecurityPolicy()`; write `SecurityHeadersTest` verifying each header present in responses

- [ ] T104 [L] Finalise `BaseIntegrationTest` and JaCoCo coverage gate — `BaseIntegrationTest`: `@Testcontainers @SpringBootTest(webEnvironment=RANDOM_PORT)`, `@Container static PostgreSQLContainer` + `RedisContainer` with `withReuse(true)`, `@DynamicPropertySource` injects `spring.datasource.url`, `spring.data.redis.url`; add `jacoco-maven-plugin` to `pom.xml`: `check` goal with rule `COVEREDRATIO >= 0.80` for `com.cbsecshub.api.*` excluding entities + DTOs + config; wire into `mvn verify`; CI fails if coverage drops below 80%

- [ ] T105 [L] Create k6 load test script `cbse-api/load-tests/exam-day.js` — scenario: ramp to 3000 VUs over 2 min, hold 10 min, ramp down 1 min; endpoints: POST `/api/v1/auth/login` (fixture creds), GET `/api/v1/practice/topics`, POST `/api/v1/tests/sessions` (Standard mode), POST `/api/v1/tests/sessions/${sessionId}/submit`; thresholds: `http_req_duration{p(95)}<200`, `http_req_failed<0.001`; parameterised base URL from env; commit script; document run command in README

- [ ] T106 [S] Document OWASP ZAP baseline scan `specs/003-platform/checklists/owasp-zap.md` — step-by-step: install ZAP CLI, run `zap-baseline.py -t https://staging.cbse-cs-hub.app -r zap-report.html`; expected: zero HIGH/CRITICAL findings; document false-positive exclusions; optionally add `zaproxy/action-baseline-scan@v0.10.0` as manual-trigger job in CI

- [ ] T107 [S] Disable Swagger UI in production — verify `application.yml` has `springdoc.swagger-ui.enabled: ${SWAGGER_ENABLED:false}` and `springdoc.api-docs.enabled: ${SWAGGER_ENABLED:false}`; add `SpringdocTest` asserting `/swagger-ui.html` returns 404 when `SWAGGER_ENABLED=false`; returns 200 when `SWAGGER_ENABLED=true`

- [ ] T108 [S] JWT secret startup validation — verify `JwtService.@PostConstruct validateSecret()` throws `IllegalStateException` if `Base64.decode(secret).length < 32` (256 bits); add `JwtServiceTest` asserting: valid 32-byte secret → starts normally; 16-byte secret → throws on startup with message "JWT_SECRET must be at least 256 bits (32 bytes)"

- [ ] T109 [M] Webhook idempotency service `com.cbsecshub.api.webhook.WebhookIdempotencyService` — `processIfNew(String razorpayEventId, Runnable handler)`: `@Transactional`; try INSERT `webhook_events(razorpayEventId, status=PROCESSED)` (unique constraint); if `DataIntegrityViolationException` caught → update status=DUPLICATE, return false; else call handler, return true; `WebhookService` delegates to this; `WebhookIdempotencyTest`: send same event twice, verify DB has one PROCESSED + one DUPLICATE row, handler called exactly once

- [ ] T110 [M] Add Lighthouse CI to GitHub Actions — add `treosh/lighthouse-ci-action@v12` job in `.github/workflows/ci.yml` (or separate `lighthouse.yml`); target Vercel preview URL (`${{ env.VERCEL_PREVIEW_URL }}`); assertions: `lcp < 2500`, `cumulative-layout-shift < 0.1`, `categories:performance > 0.85`; collect report as artifact; mark as `continue-on-error: false` to block merge on regression

---

## Phase 10 — Deploy (T111–T120)

**Purpose**: Production-ready Docker images, Railway + Vercel deployment configs, CI/CD pipelines, documentation.

- [ ] T111 [M] Finalize `docker-compose.yml` — add full `healthcheck` blocks to all services (`test`, `interval`, `timeout`, `retries`, `start_period`); create `.env.example` documenting all 13 env vars: `DB_URL`, `DB_USER`, `DB_PASS`, `REDIS_URL`, `JWT_SECRET`, `JWT_ACCESS_EXPIRY_SECONDS`, `JWT_REFRESH_EXPIRY_SECONDS`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`; add `USER_RETENTION_DAYS`, `CORS_ORIGINS`, `SWAGGER_ENABLED`, `LOG_LEVEL`; commit `.env.example`, ensure `.env` is in `.gitignore`

- [ ] T112 [M] Verify `cbse-api/Dockerfile` multi-stage build — run `docker build -t cbse-api:test ./cbse-api` in CI; assert image size < 200 MB (`docker image inspect --format='{{.Size}}'`); run `docker run --rm -e DB_URL=... cbse-api:test` and verify `/actuator/health` returns `{"status":"UP"}` (using testcontainers Docker-in-Docker or local); fix any layer caching issues

- [ ] T113 [M] Optimize Angular production build — run `ng build --configuration production`, verify: no `console.log` in output (TSLint/ESLint rule); `main.*.js` gzipped size < 500 KB (add `bundleStats` report); `lazy-loaded chunks < 100 KB` each; create `vercel.json` with `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}`; add `"outputHashing": "all"` already in angular.json production config

- [ ] T114 [S] Create Railway setup documentation `specs/003-platform/checklists/railway-setup.md` — step-by-step: (1) create Railway project; (2) add PostgreSQL plugin (copy `DB_URL`, `DB_USER`, `DB_PASS`); (3) add Redis plugin (copy `REDIS_URL`); (4) add cbse-api service from GitHub (auto-deploy on push to `003-platform`); (5) set all 16 env vars; (6) set `RAILWAY_HEALTHCHECK_TIMEOUT_SEC=60` and health check path `/actuator/health`; (7) set custom domain; (8) verify deploy log shows `Started CbseCsHubApiApplication`

- [ ] T115 [L] Finalize `.github/workflows/ci-cd.yml` — jobs: (1) `build-test`: setup-java@v4, `mvn verify` (Testcontainers), JaCoCo coverage check (80% gate), upload Surefire + JaCoCo reports; (2) `docker-push` (depends on build-test): `docker/build-push-action` → `ghcr.io/${{ github.repository }}/cbse-api:${{ github.sha }}`; (3) `deploy-railway` (depends on docker-push, on main branch only): `railwayapp/railway-github-action@v3` `railway up --service cbse-api --detach`; add `RAILWAY_TOKEN` secret to repo settings; total pipeline < 10 minutes

- [ ] T116 [M] Create `.github/workflows/deploy-frontend.yml` — triggers: push to `003-platform` AND changes in `cbse-cs-hub/`; steps: setup Node 22, `npm ci`, `npm run build -- --configuration production`, `vercel --prod --token=${{ secrets.VERCEL_TOKEN }} --project=cbse-cs-hub`; add `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` secrets to repo settings; output preview URL for Lighthouse CI

- [ ] T117 [M] Update CORS production config in `SecurityConfig` — `allowedOrigins` reads from `CORS_ORIGINS` env var (comma-separated); default includes `http://localhost:4200`; add `https://cbse-cs-hub.vercel.app` and Railway HTTPS URL; `allowedMethods: GET,POST,PUT,DELETE,OPTIONS`; `allowedHeaders: *`; `allowCredentials: true`; `CorsConfigurationTest` asserts OPTIONS preflight on `/api/v1/auth/login` returns 200 with correct headers

- [ ] T118 [S] Create smoke test checklist `specs/003-platform/checklists/smoke-test.md` — 10 manual steps: (1) visit https://cbse-cs-hub.vercel.app, see home page; (2) register new account → redirect to /practice; (3) take Quick test → results screen; (4) view Global Leaderboard → own score visible; (5) visit /plans, select Pro Monthly, complete Razorpay test-mode payment; (6) verify subscription status banner shows "Active — Pro"; (7) take Standard test → percentile rank visible; (8) logout → /login; (9) DevTools → Application → Cookies: verify access_token httpOnly=true; (10) visit `https://cbse-api.railway.app/admin/dashboard` as student → 403

- [ ] T119 [M] Update `start.ps1` and `stop.ps1` — `start.ps1`: `docker-compose up -d postgres redis cbse-api` (with health check wait loop), then `cd cbse-cs-hub; npm start`; print services URLs on start; `stop.ps1`: `docker-compose down`; both scripts check Docker Desktop running first; verify scripts execute end-to-end on Windows PowerShell 7

- [ ] T120 [L] Update `README.md` — sections: (1) Prerequisites (Java 21, Docker Desktop 4.x, Node.js 22, Maven 3.9, k6 optional); (2) First-time setup: `git clone`, `cp .env.example .env` (fill values), `docker-compose up -d`, `cd cbse-cs-hub && npm install && npm start`; (3) Env vars table (all 16 vars with type, required flag, example value); (4) Running tests: `mvn verify` (Testcontainers auto-start); (5) Railway deploy: link to `checklists/railway-setup.md`; (6) Vercel deploy: `vercel --prod`; (7) Architecture diagram (ASCII or Mermaid); verify README renders correctly on GitHub

---

## Dependency Map

Key cross-phase dependencies:

| Task | Blocks |
|------|--------|
| T011–T023 (Migrations) | T024–T042 (all JPA entities) |
| T024 (User entity) | T025, T033, T036, T088 |
| T026 (JwtService) | T027, T028, T029, T032, T033, T108 |
| T028 (TokenBlocklist) | T029 (JwtFilter), T033 (AuthService.logout/refresh) |
| T029 (JwtFilter) | T032 (SecurityConfig), T036 (AuthTests) |
| T032 (SecurityConfig) | T034 (AuthController), T047 (WebhookController) |
| T033 (AuthService) | T034, T036, T037 |
| T036 (AuthTests) | T104 (Coverage gate) |
| T041–T042 (Plan + Sub entities) | T043, T045, T046, T047, T048 |
| T045 (SubscriptionService) | T033 (createFreeSubscription on register), T049, T050 |
| T050 (EntitlementService) | T065 (TestService.createSession) |
| T058 (Topic + Question entities) | T059, T060, T061, T065 |
| T062 (TestSession + Attempt) | T065, T068 |
| T063 (ScoringService) | T065 (submit), T068 |
| T064 (RankCalculation) | T065 (submit → percentile), T077 |
| T065 (TestService) | T066, T068, T077, T086 |
| T074 (RedisConfig) | T075 (LeaderboardService), T028, T050 |
| T075 (LeaderboardService) | T065 (updateScore after submit), T076, T078, T081 |
| T077 (LeaderboardUpdatedEvent) | T078 (WebSocket broadcast) |
| T079 (WebSocketConfig) | T078, T082 |
| T085 (StreakService) | T086 (BadgeService.WEEK_WARRIOR) |
| T086 (BadgeService) | T065 (@Async after submit), T089 |
| T102 (Rate limiting) | T036 (verify 429 in auth tests) |
| T104 (BaseIntegrationTest + JaCoCo) | T115 (CI coverage gate) |
| T115 (CI/CD pipeline) | T116 (frontend deploy), T110 (Lighthouse) |

---

## Parallel Execution Map

Tasks marked `[P]` can run simultaneously (different files, independent concerns):

| Parallel Group | Tasks | When to run |
|---|---|---|
| DB Migrations | T012–T023 (after T011) | After T011 lands |
| Phase 2 Core | T025, T027, T030, T031 (after T024) | After T024 |
| Auth + Razorpay Config | T029, T044 | After T032 skeleton |
| Sub Entities | T041, T043, T044 | After T042 |
| Leaderboard + WebSocket | T074, T077, T079 | Before T075 |
| Badge Entity + Streak | T084, T085 | Can start after T024 |
| CI + Angular Deploy | T115, T116 | Independent pipelines |

---

## Implementation Strategy (MVP Order)

1. **MVP (US1 alone)** — T001–T010, T011–T023, T024–T040: Working register/login/logout with Testcontainers tests; Angular login + register screens
2. **Revenue unlock (US2–US3)** — T041–T057: Razorpay checkout, webhook, entitlement gate
3. **Core product (US4–US5)** — T058–T073: Practice tests, scoring, history
4. **Engagement (US6–US7)** — T074–T094: Leaderboard WebSocket, badges, streaks, progress
5. **Polish + Harden** — T095–T110: UI polish, rate limiting, OWASP, coverage
6. **Ship** — T111–T120: Docker, Railway, Vercel, CI/CD, docs

**Suggested first PR**: T001–T010 (scaffold) + T011–T023 (migrations) — verifiable with `docker-compose up` and `mvn flyway:migrate` only.
