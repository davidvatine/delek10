import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

const BL="#1565C0", BLl="#1E88E5", RD="#D32F2F", WH="#fff";
const BG="#EEF2F7", BR="#CFD8DC", DK="#1A2733";
const APP_LINK    = "https://ten.onelink.me/Cdb1/e3lfcju1";
const CAREER_LINK = "https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94";
const WHATSAPP    = "054-3207261";
const DISC        = `*החיסכון בתשלום באמצעות כרטיס מועדון TenVIP או בתשלום באפליקציית Ten. החיסכון ממחיר בנזין בשירות מלא, כפי שנקבע ע"י מנהל הדלק. החיסכון הינו בתדלוק בשירות עצמי בלבד, אין כפל מבצעים והנחות.`;
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DHE = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const STORAGE_KEY = "ten-gantt-v5";

const MD = {
  1:{season:"חורף",emoji:"❄️",weather:"קור וגשמים",holidays:[{d:15,n:'ט"ו בשבט'}],news:"גשמי חורף, עלייה במחירים"},
  2:{season:"חורף",emoji:"🌧️",weather:"גשמים, קור",holidays:[{d:14,n:"ולנטיינס"}],news:"חורף מלא, מלחמה עם איראן"},
  3:{season:"אביב",emoji:"🌸",weather:"מתחמם, פריחה",holidays:[{d:3,n:"פורים"},{d:20,n:"תחילת אביב"},{d:28,n:'ר"ח ניסן'}],news:"מלחמה עם איראן (מבצע שאגת הארי), פורים ב-3.3, ישראלים קרובים לבית בתחילת מרץ, האביב עם תקווה"},
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

function getMondays(y,m){
  const r=[]; const d=new Date(y,m-1,1);
  while(d.getDay()!==1) d.setDate(d.getDate()+1);
  while(d.getMonth()===m-1){ r.push(new Date(d)); d.setDate(d.getDate()+7); }
  return r;
}
function fmt(d){ return d ? `${d.getDate()}.${d.getMonth()+1}.${String(d.getFullYear()).slice(2)}` : "—"; }
function dn(d){ return d ? DHE[d.getDay()] : "—"; }
function pickDate(y,m,used,from,to){
  for(let i=from;i<=to;i++){
    const dt=new Date(y,m-1,i);
    if(!used.has(i)&&dt.getDay()!==5&&dt.getDay()!==6){ used.add(i); return dt; }
  }
  return null;
}

function buildSchedule(y,m){
  const mons=getMondays(y,m);
  const last=new Date(y,m,0).getDate();
  const used=new Set();
  const posts=[];
  const mon1=mons[0];
  if(mon1){ used.add(mon1.getDate()); posts.push({id:"mon1",date:mon1,type:"שני חסכוני",tk:"monday"}); }
  const hol=pickDate(y,m,used,4,12); if(hol) posts.push({id:"hol",date:hol,type:"חג / אירוע",tk:"holiday"});
  const fun=pickDate(y,m,used,9,18); if(fun) posts.push({id:"fun",date:fun,type:"מצחיק / אפליקציה",tk:"fun"});
  const rec=pickDate(y,m,used,16,24); if(rec) posts.push({id:"rec",date:rec,type:"דרושים",tk:"recruit"});
  const mon2=mons[mons.length-1];
  const last5=mon2&&!used.has(mon2.getDate())?mon2:pickDate(y,m,used,22,last);
  if(last5){ used.add(last5.getDate()); posts.push({id:"mon2",date:last5,type:"שני חסכוני",tk:"monday"}); }
  [1,2,3,4].forEach(i=>posts.push({id:`pr${i}`,date:null,type:"פוסט מבצע",tk:"promo",promoText:""}));
  return posts.sort((a,b)=>!a.date?1:!b.date?-1:a.date-b.date).map((p,i)=>({...p,num:i+1}));
}

// Serialize/deserialize posts (dates become strings)
function serializePosts(posts){
  return posts.map(p=>({...p, date: p.date ? p.date.toISOString() : null}));
}
function deserializePosts(posts){
  return posts.map(p=>({...p, date: p.date ? new Date(p.date) : null}));
}

/* ─── PROMPTS ─────────────────────────────────────────────────────── */
const pMonday=(d,c,ne,notes)=>`אתה קופירייטר בכיר של רשת תחנות דלק Ten בישראל.

דוגמת פוסט שני חסכוני מאושר:
---
החלטות קטנות לשבוע גדול. 💸
יש החלטות שפשוט עושות לכם את השבוע, כמו לבחור את הפלייליסט הנכון בבוקר, ולזכור שהיום שני חסכוני!
פותחים את השבוע בהחלטה הכי חכמה: באים לתדלק בתחנות Ten ביום שני. ⛽
משלמים באפליקציה 📲 או עם כרטיס מועדון VIP ונהנים מ-40 אגורות חיסכון לכל ליטר בנזין*.
זה פשוט. זה חכם. זה Ten.
עוד אין לכם את האפליקציה? 👇 ${APP_LINK}
${DISC}
---

כתוב פוסט שני חסכוני חדש לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | ${c.weather} | מצב: ${ne||c.news}
חגים קרובים: ${c.holidays.filter(h=>Math.abs(h.d-d.getDate())<=8).map(h=>h.n).join(", ")||"אין"}
${notes?`הערות: ${notes}`:""}
חוקים: אסור מקף ארוך (—), גוף שני רבים, 110-160 מילים כולל דיסקליימר, CTA עם לינק.
כתוב רק הטקסט הסופי.`;

const pHoliday=(d,c,ne,notes)=>{
  const h=c.holidays.filter(hh=>Math.abs(hh.d-d.getDate())<=10);
  return `אתה קופירייטר בכיר של Ten.
דוגמה: "בדרך לנטיעות עוצרים ב... Ten כמובן!!! ט"ו בשבט הגיע, זה הזמן לצאת לטבע. לפני שאתם נוטעים שורשים בפקקים, עוצרים ב-Ten! 🌳 ממלאים מיכל, מצטיידים בחטיפים, שתייה, קפה ויוצאים לנשום קצת ירוק."
כתוב פוסט חגי לתאריך ${fmt(d)} (${dn(d)}).
חגים: ${h.length?h.map(hh=>hh.n).join(", "):"ללא חג, כתוב על המצב הנוכחי"}
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
חוקים: אסור מקף ארוך (—), 80-130 מילים, CTA לתחנה.
כתוב רק הטקסט הסופי.`;
};

const pFun=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמאות: "זה קורה לכולם, נכון?... נכון?? 👀 תייגו חבר/ה שרק נכנסו לתדלק ויצאו עם חצי חנות."
"לפני תדלוק ב-Ten VS אחרי תדלוק ב-Ten. ככה האוטו מרגיש."
כתוב פוסט מצחיק/אפליקציה לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
חוקים: אסור מקף ארוך (—), הוק חזק, 70-120 מילים, CTA תיוג/תגובה/אפליקציה ${APP_LINK}.
כתוב רק הטקסט הסופי.`;

const pRecruit=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמה: "שנה חדשה, זמן מצוין לעבודה חדשה! מה תקבלו? 🔹 שכר הוגן 🔹 קידום מהיר 🔹 סביבה צעירה 🔹 הטבות דלק וחנות. יש לנו מאצ'? שלחו ווטסאפ למספר ${WHATSAPP} מגיל 18. אתר: ${CAREER_LINK}"
כתוב פוסט דרושים לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
חוקים: אסור מקף ארוך (—), פתיחה יצירתית, 4 הטבות עם אמוג'י, CTA ווטסאפ+אתר, 120-150 מילים.
כתוב רק הטקסט הסופי.`;

const pPromo=(pt,m,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמה: "אל תצאו לדרך בלעדיו! 🚫🚗 עכשיו ב-Ten: בוסטר התנעה 12,000 mAh רק ב-279 ש'ח. משלמים באפליקציה? 259 ש'ח! 🤩 ${APP_LINK}. **בתוקף עד [תאריך] או עד גמר המלאי, אין כפל מבצעים."
כתוב פוסט מבצע לחודש ${MHE[m]}.
המבצע: ${pt}
${notes?`הערות: ${notes}`:""}
חוקים: אסור מקף ארוך (—), פתיחה חזקה, מחיר ברור, לינק אפליקציה, דיסקליימר מלא עם תאריך, 100-150 מילים.
כתוב רק הטקסט הסופי.`;

async function callAI(prompt){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:prompt}]})
  });
  const d=await r.json();
  return (d.content?.[0]?.text||"").trim();
}

/* ─── VISUAL ──────────────────────────────────────────────────────── */
function TenVisual({type, c}){
  const uid = type.replace(/[^a-z]/gi,"").slice(0,6)+Math.random().toString(36).slice(2,5);
  const rays = Array.from({length:16},(_,i)=>i*(360/16));
  const cfgs = {
    "שני חסכוני":   {bg1:"#1565C0",bg2:"#0D47A1",badge:"40 אג׳ חיסכון לליטר",badgeBg:"#D32F2F",icon:"⛽",title:"יום שני חסכוני"},
    "חג / אירוע":   {bg1:"#1B5E20",bg2:"#2E7D32",badge:"Ten איתכם תמיד",badgeBg:"#1565C0",icon:c.emoji||"🌸",title:c.holidays[0]?.n||"חגים ואירועים"},
    "מצחיק / אפליקציה":{bg1:"#0D47A1",bg2:"#1565C0",badge:"ספרו לנו בתגובות!",badgeBg:"#D32F2F",icon:"📱",title:"את מי תבחרו?"},
    "דרושים":        {bg1:"#B71C1C",bg2:"#C62828",badge:"יש לנו מאצ׳?",badgeBg:"#1565C0",icon:"👥",title:"אנחנו מגייסים!"},
    "פוסט מבצע":     {bg1:"#E65100",bg2:"#BF360C",badge:"רק בתחנות Ten",badgeBg:"#1B5E20",icon:"🛒",title:"מבצע מיוחד"},
  };
  const cfg = cfgs[type] || cfgs["שני חסכוני"];
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg"
      style={{borderRadius:14,display:"block",boxShadow:"0 8px 28px rgba(0,0,0,0.28)"}}>
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={cfg.bg1} stopOpacity="1"/>
          <stop offset="100%" stopColor={cfg.bg2} stopOpacity="1"/>
        </radialGradient>
        <clipPath id={`cp${uid}`}><rect width="280" height="280" rx="14"/></clipPath>
      </defs>
      <g clipPath={`url(#cp${uid})`}>
        <rect width="280" height="280" fill={`url(#bg${uid})`}/>
        {rays.map((angle,i)=>(
          <line key={i} x1="140" y1="50"
            x2={140+Math.cos((angle-90)*Math.PI/180)*380}
            y2={50+Math.sin((angle-90)*Math.PI/180)*380}
            stroke="white" strokeWidth="1.8" opacity="0.07"/>
        ))}
        {/* Red diagonal band */}
        <path d="M0 185 L280 165 L280 280 L0 280 Z" fill="#C62828" opacity="0.9"/>
        <path d="M0 178 L280 158 L280 168 L0 192 Z" fill="white" opacity="0.1"/>
        {/* White content card */}
        <rect x="16" y="16" width="248" height="152" rx="14" fill="white" opacity="0.95"/>
        {/* Large icon */}
        <text x="140" y="82" textAnchor="middle" fontSize="46" dominantBaseline="middle">{cfg.icon}</text>
        {/* Title */}
        <text x="140" y="122" textAnchor="middle" fontSize="18" fontWeight="900"
          fill={cfg.bg2} fontFamily="Arial Black,Arial,sans-serif">{cfg.title}</text>
        {/* Subtext for savings */}
        {type==="שני חסכוני" && (
          <>
            <text x="140" y="148" textAnchor="middle" fontSize="26" fontWeight="900"
              fill="#D32F2F" fontFamily="Arial Black,Arial,sans-serif">40</text>
            <text x="175" y="148" textAnchor="start" fontSize="12" fontWeight="700"
              fill="#1565C0" fontFamily="Arial,sans-serif"> אגורות</text>
          </>
        )}
        {/* Badge strip */}
        <rect x="30" y="200" width="220" height="32" rx="16" fill={cfg.badgeBg}/>
        <text x="140" y="221" textAnchor="middle" fontSize="13" fontWeight="800"
          fill="white" fontFamily="Arial Black,Arial,sans-serif">{cfg.badge}</text>
        {/* Ten logo */}
        <circle cx="245" cy="256" r="20" fill="white" opacity="0.95"/>
        <text x="235" y="263" fontSize="16" fontWeight="900" fill={BL} fontFamily="Arial Black,Arial,sans-serif">1</text>
        <circle cx="252" cy="256" r="10" fill={RD}/>
        <circle cx="249" cy="253" r="2.2" fill="white"/>
        <circle cx="255" cy="253" r="2.2" fill="white"/>
        <path d="M247 259 Q252 264 257 259" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <text x="140" y="263" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.55)"
          fontFamily="Arial,sans-serif">לנשמה ולדרך</text>
      </g>
    </svg>
  );
}

/* ─── BADGE ───────────────────────────────────────────────────────── */
function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL,"#90CAF9"],"חג / אירוע":["#E8F5E9","#1B5E20","#A5D6A7"],"מצחיק / אפליקציה":["#FFF3E0","#E65100","#FFCC80"],"דרושים":["#FCE4EC","#C62828","#F48FB1"],"פוסט מבצע":["#FFF8E1","#E65100","#FFE082"]};
  const [bg,color,border]=m[type]||["#F5F5F5","#333","#DDD"];
  return <span style={{display:"inline-block",padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color,border:`1px solid ${border}`,whiteSpace:"nowrap"}}>{type}</span>;
}

/* ─── EXPORT MODAL ────────────────────────────────────────────────── */
function ExportModal({posts, month, year, c, onClose}){
  const [tab, setTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  const textContent = [
    `גאנט תוכן | דלק Ten | ${MHE[month]} ${year}`,
    `עונה: ${c.season} | ${c.weather}`,
    `חגים: ${c.holidays.map(h=>h.n).join(", ")||"אין"}`,
    `הקשר: ${c.news}`, ``,
    `=== סיכום ===`,
    ...posts.map(p=>`${p.num}. ${p.date?fmt(p.date):"לפי מבצע"} | ${p.type} | ${p.copy?"✅ מוכן":"⭕ ממתין"}`),
    ``, `=== פוסטים מלאים ===`, ``,
    ...posts.map(p=>[
      `────────────────────────`,
      `פוסט #${p.num} | ${p.type}`,
      p.date?`${fmt(p.date)} | ${dn(p.date)}`:"",``,
      p.copy||"[טרם נוצר]",``
    ].join("\n"))
  ].join("\n");

  function copyAll(){
    navigator.clipboard.writeText(textContent).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); });
  }

  const donePosts = posts.filter(p=>p.copy);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:WH,borderRadius:16,width:"100%",maxWidth:780,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",direction:"rtl"}} onClick={e=>e.stopPropagation()}>
        {/* Modal header */}
        <div style={{background:`linear-gradient(135deg,${BL},#0D47A1)`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{color:WH,fontWeight:900,fontSize:16}}>📤 ייצוא גאנט | {MHE[month]} {year}</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:WH,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:700,fontSize:14}}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`2px solid ${BR}`,flexShrink:0}}>
          {[["text","📋 טקסט להעתקה"],["preview","👁️ תצוגה מקדימה"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"11px 20px",border:"none",background:"none",fontWeight:700,fontSize:13,cursor:"pointer",color:tab===id?BL:"#78909C",borderBottom:tab===id?`3px solid ${BL}`:"3px solid transparent",marginBottom:-2}}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,overflow:"auto",padding:20}}>
          {tab==="text" && (
            <div>
              <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
                <span style={{fontSize:13,color:"#546E7A",flex:1}}>העתק את הכל ואחר כך הדבק בגוגל דוקס, וורד, או וואטסאפ ללקוח</span>
                <button onClick={copyAll} style={{background:copied?"#4CAF50":BL,color:WH,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontWeight:800,fontSize:13,transition:"background 0.3s",whiteSpace:"nowrap"}}>
                  {copied?"✅ הועתק!":"📋 העתק הכל"}
                </button>
              </div>
              <pre style={{background:"#F8FAFB",border:`1px solid ${BR}`,borderRadius:10,padding:16,fontSize:12.5,lineHeight:1.8,whiteSpace:"pre-wrap",direction:"rtl",fontFamily:"Arial,sans-serif",maxHeight:420,overflow:"auto",color:DK}}>
                {textContent}
              </pre>
            </div>
          )}

          {tab==="preview" && (
            <div>
              <div style={{background:"#E3F2FD",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#1565C0",fontWeight:600}}>
                💡 תצוגה מקדימה של הגאנט כפי שהלקוח יראה אותו. לשיתוף: העתק את הטקסט מהטאב הקודם.
              </div>
              {donePosts.length === 0 && (
                <div style={{textAlign:"center",color:"#90A4AE",padding:40}}>אין פוסטים מוכנים עדיין</div>
              )}
              {donePosts.map(p=>(
                <div key={p.id} style={{background:WH,borderRadius:12,border:`1px solid ${BR}`,marginBottom:14,overflow:"hidden"}}>
                  <div style={{padding:"10px 16px",background:"#F0F7FF",borderBottom:`1px solid ${BR}`,display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontWeight:900,color:BL,fontSize:14}}>#{p.num}</span>
                    <span style={{fontWeight:700,fontSize:13}}>{p.date?`${fmt(p.date)} | ${dn(p.date)}`:"לפי מבצע"}</span>
                    <Badge type={p.type}/>
                  </div>
                  <div style={{padding:"14px 16px",fontSize:14,lineHeight:1.85,whiteSpace:"pre-wrap",color:DK}}>
                    {p.copy}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{borderTop:`1px solid ${BR}`,padding:"12px 20px",background:"#FAFBFC",flexShrink:0,fontSize:12,color:"#78909C",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>{donePosts.length} פוסטים מוכנים מתוך {posts.length}</span>
          <span>לשיתוף ללקוח: העתק טקסט ← שלח בווטסאפ / מייל / הדבק בגוגל דוקס</span>
        </div>
      </div>
    </div>
  );
}

/* ─── POST CARD ───────────────────────────────────────────────────── */
function PostCard({post, c, month, ne, onUpdate}){
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(post.copy||"");
  const [notes, setNotes] = useState("");
  const [promoIn, setPromoIn] = useState(post.promoText||"");
  const [loading, setLoading] = useState(false);
  const [valResult, setValResult] = useState(post.val||"");
  const [valLoading, setValLoading] = useState(false);

  // sync editVal when post.copy changes externally
  useEffect(()=>{ setEditVal(post.copy||""); },[post.copy]);

  const status = post.copy ? "done" : post.tk==="promo"&&!post.promoText ? "empty" : "wait";

  async function gen(n){
    setLoading(true);
    let p="";
    if(post.tk==="monday")     p=pMonday(post.date,c,ne,n||notes);
    else if(post.tk==="holiday") p=pHoliday(post.date,c,ne,n||notes);
    else if(post.tk==="fun")     p=pFun(post.date,c,ne,n||notes);
    else if(post.tk==="recruit") p=pRecruit(post.date,c,ne,n||notes);
    else if(post.tk==="promo")   p=pPromo(promoIn||post.promoText,month,n||notes);
    const copy=await callAI(p);
    setEditVal(copy);
    setValResult("");
    onUpdate({...post,copy,promoText:promoIn,val:""});
    setLoading(false);
  }

  async function validate(){
    setValLoading(true);
    const r=await callAI(`בדוק פוסט זה של Ten בקצרה:
---
${post.copy||editVal}
---
בדוק: 1) יש מקף ארוך (—)? 2) שגיאות שפה? 3) טון מתאים? 4) CTA ברור?
ציון 1-10 ושיפור אחד. קצר, בעברית.`);
    setValResult(r);
    onUpdate({...post,val:r});
    setValLoading(false);
  }

  return (
    <div style={{background:WH,borderRadius:12,border:`1px solid ${BR}`,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",direction:"rtl"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:9,cursor:"pointer",
        background:status==="done"?"#F9FFFE":status==="empty"?"#FFF8F8":"#FAFBFC"}}>
        <span style={{fontWeight:800,color:BL,fontSize:13,minWidth:24}}>#{post.num}</span>
        <span style={{fontWeight:700,color:DK,fontSize:13}}>{post.date?`${fmt(post.date)} | ${dn(post.date)}`:"תאריך לפי מבצע"}</span>
        <Badge type={post.type}/>
        <span style={{marginRight:"auto",fontSize:11,fontWeight:800,
          color:status==="done"?"#4CAF50":status==="empty"?"#E53935":"#FF9800"}}>
          {status==="done"?"✅ מוכן":status==="empty"?"⭕ ממתין למבצע":"⏳"}
        </span>
        {loading && <span style={{fontSize:11,color:BL,fontWeight:700}}>מייצר...</span>}
        <span style={{color:"#90A4AE",fontSize:11}}>{open?"▲":"▼"}</span>
      </div>

      {open && (
        <div style={{borderTop:`1px solid ${BR}`}}>
          {post.tk==="promo" && (
            <div style={{padding:"10px 16px",background:"#FFFDE7",borderBottom:`1px solid ${BR}`}}>
              <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:5}}>📦 פרטי המבצע</div>
              <div style={{display:"flex",gap:8}}>
                <input value={promoIn} onChange={e=>setPromoIn(e.target.value)}
                  placeholder="למשל: קומפרסור 2 בוכנות ב-229 ש'ח, באפליקציה 199 ש'ח, עד 30.4.26"
                  style={{flex:1,padding:"7px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:12,fontFamily:"Arial"}}/>
                <button onClick={()=>{ onUpdate({...post,promoText:promoIn}); gen(""); }}
                  disabled={!promoIn||loading}
                  style={{background:BL,color:WH,border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:700,opacity:!promoIn||loading?0.5:1}}>
                  {loading?"...":"צור פוסט"}
                </button>
              </div>
            </div>
          )}

          {post.copy ? (
            <div style={{display:"grid",gridTemplateColumns:"1fr 296px"}}>
              <div style={{padding:"14px 18px",borderLeft:`1px solid ${BR}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:800,color:BL}}>📝 טקסט לפוסט</span>
                  <button onClick={()=>{ if(editing){ setEditing(false); onUpdate({...post,copy:editVal}); } else { setEditing(true); } }}
                    style={{marginRight:"auto",background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                    {editing?"💾 שמור":"✏️ ערוך"}
                  </button>
                </div>
                {editing ? (
                  <textarea value={editVal} onChange={e=>setEditVal(e.target.value)}
                    style={{width:"100%",height:210,padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:13,lineHeight:1.75,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial",direction:"rtl"}}/>
                ) : (
                  <div style={{fontSize:13.5,lineHeight:1.8,color:DK,whiteSpace:"pre-wrap",background:"#FAFBFC",padding:"10px 13px",borderRadius:8,border:`1px solid ${BR}`,minHeight:150}}>
                    {post.copy}
                  </div>
                )}
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                  <input value={notes} onChange={e=>setNotes(e.target.value)}
                    placeholder="הערה לייצור מחדש..."
                    style={{flex:1,minWidth:130,padding:"5px 9px",borderRadius:7,border:`1px solid ${BR}`,fontSize:11,fontFamily:"Arial"}}/>
                  <button onClick={()=>gen(notes)} disabled={loading}
                    style={{background:RD,color:WH,border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700,opacity:loading?0.5:1}}>
                    {loading?"...":"↺ מחדש"}
                  </button>
                  <button onClick={()=>navigator.clipboard.writeText(post.copy)}
                    style={{background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                    📋
                  </button>
                  <button onClick={validate} disabled={valLoading}
                    style={{background:"none",border:"1px solid #7B1FA2",color:"#7B1FA2",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                    {valLoading?"...":"🔍 בדוק"}
                  </button>
                </div>
                {valResult && (
                  <div style={{marginTop:8,background:"#F3E5F5",border:"1px solid #CE93D8",borderRadius:8,padding:"9px 12px",fontSize:11.5,lineHeight:1.7,color:"#4A148C",whiteSpace:"pre-wrap"}}>
                    {valResult}
                  </div>
                )}
              </div>
              <div style={{padding:"14px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,background:"#F0F4F8"}}>
                <span style={{fontSize:11,fontWeight:800,color:RD,alignSelf:"flex-start"}}>🎨 ויז׳ואל</span>
                <TenVisual type={post.type} c={c}/>
                <span style={{fontSize:10,color:"#90A4AE",textAlign:"center"}}>להמחשה בלבד</span>
              </div>
            </div>
          ) : (
            <div style={{padding:"20px",textAlign:"center"}}>
              {post.tk!=="promo" && (
                loading
                  ? <div style={{color:BL,fontWeight:700,fontSize:13}}>⏳ מייצר...</div>
                  : <div style={{color:"#90A4AE",fontSize:13}}>⏳ ממתין לייצור אוטומטי</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────────── */
export default function TenGanttAI(){
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()+1);
  const [phase, setPhase] = useState("setup");
  const [posts, setPosts] = useState([]);
  const [progress, setProgress] = useState({done:0,total:0});
  const [ne, setNe] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "saving" | "saved" | "loaded" | ""
  const [storageLoading, setStorageLoading] = useState(true);

  const c = getCtx(month);
  const AUTO = ["monday","holiday","fun","recruit"];
  const doneCount = posts.filter(p=>p.copy).length;
  const autoTotal = posts.filter(p=>AUTO.includes(p.tk)).length;
  const isDone = progress.done >= autoTotal && autoTotal > 0;
  const pct = autoTotal > 0 ? Math.round((progress.done/autoTotal)*100) : 0;

  /* ── LOAD saved state on mount ── */
  useEffect(()=>{
    async function load(){
      try {
        const saved = await window.storage.get(STORAGE_KEY);
        if(saved && saved.value){
          const data = JSON.parse(saved.value);
          setYear(data.year || now.getFullYear());
          setMonth(data.month || now.getMonth()+1);
          setNe(data.ne || "");
          if(data.posts && data.posts.length > 0){
            setPosts(deserializePosts(data.posts));
            setPhase("gantt");
            setSaveStatus("loaded");
            setTimeout(()=>setSaveStatus(""),3000);
          }
        }
      } catch(e){ /* no saved data */ }
      setStorageLoading(false);
    }
    load();
  },[]);

  /* ── SAVE whenever posts change ── */
  useEffect(()=>{
    if(posts.length === 0 || storageLoading) return;
    setSaveStatus("saving");
    const timer = setTimeout(async()=>{
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({
          year, month, ne,
          posts: serializePosts(posts),
          savedAt: new Date().toISOString()
        }));
        setSaveStatus("saved");
        setTimeout(()=>setSaveStatus(""),2500);
      } catch(e){ setSaveStatus(""); }
    }, 800);
    return ()=>clearTimeout(timer);
  },[posts, year, month, ne]);

  function upd(updated){
    setPosts(prev=>prev.map(p=>p.id===updated.id?updated:p));
  }

  async function runAuto(arr){
    const auto = arr.filter(p=>AUTO.includes(p.tk));
    setProgress({done:0,total:auto.length});
    for(const post of auto){
      let prompt="";
      const localCtx = getCtx(month);
      if(post.tk==="monday")     prompt=pMonday(post.date,localCtx,ne,"");
      else if(post.tk==="holiday") prompt=pHoliday(post.date,localCtx,ne,"");
      else if(post.tk==="fun")     prompt=pFun(post.date,localCtx,ne,"");
      else if(post.tk==="recruit") prompt=pRecruit(post.date,localCtx,ne,"");
      const copy = await callAI(prompt);
      setPosts(prev=>prev.map(p=>p.id===post.id?{...p,copy}:p));
      setProgress(prev=>({...prev,done:prev.done+1}));
    }
  }

  function handleBuild(){
    const arr = buildSchedule(year,month);
    setPosts(arr);
    setProgress({done:0,total:0});
    setPhase("gantt");
    runAuto(arr);
  }

  async function clearSaved(){
    try { await window.storage.delete(STORAGE_KEY); } catch(e){}
    setPosts([]);
    setPhase("setup");
    setProgress({done:0,total:0});
  }

  if(storageLoading){
    return (
      <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial,sans-serif",direction:"rtl"}}>
        <div style={{textAlign:"center",color:BL}}>
          <div style={{fontSize:32,marginBottom:12}}>⏳</div>
          <div style={{fontWeight:700,fontSize:16}}>טוען נתונים שמורים...</div>
        </div>
      </div>
    );
  }

  /* ── SETUP ── */
  if(phase==="setup") return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"20px 28px",display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:WH,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 12px rgba(0,0,0,0.2)"}}>
          <span style={{color:BL,fontWeight:900,fontSize:20}}>1</span><span style={{color:RD,fontWeight:900,fontSize:20}}>0</span>
        </div>
        <div>
          <div style={{color:WH,fontSize:20,fontWeight:900}}>גאנט AI | דלק Ten</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>9 פוסטים חודשיים | שמירה אוטומטית | ייצוא קל</div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"32px auto",padding:"0 16px"}}>
        <div style={{background:WH,borderRadius:16,padding:32,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <h2 style={{color:BL,fontSize:20,fontWeight:900,marginBottom:24,textAlign:"center"}}>בחר חודש לגאנט</h2>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
            <div>
              <label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:6}}>חודש</label>
              <select value={month} onChange={e=>setMonth(+e.target.value)}
                style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:15,fontWeight:700}}>
                {MHE.slice(1).map((n,i)=><option key={i+1} value={i+1}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:6}}>שנה</label>
              <select value={year} onChange={e=>setYear(+e.target.value)}
                style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:15,fontWeight:700}}>
                {[2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div style={{background:"#F0F7FF",borderRadius:10,padding:"13px 16px",marginBottom:16,border:`1px solid #BBDEFB`,fontSize:13,lineHeight:1.9}}>
            <div style={{fontWeight:800,color:BL,marginBottom:6}}>{c.emoji} הקשר ל-{MHE[month]} {year}</div>
            <div><strong>עונה:</strong> {c.season} | {c.weather}</div>
            <div><strong>חגים מאומתים:</strong> {c.holidays.map(h=>`${h.n} (${h.d}.${month})`).join(", ")||"אין"}</div>
            <div style={{marginTop:5,color:"#455A64"}}><strong>תקשורת:</strong> {c.news}</div>
          </div>

          <div style={{marginBottom:20}}>
            <label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:5}}>📰 הקשר תקשורתי נוסף</label>
            <textarea value={ne} onChange={e=>setNe(e.target.value)}
              placeholder="למשל: עלייה במחירי דלק, גל חום..."
              style={{width:"100%",height:66,padding:"9px 11px",borderRadius:8,border:`1px solid ${BR}`,fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial"}}/>
          </div>

          <div style={{background:"#FFF8F8",borderRadius:10,padding:"12px 16px",marginBottom:24,border:`1px solid #FFCDD2`,fontSize:13,lineHeight:2}}>
            <div style={{fontWeight:800,color:RD,marginBottom:5}}>📌 מה יקרה</div>
            ✅ 5 פוסטים ייוצרו אוטומטית ← ⭕ 4 פוסטי מבצע ריקים<br/>
            💾 שמירה אוטומטית ← רענון הדף לא ימחק כלום<br/>
            📤 ייצוא: העתק טקסט / תצוגה מקדימה ללקוח
          </div>

          <button onClick={handleBuild}
            style={{width:"100%",background:BL,color:WH,border:"none",borderRadius:10,padding:"15px 0",fontSize:17,fontWeight:900,cursor:"pointer",boxShadow:`0 4px 16px ${BL}55`}}>
            🚀 בנה גאנט ל-{MHE[month]} {year}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── GANTT ── */
  return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      {showExport && <ExportModal posts={posts} month={month} year={year} c={c} onClose={()=>setShowExport(false)}/>}

      <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:WH,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:BL,fontWeight:900,fontSize:17}}>1</span><span style={{color:RD,fontWeight:900,fontSize:17}}>0</span>
          </div>
          <div>
            <div style={{color:WH,fontSize:17,fontWeight:900}}>גאנט {MHE[month]} {year}</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,display:"flex",alignItems:"center",gap:8}}>
              <span>{c.emoji} {c.season} | {doneCount}/{posts.length} מוכנים</span>
              {saveStatus==="saving" && <span style={{background:"rgba(255,255,255,0.15)",padding:"1px 8px",borderRadius:10,fontSize:10}}>💾 שומר...</span>}
              {saveStatus==="saved"  && <span style={{background:"rgba(76,175,80,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>✅ נשמר</span>}
              {saveStatus==="loaded" && <span style={{background:"rgba(255,193,7,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>📂 נטען מהשמירה</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={()=>setShowExport(true)}
            style={{background:"#4CAF50",color:WH,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:800}}>
            📤 ייצוא ושיתוף
          </button>
          <button onClick={clearSaved}
            style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:WH,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>
            🗑️ מחק ואפס
          </button>
        </div>
      </div>

      <div style={{maxWidth:1060,margin:"0 auto",padding:"18px 16px"}}>

        {!isDone && autoTotal > 0 && (
          <div style={{background:WH,borderRadius:12,padding:"13px 18px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontWeight:700,color:BL,fontSize:13}}>⚙️ מייצר {autoTotal} פוסטים אוטומטית...</span>
              <span style={{fontWeight:700,color:BL}}>{progress.done}/{autoTotal}</span>
            </div>
            <div style={{height:8,background:"#E3F2FD",borderRadius:8,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${BL},${BLl})`,borderRadius:8,transition:"width 0.4s"}}/>
            </div>
          </div>
        )}

        {isDone && (
          <div style={{background:"#E8F5E9",border:"1px solid #A5D6A7",borderRadius:12,padding:"11px 18px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>✅</span>
            <div>
              <div style={{fontWeight:800,color:"#1B5E20",fontSize:14}}>5 פוסטים נוצרו ונשמרו! לחץ "ייצוא ושיתוף" לשיתוף הלקוח.</div>
              <div style={{fontSize:12,color:"#388E3C"}}>4 פוסטי מבצע ממתינים לפרטים מהלקוח</div>
            </div>
          </div>
        )}

        <div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:12,color:"#5D4037"}}>
          <strong>📰</strong> {ne||c.news}
        </div>

        {/* Table */}
        <div style={{background:WH,borderRadius:12,marginBottom:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:`1px solid ${BR}`}}>
          <div style={{background:BL,padding:"9px 16px",color:WH,fontWeight:800,fontSize:13}}>📋 סיכום גאנט | {MHE[month]} {year}</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,direction:"rtl"}}>
            <thead>
              <tr style={{background:"#F0F7FF"}}>
                {["#","תאריך","יום","סוג פוסט","סטטוס"].map(h=>(
                  <th key={h} style={{padding:"7px 13px",textAlign:"right",color:BL,fontWeight:700,fontSize:12}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p,i)=>(
                <tr key={p.id} style={{borderTop:`1px solid ${BR}`,background:i%2===0?WH:"#FAFBFC"}}>
                  <td style={{padding:"7px 13px",fontWeight:700,color:BL}}>{p.num}</td>
                  <td style={{padding:"7px 13px",fontWeight:600}}>{p.date?fmt(p.date):"לפי מבצע"}</td>
                  <td style={{padding:"7px 13px"}}>{p.date?dn(p.date):""}</td>
                  <td style={{padding:"7px 13px"}}><Badge type={p.type}/></td>
                  <td style={{padding:"7px 13px",fontSize:12}}>
                    {p.copy ? <span style={{color:"#4CAF50",fontWeight:700}}>✅</span>
                      : p.tk==="promo" ? <span style={{color:RD,fontWeight:700}}>⭕</span>
                      : <span style={{color:"#FF9800"}}>⏳</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{fontSize:12,color:"#78909C",marginBottom:8}}>לחץ על כל שורה לפתיחת הפוסט המלא</div>
        {posts.map(p=>(
          <PostCard key={p.id} post={p} c={c} month={month} ne={ne} onUpdate={upd}/>
        ))}

        <div style={{background:"#E8EAF6",borderRadius:10,padding:"13px 18px",fontSize:12,color:"#283593",border:"1px solid #9FA8DA",marginTop:6,lineHeight:1.8}}>
          <strong>📤 איך לשתף ללקוח:</strong><br/>
          לחץ <strong>"ייצוא ושיתוף"</strong> ← בחר <strong>"תצוגה מקדימה"</strong> לראות איך הלקוח יראה<br/>
          או <strong>"טקסט להעתקה"</strong> ← לחץ <strong>"העתק הכל"</strong> ← הדבק בגוגל דוקס / מייל / וואטסאפ
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<TenGanttAI />);
}
