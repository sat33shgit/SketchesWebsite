import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify'
import { sendNotificationEmail } from '../utils/emailService'
import UserAvatar from './UserAvatar'

const CommentsSection = ({ sketchId, sketchName }) => {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    if (!sketchId) return;
    setLoading(true);
    fetch(`/api/comments/${sketchId}`)
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sketchId]);

  // Clear success and error messages when sketchId changes
  useEffect(() => {
    setSuccess('');
    setError('');
  }, [sketchId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Client-side validation & sanitization
    const sanitized = {
      name: DOMPurify.sanitize(form.name || '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim(),
      comment: DOMPurify.sanitize(form.comment || '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()
    }

    if (!sanitized.name || !sanitized.comment) {
      setError('Please enter a valid name and comment. Special characters or unsafe content are not allowed.');
      return;
    }

    // length limits
    if (sanitized.name.length > 100) {
      setError('Name cannot exceed 100 characters.');
      return;
    }
    if (sanitized.comment.length > 1000) {
      setError('Comment cannot exceed 1000 characters.');
      return;
    }

    // block suspicious patterns
    const suspicious = /<|>|script|onerror|onload|javascript:/i
    if (suspicious.test(form.name) || suspicious.test(form.comment)) {
      setError('Unsafe input detected. Please remove any scripts or HTML.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${sketchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // send sanitized values
        body: JSON.stringify({ name: sanitized.name, comment: sanitized.comment })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      // capture values for email notification before clearing form
      const commenterName = sanitized.name
      const commenterComment = sanitized.comment
      setForm({ name: '', comment: '' });
      setSuccess('Comment posted!');
      // send email notification (best-effort, do not block UI on failure)
      try {
        await sendNotificationEmail({
          sketchName: sketchName || sketchId,
          commenterName: commenterName,
          message: `Hi,\nA new comment was posted on "${sketchName || sketchId}" by ${commenterName}\n\n${commenterComment}`
        })
      } catch (emailErr) {
        console.error('Failed to send comment notification email', emailErr)
      }
      // Refresh comments
      const commentsRes = await fetch(`/api/comments/${sketchId}`);
      const commentsData = await commentsRes.json();
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      setError('Failed to post comment.');
    }
    setLoading(false);
  };

  return (
    <div id="comments-section" tabIndex={-1} aria-label="Comments section" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Comments</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name*"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
            required
          />
        </div>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Add a comment...*"
          rows={3}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', resize: 'vertical', marginBottom: '0.5rem' }}
          required
        />
        <button type="submit" disabled={loading} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.25rem', fontWeight: 500, cursor: 'pointer' }}>
          {loading ? 'Posting...' : 'Post'}
        </button>
        {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '0.5rem' }}>{success}</div>}
      </form>
      <div>
        {loading && comments.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => {
            // Helper to format date parts and compute relative age
            const formatDateTime = (ts) => {
              if (!ts) return null
              const d = new Date(ts)
              if (isNaN(d)) return null
              const pad = (n) => n.toString().padStart(2, '0')
              const day = pad(d.getDate())
              const month = d.toLocaleString('en-US', { month: 'short' })
              const year = d.getFullYear()
              const date = `${day}-${month}-${year}`
              return { date, raw: d }
            }

            // full timestamp display removed per user request

            const computeRelative = (dateObj) => {
              if (!dateObj || !dateObj.raw) return ''
              const now = new Date()
              const then = dateObj.raw
              // compute year diff first
              const yearDiff = now.getFullYear() - then.getFullYear()
              if (yearDiff > 0) return `${yearDiff}y`
              // compute month diff
              const monthDiff = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth())
              if (monthDiff > 0) return `${monthDiff}m`
              // compute day diff
              const msPerDay = 24 * 60 * 60 * 1000
              const dayDiff = Math.floor((now - then) / msPerDay)
              if (dayDiff > 0) return `${dayDiff}d`
              // less than one day: compute hours
              const msPerHour = 60 * 60 * 1000
              const hourDiff = Math.floor((now - then) / msPerHour)
              if (hourDiff >= 1) return `${hourDiff}h`
              return 'today'
            }

            const created = comment.created_at ? formatDateTime(comment.created_at) : null
            const updated = comment.updated_at ? formatDateTime(comment.updated_at) : null

            return (
              <div key={comment.id} style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <UserAvatar name={comment.name} size="medium" />
                  <div style={{ fontWeight: 600, color: '#374151', marginLeft: '0.75rem' }}>{comment.name}</div>
                </div>
                <div style={{ color: '#374151', marginLeft: '2.75rem' }}>{comment.comment}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem', marginLeft: '2.75rem' }}>
                  {created ? computeRelative(created) : ''}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
