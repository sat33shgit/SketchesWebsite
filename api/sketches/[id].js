import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id: sketchId } = req.query

  if (!sketchId) {
    return res.status(400).json({ success: false, error: 'Sketch ID is required' })
  }

  // Try Postgres first
  try {
    const { rows } = await sql`
      SELECT sketch_id AS id,
             sketch_name AS title,
             sketch_description AS description,
             NULL AS image_path,
             NULL AS orientation,
             sketch_completed_date AS completed_date,
             time AS time,
             NULL AS category
      FROM sketches WHERE sketch_id = ${sketchId}
    `

    if (rows && rows.length) {
      const r = rows[0]
      // Unify completed date handling from either column
      let completedDate = null
      const rawDate = r.completed_date ?? r.sketch_completed_date
      if (rawDate) {
        completedDate = (rawDate instanceof Date)
          ? rawDate.toISOString().split('T')[0]
          : String(rawDate)
      }

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

  // Fallback to local file
  try {
    const module = await import('../../src/data/sketches.js')
    const localSketches = module.sketches || module.default || []
    const found = localSketches.find(s => String(s.id) === String(sketchId))
    if (found) {
      return res.status(200).json({ success: true, data: found })
    }
    return res.status(404).json({ success: false, error: 'Sketch not found' })
  } catch (err) {
    console.error('Error loading fallback sketches data:', err && err.message)
    return res.status(500).json({ success: false, error: 'Failed to retrieve sketch' })
  }
}
