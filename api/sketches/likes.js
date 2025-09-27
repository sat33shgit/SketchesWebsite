import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { rows } = await sql`SELECT sketch_id, count FROM sketch_reactions WHERE smiley_type = 'like'`;
    // Build mapping: { sketchId: count }
    const result = {};
    rows.forEach(row => {
      result[row.sketch_id] = row.count;
    });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching like counts:', error);
    return res.status(500).json({ error: 'Failed to fetch like counts' });
  }
}
