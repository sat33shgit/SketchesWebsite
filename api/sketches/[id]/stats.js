import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  console.log('📊 Stats route called:', req.method, req.url)
  console.log('Query params:', req.query)
  
  const { id: sketchId } = req.query
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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