-- V13: Ensure purge index exists (idempotent; index may already exist from V1).
-- Using CONCURRENTLY is not supported inside a transaction, so we check existence first.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename  = 'users'
          AND indexname  = 'idx_users_purge'
    ) THEN
        CREATE INDEX idx_users_purge
            ON users(scheduled_purge_at)
            WHERE scheduled_purge_at IS NOT NULL;
    END IF;
END $$;
