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

    // Get country from request headers (simulated for dev)
    // In production, Vercel provides x-vercel-ip-country header
    const countryCode = (req.headers['x-vercel-ip-country'] || 
                    req.headers['cf-ipcountry'] || 
                    'Unknown').toUpperCase();

    function getFullCountryName(code) {
      if (!code || code === 'UNKNOWN') return 'Unknown';
      try {
        const dn = new Intl.DisplayNames(['en'], { type: 'region' });
        const name = dn.of(code);
        return (name || code).toString();
      } catch (err) {
        return code.toUpperCase();
      }
    }

    const country = getFullCountryName(countryCode);

    const normalizedPageId = pageId || pageType;

    // Insert or update visit count
    await sql`
      INSERT INTO page_visits (page_type, page_id, visit_count, country) 
      VALUES (${pageType}, ${normalizedPageId}, 1, ${country})
      ON CONFLICT (page_type, page_id, country) 
      DO UPDATE SET 
        visit_count = page_visits.visit_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `;

    res.json({ 
      success: true, 
      message: `Visit tracked for ${pageType}${pageId ? ` (${pageId})` : ''}`,
      country: country
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
  const _clientIP = req.ip || 
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
    const { rows } = await sql`
      SELECT sketch_id, COUNT(*) AS count
      FROM comments
      WHERE visible = 'Y'
      GROUP BY sketch_id
    `;
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

// Local sketch detail route for dev server
app.get('/api/sketches/:id', async (req, res) => {
  const sketchId = req.params.id;
  try {
    const { rows } = await sql`
      SELECT sketch_id AS id, sketch_name AS title, sketch_description AS description, NULL AS image_path, NULL AS orientation, sketch_completed_date AS completed_date, NULL AS category
      FROM sketches WHERE sketch_id = ${sketchId}
    `;
    if (rows && rows.length) {
      const r = rows[0];
      const rawDate = r.completed_date ?? r.sketch_completed_date
      const completedDate = rawDate ? ((rawDate instanceof Date) ? rawDate.toISOString().split('T')[0] : String(rawDate)) : null
      const sketch = {
        id: r.id,
        title: r.title,
        description: r.description,
        imagePath: r.image_path || null,
        orientation: r.orientation || null,
        completedDate,
        category: r.category || null
      };
      return res.status(200).json({ success: true, data: sketch });
    }
    return res.status(404).json({ success: false, error: 'Sketch not found' });
  } catch (err) {
    console.error('Dev GET /api/sketches/:id error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Local sketch stats route for dev server
app.get('/api/sketches/:id/stats', async (req, res) => {
  const sketchId = req.params.id;
  try {
    const { rows } = await sql`SELECT smiley_type, count FROM sketch_reactions WHERE sketch_id = ${sketchId}`;
    const mapping = {};
    rows.forEach(r => { mapping[r.smiley_type] = r.count });
    return res.status(200).json({ success: true, data: { sketchId, likes: mapping['like'] || 0, dislikes: mapping['dislike'] || 0, likedBy: [], dislikedBy: [] } });
  } catch (err) {
    console.error('Dev GET /api/sketches/:id/stats error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Local POST handlers to mirror consolidated serverless behavior (like/react/dislike)
app.post('/api/sketches/:id/like', async (req, res) => {
  const sketchId = req.params.id;
  const { deviceId, action } = req.body || {};
  if (!deviceId) return res.status(400).json({ error: 'Device ID is required' });
  if (!action || (action !== 'like' && action !== 'unlike')) {
    return res.status(400).json({ success: false, error: 'Invalid action. Expected "like" or "unlike"' });
  }

  try {
    // Try DB first
    try {
      if (action === 'like') {
        await sql`INSERT INTO sketch_reactions (sketch_id, smiley_type, count) VALUES (${sketchId}, 'like', 1) ON CONFLICT (sketch_id, smiley_type) DO UPDATE SET count = sketch_reactions.count + 1, updated_at = NOW()`
      } else {
        await sql`UPDATE sketch_reactions SET count = GREATEST(count - 1, 0), updated_at = NOW() WHERE sketch_id = ${sketchId} AND smiley_type = 'like'`
      }
      const { rows } = await sql`SELECT count FROM sketch_reactions WHERE sketch_id = ${sketchId} AND smiley_type = 'like'`
      const updatedCount = rows.length > 0 ? rows[0].count : 0
      return res.status(200).json({ success: true, data: { sketchId, likes: updatedCount, dislikes: 0, userLiked: action === 'like', userDisliked: false } })
    } catch (dbErr) {
      console.warn('Postgres unavailable for like handler, falling back to file store:', dbErr && dbErr.message)
    }

    // Fallback to file store
    const fs = require('fs')
    const path = require('path')
    const storePath = path.join(process.cwd(), 'data', 'likes.json')
    let store = {}
    try {
      const dir = path.dirname(storePath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      if (fs.existsSync(storePath)) {
        const raw = fs.readFileSync(storePath, 'utf8')
        store = raw ? JSON.parse(raw) : {}
      } else {
        store = {}
      }
    } catch (err) {
      console.warn('Could not read likes store, starting with empty store:', err && err.message)
      store = {}
    }

    const current = store[sketchId] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }
    current.likedBy = Array.isArray(current.likedBy) ? current.likedBy : []
    current.dislikedBy = Array.isArray(current.dislikedBy) ? current.dislikedBy : []
    if (action === 'like') {
      if (!current.likedBy.includes(deviceId)) {
        current.likes = (current.likes || 0) + 1
        current.likedBy = current.likedBy.concat([deviceId])
      }
      current.dislikedBy = (current.dislikedBy || []).filter(d => d !== deviceId)
    } else if (action === 'unlike') {
      if (current.likedBy && current.likedBy.includes(deviceId)) {
        current.likes = Math.max(0, (current.likes || 0) - 1)
        current.likedBy = current.likedBy.filter(d => d !== deviceId)
      }
    }
    store[sketchId] = current
    try { fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8') } catch (writeErr) { console.error('Warning: failed to persist likes store (write failed):', writeErr && writeErr.message) }
    return res.status(200).json({ success: true, data: { sketchId, likes: current.likes, dislikes: current.dislikes || 0, userLiked: current.likedBy && current.likedBy.includes(deviceId), userDisliked: current.dislikedBy && current.dislikedBy.includes(deviceId) } })
  } catch (error) {
    console.error('Dev POST /api/sketches/:id/like error:', error)
    return res.status(500).json({ success: false, error: 'Failed to toggle like' })
  }
})

app.post('/api/sketches/:id/react', async (req, res) => {
  const sketchId = req.params.id
  const { smileyType, deviceId, action } = req.body || {}
  if (!sketchId || !smileyType || !deviceId || !action) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    if (action === 'like') {
      await sql`INSERT INTO sketch_reactions (sketch_id, smiley_type, count) VALUES (${sketchId}, ${smileyType}, 1) ON CONFLICT (sketch_id, smiley_type) DO UPDATE SET count = sketch_reactions.count + 1, updated_at = NOW()`
    } else if (action === 'unlike') {
      await sql`UPDATE sketch_reactions SET count = GREATEST(count - 1, 0), updated_at = NOW() WHERE sketch_id = ${sketchId} AND smiley_type = ${smileyType}`
    }
    const { rows } = await sql`SELECT count FROM sketch_reactions WHERE sketch_id = ${sketchId} AND smiley_type = ${smileyType}`
    const updatedCount = rows.length > 0 ? rows[0].count : null
    return res.status(200).json({ success: true, count: updatedCount })
  } catch (error) {
    console.error('Dev POST /api/sketches/:id/react error:', error)
    return res.status(500).json({ error: 'Failed to save reaction', details: error && error.message })
  }
})

app.post('/api/sketches/:id/dislike', async (req, res) => {
  const sketchId = req.params.id
  try {
    const { deviceId, action } = req.body || {}
    if (!deviceId) return res.status(400).json({ error: 'Device ID is required' })
    const response = { success: true, data: { sketchId, likes: Math.floor(Math.random() * 50) + 10, dislikes: action === 'dislike' ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 10) + 1, userLiked: false, userDisliked: action === 'dislike' } }
    return res.status(200).json(response)
  } catch (error) {
    console.error('Dev POST /api/sketches/:id/dislike error:', error)
    return res.status(500).json({ success: false, error: 'Failed to toggle dislike' })
  }
})

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
          COUNT(DISTINCT country) as unique_countries
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
          COUNT(DISTINCT country) as unique_countries
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
          COUNT(DISTINCT country) as unique_countries
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
          COUNT(DISTINCT country) as unique_countries
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
          COUNT(DISTINCT country) as unique_countries,
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
          COUNT(DISTINCT country) as unique_countries,
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
          COUNT(DISTINCT country) as unique_countries,
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
          COUNT(DISTINCT country) as unique_countries,
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
          COUNT(DISTINCT country) as unique_countries,
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
          COUNT(DISTINCT country) as unique_countries,
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
