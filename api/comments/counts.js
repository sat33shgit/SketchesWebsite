import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    // Count only comments marked as visible (visible = 'Y')
    const { rows } = await sql`
      SELECT sketch_id, COUNT(*) AS count
      FROM comments
      WHERE visible = 'Y'
      GROUP BY sketch_id
    `;
    // Build mapping: { sketchId: count }
    const result = {};
    rows.forEach(row => {
      result[row.sketch_id] = parseInt(row.count, 10);
    });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching comment counts:', error);
    return res.status(500).json({ error: 'Failed to fetch comment counts' });
  }
}
