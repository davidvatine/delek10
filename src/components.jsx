import { useState, useEffect } from "react";
import { BL, BLl, RD, WH, BR, DK } from "./constants";
import { MHE, DHE } from "./constants";
import { fmt, dn } from "./utils";
import { pMonday, pHoliday, pFun, pRecruit, pPromo, callAI } from "./prompts";

/* ─── VISUAL ──────────────────────────────────────────────────────── */
export function TenVisual({ type, c }) {
  const uid = type.replace(/[^a-z]/gi, "").slice(0, 6) + Math.random().toString(36).slice(2, 5);
  const rays = Array.from({ length: 16 }, (_, i) => i * (360 / 16));
  const cfgs = {
    "שני חסכוני":          { bg1: "#1565C0", bg2: "#0D47A1", badge: "40 אג׳ חיסכון לליטר",  badgeBg: "#D32F2F", icon: "⛽",           title: "יום שני חסכוני" },
    "חג / אירוע":          { bg1: "#1B5E20", bg2: "#2E7D32", badge: "Ten איתכם תמיד",       badgeBg: "#1565C0", icon: c.emoji || "🌸", title: c.holidays[0]?.n || "חגים ואירועים" },
    "מצחיק / אפליקציה":   { bg1: "#0D47A1", bg2: "#1565C0", badge: "ספרו לנו בתגובות!",    badgeBg: "#D32F2F", icon: "📱",           title: "את מי תבחרו?" },
    "דרושים":              { bg1: "#B71C1C", bg2: "#C62828", badge: "יש לנו מאצ׳?",          badgeBg: "#1565C0", icon: "👥",           title: "אנחנו מגייסים!" },
    "פוסט מבצע":           { bg1: "#E65100", bg2: "#BF360C", badge: "רק בתחנות Ten",         badgeBg: "#1B5E20", icon: "🛒",           title: "מבצע מיוחד" },
  };
  const cfg = cfgs[type] || cfgs["שני חסכוני"];

  return (
    <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 14, display: "block", boxShadow: "0 8px 28px rgba(0,0,0,0.28)" }}>
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={cfg.bg1} stopOpacity="1" />
          <stop offset="100%" stopColor={cfg.bg2} stopOpacity="1" />
        </radialGradient>
        <clipPath id={`cp${uid}`}><rect width="280" height="280" rx="14" /></clipPath>
      </defs>
      <g clipPath={`url(#cp${uid})`}>
        <rect width="280" height="280" fill={`url(#bg${uid})`} />
        {rays.map((angle, i) => (
          <line key={i} x1="140" y1="50"
            x2={140 + Math.cos((angle - 90) * Math.PI / 180) * 380}
            y2={50 + Math.sin((angle - 90) * Math.PI / 180) * 380}
            stroke="white" strokeWidth="1.8" opacity="0.07" />
        ))}
        <path d="M0 185 L280 165 L280 280 L0 280 Z" fill="#C62828" opacity="0.9" />
        <path d="M0 178 L280 158 L280 168 L0 192 Z" fill="white" opacity="0.1" />
        <rect x="16" y="16" width="248" height="152" rx="14" fill="white" opacity="0.95" />
        <text x="140" y="82" textAnchor="middle" fontSize="46" dominantBaseline="middle">{cfg.icon}</text>
        <text x="140" y="122" textAnchor="middle" fontSize="18" fontWeight="900" fill={cfg.bg2}
          fontFamily="Arial Black,Arial,sans-serif">{cfg.title}</text>
        {type === "שני חסכוני" && (
          <>
            <text x="140" y="148" textAnchor="middle" fontSize="26" fontWeight="900" fill="#D32F2F"
              fontFamily="Arial Black,Arial,sans-serif">40</text>
            <text x="175" y="148" textAnchor="start" fontSize="12" fontWeight="700" fill="#1565C0"
              fontFamily="Arial,sans-serif"> אגורות</text>
          </>
        )}
        <rect x="30" y="200" width="220" height="32" rx="16" fill={cfg.badgeBg} />
        <text x="140" y="221" textAnchor="middle" fontSize="13" fontWeight="800" fill="white"
          fontFamily="Arial Black,Arial,sans-serif">{cfg.badge}</text>
        <circle cx="245" cy="256" r="20" fill="white" opacity="0.95" />
        <text x="235" y="263" fontSize="16" fontWeight="900" fill={BL} fontFamily="Arial Black,Arial,sans-serif">1</text>
        <circle cx="252" cy="256" r="10" fill={RD} />
        <circle cx="249" cy="253" r="2.2" fill="white" />
        <circle cx="255" cy="253" r="2.2" fill="white" />
        <path d="M247 259 Q252 264 257 259" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <text x="140" y="263" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.55)"
          fontFamily="Arial,sans-serif">לנשמה ולדרך</text>
      </g>
    </svg>
  );
}

/* ─── BADGE ───────────────────────────────────────────────────────── */
export function Badge({ type }) {
  const m = {
    "שני חסכוני":        ["#E3F2FD", BL,       "#90CAF9"],
    "חג / אירוע":        ["#E8F5E9", "#1B5E20", "#A5D6A7"],
    "מצחיק / אפליקציה": ["#FFF3E0", "#E65100", "#FFCC80"],
    "דרושים":            ["#FCE4EC", "#C62828", "#F48FB1"],
    "פוסט מבצע":         ["#FFF8E1", "#E65100", "#FFE082"],
  };
  const [bg, color, border] = m[type] || ["#F5F5F5", "#333", "#DDD"];
  return (
    <span style={{ display: "inline-block", padding: "3px 11px", borderRadius: 20, fontSize: 11,
      fontWeight: 800, background: bg, color, border: `1px solid ${border}`, whiteSpace: "nowrap" }}>
      {type}
    </span>
  );
}

/* ─── EXPORT MODAL ────────────────────────────────────────────────── */
export function ExportModal({ posts, month, year, c, onClose }) {
  const [tab, setTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  const textContent = [
    `גאנט תוכן | דלק Ten | ${MHE[month]} ${year}`,
    `עונה: ${c.season} | ${c.weather}`,
    `חגים: ${c.holidays.map(h => h.n).join(", ") || "אין"}`,
    `הקשר: ${c.news}`, ``,
    `=== סיכום ===`,
    ...posts.map(p => `${p.num}. ${p.date ? fmt(p.date) : "לפי מבצע"} | ${p.type} | ${p.copy ? "✅ מוכן" : "⭕ ממתין"}`),
    ``, `=== פוסטים מלאים ===`, ``,
    ...posts.map(p => [
      `────────────────────────`,
      `פוסט #${p.num} | ${p.type}`,
      p.date ? `${fmt(p.date)} | ${dn(p.date)}` : "", ``,
      p.copy || "[טרם נוצר]", ``
    ].join("\n"))
  ].join("\n");

  function copyAll() {
    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const donePosts = posts.filter(p => p.copy);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: WH, borderRadius: 16, width: "100%", maxWidth: 780, maxHeight: "90vh",
        display: "flex", flexDirection: "column", overflow: "hidden", direction: "rtl" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ background: `linear-gradient(135deg,${BL},#0D47A1)`, padding: "14px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ color: WH, fontWeight: 900, fontSize: 16 }}>📤 ייצוא גאנט | {MHE[month]} {year}</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none",
            color: WH, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>✕</button>
        </div>
        <div style={{ display: "flex", borderBottom: `2px solid ${BR}`, flexShrink: 0 }}>
          {[["text", "📋 טקסט להעתקה"], ["preview", "👁️ תצוגה מקדימה"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: "11px 20px", border: "none", background: "none", fontWeight: 700,
                fontSize: 13, cursor: "pointer", color: tab === id ? BL : "#78909C",
                borderBottom: tab === id ? `3px solid ${BL}` : "3px solid transparent", marginBottom: -2 }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {tab === "text" && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#546E7A", flex: 1 }}>העתק את הכל ואחר כך הדבק בגוגל דוקס, וורד, או וואטסאפ ללקוח</span>
                <button onClick={copyAll}
                  style={{ background: copied ? "#4CAF50" : BL, color: WH, border: "none", borderRadius: 8,
                    padding: "8px 18px", cursor: "pointer", fontWeight: 800, fontSize: 13,
                    transition: "background 0.3s", whiteSpace: "nowrap" }}>
                  {copied ? "✅ הועתק!" : "📋 העתק הכל"}
                </button>
              </div>
              <pre style={{ background: "#F8FAFB", border: `1px solid ${BR}`, borderRadius: 10,
                padding: 16, fontSize: 12.5, lineHeight: 1.8, whiteSpace: "pre-wrap", direction: "rtl",
                fontFamily: "Arial,sans-serif", maxHeight: 420, overflow: "auto", color: DK }}>
                {textContent}
              </pre>
            </div>
          )}
          {tab === "preview" && (
            <div>
              <div style={{ background: "#E3F2FD", borderRadius: 10, padding: "10px 14px",
                marginBottom: 16, fontSize: 12, color: "#1565C0", fontWeight: 600 }}>
                💡 תצוגה מקדימה של הגאנט כפי שהלקוח יראה אותו.
              </div>
              {donePosts.length === 0 && (
                <div style={{ textAlign: "center", color: "#90A4AE", padding: 40 }}>אין פוסטים מוכנים עדיין</div>
              )}
              {donePosts.map(p => (
                <div key={p.id} style={{ background: WH, borderRadius: 12, border: `1px solid ${BR}`,
                  marginBottom: 14, overflow: "hidden" }}>
                  <div style={{ padding: "10px 16px", background: "#F0F7FF", borderBottom: `1px solid ${BR}`,
                    display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontWeight: 900, color: BL, fontSize: 14 }}>#{p.num}</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{p.date ? `${fmt(p.date)} | ${dn(p.date)}` : "לפי מבצע"}</span>
                    <Badge type={p.type} />
                  </div>
                  <div style={{ padding: "14px 16px", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap", color: DK }}>
                    {p.copy}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ borderTop: `1px solid ${BR}`, padding: "12px 20px", background: "#FAFBFC",
          flexShrink: 0, fontSize: 12, color: "#78909C", display: "flex",
          justifyContent: "space-between", alignItems: "center" }}>
          <span>{donePosts.length} פוסטים מוכנים מתוך {posts.length}</span>
          <span>לשיתוף ללקוח: העתק טקסט ← שלח בווטסאפ / מייל / הדבק בגוגל דוקס</span>
        </div>
      </div>
    </div>
  );
}

/* ─── POST CARD ───────────────────────────────────────────────────── */
export function PostCard({ post, c, month, ne, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(post.copy || "");
  const [notes, setNotes] = useState("");
  const [promoIn, setPromoIn] = useState(post.promoText || "");
  const [loading, setLoading] = useState(false);
  const [valResult, setValResult] = useState(post.val || "");
  const [valLoading, setValLoading] = useState(false);

  useEffect(() => {
    setEditVal(post.copy || "");
  }, [post.copy]);

  const status = post.copy ? "done" : post.tk === "promo" && !post.promoText ? "empty" : "wait";

  async function gen(n) {
    setLoading(true);
    let p = "";
    if (post.tk === "monday")  p = pMonday(post.date, c, ne, n || notes);
    else if (post.tk === "holiday") p = pHoliday(post.date, c, ne, n || notes);
    else if (post.tk === "fun")     p = pFun(post.date, c, ne, n || notes);
    else if (post.tk === "recruit") p = pRecruit(post.date, c, ne, n || notes);
    else if (post.tk === "promo")   p = pPromo(promoIn || post.promoText, month, n || notes);
    const copy = await callAI(p);
    setEditVal(copy);
    setValResult("");
    onUpdate({ ...post, copy, promoText: promoIn, val: "" });
    setLoading(false);
  }

  async function validate() {
    setValLoading(true);
    const r = await callAI(
      `בדוק פוסט זה של Ten בקצרה: --- ${post.copy || editVal} --- בדוק: 1) יש מקף ארוך (—)? 2) שגיאות שפה? 3) טון מתאים? 4) CTA ברור? ציון 1-10 ושיפור אחד. קצר, בעברית.`
    );
    setValResult(r);
    onUpdate({ ...post, val: r });
    setValLoading(false);
  }

  return (
    <div style={{ background: WH, borderRadius: 12, border: `1px solid ${BR}`, marginBottom: 10,
      overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", direction: "rtl" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "11px 16px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer",
          background: status === "done" ? "#F9FFFE" : status === "empty" ? "#FFF8F8" : "#FAFBFC" }}>
        <span style={{ fontWeight: 800, color: BL, fontSize: 13, minWidth: 24 }}>#{post.num}</span>
        <span style={{ fontWeight: 700, color: DK, fontSize: 13 }}>
          {post.date ? `${fmt(post.date)} | ${dn(post.date)}` : "תאריך לפי מבצע"}
        </span>
        <Badge type={post.type} />
        <span style={{ marginRight: "auto", fontSize: 11, fontWeight: 800,
          color: status === "done" ? "#4CAF50" : status === "empty" ? "#E53935" : "#FF9800" }}>
          {status === "done" ? "✅ מוכן" : status === "empty" ? "⭕ ממתין למבצע" : "⏳"}
        </span>
        {loading && <span style={{ fontSize: 11, color: BL, fontWeight: 700 }}>מייצר...</span>}
        <span style={{ color: "#90A4AE", fontSize: 11 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${BR}` }}>
          {post.tk === "promo" && (
            <div style={{ padding: "10px 16px", background: "#FFFDE7", borderBottom: `1px solid ${BR}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#F57F17", marginBottom: 5 }}>📦 פרטי המבצע</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={promoIn} onChange={e => setPromoIn(e.target.value)}
                  placeholder="למשל: קומפרסור 2 בוכנות ב-229 ש'ח, באפליקציה 199 ש'ח, עד 30.4.26"
                  style={{ flex: 1, padding: "7px 10px", borderRadius: 8, border: `1px solid ${BR}`, fontSize: 12, fontFamily: "Arial" }} />
                <button onClick={() => { onUpdate({ ...post, promoText: promoIn }); gen(""); }}
                  disabled={!promoIn || loading}
                  style={{ background: BL, color: WH, border: "none", borderRadius: 8, padding: "7px 16px",
                    cursor: "pointer", fontSize: 12, fontWeight: 700, opacity: !promoIn || loading ? 0.5 : 1 }}>
                  {loading ? "..." : "צור פוסט"}
                </button>
              </div>
            </div>
          )}

          {post.copy ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 296px" }}>
              <div style={{ padding: "14px 18px", borderLeft: `1px solid ${BR}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: BL }}>📝 טקסט לפוסט</span>
                  <button onClick={() => { if (editing) { setEditing(false); onUpdate({ ...post, copy: editVal }); } else setEditing(true); }}
                    style={{ marginRight: "auto", background: "none", border: `1px solid ${BL}`, color: BL,
                      borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                    {editing ? "💾 שמור" : "✏️ ערוך"}
                  </button>
                </div>
                {editing ? (
                  <textarea value={editVal} onChange={e => setEditVal(e.target.value)}
                    style={{ width: "100%", height: 210, padding: "10px 12px", borderRadius: 8,
                      border: `2px solid ${BL}`, fontSize: 13, lineHeight: 1.75, resize: "vertical",
                      boxSizing: "border-box", fontFamily: "Arial", direction: "rtl" }} />
                ) : (
                  <div style={{ fontSize: 13.5, lineHeight: 1.8, color: DK, whiteSpace: "pre-wrap",
                    background: "#FAFBFC", padding: "10px 13px", borderRadius: 8,
                    border: `1px solid ${BR}`, minHeight: 150 }}>
                    {post.copy}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="הערה לייצור מחדש..."
                    style={{ flex: 1, minWidth: 130, padding: "5px 9px", borderRadius: 7,
                      border: `1px solid ${BR}`, fontSize: 11, fontFamily: "Arial" }} />
                  <button onClick={() => gen(notes)} disabled={loading}
                    style={{ background: RD, color: WH, border: "none", borderRadius: 7, padding: "5px 12px",
                      cursor: "pointer", fontSize: 11, fontWeight: 700, opacity: loading ? 0.5 : 1 }}>
                    {loading ? "..." : "↺ מחדש"}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(post.copy)}
                    style={{ background: "none", border: `1px solid ${BL}`, color: BL, borderRadius: 7,
                      padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                    📋
                  </button>
                  <button onClick={validate} disabled={valLoading}
                    style={{ background: "none", border: "1px solid #7B1FA2", color: "#7B1FA2", borderRadius: 7,
                      padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                    {valLoading ? "..." : "🔍 בדוק"}
                  </button>
                </div>
                {valResult && (
                  <div style={{ marginTop: 8, background: "#F3E5F5", border: "1px solid #CE93D8",
                    borderRadius: 8, padding: "9px 12px", fontSize: 11.5, lineHeight: 1.7,
                    color: "#4A148C", whiteSpace: "pre-wrap" }}>
                    {valResult}
                  </div>
                )}
              </div>
              <div style={{ padding: "14px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 10, background: "#F0F4F8" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: RD, alignSelf: "flex-start" }}>🎨 ויז׳ואל</span>
                <TenVisual type={post.type} c={c} />
                <span style={{ fontSize: 10, color: "#90A4AE", textAlign: "center" }}>להמחשה בלבד</span>
              </div>
            </div>
          ) : (
            <div style={{ padding: "20px", textAlign: "center" }}>
              {post.tk !== "promo" && (
                loading
                  ? <div style={{ color: BL, fontWeight: 700, fontSize: 13 }}>⏳ מייצר...</div>
                  : <div style={{ color: "#90A4AE", fontSize: 13 }}>⏳ ממתין לייצור אוטומטי</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
