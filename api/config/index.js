import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { key } = req.query

    let result
    if (key) {
      // Fetch specific configuration
      result = await sql`
        SELECT key, value, created_at, updated_at
        FROM configurations
        WHERE key = ${key}
      `
    } else {
      // Fetch all configurations
      result = await sql`
        SELECT key, value, created_at, updated_at
        FROM configurations
      `
    }

    // Convert rows to object format
    const config = {}
    result.rows.forEach(row => {
      config[row.key] = row.value
    })

    return res.status(200).json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error fetching configurations:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch configurations',
      details: error.message
    })
  }
}
