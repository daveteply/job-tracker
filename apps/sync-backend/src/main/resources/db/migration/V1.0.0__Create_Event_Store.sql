-- file: 001_create_event_store.sql

CREATE TABLE IF NOT EXISTS sync_events (
    -- Unique ID for this specific event
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Which user owns this data (for your future "Upgrade" plan)
    user_id VARCHAR(255) NOT NULL,
    
    -- The type of event (e.g., 'INSERT', 'UPDATE', 'DELETE')
    event_op VARCHAR(50) NOT NULL,
    
    -- The RxDB Document ID this event refers to
    document_id VARCHAR(255) NOT NULL,
    
    -- The actual data change
    payload JSONB NOT NULL,
    
    -- Strictly increasing version for this specific document
    -- Useful for conflict resolution later
    version INT NOT NULL,
    
    -- The "Checkpoint" - used by RxDB to know where it left off
    server_timestamp BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- Index for fast "Pull" requests
CREATE INDEX idx_user_timestamp ON sync_events (user_id, server_timestamp);

-- Index for finding the history of a specific contact
CREATE INDEX idx_doc_id ON sync_events (document_id);
