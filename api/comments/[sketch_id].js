import { sql } from '@vercel/postgres';
import validator from 'validator';

function stripTags(input) {
  // Remove all HTML tags
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export default async function handler(req, res) {
  const sketchId = req.query.sketchId;

  if (req.method === 'POST') {
    const { name, comment } = req.body;

    // Sanitize and validate (robust)
    const cleanName = stripTags(name || '').trim();
    const cleanComment = stripTags(comment || '').trim();

    if (
      !cleanName ||
      !cleanComment ||
      cleanName.length > 100 ||
      cleanComment.length > 1000 ||
      /<|>|script|onerror|onload|javascript:/i.test(name) ||
      /<|>|script|onerror|onload|javascript:/i.test(comment)
    ) {
      return res.status(400).json({ success: false, message: 'Please enter a valid name and comment. Special characters or unsafe content are not allowed.' });
    }

    if (!validator.isAscii(cleanName) || !validator.isAscii(cleanComment)) {
      return res.status(400).json({ success: false, message: 'Input contains unsafe characters.' });
    }

    // ...existing logic to save the comment to DB...

    return res.status(200).json({ success: true, message: 'Comment posted!' });
  }

  console.log('API called:', {
    method: req.method,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
  const {
    query: { sketch_id },
    method,
  } = req;
  let body = req.body;
  // Parse JSON body if needed
  if (req.method === 'POST' && typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  if (!sketch_id) {
    return res.status(400).json({ error: 'Missing sketch_id' });
  }

  if (method === 'GET') {
    // Fetch comments for a sketch
    try {
      const { rows } = await sql`SELECT id, name, comment, created_at FROM comments WHERE sketch_id = ${sketch_id} ORDER BY created_at DESC`;
      return res.status(200).json(rows);
    } catch (error) {
      console.error('GET comments error:', error);
      return res.status(500).json({ error: error.message });
    }
  } else if (method === 'POST') {
    // Add a new comment
    const { name, comment } = body || {};
    if (!name || !comment) {
      return res.status(400).json({ error: 'Name and comment are required' });
    }
    try {
      await sql`INSERT INTO comments (sketch_id, name, comment) VALUES (${sketch_id}, ${name}, ${comment})`;
      return res.status(201).json({ message: 'Comment added' });
    } catch (error) {
      console.error('POST comment error:', error, 'Body:', body);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
