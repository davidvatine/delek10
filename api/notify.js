// api/notify.js — sends email when client adds a comment
// Uses Resend (free: 3000 emails/month, no credit card)
const RESEND_KEY = process.env.RESEND_API_KEY || "re_bxJzgT6R_EwjfTxkpnJvhWpvydaAPE9f6";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "david@davidvatine.co.il";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  if (!RESEND_KEY || !NOTIFY_EMAIL) {
    // silent fail - comment was saved, notification optional
    return res.status(200).json({ ok: true, skipped: true });
  }

  const { gantt_id, post_type, comment, author_name, gantt_url } = req.body;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Ten Gantt <onboarding@resend.dev>',
        to: [NOTIFY_EMAIL],
        subject: `💬 הערה חדשה בגאנט ${gantt_id}`,
        html: `
          <div dir="rtl" style="font-family:Arial;max-width:500px;margin:0 auto">
            <div style="background:#1565C0;padding:16px 20px;border-radius:8px 8px 0 0">
              <h2 style="color:white;margin:0;font-size:18px">💬 הערה חדשה מהלקוח</h2>
            </div>
            <div style="background:#f5f5f5;padding:20px;border-radius:0 0 8px 8px">
              <p><strong>גאנט:</strong> ${gantt_id}</p>
              <p><strong>פוסט:</strong> ${post_type || 'כללי'}</p>
              ${author_name ? `<p><strong>מאת:</strong> ${author_name}</p>` : ''}
              <div style="background:white;padding:14px;border-radius:6px;border-right:4px solid #1565C0;margin:12px 0">
                <p style="margin:0">${comment}</p>
              </div>
              <a href="${gantt_url}" style="display:inline-block;background:#1565C0;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:8px">
                פתח גאנט ←
              </a>
            </div>
          </div>
        `
      })
    });
    return res.status(200).json({ ok: r.ok });
  } catch(e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
