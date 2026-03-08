export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { ganttKey, posts } = req.body;

  // --- 1. Save to Supabase ---
  try {
    const supabaseRes = await fetch(
      `https://oexdfprqbhlbuesaxfjx.supabase.co/rest/v1/feedback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ gantt_key: ganttKey, posts }),
      }
    );

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      console.error("Supabase error:", supabaseRes.status, errText);
    } else {
      console.log("Supabase save OK");
    }
  } catch (err) {
    console.error("Supabase fetch failed:", err);
  }

  // --- 2. Build the email HTML ---
  const emailHtml = `<div dir="rtl">
    <h2>פידבק חדש התקבל!</h2>
    <p><strong>מפתח גאנט:</strong> ${ganttKey}</p>
    <hr/>
    ${posts
      .map(
        (p) => `
      <div style="margin-bottom:16px;padding:12px;border:1px solid #e2e8f0;border-radius:8px">
        <strong>#${p.id} | ${p.date || "לפי מבצע"} | ${p.type}</strong><br/>
        סטטוס: ${p.approved ? "✅ מאושר" : "⏳ ממתין"}<br/>
        ${p.clientNote ? `הערה: ${p.clientNote}` : ""}
      </div>
    `
      )
      .join("")}
  </div>`;

  // --- 3. Send email via Resend ---
  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "support@davidvatine.co.il",
        to: "david@davidvatine.co.il",
        subject: "פידבק חדש מלקוח על הגאנט",
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    console.log("Resend status:", resendRes.status);
    console.log("Resend response:", JSON.stringify(resendData));

    if (!resendRes.ok) {
      console.error("Resend error:", resendRes.status, resendData);
      return res.status(200).json({
        ok: true,
        supabase: "saved",
        email: "failed",
        emailError: resendData,
      });
    }

    return res.status(200).json({
      ok: true,
      supabase: "saved",
      email: "sent",
      emailId: resendData.id,
    });
  } catch (err) {
    console.error("Resend fetch failed:", err);
    return res.status(200).json({
      ok: true,
      supabase: "saved",
      email: "failed",
      emailError: err.message,
    });
  }
}
