# Implementation Plan: Feature 003 — Full-Stack Production Platform

**Feature Branch**: `003-platform`
**Feature Number**: 003
**Created**: 2026-04-30
**Spec**: [specs/003-platform/spec.md](specs/003-platform/spec.md)

---

## Implementation Status

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Project Scaffold | PENDING | |
| 1 | Database & Flyway Migrations | PENDING | |
| 2 | Auth (JWT, Register, Login, Password Reset) | PENDING | |
| 3 | Plans & Subscriptions (Razorpay) | PENDING | |
| 4 | Content Entitlement Guard | PENDING | |
| 5 | Practice Tests (Sessions, Scoring, Rank) | PENDING | |
| 6 | Leaderboard (Redis, WebSocket) | PENDING | |
| 7 | Badges & Progress (Streaks, Awards) | PENDING | |
| 8 | Angular UI Polish | PENDING | |
| 9 | Hardening (Rate Limiting, OWASP, Load Test) | PENDING | |
| 10 | Deploy (Docker, Railway, Vercel, CI/CD) | PENDING | |

---

## Technical Context

### Frontend
- **Framework**: Angular 21.2.x, TypeScript 5.9.x
- **Styling**: Tailwind CSS 4.2.x (mobile-first, 360px minimum viewport)
- **State**: Angular Signals + RxJS 7.8.x
- **Auth storage**: httpOnly cookie JWT (no localStorage/sessionStorage)
- **Testing**: Vitest (already installed)
- **Hosting**: Vercel (static deploy, env var `VITE_API_URL` points to Railway API)

### Backend
- **Framework**: Spring Boot 3.4.x, Java 21 LTS
- **Threading**: `spring.threads.virtual.enabled=true` (Project Loom virtual threads)
- **Build**: Maven
- **Security**: Spring Security 6.x, JJWT 0.12.x, stateless sessions
- **API docs**: Springdoc OpenAPI 3 (`/swagger-ui.html`, disabled in production)

### Persistence
- **Primary DB**: PostgreSQL 16 (system of record for all business data)
- **ORM**: Spring Data JPA, Hibernate 6
- **Migrations**: Flyway (SQL-based, `db/migration/` directory)
- **Cache/Leaderboard**: Redis 7, Spring Data Redis, sorted sets (`ZADD/ZRANK/ZREVRANGE`)

### Integrations
- **Payments**: Razorpay Java SDK, Subscriptions API, INR only
- **Email**: Spring Mail via Gmail SMTP (password reset only in v1)
- **Real-time**: Spring WebSocket + STOMP + SockJS at `/ws/leaderboard`

### Testing
- **Backend unit**: JUnit 5, Mockito, AssertJ (≥ 80% business logic coverage)
- **Backend integration**: Testcontainers (PostgreSQL 16 + Redis 7 real containers)
- **Frontend**: Vitest

### Secrets (never in source code — env vars only)
| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USER` | PostgreSQL username |
| `DB_PASS` | PostgreSQL password |
| `REDIS_URL` | Redis connection URL |
| `JWT_SECRET` | HMAC-SHA256 secret, min 256-bit |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook HMAC secret |
| `SMTP_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `VITE_API_URL` | (Frontend) Railway API base URL |

---

## Data Flow Diagrams

### Auth Flow

```
Browser                     Angular                      Spring Boot API              PostgreSQL/Redis
   |                            |                               |                          |
   |-- POST /auth/register ---->|                               |                          |
   |                            |-- POST /api/v1/auth/register->|                          |
   |                            |                               |-- INSERT users ---------->|
   |                            |                               |<-- user row --------------|
   |                            |<-- 201 Created (no cookies) --|                          |
   |                            |                               |                          |
   |-- POST /auth/login ------->|                               |                          |
   |                            |-- POST /api/v1/auth/login --->|                          |
   |                            |                               |-- SELECT user by email -->|
   |                            |                               |<-- user row --------------|
   |                            |                               |-- bcrypt.verify() --------|
   |                            |                               |-- generate access JWT     |
   |                            |                               |-- generate refresh JWT    |
   |                            |                               |-- store refresh in Redis  |
   |                            |<-- 200 OK                     |                          |
   |                            |   Set-Cookie: access (15min)  |                          |
   |                            |   Set-Cookie: refresh (7d)    |                          |
   |                            |                               |                          |
   |-- (access token expires) ->|                               |                          |
   |                            |-- POST /api/v1/auth/refresh ->|                          |
   |                            |   (sends refresh cookie)      |-- validate refresh JWT -->|
   |                            |                               |-- blocklist old token --->|
   |                            |                               |-- generate new access JWT |
   |                            |                               |-- issue new refresh JWT   |
   |                            |<-- 200 OK                     |                          |
   |                            |   Set-Cookie: access (15min)  |                          |
   |                            |   Set-Cookie: refresh (7d)    |                          |
   |                            |                               |                          |
   |-- POST /auth/logout ------>|                               |                          |
   |                            |-- POST /api/v1/auth/logout -->|                          |
   |                            |                               |-- add refresh to blocklist|
   |                            |<-- 200 OK (clear cookies) ----|                          |
```

### Password Reset Flow

```
Browser                     Angular                      Spring Boot API              PostgreSQL/SMTP
   |                            |                               |                          |
   |-- Submit reset email ----->|                               |                          |
   |                            |-- POST /auth/password-reset-request -->|                |
   |                            |                               |-- SELECT user by email -->|
   |                            |                               |-- generate token_hash --->|
   |                            |                               |-- INSERT password_reset_tokens ->|
   |                            |                               |-- send email via SMTP --->|
   |                            |<-- 200 OK (always, no enum) --|                          |
   |                            |                               |                          |
   |-- Click reset link ------->|                               |                          |
   |                            |-- POST /auth/password-reset-confirm -->|                |
   |                            |                               |-- SELECT token (1hr TTL) >|
   |                            |                               |-- bcrypt new password     |
   |                            |                               |-- UPDATE users.password_hash ->|
   |                            |                               |-- mark token used ------->|
   |                            |<-- 200 OK --------------------|                          |
```

### Payment / Webhook Flow

```
Browser                Angular              Spring Boot API         Razorpay            PostgreSQL
   |                      |                       |                     |                    |
   |-- View plans -------->|                       |                     |                    |
   |                       |-- GET /api/v1/plans ->|                     |                    |
   |                       |<-- plan list ---------|                     |                    |
   |                       |                       |                     |                    |
   |-- Click Subscribe --->|                       |                     |                    |
   |                       |-- POST /subscriptions/checkout -->|         |                    |
   |                       |                       |-- Create subscription via Razorpay API ->|
   |                       |                       |<-- razorpay_subscription_id -------------|
   |                       |                       |-- INSERT subscriptions (PENDING) ------->|
   |                       |<-- { subscriptionId, key } ---|             |                    |
   |                       |-- Open Razorpay checkout JS   |             |                    |
   |<-- Razorpay modal -----|                       |                    |                    |
   |-- Complete payment --->|                       |                    |                    |
   |                        (Razorpay calls webhook)|                    |                    |
   |                       |          POST /api/v1/webhooks/razorpay <---|                    |
   |                       |                       |-- Verify HMAC sig   |                    |
   |                       |                       |-- Parse event type  |                    |
   |                       |                       |-- UPDATE subscriptions (ACTIVE) -------->|
   |                       |                       |-- INSERT webhook_events ---------------->|
   |                       |                       |-- 200 OK ---------->|                    |
   |                       |                       |                     |                    |
   |-- Reload dashboard --->|                       |                    |                    |
   |                       |-- GET /users/me/subscription -->|           |                    |
   |                       |<-- { status: ACTIVE, plan: Pro } ---|       |                    |
   |<-- Premium UI ---------|                       |                    |                    |
```

### Practice Test + Ranking Flow

```
Browser                Angular              Spring Boot API              PostgreSQL           Redis
   |                      |                       |                          |                  |
   |-- Configure test ---->|                       |                          |                  |
   |                       |-- POST /tests/sessions -->|                      |                  |
   |                       |                       |-- Verify entitlement --->|                  |
   |                       |                       |-- Sample questions ------>|                  |
   |                       |                       |   (40% easy, 40% med, 20% hard)             |
   |                       |                       |-- INSERT test_sessions -->|                  |
   |                       |<-- { sessionId, questions[] } ---|              |                  |
   |<-- Test runner --------|                       |                         |                  |
   |                       |                       |                          |                  |
   |-- (auto-submit on timer expire OR manual) -->  |                         |                  |
   |                       |-- POST /tests/sessions/{id}/submit -->|          |                  |
   |                       |                       |-- Validate session active ->|               |
   |                       |                       |-- Calculate raw score (+4/-1/0)             |
   |                       |                       |-- Calculate weighted score                  |
   |                       |                       |-- Calculate percentile rank (30-day window)->|
   |                       |                       |-- UPDATE test_sessions (SUBMITTED) -------->|
   |                       |                       |-- INSERT test_attempts ------------------>  |
   |                       |                       |-- UPDATE leaderboard_scores ------------->  |
   |                       |                       |-- ZADD Redis sorted sets ------------------>|
   |                       |                       |-- Check badge conditions (async) -------->  |
   |                       |                       |-- Publish WebSocket leaderboard update      |
   |                       |<-- { score, percentile, rank badge } ---|        |                  |
   |<-- Results screen -----|                       |                         |                  |
```

### Leaderboard WebSocket Flow

```
Browser                Angular/SockJS         Spring Boot (STOMP)          Redis
   |                      |                          |                         |
   |-- Load leaderboard -->|                          |                         |
   |                       |-- GET /leaderboard/global ->|                     |
   |                       |                          |-- ZREVRANGE (top 100) ->|
   |                       |                          |<-- sorted scores --------|
   |                       |<-- ranked entries --------|                        |
   |                       |                          |                         |
   |                       |-- STOMP CONNECT /ws/leaderboard -->|               |
   |                       |-- SUBSCRIBE /topic/leaderboard --> |               |
   |                       |<-- CONNECTED --------------|       |               |
   |<-- Live board renders  |                           |       |               |
   |                       |                           |       |               |
   |   (Another user submits a test)                   |       |               |
   |                       |                           |-- ZADD updated ------->|
   |                       |                           |-- messagingTemplate.convertAndSend
   |                       |                           |   /topic/leaderboard   |
   |                       |<-- STOMP MESSAGE (delta) --|                       |
   |<-- Board updates -------|                          |                       |
   |   (within 3 seconds)   |                          |                       |
   |                       |                           |                       |
   |   (WebSocket drops)    |                           |                       |
   |                       |-- SockJS reconnect with exponential backoff        |
   |                       |   (1s → 2s → 4s → 8s → max 30s)                  |
```

---

## Database Schema

### Table: `users`
```sql
CREATE TABLE users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email            VARCHAR(255) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    display_name     VARCHAR(100),
    avatar_url       VARCHAR(500),
    role             VARCHAR(20)  NOT NULL DEFAULT 'STUDENT', -- STUDENT | ADMIN
    email_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_login_at    TIMESTAMPTZ
);
CREATE INDEX idx_users_email ON users(email);
```

### Table: `plans`
```sql
CREATE TABLE plans (
    id                      BIGSERIAL PRIMARY KEY,
    name                    VARCHAR(50)    NOT NULL,           -- Free | Basic | Pro
    billing_cycle           VARCHAR(20)    NOT NULL,           -- MONTHLY | YEARLY | NONE
    price_inr               NUMERIC(10,2)  NOT NULL DEFAULT 0,
    razorpay_plan_id        VARCHAR(100),
    max_questions_per_topic INT,                               -- NULL = unlimited
    features                JSONB          NOT NULL DEFAULT '{}',
    active                  BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ    NOT NULL DEFAULT now()
);
```

### Table: `subscriptions`
```sql
CREATE TABLE subscriptions (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                   UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id                   BIGINT         NOT NULL REFERENCES plans(id),
    razorpay_subscription_id  VARCHAR(100)   UNIQUE,
    status                    VARCHAR(20)    NOT NULL DEFAULT 'FREE',
      -- FREE | ACTIVE | GRACE_PERIOD | EXPIRED | CANCELLED | PENDING
    current_period_start      TIMESTAMPTZ,
    current_period_end        TIMESTAMPTZ,
    grace_period_end          TIMESTAMPTZ,
    cancelled_at              TIMESTAMPTZ,
    created_at                TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at                TIMESTAMPTZ    NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_razorpay ON subscriptions(razorpay_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Table: `topics`
```sql
CREATE TABLE topics (
    id               BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    class_level      SMALLINT     NOT NULL, -- 11 | 12
    type             VARCHAR(20)  NOT NULL, -- MCQ | SQL | PYTHON
    total_questions  INT          NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

### Table: `questions`
```sql
CREATE TABLE questions (
    id                BIGSERIAL PRIMARY KEY,
    topic_id          BIGINT       NOT NULL REFERENCES topics(id),
    type              VARCHAR(20)  NOT NULL, -- MCQ | SQL | PYTHON
    question_text     TEXT         NOT NULL,
    options           JSONB        NOT NULL, -- [{id, text}]
    correct_option_id VARCHAR(10)  NOT NULL,
    difficulty_weight SMALLINT     NOT NULL DEFAULT 1 CHECK (difficulty_weight IN (1,2,3)),
      -- 1=easy | 2=medium | 3=hard
    class_level       SMALLINT     NOT NULL,
    source_file       VARCHAR(255),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_topic ON questions(topic_id);
CREATE INDEX idx_questions_difficulty ON questions(topic_id, difficulty_weight);
```

### Table: `test_sessions`
```sql
CREATE TABLE test_sessions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID         NOT NULL REFERENCES users(id),
    topic_ids         JSONB        NOT NULL, -- [topicId, ...]
    question_ids      JSONB        NOT NULL, -- ordered [questionId, ...]
    mode              VARCHAR(20)  NOT NULL, -- QUICK | STANDARD | FULL
    question_count    SMALLINT     NOT NULL,
    time_limit_sec    INT          NOT NULL,
    started_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    submitted_at      TIMESTAMPTZ,
    status            VARCHAR(20)  NOT NULL DEFAULT 'IN_PROGRESS',
      -- IN_PROGRESS | SUBMITTED | EXPIRED
    answers           JSONB        NOT NULL DEFAULT '{}',
      -- { "questionId": "selectedOptionId" }
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_test_sessions_user ON test_sessions(user_id);
CREATE INDEX idx_test_sessions_status ON test_sessions(status, started_at);
```

### Table: `test_attempts`
```sql
CREATE TABLE test_attempts (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID           NOT NULL REFERENCES users(id),
    session_id        UUID           NOT NULL UNIQUE REFERENCES test_sessions(id),
    topic_ids         JSONB          NOT NULL,
    mode              VARCHAR(20)    NOT NULL,
    question_count    SMALLINT       NOT NULL,
    correct_count     SMALLINT       NOT NULL,
    incorrect_count   SMALLINT       NOT NULL,
    skipped_count     SMALLINT       NOT NULL,
    time_taken_sec    INT            NOT NULL,
    raw_score         INT            NOT NULL,
    weighted_score    NUMERIC(6,2)   NOT NULL,
    percentile_rank   NUMERIC(5,2),
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT now()
);
CREATE INDEX idx_test_attempts_user ON test_attempts(user_id, created_at DESC);
CREATE INDEX idx_test_attempts_mode_topics ON test_attempts(mode, created_at DESC);
  -- supports 30-day percentile window queries
```

### Table: `leaderboard_scores`
```sql
CREATE TABLE leaderboard_scores (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id),
    scope       VARCHAR(20) NOT NULL, -- GLOBAL | TOPIC | WEEKLY
    scope_key   VARCHAR(100),         -- NULL for global, topicId for topic, week_start ISO for weekly
    score       NUMERIC(10,2) NOT NULL DEFAULT 0,
    week_start  DATE,                 -- populated only for WEEKLY scope
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_leaderboard_user_scope ON leaderboard_scores(user_id, scope, COALESCE(scope_key,''));
CREATE INDEX idx_leaderboard_scope_score ON leaderboard_scores(scope, scope_key, score DESC);
```

### Table: `badges`
```sql
CREATE TABLE badges (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id),
    badge_type  VARCHAR(30) NOT NULL,
      -- BRONZE | SILVER | GOLD | PLATINUM
      -- FIRST_TEST | WEEK_WARRIOR | CENTURY | SHARP_SHOOTER | TOPPER
    awarded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    context     VARCHAR(255),
    UNIQUE (user_id, badge_type)
);
CREATE INDEX idx_badges_user ON badges(user_id);
```

### Table: `webhook_events`
```sql
CREATE TABLE webhook_events (
    id                  BIGSERIAL PRIMARY KEY,
    razorpay_event_id   VARCHAR(100) NOT NULL UNIQUE,
    event_type          VARCHAR(50)  NOT NULL,
    payload             JSONB        NOT NULL,
    processed_at        TIMESTAMPTZ,
    status              VARCHAR(20)  NOT NULL DEFAULT 'RECEIVED',
      -- RECEIVED | PROCESSED | FAILED | DUPLICATE
    received_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_webhook_events_status ON webhook_events(status, received_at);
```

### Table: `password_reset_tokens`
```sql
CREATE TABLE password_reset_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL UNIQUE, -- SHA-256 of the raw token
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_prt_user ON password_reset_tokens(user_id);
CREATE INDEX idx_prt_token_hash ON password_reset_tokens(token_hash);
```

### Flyway Migration Files
```
src/main/resources/db/migration/
  V1__create_users.sql
  V2__create_plans.sql
  V3__create_subscriptions.sql
  V4__create_topics_and_questions.sql
  V5__create_test_sessions_and_attempts.sql
  V6__create_leaderboard_scores.sql
  V7__create_badges.sql
  V8__create_webhook_events.sql
  V9__create_password_reset_tokens.sql
  V10__seed_plans.sql        -- insert Free/Basic/Pro plan rows
  V11__seed_topics.sql       -- import topics from existing content
  V12__seed_questions.sql    -- import questions from src/assets/content/
```

---

## Service Design

### Spring Boot Services

#### `AuthService`
| Method | Responsibility |
|--------|---------------|
| `register(RegisterRequest)` | Validate unique email, bcrypt password, persist User, create FREE Subscription row |
| `login(LoginRequest)` | Verify credentials, generate access + refresh JWTs, store refresh in Redis |
| `refresh(String refreshToken)` | Validate refresh JWT, check blocklist, rotate token pair |
| `logout(String refreshToken)` | Add refresh token to Redis blocklist, clear cookies |
| `requestPasswordReset(String email)` | Generate secure random token, store hash in DB, send email |
| `confirmPasswordReset(String token, String newPassword)` | Validate token TTL + used flag, update password_hash, mark token used |

#### `JwtService`
| Method | Responsibility |
|--------|---------------|
| `generateAccessToken(UserDetails)` | Issue 15-min HMAC-signed JWT |
| `generateRefreshToken(UserDetails)` | Issue 7-day HMAC-signed JWT with unique `jti` |
| `validateToken(String token)` | Parse + verify signature + check expiry |
| `extractUserId(String token)` | Return UUID from token subject |
| `isBlocklisted(String jti)` | Check Redis blocklist for refresh token JTI |
| `blocklist(String jti, Duration ttl)` | Add JTI to Redis blocklist with TTL |

#### `SubscriptionService`
| Method | Responsibility |
|--------|---------------|
| `getPlans()` | Return all active plans |
| `createCheckout(UUID userId, Long planId)` | Create Razorpay subscription, persist pending Subscription |
| `getMySubscription(UUID userId)` | Return current subscription + plan |
| `cancel(UUID userId)` | Call Razorpay cancel API, mark subscription CANCELLED |
| `handleWebhookEvent(String payload, String signature)` | Verify HMAC, parse event, delegate to handler |
| `processActivated(RazorpayEvent)` | Set status ACTIVE, store period dates |
| `processCharged(RazorpayEvent)` | Extend current_period_end |
| `processCancelled(RazorpayEvent)` | Set CANCELLED, retain access until period end |
| `processExpired(RazorpayEvent)` | Set EXPIRED (access revoked) |
| `processHalted(RazorpayEvent)` | Set GRACE_PERIOD, set grace_period_end = now() + 3d |
| `getEntitlement(UUID userId)` | Return access tier (FREE / BASIC / PRO) + active grace info |

#### `TestService`
| Method | Responsibility |
|--------|---------------|
| `createSession(UUID userId, TestConfigRequest)` | Check entitlement, sample questions by difficulty, persist TestSession |
| `getSession(UUID sessionId, UUID userId)` | Return session with remaining time (server start + limit - now) |
| `submitSession(UUID sessionId, SubmitRequest, UUID userId)` | Idempotent: score, persist TestAttempt, update leaderboard, trigger badges |
| `calculateRawScore(List<Answer>)` | +4 correct / -1 wrong / 0 skipped (CBSE formula) |
| `calculateWeightedScore(List<Answer>, Map<Long, Integer> weights)` | sum(weight × correct) / sum(weights) × 100 |
| `calculatePercentileRank(UUID userId, String mode, List<Long> topicIds)` | Query test_attempts (same mode + topics, last 30 days); percentile = (rank / count) × 100 |
| `getTestHistory(UUID userId, Pageable)` | Return paginated test_attempts for user |
| `sampleQuestions(List<Long> topicIds, int count)` | Weighted random sample: 40% easy (weight=1), 40% medium (weight=2), 20% hard (weight=3) |

#### `LeaderboardService`
| Method | Responsibility |
|--------|---------------|
| `getGlobal(UUID requestingUserId, String tier)` | Top 100 from Redis + user's own rank |
| `getWeekly(UUID requestingUserId, String tier)` | This-week's Redis sorted set |
| `getByTopic(Long topicId, UUID requestingUserId, String tier)` | Topic-scoped sorted set |
| `updateScores(UUID userId, BigDecimal delta)` | ZINCRBY all relevant sorted sets atomically |
| `resetWeeklyBoard()` | Cron: Monday 00:00 IST — DEL weekly key, archive to DB |
| `pushWebSocketUpdate(LeaderboardDelta delta)` | messagingTemplate.convertAndSend to /topic/leaderboard |
| `maskRankForTier(LeaderboardEntry entry, String tier)` | Return exact rank for PRO; return bucket ("Top 25%") for FREE/BASIC |

#### `BadgeService`
| Method | Responsibility |
|--------|---------------|
| `evaluateAfterAttempt(UUID userId, TestAttempt attempt)` | Check all badge conditions; insert badge rows if met (idempotent via UNIQUE constraint) |
| `awardFirstTest(UUID userId)` | Grant FIRST_TEST if no prior attempts |
| `checkCentury(UUID userId)` | Grant CENTURY on 100th attempt |
| `checkSharpShooter(TestAttempt)` | Grant SHARP_SHOOTER if raw_score ≥ 90% of max |
| `checkWeekWarrior(UUID userId)` | Grant WEEK_WARRIOR on 7th consecutive calendar day streak |
| `checkTopper(UUID userId)` | Grant TOPPER if rank ≤ 10 in any leaderboard scope |
| `getBadges(UUID userId)` | Return all earned badges for user |

#### `ProgressService`
| Method | Responsibility |
|--------|---------------|
| `getSummary(UUID userId)` | Aggregate: total tests, avg score, current streak, longest streak, badges |
| `updateStreak(UUID userId)` | Calculate current streak from test_attempts dates in IST; reset if gap > 1 day |

#### `UserService`
| Method | Responsibility |
|--------|---------------|
| `getProfile(UUID userId)` | Return user DTO |
| `updateProfile(UUID userId, UpdateProfileRequest)` | Update display_name, avatar_url |
| `getProgress(UUID userId)` | Delegate to ProgressService |

#### `AdminService`
| Method | Responsibility |
|--------|---------------|
| `getMetrics()` | Total users, subscriptions by plan, test attempts (day/week/month), top 10 students |
| `getUsers(Pageable, String emailFilter)` | Paginated user list with subscription |
| `updatePlan(Long planId, UpdatePlanRequest)` | Update plan fields |

---

### Angular Services

#### `core/auth/auth.service.ts`
| Method | Responsibility |
|--------|---------------|
| `register(RegisterRequest)` | POST /auth/register |
| `login(LoginRequest)` | POST /auth/login; set `isLoggedIn` signal |
| `logout()` | POST /auth/logout; clear local signals |
| `refreshToken()` | POST /auth/refresh (called by interceptor on 401) |
| `currentUser$` | Signal of current UserProfile (null if unauthenticated) |

#### `core/auth/jwt.interceptor.ts`
- HttpInterceptor: on 401 response, call `refreshToken()` once, then replay original request; on second 401 or refresh failure, redirect to `/login`
- Attaches no explicit header (cookies are sent automatically by the browser)

#### `core/auth/auth.guard.ts`
- `canActivate`: redirect to `/login?returnUrl=...` if not authenticated

#### `core/auth/role.guard.ts`
- `canActivate`: check role from `AuthService.currentUser$`; redirect to `/dashboard` on mismatch

#### `core/subscription/subscription.service.ts`
| Method | Responsibility |
|--------|---------------|
| `getMySubscription()` | GET /users/me/subscription |
| `getPlans()` | GET /plans |
| `checkout(planId)` | POST /subscriptions/checkout; open Razorpay JS modal |
| `cancel()` | POST /subscriptions/cancel |
| `currentTier$` | Signal of 'FREE' \| 'BASIC' \| 'PRO' |

#### `core/subscription/entitlement.guard.ts`
- `canActivate`: verify subscription tier; redirect to `/plans` with paywall if insufficient

#### `features/leaderboard/leaderboard.service.ts`
| Method | Responsibility |
|--------|---------------|
| `connect()` | SockJS + STOMP connect to `/ws/leaderboard` |
| `disconnect()` | STOMP disconnect |
| `leaderboard$` | Observable/Signal of current leaderboard state |
| `reconnect()` | Exponential back-off reconnect (1→2→4→8→30s max) |

---

## Scalability Architecture (3000 Concurrent Users)

### Bottleneck Analysis & Mitigation

| Layer | Bottleneck at 3k users | Mitigation |
|-------|----------------------|------------|
| Java threads | Traditional thread-per-request = 3k OS threads | Java 21 virtual threads (`spring.threads.virtual.enabled=true`) — millions of lightweight threads |
| DB connections | PostgreSQL default max_connections=100 | HikariCP pool: `maximum-pool-size=20` per API instance; PostgreSQL `max_connections=200`; scale horizontally (2 API replicas = 40 connections) |
| Hot reads | Leaderboard/entitlement queried 3k× on exam day | Redis cache: leaderboard top-10 (TTL 30s), entitlement result per user (TTL 5min) |
| DB write contention | 200 simultaneous test submits | Async badge/leaderboard updates (`@Async`); test score written synchronously, leaderboard update non-blocking |
| WebSocket connections | 3k open connections | STOMP over SockJS; Spring WebSocket scales with virtual threads; consider sticky sessions on Railway if > 1 replica |

### HikariCP Configuration
```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000    # 30s — fail fast, don't queue forever
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 10000  # warn if connection held > 10s
```

### Redis Caching Strategy
```
Key pattern                         TTL       Purpose
entitlement:{userId}:{topic}:{date} 5 min     Free-tier daily limit check (avoid DB hit per question)
lb:global:top10                     30 sec    Leaderboard top-10 read cache (busted on score update)
lb:weekly:top10                     30 sec    Weekly top-10 cache
lb:topic:{id}:top10                 30 sec    Per-topic top-10 cache
test:session:{id}                   70 min    Active session state (TTL = time_limit + 10min)
```

### Horizontal Scaling Path
- All state is in PostgreSQL + Redis (stateless API) — add Railway replicas at any time
- Session state not in-memory: any replica can handle any request
- WebSocket: Railway load-balancer with sticky sessions (header-based) when > 1 replica
- No code changes required to scale from 1 to N replicas

### Load Test Plan (k6 script committed to repo)
```
Scenario 1 — Baseline (ordinary day):   500 VUs, 5 min, ramp 0→500 in 1 min
Scenario 2 — Exam day:                  3000 VUs, 10 min, ramp 0→3000 in 2 min
Scenario 3 — Test submission burst:     200 VUs all hitting POST /tests/sessions/{id}/submit simultaneously
Pass criteria: p95 < 200ms, error rate < 0.1%, no 5xx
```

---

## Logging Architecture

### Stack
- **SLF4J** — facade (no direct Logback/Log4j imports in application code)
- **Logback** — Spring Boot default; configured via `logback-spring.xml`
- **Logstash Logback Encoder** (`net.logstash.logback:logstash-logback-encoder`) — JSON-structured output
- **Papertrail** (free: 100 MB/month, 48h search) — log drain on Railway via syslog

### Log Levels (controlled by `LOG_LEVEL` env var, default `INFO`)
```
TRACE  — SQL queries, Redis operations (dev only, never prod)
DEBUG  — Method entry/exit in services, HTTP request/response body (dev only)
INFO   — Every inbound HTTP request, auth events, webhook events, scheduled jobs, application start/stop
WARN   — Slow DB queries (> 500ms), token near-expiry, rate limit approaching threshold
ERROR  — Exceptions, failed webhook processing, DB connection failures (always with stack trace)
```

### logback-spring.xml Structure
```xml
<!-- dev profile: human-readable console -->
<springProfile name="!docker">
  <appender name="CONSOLE" class="ConsoleAppender">
    <encoder>pattern: %d{HH:mm:ss} %-5level [%X{requestId}] %logger{36} - %msg%n</encoder>
  </appender>
</springProfile>

<!-- docker/prod profile: JSON to stdout (Railway captures stdout → Papertrail) -->
<springProfile name="docker">
  <appender name="JSON" class="ConsoleAppender">
    <encoder class="LogstashEncoder">
      <includeMdcKeyName>requestId</includeMdcKeyName>
      <includeMdcKeyName>userId</includeMdcKeyName>
    </encoder>
  </appender>
</springProfile>
```

### Mandatory Log Events
| Event | Level | Fields logged | Fields NOT logged |
|-------|-------|--------------|-------------------|
| HTTP request in | INFO | method, path, status, duration_ms, requestId | body, cookies, auth headers |
| Login success | INFO | userId, requestId | password, token |
| Login failure | WARN | email (dev only), requestId, reason | password |
| JWT validation failure | WARN | requestId, reason | token value |
| Webhook received | INFO | eventType, razorpayEventId, requestId | payload body |
| Webhook processed | INFO | eventType, razorpayEventId, duration_ms | — |
| Test submitted | INFO | userId, sessionId, score, duration_ms | answers |
| Purge job start/end | INFO | deletedCount, skippedCount, duration_ms | userId details |
| Application start | INFO | version, profile, port | — |
| Unhandled exception | ERROR | message, stack trace, requestId | PII |

### MDC (Mapped Diagnostic Context)
Every request sets MDC keys via `RequestIdFilter` (OncePerRequestFilter):
```java
MDC.put("requestId", request.getHeader("X-Request-Id") != null
    ? request.getHeader("X-Request-Id") : UUID.randomUUID().toString());
MDC.put("userId", SecurityContextHolder.getContext().getAuthentication() != null
    ? principal.getId() : "anonymous");
```
MDC is cleared in `finally` block.

### Additional env var: `LOG_LEVEL`
```yaml
# application.yml snippet
logging:
  level:
    root: ${LOG_LEVEL:INFO}
    com.cbsecshub: ${LOG_LEVEL:INFO}
    org.springframework.security: WARN  # always WARN in prod (very verbose otherwise)
    org.hibernate.SQL: ${SQL_LOG_LEVEL:WARN}  # set DEBUG locally to see queries
    com.zaxxer.hikari: WARN
```

---

## Data Retention & User Purge

### Design
- **Env var**: `USER_RETENTION_DAYS` (default: `1095` = 3 years)
- **Scheduled job**: `UserPurgeJob` runs daily at 02:00 IST (`@Scheduled(cron = "0 0 20 * * *", zone = "UTC")`)
- **Exclusion**: Users with `subscription.status IN (ACTIVE, GRACE_PERIOD)` are never purged
- **Cascade delete**: deleting a `User` row cascades to: subscriptions, test_sessions, test_attempts, leaderboard_scores, badges, password_reset_tokens
- **Audit log**: one log entry per deleted user at INFO level: `{event: USER_PURGED, userId: <uuid>, reason: INACTIVITY, lastLoginAt: <date>}` — no PII

### `scheduled_purge_at` Column
- Set on insert: `NOW() + USER_RETENTION_DAYS days`
- Reset on every login: `UPDATE users SET scheduled_purge_at = NOW() + interval '{{USER_RETENTION_DAYS}} days', last_login_at = NOW() WHERE id = ?`
- Set to NULL for users with active paid subscription (re-evaluated by job)

### PurgeJob Query
```sql
DELETE FROM users
WHERE scheduled_purge_at < NOW()
  AND id NOT IN (
    SELECT user_id FROM subscriptions
    WHERE status IN ('ACTIVE', 'GRACE_PERIOD')
  );
```
Query is indexed on `scheduled_purge_at` column.

### Flyway Migration Addition
Added in V13__add_scheduled_purge.sql:
```sql
ALTER TABLE users ADD COLUMN scheduled_purge_at TIMESTAMPTZ;
CREATE INDEX idx_users_purge ON users (scheduled_purge_at) WHERE scheduled_purge_at IS NOT NULL;
```

---

## UI Design System

### Design Principles
1. **Mobile-first** — 375px base, scale up; every tap target ≥ 44×44px
2. **Speed perception** — skeleton screens on all async routes; no empty white flashes
3. **Clarity** — one primary action per screen; clear visual hierarchy
4. **Accessibility** — WCAG 2.1 AA colour contrast; keyboard navigation on all forms

### Colour Palette (Tailwind CSS custom config)
```js
// tailwind.config.js extension
colors: {
  brand: {
    50:  '#eff6ff',   // bg-brand-50  — light backgrounds
    500: '#3b82f6',   // bg-brand-500 — primary buttons, links
    600: '#2563eb',   // hover state
    700: '#1d4ed8',   // active/focus state
  },
  success: '#22c55e',    // correct answer, badge award
  warning: '#f59e0b',    // streak warning, near-expiry
  danger:  '#ef4444',    // wrong answer, error state
  neutral: { 50:'#f8fafc', 100:'#f1f5f9', 800:'#1e293b', 900:'#0f172a' }
}
```

### Typography
- Font: **Inter** (Google Fonts, preloaded with `<link rel="preconnect">`) with system-font fallback stack
- Scale: 12/14/16/18/20/24/30/36px (Tailwind defaults map exactly)
- Body: 16px, line-height 1.6; code blocks: `font-mono` (JetBrains Mono or system mono)

### Component Library Approach
- **No UI component library dependency** (avoid bundle bloat) — all components hand-built with Tailwind classes
- Shared Angular components in `src/app/shared/ui/`: `ButtonComponent`, `CardComponent`, `BadgeComponent`, `SkeletonComponent`, `ToastComponent`, `ModalComponent`, `ProgressBarComponent`
- Consistent props: `variant` (primary/secondary/ghost/danger), `size` (sm/md/lg), `loading` boolean

### Motion & Transitions
- Route transitions: 200ms fade (Angular Animations `fadeInOut`)
- Button hover/press: Tailwind `transition-all duration-200`
- Toast notifications: slide-in from bottom-right, auto-dismiss 4s
- Skeleton shimmer: Tailwind `animate-pulse` on grey placeholder blocks
- Leaderboard rank change: 500ms slide-up animation on rank number change (Angular Animations)

### Key Screen Layouts
```
Mobile nav:  Bottom tab bar (Practice | Leaderboard | Profile)
Desktop nav: Left sidebar (collapsed to icons on md:, full on lg:)
Test runner: Full-screen focus mode, no nav, question + timer + answer grid
Leaderboard: Sticky rank indicator for current user at bottom of list
Pricing:     3-column card grid (Free / Basic / Pro), recommended badge on Pro
```

### Core Web Vitals Strategy
- **LCP**: Hero image < 50KB (WebP), API calls < 300ms from Vercel edge to Railway
- **CLS**: Reserve space for skeleton screens (fixed heights), no layout shift on data load
- **FID/INP**: Defer non-critical JS (Tesseract, Chart.js lazy imports), keep main thread free
- Angular production build: `--optimization`, `--source-map=false`, lazy chunks per feature route
- Lighthouse CI runs on every PR (via `treosh/lighthouse-ci-action`)

---

## Security Architecture

### JWT Cookie Strategy

```
Cookie Name   : access_token
HttpOnly      : true
Secure        : true (HTTPS only)
SameSite      : Strict
Max-Age       : 900 (15 minutes)
Path          : /api

Cookie Name   : refresh_token
HttpOnly      : true
Secure        : true
SameSite      : Strict
Max-Age       : 604800 (7 days)
Path          : /api/v1/auth/refresh  -- scope to refresh endpoint only
```

### Spring Security Configuration

```
SecurityFilterChain:
  sessionManagement: STATELESS
  csrf: disabled (SameSite=Strict cookies + no CSRF risk)
  cors: configured for Vercel origin + localhost:4200 (dev)

Public endpoints (no JWT required):
  POST /api/v1/auth/register
  POST /api/v1/auth/login
  POST /api/v1/auth/password-reset-request
  POST /api/v1/auth/password-reset-confirm
  GET  /api/v1/plans
  POST /api/v1/webhooks/razorpay   -- verified by signature, not JWT
  GET  /swagger-ui.html            -- non-prod only
  GET  /v3/api-docs/**             -- non-prod only
  GET  /ws/**                      -- WebSocket upgrade

Authenticated (any role):
  All other /api/v1/** endpoints

Admin only:
  /api/v1/admin/**  (hasRole("ADMIN"))
```

### CORS Configuration
```yaml
allowed-origins:
  - https://*.vercel.app
  - http://localhost:4200     # dev only
allowed-methods: GET, POST, PUT, DELETE, OPTIONS
allowed-headers: Content-Type, Accept
allow-credentials: true       # required for httpOnly cookie
max-age: 3600
```

### Rate Limiting (Bucket4j + Redis)
```
Endpoint                  Limit             Window      Action on breach
POST /auth/login          5 failed/IP       15 min      HTTP 429, block 15 min
POST /auth/register       10 requests/IP    1 hour      HTTP 429
POST /auth/password-reset 5 requests/IP     1 hour      HTTP 429
```

### Password Hashing
- bcrypt with cost factor 12
- Minimum requirements enforced at API level: 8+ chars, 1 uppercase, 1 digit
- Error messages are generic (no "email not found" vs "wrong password" differentiation)

### Webhook Signature Verification
```java
// Verify before any DB operation
String computedSig = HmacUtils.hmacSha256Hex(webhookSecret, rawPayload);
if (!MessageDigest.isEqual(computedSig.getBytes(), receivedSig.getBytes())) {
    return ResponseEntity.badRequest().build(); // 400, no logging of secrets
}
```

### OWASP Top 10 Mitigations
| Risk | Mitigation |
|------|-----------|
| A01 Broken Access Control | RBAC via Spring Security `@PreAuthorize`, per-resource user ownership checks |
| A02 Cryptographic Failures | bcrypt passwords, HMAC-signed JWTs, HTTPS-only cookies |
| A03 Injection | All queries via JPA/Hibernate parameterised; no string-concatenated JPQL |
| A05 Security Misconfiguration | Spring Security headers (HSTS, X-Frame-Options, CSP); Swagger disabled in prod |
| A07 Auth Failures | Rate limiting, refresh token rotation, immediate blocklist on logout |
| A09 Security Logging | Structured logs (no PII — no passwords, tokens, or card data logged) |

---

## Repository Structure

```
CBSE_CS_HUB/
├── cbse-cs-hub/                         ← Angular 21.x frontend (extend existing)
│   └── src/app/
│       ├── core/
│       │   ├── auth/
│       │   │   ├── auth.service.ts
│       │   │   ├── jwt.interceptor.ts
│       │   │   ├── auth.guard.ts
│       │   │   └── role.guard.ts
│       │   └── subscription/
│       │       ├── subscription.service.ts
│       │       └── entitlement.guard.ts
│       ├── features/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   └── password-reset/
│       │   ├── subscription/
│       │   │   ├── plans/
│       │   │   ├── checkout/
│       │   │   └── subscription-status/
│       │   ├── practice-test/
│       │   │   ├── test-config/
│       │   │   ├── test-runner/
│       │   │   └── test-result/
│       │   ├── leaderboard/
│       │   │   └── leaderboard/
│       │   └── profile/
│       │       ├── profile/
│       │       ├── progress/
│       │       └── badges/
│       └── shared/                      ← existing shared components
│
├── cbse-api/                            ← Spring Boot 3.4.x (new Maven project)
│   ├── pom.xml
│   ├── src/main/java/com/cbsecshub/api/
│   │   ├── auth/
│   │   │   ├── AuthController.java
│   │   │   ├── AuthService.java
│   │   │   ├── JwtService.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── dto/
│   │   ├── subscription/
│   │   │   ├── SubscriptionController.java
│   │   │   ├── SubscriptionService.java
│   │   │   ├── WebhookController.java
│   │   │   ├── WebhookService.java
│   │   │   └── entity/
│   │   ├── test/
│   │   │   ├── TestController.java
│   │   │   ├── TestService.java
│   │   │   └── entity/
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardController.java
│   │   │   ├── LeaderboardService.java
│   │   │   └── LeaderboardWebSocketController.java
│   │   ├── user/
│   │   │   ├── UserController.java
│   │   │   ├── UserService.java
│   │   │   ├── ProgressService.java
│   │   │   └── BadgeService.java
│   │   ├── admin/
│   │   │   ├── AdminController.java
│   │   │   └── AdminService.java
│   │   ├── maintenance/
│   │   │   └── UserPurgeJob.java          ← @Scheduled daily purge
│   │   └── config/
│   │       ├── SecurityConfig.java
│   │       ├── CorsConfig.java
│   │       ├── WebSocketConfig.java
│   │       ├── RedisConfig.java
│   │       ├── OpenApiConfig.java
│   │       └── RequestIdFilter.java       ← MDC requestId/userId
│   ├── src/main/resources/
│   │   ├── db/migration/
│   │   │   ├── V1__create_users.sql
│   │   │   ├── V2__create_plans.sql
│   │   │   ├── V3__create_subscriptions.sql
│   │   │   ├── V4__create_topics_and_questions.sql
│   │   │   ├── V5__create_test_sessions_and_attempts.sql
│   │   │   ├── V6__create_leaderboard_scores.sql
│   │   │   ├── V7__create_badges.sql
│   │   │   ├── V8__create_webhook_events.sql
│   │   │   ├── V9__create_password_reset_tokens.sql
│   │   │   ├── V10__seed_plans.sql
│   │   │   ├── V11__seed_topics.sql
│   │   │   ├── V12__seed_questions.sql
│   │   │   └── V13__add_scheduled_purge.sql  ← scheduled_purge_at column
│   │   ├── logback-spring.xml              ← JSON (docker) + human (dev)
│   │   └── application.yml
│   ├── src/test/java/
│   │   └── com/cbsecshub/api/
│   │       ├── auth/AuthIntegrationTest.java
│   │       ├── subscription/SubscriptionIntegrationTest.java
│   │       ├── test/TestSessionIntegrationTest.java
│   │       ├── leaderboard/LeaderboardIntegrationTest.java
│   │       ├── maintenance/UserPurgeJobTest.java
│   │       └── BaseIntegrationTest.java    ← Testcontainers setup
│   └── load-tests/
│       └── exam-day.js                     ← k6 load test (3000 VUs)
│
├── specs/003-platform/
│   ├── spec.md
│   ├── plan.md                          ← this file
│   └── checklists/requirements.md
│
├── docker-compose.yml
└── .github/workflows/
    └── ci-cd.yml
```

---

## API Contract Reference

All endpoints under `/api/v1/` prefix.

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, set JWT cookies |
| POST | `/auth/logout` | Bearer | Blocklist refresh, clear cookies |
| POST | `/auth/refresh` | Refresh cookie | Rotate token pair |
| POST | `/auth/password-reset-request` | Public | Send reset email |
| POST | `/auth/password-reset-confirm` | Public | Consume token, set new password |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | Bearer | Current user profile |
| PUT | `/users/me` | Bearer | Update display name / avatar |
| GET | `/users/me/progress` | Bearer | Streak, stats, badges |
| GET | `/users/me/subscription` | Bearer | Current subscription + tier |

### Plans & Subscriptions
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/plans` | Public | All active plans |
| POST | `/subscriptions/checkout` | Bearer | Create Razorpay subscription |
| GET | `/subscriptions/me` | Bearer | My subscription detail |
| POST | `/subscriptions/cancel` | Bearer | Cancel subscription |

### Practice Tests
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/tests/sessions` | Bearer | Create test session |
| GET | `/tests/sessions/{id}` | Bearer | Resume / get session state |
| POST | `/tests/sessions/{id}/submit` | Bearer | Submit answers |
| GET | `/tests/history` | Bearer | Paginated test history |

### Leaderboard
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/leaderboard/global` | Bearer | Global leaderboard (tier-aware) |
| GET | `/leaderboard/weekly` | Bearer | Current week leaderboard |
| GET | `/leaderboard/topic/{topicId}` | Bearer | Topic leaderboard |

### Webhooks
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/webhooks/razorpay` | Signature | Razorpay event handler |

### Admin
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/metrics` | ADMIN | Platform metrics |
| GET | `/admin/users` | ADMIN | Paginated user list |
| GET | `/admin/subscriptions` | ADMIN | All subscriptions |
| PUT | `/admin/plans/{id}` | ADMIN | Update plan |

### WebSocket
| Protocol | Endpoint | Topic | Description |
|----------|----------|-------|-------------|
| STOMP/SockJS | `/ws/leaderboard` | `/topic/leaderboard` | Real-time leaderboard updates |

---

## Deployment Architecture

### Local Development (Docker Compose)

```
docker-compose.yml:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: cbsecshub
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7
    ports: ["6379:6379"]

  cbse-api:
    build: ./cbse-api
    environment:
      DB_URL: jdbc:postgresql://postgres:5432/cbsecshub
      DB_USER: ${DB_USER}
      DB_PASS: ${DB_PASS}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      RAZORPAY_KEY_ID: ${RAZORPAY_KEY_ID}
      RAZORPAY_KEY_SECRET: ${RAZORPAY_KEY_SECRET}
      RAZORPAY_WEBHOOK_SECRET: ${RAZORPAY_WEBHOOK_SECRET}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
    ports: ["8080:8080"]
    depends_on: [postgres, redis]

  cbse-cs-hub:
    image: node:22
    working_dir: /app
    volumes: [./cbse-cs-hub:/app]
    command: npm run start
    environment:
      VITE_API_URL: http://localhost:8080
    ports: ["4200:4200"]
```

### Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Vercel (Frontend)                                              │
│  Angular SPA (static)                                           │
│  VITE_API_URL → https://cbse-api.railway.app                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS API calls
                               │ SockJS WebSocket upgrade
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Railway (Backend cluster)                                      │
│                                                                 │
│  ┌──────────────────┐   ┌─────────────────┐   ┌─────────────┐  │
│  │  cbse-api        │   │  PostgreSQL 16   │   │  Redis 7    │  │
│  │  Spring Boot     │──▶│  (Railway DB)    │   │  (Railway)  │  │
│  │  Port 8080       │   │                 │   │             │  │
│  │  Virtual threads │──▶│  Flyway mgmt    │◀──│  Sorted sets│  │
│  └──────────────────┘   └─────────────────┘   └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ webhooks
                               ▼
                    ┌─────────────────────┐
                    │  Razorpay           │
                    │  (Payments)         │
                    └─────────────────────┘
                    ┌─────────────────────┐
                    │  Gmail SMTP         │
                    │  (Password reset)   │
                    └─────────────────────┘
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci-cd.yml
on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_DB: test, POSTGRES_USER: test, POSTGRES_PASSWORD: test }
      redis:
        image: redis:7
    steps:
      - checkout
      - setup Java 21
      - mvn verify (Testcontainers integration tests run here)
      - docker build -t cbse-api ./cbse-api
      - push to Railway container registry
      - railway up --service cbse-api

  frontend:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup Node 22
      - npm ci && npm run build
      - vercel deploy --prod
```

---

## Phase Implementation Details

### Phase 0: Project Scaffold
**Goal**: Running skeleton — API returns 200, Angular points to it, Docker Compose runs all services.

**Deliverables**:
- `cbse-api/pom.xml` with all dependencies declared
- `cbse-api/src/main/resources/application.yml` (all env vars externalized)
- `SecurityConfig.java` with public/protected route split
- `docker-compose.yml` with all four services
- `.github/workflows/ci-cd.yml` skeleton
- Angular `core/` folder structure + `HttpClient` configured with `withCredentials: true`
- `BaseIntegrationTest.java` with Testcontainers PostgreSQL + Redis setup

**Maven dependencies**:
```xml
spring-boot-starter-web
spring-boot-starter-security
spring-boot-starter-data-jpa
spring-boot-starter-data-redis
spring-boot-starter-websocket
spring-boot-starter-mail
spring-boot-starter-validation
postgresql (runtime)
flyway-core
flyway-database-postgresql
jjwt-api + jjwt-impl + jjwt-jackson (0.12.x)
razorpay-java (latest)
bucket4j-core + bucket4j-redis
springdoc-openapi-starter-webmvc-ui
testcontainers-postgresql + testcontainers-redis (test scope)
```

---

### Phase 1: Database & Flyway Migrations
**Goal**: All tables exist, Flyway executes cleanly, seed data loaded.

**Deliverables**: V1–V12 migration SQL files. Seed data scripts import topics and questions from `src/assets/content/` JSON files. All indexes, foreign keys, and constraints applied.

**Key constraint**: Flyway migrations are append-only — never edit an applied migration.

---

### Phase 2: Auth
**Goal**: Register → Login → Refresh → Logout → Password Reset all working end-to-end with integration tests.

**Deliverables**:
- `AuthController`, `AuthService`, `JwtService`, `JwtAuthFilter`
- `PasswordResetService` + email template
- `UserRepository`, `PasswordResetTokenRepository`
- Integration tests: all 7 acceptance scenarios from US1
- Angular: `LoginComponent`, `RegisterComponent`, `PasswordResetComponent`, `JwtInterceptor`, `AuthGuard`

**Security checkpoints**:
- bcrypt cost 12 confirmed
- Refresh token stored only in Redis (not DB) for fast blocklist lookup
- Refresh cookie scoped to `/api/v1/auth/refresh` path only
- Error responses never distinguish "email not found" from "wrong password"

---

### Phase 3: Plans & Subscriptions
**Goal**: Pricing page shows plans; checkout opens Razorpay; webhook updates DB.

**Deliverables**:
- `PlanController`, `SubscriptionController`, `WebhookController`
- `SubscriptionService` with all 5 webhook event handlers
- `WebhookEvent` idempotency guard (UNIQUE on `razorpay_event_id`)
- Integration tests: all 7 acceptance scenarios from US2
- Angular: `PlansComponent`, `CheckoutComponent`, `SubscriptionStatusComponent`
- `SubscriptionService` + `EntitlementGuard`

**Security**: Webhook signature verification is the first operation — no DB read before verification.

---

### Phase 4: Content Entitlement Guard
**Goal**: Free users see ≤ 10 questions/topic/day; API enforces this regardless of client state.

**Deliverables**:
- `EntitlementService.checkContentAccess(userId, topicId)` — returns allowed question count
- API endpoint or middleware that Angular calls before rendering content
- Integration tests covering Free / Basic / Pro tiers and grace period scenarios (US3)
- Angular `EntitlementGuard` that calls entitlement endpoint before activating content routes

---

### Phase 5: Practice Tests
**Goal**: Full test lifecycle: create session → take test → submit → score → result screen.

**Deliverables**:
- `TestController`, `TestService`
- Question sampling logic (weighted by difficulty)
- Score calculation: raw (CBSE +4/-1/0) + weighted
- Percentile rank (30-day window, same mode + topics)
- Session resumption (GET /tests/sessions/{id} returns remaining seconds)
- Idempotent submission guard
- Auto-expiry mechanism (check on submit if TTL exceeded, mark remaining as incorrect)
- Integration tests: all 6 scenarios from US4 + all 4 from US5
- Angular: `TestConfigComponent`, `TestRunnerComponent` (countdown timer, answer state), `TestResultComponent`

---

### Phase 6: Leaderboard
**Goal**: Redis sorted sets power real-time rankings; WebSocket pushes updates within 3 seconds.

**Deliverables**:
- `LeaderboardService` with Redis ZADD/ZRANK/ZREVRANGE operations
- Three leaderboard scopes: GLOBAL, WEEKLY, TOPIC
- Weekly reset cron (`@Scheduled(cron = "0 0 0 * * MON", zone = "Asia/Kolkata")`)
- STOMP WebSocket controller at `/ws/leaderboard`
- Tier-aware rank masking (PRO = exact rank; FREE/BASIC = percentile bucket)
- Redis fallback to PostgreSQL if Redis unavailable (NFR-011)
- Integration tests: all 5 scenarios from US6 including WebSocket reconnect
- Angular: `LeaderboardComponent` with global/weekly/topic tabs, WebSocket subscription, SockJS reconnect with exponential back-off

---

### Phase 7: Badges & Progress
**Goal**: All 5 achievement badges auto-awarded; streak tracking; progress dashboard complete.

**Deliverables**:
- `BadgeService` — async evaluation triggered after every `TestAttempt` persist
- `ProgressService` — streak calculation in IST timezone
- Scheduled midnight IST job to update streak status
- UNIQUE constraint on (user_id, badge_type) prevents duplicate awards
- Integration tests: all 4 scenarios from US7
- Angular: `ProfileComponent`, `ProgressComponent`, `BadgesComponent`

---

### Phase 8: Angular UI Polish
**Goal**: All screens mobile-first (360px), paywall UX, subscription management complete.

**Deliverables**:
- Grace period warning banner (global component, shown when subscription.status = GRACE_PERIOD)
- Paywall card component (plan comparison table, upgrade CTA)
- Responsive layouts verified at 360×800px
- Rank badge display (Platinum / Gold / Silver / Bronze with visual distinction)
- Test history page with pagination
- Subscription cancel confirmation dialog (access-until-period-end explanation)
- Profile page: display name edit, avatar, streak indicator

---

### Phase 9: Hardening
**Goal**: Rate limiting active; OWASP scan clean; integration test suite ≥ 80% coverage; load test passes at 3000 concurrent users; logging ships to Papertrail; purge job verified.

**Deliverables**:
- Bucket4j + Redis rate limiting on auth endpoints (5 failed login/15min)
- Spring Security HTTP headers (HSTS, X-Frame-Options, X-Content-Type-Options, CSP)
- Full Testcontainers integration test suite with ≥ 80% line coverage
- **k6 load test script** (`cbse-api/load-tests/exam-day.js`): 3000 VUs, 10 min, p95 < 200ms, error rate < 0.1%
- OWASP ZAP baseline scan — zero high/critical findings
- Swagger UI disabled in production profile (`springdoc.swagger-ui.enabled=false`)
- `logback-spring.xml` with JSON encoder for docker profile, human-readable for dev
- `RequestIdFilter` — MDC requestId + userId on every request
- `LOG_LEVEL` and `SQL_LOG_LEVEL` env vars wired in `application.yml`
- Papertrail syslog drain configured on Railway
- `UserPurgeJob` — `@Scheduled` daily at 02:00 IST, respects `USER_RETENTION_DAYS` env var, excludes active subscribers, writes audit log
- V13 Flyway migration: `scheduled_purge_at` column + index on `users` table
- Audit log for all admin actions

---

### Phase 10: Deploy
**Goal**: Main branch push triggers full CI/CD pipeline; staging environment live; production deploy verified.

**Deliverables**:
- Finalized `docker-compose.yml` for local dev
- `Dockerfile` for `cbse-api` (multi-stage: build → JRE 21 slim runtime)
- `.github/workflows/ci-cd.yml`: compile → test → build image → push → Railway deploy
- Railway environment variables configured (all 11 secrets)
- Vercel project configured with `VITE_API_URL` pointing to Railway
- CORS production configuration verified (Vercel domain in allowed origins)
- SC-010: pipeline completes in < 10 minutes confirmed
- Smoke test script hitting key endpoints post-deploy

---

## Scoring & Ranking Formulas

### Raw Score (CBSE Pattern)
```
raw_score = (correct_count × 4) + (incorrect_count × -1) + (skipped_count × 0)
max_score = question_count × 4
```

### Weighted Score
```
weighted_score = [ Σ(difficulty_weight_i × is_correct_i) / Σ(difficulty_weight_i) ] × 100

difficulty_weight: easy=1, medium=2, hard=3
```

### Percentile Rank
```
Reference population: all test_attempts where:
  - mode = submitted_attempt.mode
  - topic_ids overlap (same set)
  - created_at >= now() - 30 days

percentile_rank = (count of attempts with score ≤ submitted_score / total_population) × 100
```

### Rank Badge Assignment (Per Submission)
```
percentile_rank > 99   → PLATINUM
percentile_rank > 90   → GOLD
percentile_rank > 75   → SILVER
percentile_rank > 50   → BRONZE
otherwise              → no rank badge for this attempt
```

### Leaderboard Rank Visibility
```
User tier = PRO    → exact numerical rank shown
User tier = BASIC  → "Top X%" bucket shown (rounded to nearest 5%)
User tier = FREE   → "Top X%" bucket shown; top 10 entries visible to all
```

---

## Redis Key Design

```
leaderboard:global               → ZSET  score=weighted_score  member=userId
leaderboard:weekly:{ISO_week}    → ZSET  score=weighted_score  member=userId  (TTL 8 days)
leaderboard:topic:{topicId}      → ZSET  score=weighted_score  member=userId

auth:refresh_blocklist:{jti}     → STRING "1"  TTL=remaining_token_lifetime
auth:rate_limit:{ip}:{endpoint}  → Counter managed by Bucket4j Redis

user:streak:{userId}             → HASH  { current, longest, last_date }
```

---

## Implementation Deviations

> This section is intentionally empty. Record any deviations from this plan here during implementation, with date and rationale.

| Date | Phase | Deviation | Rationale | Impact |
|------|-------|-----------|-----------|--------|
| — | — | — | — | — |

---

## Open Questions

> Resolved questions from spec clarification session 2026-04-30 are captured in `spec.md`. No open questions remain at plan creation time.

---

## Checklist References

- [specs/003-platform/checklists/requirements.md](specs/003-platform/checklists/requirements.md)
