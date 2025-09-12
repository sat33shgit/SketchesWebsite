import { sql } from '@vercel/postgres';

// Supported smiley types (only thumbs-up like)
const SMILEYS = ['like'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { smileyType, deviceId, action } = req.body;

  if (!id || !smileyType || !deviceId || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!SMILEYS.includes(smileyType)) {
    return res.status(400).json({ error: 'Invalid smiley type' });
  }
  if (!['like', 'unlike'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    let result;
    if (action === 'like') {
      result = await sql`
        INSERT INTO sketch_reactions (sketch_id, smiley_type, count)
        VALUES (${id}, ${smileyType}, 1)
        ON CONFLICT (sketch_id, smiley_type)
        DO UPDATE SET count = sketch_reactions.count + 1, updated_at = NOW();
      `;
    } else if (action === 'unlike') {
      result = await sql`
        UPDATE sketch_reactions
        SET count = GREATEST(count - 1, 0), updated_at = NOW()
        WHERE sketch_id = ${id} AND smiley_type = ${smileyType};
      `;
    }
    // Fetch updated count for confirmation
    const { rows } = await sql`
      SELECT count FROM sketch_reactions WHERE sketch_id = ${id} AND smiley_type = ${smileyType}
    `;
    const updatedCount = rows.length > 0 ? rows[0].count : null;
    return res.status(200).json({ success: true, count: updatedCount });
  } catch (error) {
    console.error('Error saving reaction:', error);
    return res.status(500).json({ error: 'Failed to save reaction', details: error.message });
  }
}
