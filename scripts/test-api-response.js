import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🔍 Testing analytics API response...\n');
    
    const response = await fetch('http://localhost:3000/api/analytics/stats?timeframe=all');
    const data = await response.json();
    
    console.log('API Response structure:');
    console.log('- Success:', data.success);
    console.log('- Timeframe:', data.timeframe);
    console.log('- Overall count:', data.data.overall.length);
    console.log('- Detailed count:', data.data.detailed.length);
    
    console.log('\nDetailed sketch data:');
    data.data.detailed
      .filter(item => item.page_type === 'sketch')
      .forEach(sketch => {
        console.log(`- Sketch ID: "${sketch.page_id}" (${typeof sketch.page_id}) - Visits: ${sketch.total_visits}`);
      });
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();