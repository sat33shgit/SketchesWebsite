-- Migration script to remove ip_hash and user_agent_hash columns and add country column
-- Run this SQL in your Postgres database

-- Step 1: Drop the unique constraint that includes ip_hash and user_agent_hash
ALTER TABLE page_visits DROP CONSTRAINT IF EXISTS page_visits_page_type_page_id_ip_hash_user_agent_hash_key;

-- Step 2: Drop the columns
ALTER TABLE page_visits DROP COLUMN IF EXISTS ip_hash CASCADE;
ALTER TABLE page_visits DROP COLUMN IF EXISTS user_agent_hash CASCADE;

-- Step 3: Add the country column
ALTER TABLE page_visits ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Step 4: Create a new unique constraint without the hash columns
-- This ensures one record per page per country
ALTER TABLE page_visits ADD CONSTRAINT page_visits_unique_page_country 
  UNIQUE(page_type, page_id, country);

-- Step 5: Create index on country for better query performance
CREATE INDEX IF NOT EXISTS idx_page_visits_country ON page_visits(country);

-- Step 6: Update the analytics_summary view to remove ip_hash reference
DROP VIEW IF EXISTS analytics_summary;

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

-- Migration completed successfully
-- Note: Existing data will be preserved, but ip_hash and user_agent_hash columns will be removed
