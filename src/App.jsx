import React, { useState, useEffect } from "react";

// --- הגדרות עיצוב (David Vatine Premium) ---
const DV_PURPLE = "#6D28D9", DV_GRAD1 = "#7C3AED", DV_GRAD2 = "#4F46E5";
const BG_SOFT = "#F5F3FF", WH = "#fff", BR = "#E2E8F0", DK = "#1E293B";
const BL="#1565C0", RD="#D32F2F";
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

// לוגואים מהקישורים הישירים שלך
const TEN_LOGO = "https://taskey.co.il/taskey/uploads/1772898932-401744066150036.png";
const DV_LOGO = "https://taskey.co.il/taskey/uploads/1772898975-153713516261042.png";

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

// --- רכיבי עזר ויזואליים ---
function TenVisual({type}){
  const cfgs = {
    "שני חסכוני": {bg1:"#1565C0",bg2:"#0D47A1",badge:"40 אג׳ חיסכון לליטר",badgeBg:"#D32F2F",icon:"⛽",title:"יום שני חסכוני"},
    "חג / אירוע": {bg1:"#1B5E20",bg2:"#2E7D32",badge:"Ten איתכם תמיד",badgeBg:"#1565C0",icon:"🌸",title:"חגים ואירועים"},
    "מצחיק / אפליקציה": {bg1:"#0D47A1",bg2:"#1565C0",badge:"ספרו לנו בתגובות!",badgeBg:"#D32F2F",icon:"📱",title:"את מי תבחרו?"},
    "דרושים": {bg1:"#B71C1C",bg2:"#C62828",badge:"יש לנו מאצ׳?",badgeBg:"#1565C0",icon:"👥",title:"אנחנו מגייסים!"},
    "פוסט מבצע": {bg1:"#E65100",bg2:"#BF360C",badge:"רק בתחנות Ten",badgeBg:"#1B5E20",icon:"🛒",title:"מבצע מיוחד"},
  };
  const cfg = cfgs[type] || cfgs["שני חסכוני"];
  return (
    <div style={{width:260, height:260, background:`radial-gradient(circle at 50% 35%, ${cfg.bg1}, ${cfg.bg2})`, borderRadius:14, position:"relative", overflow:"hidden", boxShadow:"0 8px 25px rgba(0,0,0,0.15)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:WH}}>
      <div style={{position:"absolute", top:14, left:14, right:14, height:140, background:"rgba(255,255,255,0.95)", borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <span style={{fontSize:40}}>{cfg.icon}</span>
        <span style={{color:cfg.bg2, fontWeight:900, fontSize:16, marginTop:8}}>{cfg.title}</span>
      </div>
      <div style={{marginTop:100, background:cfg.badgeBg, padding:"6px 18px", borderRadius:20, fontWeight:800, fontSize:12}}>{cfg.badge}</div>
      <div style={{position:"absolute", bottom:10, fontSize:9, opacity:0.6}}>לנשמה ולדרך</div>
    </div>
  );
}

function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL],"חג / אירוע":["#E8F5E9","#1B5E20"],"מצחיק / אפליקציה":["#FFF3E0","#E65100"],"דרושים":["#FCE4EC","#C62828"],"פוסט מבצע":["#FFF8E1","#E65100"]};
  const [bg,color]=m[type]||["#F5F5F5","#333"];
  return <span style={{padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:800, background:bg, color}}>{type}</span>;
}

// --- כרטיס פוסט בודד ---
function PostCard({post, onUpdate}){
  const [loading, setLoading] = useState(false);

  async function generate(){
    setLoading(true);
    const p = `כתוב פוסט מקצועי לרשת Ten עבור ${post.type}. ${post.tk === 'monday' ? 'ציין חיסכון של 40 אגורות.' : ''}`;
    const copy = await callAI(p);
    onUpdate({...post, copy});
    setLoading(false);
  }

  return (
    <div style={{background:WH, borderRadius:24, marginBottom:25, boxShadow:"0 10px 30px rgba(0,0,0,0.05)", border:`1px solid ${BR}`, overflow:"hidden", display:"flex", flexWrap:"wrap"}}>
      <div style={{flex:1, padding:30, minWidth:320}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <span style={{background:"#F1F5F9", color:DV_PURPLE, width:35, height:35, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900}}>#{post.id}</span>
            <span style={{fontWeight:800, fontSize:18, color:DK}}>{post.date || "פוסט מבצע"}</span>
          </div>
          <Badge type={post.type} />
        </div>
        <div style={{background:"#F8FAFC", padding:20, borderRadius:16, border:`1px solid ${BR}`, minHeight:120, color:"#334155", lineHeight:1.8, whiteSpace:"pre-wrap", fontSize:15}}>
          {loading ? "🪄 מייצר תוכן..." : post.copy || "ממתין לייצור תוכן..."}
        </div>
        {!post.copy && (
          <button onClick={generate} style={{marginTop:20, background:DV_PURPLE, color:WH, border:"none", padding:"12px 25px", borderRadius:12, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 12px rgba(109,40,217,0.2)"}}>🪄 ייצר טקסט</button>
        )}
      </div>
      <div style={{padding:30, background:"#F9FAFB", display:"flex", alignItems:"center", justifyContent:"center", borderRight:`1px solid ${BR}`}}>
         <TenVisual type={post.type} />
      </div>
    </div>
  );
}

// --- רכיב האפליקציה המרכזי ---
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
        <div style={{ background: WH, padding: 45, borderRadius: 35, boxShadow: "0 25px 60px -12px rgba(0,0,0,0.12)", textAlign: "center", width: "95%", maxWidth: 460 }}>
          <img src={DV_LOGO} alt="David Vatine" style={{ height: 50, margin: "0 auto 30px", display: "block" }} />
          <h2 style={{ color: DV_PURPLE, fontWeight: 800, fontSize: 30, marginBottom: 10 }}>בחר לקוח</h2>
          <p style={{ color: "#64748B", marginBottom: 35 }}>בחר לקוח כדי להתחיל בניהול התוכן</p>

          <div 
            onClick={() => { setSelectedClient("Ten"); setView("setup"); }}
            style={{ border: `2px solid ${DV_PURPLE}`, borderRadius: 22, padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: "white", transition: "transform 0.2s" }}
          >
            <span style={{ color: DV_PURPLE, fontSize: 20 }}>←</span>
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <span style={{ fontWeight: 700, fontSize: 22, color: DK }}>דלק Ten</span>
              <img src={TEN_LOGO} alt="Ten" style={{ width: 45, height: 45, borderRadius: "50%", border: "1px solid #eee" }} />
            </div>
          </div>

          <button style={{ marginTop: 25, width: "100%", background: "none", border: `2px dashed ${BR}`, padding: 20, borderRadius: 22, color: "#94A3B8", fontWeight: 700, cursor: "not-allowed" }}>
            + הוסף לקוח חדש
          </button>
        </div>
      </div>
    );
  }

  if (view === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "system-ui" }}>
        <div style={{ background: WH, padding: 45, borderRadius: 35, boxShadow: "0 25px 60px -12px rgba(0,0,0,0.12)", textAlign: "center", width: "95%", maxWidth: 460 }}>
          <div style={{ background: DV_PURPLE, width: 65, height: 65, borderRadius: 20, margin: "0 auto 25px", display: "flex", alignItems: "center", justifyContent: "center", color: WH, fontWeight: 900, fontSize: 24, boxShadow: "0 10px 20px rgba(109,40,217,0.2)" }}>DV</div>
          <h2 style={{ color: DK, fontWeight: 800, fontSize: 32, marginBottom: 12 }}>מערכת גאנט תוכן</h2>
          <p style={{ color: "#64748B", marginBottom: 35 }}>ניהול תוכן חכם לרשת {selectedClient}</p>

          <select 
            value={month} 
            onChange={(e) => setMonth(+e.target.value)}
            style={{ width: "100%", padding: 20, borderRadius: 18, border: `2px solid ${BR}`, marginBottom: 25, fontSize: 18, fontWeight: 700, textAlign: "center", outline: "none", cursor: "pointer" }}
          >
            {MHE.map((m, i) => i > 0 && <option key={i} value={i}>{m}</option>)}
          </select>

          <button 
            onClick={buildGantt}
            style={{ width: "100%", padding: 22, background: `linear-gradient(135deg, ${DV_GRAD1}, ${DV_GRAD2})`, color: WH, border: "none", borderRadius: 20, fontSize: 19, fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 25px rgba(109,40,217,0.3)" }}
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
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <img src={DV_LOGO} alt="DV" style={{ height: 35 }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: DK }}>גאנט {selectedClient} | {MHE[month]} 2025</h1>
        </div>
        <button onClick={() => setView("setup")} style={{ background: "#F1F5F9", border: "none", padding: "12px 22px", borderRadius: 14, fontWeight: 700, cursor: "pointer", color: "#475569" }}>חזרה להגדרות</button>
      </header>
      <main style={{ maxWidth: 1000, margin: "45px auto", padding: "0 25px" }}>
        {posts.map(p => (
          <PostCard key={p.id} post={p} onUpdate={(upd) => setPosts(prev => prev.map(item => item.id === upd.id ? upd : item))} />
        ))}
      </main>
    </div>
  );
}
