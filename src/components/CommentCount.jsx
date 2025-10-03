import React, { useEffect, useState } from 'react'

const CommentCount = ({ sketchId, showIcon = true, size = 'small' }) => {
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sketchId) return
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/comments/${encodeURIComponent(sketchId)}`)
        if (!mounted) return

        // Try to parse JSON safely
        let data
        try {
          data = await res.json()
        } catch {
          data = null
        }

        // Determine count from several possible response shapes:
        // - an array (rows) => length
        // - { success: true, data: [...] } => data.length
        // - { count: N } => count
        // - { data: N } => data (number)
        // - fallback: 0
        let next = 0
        if (Array.isArray(data)) next = data.length
        else if (data && typeof data === 'object') {
          if (Array.isArray(data.data)) next = data.data.length
          else if (typeof data.count === 'number') next = data.count
          else if (typeof data.data === 'number') next = data.data
          else if (Array.isArray(data.rows)) next = data.rows.length
        }

        // If response was OK and we derived a valid number, set it; otherwise 0
        if (res.ok) {
          setCount(typeof next === 'number' ? next : 0)
        } else {
          // Non-ok response, still set derived count if any
          setCount(typeof next === 'number' ? next : 0)
        }
      } catch {
        // Network error or API unreachable -> fallback to 0
        if (mounted) setCount(0)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

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
