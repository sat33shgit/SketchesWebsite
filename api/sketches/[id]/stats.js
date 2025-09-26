import { sql } from '@vercel/postgres'

// API endpoint to get sketch statistics
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  // First, try Postgres to get authoritative counts
  try {
    const { rows } = await sql`
      SELECT smiley_type, count FROM sketch_reactions WHERE sketch_id = ${id}
    `
    // rows may contain multiple smiley types; map them
    const mapping = {}
    rows.forEach(r => { mapping[r.smiley_type] = r.count })

    return res.status(200).json({
      success: true,
      data: {
        sketchId: id,
        likes: mapping['like'] || 0,
        dislikes: mapping['dislike'] || 0,
        likedBy: [],
        dislikedBy: []
      }
    })
  } catch (dbErr) {
    // Fall back to file-based store for dev or when DB isn't configured
    console.warn('Postgres unavailable for stats, falling back to file store:', dbErr && dbErr.message)
  }

  try {
    const fs = await import('fs')
    const path = await import('path')
    const storePath = path.join(process.cwd(), 'data', 'likes.json')
    let store = {}
    try {
      if (fs.existsSync(storePath)) {
        const raw = fs.readFileSync(storePath, 'utf8')
        store = raw ? JSON.parse(raw) : {}
      }
    } catch (err) {
      console.warn('Could not read likes store, falling back to empty store', err && err.message)
      store = {}
    }

    const sketchData = store[id] || { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }

    return res.status(200).json({
      success: true,
      data: {
        sketchId: id,
        likes: sketchData.likes || 0,
        dislikes: sketchData.dislikes || 0,
        likedBy: sketchData.likedBy || [],
        dislikedBy: sketchData.dislikedBy || []
      }
    })
  } catch (error) {
    console.error('Error getting sketch stats (file fallback):', error && (error.message || error))
    return res.status(500).json({ success: false, error: 'Failed to get sketch statistics' })
  }
}
