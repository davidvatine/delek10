import { useState, useEffect } from "react";

const BL="#1565C0", BLl="#1E88E5", RD="#D32F2F", WH="#fff";
const BG="#EEF2F7", BR="#CFD8DC", DK="#1A2733";
const APP_LINK    = "https://ten.onelink.me/Cdb1/e3lfcju1";
const CAREER_LINK = "https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94";
const WHATSAPP    = "054-3207261";
const DISC        = `*החיסכון בתשלום באמצעות כרטיס מועדון TenVIP או בתשלום באפליקציית Ten. החיסכון ממחיר בנזין בשירות מלא, כפי שנקבע ע"י מנהל הדלק. החיסכון הינו בתדלוק בשירות עצמי בלבד, אין כפל מבצעים והנחות.`;
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DHE = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const APP_VERSION = "v7.6-STABLE";

// צבעי מותג David Vatine
const DV_PURPLE = "#6D28D9", DV_GRAD1 = "#7C3AED", DV_GRAD2 = "#4F46E5";

const MD = {
  1:{season:"חורף",emoji:"❄️",weather:"קור וגשמים",holidays:[{d:15,n:'ט"ו בשבט'}],news:"גשמי חורף, עלייה במחירים"},
  2:{season:"חורף",emoji:"🌧️",weather:"גשמים, קור",holidays:[{d:14,n:"ולנטיינס"}],news:"חורף מלא, מלחמה עם איראן"},
  3:{season:"אביב",emoji:"🌸",weather:"מתחמם, פריחה",holidays:[{d:3,n:"פורים"},{d:20,n:"תחילת אביב"}],news:"מלחמה עם איראן, פורים ב-3.3, האביב עם תקווה"},
  // שאר החודשים נשמרים לוגית
};

const getCtx = (m) => MD[m] || {season:"כללי",emoji:"📅",weather:"",holidays:[],news:""};

function buildSchedule(y,m){
  return [
    {id:"mon1", num:1, type:"שני חסכוני", tk:"monday", date: new Date(y,m-1,3)},
    {id:"hol", num:2, type:"חג / אירוע", tk:"holiday", date: new Date(y,m-1,10)},
    {id:"fun", num:3, type:"מצחיק / אפליקציה", tk:"fun", date: new Date(y,m-1,17)},
    {id:"rec", num:4, type:"דרושים", tk:"recruit", date: new Date(y,m-1,24)},
    {id:"mon2", num:5, type:"שני חסכוני", tk:"monday", date: new Date(y,m-1,31)},
    {id:"pr1", num:6, type:"פוסט מבצע", tk:"promo", date: null},
    {id:"pr2", num:7, type:"פוסט מבצע", tk:"promo", date: null},
    {id:"pr3", num:8, type:"פוסט מבצע", tk:"promo", date: null},
    {id:"pr4", num:9, type:"פוסט מבצע", tk:"promo", date: null},
  ];
}

function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL,"#90CAF9"],"חג / אירוע":["#E8F5E9","#1B5E20","#A5D6A7"],"מצחיק / אפליקציה":["#FFF3E0","#E65100","#FFCC80"],"דרושים":["#FCE4EC","#C62828","#F48FB1"],"פוסט מבצע":["#FFF8E1","#E65100","#FFE082"]};
  const [bg,color,border]=m[type]||["#F5F5F5","#333","#DDD"];
  return <span style={{display:"inline-block",padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color,border:`1px solid ${border}`,whiteSpace:"nowrap"}}>{type}</span>;
}

export default function App() {
  const [phase, setPhase] = useState("setup");
  const [posts, setPosts] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth()+1);

  if (phase === "setup") {
    return (
      <div style={{minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", direction:"rtl", fontFamily:"Arial"}}>
        <div style={{background:WH, padding:40, borderRadius:24, boxShadow:"0 20px 50px rgba(0,0,0,0.1)", textAlign:"center", maxWidth:450, width:"90%"}}>
          <div style={{background:DV_PURPLE, width:60, height:60, borderRadius:15, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", color:WH, fontSize:24, fontWeight:900}}>DV</div>
          <h2 style={{color:DK, marginBottom:10, fontWeight:900, fontSize:24}}>מערכת גאנט תוכן</h2>
          <p style={{color:"#64748B", marginBottom:30, fontSize:15}}>ניהול תוכן חכם לרשת Ten</p>
          
          <select value={month} onChange={e=>setMonth(+e.target.value)} style={{width:"100%", padding:15, borderRadius:12, border:`2px solid ${BR}`, marginBottom:20, fontSize:16, fontWeight:700, outline:"none"}}>
            {MHE.map((m,i)=> i>0 && <option key={i} value={i}>{m}</option>)}
          </select>

          <button onClick={()=>{setPosts(buildSchedule(2025, month)); setPhase("gantt")}} 
            style={{width:"100%", padding:18, background:`linear-gradient(135deg, ${DV_GRAD1}, ${DV_GRAD2})`, color:WH, border:"none", borderRadius:12, fontSize:18, fontWeight:900, cursor:"pointer", boxShadow:"0 10px 20px rgba(109,40,217,0.3)"}}>
            🚀 צור גאנט חודשי
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh", background:BG, direction:"rtl", fontFamily:"Arial"}}>
      <header style={{background:WH, padding:"15px 30px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${BR}`, position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
           <div style={{background:DV_PURPLE, color:WH, padding:"5px 10px", borderRadius:8, fontWeight:900}}>DV</div>
           <span style={{fontWeight:900, fontSize:18, color:DK}}>גאנט {MHE[month]} 2025</span>
        </div>
        <button onClick={()=>setPhase("setup")} style={{background:"#F1F5F9", border:"none", padding:"8px 15px", borderRadius:8, fontWeight:700, cursor:"pointer", color:"#475569"}}>חזרה לתפריט</button>
      </header>

      <main style={{maxWidth:900, margin:"40px auto", padding:"0 20px"}}>
        {posts.map(p => (
           <div key={p.id} style={{background:WH, borderRadius:16, padding:25, marginBottom:20, boxShadow:"0 4px 6px rgba(0,0,0,0.02)", border:`1px solid ${BR}`}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:15}}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                   <span style={{background:"#F1F5F9", color:DV_PURPLE, width:30, height:30, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900}}>#{(p.num)}</span>
                   <span style={{fontWeight:800, color:DK}}>{p.date ? `${p.date.getDate()}.${p.date.getMonth()+1}` : "פוסט מבצע"}</span>
                </div>
                <Badge type={p.type} />
              </div>
              <div style={{background:"#F8FAFC", padding:20, borderRadius:12, border:`1px solid ${BR}`, minHeight:100, color:"#334155", lineHeight:1.7}}>
                 ממתין לייצור תוכן...
              </div>
           </div>
        ))}
      </main>
    </div>
  );
}
