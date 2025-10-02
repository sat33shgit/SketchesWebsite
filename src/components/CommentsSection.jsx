import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify'
import { sendNotificationEmail } from '../utils/emailService'
import UserAvatar from './UserAvatar'
import { useTranslation } from '../i18n'

const CommentsSection = ({ sketchId, sketchName }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [commentsDisabled, setCommentsDisabled] = useState(false);


  useEffect(() => {
    if (!sketchId) return;
    setLoading(true);
    fetch(`/api/comments/${sketchId}`)
      .then(res => res.json())
      .then(data => {
          setComments(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => { setLoading(false); });
  }, [sketchId]);

  // Fetch configuration to check if comments are disabled
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config?key=comments_disable');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.comments_disable === 'Y') {
            setCommentsDisabled(true);
          }
        }
      } catch (err) {
        // If config fetch fails, default to comments enabled
        console.error('Failed to fetch config:', err);
      }
    };
    
    fetchConfig();
  }, []);

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
      } catch {
        // Best-effort: don't surface email errors to the user
        console.error('Failed to send comment notification email')
      }
      // Refresh comments
      const commentsRes = await fetch(`/api/comments/${sketchId}`);
      const commentsData = await commentsRes.json();
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch {
      setError('Failed to post comment.')
    }
    setLoading(false);
  };

  return (
    <div id="comments-section" tabIndex={-1} aria-label="Comments section" className="discussion-section">
      {/* Discussion Header */}
      <div className="discussion-header" style={{ color: '#000000' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="discussion-icon" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4V7z" />
        </svg>
        <h2 className="discussion-title" style={{ color: '#000000' }}>Comments ({comments.length})</h2>
      </div>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="name-input"
            disabled={commentsDisabled}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Share your thoughts about this artwork..."
            rows={4}
            className="comment-textarea"
            style={{ height: '80px', minHeight: '30px' }}
            disabled={commentsDisabled}
            required
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button type="submit" disabled={loading || commentsDisabled} className="post-comment-btn">
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
          {commentsDisabled && (
            <span className="comments-disabled-message">
              {t('sketch.commentsDisabled')}
            </span>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
      
      {/* Comments List */}
      <div className="comments-list">
        {loading && comments.length === 0 ? (
          <p className="loading-message">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments-message">No comments yet. Be the first to comment!</p>
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

            const computeRelative = (dateObj) => {
              if (!dateObj || !dateObj.raw) return ''
              const now = new Date()
              const then = dateObj.raw
              const diffMs = now - then

              // Years
              const yearDiff = now.getFullYear() - then.getFullYear()
              if (yearDiff > 0) return `${yearDiff}y ago`

              // Months
              const monthDiff = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth())
              if (monthDiff > 0) return `${monthDiff}mo ago`

              // Days
              const msPerDay = 24 * 60 * 60 * 1000
              const dayDiff = Math.floor(diffMs / msPerDay)
              if (dayDiff > 6) return `${Math.floor(dayDiff / 7)}w ago`
              if (dayDiff > 0) return `${dayDiff}d ago`

              // Hours
              const msPerHour = 60 * 60 * 1000
              const hourDiff = Math.floor(diffMs / msPerHour)
              if (hourDiff >= 1) return `${hourDiff}h ago`

              // Minutes
              const msPerMinute = 60 * 1000
              const minuteDiff = Math.floor(diffMs / msPerMinute)
              // Under 5 minutes -> 'Just now'
              if (minuteDiff < 5) return 'Just now'
              // 5-59 minutes -> 'Xm ago'
              if (minuteDiff < 60) return `${minuteDiff}m ago`

              return 'Just now'
            }

            const created = comment.created_at ? formatDateTime(comment.created_at) : null

            return (
              <div key={comment.id} className="comment-item">
                {/* Avatar */}
                <div className="comment-avatar">
                  <UserAvatar name={comment.name} size="medium" />
                </div>
                
                {/* Comment content */}
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.name}</span>
                    <span className="comment-timestamp">
                      {created ? computeRelative(created) : ''}
                    </span>
                  </div>
                  <div className="comment-text">{comment.comment}</div>
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
