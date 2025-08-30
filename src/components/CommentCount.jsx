import React, { useEffect, useState } from 'react'

const CommentCount = ({ sketchId }) => {
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span aria-live="polite">{loading ? '...' : (count != null ? count : '-')}</span>
    </div>
  )
}

export default CommentCount
