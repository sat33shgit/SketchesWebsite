import React, {useEffect, useState} from 'react'

// Admin uses the main site's serverless API which stores comments in Postgres.
// Configure the API base via VITE_API_BASE environment variable, default to localhost:3000
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export default function CommentsPage(){
  const [commentsBySketch, setCommentsBySketch] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        // first get counts / list of sketch ids
        const countsRes = await fetch(`${API_BASE}/api/comments/counts`)
        if(!countsRes.ok) throw new Error('Failed to fetch comment counts')
        const countsJson = await countsRes.json()
        const sketchIds = Object.keys(countsJson.data || {})

        const map = {}
        // fetch comments per sketch in parallel
        await Promise.all(sketchIds.map(async sid => {
          try{
            const r = await fetch(`${API_BASE}/api/comments/${encodeURIComponent(sid)}`)
            if(!r.ok) return
            const rows = await r.json()
            map[sid] = rows.map(rw => ({ id: rw.id, name: rw.name, text: rw.comment, createdAt: rw.created_at }))
          }catch(e){
            console.warn('Failed to load comments for', sid, e)
          }
        }))

        setCommentsBySketch(map)
      }catch(e){
        console.error('Error loading comments', e)
      }finally{
        setLoading(false)
      }
    }
    load()
  },[])

  // markInvisible and removeComment operate via the site's API
  async function markInvisible(commentId){
    try{
      const r = await fetch(`${API_BASE}/api/comments/mark-invisible`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ id: commentId })
      })
      if(!r.ok) throw new Error('Failed to mark invisible')
      // optimistic update locally
      setCommentsBySketch(prev => {
        const copy = {...prev}
        for(const k of Object.keys(copy)){
          copy[k] = copy[k].map(c => c.id===commentId?({...c, visible:false}):c)
        }
        return copy
      })
    }catch(e){
      console.error(e)
      alert('Failed to mark invisible')
    }
  }

  async function removeComment(commentId){
    try{
      const r = await fetch(`${API_BASE}/api/comments/delete`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ id: commentId })
      })
      if(!r.ok) throw new Error('Failed to delete')
      setCommentsBySketch(prev => {
        const copy = {}
        for(const k of Object.keys(prev)){
          copy[k] = prev[k].filter(c=>c.id!==commentId)
        }
        return copy
      })
    }catch(e){
      console.error(e)
      alert('Failed to delete')
    }
  }

  function formatDateTime(val){
    if(!val) return { time: '', date: '' }
    let d
    if(typeof val === 'string') d = new Date(val)
    else if(val.toDate) d = val.toDate()
    else d = new Date(val)
    if(isNaN(d)) return { time: '', date: '' }
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    const day = String(d.getDate()).padStart(2,'0')
    const month = d.toLocaleString('en-US', { month: 'short' })
    const date = `${day}-${month}-${d.getFullYear()}`
    return { time, date }
  }

  if(loading) return <div>Loading comments...</div>

  return (
    <div>
      {Object.keys(commentsBySketch).length===0 && <div>No comments found</div>}
      {Object.entries(commentsBySketch).map(([sketchId, comments])=> (
        <section key={sketchId} style={{marginBottom: '2rem'}}>
          <h2>Sketch: {sketchId}</h2>
          <ul>
            {comments.map(c=> (
              <li key={c.id} style={{padding: '0.5rem', borderBottom: '1px solid #eee'}}>
                <div>
                  <strong>{c.authorName || 'Anonymous'}</strong> - <small>{(()=>{const f=formatDateTime(c.createdAt); return `${f.time} ${f.date}`})()}</small>
                </div>
                <div style={{marginTop: '0.5rem'}}>{c.text || c.content}</div>
                <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.5rem'}}>
                  <button onClick={()=>markInvisible(c.id)}>Mark Invisible</button>
                  <button onClick={()=>removeComment(c.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
