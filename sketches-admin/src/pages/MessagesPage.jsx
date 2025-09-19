import React, {useEffect, useState} from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function MessagesPage(){
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      const q = query(collection(db, 'messages'))
      const snap = await getDocs(q)
      const arr = []
      snap.forEach(s=> arr.push({ id: s.id, ...s.data() }))
      setMessages(arr)
      setLoading(false)
    }
    load()
  },[])

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

  if(loading) return <div>Loading messages...</div>

  return (
    <div>
      {messages.length===0 && <div>No messages</div>}
      <ul>
        {messages.map(m=> (
          <li key={m.id} style={{padding: '0.5rem', borderBottom: '1px solid #eee'}}>
            <div><strong>{m.name}</strong> &lt;{m.email}&gt;</div>
            <div><small>{(()=>{const f=formatDateTime(m.sentAt); return `${f.time} ${f.date}`})()}</small></div>
            <div style={{marginTop: '0.5rem'}}>{m.message || m.body || m.text}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
