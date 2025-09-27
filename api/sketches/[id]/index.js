import { sql } from '@vercel/postgres'

// GET /api/sketches/[id]
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { id } = req.query

  // Try Postgres first for authoritative data
  try {
    const { rows } = await sql`
      SELECT id, title, description, image_path, orientation, completed_date, category
      FROM sketches
      WHERE id = ${id}
    `

    if (rows && rows.length) {
      const r = rows[0]
      const completedDate = r.completed_date
        ? (r.completed_date instanceof Date ? r.completed_date.toISOString().split('T')[0] : String(r.completed_date))
        : null

      const sketch = {
        id: r.id,
        title: r.title,
        description: r.description,
        imagePath: r.image_path || null,
        orientation: r.orientation || null,
        completedDate,
        category: r.category || null
      }

      return res.status(200).json({ success: true, data: sketch })
    }
  } catch (err) {
    // Postgres may be unavailable in local/dev environments; fall through to file fallback
    console.warn('Postgres unavailable or query failed for sketch details:', err && err.message)
  }

  // Fallback: read local src data file (used in dev / static sites)
  try {
    const module = await import('../../../src/data/sketches.js')
    const localSketches = module.sketches || module.default || []
    const found = localSketches.find(s => String(s.id) === String(id))
    if (found) {
      return res.status(200).json({ success: true, data: found })
    }
    return res.status(404).json({ success: false, error: 'Sketch not found' })
  } catch (err) {
    console.error('Error loading fallback sketches data:', err && err.message)
    return res.status(500).json({ success: false, error: 'Failed to retrieve sketch' })
  }
}
