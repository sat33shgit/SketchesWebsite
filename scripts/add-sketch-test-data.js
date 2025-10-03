import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function addSketchTestData() {
  try {
    console.log('🧪 Adding test data for actual sketch IDs...\n');
    
    // Insert test data for actual sketch IDs
    await sql`
      INSERT INTO page_visits (page_type, page_id, visit_count, country) 
      VALUES 
        ('sketch', '11', 5, 'India'),
        ('sketch', '12', 3, 'United States'),
        ('sketch', '10', 8, 'United Kingdom'),
        ('sketch', '9', 4, 'Canada')
      ON CONFLICT (page_type, page_id, country) 
      DO UPDATE SET 
        visit_count = page_visits.visit_count + EXCLUDED.visit_count,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    console.log('✅ Test data for sketch IDs added successfully!\n');
    
    // Check the updated data
    const visits = await sql`SELECT * FROM page_visits WHERE page_type = 'sketch' ORDER BY visit_count DESC`;
    console.log(`📊 Found ${visits.rows.length} sketch visits:`);
    
    visits.rows.forEach((row, i) => {
      console.log(`${i + 1}. Sketch ID ${row.page_id} - ${row.visit_count} visits from ${row.country}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addSketchTestData();