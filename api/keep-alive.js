// Daily Vercel Cron → touches Supabase so the free project is never paused for inactivity.
// Schedule lives in vercel.json ("crons"). Can also be opened manually: /api/keep-alive

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cfmmelqvbyatrfqqoajz.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mjnZpLZXkvN2HcRw9qfq7A__T85Anwa';

export default async function handler(req, res) {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal'
  };

  try {
    // A real write (not just a read) so the project registers activity
    const ping = await fetch(`${SUPABASE_URL}/rest/v1/keep_alive?on_conflict=id`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: 1, last_ping: new Date().toISOString(), source: 'vercel-cron' })
    });
    const read = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&limit=1`, { headers });

    res.status(ping.ok && read.ok ? 200 : 502).json({
      ok: ping.ok && read.ok,
      ping: ping.status,
      read: read.status,
      at: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
}
