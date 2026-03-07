import { useState, useEffect } from "react";

// --- צבעים וקבועים ---
const BL="#1565C0", BLl="#1E88E5", RD="#D32F2F", WH="#fff";
const BG="#EEF2F7", BR="#CFD8DC", DK="#1A2733";
const APP_VERSION = "v7.7-PREMIUM";
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

// צבעי מותג David Vatine
const DV_PURPLE = "#6D28D9", DV_GRAD1 = "#7C3AED", DV_GRAD2 = "#4F46E5";

/* ─── VISUAL COMPONENT (הכרטיס המעוצב) ─── */
function TenVisual({type, c}){
  const uid = type.replace(/[^a-z]/gi,"").slice(0,6);
  const rays = Array.from({length:16},(_,i)=>i*(360/16));
  const cfgs = {
    "שני חסכוני":    {bg1:"#1565C0",bg2:"#0D47A1",badge:"40 אג׳ חיסכון לליטר",badgeBg:"#D32F2F",icon:"⛽",title:"יום שני חסכוני"},
    "חג / אירוע":    {bg1:"#1B5E20",bg2:"#2E7D32",badge:"Ten איתכם תמיד",badgeBg:"#1565C0",icon:"🌸",title:"חגים ואירועים"},
    "מצחיק / אפליקציה":{bg1:"#0D47A1",bg2:"#1565C0",badge:"ספרו לנו בתגובות!",badgeBg:"#D32F2F",icon:"📱",title:"את מי תבחרו?"},
    "דרושים":        {bg1:"#B71C1C",bg2:"#C62828",badge:"יש לנו מאצ׳?",badgeBg:"#1565C0",icon:"👥",title:"אנחנו מגייסים!"},
    "פוסט מבצע":     {bg1:"#E65100",bg2:"#BF360C",badge:"רק בתחנות Ten",badgeBg:"#1B5E20",icon:"🛒",title:"מבצע מיוחד"},
  };
  const cfg = cfgs[type] || cfgs["שני חסכוני"];
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style={{borderRadius:14,display:"block",boxShadow:"0 8px 28px rgba(0,0,0,0.15)"}}>
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={cfg.bg1} />
          <stop offset="100%" stopColor={cfg.bg2} />
        </radialGradient>
      </defs>
      <rect width="280" height="280" fill={`url(#bg${uid})`} rx="14"/>
      {rays.map((angle,i)=>(
        <line key={i} x1="140" y1="50" x2={140+Math.cos((angle-90)*Math.PI/180)*300} y2={50+Math.sin((angle-90)*Math.PI/180)*300} stroke="white" strokeWidth="1" opacity="0.1"/>
      ))}
      <path d="M0 185 L280 165 L280 280 L0 280 Z" fill="#C62828" opacity="0.9"/>
      <rect x="16" y="16" width="248" height="152" rx="14" fill="white" opacity="0.95"/>
      <text x="140" y="82" textAnchor="middle" fontSize="46" dominantBaseline="middle">{cfg.icon}</text>
      <text x="140" y="122" textAnchor="middle" fontSize="18" fontWeight="900" fill={cfg.bg2} fontFamily="Arial">{cfg.title}</text>
      <rect x="30" y="200" width="220" height="32" rx="16" fill={cfg.badgeBg}/>
      <text x="140" y="221" textAnchor="middle" fontSize="13" fontWeight="800" fill="white" fontFamily="Arial">{cfg.badge}</text>
    </svg>
  );
}

function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL,"#90CAF9"],"חג / אירוע":["#E8F5E9","#1B5E20","#A5D6A7"],"מצחיק / אפליקציה":["#FFF3E0","#E65100","#FFCC80"],"דרושים":["#FCE4EC","#C62828","#F48FB1"],"פוסט מבצע":["#FFF8E1","#E65100","#FFE082"]};
  const [bg,color,border]=m[type]||["#F5F5F5","#333","#DDD"];
  return <span style={{display:"inline-block",padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color,border:`1px solid ${border}`}}>{type}</span>;
}

export default function App() {
  const [phase, setPhase] = useState("setup");
  const [posts, setPosts] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth()+1);

  const build = (m) => {
    const list = [
      {id:1, type:"שני חסכוני", date:"03.03"},
      {id:2, type:"חג / אירוע", date:"10.03"},
      {id:3, type:"מצחיק / אפליקציה", date:"17.03"},
      {id:4, type:"דרושים", date:"24.03"},
      {id:5, type:"פוסט מבצע", date:null},
    ];
    setPosts(list);
    setPhase("gantt");
  };

  if (phase === "setup") {
    return (
      <div style={{minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", direction:"rtl", fontFamily:"Arial"}}>
        <div style={{background:WH, padding:40, borderRadius:24, boxShadow:"0 20px 50px rgba(0,0,0,0.1)", textAlign:"center", maxWidth:450, width:"95%"}}>
          <div style={{background:DV_PURPLE, width:60, height:60, borderRadius:15, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", color:WH, fontSize:24, fontWeight:900, boxShadow:"0 10px 20px rgba(109,40,217,0.2)"}}>DV</div>
          <h2 style={{color:DK, marginBottom:10, fontWeight:900, fontSize:26}}>מערכת גאנט תוכן</h2>
          <p style={{color:"#64748B", marginBottom:30}}>ניהול תוכן חכם לרשת Ten</p>
          <select value={month} onChange={e=>setMonth(+e.target.value)} style={{width:"100%", padding:15, borderRadius:12, border:`2px solid ${BR}`, marginBottom:20, fontSize:16, fontWeight:700}}>
            {MHE.map((m,i)=> i>0 && <option key={i} value={i}>{m}</option>)}
          </select>
          <button onClick={()=>build(month)} style={{width:"100%", padding:18, background:`linear-gradient(135deg, ${DV_GRAD1}, ${DV_GRAD2})`, color:WH, border:"none", borderRadius:12, fontSize:18, fontWeight:900, cursor:"pointer", boxShadow:"0 10px 20px rgba(109,40,217,0.3)"}}>🚀 צור גאנט {MHE[month]}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh", background:BG, direction:"rtl", fontFamily:"Arial"}}>
      <header style={{background:WH, padding:"15px 30px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${BR}`, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 10px rgba(0,0,0,0.02)"}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
           <div style={{background:DV_PURPLE, color:WH, padding:"5px 12px", borderRadius:8, fontWeight:900}}>DV</div>
           <span style={{fontWeight:900, fontSize:20, color:DK}}>גאנט {MHE[month]} 2025</span>
        </div>
        <button onClick={()=>setPhase("setup")} style={{background:"#F1F5F9", border:"none", padding:"10px 20px", borderRadius:10, fontWeight:700, cursor:"pointer", color:"#475569"}}>חזרה</button>
      </header>

      <main style={{maxWidth:1000, margin:"40px auto", padding:"0 20px"}}>
        {posts.map(p => (
           <div key={p.id} style={{background:WH, borderRadius:20, padding:0, marginBottom:25, boxShadow:"0 10px 25px rgba(0,0,0,0.05)", border:`1px solid ${BR}`, overflow:"hidden", display:"flex", flexWrap:"wrap"}}>
              <div style={{flex:1, padding:25, minWidth:300}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
                   <div style={{display:"flex", alignItems:"center", gap:12}}>
                      <span style={{background:"#F1F5F9", color:DV_PURPLE, width:35, height:35, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14}}>#{p.id}</span>
                      <span style={{fontWeight:800, color:DK, fontSize:18}}>{p.date || "פוסט מבצע"}</span>
                   </div>
                   <Badge type={p.type} />
                </div>
                <div style={{background:"#F8FAFC", padding:20, borderRadius:12, border:`1px solid ${BR}`, minHeight:120, color:"#334155", lineHeight:1.8, fontSize:15}}>
                   ממתין לייצור תוכן...
                </div>
                <button style={{marginTop:20, background:DV_PURPLE, color:WH, border:"none", padding:"10px 20px", borderRadius:10, fontWeight:700, cursor:"pointer"}}>🪄 ייצר טקסט</button>
              </div>
              <div style={{padding:25, background:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", borderRight:`1px solid ${BR}`}}>
                 <TenVisual type={p.type} c={{emoji:"📅"}} />
              </div>
           </div>
        ))}
      </main>
    </div>
  );
}
