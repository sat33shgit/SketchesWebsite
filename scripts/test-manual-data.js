import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function testAnalyticsInsertion() {
  try {
    console.log('🧪 Testing manual analytics insertion...\n');
    
    // Insert test data
    await sql`
      INSERT INTO page_visits (page_type, page_id, visit_count, ip_hash, user_agent_hash) 
      VALUES 
        ('home', NULL, 1, 'test_hash_1', 'test_ua_1'),
        ('sketch', 'african-boy', 1, 'test_hash_2', 'test_ua_2'),
        ('about', NULL, 1, 'test_hash_1', 'test_ua_1'),
        ('contact', NULL, 1, 'test_hash_3', 'test_ua_3'),
        ('sketch', 'cute-girl', 2, 'test_hash_4', 'test_ua_4')
    `;
    
    console.log('✅ Test data inserted successfully!\n');
    
    // Check the data
    const visits = await sql`SELECT * FROM page_visits ORDER BY updated_at DESC`;
    console.log(`📊 Found ${visits.rows.length} page visits:`);
    
    visits.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.page_type}${row.page_id ? ` (${row.page_id})` : ''} - ${row.visit_count} visits`);
    });
    
    // Test analytics summary view
    console.log('\n📈 Analytics Summary:');
    const summary = await sql`SELECT * FROM analytics_summary ORDER BY total_visits DESC`;
    summary.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.page_type}${row.page_id ? ` (${row.page_id})` : ' (general)'} - ${row.total_visits} visits, ${row.unique_visitors} unique visitors`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAnalyticsInsertion();