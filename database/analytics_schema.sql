-- Analytics schema for tracking page visits
-- Run this SQL in your Postgres database

CREATE TABLE IF NOT EXISTS page_visits (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL, -- 'home', 'about', 'contact', 'sketch'
    page_id VARCHAR(100), -- sketch_id for sketch pages, null for other pages
    visit_count INTEGER DEFAULT 1,
    ip_hash VARCHAR(64), -- optional: hash of IP for basic deduplication
    user_agent_hash VARCHAR(64), -- optional: hash of user agent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Create unique constraint to prevent duplicate entries
    UNIQUE(page_type, page_id, ip_hash, user_agent_hash)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_visits_type ON page_visits(page_type);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_id ON page_visits(page_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);

-- Create a view for easy analytics queries
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    page_type,
    page_id,
    SUM(visit_count) as total_visits,
    COUNT(DISTINCT ip_hash) as unique_visitors,
    MAX(updated_at) as last_visit
FROM page_visits 
GROUP BY page_type, page_id
ORDER BY total_visits DESC;

-- Insert some sample data (optional)
-- INSERT INTO page_visits (page_type, page_id, visit_count, ip_hash) VALUES
-- ('home', NULL, 1, 'sample_hash_1'),
-- ('sketch', 'african-boy', 1, 'sample_hash_2'),
-- ('about', NULL, 1, 'sample_hash_1');