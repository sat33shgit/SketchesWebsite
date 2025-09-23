// Test script for analytics functionality
// Run with: node scripts/test-analytics.js

import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testAnalyticsAPI() {
  console.log('🧪 Testing Analytics API...\n');

  // Test 1: Track a visit
  console.log('1. Testing visit tracking...');
  try {
    const trackResponse = await fetch(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageType: 'home'
      })
    });

    if (trackResponse.ok) {
      const trackResult = await trackResponse.json();
      console.log('✅ Visit tracking successful:', trackResult.message);
    } else {
      console.log('❌ Visit tracking failed:', trackResponse.status, trackResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Visit tracking error:', error.message);
  }

  // Test 2: Track a sketch visit
  console.log('\n2. Testing sketch visit tracking...');
  try {
    const sketchResponse = await fetch(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageType: 'sketch',
        pageId: 'test-sketch-1'
      })
    });

    if (sketchResponse.ok) {
      const sketchResult = await sketchResponse.json();
      console.log('✅ Sketch tracking successful:', sketchResult.message);
    } else {
      console.log('❌ Sketch tracking failed:', sketchResponse.status, sketchResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Sketch tracking error:', error.message);
  }

  // Test 3: Get analytics stats
  console.log('\n3. Testing analytics retrieval...');
  try {
    const statsResponse = await fetch(`${BASE_URL}/api/analytics/stats?timeframe=7d`);
    
    if (statsResponse.ok) {
      const statsResult = await statsResponse.json();
      console.log('✅ Analytics retrieval successful');
      console.log('📊 Overall stats:', statsResult.data.overall.length, 'page types');
      console.log('📊 Detailed stats:', statsResult.data.detailed.length, 'entries');
      console.log('📊 Top sketches:', statsResult.data.topSketches.length, 'sketches');
      console.log('📊 Recent activity:', statsResult.data.recentActivity.length, 'activities');
    } else {
      console.log('❌ Analytics retrieval failed:', statsResponse.status, statsResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Analytics retrieval error:', error.message);
  }

  console.log('\n🏁 Test completed!');
}

// Run the test
testAnalyticsAPI().catch(console.error);