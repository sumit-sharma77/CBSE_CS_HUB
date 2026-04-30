-- V12: Questions are loaded at runtime by ContentSyncService (@EventListener ApplicationReadyEvent).
-- ContentSyncService reads from classpath:assets/content/**/*.json and upserts via
--   INSERT ... ON CONFLICT (source_file, local_id) DO NOTHING
-- This migration is intentionally a no-op; it reserves V12 in the Flyway sequence.
SELECT 1; -- no-op
