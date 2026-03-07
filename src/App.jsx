import React, { useState, useEffect } from "react";

// --- קבועים וצבעים (David Vatine Premium) ---
const DV_PURPLE = "#6D28D9", DV_GRAD1 = "#7C3AED", DV_GRAD2 = "#4F46E5";
const BL="#1565C0", RD="#D32F2F", WH="#fff", BG="#EEF2F7", BR="#CFD8DC", DK="#1A2733";
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DHE = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

/* ─── רכיב הויז'ואל (הכרטיס המעוצב) ─── */
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
    <div style={{width:280, height:280, background:`radial-gradient(circle at 50% 35%, ${cfg.bg1}, ${cfg.bg2})`, borderRadius:14, position:"relative", overflow:"hidden", boxShadow:"0 8px 28px rgba(0,0,0,0.15)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:WH}}>
      <div style={{position:"absolute", top:16, left:16, right:16, height:152, background:"rgba(255,255,255,0.95)", borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <span style={{fontSize:46}}>{cfg.icon}</span>
        <span style={{color:cfg.bg2, fontWeight:900, fontSize:18, marginTop:10}}>{cfg.title}</span>
      </div>
      <div style={{marginTop:110, background:cfg.badgeBg, padding:"6px 20px", borderRadius:20, fontWeight:800, fontSize:13}}>{cfg.badge}</div>
      <div style={{position:"absolute", bottom:10, fontSize:9, opacity:0.6}}>לנשמה ולדרך</div>
    </div>
  );
}

function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL],"חג / אירוע":["#E8F5E9","#1B5E20"],"מצחיק / אפליקציה":["#FFF3E0","#E65100"],"דרושים":["#FCE4EC","#C62828"],"פוסט מבצע":["#FFF8E1","#E65100"]};
  const [bg,color]=m[type]||["#F5F5F5","#333"];
  return <span style={{padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:800, background:bg, color}}>{type}</span>;
}

/* ─── האפליקציה הראשית ─── */
export default function App() {
  const [phase, setPhase] = useState("setup");
  const [posts, setPosts] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth()+1);

  const start = () => {
    const arr = [
      {id:1, type:"שני חסכוני", date:"03.03"},
      {id:2, type:"חג / אירוע", date:"10.03"},
      {id:3, type:"מצחיק / אפליקציה", date:"17.03"},
      {id:4, type:"דרושים", date:"24.03"},
      {id:5, type:"פוסט מבצע", date:null}
    ];
    setPosts(arr);
    setPhase("gantt");
  };

  if (phase === "setup") {
    return (
      <div style={{minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", direction:"rtl", fontFamily:"Arial"}}>
        <div style={{background:WH, padding:40, borderRadius:24, boxShadow:"0 20px 50px rgba(0,0,0,0.1)", textAlign:"center", maxWidth:450, width:"90%"}}>
          <div style={{background:DV_PURPLE, width:60, height:60, borderRadius:15, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", color:WH, fontSize:24, fontWeight:900}}>DV</div>
          <h2 style={{fontWeight:900, fontSize:26, marginBottom:10}}>מערכת גאנט תוכן</h2>
          <p style={{color:"#64748B", marginBottom:30}}>ניהול תוכן חכם לרשת Ten</p>
          <select value={month} onChange={e=>setMonth(+e.target.value)} style={{width:"100%", padding:15, borderRadius:12, border:`2px solid ${BR}`, marginBottom:20, fontSize:16, fontWeight:700}}>
            {MHE.map((m,i)=> i>0 && <option key={i} value={i}>{m}</option>)}
          </select>
          <button onClick={start} style={{width:"100%", padding:18, background:`linear-gradient(135deg, ${DV_GRAD1}, ${DV_GRAD2})`, color:WH, border:"none", borderRadius:12, fontSize:18, fontWeight:900, cursor:"pointer"}}>🚀 צור גאנט {MHE[month]}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh", background:BG, direction:"rtl", fontFamily:"Arial"}}>
      <header style={{background:WH, padding:"15px 30px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${BR}`, position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
           <div style={{background:DV_PURPLE, color:WH, padding:"5px 12px", borderRadius:8, fontWeight:900}}>DV</div>
           <span style={{fontWeight:900, fontSize:20}}>גאנט {MHE[month]} 2025</span>
        </div>
        <button onClick={()=>setPhase("setup")} style={{background:"#F1F5F9", border:"none", padding:"10px 20px", borderRadius:10, fontWeight:700, cursor:"pointer"}}>חזרה</button>
      </header>

      <main style={{maxWidth:1000, margin:"40px auto", padding:"0 20px"}}>
        {posts.map(p => (
           <div key={p.id} style={{background:WH, borderRadius:20, marginBottom:25, boxShadow:"0 10px 25px rgba(0,0,0,0.05)", border:`1px solid ${BR}`, overflow:"hidden", display:"flex", flexWrap:"wrap"}}>
              <div style={{flex:1, padding:25, minWidth:300}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
                   <div style={{display:"flex", alignItems:"center", gap:12}}>
                      <span style={{background:"#F1F5F9", color:DV_PURPLE, width:35, height:35, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900}}>#{p.id}</span>
                      <span style={{fontWeight:800, fontSize:18}}>{p.date || "פוסט מבצע"}</span>
                   </div>
                   <Badge type={p.type} />
                </div>
                <div style={{background:"#F8FAFC", padding:20, borderRadius:12, border:`1px solid ${BR}`, minHeight:120, color:"#334155", lineHeight:1.8}}>
                   ממתין לייצור תוכן...
                </div>
                <button style={{marginTop:20, background:DV_PURPLE, color:WH, border:"none", padding:"10px 20px", borderRadius:10, fontWeight:700, cursor:"pointer"}}>🪄 ייצר טקסט</button>
              </div>
              <div style={{padding:25, background:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", borderRight:`1px solid ${BR}`}}>
                 <TenVisual type={p.type} />
              </div>
           </div>
        ))}
      </main>
    </div>
  );
}
