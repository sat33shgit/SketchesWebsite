import handler from '../api/sketches/[id]/[[...slug]].js'

function makeRes() {
  let statusCode = 200
  return {
    status(code) { statusCode = code; return this },
    json(obj) { console.log('STATUS', statusCode); console.log(JSON.stringify(obj, null, 2)); return obj }
  }
}

async function runTest() {
  console.log('Testing GET /api/sketches/11')
  const req = { method: 'GET', query: { id: '11' } }
  const res = makeRes()
  await handler(req, res)
}

runTest().catch(e => console.error('Test failed:', e))