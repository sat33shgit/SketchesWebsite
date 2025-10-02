-- Analytics schema for tracking page visits
-- Run this SQL in your Postgres database

CREATE TABLE IF NOT EXISTS page_visits (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL, -- 'home', 'about', 'contact', 'sketch'
    page_id VARCHAR(100), -- sketch_id for sketch pages, null for other pages
    visit_count INTEGER DEFAULT 1,
    country VARCHAR(100), -- country from where the user is visiting
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Create unique constraint to prevent duplicate entries
    UNIQUE(page_type, page_id, country)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_visits_type ON page_visits(page_type);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_id ON page_visits(page_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_country ON page_visits(country);

-- Create a view for easy analytics queries
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    page_type,
    page_id,
    SUM(visit_count) as total_visits,
    COUNT(DISTINCT country) as unique_countries,
    MAX(updated_at) as last_visit
FROM page_visits 
GROUP BY page_type, page_id
ORDER BY total_visits DESC;

-- Insert some sample data (optional)
-- INSERT INTO page_visits (page_type, page_id, visit_count, country) VALUES
-- ('home', NULL, 1, 'United States'),
-- ('sketch', 'african-boy', 1, 'India'),
-- ('about', NULL, 1, 'United States');