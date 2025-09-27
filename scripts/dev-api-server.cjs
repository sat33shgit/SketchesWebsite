const express = require('express');
const cors = require('cors');
const validator = require('validator');
require('dotenv/config');

const { sql } = require('@vercel/postgres');

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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    // Sanitize input
    function stripTags(input) {
      return input.replace(/<\/?[^>]+(>|$)/g, "");
    }

    const cleanName = stripTags(name || '').trim();
    const cleanEmail = stripTags(email || '').trim();
    const cleanSubject = stripTags(subject || '').trim();
    const cleanMessage = stripTags(message || '').trim();

    // Validate input and enforce UI limit of 1000 characters for message
    if (
      !cleanName ||
      !cleanEmail ||
      !cleanSubject ||
      !cleanMessage ||
      cleanName.length > 100 ||
      cleanEmail.length > 255 ||
      cleanSubject.length > 200 ||
      cleanMessage.length > 1000 ||
      /<|>|script|onerror|onload|javascript:/i.test(name) ||
      /<|>|script|onerror|onload|javascript:/i.test(subject) ||
      /<|>|script|onerror|onload|javascript:/i.test(message)
    ) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or unsafe input detected.' 
      });
    }

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address.' 
      });
    }

    // Get client information for tracking
    const clientIP = req.ip || 
                    req.connection?.remoteAddress || 
                    req.socket?.remoteAddress ||
                    '127.0.0.1';
    
    const userAgent = req.get('User-Agent') || 'unknown';

    // Save the contact message to database
    // Note: the contact_messages schema doesn't include an ip_address column
    // Use the 'country' column (or NULL) and store the user agent. This keeps
    // the dev server consistent with the production serverless function.
    const dbResult = await sql`
      INSERT INTO contact_messages (
        name, 
        email, 
        subject, 
        message, 
        country,
        user_agent,
        status,
        is_read,
        created_at
      ) VALUES (
        ${cleanName}, 
        ${cleanEmail.toLowerCase()}, 
        ${cleanSubject}, 
        ${cleanMessage}, 
        ${null},
        ${userAgent},
        'new',
        false,
        CURRENT_TIMESTAMP
      )
      RETURNING id, created_at
    `;

    // Return success response with expected format
    res.json({ 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.',
      id: dbResult.rows[0].id,
      timestamp: dbResult.rows[0].created_at
    });

  } catch (error) {
    console.error('Error saving contact message to database:', error);
    
    // Return error response 
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save message. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Comments counts endpoint
app.get('/api/comments/counts', async (req, res) => {
  try {
    const { rows } = await sql`SELECT sketch_id, COUNT(*) AS count FROM comments GROUP BY sketch_id`;
    const result = {};
    rows.forEach(row => {
      result[row.sketch_id] = parseInt(row.count, 10);
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching comment counts:', error);
    res.status(500).json({ error: 'Failed to fetch comment counts' });
  }
});

// Sketches likes endpoint  
app.get('/api/sketches/likes', async (req, res) => {
  try {
    const { rows } = await sql`SELECT sketch_id, count FROM sketch_reactions WHERE smiley_type = 'like'`;
    const result = {};
    rows.forEach(row => {
      result[row.sketch_id] = row.count;
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching like counts:', error);
    res.status(500).json({ error: 'Failed to fetch like counts' });
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