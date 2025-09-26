import { sql } from '@vercel/postgres'

// API endpoint to toggle like for a sketch
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  // Be defensive: req.body may be undefined in some environments or proxies.
  const { deviceId, action } = req.body || {}

  if (!deviceId) {
    console.warn('Missing deviceId in request body for like toggle:', id)
    return res.status(400).json({ error: 'Device ID is required' })
  }

  // Validate action
  if (!action || (action !== 'like' && action !== 'unlike')) {
    return res.status(400).json({ success: false, error: 'Invalid action. Expected "like" or "unlike"' })
  }

  // First try to persist the like in Postgres (sketch_reactions). If Postgres
  // isn't available or the operation fails, fall back to the local JSON store.
  try {
    // Use SQL-backed sketch_reactions table: increment/decrement count.
    if (action === 'like') {
      await sql`
        INSERT INTO sketch_reactions (sketch_id, smiley_type, count)
        VALUES (${id}, 'like', 1)
        ON CONFLICT (sketch_id, smiley_type)
        DO UPDATE SET count = sketch_reactions.count + 1, updated_at = NOW();
      `
    } else if (action === 'unlike') {
      await sql`
        UPDATE sketch_reactions
        SET count = GREATEST(count - 1, 0), updated_at = NOW()
        WHERE sketch_id = ${id} AND smiley_type = 'like';
      `
    }

    // Fetch updated count for confirmation
    const { rows } = await sql`
      SELECT count FROM sketch_reactions WHERE sketch_id = ${id} AND smiley_type = 'like'
    `
    const updatedCount = rows.length > 0 ? rows[0].count : 0

    return res.status(200).json({
      success: true,
      data: {
        sketchId: id,
        likes: updatedCount,
        dislikes: 0,
        userLiked: action === 'like',
        userDisliked: false
      }
    })
  } catch (dbError) {
    // If DB isn't available, fall back to local JSON store (dev mode)
    console.warn('Postgres error in like handler, falling back to file store:', dbError && dbError.message)
  }

  // Fallback path: file-based store under data/likes.json
  try {
    // For dev, update a simple JSON store under data/likes.json
    // Use dynamic imports so this handler works in ESM environments where
    // `require` may not be defined (e.g. when Vite or Node ESM loader is used).
    const fs = await import('fs')
    const path = await import('path')
    const storePath = path.join(process.cwd(), 'data', 'likes.json')

    let store = {}
    try {
      // ensure data directory exists (guarded)
      const dir = path.dirname(storePath)
      try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      } catch (mkdirErr) {
        console.warn('Could not create data directory (maybe read-only env):', mkdirErr && mkdirErr.message)
      }

      if (fs.existsSync(storePath)) {
        const raw = fs.readFileSync(storePath, 'utf8')
        try {
          store = raw ? JSON.parse(raw) : {}
        } catch (parseErr) {
          console.error('Failed to parse likes.json, resetting store. parseErr:', parseErr && parseErr.message)
          store = {}
        }
      } else {
        store = {}
      }
    } catch (err) {
      console.warn('Could not read likes store, starting with empty store:', err && err.message)
      store = {}
    }

    const current = store[id] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }
    // Ensure arrays exist to avoid .includes failures
    current.likedBy = Array.isArray(current.likedBy) ? current.likedBy : []
    current.dislikedBy = Array.isArray(current.dislikedBy) ? current.dislikedBy : []

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
      // Attempt to write store (may fail in serverless/read-only env)
      fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8')
    } catch (writeErr) {
      console.error('Warning: failed to persist likes store (write failed):', writeErr && writeErr.message)
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

    return res.status(200).json(response)
  } catch (error) {
    console.error('Error toggling like (file fallback):', error && (error.message || error))
    // Return a generic error message to clients; avoid leaking stack traces in responses
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle like',
      message: error && error.message
    })
  }
}
