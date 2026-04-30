# Feature Specification: Full-Stack Production Platform for CBSE CS Hub

**Feature Branch**: `003-platform`
**Feature Number**: 003
**Created**: 2026-04-30
**Status**: Groomed
**Author**: Platform Team

---

## Overview

Transform the existing CBSE CS Hub — currently a static Angular SPA served from GitHub Pages — into a production-grade edtech platform. The platform adds user identity, subscription-gated content access, timed practice tests with real-time ranking, leaderboards, and progress tracking. The existing static content (MCQ, SQL, Python exercises) becomes the curriculum backbone; the new platform wraps it behind authentication and subscription logic without replacing it.

---

## Clarifications

### Session 2026-04-30

- Q: What authentication method? → A: Email/password at launch; Google OAuth2 as future scope (FR-008).
- Q: Where are tokens stored? → A: JWT in `httpOnly` cookies only (access: 15 min, refresh: 7 days with rotation). localStorage/sessionStorage prohibited (NFR-006).
- Q: Is email verification required at launch? → A: No. `emailVerified` field reserved on User entity; no verification email sent in v1.
- Q: Is password reset in scope? → A: Yes. Spring Mail via Gmail SMTP; 1-hour single-use reset token (FR-008a).
- Q: What are the subscription plan prices and limits? → A: Free (10 q/topic/day); Basic ₹99/month or ₹799/year (all questions, no rank); Pro ₹199/month or ₹1599/year (all questions + leaderboard rank + badges + analytics).
- Q: What are the fixed test modes? → A: Quick (10 q, 10 min), Standard (25 q, 30 min), Full (50 q, 60 min); difficulty distribution 40% easy / 40% medium / 20% hard.
- Q: What scoring formula? → A: CBSE pattern — +4 correct, −1 wrong, 0 skipped; max = questionCount × 4 (FR-022a).
- Q: How is percentile rank calculated? → A: Among all attempts with same topics + test mode within last 30 days (FR-024).
- Q: Who sees exact leaderboard rank? → A: Pro subscribers only; Free/Basic see "Top X%" bucket; top 10 visible to all logged-in users (FR-031a).
- Q: What achievement badges exist? → A: First Test, Week Warrior (7-day streak), Century (100 tests), Sharp Shooter (≥90% raw score), Topper (top 10 any leaderboard) — FR-031b.
- Q: Where do content files live and who serves them? → A: Angular fetches from `src/assets/content/` on Vercel static hosting; API validates entitlement only, does not serve files (FR-017).
- Q: What is the WebSocket endpoint? → A: `/ws/leaderboard` with STOMP protocol (FR-030).
- Q: What is the deployment infrastructure? → A: Railway (API + PostgreSQL + Redis) + Vercel (Angular); local dev via Docker Compose (see Infrastructure section).

---

## Problem Statement

The current CBSE CS Hub delivers high-quality CBSE Computer Science practice content as a fully static site with no user context: any visitor can access everything, nothing is personalised, and there is no mechanism to monetise, track progress, or motivate continued study. Students have no way to measure their performance against peers, and the platform has no sustainable revenue model to fund ongoing content improvement.

**Key gaps:**

1. No user identity — content cannot be personalised or access-controlled.
2. No monetisation — the platform cannot sustain itself or expand content.
3. No engagement mechanics — students stop practising because there is no feedback loop, ranking, or streak.
4. No progress data — educators and students have no visibility into learning outcomes.

---

## User Scenarios & Testing *(mandatory)*

### User Story US1 — Student Registration & Login (Priority: P1)

A new student visits the platform, registers with an email and password, and logs in to access their dashboard. The student's session persists securely across browser refreshes without requiring re-login within the session window.

**Why this priority**: Identity is the foundation of every other feature. Nothing else can be built or tested without a working auth layer.

**Independent Test**: Registration and login can be tested end-to-end without subscriptions, tests, or leaderboards. A registered user who can log in and see a dashboard constitutes a working MVP slice.

**Acceptance Scenarios**:

1. **Given** a visitor on the registration page, **When** they submit a valid email and password (min 8 chars, 1 uppercase, 1 digit), **Then** a new account is created with `emailVerified = false` and they are redirected to the onboarding dashboard. No verification email is sent at launch; the `emailVerified` field is reserved for future implementation.
2. **Given** a registered user, **When** they submit correct credentials, **Then** they receive an access token (15-min expiry) stored in an `httpOnly` cookie and a refresh token (7-day expiry, rotated on use) stored in a separate `httpOnly` cookie; they are redirected to their dashboard.
3. **Given** a logged-in user whose access token has expired, **When** they make any authenticated request, **Then** the system silently refreshes the access token using the refresh token without interrupting the user.
4. **Given** a user who has logged out, **When** they attempt to reuse the previous refresh token, **Then** the system rejects it (token is blocklisted) and the user is redirected to login.
5. **Given** a visitor submitting a registration form with an already-registered email, **When** the form is submitted, **Then** a user-friendly error is shown and no duplicate account is created.
6. **Given** five consecutive failed login attempts from the same IP, **When** the sixth attempt occurs, **Then** the endpoint returns HTTP 429 and further attempts are blocked for 15 minutes.
7. **Given** a registered user who has forgotten their password, **When** they submit their email on the password reset page, **Then** a time-limited reset link (1-hour expiry) is sent to their registered email via Gmail SMTP; on following the link the user sets a new password and the reset token is immediately invalidated.

---

### User Story US2 — Subscription Purchase (Priority: P2)

A logged-in student on the Free plan sees a paywall when attempting to access premium content, navigates to the pricing page, selects a paid plan, and completes payment via Razorpay. Access is granted within seconds of successful payment.

**Why this priority**: Subscription is the primary revenue mechanism and determines content access for every other story.

**Independent Test**: Can be tested by completing a Razorpay test-mode payment and verifying the student's plan is upgraded in the database and reflected in the UI.

**Acceptance Scenarios**:

1. **Given** a Free-plan student, **When** they attempt to access a premium question set, **Then** they see a paywall card showing plan comparison and a "Upgrade" CTA.
2. **Given** a student on the pricing page who selects Basic Monthly, **When** they click "Subscribe", **Then** a Razorpay Subscriptions checkout opens pre-filled with their email and the correct INR plan amount.
3. **Given** a student who completes payment in Razorpay checkout, **When** the `subscription.activated` webhook is received and verified, **Then** the student's plan is updated to Basic Active and premium content becomes accessible within 10 seconds.
4. **Given** a student's Basic Monthly subscription that reaches its renewal date with a failed payment, **When** 3 consecutive retries fail, **Then** the subscription moves to `expired` state and a grace period of 3 days is applied before access is revoked.
5. **Given** a student in the 3-day grace period, **When** they log in, **Then** they see a prominent banner warning about expiry and a direct link to update their payment method.
6. **Given** a student who cancels their subscription, **When** the `subscription.cancelled` webhook is received, **Then** access remains until the current billing period ends, after which it reverts to Free.
7. **Given** a Razorpay webhook request with an invalid signature, **When** it reaches the webhook endpoint, **Then** the request is rejected with HTTP 400 and no database changes are made.

---

### User Story US3 — Content Access with Subscription Gate (Priority: P2)

A logged-in student navigates the practice content (MCQ, SQL, Python). Free-tier students see a limited question set per topic with upgrade prompts for locked content. Paid-tier students have unrestricted access to all questions.

**Why this priority**: Content access gating directly delivers the value proposition of paid plans and must work before tests can be meaningful.

**Independent Test**: Can be verified by logging in as a Free user and a Pro user and comparing accessible content without any test or leaderboard functionality needed.

**Acceptance Scenarios**:

1. **Given** a Free-plan student, **When** they open a topic with 50 questions, **Then** they can see and interact with the first 10 questions; the remaining 40 are locked with an upgrade prompt.
2. **Given** a Basic-plan student, **When** they open any topic, **Then** all questions in that topic are fully accessible with no lock UI.
3. **Given** an unauthenticated visitor, **When** they try to access any practice content URL directly, **Then** they are redirected to the login page with the original URL preserved as a post-login redirect.
4. **Given** a Pro-plan student whose subscription just expired (within grace period), **When** they access content, **Then** they retain full access with a grace-period warning banner visible.

---

### User Story US4 — Take a Practice Test (Priority: P3)

A logged-in, paid-plan student configures a timed practice test by selecting topic(s), number of questions, and a time limit, then takes the test and submits it for an instant score.

**Why this priority**: Practice tests are the primary engagement and differentiation feature; they require auth + subscription to be operational first.

**Independent Test**: Can be tested independently by a paid user selecting test parameters, completing the test, and verifying the score screen appears with correct results.

**Acceptance Scenarios**:

1. **Given** a paid-plan student on the test configuration screen, **When** they select "Class 12 SQL" and Standard mode (25 questions, 30-minute time limit) and click "Start Test", **Then** a test session is created server-side with a unique session ID, 25 questions are drawn from the topic pool weighted by difficulty (40% easy, 40% medium, 20% hard), and the first question is displayed with a visible countdown timer.
2. **Given** a student mid-test with 5 minutes remaining, **When** the timer hits 0, **Then** the test is automatically submitted with all answered questions; unanswered questions are marked incorrect.
3. **Given** a student who submits the test, **When** results are processed, **Then** an instant score screen is shown with: total score, correct/incorrect counts, time taken, difficulty-weighted score, and the student's percentile rank among all users who took the same configuration.
4. **Given** a student who navigates away mid-test (closes tab), **When** they return to the test URL within the time limit, **Then** the test resumes from the same state with the timer continuing from where it paused.
5. **Given** a Free-plan student, **When** they attempt to start a practice test, **Then** they are shown a paywall and cannot start the test.
6. **Given** a student who submits a test with an already-expired session ID (replay attempt), **When** the server processes the submission, **Then** it is rejected with an appropriate error and no score is recorded.

---

### User Story US5 — View Test Results and Personal Rank (Priority: P3)

Immediately after test submission, a student sees a detailed results screen with their score, correct/incorrect breakdown per question, time analysis, and their percentile rank compared to all users who took the same test configuration.

**Why this priority**: Results and ranking are the core feedback loop that drives re-engagement. Without them, tests have no motivational value.

**Independent Test**: Can be tested by completing a test and verifying the results screen renders the correct score, breakdown, and rank percentile.

**Acceptance Scenarios**:

1. **Given** a submitted test, **When** the results screen loads, **Then** it shows: overall score (raw and percentage), time taken vs time limit, per-question review (correct answer highlighted, student's answer highlighted differently), and a rank badge.
2. **Given** the results screen, **When** the percentile is in the top 1%, **Then** a Platinum badge is displayed; top 10% = Gold; top 25% = Silver; top 50% = Bronze; otherwise no badge.
3. **Given** a student viewing results, **When** they click "Retake" or "Try Another Topic", **Then** they are taken back to the test configuration screen with the previous topic pre-selected.
4. **Given** a student's test history page, **When** they view previous attempts, **Then** each attempt shows: date, topic, score, rank percentile, and time taken, sorted by most recent first.

---

### User Story US6 — View Leaderboard (Priority: P4)

A logged-in student views the global and topic-specific leaderboards showing ranked users by cumulative score. They can see where they stand relative to their peers, with the leaderboard updating in real time during active test sessions.

**Why this priority**: Leaderboard is a social engagement driver but depends on test attempts existing in the system.

**Independent Test**: Can be tested by seeding the database with test attempt data and verifying the leaderboard renders ranked entries; real-time updates can be tested by submitting a test while the leaderboard page is open.

**Acceptance Scenarios**:

1. **Given** any logged-in student on the Global Leaderboard page, **When** the page loads, **Then** the top 10 users are shown publicly ranked by cumulative score with columns: rank, username, total score, tests taken, and badge level. Free and Basic subscribers see their own standing as a "Top X%" percentile bucket only; Pro subscribers see their exact numerical rank in the full list.
2. **Given** a student on the Topic Leaderboard, **When** they select "Class 12 SQL", **Then** rankings recalculate for that topic and the student's own rank is highlighted regardless of whether they appear in the top 100.
3. **Given** a student on the Weekly Leaderboard, **When** viewed before Monday 00:00 IST, **Then** only test attempts from the current week are counted; on Monday 00:00 IST the weekly board resets automatically.
4. **Given** a student on the leaderboard page, **When** another user submits a test, **Then** their ranking updates on the leaderboard page within 3 seconds via the WebSocket connection (no page refresh required).
5. **Given** a WebSocket connection drop, **When** the connection is lost, **Then** the client automatically reconnects with exponential back-off and resumes receiving updates.

---

### User Story US7 — Manage Profile and Subscription (Priority: P4)

A logged-in student can view and update their profile (display name, avatar), see their current subscription status, manage their subscription (cancel, switch plans), and view their badge/streak progress.

**Why this priority**: Profile and subscription management are essential for user autonomy and trust but do not block core functionality.

**Independent Test**: Can be tested by a logged-in user navigating to the profile page, changing their display name, and verifying the change persists.

**Acceptance Scenarios**:

1. **Given** a logged-in student on their profile page, **When** they update their display name and save, **Then** the new name is reflected everywhere within one page reload.
2. **Given** a student on the subscription tab, **When** they click "Cancel Subscription", **Then** they see a confirmation dialog explaining access continues until period end, and on confirmation the cancellation is processed via Razorpay and reflected in their status.
3. **Given** a student on the profile page, **When** they view the "Progress" section, **Then** they see: total tests taken, average score, current streak (consecutive days with at least one test), longest streak, and earned badges.
4. **Given** a student who has practised every day for 7 consecutive days, **When** they view their profile, **Then** a "7-day streak" indicator is shown; if they miss a day, the streak resets to 0 the following day.

---

### User Story US8 — Admin: View Platform Metrics (Priority: P5)

An Admin user logs into the admin dashboard and can view platform-level metrics: total registered users, active subscriptions by plan, total test attempts today/weekly, and top-performing students.

**Why this priority**: Admin visibility is operationally necessary but entirely internal and does not affect student-facing functionality.

**Independent Test**: Can be tested by logging in with an Admin role account and verifying the metrics dashboard loads with correct data counts.

**Acceptance Scenarios**:

1. **Given** an Admin-role user, **When** they access `/admin/dashboard`, **Then** they see: total users, subscriptions by plan (counts and revenue), test attempts (today, 7-day, 30-day), and top 10 students by score.
2. **Given** a non-Admin user, **When** they attempt to access any `/admin/**` URL, **Then** they receive HTTP 403 and are redirected to their student dashboard.
3. **Given** an Admin on the users list, **When** they search by email, **Then** they can view the user's profile, subscription status, and test history.

---

### Edge Cases

- What happens when a student loses internet connectivity mid-test? Timer continues server-side; on reconnect, remaining time is recalculated from server state.
- How does the system handle a Razorpay webhook delivered more than once (duplicate)? Webhook events are idempotent — duplicate `razorpay_payment_id` values are ignored.
- What if a student's subscription expires while they are actively taking a test? The in-progress test session completes; access gates are enforced on the next request after expiry.
- What if two users tie on the leaderboard? Both receive the same rank; the next rank is skipped (standard competition ranking).
- What happens if the Redis cache is unavailable? Leaderboard falls back to PostgreSQL queries with a cache-miss log; the platform remains functional at degraded performance.
- What if a student changes their email? Email change requires re-verification of the new address before the old one is deactivated.
- How are test questions selected to avoid repetition in back-to-back attempts? Questions are randomly sampled; the same session ID cannot be reused, but question overlap across sessions is accepted (not guaranteed unique per student).

---

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Session Management

- **FR-001**: The system MUST allow new users to register with a unique email address and a password meeting minimum complexity (8+ characters, at least one uppercase letter, one digit).
- **FR-002**: The system MUST authenticate users via email/password and issue a short-lived access token (15-minute expiry) and a long-lived refresh token (7-day expiry), both stored exclusively in `httpOnly`, `Secure`, `SameSite=Strict` cookies.
- **FR-003**: The system MUST silently refresh an expired access token using the refresh token without requiring the user to re-authenticate, unless the refresh token itself has expired or been blocklisted.
- **FR-004**: The system MUST rotate the refresh token on every use — the old token is immediately invalidated and added to a blocklist; a new token is issued.
- **FR-005**: The system MUST invalidate all active tokens for a user on explicit logout by adding the refresh token to the blocklist.
- **FR-006**: The system MUST enforce rate limiting on the login endpoint: maximum 5 failed attempts per IP within 15 minutes, after which the IP is blocked for 15 minutes.
- **FR-007**: The system MUST support role-based access control with at minimum two roles: `STUDENT` and `ADMIN`. Role is assigned at registration (default: STUDENT) and can be elevated by an Admin.
- **FR-008**: The system architecture MUST accommodate future addition of OAuth2 Google login without requiring structural changes to the auth layer.
- **FR-008a**: The system MUST support password reset via email: a time-limited, single-use reset token (1-hour expiry) is generated, emailed to the registered address via Spring Mail (Gmail SMTP), and invalidated immediately on use or expiry.
- **FR-008b**: The User entity MUST include an `emailVerified` boolean field (default `false`) to support future email verification without requiring a schema migration.

#### Subscription & Billing

- **FR-009**: The system MUST define subscription plans: Free (no billing), Basic Monthly, Basic Yearly, Pro Monthly, Pro Yearly — each with a distinct content access tier.
- **FR-010**: The system MUST integrate with Razorpay Subscriptions API to create, manage, and cancel recurring subscription plans in INR.
- **FR-011**: The system MUST expose a Razorpay webhook endpoint that verifies the webhook signature before processing any event, rejecting unsigned or incorrectly signed requests with HTTP 400.
- **FR-012**: The system MUST process the following Razorpay webhook events and update subscription state accordingly: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.expired`, `subscription.halted`.
- **FR-013**: The system MUST track subscription state per user: `FREE`, `ACTIVE`, `GRACE_PERIOD`, `EXPIRED`, `CANCELLED`.
- **FR-014**: The system MUST apply a 3-day grace period after a subscription's billing failure or expiry before revoking paid-tier content access.
- **FR-015**: The system MUST display a prominent grace period warning banner to users in the `GRACE_PERIOD` state on every page.

#### Content Access Control

- **FR-016**: The system MUST enforce content access tiers: Free users can access a maximum of 10 questions per topic per day (randomly sampled on each session); Basic and Pro users have full access to all questions with no daily limit.
- **FR-017**: The system MUST return content-access decisions from the backend API — the frontend MUST NOT be the sole enforcer of access control. Content JSON files reside in `src/assets/content/` and are fetched directly by the Angular frontend from static hosting; the API validates entitlement before Angular renders any practice page but does NOT serve the content files themselves.
- **FR-018**: The system MUST redirect unauthenticated users who access protected routes to the login page, preserving the original URL for post-login redirect.

#### Practice Tests

- **FR-019**: The system MUST allow paid-plan students to configure a practice test by selecting one or more topics and one of three fixed test modes: Quick (10 questions, 10 minutes), Standard (25 questions, 30 minutes), or Full (50 questions, 60 minutes). Questions are drawn randomly from the selected topic pool, weighted by difficulty (40% easy, 40% medium, 20% hard).
- **FR-020**: The system MUST create a server-side test session on test start, recording: `userId`, test configuration, selected question IDs, start timestamp, and time limit.
- **FR-021**: The system MUST auto-submit any test session that reaches its time limit, marking all unanswered questions as incorrect.
- **FR-022**: The system MUST persist each test attempt with: `userId`, `testSessionId`, `topicIds`, `questionCount`, `correctCount`, `timeTakenSeconds`, `rawScore`, `weightedScore`, `percentileRank`, `createdAt`.
- **FR-022a**: The system MUST calculate raw score using CBSE board scoring: +4 for each correct answer, −1 for each incorrect answer, 0 for each skipped (unanswered) question. Maximum possible raw score for a test = `questionCount × 4`.
- **FR-023**: The system MUST calculate a difficulty-weighted score: each question has a difficulty weight (easy=1, medium=2, hard=3); weighted score = sum of (weight × correctness) / sum of weights × 100.
- **FR-024**: The system MUST calculate a student's percentile rank among all attempts with the same test configuration (same topics, same test mode) within the last 30 days at the time of submission.
- **FR-025**: The system MUST resume an in-progress test session if the student reconnects within the remaining time window, returning the remaining time based on server-recorded start timestamp.
- **FR-026**: The system MUST reject duplicate test session submission attempts (idempotent submission using `testSessionId`).

#### Leaderboard & Progress

- **FR-027**: The system MUST maintain a global leaderboard ranking users by cumulative weighted score across all test attempts.
- **FR-028**: The system MUST maintain per-topic leaderboards ranking users by cumulative weighted score within each topic.
- **FR-029**: The system MUST maintain a weekly leaderboard that resets every Monday at 00:00 IST; only attempts within the current week count.
- **FR-030**: The system MUST push leaderboard updates to connected clients via WebSocket using the STOMP protocol at endpoint `/ws/leaderboard` within 3 seconds of a new test submission. Clients connect on leaderboard page load and receive push updates on score changes.
- **FR-031**: The system MUST assign rank badges based on global percentile: Platinum (top 1%), Gold (top 10%), Silver (top 25%), Bronze (top 50%).
- **FR-031a**: The system MUST restrict exact numerical rank visibility on all leaderboards to Pro-tier subscribers only. Free and Basic subscribers MUST see only their percentile bucket (e.g., "Top 25%"), not their exact rank position. The top 10 leaderboard entries are visible to all logged-in users.
- **FR-031b**: The system MUST award the following achievement badges automatically when their conditions are met: First Test (user completes their first test), Week Warrior (user completes at least one test on 7 consecutive calendar days in IST), Century (user completes 100 tests total), Sharp Shooter (raw score ≥ 90% of maximum in any single test), Topper (user's rank appears in the top 10 of any leaderboard scope).
- **FR-032**: The system MUST track user streaks: a streak increments when a student completes at least one test on a calendar day (IST); missing a day resets the streak to 0.
- **FR-033**: The system MUST provide a student progress summary including: total tests taken, average score, current streak, longest streak, and all earned badges.

#### Admin

- **FR-034**: The system MUST restrict all `/api/admin/**` endpoints to users with the `ADMIN` role, returning HTTP 403 for all others.
- **FR-035**: The system MUST provide an admin metrics endpoint returning: total registered users, active subscriptions per plan, test attempts (daily/weekly/monthly), and top 10 students by cumulative score.
- **FR-035a**: The system MUST allow `ADMIN`-role users to create and update subscription plans (name, billing cycle, price in INR, Razorpay Plan ID, active status) via the API. No admin UI is required at launch.
- **FR-035b**: The system MUST allow `ADMIN`-role users to retrieve a paginated list of all users (with subscription status and plan) and all test attempts via the API for operational monitoring.

---

### Non-Functional Requirements

- **NFR-001 — Performance**: The 95th percentile API response time for all student-facing endpoints (excluding payment webhooks and leaderboard WebSocket) MUST be under 200 milliseconds under normal load.
- **NFR-002 — Scalability**: The system MUST support at least **3000 concurrent authenticated users on peak exam days** without degradation beyond NFR-001 limits. This is achieved via: Java 21 virtual threads (Project Loom), HikariCP connection pool tuned to database limits, Redis caching for hot read paths (leaderboard top-10, entitlement checks), and stateless JWT design enabling horizontal scaling. The platform must continue operating normally at 500 concurrent users on ordinary days. Architecture must allow horizontal scaling of the Spring Boot service (add Railway replicas) without code changes.
- **NFR-003 — Mobile-First**: All UI screens MUST be usable on a 360×800px viewport (Android phone); no horizontal scrolling on primary flows.
- **NFR-004 — Security — Injection**: All database interactions MUST use parameterised queries via JPA/Hibernate; raw string concatenation in queries is prohibited.
- **NFR-005 — Security — XSS**: All user-supplied content rendered in the UI MUST be sanitised; Angular's built-in sanitisation MUST not be bypassed (`bypassSecurityTrust*` methods require explicit justification).
- **NFR-006 — Security — Auth Storage**: Access and refresh tokens MUST be stored only in `httpOnly` cookies. Storage in `localStorage` or `sessionStorage` is prohibited.
- **NFR-007 — Security — Webhook Integrity**: The Razorpay webhook endpoint MUST verify the `X-Razorpay-Signature` HMAC header using the webhook secret before any state mutation.
- **NFR-008 — Security — Rate Limiting**: Auth endpoints (`/api/v1/auth/login`, `/api/v1/auth/register`) MUST enforce rate limiting (FR-006). Exceeding the limit returns HTTP 429.
- **NFR-009 — Security — Secrets Management**: No credentials, API keys, or secrets MAY appear in source code or committed configuration files. All secrets MUST be injected via environment variables or a secrets manager.
- **NFR-010 — Availability**: The platform MUST target 99.5% monthly uptime for student-facing endpoints, excluding scheduled maintenance windows communicated 24 hours in advance.
- **NFR-011 — Data Integrity**: PostgreSQL MUST be the system of record for all subscription, user, and test attempt data. Redis is used for caching and real-time features only; Redis loss MUST NOT cause data loss.
- **NFR-012 — Test Coverage**: All backend API endpoints MUST have integration tests using Testcontainers (real PostgreSQL and Redis instances). Unit test coverage for business logic MUST be ≥ 80%.
- **NFR-013 — Containerisation**: PostgreSQL and Redis MUST be containerised via Docker Compose for local development. The Spring Boot service MUST be containerisable with a single `docker build` command.
- **NFR-014 — CI/CD**: Every push to `main` MUST trigger a GitHub Actions pipeline that: compiles, runs all tests, builds Docker image, and (on success) deploys to Railway.
- **NFR-015 — API Documentation**: All REST endpoints MUST be documented via Springdoc OpenAPI 3 and accessible at `/swagger-ui.html` in non-production environments.
- **NFR-015a — API Base Path & Public Endpoints**: All REST API endpoints MUST use the `/api/v1/` prefix. The following endpoints are publicly accessible without JWT authentication: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/plans`. All other endpoints require a valid JWT access token in an `httpOnly` cookie.
- **NFR-016 — OWASP Compliance**: The system MUST address OWASP Top 10: A01 (RBAC enforced), A02 (bcrypt password hashing, JWT in httpOnly cookies), A03 (parameterised queries), A05 (security headers via Spring Security), A07 (auth rate limiting + token rotation), A09 (structured application logging without PII).
- **NFR-017 — Data Retention & User Purge**: The system MUST support configurable automatic purge of inactive user accounts. A scheduled job runs daily and permanently deletes (hard-delete cascade) the `User` record and all associated data (subscriptions, test attempts, leaderboard entries, badges) for accounts where `lastLoginAt < NOW() - USER_RETENTION_DAYS`. `USER_RETENTION_DAYS` defaults to `1095` (3 years) and MUST be configurable via environment variable without code change. Before deletion, the job MUST log the user ID (not PII) and deletion reason to the audit log. Users with an active paid subscription are excluded from purge regardless of last login date.
- **NFR-018 — Structured Logging**: The backend MUST use SLF4J + Logback with JSON-structured output (Logstash encoder). Log level MUST be configurable at runtime via the `LOG_LEVEL` environment variable (default `INFO`; allowed values: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`). Logs MUST be shipped to **Papertrail** (free tier: 100 MB/month, 48-hour search) via syslog drain on Railway. Logs MUST NOT contain passwords, JWT tokens, raw payment data, or any PII (name/email may appear only at DEBUG level and only in dev profile). Each log entry MUST include: timestamp, log level, correlation/request ID (`X-Request-Id` header or generated UUID), Spring bean name, and message. Error logs MUST include the full stack trace. Minimum log events: every inbound HTTP request (INFO: method, path, status, duration), every auth event (INFO: login success/fail — user ID only), every webhook received (INFO: event type, Razorpay event ID), every scheduled job start/end (INFO).
- **NFR-019 — UI Quality & Performance**: The Angular frontend MUST meet the following standards: (a) **Visual design**: use a consistent design system with defined colour palette (primary, secondary, accent, neutral), inter/system font stack, 4px base spacing grid, card-based layouts, and smooth CSS transitions (200–300ms) on interactive elements; (b) **Responsiveness**: mobile-first, fluid grid, tested at 360px (phone), 768px (tablet), 1280px (desktop); (c) **Perceived performance**: skeleton loading screens on all data-fetching routes (no blank/spinner-only states), Angular route preloading strategy, lazy-loaded feature modules; (d) **Accessibility**: WCAG 2.1 AA for colour contrast on primary flows; keyboard navigation for forms; (e) **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, FID < 100ms on Vercel production (measured with Lighthouse in CI).

---

## Key Entities

- **User**: Represents a registered platform user. Attributes: `id`, `email` (unique), `passwordHash`, `displayName`, `avatarUrl`, `role` (STUDENT/ADMIN), `emailVerified` (boolean, default `false`), `createdAt`, `lastLoginAt`, `scheduledPurgeAt` (set to `lastLoginAt + USER_RETENTION_DAYS`; recomputed on every login; null for users with active paid subscriptions). Relationships: has one Subscription, has many TestAttempts, has one ProgressSummary.

- **Subscription**: Tracks a user's current plan and billing status. Attributes: `id`, `userId`, `planId`, `razorpaySubscriptionId`, `status` (FREE/ACTIVE/GRACE_PERIOD/EXPIRED/CANCELLED), `currentPeriodStart`, `currentPeriodEnd`, `gracePeriodEnd`, `cancelledAt`. Relationships: belongs to User, belongs to Plan.

- **Plan**: Defines available subscription tiers. Attributes: `id`, `name` (Free/Basic/Pro), `billingCycle` (monthly/yearly/none), `priceINR`, `razorpayPlanId`, `maxQuestionsPerTopic` (null = unlimited), `isActive`. Relationships: has many Subscriptions.

- **TestSession**: Represents an in-progress or completed test instance. Attributes: `id`, `userId`, `topicIds`, `questionIds` (ordered list), `questionCount`, `timeLimitSeconds`, `startedAt`, `submittedAt`, `status` (IN_PROGRESS/SUBMITTED/EXPIRED), `answers` (JSON map of questionId → selectedOptionId). Relationships: belongs to User, has one TestAttempt on completion.

- **TestAttempt**: The immutable record of a completed test. Attributes: `id`, `userId`, `testSessionId`, `topicIds`, `questionCount`, `correctCount`, `timeTakenSeconds`, `rawScore`, `weightedScore`, `percentileRank`, `createdAt`. Relationships: belongs to User, belongs to TestSession.

- **Question**: Represents a single practice question sourced from existing content. Attributes: `id`, `topicId`, `type` (MCQ/SQL/PYTHON), `text`, `options` (JSON), `correctOptionId`, `difficultyWeight` (1/2/3), `classLevel` (11/12), `sourceFile`. Relationships: belongs to Topic, referenced by many TestSessions.

- **Topic**: Represents a content area. Attributes: `id`, `name`, `classLevel`, `type` (MCQ/SQL/PYTHON), `totalQuestions`. Relationships: has many Questions.

- **LeaderboardEntry**: A materialised view or Redis sorted-set entry. Attributes: `userId`, `displayName`, `badgeLevel`, `cumulativeScore`, `testsCount`, `scope` (GLOBAL/TOPIC/WEEKLY), `scopeKey` (topicId or week identifier), `rank`, `updatedAt`.

- **Badge**: Represents an earned achievement. Attributes: `id`, `userId`, `badgeType` (rank percentile badges: `BRONZE`, `SILVER`, `GOLD`, `PLATINUM`; achievement badges: `FIRST_TEST`, `WEEK_WARRIOR`, `CENTURY`, `SHARP_SHOOTER`, `TOPPER`), `awardedAt`, `context` (e.g., "SQL Class 12 leaderboard — top 10"). Relationships: belongs to User.

- **WebhookEvent**: Audit log of incoming Razorpay webhook events. Attributes: `id`, `razorpayEventId`, `eventType`, `payload` (JSON), `processedAt`, `status` (PROCESSED/FAILED/DUPLICATE). Ensures idempotency and auditability.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 — Registration Flow**: A new student can complete registration through to first dashboard view in under 90 seconds on a mid-range Android phone on a 4G connection.
- **SC-002 — Login Performance**: 95% of login requests complete (token issued and dashboard rendered) in under 2 seconds end-to-end.
- **SC-003 — Subscription Activation Latency**: After a successful Razorpay payment, the student's plan upgrade is reflected in the UI within 10 seconds of payment completion.
- **SC-004 — Test Submission Throughput**: The platform can handle **200 simultaneous test submissions** (peak exam-day scenario) without any submission failing or returning an error. Verified by a k6/Gatling load test.
- **SC-005 — API Response Time at Peak Load**: 95th percentile response time for all student-facing API endpoints is under 200 milliseconds under a load of **3000 concurrent users** (exam-day simulation). Verified by k6 load test script committed to repo.
- **SC-006 — Leaderboard Freshness**: Leaderboard rankings update on all connected clients within 3 seconds of a test being submitted, verified by automated integration test.
- **SC-007 — Score Accuracy**: Difficulty-weighted scores and percentile ranks are calculated correctly for 100% of submitted test attempts, verified by a dedicated test suite with known fixtures.
- **SC-008 — Security Baseline**: Zero high or critical findings from an OWASP ZAP baseline scan run against the staging environment; webhook signature rejection rate 100% for unsigned requests in automated tests.
- **SC-009 — Content Access Enforcement**: Free-plan users are never served more than 10 questions per topic from the API regardless of client-side manipulation; verified by API-level integration tests.
- **SC-010 — CI/CD Pipeline**: Every merge to `main` results in a successful automated deployment to the staging environment within 10 minutes, with no manual steps required.
- **SC-011 — Test Coverage**: Backend integration test suite achieves ≥ 80% line coverage for business logic classes; all API endpoints have at least one happy-path and one error-path integration test.
- **SC-012 — Mobile Usability**: All primary student flows (login, take test, view results, view leaderboard) are completable on a 360px-wide viewport without horizontal scrolling.
- **SC-013 — Data Retention Purge**: The daily purge job correctly identifies and deletes all user records (and cascade data) with `lastLoginAt` older than `USER_RETENTION_DAYS`, skips users with active paid subscriptions, and writes an audit log entry for each deletion. Verified by integration test with known fixture data.
- **SC-014 — Log Observability**: In a staging environment, when an API error occurs (HTTP 5xx), the full stack trace with correlation ID appears in Papertrail within 30 seconds of the error. Log level change via `LOG_LEVEL` environment variable takes effect within 60 seconds without restart.
- **SC-015 — UI Core Web Vitals**: Lighthouse CI score on the production Vercel URL achieves LCP < 2.5s, CLS < 0.1, and Performance score ≥ 85 on mobile (simulated 4G throttle).

---

## Assumptions

- Target students are Class 11 and Class 12 CBSE Computer Science students in India; the primary device is an Android smartphone on a 4G connection.
- Existing static content files (`src/assets/content/`) are the authoritative question source; they will be imported into PostgreSQL during initial setup via a migration script.
- Razorpay is the only payment gateway in scope; all billing is in INR.
- Email verification at account registration is deferred from v1 launch; the User entity includes an `emailVerified` boolean field (default `false`) to allow future email verification without a schema migration. Welcome emails are out of scope for v1.
- Password reset via email is in scope for v1, implemented using Spring Mail with Gmail SMTP (environment variables: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`). Subscription expiry warning emails are out of scope for v1 but the architecture supports future integration.
- OAuth2 Google login is future scope; the auth module must be structured so it can be added without re-architecting the token or session model.
- "Teacher" and "Parent" roles are future scope; the RBAC system must allow new roles to be added without schema changes beyond inserting new role values.
- The admin dashboard is internal-use only and does not require the same performance SLAs as the student-facing platform.
- A question's `difficultyWeight` is pre-assigned in the content files or set to `1` (easy) by default during import if not specified.
- Weekly leaderboard resets are implemented as a scheduled job (cron) running at Monday 00:00 IST; no manual trigger is required.
- User data retention is controlled by `USER_RETENTION_DAYS` environment variable (default `1095` = 3 years). The daily purge job deletes accounts inactive beyond this threshold, excluding those with active paid subscriptions. This design reduces long-term database size without requiring manual cleanup.
- The existing GitHub Pages deployment of the static SPA continues to function during development; the new platform is deployed independently until feature parity allows cutover.

---

## Future Scope

- **OAuth2 Google Login**: Social sign-in via Google (architecture accommodated in FR-008).
- **Teacher & Parent Roles**: Teachers can assign tests to students; parents can view their child's progress dashboard.
- **Content Management via API**: Replace the dev-only admin editor (Feature 002) with a fully authenticated CMS backed by the new API.
- **Detailed Analytics Dashboard**: Per-student and cohort-level analytics showing weak areas, improvement trends, and recommended topics.
- **Push Notifications**: Browser push and/or WhatsApp notifications for streak reminders, leaderboard position changes, and subscription renewal warnings.
- **AI-Powered Hints**: On-demand AI-generated hints for questions, powered by a large language model integration.
- **Offline Mode**: Service worker caching of question content for offline practice, with score sync on reconnect.
- **Certificate Generation**: Auto-generated performance certificates for students who achieve top ranks or complete topic mastery.

---

## Out of Scope

- **Non-INR billing or multi-currency support** — the platform is India-first; international billing will be evaluated separately.
- **Native mobile apps (iOS/Android)** — the platform is a mobile-first PWA; native apps are not part of this feature.
- **Content creation or editing by students** — only Admins (and future Teachers) can manage content.
- **Live video classes or synchronous learning sessions** — the platform is asynchronous, self-paced practice only.
- **Integration with external LMS platforms** (e.g., Moodle, Google Classroom) — standalone platform only.
- **CBSE board exam question papers or official NCERT integration** — content is custom-authored; no official affiliation.
- **Bulk/institutional licensing or school-level billing** — individual subscriptions only in this release.
- **Customer support ticketing or in-app chat** — users contact support via email; no in-app support tooling.

---

## Infrastructure

### Local Development

A `docker-compose.yml` at the repository root provides the full local stack:

| Service | Image | Port |
|---|---|---|
| PostgreSQL | `postgres:16` | 5432 |
| Redis | `redis:7` | 6379 |
| Spring Boot API | Custom image | 8080 |
| Angular dev server | Node image | 4200 |

### Required Environment Variables

All secrets are injected via environment variables. No credentials appear in source code or committed config files (NFR-009).

| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USER` | PostgreSQL username |
| `DB_PASS` | PostgreSQL password |
| `REDIS_URL` | Redis connection URL |
| `JWT_SECRET` | HMAC secret for JWT signing (min 256-bit) |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook HMAC secret |
| `SMTP_HOST` | SMTP host (e.g., `smtp.gmail.com`) |
| `SMTP_USER` | SMTP username / Gmail address |
| `SMTP_PASS` | SMTP password or app password |
| `VITE_API_URL` | (Frontend only) Base URL of the Railway API |

### Production Deployment

- **API**: Deployed to Railway as a standalone service running the Spring Boot Docker image.
- **PostgreSQL**: Railway managed PostgreSQL 16 instance (separate Railway service).
- **Redis**: Railway managed Redis 7 instance (separate Railway service).
- **Angular Frontend**: Deployed to Vercel; `VITE_API_URL` environment variable points to the Railway API base URL.
- **CI/CD**: GitHub Actions pipeline on push to `main` — compile → test → build Docker image → deploy to Railway (NFR-014).
