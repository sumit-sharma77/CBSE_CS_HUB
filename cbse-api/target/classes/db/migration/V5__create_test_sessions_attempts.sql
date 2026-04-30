-- V5: Create test_sessions and test_attempts tables
CREATE TABLE IF NOT EXISTS test_sessions (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES users(id),
    topic_ids        JSONB       NOT NULL,
    question_ids     JSONB       NOT NULL,
    mode             VARCHAR(20) NOT NULL,  -- QUICK | STANDARD | FULL
    question_count   INT         NOT NULL,
    time_limit_seconds INT       NOT NULL,
    started_at       TIMESTAMPTZ NOT NULL,
    submitted_at     TIMESTAMPTZ,
    status           VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    -- Status values: IN_PROGRESS | SUBMITTED | EXPIRED
    answers          JSONB       -- map: questionId -> selectedOptionId
);

CREATE INDEX IF NOT EXISTS idx_test_sessions_user
    ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status
    ON test_sessions(status);

CREATE TABLE IF NOT EXISTS test_attempts (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID        NOT NULL REFERENCES users(id),
    session_id        UUID        NOT NULL UNIQUE REFERENCES test_sessions(id),
    topic_ids         JSONB,
    mode              VARCHAR(20),
    question_count    INT,
    correct_count     INT         NOT NULL DEFAULT 0,
    incorrect_count   INT         NOT NULL DEFAULT 0,
    skipped_count     INT         NOT NULL DEFAULT 0,
    raw_score         INT         NOT NULL DEFAULT 0,
    max_score         INT         NOT NULL DEFAULT 0,
    weighted_score    NUMERIC(6,2) NOT NULL DEFAULT 0,
    percentile_rank   NUMERIC(5,2),
    time_taken_seconds INT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user
    ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_created
    ON test_attempts(user_id, created_at DESC);
