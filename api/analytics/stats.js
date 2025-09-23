// API endpoint for retrieving analytics data
// File: /api/analytics/stats.js

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pageType, timeframe = '30d' } = req.query;

    // Simplified approach - just get all data for now
    // Get detailed stats by page
    const detailedStats = await sql`
      SELECT 
        page_type,
        page_id,
        SUM(visit_count)::int as total_visits,
        COUNT(DISTINCT ip_hash)::int as unique_visitors,
        MAX(updated_at) as last_visit,
        MIN(created_at) as first_visit
      FROM page_visits 
      GROUP BY page_type, page_id
      ORDER BY total_visits DESC
    `;

    // Get overall stats
    const overallStats = await sql`
      SELECT 
        page_type,
        COUNT(*)::int as visit_records,
        SUM(visit_count)::int as total_visits,
        COUNT(DISTINCT ip_hash)::int as unique_visitors
      FROM page_visits 
      GROUP BY page_type
      ORDER BY total_visits DESC
    `;

    res.status(200).json({
      success: true,
      timeframe,
      data: {
        overall: overallStats.rows,
        detailed: detailedStats.rows
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}