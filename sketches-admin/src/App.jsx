import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import CommentsPage from './pages/CommentsPage'
import MessagesPage from './pages/MessagesPage'
import AnalyticsPage from './pages/AnalyticsPage'

export default function App(){
  return (
    <div>
      <header style={{padding: '1rem', borderBottom: '1px solid #eee'}}>
        <h1>Sketches Admin</h1>
        <nav style={{display: 'flex', gap: '1rem'}}>
          <Link to="/">Comments</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/analytics">Analytics</Link>
        </nav>
      </header>
      <main style={{padding: '1rem'}}>
        <Routes>
          <Route path="/" element={<CommentsPage/>} />
          <Route path="/messages" element={<MessagesPage/>} />
          <Route path="/analytics" element={<AnalyticsPage/>} />
        </Routes>
      </main>
    </div>
  )
}
