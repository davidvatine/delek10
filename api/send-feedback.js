export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { ganttKey, posts } = req.body;

  // שמירה ב-Supabase
  await fetch(`https://oexdfprqbhlbuesaxfjx.supabase.co/rest/v1/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGRmcHJxYmhsYnVlc2F4Zmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDk4MzQsImV4cCI6MjA4ODI4NTgzNH0.jh-Tv2d8dQOW8UQ6UgiBcpVTTzlaePzWQg9ozm6BSgs",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGRmcHJxYmhsYnVlc2F4Zmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDk4MzQsImV4cCI6MjA4ODI4NTgzNH0.jh-Tv2d8dQOW8UQ6UgiBcpVTTzlaePzWQg9ozm6BSgs",
    },
    body: JSON.stringify({ gantt_key: ganttKey, posts }),
  });

  // שליחת מייל
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer re_PXs3L9Dd_GGUKf48TVEWQcJw5RfDQDoxn",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "david@davidvatine.co.il",
      subject: "פידבק חדש מלקוח על הגאנט",
      html: `<div dir="rtl">
        <h2>פידבק חדש התקבל!</h2>
        <p><strong>מפתח גאנט:</strong> ${ganttKey}</p>
        <hr/>
        ${posts.map(p => `
          <div style="margin-bottom:16px;padding:12px;border:1px solid #e2e8f0;border-radius:8px">
            <strong>#${p.id} | ${p.date || "לפי מבצע"} | ${p.type}</strong><br/>
            סטטוס: ${p.approved ? "✅ מאושר" : "⏳ ממתין"}<br/>
            ${p.clientNote ? `הערה: ${p.clientNote}` : ""}
          </div>
        `).join("")}
      </div>`,
    }),
  });

  res.status(200).json({ ok: true });
}
