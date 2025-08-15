// API endpoint to get sketch statistics
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    // For now, we'll use a simple in-memory store
    // In production, this would connect to Vercel Postgres
    const mockData = {
      '1': { likes: 15, dislikes: 2, likedBy: [], dislikedBy: [] },
      '2': { likes: 12, dislikes: 1, likedBy: [], dislikedBy: [] },
      '3': { likes: 8, dislikes: 3, likedBy: [], dislikedBy: [] },
      '4': { likes: 20, dislikes: 1, likedBy: [], dislikedBy: [] },
      '5': { likes: 18, dislikes: 2, likedBy: [], dislikedBy: [] },
      '6': { likes: 14, dislikes: 4, likedBy: [], dislikedBy: [] },
      '7': { likes: 22, dislikes: 1, likedBy: [], dislikedBy: [] },
      '8': { likes: 16, dislikes: 3, likedBy: [], dislikedBy: [] },
      '9': { likes: 19, dislikes: 2, likedBy: [], dislikedBy: [] },
      '10': { likes: 13, dislikes: 2, likedBy: [], dislikedBy: [] },
      '11': { likes: 17, dislikes: 1, likedBy: [], dislikedBy: [] },
      '12': { likes: 11, dislikes: 3, likedBy: [], dislikedBy: [] }
    }

    const sketchData = mockData[id] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }

    res.status(200).json({
      success: true,
      data: {
        sketchId: id,
        likes: sketchData.likes,
        dislikes: sketchData.dislikes,
        likedBy: sketchData.likedBy,
        dislikedBy: sketchData.dislikedBy
      }
    })
  } catch (error) {
    console.error('Error getting sketch stats:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get sketch statistics' 
    })
  }
}
