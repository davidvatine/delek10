import { useState, useEffect } from "react";

const BL="#1565C0", BLl="#1E88E5", RD="#D32F2F", WH="#fff";
const BG="#EEF2F7", BR="#CFD8DC", DK="#1A2733";
const APP_LINK    = "https://ten.onelink.me/Cdb1/e3lfcju1";
const CAREER_LINK = "https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94";
const WHATSAPP    = "054-3207261";
const DISC        = `*החיסכון בתשלום באמצעות כרטיס מועדון TenVIP או בתשלום באפליקציית Ten. החיסכון ממחיר בנזין בשירות מלא, כפי שנקבע ע"י מנהל הדלק. החיסכון הינו בתדלוק בשירות עצמי בלבד, אין כפל מבצעים והנחות.`;
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DHE = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const APP_VERSION = "v6.0 — אישור לקוח + העלאת תמונות";
const LOGO_SRC = "data:image/png;base64,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";

// ── רשימת לקוחות ──
const DEFAULT_CLIENTS = [
  {
    id: "delek10",
    name: "דלק Ten",
    logo: LOGO_SRC,
    color: "#1565C0",
    appLink: "https://ten.onelink.me/Cdb1/e3lfcju1",
    whatsapp: "054-3207261",
    careerLink: "https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94",
  }
];
const CLIENTS_KEY = "ten-gantt-clients-v1";
function loadClients() {
  try { return JSON.parse(localStorage.getItem(CLIENTS_KEY)) || DEFAULT_CLIENTS; } catch(e) { return DEFAULT_CLIENTS; }
}
function saveClients(list) {
  try { localStorage.setItem(CLIENTS_KEY, JSON.stringify(list)); } catch(e) {}
}
const STORAGE_KEY = "ten-gantt-v5"; // legacy single-gantt key
const GANTT_LIST_KEY = "ten-gantt-list-v1"; // list of saved gantt keys

function ganttKey(y, m) { return `ten-gantt-${y}-${m}`; }

// ── Supabase share helpers ──────────────────────────────────────────
const SUPABASE_URL = "https://oexdfprqbhlbuesaxfjx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGRmcHJxYmhsYnVlc2F4Zmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDk4MzQsImV4cCI6MjA4ODI4NTgzNH0.jh-Tv2d8dQOW8UQ6UgiBcpVTTzlaePzWQg9ozm6BSgs";

function makeShareId(year, month) {
  const rand = Math.random().toString(36).slice(2,7);
  return `${year}-${String(month).padStart(2,"0")}-${rand}`;
}

async function saveGanttToSupabase(id, year, month, ne, posts) {
  const r = await fetch(`/api/gantt?action=save`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ id, year, month, ne, posts })
  });
  return r.ok;
}

async function loadGanttFromSupabase(id) {
  const r = await fetch(`/api/gantt?action=load&id=${id}`);
  if (!r.ok) return null;
  return r.json();
}

async function addComment(gantt_id, post_id, post_type, comment, author_name, gantt_url) {
  const r = await fetch(`/api/gantt?action=comment`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ gantt_id, post_id, post_type, comment, author_name })
  });
  if (r.ok) {
    // fire-and-forget notification
    fetch(`/api/notify`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ gantt_id, post_type, comment, author_name, gantt_url })
    }).catch(()=>{});
  }
  return r.ok;
}

async function getComments(gantt_id) {
  const r = await fetch(`/api/gantt?action=comments&gantt_id=${gantt_id}`);
  if (!r.ok) return [];
  return r.json();
}

function listSavedGantts() {
  try {
    const list = JSON.parse(localStorage.getItem(GANTT_LIST_KEY) || "[]");
    return list; // [{year, month, savedAt, doneCount}]
  } catch(e) { return []; }
}

function saveGanttToStorage(year, month, ne, posts) {
  try {
    const key = ganttKey(year, month);
    const data = { year, month, ne, posts: serializePosts(posts), savedAt: new Date().toISOString(), doneCount: posts.filter(p=>p.copy).length };
    localStorage.setItem(key, JSON.stringify(data));
    // update list
    let list = listSavedGantts();
    list = list.filter(g => !(g.year===year && g.month===month));
    list.unshift({ year, month, savedAt: data.savedAt, doneCount: data.doneCount });
    localStorage.setItem(GANTT_LIST_KEY, JSON.stringify(list));
  } catch(e) {}
}

function loadGanttFromStorage(year, month) {
  try {
    const key = ganttKey(year, month);
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch(e) { return null; }
}

function deleteGanttFromStorage(year, month) {
  try {
    localStorage.removeItem(ganttKey(year, month));
    let list = listSavedGantts();
    list = list.filter(g => !(g.year===year && g.month===month));
    localStorage.setItem(GANTT_LIST_KEY, JSON.stringify(list));
  } catch(e) {}
}

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
// ─── כלל שפה שחוזר בכל פרומפט ────────────────────────────────────
const LANG_RULES = `
כללי שפה עברית מחייבים — אסור לסטות מהם:
• גוף שני רבים תמיד: "אתם/אתן", לא "אתה/את"
• ריבוי תקין: "דקות" לא "דקה", "שעות" לא "שעה", "קילומטרים" לא "קילומטר" (אחרי מספר גדול מ-1)
• אסור מקף ארוך (—)
• שפה תקנית: בדוק כל צורת נטייה לפני שכותב`;

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
${LANG_RULES}
אורך: 110-160 מילים כולל דיסקליימר. CTA עם לינק.
כתוב רק הטקסט הסופי.`;

const pHoliday=(d,c,ne,notes)=>{
  const h=c.holidays.filter(hh=>Math.abs(hh.d-d.getDate())<=10);
  return `אתה קופירייטר בכיר של Ten.
דוגמה: "בדרך לנטיעות עוצרים ב... Ten כמובן!!! ט"ו בשבט הגיע, זה הזמן לצאת לטבע. לפני שאתם נוטעים שורשים בפקקים, עוצרים ב-Ten! 🌳 ממלאים מיכל, מצטיידים בחטיפים, שתייה, קפה ויוצאים לנשום קצת ירוק."
כתוב פוסט חגי לתאריך ${fmt(d)} (${dn(d)}).
חגים: ${h.length?h.map(hh=>hh.n).join(", "):"ללא חג, כתוב על המצב הנוכחי"}
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 80-130 מילים. CTA לתחנה.
כתוב רק הטקסט הסופי.`;
};

const pFun=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמאות: "זה קורה לכולם, נכון?... נכון?? 👀 תייגו חבר/ה שרק נכנסו לתדלק ויצאו עם חצי חנות."
"לפני תדלוק ב-Ten VS אחרי תדלוק ב-Ten. ככה האוטו מרגיש."
כתוב פוסט מצחיק/אפליקציה לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 70-120 מילים. CTA תיוג/תגובה/אפליקציה ${APP_LINK}.
כתוב רק הטקסט הסופי.`;

const pRecruit=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמה: "שנה חדשה, זמן מצוין לעבודה חדשה! מה תקבלו? 🔹 שכר הוגן 🔹 קידום מהיר 🔹 סביבה צעירה 🔹 הטבות דלק וחנות. יש לנו מאצ'? שלחו ווטסאפ למספר ${WHATSAPP} מגיל 18. אתר: ${CAREER_LINK}"
כתוב פוסט דרושים לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 120-150 מילים. פתיחה יצירתית, 4 הטבות עם אמוג'י, CTA ווטסאפ+אתר.
כתוב רק הטקסט הסופי.`;

const pPromo=(pt,m,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמה: "אל תצאו לדרך בלעדיו! 🚫🚗 עכשיו ב-Ten: בוסטר התנעה 12,000 mAh רק ב-279 ש'ח. משלמים באפליקציה? 259 ש'ח! 🤩 ${APP_LINK}. **בתוקף עד [תאריך] או עד גמר המלאי, אין כפל מבצעים."

כתוב פוסט מבצע לחודש ${MHE[m]}.
המבצע: ${pt}
${notes?`הערות: ${notes}`:""}

חוק אבסולוטי: כתוב רק על המוצר/מבצע שצוין לעיל. אסור להמציא פרטים, שימושים, או תכונות שלא נאמרו. אם כתוב "מגבים" כתוב על מגבי שמשה לרכב בלבד. אם כתוב "שמן מנוע" כתוב על שמן מנוע בלבד. אל תנחש ואל תוסיף.
${LANG_RULES}
אורך: 100-150 מילים. פתיחה חזקה, מחיר ברור, לינק אפליקציה, דיסקליימר מלא עם תאריך.
כתוב רק הטקסט הסופי.`;

const LANG_CHECK_PROMPT = (text) => `אתה עורך לשון עברי מדויק. קרא את הטקסט הבא ותקן רק שגיאות דקדוק ונטייה — במיוחד:
• ריבוי אחרי מספר: "20 דקה" → "20 דקות", "5 שעה" → "5 שעות", "3 קילומטר" → "3 קילומטרים"
• גוף שני: אם יש "אתה/את" בפנייה לקהל, שנה לרבים "אתם/אתן"
• כל שגיאת נטייה ברורה אחרת

אל תשנה: סגנון, מבנה משפטים, אמוג'י, קישורים, תוכן.
אם אין שגיאות — החזר את הטקסט כמות שהוא בלי שינוי.
החזר רק את הטקסט המתוקן, בלי הסברים.

טקסט:
${text}`;

async function callAI(prompt, skipCheck=false){
  const r=await fetch("/api/ai",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({prompt})
  });
  if(!r.ok) throw new Error(`API error: ${r.status}`);
  const d=await r.json();
  const text=(d.text||"").trim();
  if(skipCheck || !text) return text;
  // lang check — if it fails, return original text (don't throw)
  try{
    const r2=await fetch("/api/ai",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt:LANG_CHECK_PROMPT(text)})
    });
    if(r2.ok){
      const d2=await r2.json();
      return (d2.text||text).trim();
    }
  } catch(e){}
  return text;
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

/* ─── EXPORT: HTML → opens as Google Doc ─────────────────────────── */
function buildExportHTML(posts, month, year, c){
  const TC = {
    "\u05e9\u05e0\u05d9 \u05d7\u05e1\u05db\u05d5\u05e0\u05d9":              {bg:"#DDEEFF",color:"#1565C0",label:"\u26fd \u05e9\u05e0\u05d9 \u05d7\u05e1\u05db\u05d5\u05e0\u05d9"},
    "\u05d7\u05d2 / \u05d0\u05d9\u05e8\u05d5\u05e2":              {bg:"#DDEECC",color:"#1B5E20",label:"\uD83C\uDF38 \u05d7\u05d2 / \u05d0\u05d9\u05e8\u05d5\u05e2"},
    "\u05de\u05e6\u05d7\u05d9\u05e7 / \u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4":{bg:"#FFEECC",color:"#E65100",label:"\uD83D\uDCF1 \u05de\u05e6\u05d7\u05d9\u05e7 / \u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4"},
    "\u05d3\u05e8\u05d5\u05e9\u05d9\u05dd":                   {bg:"#FFD6D6",color:"#C62828",label:"\uD83D\uDC65 \u05d3\u05e8\u05d5\u05e9\u05d9\u05dd"},
    "\u05e4\u05d5\u05e1\u05d8 \u05de\u05d1\u05e6\u05e2":            {bg:"#FFF3CC",color:"#E65100",label:"\uD83D\uDED2 \u05e4\u05d5\u05e1\u05d8 \u05de\u05d1\u05e6\u05e2"},
  };
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const doneCnt = posts.filter(p=>p.copy).length;
  const BD = "border:1px solid #CFD8DC";
  const CELL = `${BD};padding:8px 12px;font-size:13px;font-family:Arial,sans-serif;background:#FFFFFF`;

  // Summary table rows — plain white, no alternating colours
  const rows = posts.map(p=>{
    const tc = TC[p.type]||{bg:"#F5F5F5",color:"#333",label:p.type};
    const st = p.copy
      ? `<span style="color:#2E7D32;font-weight:700">\u2705 \u05de\u05d5\u05db\u05df</span>`
      : `<span style="color:#C62828;font-weight:700">\u2B55 \u05de\u05de\u05ea\u05d9\u05df</span>`;
    return `<tr>
  <td style="${CELL};text-align:center;font-weight:700;color:#1565C0">${p.num}</td>
  <td style="${CELL};text-align:center">${p.date?fmt(p.date):"\u05dc\u05e4\u05d9 \u05de\u05d1\u05e6\u05e2"}</td>
  <td style="${CELL};text-align:center">${p.date?dn(p.date):""}</td>
  <td style="${BD};padding:8px 12px;font-size:13px;font-family:Arial,sans-serif;background:${tc.bg};color:${tc.color};font-weight:700">${tc.label}</td>
  <td style="${CELL};text-align:center">${st}</td>
</tr>`;
  }).join("\n");

  // Post blocks — each post body is ONE cell with <br> separators, no row-per-line
  const postBlocks = posts.map(p=>{
    const tc = TC[p.type]||{bg:"#F5F5F5",color:"#333",label:p.type};
    if(!p.copy){
      return `<table width="100%" style="border-collapse:collapse;margin-bottom:12px">
  <tr><td style="${BD};padding:12px 16px;font-size:13px;font-family:Arial,sans-serif;background:#FFF9E6">
    <span style="color:#E65100;font-weight:700">${tc.label} \u2014 \u05e4\u05d5\u05e1\u05d8 #${p.num}</span><br>
    <span style="color:#FF8F00;font-style:italic">\u2B55 \u05de\u05de\u05ea\u05d9\u05df \u05dc\u05e4\u05e8\u05d8\u05d9 \u05de\u05d1\u05e6\u05e2 \u05de\u05d4\u05dc\u05e7\u05d5\u05d7</span>
  </td></tr>
</table>`;
    }

    // ALL text in one cell, lines joined with <br> — no borders between lines
    const lines = p.copy.split("\n");
    const bodyHtml = lines.map((line,i)=>{
      if(!line.trim()) return "";
      const isDisc = line.startsWith("*");
      const safe = esc(line);
      if(isDisc)  return `<span style="font-size:11px;color:#90A4AE;font-style:italic">${safe}</span>`;
      if(i===0)   return `<strong style="font-size:14px;color:#1A2733">${safe}</strong>`;
      return `<span style="font-size:13px;color:#333333">${safe}</span>`;
    }).filter(Boolean).join("<br>\n");

    return `<table width="100%" style="border-collapse:collapse;margin-bottom:16px">
  <tr><td style="background:#1565C0;padding:9px 16px;${BD}">
    <span style="color:white;font-weight:900;font-size:15px">#${p.num}&nbsp;&nbsp;</span><span style="background:${tc.bg};color:${tc.color};font-weight:700;font-size:12px;padding:2px 8px">${tc.label}</span>${p.date?`&nbsp;&nbsp;<span style="color:#BDD8FF;font-size:12px">${fmt(p.date)} | ${dn(p.date)}</span>`:""}
  </td></tr>
  <tr><td style="background:#FFFFFF;${BD};padding:14px 18px;font-size:13px;font-family:Arial,sans-serif;line-height:1.85;color:#1A2733">
    ${bodyHtml}
  </td></tr>
</table>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>\u05d2\u05d0\u05e0\u05d8 \u05ea\u05d5\u05db\u05df | \u05d3\u05dc\u05e7 Ten | ${MHE[month]} ${year}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap');
  body{font-family:'Heebo',Arial,sans-serif;direction:rtl;background:#FFFFFF;margin:0;padding:0;color:#1A2733}
  .wrap{max-width:760px;margin:0 auto;padding:32px 24px}
  .section-title{font-size:17px;font-weight:900;color:#1565C0;font-family:'Heebo',Arial,sans-serif;margin:0 0 12px;padding-bottom:5px;border-bottom:2px solid #1565C0}
</style>
</head>
<body dir="rtl">
<div class="wrap">

<!-- COVER -->
<table width="100%" style="border-collapse:collapse;margin-bottom:20px;background:#1565C0">
<tr><td style="padding:28px 24px;text-align:center">
  <div style="font-size:52px;font-weight:900;font-family:'Heebo',Arial,sans-serif;line-height:1;color:white">
    \u05d3\u05dc\u05e7 <span style="color:#FFB3B3">Ten</span>
  </div>
  <div style="color:rgba(255,255,255,0.85);font-size:16px;margin-top:10px;font-family:Arial,sans-serif">
    \u05d2\u05d0\u05e0\u05d8 \u05ea\u05d5\u05db\u05df \u05e1\u05d5\u05e9\u05d9\u05d0\u05dc \u05de\u05d3\u05d9\u05d4 &nbsp;|&nbsp; ${MHE[month]} ${year}
  </div>
  <div style="color:rgba(255,255,255,0.55);font-size:12px;margin-top:6px;font-family:Arial,sans-serif">
    ${doneCnt} \u05e4\u05d5\u05e1\u05d8\u05d9\u05dd \u05de\u05d5\u05db\u05e0\u05d9\u05dd \u05de\u05ea\u05d5\u05da ${posts.length}
  </div>
</td></tr>
</table>

<!-- META -->
<table width="100%" style="border-collapse:collapse;margin-bottom:24px">
<tr><td style="background:#FFF8E1;border:1px solid #FFE082;padding:12px 16px;font-size:13px;font-family:Arial,sans-serif;color:#5D4037;line-height:2">
  📰 <strong>\u05d4\u05e7\u05e9\u05e8 \u05ea\u05e7\u05e9\u05d5\u05e8\u05ea\u05d9:</strong> ${esc(c.news)}<br>
  🌿 <strong>\u05e2\u05d5\u05e0\u05d4:</strong> ${esc(c.season)} &nbsp;|&nbsp; ${esc(c.weather)}<br>
  📅 <strong>\u05d7\u05d2\u05d9\u05dd:</strong> ${c.holidays.map(h=>esc(h.n)).join(", ")||"\u05d0\u05d9\u05df"}
</td></tr>
</table>

<!-- SUMMARY -->
<p class="section-title">📋 \u05e1\u05d9\u05db\u05d5\u05dd \u05d2\u05d0\u05e0\u05d8</p>
<table width="100%" style="border-collapse:collapse;margin-bottom:28px">
  <thead><tr style="background:#1565C0">
    <th style="color:white;padding:9px 12px;font-size:13px;font-family:Arial,sans-serif;text-align:center;border:1px solid #1565C0;width:36px">#</th>
    <th style="color:white;padding:9px 12px;font-size:13px;font-family:Arial,sans-serif;text-align:right;border:1px solid #1565C0">\u05ea\u05d0\u05e8\u05d9\u05da</th>
    <th style="color:white;padding:9px 12px;font-size:13px;font-family:Arial,sans-serif;text-align:right;border:1px solid #1565C0">\u05d9\u05d5\u05dd</th>
    <th style="color:white;padding:9px 12px;font-size:13px;font-family:Arial,sans-serif;text-align:right;border:1px solid #1565C0">\u05e1\u05d5\u05d2 \u05e4\u05d5\u05e1\u05d8</th>
    <th style="color:white;padding:9px 12px;font-size:13px;font-family:Arial,sans-serif;text-align:center;border:1px solid #1565C0">\u05e1\u05d8\u05d0\u05d8\u05d5\u05e1</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>

<!-- POSTS -->
<p class="section-title">📝 \u05e4\u05d5\u05e1\u05d8\u05d9\u05dd \u05de\u05dc\u05d0\u05d9\u05dd</p>
${postBlocks}

<!-- FOOTER -->
<p style="text-align:center;color:#AAAAAA;font-size:11px;font-family:Arial,sans-serif;margin-top:24px;padding-top:12px;border-top:1px solid #EEEEEE">
  \u05d2\u05d0\u05e0\u05d8 \u05ea\u05d5\u05db\u05df | \u05d3\u05dc\u05e7 Ten | ${MHE[month]} ${year}
</p>

</div>
</body>
</html>`;
}

function downloadOrOpenExport(posts, month, year, c){
  const html = buildExportHTML(posts, month, year, c);
  const blob = new Blob([html], {type:"text/html;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `גאנט-Ten-${MHE[month]}-${year}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}



/* ─── EXPORT MODAL ────────────────────────────────────────────────── */
function ExportModal({posts, month, year, c, onClose}){
  const [tab, setTab] = useState("preview");
  const [copied, setCopied] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const textContent = [
    `\u05d2\u05d0\u05e0\u05d8 \u05ea\u05d5\u05db\u05df | \u05d3\u05dc\u05e7 Ten | ${MHE[month]} ${year}`,
    `\u05e2\u05d5\u05e0\u05d4: ${c.season} | ${c.weather}`,
    `\u05d7\u05d2\u05d9\u05dd: ${c.holidays.map(h=>h.n).join(", ")||"\u05d0\u05d9\u05df"}`,
    `\u05d4\u05e7\u05e9\u05e8: ${c.news}`,``,
    `=== \u05e1\u05d9\u05db\u05d5\u05dd ===`,
    ...posts.map(p=>`${p.num}. ${p.date?fmt(p.date):"\u05dc\u05e4\u05d9 \u05de\u05d1\u05e6\u05e2"} | ${p.type} | ${p.copy?"\u2705 \u05de\u05d5\u05db\u05df":"\u2B55 \u05de\u05de\u05ea\u05d9\u05df"}`),
    ``,`=== \u05e4\u05d5\u05e1\u05d8\u05d9\u05dd \u05de\u05dc\u05d0\u05d9\u05dd ===`,``,
    ...posts.map(p=>[
      `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`,
      `\u05e4\u05d5\u05e1\u05d8 #${p.num} | ${p.type}`,
      p.date?`${fmt(p.date)} | ${dn(p.date)}`:"",``,
      p.copy||"[\u05d8\u05e8\u05dd \u05e0\u05d5\u05e6\u05e8]",``
    ].join("\n"))
  ].join("\n");

  function copyAll(){
    navigator.clipboard.writeText(textContent).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); });
  }

  function doExport(){
    downloadOrOpenExport(posts, month, year, c);
    setExportDone(true);
    setTimeout(()=>setExportDone(false),4000);
  }

  const donePosts = posts.filter(p=>p.copy);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:WH,borderRadius:16,width:"100%",maxWidth:800,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",direction:"rtl"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:`linear-gradient(135deg,${BL},#0D47A1)`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{color:WH,fontWeight:900,fontSize:16}}>\uD83D\uDCE4 \u05d9\u05d9\u05e6\u05d5\u05d0 \u05d2\u05d0\u05e0\u05d8 | {MHE[month]} {year}</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:WH,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:700,fontSize:14}}>\u2715</button>
        </div>
        <div style={{background:"#E8F5E9",borderBottom:`1px solid #A5D6A7`,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <span style={{fontSize:22}}>📄</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,color:"#1B5E20",fontSize:14}}>ייצוא לגוגל דוקס / Word</div>
            <div style={{fontSize:12,color:"#388E3C"}}>מוריד קובץ HTML מעוצב — גרור אותו לגוגל דרייב, ייפתח שם כ-Google Doc</div>
          </div>
          <button onClick={doExport}
            style={{background:exportDone?"#4CAF50":"#2E7D32",color:WH,border:"none",borderRadius:10,padding:"10px 22px",cursor:"pointer",fontWeight:800,fontSize:14,whiteSpace:"nowrap",minWidth:160}}>
            {exportDone?"✅ הורד!":"⬇️ הורד ופתח בדוקס"}
          </button>
        </div>
        <div style={{display:"flex",borderBottom:`2px solid ${BR}`,flexShrink:0}}>
          {[["preview","\uD83D\uDC41\uFE0F \u05ea\u05e6\u05d5\u05d2\u05d4 \u05de\u05e7\u05d3\u05d9\u05de\u05d4"],["text","\uD83D\uDCCB \u05d8\u05e7\u05e1\u05d8 \u05d2\u05d5\u05dc\u05de\u05d9"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"11px 20px",border:"none",background:"none",fontWeight:700,fontSize:13,cursor:"pointer",color:tab===id?BL:"#78909C",borderBottom:tab===id?`3px solid ${BL}`:"3px solid transparent",marginBottom:-2}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflow:"auto",padding:20}}>
          {tab==="preview" && (
            <div>
              {donePosts.length===0&&<div style={{textAlign:"center",color:"#90A4AE",padding:40}}>\u05d0\u05d9\u05df \u05e4\u05d5\u05e1\u05d8\u05d9\u05dd \u05de\u05d5\u05db\u05e0\u05d9\u05dd \u05e2\u05d3\u05d9\u05d9\u05df</div>}
              {donePosts.map(p=>(
                <div key={p.id} style={{background:WH,borderRadius:12,border:`1px solid ${BR}`,marginBottom:14,overflow:"hidden"}}>
                  <div style={{padding:"10px 16px",background:"#F0F7FF",borderBottom:`1px solid ${BR}`,display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontWeight:900,color:BL,fontSize:14}}>#{p.num}</span>
                    <span style={{fontWeight:700,fontSize:13}}>{p.date?`${fmt(p.date)} | ${dn(p.date)}`:"\u05dc\u05e4\u05d9 \u05de\u05d1\u05e6\u05e2"}</span>
                    <Badge type={p.type}/>
                    <button onClick={()=>navigator.clipboard.writeText(p.copy)} style={{marginRight:"auto",background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:6,padding:"2px 9px",cursor:"pointer",fontSize:11,fontWeight:700}}>\uD83D\uDCCB \u05d4\u05e2\u05ea\u05e7</button>
                  </div>
                  <div style={{padding:"14px 16px",fontSize:14,lineHeight:1.9,whiteSpace:"pre-wrap",color:DK}}>{p.copy}</div>
                </div>
              ))}
            </div>
          )}
          {tab==="text"&&(
            <div>
              <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
                <span style={{fontSize:12,color:"#546E7A",flex:1}}>\u05dc\u05d2\u05d5\u05d2\u05dc \u05d3\u05d5\u05e7\u05e1 \u05d9\u05d3\u05e0\u05d9: \u05d4\u05e2\u05ea\u05e7 \u05d4\u05db\u05dc \u2190 \u05e4\u05ea\u05d7 \u05d2\u05d5\u05d2\u05dc \u05d3\u05d5\u05e7\u05e1 \u2190 Ctrl+V</span>
                <button onClick={copyAll} style={{background:copied?"#4CAF50":BL,color:WH,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontWeight:800,fontSize:13,transition:"background 0.3s",whiteSpace:"nowrap"}}>
                  {copied?"\u2705 \u05d4\u05d5\u05e2\u05ea\u05e7!":"\uD83D\uDCCB \u05d4\u05e2\u05ea\u05e7 \u05d4\u05db\u05dc"}
                </button>
              </div>
              <pre style={{background:"#F8FAFB",border:`1px solid ${BR}`,borderRadius:10,padding:16,fontSize:12,lineHeight:1.8,whiteSpace:"pre-wrap",direction:"rtl",fontFamily:"Arial,sans-serif",maxHeight:400,overflow:"auto",color:DK}}>{textContent}</pre>
            </div>
          )}
        </div>
        <div style={{borderTop:`1px solid ${BR}`,padding:"10px 20px",background:"#FAFBFC",flexShrink:0,fontSize:11,color:"#78909C",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>{donePosts.length} \u05e4\u05d5\u05e1\u05d8\u05d9\u05dd \u05de\u05d5\u05db\u05e0\u05d9\u05dd \u05de\u05ea\u05d5\u05da {posts.length}</span>
          <span>\u05d4\u05d5\u05e8\u05d3 DOCX \u2190 \u05e4\u05ea\u05d7 \u05d1-Word / Google Drive / \u05e9\u05dc\u05d7 \u05dc\u05dc\u05e7\u05d5\u05d7</span>
        </div>
      </div>
    </div>
  );
}

/* ─── POST CARD ───────────────────────────────────────────────────── */
function PostCard({post, c, month, ne, onUpdate, isClient=false}){
  const [open, setOpen] = useState(true); // always open by default
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(post.copy||"");
  const [notes, setNotes] = useState("");
  const [promoIn, setPromoIn] = useState(post.promoText||"");
  const [loading, setLoading] = useState(false);
  const [valResult, setValResult] = useState(post.val||"");
  const [valLoading, setValLoading] = useState(false);
  const [imgData, setImgData] = useState(post.image||null); // base64 image

  // sync editVal when post.copy changes externally
  useEffect(()=>{ setEditVal(post.copy||""); },[post.copy]);

  const status = post.copy ? "done" : post.tk==="promo"&&!post.promoText ? "empty" : "wait";

  async function gen(n){
    if(isClient) return; // clients cannot regenerate
    setLoading(true);
    let p="";
    if(post.tk==="monday")       p=pMonday(post.date,c,ne,n||notes);
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
    if(isClient) return;
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

  function handleImageUpload(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const data = ev.target.result;
      setImgData(data);
      onUpdate({...post, image: data});
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{background:WH,borderRadius:12,border:`1px solid ${BR}`,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",direction:"rtl"}}>
      {/* Header - always visible */}
      <div style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:9,
        background:status==="done"?"#F9FFFE":status==="empty"?"#FFF8F8":"#FAFBFC"}}>
        <span style={{fontWeight:800,color:BL,fontSize:13,minWidth:24}}>#{post.num}</span>
        <span style={{fontWeight:700,color:DK,fontSize:13}}>{post.date?`${fmt(post.date)} | ${dn(post.date)}`:"תאריך לפי מבצע"}</span>
        <Badge type={post.type}/>
        <span style={{marginRight:"auto",fontSize:11,fontWeight:800,
          color:status==="done"?"#4CAF50":status==="empty"?"#E53935":"#FF9800"}}>
          {status==="done"?"✅ מוכן":status==="empty"?"⭕ ממתין למבצע":"⏳"}
        </span>
        {loading && <span style={{fontSize:11,color:BL,fontWeight:700}}>מייצר...</span>}
      </div>

      {/* Body - always open */}
      <div style={{borderTop:`1px solid ${BR}`}}>
        {/* PROMO section */}
        {post.tk==="promo" && (
          <div style={{padding:"10px 16px",background:"#FFFDE7",borderBottom:`1px solid ${BR}`}}>
            <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:5}}>📦 פרטי המבצע</div>
            {isClient ? (
              // Client: only fill promo details, no generate button
              <input value={promoIn} onChange={e=>{ setPromoIn(e.target.value); onUpdate({...post,promoText:e.target.value}); }}
                placeholder="פרטי המבצע — מוצר, מחיר, תוקף..."
                style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:13,fontFamily:"Arial",boxSizing:"border-box"}}/>
            ) : (
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
            )}
          </div>
        )}

        {post.copy ? (
          <div style={{display:"grid",gridTemplateColumns:isClient?"1fr":"1fr 240px"}}>
            <div style={{padding:"14px 18px",borderLeft:isClient?"none":`1px solid ${BR}`}}>
              <div style={{fontSize:13.5,lineHeight:1.8,color:DK,whiteSpace:"pre-wrap",background:"#FAFBFC",padding:"10px 13px",borderRadius:8,border:`1px solid ${BR}`,minHeight:100}}>
                {post.copy}
              </div>
              {/* Manager-only tools */}
              {!isClient && (
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                  <input value={notes} onChange={e=>setNotes(e.target.value)}
                    placeholder="הערה לייצור מחדש..."
                    style={{flex:1,minWidth:130,padding:"5px 9px",borderRadius:7,border:`1px solid ${BR}`,fontSize:11,fontFamily:"Arial"}}/>
                  <button onClick={()=>gen(notes)} disabled={loading}
                    style={{background:RD,color:WH,border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700,opacity:loading?0.5:1}}>
                    {loading?"...":"↺ מחדש"}
                  </button>
                  <button onClick={()=>{ if(editing){ setEditing(false); onUpdate({...post,copy:editVal}); } else { setEditing(true); } }}
                    style={{background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                    {editing?"💾 שמור":"✏️ ערוך"}
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
              )}
              {!isClient && editing && (
                <textarea value={editVal} onChange={e=>setEditVal(e.target.value)}
                  style={{width:"100%",height:180,padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:13,lineHeight:1.75,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial",direction:"rtl",marginTop:8}}/>
              )}
              {!isClient && valResult && (
                <div style={{marginTop:8,background:"#F3E5F5",border:"1px solid #CE93D8",borderRadius:8,padding:"9px 12px",fontSize:11.5,lineHeight:1.7,color:"#4A148C",whiteSpace:"pre-wrap"}}>
                  {valResult}
                </div>
              )}
            </div>
            {/* Image panel - manager only */}
            {!isClient && (
              <div style={{padding:"14px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,background:"#F0F4F8"}}>
                <span style={{fontSize:11,fontWeight:800,color:RD,alignSelf:"flex-start"}}>🖼️ תמונה לפוסט</span>
                {imgData ? (
                  <div style={{position:"relative",width:"100%"}}>
                    <img src={imgData} alt="post" style={{width:"100%",borderRadius:10,display:"block",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}/>
                    <button onClick={()=>{ setImgData(null); onUpdate({...post,image:null}); }}
                      style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.55)",color:WH,border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      ×
                    </button>
                  </div>
                ) : (
                  <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",minHeight:140,border:"2px dashed #90A4AE",borderRadius:10,cursor:"pointer",gap:8,background:"white",transition:"border-color 0.2s"}}
                    onDragOver={e=>e.preventDefault()}>
                    <span style={{fontSize:28}}>📤</span>
                    <span style={{fontSize:11,color:"#78909C",textAlign:"center",fontWeight:600}}>העלה תמונה מעוצבת<br/><span style={{color:"#B0BEC5",fontWeight:400}}>לחץ או גרור לכאן</span></span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{display:"none"}}/>
                  </label>
                )}
              </div>
            )}
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
    </div>
  );
}

/* ─── CLIENT POST ROW (approval + note per post, send all at end) ── */
function ClientPostRow({post, feedback, onChange}){
  // feedback = { approved: bool, note: string, promoText: string }
  const fb = feedback || {approved:false, note:"", promoText: post.promoText||""};

  return (
    <div style={{background:WH,borderRadius:12,border:`1px solid ${fb.approved?"#A5D6A7":"#CFD8DC"}`,
      marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",direction:"rtl",
      borderRight:`4px solid ${fb.approved?"#4CAF50":"#CFD8DC"}`}}>
      {/* Header */}
      <div style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:9,
        background:fb.approved?"#F1F8E9":"#FAFBFC"}}>
        <span style={{fontWeight:800,color:BL,fontSize:13,minWidth:24}}>#{post.num}</span>
        <span style={{fontWeight:700,color:"#37474F",fontSize:13}}>
          {post.date?`${fmt(post.date)} | ${dn(post.date)}`:"תאריך לפי מבצע"}
        </span>
        <Badge type={post.type}/>
        <div style={{marginRight:"auto"}}>
          <button onClick={()=>onChange({...fb,approved:!fb.approved})}
            style={{background:fb.approved?"#4CAF50":"white",color:fb.approved?"white":"#4CAF50",
              border:"2px solid #4CAF50",borderRadius:7,padding:"4px 14px",cursor:"pointer",fontSize:12,fontWeight:800}}>
            {fb.approved?"✅ מאושר":"אישור"}
          </button>
        </div>
      </div>

      {/* Image - if uploaded by designer */}
      {post.image && (
        <div style={{padding:"10px 16px",borderTop:"1px solid #ECEFF1"}}>
          <img src={post.image} alt="פוסט" style={{width:"100%",borderRadius:10,display:"block"}}/>
        </div>
      )}
      {/* Post text */}
      {post.copy && (
        <div style={{padding:"10px 16px",fontSize:13,lineHeight:1.8,color:"#37474F",
          whiteSpace:"pre-wrap",background:"#FAFBFC",borderTop:"1px solid #ECEFF1"}}>
          {post.copy}
        </div>
      )}

      {/* Promo input for client */}
      {post.tk==="promo" && (
        <div style={{padding:"10px 16px",background:"#FFFDE7",borderTop:"1px solid #FFE082"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:5}}>📦 פרטי המבצע</div>
          <input value={fb.promoText||""} onChange={e=>onChange({...fb,promoText:e.target.value})}
            placeholder="פרטי המבצע — מוצר, מחיר, תוקף..."
            style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #FFE082",
              fontSize:13,fontFamily:"Arial",boxSizing:"border-box"}}/>
        </div>
      )}

      {/* Note field - always visible */}
      {post.copy && (
        <div style={{padding:"8px 16px 12px",borderTop:"1px solid #ECEFF1"}}>
          <textarea value={fb.note||""} onChange={e=>onChange({...fb,note:e.target.value})}
            placeholder="הערה לצוות (אופציונלי)..."
            style={{width:"100%",height:52,padding:"7px 10px",borderRadius:7,
              border:"1px solid #CFD8DC",fontSize:12,resize:"vertical",
              boxSizing:"border-box",fontFamily:"Arial",background:"#FAFBFC"}}/>
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
  const [phase, setPhase] = useState("client-select"); // client-select | setup | list | gantt
  const [posts, setPosts] = useState([]);
  const [progress, setProgress] = useState({done:0,total:0});
  const [ne, setNe] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "saving" | "saved" | "loaded" | ""
  const [storageLoading, setStorageLoading] = useState(true);
  const [clients, setClients] = useState(loadClients);
  const [activeClient, setActiveClient] = useState(()=>loadClients()[0]);
  const [clients, setClients] = useState(loadClients);
  const [activeClient, setActiveClient] = useState(()=>loadClients()[0]||DEFAULT_CLIENTS[0]);
  const [savedGantts, setSavedGantts] = useState([]);
  const [shareId, setShareId] = useState(null);      // current gantt's share ID
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isClientView, setIsClientView] = useState(false);
  const [clientComments, setClientComments] = useState([]);
  const [clientFeedback, setClientFeedback] = useState({}); // {postId: {approved, note, promoText}}
  const [clientName, setClientName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const c = getCtx(month);
  const AUTO = ["monday","holiday","fun","recruit"];
  const doneCount = posts.filter(p=>p.copy).length;
  const autoTotal = posts.filter(p=>AUTO.includes(p.tk)).length;
  const isDone = progress.done >= autoTotal && autoTotal > 0;
  const pct = autoTotal > 0 ? Math.round((progress.done/autoTotal)*100) : 0;

  /* ── CHECK if opened as client view (URL has ?gantt=ID) ── */
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const gid = params.get("gantt");
    if(gid){
      setIsClientView(true);
      setShareId(gid);
      // load from supabase
      loadGanttFromSupabase(gid).then(data=>{
        if(data){
          setYear(data.year);
          setMonth(data.month);
          setNe(data.ne||"");
          setPosts(deserializePosts(data.posts));
          setPhase("gantt");
        }
        setStorageLoading(false);
      });
      // load comments
      getComments(gid).then(setClientComments);
    }
  },[]);

  /* ── LOAD saved state on mount ── */
  useEffect(()=>{
    async function load(){
      try {
        // Load list of saved gantts
        const list = listSavedGantts();
        setSavedGantts(list);
        // Migrate legacy single-gantt if exists
        const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if(legacy && legacy.posts && legacy.posts.length > 0){
          saveGanttToStorage(legacy.year||now.getFullYear(), legacy.month||now.getMonth()+1, legacy.ne||"", deserializePosts(legacy.posts));
          localStorage.removeItem(STORAGE_KEY);
          setSavedGantts(listSavedGantts());
        }
      } catch(e){}
      setStorageLoading(false);
    }
    load();
  },[]);

  /* ── SAVE whenever posts change ── */
  useEffect(()=>{
    if(posts.length === 0 || storageLoading) return;
    setSaveStatus("saving");
    const timer = setTimeout(()=>{
      try {
        saveGanttToStorage(year, month, ne, posts);
        setSavedGantts(listSavedGantts());
        setSaveStatus("saved");
        setTimeout(()=>setSaveStatus(""),2500);
      } catch(e){ setSaveStatus(""); }
    }, 800);
    return ()=>clearTimeout(timer);
  },[posts, year, month, ne]);

  function upd(updated){
    setPosts(prev=>prev.map(p=>p.id===updated.id?updated:p));
  }

  function loadGantt(g){
    const data = loadGanttFromStorage(g.year, g.month);
    if(!data) return;
    setYear(data.year);
    setMonth(data.month);
    setNe(data.ne||"");
    setPosts(deserializePosts(data.posts));
    setPhase("gantt");
    setSaveStatus("loaded");
    setTimeout(()=>setSaveStatus(""),3000);
  }

  function deleteGantt(g){
    deleteGanttFromStorage(g.year, g.month);
    setSavedGantts(listSavedGantts());
  }

  async function sendClientFeedback(){
    setSending(true);
    try {
      const approved = posts.filter(p=>clientFeedback[p.id]?.approved).map(p=>p.type);
      const notes = posts.filter(p=>clientFeedback[p.id]?.note).map(p=>({type:p.type, note:clientFeedback[p.id].note}));
      const promos = posts.filter(p=>p.tk==="promo"&&clientFeedback[p.id]?.promoText).map(p=>({num:p.num, text:clientFeedback[p.id].promoText}));
      const summaryParts = [];
      if(clientName) summaryParts.push("מאת: " + clientName);
      summaryParts.push("\n✅ פוסטים מאושרים (" + approved.length + "/" + posts.length + "):\n" + (approved.join(", ")||"אין"));
      if(notes.length) summaryParts.push("\n✏️ הערות:\n" + notes.map(n=>"• " + n.type + ": " + n.note).join("\n"));
      if(promos.length) summaryParts.push("\n📦 מבצעים:\n" + promos.map(p=>"• פוסט " + p.num + ": " + p.text).join("\n"));
      const summary = summaryParts.join("\n");
      // Save to Supabase
      if(shareId) {
        await addComment(shareId, "summary", "סיכום", summary, clientName, window.location.href);
      }
      // Send email directly via notify API
      await fetch("/api/notify", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          gantt_id: shareId||"unknown",
          post_type: "סיכום פידבק",
          comment: summary,
          author_name: clientName||"לקוח",
          gantt_url: window.location.href
        })
      });
      setSent(true);
    } catch(e){ console.error(e); }
    setSending(false);
  }

  async function shareGantt(){
    setShareLoading(true);
    try {
      const id = shareId || makeShareId(year, month);
      const ok = await saveGanttToSupabase(id, year, month, ne, posts);
      if(ok){
        setShareId(id);
        // save shareId locally too
        saveGanttToStorage(year, month, ne, posts);
        setSavedGantts(listSavedGantts());
      }
    } catch(e){}
    setShareLoading(false);
  }

  function copyShareLink(){
    const url = `${window.location.origin}?gantt=${shareId}`;
    navigator.clipboard.writeText(url).then(()=>{
      setShareCopied(true);
      setTimeout(()=>setShareCopied(false), 3000);
    });
  }

  async function runAuto(arr){
    const auto = arr.filter(p=>AUTO.includes(p.tk));
    setProgress({done:0,total:auto.length});
    for(const post of auto){
      let prompt="";
      const localCtx = getCtx(month);
      if(post.tk==="monday")       prompt=pMonday(post.date,localCtx,ne,"");
      else if(post.tk==="holiday") prompt=pHoliday(post.date,localCtx,ne,"");
      else if(post.tk==="fun")     prompt=pFun(post.date,localCtx,ne,"");
      else if(post.tk==="recruit") prompt=pRecruit(post.date,localCtx,ne,"");
      // try up to 2 times — never let one failure stop the whole run
      let copy = "";
      for(let attempt=0; attempt<2; attempt++){
        try{
          copy = await callAI(prompt);
          if(copy) break;
        } catch(e){
          if(attempt===0) await new Promise(r=>setTimeout(r,1500));
        }
      }
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
    deleteGanttFromStorage(year, month);
    setSavedGantts(listSavedGantts());
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

  /* ── SAVED GANTTS LIST ── */
  if(phase==="list") return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:WH,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:BL,fontWeight:900,fontSize:17}}>1</span><span style={{color:RD,fontWeight:900,fontSize:17}}>0</span>
          </div>
          <div style={{color:WH,fontSize:17,fontWeight:900}}>גאנטים שמורים</div>
        </div>
        <button onClick={()=>setPhase("setup")}
          style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:WH,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:700}}>
          ＋ גאנט חדש
        </button>
      </div>

      <div style={{maxWidth:600,margin:"28px auto",padding:"0 16px"}}>
        {savedGantts.length === 0 ? (
          <div style={{background:WH,borderRadius:16,padding:40,textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:48,marginBottom:12}}>📭</div>
            <div style={{color:DK,fontWeight:700,fontSize:16,marginBottom:8}}>אין גאנטים שמורים עדיין</div>
            <div style={{color:"#78909C",fontSize:13,marginBottom:20}}>צור גאנט חדש כדי להתחיל</div>
            <button onClick={()=>setPhase("setup")}
              style={{background:BL,color:WH,border:"none",borderRadius:10,padding:"12px 28px",fontSize:15,fontWeight:800,cursor:"pointer"}}>
              ＋ צור גאנט חדש
            </button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:13,color:"#78909C",marginBottom:4}}>{savedGantts.length} גאנטים שמורים בדפדפן</div>
            {savedGantts.map(g=>(
              <div key={`${g.year}-${g.month}`} style={{background:WH,borderRadius:12,padding:"16px 20px",boxShadow:"0 2px 10px rgba(0,0,0,0.07)",border:`1px solid ${BR}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:900,color:BL,fontSize:17}}>{MHE[g.month]} {g.year}</div>
                  <div style={{fontSize:12,color:"#78909C",marginTop:3}}>
                    {getCtx(g.month).emoji} {getCtx(g.month).season} •
                    {g.doneCount>0 ? ` ${g.doneCount} פוסטים מוכנים` : " טרם הושלם"} •
                    נשמר {new Date(g.savedAt).toLocaleDateString("he-IL")}
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>loadGantt(g)}
                    style={{background:BL,color:WH,border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:800}}>
                    📂 פתח
                  </button>
                  <button onClick={()=>{ if(window.confirm(`למחוק את גאנט ${MHE[g.month]} ${g.year}?`)) deleteGantt(g); }}
                    style={{background:"#FFEBEE",color:RD,border:`1px solid #FFCDD2`,borderRadius:8,padding:"9px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <button onClick={()=>setPhase("setup")}
              style={{background:WH,color:BL,border:`2px solid ${BL}`,borderRadius:10,padding:"13px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4}}>
              ＋ צור גאנט חדש
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ── SETUP ── */
  /* ── CLIENT SELECT SCREEN ── */
  if(phase==="client-select") {
    const [showAdd, setShowAdd] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [newColor, setNewColor] = React.useState("#1565C0");
    function addClient(){
      if(!newName.trim()) return;
      const nc={id:"c-"+Date.now(),name:newName.trim(),logo:null,color:newColor};
      const updated=[...clients,nc];
      setClients(updated); saveClients(updated);
      setNewName(""); setNewColor("#1565C0"); setShowAdd(false);
    }
    return (
      <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{background:WH,borderRadius:20,padding:36,boxShadow:"0 8px 40px rgba(0,0,0,0.12)",maxWidth:460,width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontSize:40,marginBottom:8}}>📋</div>
            <div style={{fontSize:22,fontWeight:900,color:DK}}>בחר לקוח</div>
            <div style={{fontSize:13,color:"#78909C",marginTop:4}}>בחר לקוח ליצירת גאנט</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
            {clients.map(cl=>(
              <button key={cl.id} onClick={()=>{setActiveClient(cl);setPhase("setup");}}
                style={{display:"flex",alignItems:"center",gap:14,background:"#F8FAFF",border:`2px solid ${cl.color||BL}`,borderRadius:14,padding:"14px 18px",cursor:"pointer",textAlign:"right"}}>
                {cl.logo
                  ? <img src={cl.logo} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",flexShrink:0}} alt={cl.name}/>
                  : <div style={{width:48,height:48,borderRadius:"50%",background:cl.color||BL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{color:"white",fontWeight:900,fontSize:22}}>{cl.name[0]}</span>
                    </div>
                }
                <div style={{flex:1,fontWeight:800,fontSize:16,color:DK}}>{cl.name}</div>
                <span style={{color:cl.color||BL,fontWeight:700,fontSize:20}}>←</span>
              </button>
            ))}
          </div>
          {showAdd ? (
            <div style={{background:"#F8FAFF",borderRadius:12,padding:18,border:`1px solid ${BR}`}}>
              <div style={{fontWeight:700,fontSize:14,color:DK,marginBottom:12}}>לקוח חדש</div>
              <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="שם הלקוח"
                style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${BR}`,fontSize:14,fontFamily:"Arial",boxSizing:"border-box",marginBottom:10}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <label style={{fontSize:13,color:"#78909C"}}>צבע:</label>
                <input type="color" value={newColor} onChange={e=>setNewColor(e.target.value)} style={{width:40,height:32,border:"none",borderRadius:6,cursor:"pointer"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={addClient} disabled={!newName.trim()} style={{flex:1,background:BL,color:WH,border:"none",borderRadius:8,padding:"9px 0",fontWeight:800,fontSize:14,cursor:"pointer",opacity:newName.trim()?1:0.5}}>➕ הוסף</button>
                <button onClick={()=>setShowAdd(false)} style={{background:"none",border:`1px solid ${BR}`,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:14}}>ביטול</button>
              </div>
            </div>
          ) : (
            <button onClick={()=>setShowAdd(true)} style={{width:"100%",background:"none",border:`2px dashed ${BR}`,borderRadius:14,padding:"13px 0",cursor:"pointer",color:"#78909C",fontSize:14,fontWeight:700}}>
              ➕ הוסף לקוח חדש
            </button>
          )}
        </div>
      </div>
    );
  }

  if(phase==="setup") return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={activeClient?.logo||""} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",boxShadow:"0 3px 12px rgba(0,0,0,0.2)",background:WH,cursor:"pointer"}} onClick={()=>setPhase("client-select")} alt="logo"/>
          <div>
            <div style={{color:WH,fontSize:20,fontWeight:900}}>גאנט AI | {activeClient?.name||"לקוח"}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>9 פוסטים חודשיים | שמירה אוטומטית | ייצוא קל</div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,marginTop:2}}>{APP_VERSION}</div>
          </div>
        </div>
        {savedGantts.length > 0 && (
          <button onClick={()=>setPhase("list")}
            style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",color:WH,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            📂 גאנטים שמורים <span style={{background:RD,borderRadius:"50%",width:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900}}>{savedGantts.length}</span>
          </button>
        )}
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

      {isClientView && (
        <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"18px 24px",display:"flex",alignItems:"center",gap:16}}>
          <img src={LOGO_SRC} style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",background:WH,flexShrink:0}} alt="logo"/>
          <div style={{flex:1}}>
            <div style={{color:WH,fontSize:18,fontWeight:900}}>גאנט {MHE[month]} {year} — דלק Ten</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,marginTop:2}}>עברו על הפוסטים, אשרו או הוסיפו הערות, ולחצו שלח בסוף</div>
          </div>
        </div>
      )}

      <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <img src={activeClient?.logo||""} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",background:WH,cursor:"pointer"}} onClick={()=>setPhase("client-select")} alt="logo"/>
          <div>
            <div style={{color:WH,fontSize:17,fontWeight:900}}>גאנט {MHE[month]} {year} — {activeClient?.name||"לקוח"}</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,display:"flex",alignItems:"center",gap:8}}>
              <span>{c.emoji} {c.season} | {doneCount}/{posts.length} מוכנים | {APP_VERSION}</span>
              {saveStatus==="saving" && <span style={{background:"rgba(255,255,255,0.15)",padding:"1px 8px",borderRadius:10,fontSize:10}}>💾 שומר...</span>}
              {saveStatus==="saved"  && <span style={{background:"rgba(76,175,80,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>✅ נשמר</span>}
              {saveStatus==="loaded" && <span style={{background:"rgba(255,193,7,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>📂 נטען מהשמירה</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={()=>setShowExport(true)}
            style={{background:"#4CAF50",color:WH,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:800}}>
            📤 ייצוא
          </button>
          {!isClientView && (
            !shareId ? (
              <button onClick={shareGantt} disabled={shareLoading}
                style={{background:"#FF6F00",color:WH,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:800,opacity:shareLoading?0.7:1}}>
                {shareLoading?"⏳ שומר...":"🔗 שתף ללקוח"}
              </button>
            ) : (
              <button onClick={copyShareLink}
                style={{background:shareCopied?"#388E3C":"#FF6F00",color:WH,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:800}}>
                {shareCopied?"✅ הועתק!":"🔗 העתק לינק ללקוח"}
              </button>
            )
          )}
          <button onClick={()=>setPhase("list")}
            style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:WH,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>
            📂 גאנטים שמורים
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
        {isClientView ? (
            // ── CLIENT VIEW: approval + notes per post, one send at end ──
            <>
              <div style={{background:"white",borderRadius:10,padding:"12px 16px",marginBottom:14,fontSize:13,color:"#37474F",border:"1px solid #CFD8DC"}}>
                <strong>איך זה עובד:</strong> עבור כל פוסט — לחץ ✅ מאושר או ✏️ יש הערה. בסוף לחץ <strong>שלח</strong>.
              </div>
              <input value={clientName} onChange={e=>setClientName(e.target.value)}
                placeholder="שמך (אופציונלי)"
                style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #CFD8DC",fontSize:13,marginBottom:12,boxSizing:"border-box",fontFamily:"Arial"}}/>
              {posts.map(p=>(
                <ClientPostRow key={p.id} post={p}
                  feedback={clientFeedback[p.id]}
                  onChange={fb=>setClientFeedback(prev=>({...prev,[p.id]:fb}))}/>
              ))}
              {sent ? (
                <div style={{background:"#E8F5E9",border:"1px solid #A5D6A7",borderRadius:12,padding:"20px",textAlign:"center",marginTop:8}}>
                  <div style={{fontSize:28,marginBottom:8}}>🎉</div>
                  <div style={{fontWeight:800,color:"#1B5E20",fontSize:16}}>הפידבק נשלח בהצלחה!</div>
                  <div style={{color:"#388E3C",fontSize:13,marginTop:4}}>הצוות יקבל את ההערות שלך בקרוב</div>
                </div>
              ) : (
                <button onClick={sendClientFeedback} disabled={sending}
                  style={{width:"100%",background:BL,color:WH,border:"none",borderRadius:10,
                    padding:"15px 0",fontSize:16,fontWeight:900,cursor:"pointer",marginTop:8,
                    boxShadow:`0 4px 16px ${BL}55`,opacity:sending?0.7:1}}>
                  {sending?"⏳ שולח...":"📨 שלח פידבק לצוות"}
                </button>
              )}
            </>
          ) : (
            // ── MANAGER VIEW: full PostCard with all tools ──
            posts.map(p=>(
              <PostCard key={p.id} post={p} c={c} month={month} ne={ne} onUpdate={upd} isClient={false}/>
            ))
          )}

        <div style={{background:"#E8EAF6",borderRadius:10,padding:"13px 18px",fontSize:12,color:"#283593",border:"1px solid #9FA8DA",marginTop:6,lineHeight:1.8}}>
          <strong>📤 איך לשתף ללקוח:</strong><br/>
          לחץ <strong>"ייצוא ושיתוף"</strong> ← בחר <strong>"תצוגה מקדימה"</strong> לראות איך הלקוח יראה<br/>
          או <strong>"טקסט להעתקה"</strong> ← לחץ <strong>"העתק הכל"</strong> ← הדבק בגוגל דוקס / מייל / וואטסאפ
        </div>
      </div>
    </div>
  );
}
