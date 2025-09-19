// API endpoint for tracking page visits
// File: /api/analytics/track.js

import { sql } from '@vercel/postgres';
import crypto from 'crypto';

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

    // Get client info for basic deduplication
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    
    // Create hashes for privacy (don't store raw IP/UA)
    const ipHash = crypto.createHash('sha256').update(clientIP + 'salt').digest('hex');
    const userAgentHash = crypto.createHash('sha256').update(userAgent + 'salt').digest('hex');

    // Insert or update visit count
    // Using ON CONFLICT to increment visit_count if same visitor visits again
    await sql`
      INSERT INTO page_visits (page_type, page_id, visit_count, ip_hash, user_agent_hash, updated_at)
      VALUES (${pageType}, ${pageId || null}, 1, ${ipHash}, ${userAgentHash}, CURRENT_TIMESTAMP)
      ON CONFLICT (page_type, page_id, ip_hash, user_agent_hash)
      DO UPDATE SET 
        visit_count = page_visits.visit_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `;

    res.status(200).json({ 
      success: true, 
      message: 'Visit tracked successfully' 
    });

  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ 
      error: 'Failed to track visit',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}