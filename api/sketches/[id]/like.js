// API endpoint to toggle like for a sketch
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
    
    // This is a simplified version - in production you'd:
    // 1. Connect to Vercel Postgres
    // 2. Use transactions for atomic operations
    // 3. Store real data persistently
    
    const response = {
      success: true,
      data: {
        sketchId: id,
        likes: action === 'like' ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 50) + 10,
        dislikes: Math.floor(Math.random() * 10) + 1,
        userLiked: action === 'like',
        userDisliked: false
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error toggling like:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle like' 
    })
  }
}
