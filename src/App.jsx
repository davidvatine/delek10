import { useState, useEffect } from "react";
import { BL, BLl, RD, WH, BG, BR, DK, MHE, STORAGE_KEY, getCtx } from "./constants";
import { buildSchedule, serializePosts, deserializePosts } from "./utils";
import { pMonday, pHoliday, pFun, pRecruit, callAI } from "./prompts";
import { Badge, ExportModal, PostCard } from "./components";

const AUTO = ["monday", "holiday", "fun", "recruit"];

export default function TenGanttAI() {
  const now = new Date();
  const [year, setYear]               = useState(now.getFullYear());
  const [month, setMonth]             = useState(now.getMonth() + 1);
  const [phase, setPhase]             = useState("setup");
  const [posts, setPosts]             = useState([]);
  const [progress, setProgress]       = useState({ done: 0, total: 0 });
  const [ne, setNe]                   = useState("");
  const [showExport, setShowExport]   = useState(false);
  const [saveStatus, setSaveStatus]   = useState("");
  const [storageLoading, setStorageLoading] = useState(true);

  const c         = getCtx(month);
  const doneCount = posts.filter(p => p.copy).length;
  const autoTotal = posts.filter(p => AUTO.includes(p.tk)).length;
  const isDone    = progress.done >= autoTotal && autoTotal > 0;
  const pct       = autoTotal > 0 ? Math.round((progress.done / autoTotal) * 100) : 0;

  /* ── LOAD saved state on mount ── */
  useEffect(() => {
    async function load() {
      try {
        const saved = await window.storage.get(STORAGE_KEY);
        if (saved && saved.value) {
          const data = JSON.parse(saved.value);
          setYear(data.year || now.getFullYear());
          setMonth(data.month || now.getMonth() + 1);
          setNe(data.ne || "");
          if (data.posts && data.posts.length > 0) {
            setPosts(deserializePosts(data.posts));
            setPhase("gantt");
            setSaveStatus("loaded");
            setTimeout(() => setSaveStatus(""), 3000);
          }
        }
      } catch (e) { /* no saved data */ }
      setStorageLoading(false);
    }
    load();
  }, []);

  /* ── SAVE whenever posts change ── */
  useEffect(() => {
    if (posts.length === 0 || storageLoading) return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({
          year, month, ne,
          posts: serializePosts(posts),
          savedAt: new Date().toISOString()
        }));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 2500);
      } catch (e) { setSaveStatus(""); }
    }, 800);
    return () => clearTimeout(timer);
  }, [posts, year, month, ne]);

  function upd(updated) {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  }

  async function runAuto(arr) {
    const auto = arr.filter(p => AUTO.includes(p.tk));
    setProgress({ done: 0, total: auto.length });
    for (const post of auto) {
      let prompt = "";
      const localCtx = getCtx(month);
      if (post.tk === "monday")       prompt = pMonday(post.date, localCtx, ne, "");
      else if (post.tk === "holiday") prompt = pHoliday(post.date, localCtx, ne, "");
      else if (post.tk === "fun")     prompt = pFun(post.date, localCtx, ne, "");
      else if (post.tk === "recruit") prompt = pRecruit(post.date, localCtx, ne, "");
      const copy = await callAI(prompt);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, copy } : p));
      setProgress(prev => ({ ...prev, done: prev.done + 1 }));
    }
  }

  function handleBuild() {
    const arr = buildSchedule(year, month);
    setPosts(arr);
    setProgress({ done: 0, total: 0 });
    setPhase("gantt");
    runAuto(arr);
  }

  async function clearSaved() {
    try { await window.storage.delete(STORAGE_KEY); } catch (e) {}
    setPosts([]);
    setPhase("setup");
    setProgress({ done: 0, total: 0 });
  }

  /* ── LOADING ── */
  if (storageLoading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "Arial,sans-serif", direction: "rtl" }}>
      <div style={{ textAlign: "center", color: BL }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>טוען נתונים שמורים...</div>
      </div>
    </div>
  );

  /* ── SETUP ── */
  if (phase === "setup") return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Arial,sans-serif", direction: "rtl" }}>
      <div style={{ background: `linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`, padding: "20px 28px",
        display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: WH, display: "flex",
          alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(0,0,0,0.2)" }}>
          <span style={{ color: BL, fontWeight: 900, fontSize: 20 }}>1</span>
          <span style={{ color: RD, fontWeight: 900, fontSize: 20 }}>0</span>
        </div>
        <div>
          <div style={{ color: WH, fontSize: 20, fontWeight: 900 }}>גאנט AI | דלק Ten</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>9 פוסטים חודשיים | שמירה אוטומטית | ייצוא קל</div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
        <div style={{ background: WH, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: BL, fontSize: 20, fontWeight: 900, marginBottom: 24, textAlign: "center" }}>בחר חודש לגאנט</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: DK, display: "block", marginBottom: 6 }}>חודש</label>
              <select value={month} onChange={e => setMonth(+e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `2px solid ${BL}`, fontSize: 15, fontWeight: 700 }}>
                {MHE.slice(1).map((n, i) => <option key={i + 1} value={i + 1}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: DK, display: "block", marginBottom: 6 }}>שנה</label>
              <select value={year} onChange={e => setYear(+e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `2px solid ${BL}`, fontSize: 15, fontWeight: 700 }}>
                {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: "#F0F7FF", borderRadius: 10, padding: "13px 16px", marginBottom: 16,
            border: `1px solid #BBDEFB`, fontSize: 13, lineHeight: 1.9 }}>
            <div style={{ fontWeight: 800, color: BL, marginBottom: 6 }}>{c.emoji} הקשר ל-{MHE[month]} {year}</div>
            <div><strong>עונה:</strong> {c.season} | {c.weather}</div>
            <div><strong>חגים מאומתים:</strong> {c.holidays.map(h => `${h.n} (${h.d}.${month})`).join(", ") || "אין"}</div>
            <div style={{ marginTop: 5, color: "#455A64" }}><strong>תקשורת:</strong> {c.news}</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: DK, display: "block", marginBottom: 5 }}>📰 הקשר תקשורתי נוסף</label>
            <textarea value={ne} onChange={e => setNe(e.target.value)}
              placeholder="למשל: עלייה במחירי דלק, גל חום..."
              style={{ width: "100%", height: 66, padding: "9px 11px", borderRadius: 8,
                border: `1px solid ${BR}`, fontSize: 13, resize: "vertical",
                boxSizing: "border-box", fontFamily: "Arial" }} />
          </div>

          <div style={{ background: "#FFF8F8", borderRadius: 10, padding: "12px 16px", marginBottom: 24,
            border: `1px solid #FFCDD2`, fontSize: 13, lineHeight: 2 }}>
            <div style={{ fontWeight: 800, color: RD, marginBottom: 5 }}>📌 מה יקרה</div>
            ✅ 5 פוסטים ייוצרו אוטומטית ← ⭕ 4 פוסטי מבצע ריקים<br />
            💾 שמירה אוטומטית ← רענון הדף לא ימחק כלום<br />
            📤 ייצוא: העתק טקסט / תצוגה מקדימה ללקוח
          </div>

          <button onClick={handleBuild}
            style={{ width: "100%", background: BL, color: WH, border: "none", borderRadius: 10,
              padding: "15px 0", fontSize: 17, fontWeight: 900, cursor: "pointer",
              boxShadow: `0 4px 16px ${BL}55` }}>
            🚀 בנה גאנט ל-{MHE[month]} {year}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── GANTT ── */
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Arial,sans-serif", direction: "rtl" }}>
      {showExport && <ExportModal posts={posts} month={month} year={year} c={c} onClose={() => setShowExport(false)} />}

      <div style={{ background: `linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`, padding: "13px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: WH,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: BL, fontWeight: 900, fontSize: 17 }}>1</span>
            <span style={{ color: RD, fontWeight: 900, fontSize: 17 }}>0</span>
          </div>
          <div>
            <div style={{ color: WH, fontSize: 17, fontWeight: 900 }}>גאנט {MHE[month]} {year}</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{c.emoji} {c.season} | {doneCount}/{posts.length} מוכנים</span>
              {saveStatus === "saving" && <span style={{ background: "rgba(255,255,255,0.15)", padding: "1px 8px", borderRadius: 10, fontSize: 10 }}>💾 שומר...</span>}
              {saveStatus === "saved"  && <span style={{ background: "rgba(76,175,80,0.4)",     padding: "1px 8px", borderRadius: 10, fontSize: 10 }}>✅ נשמר</span>}
              {saveStatus === "loaded" && <span style={{ background: "rgba(255,193,7,0.4)",     padding: "1px 8px", borderRadius: 10, fontSize: 10 }}>📂 נטען מהשמירה</span>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setShowExport(true)}
            style={{ background: "#4CAF50", color: WH, border: "none", borderRadius: 8,
              padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 800 }}>
            📤 ייצוא ושיתוף
          </button>
          <button onClick={clearSaved}
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              color: WH, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            🗑️ מחק ואפס
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "18px 16px" }}>
        {!isDone && autoTotal > 0 && (
          <div style={{ background: WH, borderRadius: 12, padding: "13px 18px", marginBottom: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontWeight: 700, color: BL, fontSize: 13 }}>⚙️ מייצר {autoTotal} פוסטים אוטומטית...</span>
              <span style={{ fontWeight: 700, color: BL }}>{progress.done}/{autoTotal}</span>
            </div>
            <div style={{ height: 8, background: "#E3F2FD", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${BL},${BLl})`,
                borderRadius: 8, transition: "width 0.4s" }} />
            </div>
          </div>
        )}

        {isDone && (
          <div style={{ background: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: 12,
            padding: "11px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontWeight: 800, color: "#1B5E20", fontSize: 14 }}>5 פוסטים נוצרו ונשמרו! לחץ "ייצוא ושיתוף" לשיתוף הלקוח.</div>
              <div style={{ fontSize: 12, color: "#388E3C" }}>4 פוסטי מבצע ממתינים לפרטים מהלקוח</div>
            </div>
          </div>
        )}

        <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 10,
          padding: "9px 14px", marginBottom: 12, fontSize: 12, color: "#5D4037" }}>
          <strong>📰</strong> {ne || c.news}
        </div>

        {/* Summary table */}
        <div style={{ background: WH, borderRadius: 12, marginBottom: 14, overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BR}` }}>
          <div style={{ background: BL, padding: "9px 16px", color: WH, fontWeight: 800, fontSize: 13 }}>
            📋 סיכום גאנט | {MHE[month]} {year}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, direction: "rtl" }}>
            <thead>
              <tr style={{ background: "#F0F7FF" }}>
                {["#", "תאריך", "יום", "סוג פוסט", "סטטוס"].map(h => (
                  <th key={h} style={{ padding: "7px 13px", textAlign: "right", color: BL, fontWeight: 700, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BR}`, background: i % 2 === 0 ? WH : "#FAFBFC" }}>
                  <td style={{ padding: "7px 13px", fontWeight: 700, color: BL }}>{p.num}</td>
                  <td style={{ padding: "7px 13px", fontWeight: 600 }}>{p.date ? `${p.date.getDate()}.${p.date.getMonth()+1}.${String(p.date.getFullYear()).slice(2)}` : "לפי מבצע"}</td>
                  <td style={{ padding: "7px 13px" }}>{p.date ? ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"][p.date.getDay()] : ""}</td>
                  <td style={{ padding: "7px 13px" }}><Badge type={p.type} /></td>
                  <td style={{ padding: "7px 13px", fontSize: 12 }}>
                    {p.copy ? <span style={{ color: "#4CAF50", fontWeight: 700 }}>✅</span>
                      : p.tk === "promo" ? <span style={{ color: RD, fontWeight: 700 }}>⭕</span>
                      : <span style={{ color: "#FF9800" }}>⏳</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ fontSize: 12, color: "#78909C", marginBottom: 8 }}>לחץ על כל שורה לפתיחת הפוסט המלא</div>

        {posts.map(p => (
          <PostCard key={p.id} post={p} c={c} month={month} ne={ne} onUpdate={upd} />
        ))}

        <div style={{ background: "#E8EAF6", borderRadius: 10, padding: "13px 18px", fontSize: 12,
          color: "#283593", border: "1px solid #9FA8DA", marginTop: 6, lineHeight: 1.8 }}>
          <strong>📤 איך לשתף ללקוח:</strong><br />
          לחץ <strong>"ייצוא ושיתוף"</strong> ← בחר <strong>"תצוגה מקדימה"</strong> לראות איך הלקוח יראה<br />
          או <strong>"טקסט להעתקה"</strong> ← לחץ <strong>"העתק הכל"</strong> ← הדבק בגוגל דוקס / מייל / וואטסאפ
        </div>
      </div>
    </div>
  );
}
