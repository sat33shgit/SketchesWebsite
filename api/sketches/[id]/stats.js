export default function handler(req, res) {
  console.log('📊 Simple stats route called:', req.method, req.url)
  console.log('Query params:', req.query)
  
  const { id } = req.query
  
  return res.status(200).json({ 
    success: true, 
    message: 'Simple stats route working',
    data: {
      sketchId: id,
      likes: 42,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    }
  })
}