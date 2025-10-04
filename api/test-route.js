export default function handler(req, res) {
  console.log('🧪 Test route called:', req.method, req.url)
  return res.status(200).json({ 
    success: true, 
    message: 'Test route working',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  })
}