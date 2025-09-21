import validator from 'validator';
import { sql } from '@vercel/postgres';

function stripTags(input) {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  // Sanitize and validate
  const cleanName = stripTags(name || '').trim();
  const cleanEmail = stripTags(email || '').trim();
  const cleanSubject = stripTags(subject || '').trim();
  const cleanMessage = stripTags(message || '').trim();

  if (
    !cleanName ||
    !cleanEmail ||
    !cleanSubject ||
    !cleanMessage ||
    cleanName.length > 100 ||
    cleanEmail.length > 255 ||
    cleanSubject.length > 200 ||
    cleanMessage.length > 10000 ||
    /<|>|script|onerror|onload|javascript:/i.test(name) ||
    /<|>|script|onerror|onload|javascript:/i.test(subject) ||
    /<|>|script|onerror|onload|javascript:/i.test(message)
  ) {
    return res.status(400).json({ success: false, message: 'Invalid or unsafe input detected.' });
  }

  if (!validator.isEmail(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }
  if (!validator.isAscii(cleanName) || !validator.isAscii(cleanSubject) || !validator.isAscii(cleanMessage)) {
    return res.status(400).json({ success: false, message: 'Input contains unsafe characters.' });
  }

  try {
    // Get client information for tracking
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection?.remoteAddress || 
                    req.socket?.remoteAddress ||
                    'unknown';
    
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Save the contact message to database
    const dbResult = await sql`
      INSERT INTO contact_messages (
        name, 
        email, 
        subject, 
        message, 
        ip_address, 
        user_agent,
        status,
        is_read,
        created_at
      ) VALUES (
        ${cleanName}, 
        ${cleanEmail.toLowerCase()}, 
        ${cleanSubject}, 
        ${cleanMessage}, 
        ${clientIP},
        ${userAgent},
        'new',
        false,
        CURRENT_TIMESTAMP
      )
      RETURNING id, created_at
    `;

    // Return success response with expected format
    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.',
      id: dbResult.rows[0].id,
      timestamp: dbResult.rows[0].created_at
    });

  } catch (error) {
    console.error('Error saving contact message to database:', error);
    
    // Return error response 
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save message. Please try again later.',
      details: error.message
    });
  }
}
