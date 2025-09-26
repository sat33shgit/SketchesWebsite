// API endpoint to get sketch statistics
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    // Read from the simple JSON store for deterministic values in dev
    const fs = require('fs')
    const path = require('path')
    const storePath = path.join(process.cwd(), 'data', 'likes.json')
    let store = {}
    try {
      store = JSON.parse(fs.readFileSync(storePath, 'utf8'))
    } catch (err) {
      console.warn('Could not read likes store, falling back to empty store', err.message)
    }

    const sketchData = store[id] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }

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
