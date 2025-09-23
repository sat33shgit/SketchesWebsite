import React, { useEffect, useState, useRef } from 'react'
import { getSketchStats, toggleLike } from '../utils/vercelDatabase'

const EMOJIS = [
  { key: 'like', emoji: '👍', label: 'Like' },
  { key: 'love', emoji: '❤️', label: 'Love' },
  { key: 'funny', emoji: '😂', label: 'Funny' },
  { key: 'wow', emoji: '😮', label: 'Wow' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'angry', emoji: '😡', label: 'Angry' }
]

const ReactionPicker = ({ sketchId }) => {
  const [likes, setLikes] = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!sketchId) return
    let mounted = true
    const load = async () => {
      try {
        const stats = await getSketchStats(sketchId)
        if (!mounted) return
        setLikes(stats.likes || 0)
        setUserLiked(!!stats.userLiked)
      } catch (e) {
        // ignore
      }
      // read selected reaction from localStorage
      const sel = localStorage.getItem(`selected_reaction_${sketchId}`)
      if (sel) setSelected(sel)
    }
    load()
    return () => { mounted = false }
  }, [sketchId])

  useEffect(() => {
    const onDocClick = (e) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const handleSelect = async (emojiKey) => {
    if (!sketchId) return
    setOpen(false)
    // If user hasn't liked yet, toggle a like on server/local fallback
    if (!userLiked) {
      setLoading(true)
      try {
        const newStats = await toggleLike(sketchId)
        setLikes(newStats.likes)
        setUserLiked(!!newStats.userLiked)
        setSelected(emojiKey)
        localStorage.setItem(`selected_reaction_${sketchId}`, emojiKey)
      } catch (err) {
        console.error('Failed to register reaction like', err)
      } finally {
        setLoading(false)
      }
      return
    }

    // If user already liked:
    const prev = localStorage.getItem(`selected_reaction_${sketchId}`)
    if (prev === emojiKey) {
      // clicking same reaction removes the like
      setLoading(true)
      try {
        const newStats = await toggleLike(sketchId) // unlike
        setLikes(newStats.likes)
        setUserLiked(!!newStats.userLiked)
        setSelected(null)
        localStorage.removeItem(`selected_reaction_${sketchId}`)
      } catch (err) {
        console.error('Failed to remove like', err)
      } finally {
        setLoading(false)
      }
    } else {
      // change selected reaction locally
      setSelected(emojiKey)
      localStorage.setItem(`selected_reaction_${sketchId}`, emojiKey)
    }
  }

  return (
    <div ref={containerRef} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div>
        <button
          onClick={() => setOpen(v => !v)}
          disabled={loading}
          aria-haspopup="true"
          aria-expanded={open}
          title={selected ? `Reaction: ${selected}` : 'React to this sketch'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ fontSize: '1.25rem' }}>{selected ? (EMOJIS.find(e => e.key === selected)?.emoji || '👍') : '👍'}</span>
          <span style={{ color: '#374151', fontWeight: 600 }}>{likes}</span>
        </button>
      </div>

      {open && (
        <div role="menu" aria-label="Reaction picker" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
          {EMOJIS.map(item => (
            <button
              key={item.key}
              onClick={() => handleSelect(item.key)}
              aria-label={item.label}
              title={item.label}
              style={{ fontSize: '1.25rem', background: selected === item.key ? '#f3f4f6' : 'transparent', border: 'none', padding: '0.35rem', borderRadius: '0.375rem', cursor: 'pointer' }}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReactionPicker
