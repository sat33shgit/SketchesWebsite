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

  // Validate action
  if (!action || (action !== 'like' && action !== 'unlike')) {
    return res.status(400).json({ success: false, error: 'Invalid action. Expected "like" or "unlike"' })
  }

  try {
    // For dev, update a simple JSON store under data/likes.json
    const fs = require('fs')
    const path = require('path')
    const storePath = path.join(process.cwd(), 'data', 'likes.json')

    let store = {}
    try {
      // ensure data directory exists
      const dir = path.dirname(storePath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      if (fs.existsSync(storePath)) {
        const raw = fs.readFileSync(storePath, 'utf8')
        store = raw ? JSON.parse(raw) : {}
      } else {
        store = {}
      }
    } catch (err) {
      console.warn('Could not read likes store, starting with empty store:', err && err.message)
      store = {}
    }

    const current = store[id] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }

    // Simplified device tracking: record deviceId in likedBy/dislikedBy arrays
    if (action === 'like') {
      if (!current.likedBy.includes(deviceId)) {
        current.likes = (current.likes || 0) + 1
        current.likedBy = current.likedBy.concat([deviceId])
      }
      // ensure device isn't in dislikedBy
      current.dislikedBy = (current.dislikedBy || []).filter(d => d !== deviceId)
    } else if (action === 'unlike') {
      if (current.likedBy && current.likedBy.includes(deviceId)) {
        current.likes = Math.max(0, (current.likes || 0) - 1)
        current.likedBy = current.likedBy.filter(d => d !== deviceId)
      }
    }

    // write back (guarded)
    store[id] = current
    try {
      // write atomically: write to tmp then rename
      const tmpPath = storePath + '.tmp'
      fs.writeFileSync(tmpPath, JSON.stringify(store, null, 2), 'utf8')
      fs.renameSync(tmpPath, storePath)
    } catch (writeErr) {
      console.error('Warning: failed to persist likes store:', writeErr && writeErr.message)
      // continue — return the updated stats in memory so client can proceed
    }

    const response = {
      success: true,
      data: {
        sketchId: id,
        likes: current.likes,
        dislikes: current.dislikes || 0,
        userLiked: current.likedBy && current.likedBy.includes(deviceId),
        userDisliked: current.dislikedBy && current.dislikedBy.includes(deviceId)
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
