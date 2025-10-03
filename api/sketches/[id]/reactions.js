import { sql } from '@vercel/postgres';

// Supported smiley types (only thumbs-up like)
const SMILEYS = ['like'];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing sketch id' });
  }

  try {
    const { rows } = await sql`
      SELECT smiley_type, count FROM sketch_reactions WHERE sketch_id = ${id}
    `;
    // Build a result object for thumbs-up like only
    let likeCount = 0;
    if (rows.length > 0) {
      likeCount = rows[0].count;
    }
    return res.status(200).json({ success: true, data: { like: likeCount } });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return res.status(500).json({ error: 'Failed to fetch reactions' });
  }
}
