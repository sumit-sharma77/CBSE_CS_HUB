-- V7: Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id          BIGSERIAL   PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_type  VARCHAR(30) NOT NULL,
    -- Rank badges:        BRONZE | SILVER | GOLD | PLATINUM
    -- Achievement badges: FIRST_TEST | WEEK_WARRIOR | CENTURY | SHARP_SHOOTER | TOPPER
    awarded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    context     TEXT,

    CONSTRAINT uq_badges_user_type UNIQUE (user_id, badge_type)
);

CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_id);
