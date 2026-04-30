-- V8: Create webhook_events table (idempotency log)
CREATE TABLE IF NOT EXISTS webhook_events (
    id                 BIGSERIAL    PRIMARY KEY,
    razorpay_event_id  VARCHAR(100) NOT NULL UNIQUE,
    event_type         VARCHAR(50)  NOT NULL,
    payload            JSONB        NOT NULL,
    status             VARCHAR(20)  NOT NULL,  -- PROCESSED | FAILED | DUPLICATE
    received_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    processed_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_webhook_event_status
    ON webhook_events(razorpay_event_id, status);
