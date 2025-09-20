const express = require('express');
const cors = require('cors');
const { sql } = require('@vercel/postgres');
require('dotenv/config');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Analytics track endpoint
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { pageType, pageId } = req.body;
    
    if (!pageType) {
      return res.status(400).json({ error: 'pageType is required' });
    }

    // Get IP and User Agent for basic deduplication
    const clientIP = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Create simple hashes
    const crypto = require('crypto');
    const ipHash = crypto.createHash('sha256').update(clientIP).digest('hex');
    const userAgentHash = crypto.createHash('sha256').update(userAgent).digest('hex');

    // Insert or update visit count
    await sql`
      INSERT INTO page_visits (page_type, page_id, visit_count, ip_hash, user_agent_hash) 
      VALUES (${pageType}, ${pageId || null}, 1, ${ipHash}, ${userAgentHash})
      ON CONFLICT (page_type, page_id, ip_hash, user_agent_hash) 
      DO UPDATE SET 
        visit_count = page_visits.visit_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `;

    res.json({ 
      success: true, 
      message: `Visit tracked for ${pageType}${pageId ? ` (${pageId})` : ''}` 
    });

  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ 
      error: 'Failed to track visit',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Analytics stats endpoint
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const { pageType, timeframe = '30d' } = req.query;

    let timeCondition = '';
    switch (timeframe) {
      case '7d':
        timeCondition = "AND created_at >= NOW() - INTERVAL '7 days'";
        break;
      case '30d':
        timeCondition = "AND created_at >= NOW() - INTERVAL '30 days'";
        break;
      case '90d':
        timeCondition = "AND created_at >= NOW() - INTERVAL '90 days'";
        break;
      case 'all':
        timeCondition = '';
        break;
      default:
        timeCondition = "AND created_at >= NOW() - INTERVAL '30 days'";
    }

    // Get overall stats
    let overallStats;
    if (pageType && timeCondition) {
      overallStats = await sql.unsafe(`
        SELECT 
          page_type,
          COUNT(*) as visit_records,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM page_visits 
        WHERE 1=1 ${timeCondition}
          AND page_type = '${pageType}'
        GROUP BY page_type
        ORDER BY total_visits DESC
      `);
    } else if (pageType) {
      overallStats = await sql.unsafe(`
        SELECT 
          page_type,
          COUNT(*) as visit_records,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM page_visits 
        WHERE page_type = '${pageType}'
        GROUP BY page_type
        ORDER BY total_visits DESC
      `);
    } else if (timeCondition) {
      overallStats = await sql.unsafe(`
        SELECT 
          page_type,
          COUNT(*) as visit_records,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM page_visits 
        WHERE 1=1 ${timeCondition}
        GROUP BY page_type
        ORDER BY total_visits DESC
      `);
    } else {
      overallStats = await sql`
        SELECT 
          page_type,
          COUNT(*) as visit_records,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM page_visits 
        GROUP BY page_type
        ORDER BY total_visits DESC
      `;
    }

    // Get detailed stats by page
    let detailedStats;
    if (pageType && timeCondition) {
      detailedStats = await sql.unsafe(`
        SELECT 
          page_type,
          page_id,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          MAX(updated_at) as last_visit,
          MIN(created_at) as first_visit
        FROM page_visits 
        WHERE 1=1 ${timeCondition}
          AND page_type = '${pageType}'
        GROUP BY page_type, page_id
        ORDER BY total_visits DESC
        LIMIT 100
      `);
    } else if (pageType) {
      detailedStats = await sql.unsafe(`
        SELECT 
          page_type,
          page_id,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          MAX(updated_at) as last_visit,
          MIN(created_at) as first_visit
        FROM page_visits 
        WHERE page_type = '${pageType}'
        GROUP BY page_type, page_id
        ORDER BY total_visits DESC
        LIMIT 100
      `);
    } else if (timeCondition) {
      detailedStats = await sql.unsafe(`
        SELECT 
          page_type,
          page_id,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          MAX(updated_at) as last_visit,
          MIN(created_at) as first_visit
        FROM page_visits 
        WHERE 1=1 ${timeCondition}
        GROUP BY page_type, page_id
        ORDER BY total_visits DESC
        LIMIT 100
      `);
    } else {
      detailedStats = await sql`
        SELECT 
          page_type,
          page_id,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          MAX(updated_at) as last_visit,
          MIN(created_at) as first_visit
        FROM page_visits 
        GROUP BY page_type, page_id
        ORDER BY total_visits DESC
        LIMIT 100
      `;
    }

    // Get top sketches specifically  
    let topSketches;
    if (timeCondition) {
      topSketches = await sql.unsafe(`
        SELECT 
          page_id as sketch_id,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          MAX(updated_at) as last_visit
        FROM page_visits 
        WHERE page_type = 'sketch' 
        ${timeCondition}
        GROUP BY page_id
        ORDER BY total_visits DESC
        LIMIT 20
      `);
    } else {
      topSketches = await sql`
        SELECT 
          page_id as sketch_id,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          MAX(updated_at) as last_visit
        FROM page_visits 
        WHERE page_type = 'sketch'
        GROUP BY page_id
        ORDER BY total_visits DESC
        LIMIT 20
      `;
    }

    // Get recent activity
    const recentActivity = await sql`
      SELECT 
        page_type,
        page_id,
        visit_count,
        updated_at
      FROM page_visits 
      WHERE updated_at >= NOW() - INTERVAL '24 hours'
      ORDER BY updated_at DESC
      LIMIT 50
    `;

    res.json({
      success: true,
      timeframe,
      data: {
        overall: overallStats.rows,
        detailed: detailedStats.rows,
        topSketches: topSketches.rows,
        recentActivity: recentActivity.rows
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Analytics API server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});