// api/gantt.js — Vercel Serverless Function for Supabase gantt storage
const SUPABASE_URL = process.env.SUPABASE_URL || "https://oexdfprqbhlbuesaxfjx.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGRmcHJxYmhsYnVlc2F4Zmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDk4MzQsImV4cCI6MjA4ODI4NTgzNH0.jh-Tv2d8dQOW8UQ6UgiBcpVTTzlaePzWQg9ozm6BSgs";

function sb(path, method='GET', body=null) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method==='POST' ? 'return=representation' : '',
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  // ── SAVE gantt → returns share ID ──
  if (req.method === 'POST' && action === 'save') {
    const { id, year, month, ne, posts } = req.body;
    if (!id || !posts) return res.status(400).json({ error: 'missing fields' });

    // upsert
    const r = await sb('gantts', 'POST', {
      id, year, month, ne, posts,
      updated_at: new Date().toISOString()
    });
    // if conflict (id exists), update
    if (r.status === 409 || r.status === 400) {
      await sb(`gantts?id=eq.${id}`, 'PATCH', {
        ne, posts, updated_at: new Date().toISOString()
      });
    }
    return res.status(200).json({ ok: true, id });
  }

  // ── LOAD gantt by ID ──
  if (req.method === 'GET' && action === 'load') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'missing id' });
    const r = await sb(`gantts?id=eq.${id}&select=*`);
    const data = await r.json();
    if (!data || data.length === 0) return res.status(404).json({ error: 'not found' });
    return res.status(200).json(data[0]);
  }

  // ── ADD comment ──
  if (req.method === 'POST' && action === 'comment') {
    const { gantt_id, post_id, comment, author_name } = req.body;
    if (!gantt_id || !comment) return res.status(400).json({ error: 'missing fields' });
    const r = await sb('comments', 'POST', {
      gantt_id, post_id, comment, author_name,
      created_at: new Date().toISOString(),
      is_read: false
    });
    const data = await r.json();

    // Send email notification via Supabase Edge Function (optional)
    // We'll handle email separately
    return res.status(200).json({ ok: true, comment: data[0] });
  }

  // ── GET comments for gantt ──
  if (req.method === 'GET' && action === 'comments') {
    const { gantt_id } = req.query;
    if (!gantt_id) return res.status(400).json({ error: 'missing gantt_id' });
    const r = await sb(`comments?gantt_id=eq.${gantt_id}&order=created_at.asc`);
    const data = await r.json();
    return res.status(200).json(data || []);
  }

  // ── UPDATE post promo text (client fills promo details) ──
  if (req.method === 'PATCH' && action === 'update') {
    const { id, posts } = req.body;
    if (!id || !posts) return res.status(400).json({ error: 'missing fields' });
    await sb(`gantts?id=eq.${id}`, 'PATCH', {
      posts, updated_at: new Date().toISOString()
    });
    return res.status(200).json({ ok: true });
  }

  return res.status(404).json({ error: 'unknown action' });
}
