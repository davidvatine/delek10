import React, { useState, useEffect } from "react";
import { PU, BG, WH, BR, DK, BL, HDR, MHE, getMCTX, YEARS, TEN_LOGO, DV_LOGO } from "./constants.js";
import { SLogo, Badge, dayName, callAI, buildPrompt, saveGantt, loadGantt, listGantts, deleteGantt } from "./utils.jsx";
import PostCard from "./PostCard.jsx";

// âââââââââââââââââââââââââââââââââââââââââââââ
// ×¤×× ×§×¦×××ª ×¢××¨
// âââââââââââââââââââââââââââââââââââââââââââââ

function getInitView() {
  const p = window.location.pathname;
  if (p === "/saved") return "saved";
  if (p === "/gantt") {
    try {
      const s = JSON.parse(sessionStorage.getItem("ganttState") || "{}");
      if (s.posts?.length > 0) return "gantt";
    } catch {}
    return "setup";
  }
  return "select";
}

function buildTemplate(m, y) {
  const rows = [
    { id: 1, type: "×©× × ××¡××× ×", d: 2 },
    { id: 2, type: "×× / ×××¨××¢", d: 4 },
    { id: 3, type: "××¦×××§ / ××¤×××§×¦××", d: 9 },
    { id: 4, type: "××¨××©××", d: 16 },
    { id: 5, type: "×©× × ××¡××× ×", d: 30 },
    { id: 6, type: "×¤××¡× ×××¦×¢" },
    { id: 7, type: "×¤××¡× ×××¦×¢" },
    { id: 8, type: "×¤××¡× ×××¦×¢" },
    { id: 9, type: "×¤××¡× ×××¦×¢" },
  ];
  return rows.map(({ id, type, d }) => ({
    id, type,
    date: d ? `${d}.${m}.${String(y).slice(2)}` : null,
    day: d ? dayName(d, m, y) : null,
    copy: "", promoText: "", image: null, approved: false, clientNote: "",
  }));
}

// âââââââââââââââââââââââââââââââââââââââââââââ
// ×¢××× ×©××ª××£ ×××§××
// âââââââââââââââââââââââââââââââââââââââââââââ
function SharedView({ ganttData }) {
  const { posts, month, year, extraCtx } = ganttData;
  const ganttKey = new URLSearchParams(window.location.search).get("gantt");
  const storageKey = ganttKey ? `client-feedback-${ganttKey}` : null;

  // טעינת פידבק שמור מ-localStorage (שמירה מקומית בדפדפן הלקוח)
  function loadSavedFeedback(basePosts) {
    if (!storageKey) return basePosts;
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return basePosts;
      const savedPosts = JSON.parse(saved);
      return basePosts.map(p => {
        const s = savedPosts.find(x => x.id === p.id);
        if (!s) return p;
        return { ...p, approved: s.approved, clientNote: s.clientNote };
      });
    } catch { return basePosts; }
  }

  const [localPosts, setLocalPosts] = useState(() => loadSavedFeedback(posts));
  const [sent, setSent] = useState(false);

  // שמירה ב-localStorage בכל שינוי
  function updatePost(updatedPost) {
    const newPosts = localPosts.map(x => x.id === updatedPost.id ? updatedPost : x);
    setLocalPosts(newPosts);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(
          newPosts.map(p => ({ id: p.id, approved: p.approved, clientNote: p.clientNote }))
        ));
      } catch {}
    }
  }
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", direction: "rtl", fontFamily: "system-ui" }}>
      <header style={{ background: "linear-gradient(135deg,#C026D3 0%,#7C3AED 50%,#2563EB 100%)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: WH, fontWeight: 800, fontSize: 15 }}>×××©××¨ ××× × | {MHE[month]} {year} - ×××§ Ten</div>
          </div>
          <SLogo src={TEN_LOGO} alt="Ten" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>×¢××¨× ×¢× ××¤××¡×××, ××©×¨× ×× ×××¡××¤× ××¢×¨××ª, ××××¦× ×©×× ××¡××£</div>
      </header>
      <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        <GanttTable posts={localPosts} month={month} year={year} extraCtx={extraCtx} />
        {localPosts.map(p => (
          <PostCard key={p.id} post={p} ctx={{ ...getMCTX(year)[month], extra: extraCtx }}
            onUpdate={updatePost} isSharedView />
        ))}
        {!sent
          ? <button
              onClick={async () => {
                const r = await fetch("/api/send-feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ganttKey: ganttKey, posts: localPosts }),
                });
                const data = await r.json();
                alert("×¡××××¡: " + r.status + "\n" + JSON.stringify(data));
                setSent(true);
              }}
              style={{ width: "100%", padding: "16px", background: "#1E3A5F", color: WH, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 900, cursor: "pointer", marginTop: 16, fontFamily: "system-ui" }}>
              ð¨ ×©×× ×¤××××§ ××¦×××ª
            </button>
          : <div style={{ background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 14, padding: 20, textAlign: "center", marginTop: 16, color: "#166534", fontWeight: 700, fontSize: 16 }}>â ××¤××××§ × ×©××! ×ª×××</div>
        }
        <div style={{ background: WH, borderRadius: 14, padding: 16, marginTop: 12, fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
          <strong>××× ×× ×¢×××:</strong> ×¢×××¨ ×× ×¤××¡× â ×××¥ â ××××©×¨ ×× âï¸ ××© ××¢×¨×. ××¡××£ ×××¥ ×©××.
        </div>
      </main>
    </div>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââ
// ××××ª ×¡××××
// âââââââââââââââââââââââââââââââââââââââââââââ
function GanttTable({ posts, month, year, extraCtx, openRow, setOpenRow }) {
  return (
    <div style={{ background: WH, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: "#1E3A5F", color: WH, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 14 }}>ð ×¡×××× ××× × | {MHE[month]} {year}</span>
        {setOpenRow && <span style={{ fontSize: 11, opacity: .8 }}>×××¥ ×¢× ×× ×©××¨× ××¤×ª×××ª ××¤××¡× ××××</span>}
      </div>
      {extraCtx && <div style={{ background: "#FFFBEB", padding: "7px 16px", fontSize: 12, color: "#92400E", borderBottom: `1px solid ${BR}` }}>ð° {extraCtx}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {["#", "×ª××¨××", "×××", "×¡×× ×¤××¡×", "×¡××××¡"].map(h => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: "#64748B", fontWeight: 700, borderBottom: `1px solid ${BR}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}
              onClick={setOpenRow ? () => setOpenRow(r => r === p.id ? null : p.id) : undefined}
              style={{ borderBottom: `1px solid ${BR}`, cursor: setOpenRow ? "pointer" : "default", background: openRow === p.id ? "#EFF6FF" : "transparent" }}>
              <td style={{ padding: "8px 12px", fontWeight: 800, color: PU }}>{p.id}</td>
              <td style={{ padding: "8px 12px", color: DK, fontWeight: 600 }}>{p.date || "××¤× ×××¦×¢"}</td>
              <td style={{ padding: "8px 12px", color: "#64748B" }}>{p.day || ""}</td>
              <td style={{ padding: "8px 12px" }}><Badge t={p.type} /></td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 15 }}>
                {p.copy ? "â" : p.type === "×¤××¡× ×××¦×¢" ? "â­" : "â³"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââ
// ××£ ××× ××× ×©×××¨×× â /saved
// âââââââââââââââââââââââââââââââââââââââââââââ
function SavedPage({ onBack, onLoad }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true); const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    listGantts().then(d => {
      const sorted = [...d].sort((a, b) => {
        const ay = (a.data?.year || 0) * 100 + (a.data?.month || 0);
        const by = (b.data?.year || 0) * 100 + (b.data?.month || 0);
        return by - ay;
      });
      setList(sorted);
      setLoading(false);
    });
  }, []);

  function handleDelete(id) {
    if (!window.confirm("×××××§ ××ª ×××× × ×××?")) return;
    deleteGantt(id).then(() => setList(l => l.filter(x => x.id !== id)));
  }

  const grouped = list.reduce((acc, g) => {
    const yr = g.data?.year || "?";
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(g);
    return acc;
  }, {});

  const doneCount = g => g.data?.posts?.filter(p => p.copy).length || 0;

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", direction: "rtl", fontFamily: "system-ui" }}>
      <header style={{ background: "linear-gradient(135deg,#C026D3 0%,#7C3AED 50%,#2563EB 100%)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={() => { window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); }} style={{ cursor: "pointer" }}>
  <SLogo src="/david-white-logo.png" alt="DV" style={{ width: 52, height: 52, objectFit: "contain" }} />
</div>
          <SLogo src={TEN_LOGO} alt="Ten" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>××× ××× ×©×××¨×× | ×××§ Ten</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>v8.0</div>
          </div>
        </div>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", padding: "7px 13px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "system-ui" }}>â ×××¨×</button>
      </header>

      <main style={{ maxWidth: 700, margin: "28px auto", padding: "0 16px" }}>
        {loading ? (
          <div style={{ background: WH, borderRadius: 16, padding: 40, textAlign: "center", color: "#64748B", fontSize: 15 }}>â³ ×××¢× ××× ×××...</div>
        ) : list.length === 0 ? (
          <div style={{ background: WH, borderRadius: 16, padding: 40, textAlign: "center", color: "#64748B", fontSize: 15 }}>ð­ ××× ××× ××× ×©×××¨×× ×¢××××</div>
        ) : (
          Object.keys(grouped).sort((a, b) => b - a).map(yr => (
            <div key={yr} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#64748B", marginBottom: 10, paddingRight: 4 }}>{yr}</div>
              <div style={{ background: WH, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                {grouped[yr].map((g, i) => {
                  const done = doneCount(g);
                  const total = g.data?.posts?.length || 9;
                  const pct = Math.round((done / total) * 100);
                  return (
                    <div key={g.id} style={{ borderBottom: i < grouped[yr].length - 1 ? `1px solid ${BR}` : "none", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: DK, fontSize: 15 }}>{MHE[g.data?.month]} {g.data?.year}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                          × ×©××¨: {new Date(g.created_at).toLocaleDateString("he-IL")} &nbsp;|&nbsp; {done}/{total} ×¤××¡××× ×××©×××
                        </div>
                        {g.data?.extraCtx && <div style={{ fontSize: 11, color: "#7C3AED", marginTop: 3 }}>ð° {g.data.extraCtx}</div>}
                        <div style={{ marginTop: 6, background: "#E2E8F0", borderRadius: 999, height: 5, width: 140 }}>
                          <div style={{ width: `${pct}%`, background: pct === 100 ? "#16A34A" : BL, borderRadius: 999, height: 5 }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => onLoad(g.data)}
                          style={{ background: BL, color: WH, border: "none", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "system-ui" }}>
                          ð ××¢×
                        </button>
                        <button onClick={() => handleDelete(g.id)}
                          style={{ background: "#FEE2E2", color: "#991B1B", border: "none", padding: "8px 12px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "system-ui" }}>
                          ðï¸
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââ
// App ×¨××©×
// âââââââââââââââââââââââââââââââââââââââââââââ
export default function App() {
  const [view, setView] = useState(getInitView);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [extraCtx, setExtraCtx] = useState("");
  const [posts, setPosts] = useState([]);
  const [genProgress, setGenProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [shareKey, setShareKey] = useState(null);
  const [openRow, setOpenRow] = useState(null);
  const [sharedData, setSharedData] = useState(null);

  // × ×××× â ××¢××× ×× URL ××× state
  function nav(path, v) {
    window.history.pushState({}, "", path);
    setView(v);
  }

  // ××××§× ×× × ×¤×ª× ××¨× ××× ×§ ×©××ª××£ ?gantt=...
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gKey = params.get("gantt");
    if (gKey) {
      setSharedData("loading");
      loadGantt(gKey).then(data => { if (data) setSharedData(data); });
    }
  }, []);

  // ×××× × ×××¤×ª××¨ ×××¨× ×©× ×××¤××¤×
  useEffect(() => {
    const onPop = () => setView(getInitView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ×©×××¨× ×-sessionStorage ××× ×©×¨×¢× ×× ×× ××××§ ×××
  useEffect(() => {
    if (posts.length > 0) {
      try { sessionStorage.setItem("ganttState", JSON.stringify({ month, year, extraCtx, posts, shareKey })); } catch {}
    }
  }, [month, year, extraCtx, posts, shareKey]);

  // ××¢×× × ×-sessionStorage ×××¢×× × ×¨××©×× ×
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("ganttState");
      if (saved) {
        const s = JSON.parse(saved);
        setMonth(s.month); setYear(s.year);
        setExtraCtx(s.extraCtx || ""); setPosts(s.posts || []);
        setShareKey(s.shareKey || null);
      }
    } catch {}
  }, []);

if (sharedData === "loading") return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontSize:20}}>â³ ×××¢×...</div>;
if (sharedData && sharedData !== "loading") return <SharedView ganttData={sharedData} />;

  const ctx = { ...getMCTX(year)[month], extra: extraCtx };

  async function buildGantt() {
    const tmpl = buildTemplate(month, year);
    setPosts(tmpl);
    nav("/gantt", "gantt");
    setGenerating(true); setGenProgress(0);
    const updated = [...tmpl];
    for (let i = 0; i < 5; i++) {
      const p = updated[i];
      updated[i] = { ...p, copy: await callAI(buildPrompt(p.type, ctx, p.date, p.day, "")) };
      setPosts([...updated]); setGenProgress(i + 1);
    }
    setGenerating(false);
    const key = await saveGantt({ month, year, extraCtx, posts: updated });
    setShareKey(key);
  }

  async function shareGantt() {
  const key = await saveGantt({ month, year, extraCtx, posts });
  setShareKey(key);
    
    const url = `${window.location.origin}/share?gantt=${key}`;
    navigator.clipboard.writeText(url).then(() => alert(`×××× ×§ ×××¢×ª×§:\n${url}`));
  }

  function exportText() {
    const lines = posts.filter(p => p.copy).map(p => `--- #${p.id} | ${p.date || "××¤× ×××¦×¢"} | ${p.type} ---\n${p.copy}\n`);
    navigator.clipboard.writeText(`××× × ×ª××× ×××§ Ten | ${MHE[month]} ${year}\n${"=".repeat(50)}\n\n${lines.join("\n")}`).then(() => alert("×××¢×ª×§ ××××!"));
  }

  // ×××ª×¨×ª â ××©××©×ª ×××¤×× setup ×-gantt
  const Header = ({ subtitle, showBtns }) => (
    <header style={{ background: "linear-gradient(135deg,#C026D3 0%,#7C3AED 50%,#2563EB 100%)", padding: "12px 24px", margin: 0, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={() => nav("/", "select")} style={{ cursor: "pointer" }}>
          <SLogo src="/david-white-logo.png" alt="DV" style={{ width: 52, height: 52, objectFit: "contain" }} />
        </div>
        <SLogo src={TEN_LOGO} alt="Ten" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{subtitle || `××× × ×¡××©××× | ×××§ Ten`}</div>
          {showBtns && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>v8.0</div>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {showBtns && <>
          <button onClick={exportText} style={{ background: "rgba(34,197,94,0.85)", color: "#fff", border: "none", padding: "7px 13px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "system-ui" }}>ð¤ ×××¦××</button>
          <button onClick={shareGantt} style={{ background: "rgba(251,146,60,0.85)", color: "#fff", border: "none", padding: "7px 13px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "system-ui" }}>ð ×©×ª×£ ×××§××</button>
        </>}
        <button onClick={() => nav("/saved", "saved")} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", padding: "7px 13px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "system-ui" }}>ð ××× ××× ×©×××¨××</button>
      </div>
    </header>
  );

  // ××£ ××× ××× ×©×××¨××
  if (view === "saved") return (
    <SavedPage
      onBack={() => nav("/gantt", "setup")}
    onLoad={data => {
  setMonth(data.month); setYear(data.year);
  setExtraCtx(data.extraCtx || ""); setPosts(data.posts || []);
  setShareKey(null);
  try { sessionStorage.setItem("ganttState", JSON.stringify({ month: data.month, year: data.year, extraCtx: data.extraCtx || "", posts: data.posts || [], shareKey: null })); } catch {}
  nav("/gantt", "gantt");
}}
    />
  );

  // ××£ ×××¨ ××§××
  if (view === "select") return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "system-ui" }}>
      <div style={{ background: WH, padding: 45, borderRadius: 35, boxShadow: "0 25px 60px -12px rgba(0,0,0,0.12)", textAlign: "center", width: "95%", maxWidth: 460 }}>
        <SLogo src={DV_LOGO} alt="David Vatine" style={{ width: 130, height: 65, objectFit: "contain", borderRadius: 8, margin: "0 auto 28px", display: "block" }} />
        <h2 style={{ color: PU, fontWeight: 800, fontSize: 30, marginBottom: 8 }}>×××¨ ××§××</h2>
        <p style={{ color: "#64748B", marginBottom: 32 }}>×××¨ ××§×× ×××¦××¨×ª ××× ×</p>
        <div onClick={() => nav("/gantt", "setup")}
          style={{ border: `2px solid ${PU}`, borderRadius: 22, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: WH, marginBottom: 14 }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 25px rgba(109,40,217,0.2)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
          <span style={{ color: PU, fontSize: 20 }}>â</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 22, color: DK }}>×××§ Ten</span>
            <SLogo src={TEN_LOGO} alt="Ten" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
          </div>
        </div>
        <button onClick={() => alert("××§×¨××...")} style={{ width: "100%", padding: "17px", border: "2px dashed #CBD5E1", borderRadius: 22, background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 15, fontWeight: 600, fontFamily: "system-ui" }}>
          â ×××¡×£ ××§×× ×××©
        </button>
      </div>
    </div>
  );

  // ××£ ××××¨××ª ××× ×
  if (view === "setup") return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", direction: "rtl", fontFamily: "system-ui" }}>
      <Header />
      <div style={{ maxWidth: 560, margin: "32px auto", padding: "0 16px" }}>
        <div style={{ background: WH, borderRadius: 22, padding: 32, boxShadow: "0 6px 24px rgba(0,0,0,0.07)" }}>
          <h2 style={{ color: DK, fontWeight: 800, fontSize: 22, marginBottom: 20, textAlign: "center" }}>×××¨ ××××© ×××× ×</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, marginBottom: 5, textAlign: "right" }}>××××©</div>
              <select value={month} onChange={e => setMonth(+e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 10, border: `2px solid ${BR}`, fontSize: 14, fontWeight: 700, fontFamily: "system-ui", background: WH }}>
                {MHE.map((m, i) => i > 0 && <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, marginBottom: 5, textAlign: "right" }}>×©× ×</div>
              <select value={year} onChange={e => setYear(+e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 10, border: `2px solid ${BR}`, fontSize: 14, fontWeight: 700, fontFamily: "system-ui", background: WH }}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#166534", lineHeight: 1.7 }}>
            {getMCTX(year)[month].emoji} <strong>××§×©×¨ ×-{MHE[month]} {year}:</strong><br />
            ×¢×× ×: {getMCTX(year)[month].season} | {getMCTX(year)[month].weather}<br />
            <strong>×××× ×××××ª××:</strong> {getMCTX(year)[month].holidays || "×××"}<br />
            {getMCTX(year)[month].special && <><strong>×××× ×××××××:</strong> {getMCTX(year)[month].special}<br /></>}
            {getMCTX(year)[month].news && <><strong>×××¨××¢×× ×¢××××××:</strong> {getMCTX(year)[month].news}<br /></>}
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, marginBottom: 5, textAlign: "right" }}>ð° ××§×©×¨ ×ª×§×©××¨×ª× × ××¡×£</div>
            <textarea value={extraCtx} onChange={e => setExtraCtx(e.target.value)}
              placeholder="×××©×: ×¢××× ×××××¨× ×××§, ×× ×××, ×××××, ××××¨××ª..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `2px solid ${BR}`, fontSize: 13, minHeight: 68, resize: "vertical", fontFamily: "system-ui", boxSizing: "border-box" }} />
          </div>
          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: "12px 16px", marginBottom: 18, fontSize: 13, color: "#92400E", lineHeight: 1.8 }}>
            ð <strong>×× ××§×¨×</strong><br />
            â 5 ×¤××¡××× ××××¦×¨× ××××××××ª â â­ 4 ×¤××¡×× ×××¦×¢ ×¨××§××<br />
            ð¾ ×©×××¨× ××××××××ª â ×¨×¢× ×× ×××£ ×× ××××§ ××××<br />
            ð¤ ×××¦××: ××¢×ª×§ ××§×¡× / ×ª×¦××× ××§×××× ×××§××
          </div>
          <button onClick={buildGantt} style={{ width: "100%", padding: "17px", background: "#1565c0", color: WH, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "system-ui" }}>
            ×× × ××× × ×-{MHE[month]} {year} ð
          </button>
        </div>
      </div>
    </div>
  );

  // ××£ ××× × â ×ª×¦×××ª ××¤××¡×××
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", direction: "rtl", fontFamily: "system-ui" }}>
      <Header subtitle={`××× × ${MHE[month]} ${year} â ×××§ Ten`} showBtns />
      {generating && (
        <div style={{ background: "#EFF6FF", borderBottom: "2px solid #BFDBFE", padding: "9px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: BL, fontWeight: 700 }}>âï¸ ××××¦×¨ {genProgress}/5 ×¤××¡××× ××××××××ª...</span>
          <div style={{ flex: 1, background: "#DBEAFE", borderRadius: 999, height: 7 }}>
            <div style={{ width: `${(genProgress / 5) * 100}%`, background: BL, borderRadius: 999, height: 7, transition: "width .5s" }} />
          </div>
          <span style={{ fontSize: 12, color: BL }}>{genProgress}/5</span>
        </div>
      )}
      <main style={{ maxWidth: 940, margin: "22px auto", padding: "0 14px" }}>
        <GanttTable posts={posts} month={month} year={year} extraCtx={extraCtx} openRow={openRow} setOpenRow={setOpenRow} />
        {posts.map(p => (
          (openRow === null || openRow === p.id) &&
          <PostCard key={p.id} post={p} ctx={ctx} onUpdate={u => setPosts(prev => prev.map(x => x.id === u.id ? u : x))} />
        ))}
        <div style={{ background: WH, borderRadius: 12, padding: 14, marginTop: 12, fontSize: 12, color: "#475569", lineHeight: 1.8 }}>
          <strong>ð¤ ××× ××©×ª×£ ×××§××:</strong><br />
          ×××¥ "×©×ª×£ ×××§××" â ×××× ×§ ×××¢×ª×§ ××××××××ª â ×©×× ×××§×× ××××××¡××¤/××××
        </div>
        <button onClick={() => nav("/gantt", "setup")} style={{ background: "#F1F5F9", border: "none", padding: "9px 18px", borderRadius: 9, fontWeight: 700, cursor: "pointer", color: "#475569", margin: "12px 0", fontFamily: "system-ui", fontSize: 13 }}>
          âï¸ ×××¨× ×××××¨××ª
        </button>
      </main>
    </div>
  );
}
