import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  const { id: sketchId } = req.query
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { deviceId, action } = req.body || {}
  
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' })
  }
  if (!action || (action !== 'like' && action !== 'unlike')) {
    return res.status(400).json({ success: false, error: 'Invalid action. Expected "like" or "unlike"' })
  }

  try {
    if (action === 'like') {
      await sql`INSERT INTO sketch_reactions (sketch_id, smiley_type, count) VALUES (${sketchId}, 'like', 1) ON CONFLICT (sketch_id, smiley_type) DO UPDATE SET count = sketch_reactions.count + 1, updated_at = NOW()`
    } else if (action === 'unlike') {
      await sql`UPDATE sketch_reactions SET count = GREATEST(count - 1, 0), updated_at = NOW() WHERE sketch_id = ${sketchId} AND smiley_type = 'like'`
    }
    const { rows } = await sql`SELECT count FROM sketch_reactions WHERE sketch_id = ${sketchId} AND smiley_type = 'like'`
    const updatedCount = rows.length > 0 ? rows[0].count : 0
    return res.status(200).json({ success: true, data: { sketchId, likes: updatedCount, dislikes: 0, userLiked: action === 'like', userDisliked: false } })
  } catch (dbError) {
    console.warn('Postgres error in like handler, falling back to file store:', dbError && dbError.message)
  }

  // Fallback file store for likes
  try {
    const fs = await import('fs')
    const path = await import('path')
    const storePath = path.join(process.cwd(), 'data', 'likes.json')
    let store = {}
    try {
      const dir = path.dirname(storePath)
      try { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) } catch (mkdirErr) { console.warn('Could not create data directory:', mkdirErr && mkdirErr.message) }
      if (fs.existsSync(storePath)) {
        const raw = fs.readFileSync(storePath, 'utf8')
        store = raw ? JSON.parse(raw) : {}
      } else { store = {} }
    } catch (err) { console.warn('Could not read likes store, starting with empty store:', err && err.message); store = {} }

    const current = store[sketchId] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }
    current.likedBy = Array.isArray(current.likedBy) ? current.likedBy : []
    current.dislikedBy = Array.isArray(current.dislikedBy) ? current.dislikedBy : []
    if (action === 'like') {
      if (!current.likedBy.includes(deviceId)) {
        current.likes = (current.likes || 0) + 1
        current.likedBy = current.likedBy.concat([deviceId])
      }
      current.dislikedBy = (current.dislikedBy || []).filter(d => d !== deviceId)
    } else if (action === 'unlike') {
      if (current.likedBy && current.likedBy.includes(deviceId)) {
        current.likes = Math.max(0, (current.likes || 0) - 1)
        current.likedBy = current.likedBy.filter(d => d !== deviceId)
      }
    }
    store[sketchId] = current
    try { fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8') } catch (writeErr) { console.error('Warning: failed to persist likes store (write failed):', writeErr && writeErr.message) }
    return res.status(200).json({ success: true, data: { sketchId, likes: current.likes, dislikes: current.dislikes || 0, userLiked: current.likedBy && current.likedBy.includes(deviceId), userDisliked: current.dislikedBy && current.dislikedBy.includes(deviceId) } })
  } catch (error) {
    console.error('Error toggling like (file fallback):', error && (error.message || error))
    return res.status(500).json({ success: false, error: 'Failed to toggle like', message: error && error.message })
  }
}