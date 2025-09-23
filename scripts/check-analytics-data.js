import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function checkAnalyticsData() {
  try {
    console.log('📊 Checking analytics data...\n');
    
    // Check if we have any page visits
    const visits = await sql`SELECT * FROM page_visits ORDER BY updated_at DESC LIMIT 10`;
    console.log(`Found ${visits.rows.length} page visits in database`);
    
    if (visits.rows.length > 0) {
      console.log('\nRecent visits:');
      visits.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${row.page_type}${row.page_id ? ` (${row.page_id})` : ''} - ${row.visit_count} visits - Last: ${row.updated_at}`);
      });
    }
    
    // Check analytics summary view
    const summary = await sql`SELECT page_type, COUNT(*) as total_pages, SUM(total_visits) as total_visits FROM analytics_summary GROUP BY page_type ORDER BY total_visits DESC`;
    console.log(`\nAnalytics summary: ${summary.rows.length} page types`);
    
    if (summary.rows.length > 0) {
      console.log('\nSummary by page type:');
      summary.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${row.page_type}: ${row.total_visits} visits, ${row.total_pages} unique pages`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking analytics data:', error);
  }
}

checkAnalyticsData();