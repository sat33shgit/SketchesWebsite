// Simple test endpoint for Vercel debugging
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test fetch to Web3Forms
    const testResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '92235cbf-7e66-4121-a028-ba50d463f041',
        name: 'Test from Vercel',
        email: 'test@example.com',
        subject: 'Vercel API Test',
        message: 'Testing if email works from Vercel serverless function',
        from_name: 'Vercel Test'
      })
    });

    const result = await testResponse.json();

    return res.status(200).json({
      success: true,
      message: 'Vercel API test completed',
      emailTest: {
        status: testResponse.status,
        success: result.success,
        message: result.message || 'No message from Web3Forms'
      },
      environment: {
        nodeVersion: process.version,
        vercelRegion: process.env.VERCEL_REGION || 'unknown',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}