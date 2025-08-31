import React, { useState, useEffect } from 'react';
import { sendNotificationEmail } from '../utils/emailService'

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
    if (!form.name.trim() || !form.comment.trim()) {
      setError('Name and comment are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${sketchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, comment: form.comment })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      // capture values for email notification before clearing form
      const commenterName = form.name
      const commenterComment = form.comment
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
          comments.map(comment => (
            <div key={comment.id} style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>{comment.name}</div>
              <div style={{ color: '#374151' }}>{comment.comment}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' }}>{comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
