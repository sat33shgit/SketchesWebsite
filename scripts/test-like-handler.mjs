import handler from '../api/sketches/[[...slug]].js'

function makeRes() {
  let statusCode = 200
  return {
    status(code) { statusCode = code; return this },
    json(obj) { console.log('STATUS', statusCode); console.log(JSON.stringify(obj, null, 2)); return obj }
  }
}

async function testLike() {
  console.log('Testing POST /api/sketches/11/like')
  const req = { 
    method: 'POST', 
    query: { slug: ['11', 'like'] },
    url: '/api/sketches/11/like',
    body: { deviceId: 'test-device-123', action: 'like' }
  }
  const res = makeRes()
  await handler(req, res)
}

async function testStats() {
  console.log('\nTesting GET /api/sketches/11/stats')
  const req = { 
    method: 'GET', 
    query: { slug: ['11', 'stats'] },
    url: '/api/sketches/11/stats'
  }
  const res = makeRes()
  await handler(req, res)
}

async function runTests() {
  await testLike()
  await testStats()
}

runTests().catch(e => console.error('Test failed:', e))