import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get all like counts from Postgres
    const { rows } = await sql`
      SELECT sketch_id, count 
      FROM sketch_reactions 
      WHERE smiley_type = 'like'
    `
    
    const result = {}
    rows.forEach(r => { 
      result[r.sketch_id] = r.count 
    })
    
    return res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.error('Error fetching all likes:', error && error.message)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch likes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
