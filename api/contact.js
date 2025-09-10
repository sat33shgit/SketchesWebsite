import validator from 'validator';

function stripTags(input) {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export default async function handler(req, res) {
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
    cleanEmail.length > 100 ||
    cleanSubject.length > 100 ||
    cleanMessage.length > 1000 ||
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

  // ...existing logic to send the contact email...
  return res.status(200).json({ success: true, message: 'Message sent!' });
}
