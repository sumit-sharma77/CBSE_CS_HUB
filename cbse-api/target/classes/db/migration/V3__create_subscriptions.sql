-- V3: Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id                  BIGINT      NOT NULL REFERENCES plans(id),
    razorpay_subscription_id VARCHAR(100) UNIQUE,
    status                   VARCHAR(20) NOT NULL DEFAULT 'FREE',
    -- Status values: FREE | PENDING | ACTIVE | GRACE_PERIOD | EXPIRED | CANCELLED
    current_period_start     TIMESTAMPTZ,
    current_period_end       TIMESTAMPTZ,
    grace_period_end         TIMESTAMPTZ,
    cancelled_at             TIMESTAMPTZ,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user
    ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay
    ON subscriptions(razorpay_subscription_id)
    WHERE razorpay_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_status
    ON subscriptions(status);
