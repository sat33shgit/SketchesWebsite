export default function handler(req, res) {
  console.log('🎯 Simple like route called:', req.method, req.url)
  console.log('Query params:', req.query)
  console.log('Body:', req.body)
  
  const { id } = req.query
  
  if (req.method === 'POST') {
    const { deviceId, action } = req.body || {}
    return res.status(200).json({ 
      success: true, 
      message: 'Simple like route working',
      data: {
        sketchId: id,
        likes: 42,
        userLiked: action === 'like',
        userDisliked: false
      }
    })
  }
  
  return res.status(200).json({ 
    success: true, 
    message: 'Simple like GET route working',
    id: id
  })
}