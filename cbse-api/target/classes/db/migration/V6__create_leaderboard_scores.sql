-- V6: Create leaderboard_scores table
CREATE TABLE IF NOT EXISTS leaderboard_scores (
    id                BIGSERIAL   PRIMARY KEY,
    user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scope             VARCHAR(20) NOT NULL,       -- GLOBAL | WEEKLY | TOPIC
    scope_key         VARCHAR(100) NOT NULL DEFAULT 'all',
    cumulative_score  BIGINT      NOT NULL DEFAULT 0,
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_lb_user_scope UNIQUE (user_id, scope, scope_key)
);

CREATE INDEX IF NOT EXISTS idx_lb_scope_score
    ON leaderboard_scores(scope, scope_key, cumulative_score DESC);
