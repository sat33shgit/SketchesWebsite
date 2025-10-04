import { sql } from '@vercel/postgres'

// Consolidated handler for multiple sketch-related routes to avoid many
// individual serverless functions (keeps <=12 functions for Hobby plan).
export default async function handler(req, res) {
  const rawSlug = req.query && req.query.slug
  let slug = rawSlug ? (Array.isArray(rawSlug) ? rawSlug : [rawSlug]) : []

  // Some runtimes (or proxied requests) do not populate req.query.slug for
  // catch-all routes. As a fallback, parse the path from req.url and extract
  // segments after the "sketches" segment so requests like
  // `/api/sketches/11` or `/api/sketches/11/stats` still resolve correctly.
  if ((!slug || slug.length === 0) && req.url) {
    try {
      const path = String(req.url).split('?')[0]
      const parts = path.split('/').filter(Boolean)
      const idx = parts.findIndex(p => p === 'sketches')
      if (idx >= 0) {
        slug = parts.slice(idx + 1)
      }
    } catch (e) {
      // ignore and keep slug as-is
    }
  }

  // Helper: get sketch id when present
  const sketchId = slug.length > 0 ? slug[0] : null

  try {
    // GET /api/sketches/likes
    if (slug.length === 1 && slug[0] === 'likes' && req.method === 'GET') {
      const { rows } = await sql`SELECT sketch_id, count FROM sketch_reactions WHERE smiley_type = 'like'`
      const result = {}
      rows.forEach(r => { result[r.sketch_id] = r.count })
      return res.status(200).json({ success: true, data: result })
    }

    // Routes under /api/sketches/[id]/...
    if (sketchId) {
      const sub = slug[1] || null

      // GET /api/sketches/[id]  -> sketch detail (DB first, fallback to local file)
      if (!sub && req.method === 'GET') {
        try {
          const { rows } = await sql`
            SELECT sketch_id AS id,
                   sketch_name AS title,
                   sketch_description AS description,
                   NULL AS image_path,
                   NULL AS orientation,
                   sketch_completed_date AS completed_date,
                   -- include the new text column 'time' (may be named Time or time in your DB)
                   time AS time,
                   NULL AS category
            FROM sketches WHERE sketch_id = ${sketchId}
          `
          if (rows && rows.length) {
            const r = rows[0]
            // unify completed date handling from either column
            let completedDate = null
            const rawDate = r.completed_date ?? r.sketch_completed_date
            if (rawDate) completedDate = (rawDate instanceof Date) ? rawDate.toISOString().split('T')[0] : String(rawDate)

            const sketch = {
              id: r.id,
              title: r.title,
              description: r.description,
              imagePath: r.image_path || null,
              orientation: r.orientation || null,
              completedDate,
              time: r.time || r.Time || null,
              category: r.category || null
            }
            return res.status(200).json({ success: true, data: sketch })
          }
        } catch (err) {
          console.warn('Postgres unavailable for sketch detail:', err && err.message)
        }

        // fallback to local file
        try {
          const module = await import('../../src/data/sketches.js')
          const localSketches = module.sketches || module.default || []
          const found = localSketches.find(s => String(s.id) === String(sketchId))
          if (found) return res.status(200).json({ success: true, data: found })
          return res.status(404).json({ success: false, error: 'Sketch not found' })
        } catch (err) {
          console.error('Error loading fallback sketches data:', err && err.message)
          return res.status(500).json({ success: false, error: 'Failed to retrieve sketch' })
        }
      }

      // GET /api/sketches/[id]/stats
      if (sub === 'stats' && req.method === 'GET') {
        try {
          const { rows } = await sql`SELECT smiley_type, count FROM sketch_reactions WHERE sketch_id = ${sketchId}`
          const mapping = {}
          rows.forEach(r => { mapping[r.smiley_type] = r.count })
          return res.status(200).json({ success: true, data: { sketchId, likes: mapping['like'] || 0, dislikes: mapping['dislike'] || 0, likedBy: [], dislikedBy: [] } })
        } catch (dbErr) {
          console.warn('Postgres unavailable for stats, falling back to file store:', dbErr && dbErr.message)
        }

        try {
          const fs = await import('fs')
          const path = await import('path')
          const storePath = path.join(process.cwd(), 'data', 'likes.json')
          let store = {}
          if (fs.existsSync(storePath)) {
            const raw = fs.readFileSync(storePath, 'utf8')
            store = raw ? JSON.parse(raw) : {}
          }
          const sketchData = store[sketchId] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }
          return res.status(200).json({ success: true, data: { sketchId, likes: sketchData.likes || 0, dislikes: sketchData.dislikes || 0, likedBy: sketchData.likedBy || [], dislikedBy: sketchData.dislikedBy || [] } })
        } catch (error) {
          console.error('Error getting sketch stats (file fallback):', error && (error.message || error))
          return res.status(500).json({ success: false, error: 'Failed to get sketch statistics' })
        }
      }

      // GET /api/sketches/[id]/reactions
      if (sub === 'reactions' && req.method === 'GET') {
        try {
          const { rows } = await sql`SELECT smiley_type, count FROM sketch_reactions WHERE sketch_id = ${sketchId}`
          let likeCount = 0
          if (rows.length > 0) likeCount = rows[0].count
          return res.status(200).json({ success: true, data: { like: likeCount } })
        } catch (error) {
          console.error('Error fetching reactions:', error)
          return res.status(500).json({ error: 'Failed to fetch reactions' })
        }
      }

      // POST /api/sketches/[id]/react  (smileyType, deviceId, action)
      if (sub === 'react' && req.method === 'POST') {
        const { smileyType, deviceId, action } = req.body || {}
        if (!sketchId || !smileyType || !deviceId || !action) {
          return res.status(400).json({ error: 'Missing required fields' })
        }
        try {
          if (action === 'like') {
            await sql`INSERT INTO sketch_reactions (sketch_id, smiley_type, count) VALUES (${sketchId}, ${smileyType}, 1) ON CONFLICT (sketch_id, smiley_type) DO UPDATE SET count = sketch_reactions.count + 1, updated_at = NOW()`
          } else if (action === 'unlike') {
            await sql`UPDATE sketch_reactions SET count = GREATEST(count - 1, 0), updated_at = NOW() WHERE sketch_id = ${sketchId} AND smiley_type = ${smileyType}`
          }
          const { rows } = await sql`SELECT count FROM sketch_reactions WHERE sketch_id = ${sketchId} AND smiley_type = ${smileyType}`
          const updatedCount = rows.length > 0 ? rows[0].count : null
          return res.status(200).json({ success: true, count: updatedCount })
        } catch (error) {
          console.error('Error saving reaction:', error)
          return res.status(500).json({ error: 'Failed to save reaction', details: error.message })
        }
      }

      // POST /api/sketches/[id]/like  (deviceId, action)
      if (sub === 'like' && req.method === 'POST') {
        const { deviceId, action } = req.body || {}
        if (!deviceId) {
          console.warn('Missing deviceId in request body for like toggle:', sketchId)
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

        // Fallback file store
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

      // POST /api/sketches/[id]/dislike  (deviceId, action)
      if (sub === 'dislike' && req.method === 'POST') {
        try {
          const { deviceId, action } = req.body || {}
          if (!deviceId) return res.status(400).json({ error: 'Device ID is required' })
          // This handler simulates dislike counts in absence of DB
          const response = { success: true, data: { sketchId, likes: Math.floor(Math.random() * 50) + 10, dislikes: action === 'dislike' ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 10) + 1, userLiked: false, userDisliked: action === 'dislike' } }
          return res.status(200).json(response)
        } catch (error) {
          console.error('Error toggling dislike:', error)
          return res.status(500).json({ success: false, error: 'Failed to toggle dislike' })
        }
      }
    }
  } catch (err) {
    console.error('Consolidated sketches handler error:', err)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }

  // If no route matched
  return res.status(404).json({ success: false, error: 'Not found' })
}
