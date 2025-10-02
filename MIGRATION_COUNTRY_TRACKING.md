# Page Visits Table Migration - Country Tracking

## Overview
This migration removes the `ip_hash` and `user_agent_hash` columns from the `page_visits` table and adds a `country` column to track visitor countries instead.

## Why This Change?

### Previous Approach
- Used IP hash and user agent hash for visitor tracking
- Privacy-focused but limited geographic insights
- Difficult to analyze visitor demographics

### New Approach
- Uses country information from Vercel/Cloudflare headers
- Provides geographic insights without storing personal data
- Easier to analyze and visualize visitor distribution
- More privacy-friendly (only country-level data)

## Migration Steps

### 1. Run the Migration Script

```bash
node scripts/migrate-page-visits.js
```

This script will:
1. Drop the old unique constraint that includes `ip_hash` and `user_agent_hash`
2. Remove the `ip_hash` column
3. Remove the `user_agent_hash` column
4. Add the `country` column
5. Create a new unique constraint: `UNIQUE(page_type, page_id, country)`
6. Create an index on the `country` column
7. Update the `analytics_summary` view to use country data

### 2. Alternative: Manual SQL Migration

If you prefer to run SQL directly, use:

```bash
psql <your_database_url> -f database/migrate_page_visits_add_country.sql
```

## Database Schema Changes

### Before
```sql
CREATE TABLE page_visits (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL,
    page_id VARCHAR(100),
    visit_count INTEGER DEFAULT 1,
    ip_hash VARCHAR(64),              -- REMOVED
    user_agent_hash VARCHAR(64),      -- REMOVED
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(page_type, page_id, ip_hash, user_agent_hash)  -- OLD CONSTRAINT
);
```

### After
```sql
CREATE TABLE page_visits (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL,
    page_type VARCHAR(100),
    visit_count INTEGER DEFAULT 1,
    country VARCHAR(100),             -- NEW COLUMN
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(page_type, page_id, country)  -- NEW CONSTRAINT
);
```

## How Country Detection Works

### In Production (Vercel)
Vercel automatically provides geolocation data through request headers:
- `x-vercel-ip-country`: Two-letter country code (e.g., "US", "IN", "GB")

### In Production (Cloudflare)
If using Cloudflare:
- `cf-ipcountry`: Two-letter country code

### Fallback
If no geolocation header is available, the system uses "Unknown"

### Code Example
```javascript
const country = req.headers['x-vercel-ip-country'] || 
                req.headers['cf-ipcountry'] || 
                'Unknown';
```

## Updated API Behavior

### Track Endpoint (`/api/analytics/track`)

**Request:**
```json
{
  "pageType": "sketch",
  "pageId": "african-boy"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Visit tracked successfully",
  "country": "IN"
}
```

### Stats Endpoint (`/api/analytics/stats`)

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": [
      {
        "page_type": "sketch",
        "total_visits": 125,
        "unique_countries": 15
      }
    ],
    "detailed": [
      {
        "page_type": "sketch",
        "page_id": "african-boy",
        "total_visits": 45,
        "unique_countries": 8,
        "last_visit": "2025-10-02T10:30:00Z"
      }
    ]
  }
}
```

## Updated Files

### Core Files
1. **database/analytics_schema.sql** - Updated table schema
2. **database/migrate_page_visits_add_country.sql** - Migration SQL script
3. **api/analytics/track.js** - Updated to capture and save country
4. **api/analytics/stats.js** - Updated to return country statistics

### Script Files
1. **scripts/migrate-page-visits.js** - Migration script
2. **scripts/add-sketch-test-data.js** - Updated test data
3. **scripts/test-manual-data.js** - Updated test data
4. **scripts/dev-api-server.cjs** - Updated local dev server

## Testing

### 1. Test Country Detection
```bash
# In production, country is automatically detected
# For local testing, you can manually set the header
curl -X POST http://localhost:3003/api/analytics/track \
  -H "Content-Type: application/json" \
  -H "x-vercel-ip-country: US" \
  -d '{"pageType": "sketch", "pageId": "african-boy"}'
```

### 2. Add Test Data
```bash
node scripts/add-sketch-test-data.js
```

### 3. Check Analytics
```bash
node scripts/check-analytics-data.js
```

### 4. View Data in Database
```sql
-- View all visits with country
SELECT page_type, page_id, visit_count, country, updated_at 
FROM page_visits 
ORDER BY updated_at DESC;

-- View analytics summary
SELECT * FROM analytics_summary;

-- Get country distribution
SELECT country, SUM(visit_count) as total_visits
FROM page_visits
GROUP BY country
ORDER BY total_visits DESC;
```

## Benefits

### Analytics Insights
- ✅ See which countries are most interested in your sketches
- ✅ Identify geographic patterns in visitor behavior
- ✅ Target marketing efforts based on geographic data

### Privacy
- ✅ No IP addresses stored (even hashed)
- ✅ No user agent information stored
- ✅ Only country-level geographic data
- ✅ GDPR compliant (no personal data)

### Performance
- ✅ Simpler queries (no hash calculations)
- ✅ Better indexes (country is more useful than hashes)
- ✅ Cleaner data structure

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Add back the old columns
ALTER TABLE page_visits ADD COLUMN ip_hash VARCHAR(64);
ALTER TABLE page_visits ADD COLUMN user_agent_hash VARCHAR(64);

-- Remove country column
ALTER TABLE page_visits DROP COLUMN country;

-- Add back old constraint
ALTER TABLE page_visits DROP CONSTRAINT page_visits_unique_page_country;
ALTER TABLE page_visits ADD CONSTRAINT page_visits_page_type_page_id_ip_hash_user_agent_hash_key 
  UNIQUE(page_type, page_id, ip_hash, user_agent_hash);

-- Restore old view
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
```

## Notes

- ⚠️ Existing data will be preserved during migration, but without country information
- ⚠️ Consider clearing old data after migration to start fresh with country tracking
- ⚠️ Update any custom queries or reports that referenced `ip_hash` or `user_agent_hash`
- ✅ The migration is safe and can be run on production without data loss
- ✅ The new schema is more efficient and provides better insights
