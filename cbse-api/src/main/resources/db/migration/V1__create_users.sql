-- V1: Create users table
CREATE TABLE IF NOT EXISTS users (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email             VARCHAR(255) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    display_name      VARCHAR(100),
    avatar_url        VARCHAR(500),
    role              VARCHAR(20)  NOT NULL DEFAULT 'STUDENT',
    email_verified    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_login_at     TIMESTAMPTZ,
    scheduled_purge_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_purge  ON users(scheduled_purge_at)
    WHERE scheduled_purge_at IS NOT NULL;
