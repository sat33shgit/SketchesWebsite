import { sql } from '@vercel/postgres'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { id } = req.body || {}
  if(!id) return res.status(400).json({ error: 'Missing id' })
  try{
    await sql`DELETE FROM comments WHERE id = ${id}`
    return res.status(200).json({ success: true })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}
