// API endpoint for tracking page visits
// File: /api/analytics/track.js

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pageType, pageId } = req.body;

    if (!pageType) {
      return res.status(400).json({ error: 'pageType is required' });
    }

    // Valid page types
    const validPageTypes = ['home', 'about', 'contact', 'sketch', 'gallery'];
    if (!validPageTypes.includes(pageType)) {
      return res.status(400).json({ error: 'Invalid pageType' });
    }

    // Get country from Vercel's geolocation headers
    // Vercel provides this information in the x-vercel-ip-country header
    const country = req.headers['x-vercel-ip-country'] || 
                    req.headers['cf-ipcountry'] || // Cloudflare
                    'Unknown';

    // For pages without page_id (home, about, contact), use the page_type as page_id
    // This ensures the unique constraint works properly
    const normalizedPageId = pageId || pageType;

    // Insert or update visit count
    // Using ON CONFLICT to increment visit_count if same country visits again
    await sql`
      INSERT INTO page_visits (page_type, page_id, visit_count, country, updated_at)
      VALUES (${pageType}, ${normalizedPageId}, 1, ${country}, CURRENT_TIMESTAMP)
      ON CONFLICT (page_type, page_id, country)
      DO UPDATE SET 
        visit_count = page_visits.visit_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `;

    res.status(200).json({ 
      success: true, 
      message: 'Visit tracked successfully',
      country: country
    });

  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ 
      error: 'Failed to track visit',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}