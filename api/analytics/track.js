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

    // Get country code from Vercel/Cloudflare headers (two-letter ISO code)
    const countryCode = (req.headers['x-vercel-ip-country'] || 
                         req.headers['cf-ipcountry'] || // Cloudflare
                         'Unknown').toUpperCase();

    // Convert ISO country code (eg. 'CA') to full country name (eg. 'canada')
    function getFullCountryName(code) {
      if (!code || code === 'UNKNOWN') return 'Unknown';
      try {
        // Intl.DisplayNames returns localized region names (e.g., 'Canada')
        const dn = new Intl.DisplayNames(['en'], { type: 'region' });
        const name = dn.of(code);
        // Return the display name as-is (capitalized where appropriate). Fallback to uppercased code.
        return (name || code).toString();
      } catch (err) {
        // Fallback: return the uppercased code (e.g., 'CA')
        return code.toUpperCase();
      }
    }

    const country = getFullCountryName(countryCode);

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