import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// --- הגדרות עיצוב (David Vatine Premium) ---
const DV_PURPLE = "#6D28D9", DV_GRAD1 = "#7C3AED", DV_GRAD2 = "#4F46E5";
const BG_SOFT = "#F5F3FF", WH = "#fff", BR = "#E2E8F0", DK = "#1E293B";
const BL="#1565C0", RD="#D32F2F";
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DHE = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

// לוגואים מעודכנים מהקישורים ששלחת
const TEN_LOGO = "https://taskey.co.il/taskey/uploads/1772898932-401744066150036.png";
const DV_LOGO = "https://taskey.co.il/taskey/uploads/1772898975-153713516261042.png";

// --- פונקציות עזר ---
function fmt(d){ return d ? `${d.getDate()}.${d.getMonth()+1}` : "—"; }

// --- לוגיקת AI ---
async function callAI(prompt) {
  try {
    const r = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!r.ok) throw new Error("API Error");
    const d = await r.json();
    return (d.text || "").trim();
  } catch (e) {
    console.error(e);
    return "שגיאה בייצור הטקסט. נסה שוב.";
  }
}

// --- רכיבי UI ---
function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL],"חג / אירוע":["#E8F5E9","#1B5E20"],"מצחיק / אפליקציה":["#FFF3E0","#E65100"],"דרושים":["#FCE4EC","#C62828"],"פוסט מבצע":["#FFF8E1","#E65100"]};
  const [bg,color]=m[type]||["#F5F5F5","#333"];
  return <span style={{padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:800, background:bg, color}}>{type}</span>;
}

function PostCard({post, onUpdate}){
  const [loading, setLoading] = useState(false);

  async function generate(){
    setLoading(true);
    const p = `אתה קופירייטר של Ten. כתוב פוסט לרשת Ten עבור ${post.type}. ${post.tk === 'monday' ? 'דגש על 40 אגורות חיסכון.' : ''}`;
    const copy = await callAI(p);
    onUpdate({...post, copy});
    setLoading(false);
  }

  return (
    <div style={{background:WH, borderRadius:20, marginBottom:25, boxShadow:"0 10px 25px rgba(0,0,0,0.05)", border:`1px solid ${BR}`, overflow:"hidden", display:"flex", flexWrap:"wrap"}}>
      <div style={{flex:1, padding:25, minWidth:300}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <span style={{background:"#F1F5F9", color:DV_PURPLE, width:35, height:35, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900}}>#{post.id}</span>
            <span style={{fontWeight:800, fontSize:18}}>{post.date || "פוסט מבצע"}</span>
          </div>
          <Badge type={post.type} />
        </div>
        <div style={{background:"#F8FAFC", padding:20, borderRadius:12, border:`1px solid ${BR}`, minHeight:120, color:"#334155", lineHeight:1.8, whiteSpace:"pre-wrap"}}>
          {loading ? "⏳ מייצר תוכן..." : post.copy || "ממתין לייצור תוכן..."}
        </div>
        {!post.copy && (
          <button onClick={generate} style={{marginTop:20, background:DV_PURPLE, color:WH, border:"none", padding:"10px 20px", borderRadius:10, fontWeight:700, cursor:"pointer"}}>🪄 ייצר טקסט</button>
        )}
      </div>
    </div>
  );
}

// --- האפליקציה הראשית ---
export default function App() {
  const [view, setView] = useState("select-client");
  const [selectedClient, setSelectedClient] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [posts, setPosts] = useState([]);

  const buildGantt = () => {
    const arr = [
      {id:1, type:"שני חסכוני", tk:"monday", date:"03.03"},
      {id:2, type:"חג / אירוע", tk:"holiday", date:"10.03"},
      {id:3, type:"מצחיק / אפליקציה", tk:"fun", date:"17.03"},
      {id:4, type:"דרושים", tk:"recruit", date:"24.03"},
      {id:5, type:"פוסט מבצע", tk:"promo", date:null}
    ];
    setPosts(arr);
    setView("gantt");
  };

  if (view === "select-client") {
    return (
      <div style={{ minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "system-ui" }}>
        <div style={{ background: WH, padding: 40, borderRadius: 32, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: 450 }}>
          <img src={DV_LOGO} alt="DV Logo" style={{ width: 120, margin: "0 auto 20px", display: "block" }} />
          <h2 style={{ color: DV_PURPLE, fontWeight: 800, fontSize: 28, marginBottom: 8 }}>בחר לקוח</h2>
          <p style={{ color: "#64748B", marginBottom: 32 }}>בחר לקוח ליצירת גאנט</p>

          <div 
            onClick={() => { setSelectedClient("Ten"); setView("setup"); }}
            style={{ border: `2px solid ${DV_PURPLE}`, borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.2s" }}
          >
            <span style={{ color: DV_PURPLE, fontSize: 20 }}>←</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 20, color: DK }}>דלק Ten</span>
              <img src={TEN_LOGO} alt="Ten" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            </div>
          </div>

          <button style={{ marginTop: 20, width: "100%", background: "none", border: `2px dashed ${BR}`, padding: 18, borderRadius: 20, color: "#94A3B8", fontWeight: 700, cursor: "not-allowed" }}>
            + הוסף לקוח חדש
          </button>
        </div>
      </div>
    );
  }

  if (view === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "system-ui" }}>
        <div style={{ background: WH, padding: 40, borderRadius: 32, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: 450 }}>
          <div style={{ background: DV_PURPLE, width: 60, height: 60, borderRadius: 18, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", color: WH, fontWeight: 900, fontSize: 22 }}>DV</div>
          <h2 style={{ color: DK, fontWeight: 800, fontSize: 32, marginBottom: 12 }}>מערכת גאנט תוכן</h2>
          <p style={{ color: "#64748B", marginBottom: 32 }}>ניהול תוכן חכם לרשת {selectedClient}</p>

          <select 
            value={month} 
            onChange={(e) => setMonth(+e.target.value)}
            style={{ width: "100%", padding: 18, borderRadius: 16, border: `2px solid ${BR}`, marginBottom: 24, fontSize: 18, fontWeight: 700, textAlign: "center", outline: "none" }}
          >
            {MHE.map((m, i) => i > 0 && <option key={i} value={i}>{m}</option>)}
          </select>

          <button 
            onClick={buildGantt}
            style={{ width: "100%", padding: 20, background: `linear-gradient(135deg, ${DV_GRAD1}, ${DV_GRAD2})`, color: WH, border: "none", borderRadius: 18, fontSize: 18, fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 25px rgba(109,40,217,0.3)" }}
          >
            צור גאנט {MHE[month]} 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", direction: "rtl", fontFamily: "system-ui" }}>
      <header style={{ background: WH, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems:"center", borderBottom:`1px solid ${BR}`, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={DV_LOGO} alt="DV" style={{ height: 30 }} />
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>גאנט {selectedClient} | {MHE[month]} 2025</h1>
        </div>
        <button onClick={() => setView("setup")} style={{ background: "#F1F5F9", border: "none", padding: "10px 20px", borderRadius: 12, fontWeight: 700, cursor: "pointer", color: "#475569" }}>חזרה</button>
      </header>
      <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        {posts.map(p => (
          <PostCard key={p.id} post={p} onUpdate={(upd) => setPosts(prev => prev.map(item => item.id === upd.id ? upd : item))} />
        ))}
      </main>
    </div>
  );
}

// --- הרצה ל-DOM ---
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
