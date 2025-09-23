import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function simulateViewCountLogic() {
  try {
    console.log('🧪 Simulating ViewCount component logic...\n');
    
    const sketchId = '10';
    console.log('Looking for sketch ID:', sketchId, 'Type:', typeof sketchId);
    
    // Simulate the API query that should be executed
    const detailedStats = await sql`
      SELECT 
        page_type,
        page_id,
        SUM(visit_count) as total_visits,
        COUNT(DISTINCT ip_hash) as unique_visitors,
        MAX(updated_at) as last_visit,
        MIN(created_at) as first_visit
      FROM page_visits 
      WHERE 1=1
      GROUP BY page_type, page_id
      ORDER BY total_visits DESC
      LIMIT 100
    `;
    
    console.log('All detailed stats:');
    detailedStats.rows.forEach(row => {
      console.log(`- ${row.page_type} (${row.page_id}) - ${row.total_visits} visits`);
    });
    
    // Find the specific sketch
    const sketchData = detailedStats.rows.find(
      item => item.page_type === 'sketch' && (item.page_id === String(sketchId) || item.page_id === sketchId)
    );
    
    console.log('\nFound sketch data for ID 10:', sketchData);
    
    if (sketchData) {
      console.log('✅ View count should be:', sketchData.total_visits);
    } else {
      console.log('❌ No data found for sketch ID 10');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

simulateViewCountLogic();