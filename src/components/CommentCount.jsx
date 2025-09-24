import React, { useEffect, useState } from 'react'

const CommentCount = ({ sketchId, showIcon = true, size = 'small' }) => {
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sketchId) return
    let mounted = true
    setLoading(true)
    fetch(`/api/comments/${sketchId}`)
      .then(res => res.json())
      .then(data => {
        if (!mounted) return
        setCount(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => {
        if (!mounted) return
        setCount(0)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [sketchId])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.875rem' }}>
      {showIcon && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
          <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4V7z" />
        </svg>
      )}
  <span aria-live="polite" style={{ fontSize: '0.95rem', fontWeight: size === 'large' ? 600 : 500, color: '#2563eb' }}>{loading ? '...' : (count != null ? count : '-')}</span>
    </div>
  )
}

export default CommentCount
