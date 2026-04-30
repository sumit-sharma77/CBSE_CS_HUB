-- V4: Create topics and questions tables
CREATE TABLE IF NOT EXISTS topics (
    id              BIGSERIAL   PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    class_level     SMALLINT    NOT NULL,  -- 11 | 12
    type            VARCHAR(20) NOT NULL,  -- MCQ | SQL | PYTHON
    total_questions INT         NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
    id                BIGSERIAL   PRIMARY KEY,
    topic_id          BIGINT      NOT NULL REFERENCES topics(id),
    question_text     TEXT        NOT NULL,
    type              VARCHAR(20) NOT NULL,  -- MCQ | SQL | PYTHON
    options           JSONB       NOT NULL,
    correct_option_id VARCHAR(10) NOT NULL,
    difficulty_weight INT         NOT NULL DEFAULT 1 CHECK (difficulty_weight BETWEEN 1 AND 3),
    source_file       VARCHAR(255),
    local_id          VARCHAR(100),          -- ID within source file for upsert idempotency
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (source_file, local_id)
);

CREATE INDEX IF NOT EXISTS idx_questions_topic
    ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty
    ON questions(topic_id, difficulty_weight);
