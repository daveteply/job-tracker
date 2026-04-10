-- V1.1.0__Add_Collection_Name.sql
ALTER TABLE sync_events ADD COLUMN IF NOT EXISTS collection_name VARCHAR(255);
UPDATE sync_events SET collection_name = 'events' WHERE collection_name IS NULL;
ALTER TABLE sync_events ALTER COLUMN collection_name SET NOT NULL;

-- Index for better filtering on pull
DROP INDEX IF EXISTS idx_user_timestamp;
CREATE INDEX IF NOT EXISTS idx_user_collection_timestamp ON sync_events (user_id, collection_name, server_timestamp);
