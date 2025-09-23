// API endpoint to toggle dislike for a sketch
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const { deviceId, action } = req.body

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' })
  }

  try {
    // In production, this would use Vercel Postgres
    // For now, we'll simulate database operations
    
    const response = {
      success: true,
      data: {
        sketchId: id,
        likes: Math.floor(Math.random() * 50) + 10,
        dislikes: action === 'dislike' ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 10) + 1,
        userLiked: false,
        userDisliked: action === 'dislike'
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error toggling dislike:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle dislike' 
    })
  }
}
