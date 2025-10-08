import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // sketchId from query is not used in this consolidated handler

    // Removed duplicate POST handler above. All POST logic handled below.

  console.log('API called:', {
    method: req.method,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
  const {
    query: { sketch_id },
    method,
  } = req;
  let body = req.body;
  // Parse JSON body if needed
  if (req.method === 'POST' && typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  if (!sketch_id) {
    return res.status(400).json({ error: 'Missing sketch_id' });
  }

  if (method === 'GET') {
    // Fetch comments for a sketch
    try {
      const { rows } = await sql`
        SELECT id, name, comment, created_at, updated_at, visible
        FROM comments
        WHERE sketch_id = ${sketch_id} AND visible = 'Y'
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error('GET comments error:', err && (err.message || err));
      return res.status(500).json({ error: err && err.message });
    }
  } else if (method === 'POST') {
    // Add a new comment
    const { name, comment } = body || {};
    if (!name || !comment) {
      return res.status(400).json({ error: 'Name and comment are required' });
    }
    // Automated country detection using ipapi.co
    let country = 'Unknown';
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.connection?.remoteAddress;
    if (body.country && typeof body.country === 'string') {
      country = body.country;
    } else if (req.headers['x-country'] && typeof req.headers['x-country'] === 'string') {
      country = req.headers['x-country'];
    } else if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const fetch = (await import('node-fetch')).default;
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.country_name) {
            country = geoData.country_name;
          }
        }
      } catch (geoErr) {
        console.warn('Country detection failed:', geoErr);
      }
    }
    try {
      await sql`
        INSERT INTO comments (sketch_id, name, comment, country, visible, updated_at)
        VALUES (${sketch_id}, ${name}, ${comment}, ${country}, 'Y', CURRENT_TIMESTAMP)
      `;
      return res.status(201).json({ message: 'Comment added', country });
    } catch (err) {
      console.error('POST comment error:', err && (err.message || err), 'Body:', body);
      return res.status(500).json({ error: err && err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
