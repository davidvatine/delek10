import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// --- הגדרות עיצוב וקבועים ---
const BL="#1565C0", BLl="#1E88E5", RD="#D32F2F", WH="#fff";
const BG="#EEF2F7", BR="#CFD8DC", DK="#1A2733";
const APP_LINK    = "https://ten.onelink.me/Cdb1/e3lfcju1";
const CAREER_LINK = "https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94";
const WHATSAPP    = "054-3207261";
const DISC        = `*החיסכון בתשלום באמצעות כרטיס מועדון TenVIP או בתשלום באפליקציית Ten. החיסכון ממחיר בנזין בשירות מלא, כפי שנקבע ע"י מנהל הדלק. החיסכון הינו בתדלוק בשירות עצמי בלבד, אין כפל מבצעים והנחות.`;
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DHE = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const STORAGE_KEY = "ten-gantt-v5";

// משתנים ריקים למניעת שגיאות - אפשר להדביק פה את ה-Base64 הארוך אם תרצה בעתיד
const DAVID_LOGO = ""; 
const LOGO_SRC = "";

const MD = {
  1:{season:"חורף",emoji:"❄️",weather:"קור וגשמים",holidays:[{d:15,n:'ט"ו בשבט'}],news:"גשמי חורף, עלייה במחירים"},
  2:{season:"חורף",emoji:"🌧️",weather:"גשמים, קור",holidays:[{d:14,n:"ולנטיינס"}],news:"חורף מלא, מלחמה עם איראן"},
  3:{season:"אביב",emoji:"🌸",weather:"מתחמם, פריחה",holidays:[{d:3,n:"פורים"},{d:20,n:"תחילת אביב"},{d:28,n:'ר"ח ניסן'}],news:"מלחמה עם איראן, פורים ב-3.3, האביב עם תקווה"},
  4:{season:"אביב",emoji:"🌿",weather:"פריחה, טיולים",holidays:[{d:2,n:"פסח"},{d:21,n:"יום הזיכרון"},{d:22,n:"יום העצמאות"}],news:"פסח ונסיעות לחג"},
  5:{season:"קיץ",emoji:"🌻",weather:"חמים, שמש",holidays:[{d:5,n:'ל"ג בעומר'},{d:21,n:"שבועות"}],news:"קיץ קרב"},
  6:{season:"קיץ",emoji:"☀️",weather:"חום, מזגן",holidays:[{d:21,n:"תחילת קיץ"}],news:"גל חום, חופשות"},
  7:{season:"קיץ",emoji:"🏖️",weather:"חום שיא",holidays:[{d:9,n:"תשעה באב"}],news:"חופשות קיץ"},
  8:{season:"קיץ",emoji:"🌊",weather:"חום, חזרה לשגרה",holidays:[{d:30,n:"פתיחת שנת לימודים"}],news:"חזרה לבתי ספר"},
  9:{season:"סתיו",emoji:"🍂",weather:"מתקרר, חגי תשרי",holidays:[{d:22,n:"ראש השנה"},{d:24,n:"כיפור"}],news:"חגי תשרי"},
  10:{season:"סתיו",emoji:"🌧️",weather:"גשמים ראשונים",holidays:[{d:1,n:"סוכות"}],news:"גשמים ראשונים"},
  11:{season:"חורף",emoji:"🍁",weather:"גשמים, קריר",holidays:[{d:28,n:"חנוכה"}],news:"חנוכה קרב"},
  12:{season:"חורף",emoji:"🕎",weather:"קור, חנוכה",holidays:[{d:1,n:"חנוכה"},{d:31,n:"סילבסטר"}],news:"חנוכה, עונת מתנות"},
};

const getCtx = (m) => MD[m] || {season:"כללי",emoji:"📅",weather:"",holidays:[],news:""};

function fmt(d){ return d ? `${d.getDate()}.${d.getMonth()+1}.${String(d.getFullYear()).slice(2)}` : "—"; }
function dn(d){ return d ? DHE[d.getDay()] : "—"; }

function buildSchedule(y,m){
  const r=[]; const d=new Date(y,m-1,1);
  const mons = [];
  while(d.getDay()!==1) d.setDate(d.getDate()+1);
  while(d.getMonth()===m-1){ mons.push(new Date(d)); d.setDate(d.getDate()+7); }
  
  const posts = [];
  if(mons[0]) posts.push({id:"mon1",date:mons[0],type:"שני חסכוני",tk:"monday"});
  if(mons[mons.length-1]) posts.push({id:"mon2",date:mons[mons.length-1],type:"שני חסכוני",tk:"monday"});
  
  posts.push({id:"hol",date:new Date(y,m-1,10),type:"חג / אירוע",tk:"holiday"});
  posts.push({id:"fun",date:new Date(y,m-1,15),type:"מצחיק / אפליקציה",tk:"fun"});
  posts.push({id:"rec",date:new Date(y,m-1,20),type:"דרושים",tk:"recruit"});
  
  [1,2,3,4].forEach(i=>posts.push({id:`pr${i}`,date:null,type:"פוסט מבצע",tk:"promo",promoText:""}));
  return posts.map((p,i)=>({...p,num:i+1}));
}

// --- פונקציית ה-AI המתוקנת ---
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

// --- רכיבי ויזואל ---
function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL,"#90CAF9"],"חג / אירוע":["#E8F5E9","#1B5E20","#A5D6A7"],"מצחיק / אפליקציה":["#FFF3E0","#E65100","#FFCC80"],"דרושים":["#FCE4EC","#C62828","#F48FB1"],"פוסט מבצע":["#FFF8E1","#E65100","#FFE082"]};
  const [bg,color,border]=m[type]||["#F5F5F5","#333","#DDD"];
  return <span style={{display:"inline-block",padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color,border:`1px solid ${border}`,whiteSpace:"nowrap"}}>{type}</span>;
}

function PostCard({post, c, month, ne, onUpdate}){
  const [loading, setLoading] = useState(false);
  const status = post.copy ? "done" : "wait";

  async function generate(){
    setLoading(true);
    const p = `כתוב פוסט לרשת Ten עבור ${post.type}. תאריך: ${fmt(post.date)}. הקשר: ${ne || c.news}`;
    const copy = await callAI(p);
    onUpdate({...post, copy});
    setLoading(false);
  }

  return (
    <div style={{background:WH, borderRadius:12, border:`1px solid ${BR}`, marginBottom:10, padding:15, direction:"rtl"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <span style={{fontWeight:800}}>#{post.num} - {post.date ? fmt(post.date) : "פוסט מבצע"}</span>
        <Badge type={post.type} />
      </div>
      <div style={{marginTop:10, minHeight:60, background:"#f9f9f9", padding:10, borderRadius:8}}>
        {loading ? "מייצר..." : post.copy || "לחץ לייצור פוסט"}
      </div>
      {!post.copy && <button onClick={generate} style={{marginTop:10, background:BL, color:WH, border:"none", padding:"5px 15px", borderRadius:5, cursor:"pointer"}}>ייצר פוסט</button>}
    </div>
  );
}

// --- האפליקציה הראשית ---
export function TenGanttAI() {
  const [posts, setPosts] = useState([]);
  const [phase, setPhase] = useState("setup");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(2025);

  function handleBuild() {
    const arr = buildSchedule(year, month);
    setPosts(arr);
    setPhase("gantt");
  }

  if (phase === "setup") {
    return (
      <div style={{padding: 20, direction: "rtl", textAlign: "center", fontFamily: "Arial"}}>
        <h2>יוצר גאנט תוכן - Ten</h2>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {MHE.map((m, i) => i > 0 && <option key={i} value={i}>{m}</option>)}
        </select>
        <button onClick={handleBuild} style={{marginRight: 10, padding: "5px 20px", background: BL, color: WH, border: "none", borderRadius: 5}}>בנה גאנט</button>
      </div>
    );
  }

  return (
    <div style={{padding: 20, direction: "rtl", background: BG, minHeight: "100vh", fontFamily: "Arial"}}>
      <h2 style={{color: BL}}>גאנט לחודש {MHE[month]} {year}</h2>
      {posts.map(p => (
        <PostCard key={p.id} post={p} c={getCtx(month)} month={month} onUpdate={(upd) => setPosts(prev => prev.map(item => item.id === upd.id ? upd : item))} />
      ))}
    </div>
  );
}

// --- חיבור ל-HTML (קריטי למניעת דף לבן) ---
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<TenGanttAI />);
}

export default TenGanttAI;
