-- V2: Create plans table
CREATE TABLE IF NOT EXISTS plans (
    id                      BIGSERIAL    PRIMARY KEY,
    name                    VARCHAR(50)  NOT NULL,
    billing_cycle           VARCHAR(20)  NOT NULL,  -- NONE | MONTHLY | YEARLY
    price_inr               NUMERIC(10,2) NOT NULL DEFAULT 0,
    razorpay_plan_id        VARCHAR(100),
    max_questions_per_topic INT,                    -- NULL = unlimited
    features                JSONB        NOT NULL DEFAULT '{}',
    is_active               BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT now()
);
