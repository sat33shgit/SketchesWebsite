# Analytics Implementation Guide

## Overview
This implementation provides comprehensive visit tracking for your sketches website with:
- Database storage in PostgreSQL
- Custom analytics API endpoints
- Frontend tracking hooks
- Admin dashboard for viewing analytics

## Database Setup

### 1. Run the Analytics Schema
Execute the SQL in `database/analytics_schema.sql` in your PostgreSQL database:

```sql
-- This creates the page_visits table, indexes, and analytics view
```

### 2. Database Structure
- **page_visits table**: Stores visit data with IP/user-agent hashing for privacy
- **analytics_summary view**: Provides aggregated statistics
- **Indexes**: Optimized for common query patterns

## API Endpoints

### Track Visits: POST /api/analytics/track
- Records page visits with basic deduplication
- Accepts: `{ pageType: 'home|about|contact|sketch', pageId: 'sketch-id' }`
- Hashes IP and user-agent for privacy
- Uses UPSERT to increment visit count for returning visitors

### Get Analytics: GET /api/analytics/stats
- Returns comprehensive analytics data
- Query params: `timeframe=7d|30d|90d|all`, `pageType=home|about|contact|sketch`
- Returns: overall stats, detailed breakdown, top sketches, recent activity

## Frontend Implementation

### Automatic Tracking
All pages now automatically track visits using the `useAnalytics` hook:
- **Home page** (`Gallery.jsx`): tracks as 'home'
- **About page** (`About.jsx`): tracks as 'about'  
- **Contact page** (`Contact.jsx`): tracks as 'contact'
- **Sketch detail** (`SketchDetail.jsx`): tracks as 'sketch' with sketch ID

### Development Mode
- Set `REACT_APP_ENABLE_ANALYTICS=true` in `.env` to enable tracking in development
- Otherwise, tracking is only active in production

## Admin Dashboard

### Analytics Page Features
- **Time-filtered views**: 7 days, 30 days, 90 days, all time
- **Overall statistics**: Total visits and unique visitors by page type
- **Top sketches**: Most visited sketches with detailed metrics
- **Detailed breakdown**: All pages with visit counts
- **Recent activity**: Last 24 hours of visits

### Access
Navigate to `/analytics` in your admin app to view the dashboard.

## Privacy & Performance

### Privacy Features
- IP addresses and user agents are hashed (SHA-256 + salt)
- No personally identifiable information is stored
- Basic deduplication prevents spam/bot inflation

### Performance Optimizations
- Database indexes on common query fields
- Aggregated view for fast statistics
- Client-side tracking has minimal performance impact
- API responses are paginated/limited

## Alternative: External Analytics

If you prefer external analytics tools:

### Google Analytics 4
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-focused)
```javascript
// Add to index.html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/plausible.js"></script>
```

## Testing the Implementation

### 1. Database Setup
- Run the analytics schema SQL
- Verify tables and view were created

### 2. Test API Endpoints
```bash
# Test tracking
curl -X POST http://localhost:3000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"pageType":"home"}'

# Test analytics retrieval
curl http://localhost:3000/api/analytics/stats
```

### 3. Test Frontend
- Enable tracking in development: `REACT_APP_ENABLE_ANALYTICS=true`
- Visit different pages and sketches
- Check browser console for tracking logs
- View admin analytics dashboard

### 4. Verify Data
Check your database:
```sql
SELECT * FROM page_visits ORDER BY updated_at DESC LIMIT 10;
SELECT * FROM analytics_summary;
```

## Deployment Notes

### Environment Variables
- Production: Analytics enabled by default
- Development: Set `REACT_APP_ENABLE_ANALYTICS=true` to test

### Database Migrations
The analytics tables are separate from existing data - safe to deploy without affecting current functionality.

### Admin Access
Ensure your admin app is properly secured before deploying the analytics dashboard.

## Customization Options

### Additional Metrics
You can easily extend tracking by:
- Adding more page types to the API validation
- Tracking additional events (downloads, form submissions, etc.)
- Adding custom dimensions (device type, referrer, etc.)

### Enhanced Privacy
For even stronger privacy:
- Remove IP hashing entirely
- Use session-based tracking instead
- Implement opt-out mechanisms

### Performance Tuning
For high-traffic sites:
- Add database partitioning by date
- Implement data archiving/cleanup
- Use read replicas for analytics queries