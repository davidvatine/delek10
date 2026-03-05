import { useState, useEffect } from "react";

/* ─── COLORS ──────────────────────────────────────────────────────── */
const BL="#1565C0", BLl="#42A5F5", RD="#D32F2F", WH="#FFFFFF", BG="#F0F4F8", BR="#E0E7EF", DK="#1A2733";
const DV_PURPLE="#4A1D96";
const DV_GRAD="linear-gradient(135deg,#4A1D96 0%,#6D28D9 100%)";
const DV_GRAD2="linear-gradient(135deg,#6D28D9 0%,#7C3AED 100%)";

const DAVID_LOGO=`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'><rect width='120' height='40' rx='8' fill='%234A1D96'/><text x='60' y='27' text-anchor='middle' font-family='Arial Black,Arial' font-weight='900' font-size='14' fill='white'>DAVID VATINE</text></svg>`;

const APP_VERSION="v7.0";
const APP_LINK="https://onelink.to/ten";
const CAREER_LINK="https://ten.co.il/career";
const WHATSAPP="050-0000000";
const DISC=`*בתוקף עד [תאריך] או עד גמר המלאי, בתנאי התחנה, אין כפל מבצעים.`;

const MHE=["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DHE=["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

const DEFAULT_CLIENTS=[{id:"delek-ten",name:"דלק Ten",logo:null,color:BL}];

function loadClients(){try{const s=localStorage.getItem("dv_clients");return s?JSON.parse(s):DEFAULT_CLIENTS;}catch(e){return DEFAULT_CLIENTS;}}
function saveClients(cl){try{localStorage.setItem("dv_clients",JSON.stringify(cl));}catch(e){}}

const STORAGE_KEY="tenGanttState";
const GANTT_LIST_KEY="tenGanttList";
const ganttKey=(year,month)=>`tenGantt_${year}_${month}`;

const SUPABASE_URL="https://hlqzioizjmzfxivpgqma.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscXppb2l6am16Znh…";

function makeShareId(year,month){return `gantt-${year}-${String(month).padStart(2,"0")}-${Math.random().toString(36).slice(2,6)}`;}

async function saveGanttToSupabase(id,year,month,ne,posts){
  try{
    const res=await fetch(`${SUPABASE_URL}/rest/v1/gantts`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"resolution=merge-duplicates"},body:JSON.stringify({id,year,month,ne,posts:serializePosts(posts),updated_at:new Date().toISOString()})});
    return res.ok||res.status===409;
  }catch(e){return false;}
}

async function loadGanttFromSupabase(id){
  try{
    const res=await fetch(`${SUPABASE_URL}/rest/v1/gantts?id=eq.${id}&select=*`,{headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}});
    if(!res.ok)return null;
    const data=await res.json();return data[0]||null;
  }catch(e){return null;}
}

async function addComment(ganttId,postId,postType,comment,authorName,ganttUrl){
  try{await fetch(`${SUPABASE_URL}/rest/v1/comments`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`},body:JSON.stringify({gantt_id:ganttId,post_id:postId,post_type:postType,comment,author_name:authorName||"לקוח",gantt_url:ganttUrl,created_at:new Date().toISOString()})});}catch(e){}
}

async function getComments(ganttId){
  try{const res=await fetch(`${SUPABASE_URL}/rest/v1/comments?gantt_id=eq.${ganttId}&select=*&order=created_at.desc`,{headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}});if(!res.ok)return[];return await res.json();}catch(e){return[];}
}

function listSavedGantts(){try{const list=JSON.parse(localStorage.getItem(GANTT_LIST_KEY)||"[]");return list.sort((a,b)=>b.year*100+b.month-(a.year*100+a.month));}catch(e){return[];}}
function saveGanttToStorage(year,month,ne,posts){
  try{
    const key=ganttKey(year,month);
    const data={year,month,ne,posts:serializePosts(posts),savedAt:new Date().toISOString(),doneCount:posts.filter(p=>p.copy).length};
    localStorage.setItem(key,JSON.stringify(data));
    const list=listSavedGantts().filter(g=>!(g.year===year&&g.month===month));
    list.push({year,month,savedAt:data.savedAt,doneCount:data.doneCount});
    localStorage.setItem(GANTT_LIST_KEY,JSON.stringify(list));
  }catch(e){}
}
function loadGanttFromStorage(year,month){try{return JSON.parse(localStorage.getItem(ganttKey(year,month))||"null");}catch(e){return null;}}
function deleteGanttFromStorage(year,month){
  try{localStorage.removeItem(ganttKey(year,month));const list=listSavedGantts().filter(g=>!(g.year===year&&g.month===month));localStorage.setItem(GANTT_LIST_KEY,JSON.stringify(list));}catch(e){}
}

const MD={
  1:{season:"חורף",emoji:"❄️",weather:"קר וגשום",holidays:[{n:"ראש השנה האזרחית",d:1},{n:"טו בשבט",d:13}],news:"פתיחת שנה, הבטחות ורזולוציות"},
  2:{season:"חורף",emoji:"🌧️",weather:"קר וגשום",holidays:[{n:"פורים",d:13}],news:"פורים בפתח, חיסכון בעלויות"},
  3:{season:"אביב",emoji:"🌸",weather:"נעים ומתחמם",holidays:[{n:"פסח",d:12}],news:"פסח וחג האביב, יציאה לדרך"},
  4:{season:"אביב",emoji:"🌼",weather:"נעים",holidays:[{n:"יום הזיכרון",d:21},{n:"יום העצמאות",d:22}],news:"ימי הזיכרון ועצמאות"},
  5:{season:"אביב",emoji:"🌺",weather:"חם ונעים",holidays:[{n:'ל"ג בעומר',d:15},{n:"שבועות",d:24}],news:"שבועות ויציאות לטבע"},
  6:{season:"קיץ",emoji:"☀️",weather:"חם מאוד",holidays:[],news:"חופשת קיץ, נסיעות ארוכות"},
  7:{season:"קיץ",emoji:"🏖️",weather:"חום כבד",holidays:[],news:"שיא הקיץ, מזגנים ורחצה"},
  8:{season:"קיץ",emoji:"🌊",weather:"חום לח",holidays:[],news:"חופשות, חוף ים, תחילת שנה"},
  9:{season:"סתיו",emoji:"🍂",weather:"מתקרר",holidays:[{n:"ראש השנה",d:22},{n:"יום כיפור",d:1},{n:"סוכות",d:6}],news:"ראש השנה וחגי תשרי"},
  10:{season:"סתיו",emoji:"🍁",weather:"נעים",holidays:[{n:"שמחת תורה",d:2}],news:"חזרה לשגרה אחרי החגים"},
  11:{season:"סתיו",emoji:"🌦️",weather:"מתקרר וגשום",holidays:[],news:"גשמים ראשונים, חיסכון בחורף"},
  12:{season:"חורף",emoji:"🎄",weather:"קר",holidays:[{n:"חנוכה",d:25}],news:"חנוכה, סוף שנה, מבצעי חורף"}
};

function getCtx(month){return MD[month]||MD[1];}
function getMondays(year,month){const mondays=[];const d=new Date(year,month-1,1);while(d.getMonth()===month-1){if(d.getDay()===1)mondays.push(new Date(d));d.setDate(d.getDate()+1);}return mondays;}
function fmt(d){return d?`${d.getDate()}.${d.getMonth()+1}`:"";}
function dn(d){return d?DHE[d.getDay()]:"";}
function pickDate(year,month,day){return new Date(year,month-1,day);}

function buildSchedule(year,month){
  const c=getCtx(month);const mondays=getMondays(year,month);const posts=[];let num=1;
  mondays.slice(0,4).forEach((mon,i)=>{
    if(i===0){posts.push({id:`p${num}`,num,tk:"monday",type:"שני חסכוני",date:mon,copy:"",val:"",image:null});num++;}
    else if(i===1){const hasH=c.holidays.some(h=>Math.abs(h.d-mon.getDate())<=10);posts.push({id:`p${num}`,num,tk:hasH?"holiday":"fun",type:hasH?"חג / אירוע":"מצחיק / אפליקציה",date:mon,copy:"",val:"",image:null});num++;}
    else if(i===2){posts.push({id:`p${num}`,num,tk:"monday",type:"שני חסכוני",date:mon,copy:"",val:"",image:null});num++;}
    else if(i===3){posts.push({id:`p${num}`,num,tk:"recruit",type:"דרושים",date:mon,copy:"",val:"",image:null});num++;}
  });
  const midDate=pickDate(year,month,14);const hasMidH=c.holidays.some(h=>Math.abs(h.d-14)<=8);
  posts.push({id:`p${num}`,num,tk:hasMidH?"holiday":"fun",type:hasMidH?"חג / אירוע":"מצחיק / אפליקציה",date:midDate,copy:"",val:"",image:null});num++;
  for(let i=0;i<4;i++){posts.push({id:`p${num}`,num,tk:"promo",type:"פוסט מבצע",date:null,copy:"",promoText:"",val:"",image:null});num++;}
  return posts;
}

function serializePosts(posts){return posts.map(p=>({...p,date:p.date?p.date.toISOString():null}));}
function deserializePosts(posts){return posts.map(p=>({...p,date:p.date?new Date(p.date):null}));}

const LANG_RULES=`חוקי שפה: עברית תקנית, ללא "אתה/את" בודד — פנה לרבים "אתם", ריבוי אחרי מספר "5 דקות", מקף ארוך — לא מקף קצר.`;

const pMonday=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמאות: "יום שני מגיע מהר... אבל אתם מגיעים מוכנים! ⛽ בכל יום שני — 40 אגורות חיסכון לכל ליטר דלק בתחנות Ten."
כתוב פוסט שני חסכוני לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | ${c.weather} | מצב: ${ne||c.news}
חגים קרובים: ${c.holidays.filter(h=>Math.abs(h.d-d.getDate())<=8).map(h=>h.n).join(", ")||"אין"}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 110-160 מילים כולל דיסקליימר. CTA עם לינק ${APP_LINK}.
${DISC}
כתוב רק הטקסט הסופי.`;

const pHoliday=(d,c,ne,notes)=>{const h=c.holidays.filter(hh=>Math.abs(hh.d-d.getDate())<=10);return `אתה קופירייטר בכיר של Ten.
כתוב פוסט חגי לתאריך ${fmt(d)} (${dn(d)}).
חגים: ${h.length?h.map(hh=>hh.n).join(", "):"ללא חג, כתוב על המצב הנוכחי"}
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 80-130 מילים. CTA לתחנה.
כתוב רק הטקסט הסופי.`;};

const pFun=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמאות: "זה קורה לכולם, נכון?... 👀 תייגו חבר/ה שנכנסו לתדלק ויצאו עם חצי חנות."
כתוב פוסט מצחיק/אפליקציה לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 70-120 מילים. CTA תיוג/תגובה/אפליקציה ${APP_LINK}.
כתוב רק הטקסט הסופי.`;

const pRecruit=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
כתוב פוסט דרושים לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 120-150 מילים. פתיחה יצירתית, 4 הטבות עם אמוג'י, CTA ווטסאפ ${WHATSAPP} + אתר ${CAREER_LINK}.
כתוב רק הטקסט הסופי.`;

const pPromo=(pt,m,notes)=>`אתה קופירייטר בכיר של Ten.
כתוב פוסט מבצע לחודש ${MHE[m]}.
המבצע: ${pt}
${notes?`הערות: ${notes}`:""}
חוק אבסולוטי: כתוב רק על המוצר/מבצע שצוין. אסור להמציא פרטים.
${LANG_RULES}
אורך: 100-150 מילים. פתיחה חזקה, מחיר ברור, לינק ${APP_LINK}, דיסקליימר: ${DISC}
כתוב רק הטקסט הסופי.`;

const LANG_CHECK_PROMPT=(text)=>`אתה עורך לשון עברי. תקן רק שגיאות דקדוק — ריבוי אחרי מספר, גוף שני לרבים. אל תשנה סגנון, אמוג'י, קישורים. אם אין שגיאות — החזר כמות שהוא. החזר רק הטקסט המתוקן.\nטקסט:\n${text}`;

async function callAI(prompt,skipCheck=false){
  const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
  if(!r.ok)throw new Error(`API error: ${r.status}`);
  const d=await r.json();const text=(d.text||"").trim();
  if(skipCheck||!text)return text;
  try{const r2=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:LANG_CHECK_PROMPT(text)})});if(r2.ok){const d2=await r2.json();return(d2.text||text).trim();}}catch(e){}
  return text;
}

/* ─── BADGE ───────────────────────────────────────────────────────── */
function Badge({type}){
  const m={"שני חסכוני":["#E3F2FD",BL,"#90CAF9"],"חג / אירוע":["#E8F5E9","#1B5E20","#A5D6A7"],"מצחיק / אפליקציה":["#FFF3E0","#E65100","#FFCC80"],"דרושים":["#FCE4EC","#C62828","#F48FB1"],"פוסט מבצע":["#FFF8E1","#E65100","#FFE082"]};
  const [bg,color,border]=m[type]||["#F5F5F5","#333","#DDD"];
  return <span style={{display:"inline-block",padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color,border:`1px solid ${border}`,whiteSpace:"nowrap"}}>{type}</span>;
}

/* ─── EXPORT ──────────────────────────────────────────────────────── */
function buildExportHTML(posts,month,year,c){
  const TC={"שני חסכוני":{bg:"#DDEEFF",color:"#1565C0",label:"⛽ שני חסכוני"},"חג / אירוע":{bg:"#DDEECC",color:"#1B5E20",label:"🌸 חג / אירוע"},"מצחיק / אפליקציה":{bg:"#FFEECC",color:"#E65100",label:"📱 מצחיק / אפליקציה"},"דרושים":{bg:"#FFD6D6",color:"#C62828",label:"👥 דרושים"},"פוסט מבצע":{bg:"#FFF3CC",color:"#E65100",label:"🛒 פוסט מבצע"}};
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const doneCnt=posts.filter(p=>p.copy).length;
  const BD="border:1px solid #CFD8DC";const CELL=`${BD};padding:8px 12px;font-size:13px;font-family:Arial,sans-serif;background:#FFFFFF`;
  const rows=posts.map(p=>{const tc=TC[p.type]||{bg:"#F5F5F5",color:"#333",label:p.type};const st=p.copy?`<span style="color:#2E7D32;font-weight:700">✅ מוכן</span>`:`<span style="color:#C62828;font-weight:700">⭕ ממתין</span>`;return `<tr><td style="${CELL};text-align:center;font-weight:700;color:#1565C0">${p.num}</td><td style="${CELL}">${p.date?fmt(p.date):"לפי מבצע"}</td><td style="${CELL}">${p.date?dn(p.date):""}</td><td style="${BD};padding:8px 12px;font-size:13px;font-family:Arial,sans-serif;background:${tc.bg};color:${tc.color};font-weight:700">${tc.label}</td><td style="${CELL};text-align:center">${st}</td></tr>`;}).join("\n");
  const postBlocks=posts.map(p=>{const tc=TC[p.type]||{bg:"#F5F5F5",color:"#333",label:p.type};if(!p.copy)return `<table width="100%" style="border-collapse:collapse;margin-bottom:12px"><tr><td style="${BD};padding:12px 16px;font-size:13px;font-family:Arial,sans-serif;background:#FFF9E6"><span style="color:#E65100;font-weight:700">${tc.label} — פוסט #${p.num}</span><br><span style="color:#FF8F00;font-style:italic">⭕ ממתין לפרטי מבצע</span></td></tr></table>`;const lines=p.copy.split("\n");const bodyHtml=lines.map((line,i)=>{if(!line.trim())return"";const safe=esc(line);if(line.startsWith("*"))return`<span style="font-size:11px;color:#90A4AE;font-style:italic">${safe}</span>`;if(i===0)return`<strong style="font-size:14px;color:#1A2733">${safe}</strong>`;return`<span style="font-size:13px;color:#333333">${safe}</span>`;}).filter(Boolean).join("<br>\n");return `<table width="100%" style="border-collapse:collapse;margin-bottom:16px"><tr><td style="background:#1565C0;padding:9px 16px;${BD}"><span style="color:white;font-weight:900;font-size:15px">#${p.num}&nbsp;&nbsp;</span><span style="background:${tc.bg};color:${tc.color};font-weight:700;font-size:12px;padding:2px 8px">${tc.label}</span>${p.date?`&nbsp;&nbsp;<span style="color:#BDD8FF;font-size:12px">${fmt(p.date)} | ${dn(p.date)}</span>`:""}</td></tr><tr><td style="background:#FFFFFF;${BD};padding:14px 18px;font-size:13px;font-family:Arial,sans-serif;line-height:1.85;color:#1A2733">${bodyHtml}</td></tr></table>`;}).join("\n");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>גאנט תוכן | ${MHE[month]} ${year}</title><style>body{font-family:Arial,sans-serif;direction:rtl;background:#FFF;margin:0;padding:0}.wrap{max-width:760px;margin:0 auto;padding:32px 24px}.st{font-size:17px;font-weight:900;color:#1565C0;margin:0 0 12px;padding-bottom:5px;border-bottom:2px solid #1565C0}</style></head><body dir="rtl"><div class="wrap"><table width="100%" style="border-collapse:collapse;margin-bottom:20px;background:#1565C0"><tr><td style="padding:28px 24px;text-align:center"><div style="font-size:52px;font-weight:900;line-height:1;color:white">דלק <span style="color:#FFB3B3">Ten</span></div><div style="color:rgba(255,255,255,0.85);font-size:16px;margin-top:10px">גאנט תוכן | ${MHE[month]} ${year}</div><div style="color:rgba(255,255,255,0.55);font-size:12px;margin-top:6px">${doneCnt} פוסטים מוכנים מתוך ${posts.length}</div></td></tr></table><p class="st">📋 סיכום גאנט</p><table width="100%" style="border-collapse:collapse;margin-bottom:28px"><thead><tr style="background:#1565C0"><th style="color:white;padding:9px 12px;font-size:13px;text-align:center;border:1px solid #1565C0">#</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:right;border:1px solid #1565C0">תאריך</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:right;border:1px solid #1565C0">יום</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:right;border:1px solid #1565C0">סוג פוסט</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:center;border:1px solid #1565C0">סטטוס</th></tr></thead><tbody>${rows}</tbody></table><p class="st">📝 פוסטים מלאים</p>${postBlocks}<p style="text-align:center;color:#AAA;font-size:11px;margin-top:24px;padding-top:12px;border-top:1px solid #EEE">גאנט תוכן | דלק Ten | ${MHE[month]} ${year}</p></div></body></html>`;
}

function downloadExport(posts,month,year,c){
  const html=buildExportHTML(posts,month,year,c);const blob=new Blob([html],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`גאנט-Ten-${MHE[month]}-${year}.html`;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),2000);
}

/* ─── EXPORT MODAL ────────────────────────────────────────────────── */
function ExportModal({posts,month,year,c,onClose}){
  const [tab,setTab]=useState("preview");
  const [copied,setCopied]=useState(false);
  const [exportDone,setExportDone]=useState(false);
  const textContent=[`גאנט תוכן | דלק Ten | ${MHE[month]} ${year}`,`עונה: ${c.season} | ${c.weather}`,`חגים: ${c.holidays.map(h=>h.n).join(", ")||"אין"}`,`הקשר: ${c.news}`,"","=== סיכום ===",
    ...posts.map(p=>`${p.num}. ${p.date?fmt(p.date):"לפי מבצע"} | ${p.type} | ${p.copy?"✅ מוכן":"⭕ ממתין"}`),
    "","=== פוסטים מלאים ===","",
    ...posts.map(p=>[`────────────────────────`,`פוסט #${p.num} | ${p.type}`,p.date?`${fmt(p.date)} | ${dn(p.date)}`:"","",p.copy||"[טרם נוצר]",""].join("\n"))
  ].join("\n");
  const donePosts=posts.filter(p=>p.copy);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:WH,borderRadius:16,width:"100%",maxWidth:800,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",direction:"rtl"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:`linear-gradient(135deg,${BL},#0D47A1)`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{color:WH,fontWeight:900,fontSize:16}}>📤 ייצוא גאנט | {MHE[month]} {year}</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:WH,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:700,fontSize:14}}>✕</button>
        </div>
        <div style={{background:"#E8F5E9",borderBottom:"1px solid #A5D6A7",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <span style={{fontSize:22}}>📄</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,color:"#1B5E20",fontSize:14}}>ייצוא לגוגל דוקס / Word</div>
            <div style={{fontSize:12,color:"#388E3C"}}>מוריד קובץ HTML מעוצב — גרור לגוגל דרייב, ייפתח כ-Google Doc</div>
          </div>
          <button onClick={()=>{downloadExport(posts,month,year,c);setExportDone(true);setTimeout(()=>setExportDone(false),4000);}}
            style={{background:exportDone?"#4CAF50":"#2E7D32",color:WH,border:"none",borderRadius:10,padding:"10px 22px",cursor:"pointer",fontWeight:800,fontSize:14,whiteSpace:"nowrap"}}>
            {exportDone?"✅ הורד!":"⬇️ הורד ופתח בדוקס"}
          </button>
        </div>
        <div style={{display:"flex",borderBottom:`2px solid ${BR}`,flexShrink:0}}>
          {[["preview","👁️ תצוגה מקדימה"],["text","📋 טקסט גולמי"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"11px 20px",border:"none",background:"none",fontWeight:700,fontSize:13,cursor:"pointer",color:tab===id?BL:"#78909C",borderBottom:tab===id?`3px solid ${BL}`:"3px solid transparent",marginBottom:-2}}>{label}</button>
          ))}
        </div>
        <div style={{flex:1,overflow:"auto",padding:20}}>
          {tab==="preview"&&(
            <div>
              {donePosts.length===0&&<div style={{textAlign:"center",color:"#90A4AE",padding:40}}>אין פוסטים מוכנים עדיין</div>}
              {donePosts.map(p=>(
                <div key={p.id} style={{background:WH,borderRadius:12,border:`1px solid ${BR}`,marginBottom:14,overflow:"hidden"}}>
                  <div style={{padding:"10px 16px",background:"#F0F7FF",borderBottom:`1px solid ${BR}`,display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontWeight:900,color:BL,fontSize:14}}>#{p.num}</span>
                    <span style={{fontWeight:700,fontSize:13}}>{p.date?`${fmt(p.date)} | ${dn(p.date)}`:"לפי מבצע"}</span>
                    <Badge type={p.type}/>
                    <button onClick={()=>navigator.clipboard.writeText(p.copy)} style={{marginRight:"auto",background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:6,padding:"2px 9px",cursor:"pointer",fontSize:11,fontWeight:700}}>📋 העתק</button>
                  </div>
                  <div style={{padding:"14px 16px",fontSize:14,lineHeight:1.9,whiteSpace:"pre-wrap",color:DK}}>{p.copy}</div>
                </div>
              ))}
            </div>
          )}
          {tab==="text"&&(
            <div>
              <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
                <span style={{fontSize:12,color:"#546E7A",flex:1}}>לגוגל דוקס: העתק הכל ← פתח גוגל דוקס ← Ctrl+V</span>
                <button onClick={()=>{navigator.clipboard.writeText(textContent).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});}}
                  style={{background:copied?"#4CAF50":BL,color:WH,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontWeight:800,fontSize:13}}>
                  {copied?"✅ הועתק!":"📋 העתק הכל"}
                </button>
              </div>
              <pre style={{background:"#F8FAFB",border:`1px solid ${BR}`,borderRadius:10,padding:16,fontSize:12,lineHeight:1.8,whiteSpace:"pre-wrap",direction:"rtl",fontFamily:"Arial,sans-serif",maxHeight:400,overflow:"auto",color:DK}}>{textContent}</pre>
            </div>
          )}
        </div>
        <div style={{borderTop:`1px solid ${BR}`,padding:"10px 20px",background:"#FAFBFC",flexShrink:0,fontSize:11,color:"#78909C",display:"flex",justifyContent:"space-between"}}>
          <span>{donePosts.length} פוסטים מוכנים מתוך {posts.length}</span>
          <span>הורד HTML ← פתח ב-Word / Google Drive ← שלח ללקוח</span>
        </div>
      </div>
    </div>
  );
}

/* ─── POST CARD ───────────────────────────────────────────────────── */
function PostCard({post,c,month,ne,onUpdate,isClient=false}){
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(post.copy||"");
  const [notes,setNotes]=useState("");
  const [promoIn,setPromoIn]=useState(post.promoText||"");
  const [loading,setLoading]=useState(false);
  const [valResult,setValResult]=useState(post.val||"");
  const [valLoading,setValLoading]=useState(false);
  const [imgData,setImgData]=useState(post.image||null);
  useEffect(()=>{setEditVal(post.copy||"");},[post.copy]);
  const status=post.copy?"done":post.tk==="promo"&&!post.promoText?"empty":"wait";

  async function gen(n){
    if(isClient)return;setLoading(true);let p="";
    if(post.tk==="monday")p=pMonday(post.date,c,ne,n||notes);
    else if(post.tk==="holiday")p=pHoliday(post.date,c,ne,n||notes);
    else if(post.tk==="fun")p=pFun(post.date,c,ne,n||notes);
    else if(post.tk==="recruit")p=pRecruit(post.date,c,ne,n||notes);
    else if(post.tk==="promo")p=pPromo(promoIn||post.promoText,month,n||notes);
    const copy=await callAI(p);setEditVal(copy);setValResult("");onUpdate({...post,copy,promoText:promoIn,val:""});setLoading(false);
  }

  async function validate(){
    if(isClient)return;setValLoading(true);
    const r=await callAI(`בדוק פוסט זה של Ten בקצרה:\n---\n${post.copy||editVal}\n---\nבדוק: 1) יש מקף ארוך (—)? 2) שגיאות שפה? 3) טון מתאים? 4) CTA ברור?\nציון 1-10 ושיפור אחד. קצר, בעברית.`);
    setValResult(r);onUpdate({...post,val:r});setValLoading(false);
  }

  function handleImageUpload(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const data=ev.target.result;setImgData(data);onUpdate({...post,image:data});};reader.readAsDataURL(file);}

  return (
    <div style={{background:WH,borderRadius:12,border:`1px solid ${BR}`,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",direction:"rtl"}}>
      <div style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:9,background:status==="done"?"#F9FFFE":status==="empty"?"#FFF8F8":"#FAFBFC"}}>
        <span style={{fontWeight:800,color:BL,fontSize:13,minWidth:24}}>#{post.num}</span>
        <span style={{fontWeight:700,color:DK,fontSize:13}}>{post.date?`${fmt(post.date)} | ${dn(post.date)}`:"תאריך לפי מבצע"}</span>
        <Badge type={post.type}/>
        <span style={{marginRight:"auto",fontSize:11,fontWeight:800,color:status==="done"?"#4CAF50":status==="empty"?"#E53935":"#FF9800"}}>
          {status==="done"?"✅ מוכן":status==="empty"?"⭕ ממתין למבצע":"⏳"}
        </span>
        {loading&&<span style={{fontSize:11,color:BL,fontWeight:700}}>מייצר...</span>}
      </div>
      <div style={{borderTop:`1px solid ${BR}`}}>
        {post.tk==="promo"&&(
          <div style={{padding:"10px 16px",background:"#FFFDE7",borderBottom:`1px solid ${BR}`}}>
            <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:5}}>📦 פרטי המבצע</div>
            {isClient?(
              <input value={promoIn} onChange={e=>{setPromoIn(e.target.value);onUpdate({...post,promoText:e.target.value});}}
                placeholder="פרטי המבצע — מוצר, מחיר, תוקף..."
                style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:13,fontFamily:"Arial",boxSizing:"border-box"}}/>
            ):(
              <div style={{display:"flex",gap:8}}>
                <input value={promoIn} onChange={e=>setPromoIn(e.target.value)}
                  placeholder="למשל: קומפרסור 2 בוכנות ב-229 ש'ח, באפליקציה 199 ש'ח, עד 30.4.26"
                  style={{flex:1,padding:"7px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:12,fontFamily:"Arial"}}/>
                <button onClick={()=>{onUpdate({...post,promoText:promoIn});gen("");}} disabled={!promoIn||loading}
                  style={{background:BL,color:WH,border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:700,opacity:!promoIn||loading?0.5:1}}>
                  {loading?"...":"צור פוסט"}
                </button>
              </div>
            )}
          </div>
        )}
        {post.copy?(
          <div style={{display:"grid",gridTemplateColumns:isClient?"1fr":"1fr 240px"}}>
            <div style={{padding:"14px 18px",borderLeft:isClient?"none":`1px solid ${BR}`}}>
              <div style={{fontSize:13.5,lineHeight:1.8,color:DK,whiteSpace:"pre-wrap",background:"#FAFBFC",padding:"10px 13px",borderRadius:8,border:`1px solid ${BR}`,minHeight:100}}>{post.copy}</div>
              {!isClient&&(
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                  <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="הערה לייצור מחדש..."
                    style={{flex:1,minWidth:130,padding:"5px 9px",borderRadius:7,border:`1px solid ${BR}`,fontSize:11,fontFamily:"Arial"}}/>
                  <button onClick={()=>gen(notes)} disabled={loading} style={{background:RD,color:WH,border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700,opacity:loading?0.5:1}}>{loading?"...":"↺ מחדש"}</button>
                  <button onClick={()=>{if(editing){setEditing(false);onUpdate({...post,copy:editVal});}else{setEditing(true);}}} style={{background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>{editing?"💾 שמור":"✏️ ערוך"}</button>
                  <button onClick={()=>navigator.clipboard.writeText(post.copy)} style={{background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>📋</button>
                  <button onClick={validate} disabled={valLoading} style={{background:"none",border:"1px solid #7B1FA2",color:"#7B1FA2",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>{valLoading?"...":"🔍 בדוק"}</button>
                </div>
              )}
              {!isClient&&editing&&(
                <textarea value={editVal} onChange={e=>setEditVal(e.target.value)}
                  style={{width:"100%",height:180,padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:13,lineHeight:1.75,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial",direction:"rtl",marginTop:8}}/>
              )}
              {!isClient&&valResult&&(
                <div style={{marginTop:8,background:"#F3E5F5",border:"1px solid #CE93D8",borderRadius:8,padding:"9px 12px",fontSize:11.5,lineHeight:1.7,color:"#4A148C",whiteSpace:"pre-wrap"}}>{valResult}</div>
              )}
            </div>
            {!isClient&&(
              <div style={{padding:"14px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,background:"#F0F4F8"}}>
                <span style={{fontSize:11,fontWeight:800,color:RD,alignSelf:"flex-start"}}>🖼️ תמונה לפוסט</span>
                {imgData?(
                  <div style={{position:"relative",width:"100%"}}>
                    <img src={imgData} alt="post" style={{width:"100%",borderRadius:10,display:"block",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}/>
                    <button onClick={()=>{setImgData(null);onUpdate({...post,image:null});}} style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.55)",color:WH,border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                ):(
                  <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",minHeight:140,border:"2px dashed #90A4AE",borderRadius:10,cursor:"pointer",gap:8,background:"white"}}>
                    <span style={{fontSize:28}}>📤</span>
                    <span style={{fontSize:11,color:"#78909C",textAlign:"center",fontWeight:600}}>העלה תמונה מעוצבת<br/><span style={{color:"#B0BEC5",fontWeight:400}}>לחץ או גרור לכאן</span></span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{display:"none"}}/>
                  </label>
                )}
              </div>
            )}
          </div>
        ):(
          <div style={{padding:"20px",textAlign:"center"}}>
            {post.tk!=="promo"&&(loading?<div style={{color:BL,fontWeight:700,fontSize:13}}>⏳ מייצר...</div>:<div style={{color:"#90A4AE",fontSize:13}}>⏳ ממתין לייצור אוטומטי</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CLIENT POST ROW ─────────────────────────────────────────────── */
function ClientPostRow({post,feedback,onChange}){
  const fb=feedback||{approved:false,note:"",promoText:post.promoText||""};
  return (
    <div style={{background:WH,borderRadius:12,border:`1px solid ${fb.approved?"#A5D6A7":"#CFD8DC"}`,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",direction:"rtl",borderRight:`4px solid ${fb.approved?"#4CAF50":"#CFD8DC"}`}}>
      <div style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:9,background:fb.approved?"#F1F8E9":"#FAFBFC"}}>
        <span style={{fontWeight:800,color:BL,fontSize:13,minWidth:24}}>#{post.num}</span>
        <span style={{fontWeight:700,color:"#37474F",fontSize:13}}>{post.date?`${fmt(post.date)} | ${dn(post.date)}`:"תאריך לפי מבצע"}</span>
        <Badge type={post.type}/>
        <div style={{marginRight:"auto"}}>
          <button onClick={()=>onChange({...fb,approved:!fb.approved})}
            style={{background:fb.approved?"#4CAF50":"white",color:fb.approved?"white":"#4CAF50",border:"2px solid #4CAF50",borderRadius:7,padding:"5px 16px",cursor:"pointer",fontSize:13,fontWeight:800}}>
            {fb.approved?"✅ מאושר":"אישור"}
          </button>
        </div>
      </div>
      {post.image&&(<div style={{padding:"10px 16px",borderTop:"1px solid #ECEFF1"}}><img src={post.image} alt="פוסט" style={{width:120,height:120,borderRadius:10,objectFit:"cover",boxShadow:"0 2px 8px rgba(0,0,0,0.12)"}}/></div>)}
      {post.copy&&(<div style={{padding:"10px 16px",fontSize:13,lineHeight:1.8,color:"#37474F",whiteSpace:"pre-wrap",background:"#FAFBFC",borderTop:"1px solid #ECEFF1"}}>{post.copy}</div>)}
      {post.tk==="promo"&&(
        <div style={{padding:"10px 16px",background:"#FFFDE7",borderTop:"1px solid #FFE082"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:5}}>📦 פרטי המבצע</div>
          <input value={fb.promoText||""} onChange={e=>onChange({...fb,promoText:e.target.value})} placeholder="פרטי המבצע — מוצר, מחיר, תוקף..."
            style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #FFE082",fontSize:13,fontFamily:"Arial",boxSizing:"border-box"}}/>
        </div>
      )}
      {post.copy&&(
        <div style={{padding:"8px 16px 12px",borderTop:"1px solid #ECEFF1"}}>
          <textarea value={fb.note||""} onChange={e=>onChange({...fb,note:e.target.value})} placeholder="הערה לצוות (אופציונלי)..."
            style={{width:"100%",height:52,padding:"7px 10px",borderRadius:7,border:"1px solid #CFD8DC",fontSize:12,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial",background:"#FAFBFC"}}/>
        </div>
      )}
    </div>
  );
}

/* ─── CLIENT SELECT ───────────────────────────────────────────────── */
function ClientSelectScreen({clients,onSelect,onAdd}){
  const [showAdd,setShowAdd]=useState(false);
  const [newName,setNewName]=useState("");
  const [newColor,setNewColor]=useState("#1565C0");
  function addClient(){if(!newName.trim())return;const nc={id:"c-"+Date.now(),name:newName.trim(),logo:null,color:newColor};onAdd(nc);setNewName("");setNewColor("#1565C0");setShowAdd(false);}
  return (
    <div style={{minHeight:"100vh",background:"#F5F0FF",fontFamily:"Arial,sans-serif",direction:"rtl",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:WH,borderRadius:20,padding:36,boxShadow:"0 8px 40px rgba(0,0,0,0.12)",maxWidth:460,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src={DAVID_LOGO} style={{height:48,marginBottom:12,display:"block",margin:"0 auto 16px"}} alt="David Vatine"/>
          <div style={{fontSize:22,fontWeight:900,color:DV_PURPLE}}>בחר לקוח</div>
          <div style={{fontSize:13,color:"#78909C",marginTop:4}}>בחר לקוח ליצירת גאנט</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
          {clients.map(cl=>(
            <button key={cl.id} onClick={()=>onSelect(cl)}
              style={{display:"flex",alignItems:"center",gap:14,background:"#F8FAFF",border:`2px solid ${cl.color||BL}`,borderRadius:14,padding:"14px 18px",cursor:"pointer",textAlign:"right",width:"100%"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:cl.color||BL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:"white",fontWeight:900,fontSize:22}}>{cl.name[0]}</span>
              </div>
              <div style={{flex:1,fontWeight:800,fontSize:16,color:DK}}>{cl.name}</div>
              <span style={{color:cl.color||BL,fontWeight:700,fontSize:20}}>←</span>
            </button>
          ))}
        </div>
        {showAdd?(
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
        ):(
          <button onClick={()=>setShowAdd(true)} style={{width:"100%",background:"none",border:`2px dashed ${BR}`,borderRadius:14,padding:"13px 0",cursor:"pointer",color:"#78909C",fontSize:14,fontWeight:700}}>➕ הוסף לקוח חדש</button>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN APP ────────────────────────────────────────────────────── */
export default function TenGanttAI(){
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [month,setMonth]=useState(now.getMonth()+1);
  const [phase,setPhase]=useState("client-select");
  function goPhase(p){window.history.pushState({phase:p},"",window.location.pathname+window.location.search);setPhase(p);}
  const [posts,setPosts]=useState([]);
  const [progress,setProgress]=useState({done:0,total:0});
  const [ne,setNe]=useState("");
  const [showExport,setShowExport]=useState(false);
  const [saveStatus,setSaveStatus]=useState("");
  const [storageLoading,setStorageLoading]=useState(true);
  const [clients,setClients]=useState(loadClients);
  const [activeClient,setActiveClient]=useState(()=>loadClients()[0]||DEFAULT_CLIENTS[0]);
  const [savedGantts,setSavedGantts]=useState([]);
  const [shareId,setShareId]=useState(null);
  const [shareLoading,setShareLoading]=useState(false);
  const [shareCopied,setShareCopied]=useState(false);
  const [isClientView,setIsClientView]=useState(false);
  const [clientFeedback,setClientFeedback]=useState({});
  const [clientName,setClientName]=useState("");
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);

  const c=getCtx(month);
  const AUTO=["monday","holiday","fun","recruit"];
  const doneCount=posts.filter(p=>p.copy).length;
  const autoTotal=posts.filter(p=>AUTO.includes(p.tk)).length;
  const isDone=progress.done>=autoTotal&&autoTotal>0;
  const pct=autoTotal>0?Math.round((progress.done/autoTotal)*100):0;

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const gid=params.get("gantt");
    if(gid){
      setIsClientView(true);setShareId(gid);setPhase("gantt");
      loadGanttFromSupabase(gid).then(data=>{if(data){setYear(data.year);setMonth(data.month);setNe(data.ne||"");setPosts(deserializePosts(data.posts));}setStorageLoading(false);});
      getComments(gid).then(()=>{});
    }
  },[]);

  useEffect(()=>{
    const handler=(e)=>{if(e.state?.phase)setPhase(e.state.phase);else goPhase("client-select");};
    window.addEventListener("popstate",handler);return()=>window.removeEventListener("popstate",handler);
  },[]);

  useEffect(()=>{
    async function load(){
      try{
        const list=listSavedGantts();setSavedGantts(list);
        const legacy=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
        if(legacy&&legacy.posts&&legacy.posts.length>0){saveGanttToStorage(legacy.year||now.getFullYear(),legacy.month||now.getMonth()+1,legacy.ne||"",deserializePosts(legacy.posts));localStorage.removeItem(STORAGE_KEY);setSavedGantts(listSavedGantts());}
      }catch(e){}
      setStorageLoading(false);
    }
    load();
  },[]);

  useEffect(()=>{
    if(posts.length===0||storageLoading)return;
    setSaveStatus("saving");
    const timer=setTimeout(()=>{try{saveGanttToStorage(year,month,ne,posts);setSavedGantts(listSavedGantts());setSaveStatus("saved");setTimeout(()=>setSaveStatus(""),2500);}catch(e){setSaveStatus("");}},800);
    return()=>clearTimeout(timer);
  },[posts,year,month,ne]);

  function upd(updated){setPosts(prev=>prev.map(p=>p.id===updated.id?updated:p));}
  function loadGantt(g){const data=loadGanttFromStorage(g.year,g.month);if(!data)return;setYear(data.year);setMonth(data.month);setNe(data.ne||"");setPosts(deserializePosts(data.posts));setPhase("gantt");setSaveStatus("loaded");setTimeout(()=>setSaveStatus(""),3000);}
  function deleteGantt(g){deleteGanttFromStorage(g.year,g.month);setSavedGantts(listSavedGantts());}

  async function sendClientFeedback(){
    setSending(true);
    try{
      const approved=posts.filter(p=>clientFeedback[p.id]?.approved).map(p=>p.type);
      const notes=posts.filter(p=>clientFeedback[p.id]?.note).map(p=>({type:p.type,note:clientFeedback[p.id].note}));
      const promos=posts.filter(p=>p.tk==="promo"&&clientFeedback[p.id]?.promoText).map(p=>({num:p.num,text:clientFeedback[p.id].promoText}));
      const summaryParts=[];
      if(clientName)summaryParts.push("מאת: "+clientName);
      summaryParts.push("\n✅ פוסטים מאושרים ("+approved.length+"/"+posts.length+"):\n"+(approved.join(", ")||"אין"));
      if(notes.length)summaryParts.push("\n✏️ הערות:\n"+notes.map(n=>"• "+n.type+": "+n.note).join("\n"));
      if(promos.length)summaryParts.push("\n📦 מבצעים:\n"+promos.map(p=>"• פוסט "+p.num+": "+p.text).join("\n"));
      const summary=summaryParts.join("\n");
      if(shareId)await addComment(shareId,"summary","סיכום",summary,clientName,window.location.href);
      await fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gantt_id:shareId||"unknown",post_type:"סיכום פידבק",comment:summary,author_name:clientName||"לקוח",gantt_url:window.location.href})});
      setSent(true);
    }catch(e){console.error(e);}
    setSending(false);
  }

  async function shareGantt(){
    setShareLoading(true);
    try{const id=shareId||makeShareId(year,month);const ok=await saveGanttToSupabase(id,year,month,ne,posts);if(ok){setShareId(id);saveGanttToStorage(year,month,ne,posts);setSavedGantts(listSavedGantts());}}catch(e){}
    setShareLoading(false);
  }

  function copyShareLink(){const url=`${window.location.origin}?gantt=${shareId}`;navigator.clipboard.writeText(url).then(()=>{setShareCopied(true);setTimeout(()=>setShareCopied(false),3000);});}

  async function runAuto(arr){
    const auto=arr.filter(p=>AUTO.includes(p.tk));setProgress({done:0,total:auto.length});
    for(const post of auto){
      let prompt="";const localCtx=getCtx(month);
      if(post.tk==="monday")prompt=pMonday(post.date,localCtx,ne,"");
      else if(post.tk==="holiday")prompt=pHoliday(post.date,localCtx,ne,"");
      else if(post.tk==="fun")prompt=pFun(post.date,localCtx,ne,"");
      else if(post.tk==="recruit")prompt=pRecruit(post.date,localCtx,ne,"");
      let copy="";
      for(let attempt=0;attempt<2;attempt++){try{copy=await callAI(prompt);if(copy)break;}catch(e){if(attempt===0)await new Promise(r=>setTimeout(r,1500));}}
      setPosts(prev=>prev.map(p=>p.id===post.id?{...p,copy}:p));
      setProgress(prev=>({...prev,done:prev.done+1}));
    }
  }

  function handleBuild(){const arr=buildSchedule(year,month);setPosts(arr);setProgress({done:0,total:0});goPhase("gantt");runAuto(arr);}

  /* ── LOADING ── */
  if(storageLoading)return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{textAlign:"center",color:BL}}><div style={{fontSize:32,marginBottom:12}}>⏳</div><div style={{fontWeight:700,fontSize:16}}>טוען נתונים שמורים...</div></div>
    </div>
  );

  if(phase==="client-select")return(<ClientSelectScreen clients={clients} onSelect={cl=>{setActiveClient(cl);goPhase("setup");}} onAdd={cl=>{const u=[...clients,cl];setClients(u);saveClients(u);}}/>);

  if(phase==="list")return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:WH,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:BL,fontWeight:900,fontSize:17}}>1</span><span style={{color:RD,fontWeight:900,fontSize:17}}>0</span></div>
          <div style={{color:WH,fontSize:17,fontWeight:900}}>גאנטים שמורים</div>
        </div>
        <button onClick={()=>goPhase("setup")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:WH,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:700}}>＋ גאנט חדש</button>
      </div>
      <div style={{maxWidth:600,margin:"28px auto",padding:"0 16px"}}>
        {savedGantts.length===0?(
          <div style={{background:WH,borderRadius:16,padding:40,textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:48,marginBottom:12}}>📭</div>
            <div style={{color:DK,fontWeight:700,fontSize:16,marginBottom:8}}>אין גאנטים שמורים עדיין</div>
            <button onClick={()=>goPhase("setup")} style={{background:BL,color:WH,border:"none",borderRadius:10,padding:"12px 28px",fontSize:15,fontWeight:800,cursor:"pointer"}}>＋ צור גאנט חדש</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:13,color:"#78909C",marginBottom:4}}>{savedGantts.length} גאנטים שמורים בדפדפן</div>
            {savedGantts.map(g=>(
              <div key={`${g.year}-${g.month}`} style={{background:WH,borderRadius:12,padding:"16px 20px",boxShadow:"0 2px 10px rgba(0,0,0,0.07)",border:`1px solid ${BR}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:900,color:BL,fontSize:17}}>{MHE[g.month]} {g.year}</div>
                  <div style={{fontSize:12,color:"#78909C",marginTop:3}}>{getCtx(g.month).emoji} {getCtx(g.month).season} • {g.doneCount>0?` ${g.doneCount} פוסטים מוכנים`:" טרם הושלם"} • נשמר {new Date(g.savedAt).toLocaleDateString("he-IL")}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>loadGantt(g)} style={{background:BL,color:WH,border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:800}}>📂 פתח</button>
                  <button onClick={()=>{if(window.confirm(`למחוק את גאנט ${MHE[g.month]} ${g.year}?`))deleteGantt(g);}} style={{background:"#FFEBEE",color:RD,border:`1px solid #FFCDD2`,borderRadius:8,padding:"9px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>🗑️</button>
                </div>
              </div>
            ))}
            <button onClick={()=>goPhase("setup")} style={{background:WH,color:BL,border:`2px solid ${BL}`,borderRadius:10,padding:"13px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4}}>＋ צור גאנט חדש</button>
          </div>
        )}
      </div>
    </div>
  );

  if(phase==="setup")return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{background:DV_GRAD,padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>goPhase("client-select")}>
            <img src={DAVID_LOGO} style={{height:36,opacity:0.92,filter:"brightness(0) invert(1)"}} alt="David Vatine"/>
          </div>
          <div>
            <div style={{color:WH,fontSize:20,fontWeight:900}}>גאנט AI | {activeClient?.name||"לקוח"}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>9 פוסטים חודשיים | שמירה אוטומטית | ייצוא קל</div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,marginTop:2}}>{APP_VERSION}</div>
          </div>
        </div>
        {savedGantts.length>0&&(
          <button onClick={()=>goPhase("list")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",color:WH,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            📂 גאנטים שמורים <span style={{background:RD,borderRadius:"50%",width:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900}}>{savedGantts.length}</span>
          </button>
        )}
      </div>
      <div style={{maxWidth:600,margin:"32px auto",padding:"0 16px"}}>
        <div style={{background:WH,borderRadius:16,padding:32,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <h2 style={{color:BL,fontSize:20,fontWeight:900,marginBottom:24,textAlign:"center"}}>בחר חודש לגאנט</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
            <div><label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:6}}>חודש</label>
              <select value={month} onChange={e=>setMonth(+e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:15,fontWeight:700}}>
                {MHE.slice(1).map((n,i)=><option key={i+1} value={i+1}>{n}</option>)}
              </select></div>
            <div><label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:6}}>שנה</label>
              <select value={year} onChange={e=>setYear(+e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:15,fontWeight:700}}>
                {[2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
              </select></div>
          </div>
          <div style={{background:"#F0F7FF",borderRadius:10,padding:"13px 16px",marginBottom:16,border:`1px solid #BBDEFB`,fontSize:13,lineHeight:1.9}}>
            <div style={{fontWeight:800,color:BL,marginBottom:6}}>{c.emoji} הקשר ל-{MHE[month]} {year}</div>
            <div><strong>עונה:</strong> {c.season} | {c.weather}</div>
            <div><strong>חגים:</strong> {c.holidays.map(h=>`${h.n} (${h.d}.${month})`).join(", ")||"אין"}</div>
            <div style={{marginTop:5,color:"#455A64"}}><strong>תקשורת:</strong> {c.news}</div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:5}}>📰 הקשר תקשורתי נוסף</label>
            <textarea value={ne} onChange={e=>setNe(e.target.value)} placeholder="למשל: עלייה במחירי דלק, גל חום..."
              style={{width:"100%",height:66,padding:"9px 11px",borderRadius:8,border:`1px solid ${BR}`,fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial"}}/>
          </div>
          <div style={{background:"#FFF8F8",borderRadius:10,padding:"12px 16px",marginBottom:24,border:`1px solid #FFCDD2`,fontSize:13,lineHeight:2}}>
            <div style={{fontWeight:800,color:RD,marginBottom:5}}>📌 מה יקרה</div>
            ✅ 5 פוסטים ייוצרו אוטומטית ← ⭕ 4 פוסטי מבצע ריקים<br/>
            💾 שמירה אוטומטית ← רענון הדף לא ימחק כלום<br/>
            📤 ייצוא: העתק טקסט / תצוגה מקדימה ללקוח
          </div>
          <button onClick={handleBuild} style={{width:"100%",background:BL,color:WH,border:"none",borderRadius:10,padding:"15px 0",fontSize:17,fontWeight:900,cursor:"pointer",boxShadow:`0 4px 16px ${BL}55`}}>
            🚀 בנה גאנט ל-{MHE[month]} {year}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── GANTT VIEW ── */
  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      {showExport&&<ExportModal posts={posts} month={month} year={year} c={c} onClose={()=>setShowExport(false)}/>}

      {isClientView&&(
        <div style={{background:DV_GRAD,padding:"14px 24px",display:"flex",alignItems:"center",gap:14}}>
          <img src={DAVID_LOGO} style={{height:32,opacity:0.9,filter:"brightness(0) invert(1)",flexShrink:0}} alt="David Vatine"/>
          <div style={{width:1,height:36,background:"rgba(255,255,255,0.3)",flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{color:WH,fontSize:16,fontWeight:900}}>גאנט {MHE[month]} {year} — {activeClient?.name||"דלק Ten"}</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,marginTop:2}}>עברו על הפוסטים, אשרו או הוסיפו הערות, ולחצו שלח בסוף</div>
          </div>
        </div>
      )}

      {!isClientView&&(
        <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>goPhase("client-select")}>
              <img src={DAVID_LOGO} style={{height:30,opacity:0.9,filter:"brightness(0) invert(1)"}} alt="David Vatine"/>
              <div style={{width:1,height:30,background:"rgba(255,255,255,0.3)"}}/>
            </div>
            <div>
              <div style={{color:WH,fontSize:17,fontWeight:900}}>גאנט {MHE[month]} {year} — {activeClient?.name||"לקוח"}</div>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,display:"flex",alignItems:"center",gap:8}}>
                <span>{c.emoji} {c.season} | {doneCount}/{posts.length} מוכנים | {APP_VERSION}</span>
                {saveStatus==="saving"&&<span style={{background:"rgba(255,255,255,0.15)",padding:"1px 8px",borderRadius:10,fontSize:10}}>💾 שומר...</span>}
                {saveStatus==="saved"&&<span style={{background:"rgba(76,175,80,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>✅ נשמר</span>}
                {saveStatus==="loaded"&&<span style={{background:"rgba(255,193,7,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>📂 נטען</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>setShowExport(true)} style={{background:"#4CAF50",color:WH,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:800}}>📤 ייצוא</button>
            {!shareId?(
              <button onClick={shareGantt} disabled={shareLoading} style={{background:"#FF6F00",color:WH,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:800,opacity:shareLoading?0.7:1}}>{shareLoading?"⏳ שומר...":"🔗 שתף ללקוח"}</button>
            ):(
              <button onClick={copyShareLink} style={{background:shareCopied?"#388E3C":"#FF6F00",color:WH,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:800}}>{shareCopied?"✅ הועתק!":"🔗 העתק לינק ללקוח"}</button>
            )}
            <button onClick={()=>goPhase("list")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:WH,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>📂 גאנטים שמורים</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:1060,margin:"0 auto",padding:"18px 16px"}}>
        {!isDone&&autoTotal>0&&(
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
        {isDone&&(
          <div style={{background:"#E8F5E9",border:"1px solid #A5D6A7",borderRadius:12,padding:"11px 18px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>✅</span>
            <div>
              <div style={{fontWeight:800,color:"#1B5E20",fontSize:14}}>5 פוסטים נוצרו ונשמרו! לחץ "שתף ללקוח" לשיתוף.</div>
              <div style={{fontSize:12,color:"#388E3C"}}>4 פוסטי מבצע ממתינים לפרטים מהלקוח</div>
            </div>
          </div>
        )}
        <div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:12,color:"#5D4037"}}>
          <strong>📰</strong> {ne||c.news}
        </div>
        <div style={{background:WH,borderRadius:12,marginBottom:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:`1px solid ${BR}`}}>
          <div style={{background:BL,padding:"9px 16px",color:WH,fontWeight:800,fontSize:13}}>📋 סיכום גאנט | {MHE[month]} {year}</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,direction:"rtl"}}>
            <thead><tr style={{background:"#F0F7FF"}}>{["#","תאריך","יום","סוג פוסט","סטטוס"].map(h=><th key={h} style={{padding:"7px 13px",textAlign:"right",color:BL,fontWeight:700,fontSize:12}}>{h}</th>)}</tr></thead>
            <tbody>{posts.map((p,i)=>(
              <tr key={p.id} style={{borderTop:`1px solid ${BR}`,background:i%2===0?WH:"#FAFBFC"}}>
                <td style={{padding:"7px 13px",fontWeight:700,color:BL}}>{p.num}</td>
                <td style={{padding:"7px 13px",fontWeight:600}}>{p.date?fmt(p.date):"לפי מבצע"}</td>
                <td style={{padding:"7px 13px"}}>{p.date?dn(p.date):""}</td>
                <td style={{padding:"7px 13px"}}><Badge type={p.type}/></td>
                <td style={{padding:"7px 13px",fontSize:12}}>{p.copy?<span style={{color:"#4CAF50",fontWeight:700}}>✅</span>:p.tk==="promo"?<span style={{color:RD,fontWeight:700}}>⭕</span>:<span style={{color:"#FF9800"}}>⏳</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {isClientView?(
          <>
            <div style={{background:"white",borderRadius:10,padding:"12px 16px",marginBottom:14,fontSize:13,color:"#37474F",border:"1px solid #CFD8DC"}}>
              <strong>איך זה עובד:</strong> עבור כל פוסט — לחץ ✅ מאושר או הוסף הערה. בסוף לחץ <strong>שלח</strong>.
            </div>
            <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="שמך (אופציונלי)"
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #CFD8DC",fontSize:13,marginBottom:12,boxSizing:"border-box",fontFamily:"Arial"}}/>
            {posts.map(p=><ClientPostRow key={p.id} post={p} feedback={clientFeedback[p.id]} onChange={fb=>setClientFeedback(prev=>({...prev,[p.id]:fb}))}/>)}
            {sent?(
              <div style={{background:"#E8F5E9",border:"1px solid #A5D6A7",borderRadius:12,padding:"20px",textAlign:"center",marginTop:8}}>
                <div style={{fontSize:28,marginBottom:8}}>🎉</div>
                <div style={{fontWeight:800,color:"#1B5E20",fontSize:16}}>הפידבק נשלח בהצלחה!</div>
                <div style={{color:"#388E3C",fontSize:13,marginTop:4}}>הצוות יקבל את ההערות שלך בקרוב</div>
              </div>
            ):(
              <button onClick={sendClientFeedback} disabled={sending}
                style={{width:"100%",background:DV_GRAD2,color:WH,border:"none",borderRadius:10,padding:"15px 0",fontSize:16,fontWeight:900,cursor:"pointer",marginTop:8,boxShadow:"0 4px 16px rgba(109,40,217,0.4)",opacity:sending?0.7:1}}>
                {sending?"⏳ שולח...":"📨 שלח פידבק לצוות"}
              </button>
            )}
          </>
        ):(
          posts.map(p=><PostCard key={p.id} post={p} c={c} month={month} ne={ne} onUpdate={upd} isClient={false}/>)
        )}

        <div style={{background:"#E8EAF6",borderRadius:10,padding:"13px 18px",fontSize:12,color:"#283593",border:"1px solid #9FA8DA",marginTop:6,lineHeight:1.8}}>
          <strong>📤 איך לשתף ללקוח:</strong><br/>
          לחץ <strong>"שתף ללקוח"</strong> ← העתק את הלינק ← שלח ללקוח<br/>
          הלקוח יוכל לאשר פוסטים, להוסיף הערות ולמלא פרטי מבצעים
        </div>
      </div>
    </div>
  );
}
