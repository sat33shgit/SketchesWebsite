import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function testAnalyticsInsertion() {
  try {
    console.log('🧪 Testing manual analytics insertion...\n');
    
    // Insert test data
    await sql`
      INSERT INTO page_visits (page_type, page_id, visit_count, country) 
      VALUES 
        ('home', 'home', 1, 'India'),
        ('sketch', 'african-boy', 1, 'United States'),
        ('about', 'about', 1, 'India'),
        ('contact', 'contact', 1, 'Canada'),
        ('sketch', 'cute-girl', 2, 'United Kingdom')
    `;
    
    console.log('✅ Test data inserted successfully!\n');
    
    // Check the data
    const visits = await sql`SELECT * FROM page_visits ORDER BY updated_at DESC`;
    console.log(`📊 Found ${visits.rows.length} page visits:`);
    
    visits.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.page_type}${row.page_id ? ` (${row.page_id})` : ''} - ${row.visit_count} visits from ${row.country}`);
    });
    
    // Test analytics summary view
    console.log('\n📈 Analytics Summary:');
    const summary = await sql`SELECT * FROM analytics_summary ORDER BY total_visits DESC`;
    summary.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.page_type}${row.page_id ? ` (${row.page_id})` : ' (general)'} - ${row.total_visits} visits, ${row.unique_countries} unique countries`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAnalyticsInsertion();