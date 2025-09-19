// API endpoint for retrieving analytics data
// File: /api/analytics/stats.js

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const overallStats = await sql`
      SELECT 
        page_type,
        COUNT(*) as visit_records,
        SUM(visit_count) as total_visits,
        COUNT(DISTINCT ip_hash) as unique_visitors
      FROM page_visits 
      WHERE 1=1 ${timeCondition ? sql.unsafe(timeCondition) : sql``}
      ${pageType ? sql`AND page_type = ${pageType}` : sql``}
      GROUP BY page_type
      ORDER BY total_visits DESC
    `;

    // Get detailed stats by page
    const detailedStats = await sql`
      SELECT 
        page_type,
        page_id,
        SUM(visit_count) as total_visits,
        COUNT(DISTINCT ip_hash) as unique_visitors,
        MAX(updated_at) as last_visit,
        MIN(created_at) as first_visit
      FROM page_visits 
      WHERE 1=1 ${timeCondition ? sql.unsafe(timeCondition) : sql``}
      ${pageType ? sql`AND page_type = ${pageType}` : sql``}
      GROUP BY page_type, page_id
      ORDER BY total_visits DESC
      LIMIT 100
    `;

    // Get top sketches specifically
    const topSketches = await sql`
      SELECT 
        page_id as sketch_id,
        SUM(visit_count) as total_visits,
        COUNT(DISTINCT ip_hash) as unique_visitors,
        MAX(updated_at) as last_visit
      FROM page_visits 
      WHERE page_type = 'sketch' 
      ${timeCondition ? sql.unsafe(timeCondition) : sql``}
      GROUP BY page_id
      ORDER BY total_visits DESC
      LIMIT 20
    `;

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

    res.status(200).json({
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
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}