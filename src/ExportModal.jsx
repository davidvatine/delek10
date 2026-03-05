import { useState } from "react";
import { BL, WH, BR, DK, MHE } from "../constants.js";
import { fmt, dn } from "../utils.js";
import Badge from "./Badge.jsx";

const TC={
  "שני חסכוני":{bg:"#DDEEFF",color:"#1565C0",label:"⛽ שני חסכוני"},
  "חג / אירוע":{bg:"#DDEECC",color:"#1B5E20",label:"🌸 חג / אירוע"},
  "מצחיק / אפליקציה":{bg:"#FFEECC",color:"#E65100",label:"📱 מצחיק / אפליקציה"},
  "דרושים":{bg:"#FFD6D6",color:"#C62828",label:"👥 דרושים"},
  "פוסט מבצע":{bg:"#FFF3CC",color:"#E65100",label:"🛒 פוסט מבצע"},
};

function buildExportHTML(posts,month,year,c){
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const doneCnt=posts.filter(p=>p.copy).length;
  const BD="border:1px solid #CFD8DC";
  const CELL=`${BD};padding:8px 12px;font-size:13px;font-family:Arial,sans-serif;background:#FFFFFF`;
  const rows=posts.map(p=>{
    const tc=TC[p.type]||{bg:"#F5F5F5",color:"#333",label:p.type};
    const st=p.copy?`<span style="color:#2E7D32;font-weight:700">✅ מוכן</span>`:`<span style="color:#C62828;font-weight:700">⭕ ממתין</span>`;
    return `<tr><td style="${CELL};text-align:center;font-weight:700;color:#1565C0">${p.num}</td><td style="${CELL}">${p.date?fmt(p.date):"לפי מבצע"}</td><td style="${CELL}">${p.date?dn(p.date):""}</td><td style="${BD};padding:8px 12px;font-size:13px;font-family:Arial,sans-serif;background:${tc.bg};color:${tc.color};font-weight:700">${tc.label}</td><td style="${CELL};text-align:center">${st}</td></tr>`;
  }).join("\n");
  const postBlocks=posts.map(p=>{
    const tc=TC[p.type]||{bg:"#F5F5F5",color:"#333",label:p.type};
    if(!p.copy)return `<table width="100%" style="border-collapse:collapse;margin-bottom:12px"><tr><td style="${BD};padding:12px 16px;font-size:13px;font-family:Arial,sans-serif;background:#FFF9E6"><span style="color:#E65100;font-weight:700">${tc.label} — פוסט #${p.num}</span><br><span style="color:#FF8F00;font-style:italic">⭕ ממתין לפרטי מבצע</span></td></tr></table>`;
    const lines=p.copy.split("\n");
    const bodyHtml=lines.map((line,i)=>{
      if(!line.trim())return"";const safe=esc(line);
      if(line.startsWith("*"))return`<span style="font-size:11px;color:#90A4AE;font-style:italic">${safe}</span>`;
      if(i===0)return`<strong style="font-size:14px;color:#1A2733">${safe}</strong>`;
      return`<span style="font-size:13px;color:#333333">${safe}</span>`;
    }).filter(Boolean).join("<br>\n");
    return `<table width="100%" style="border-collapse:collapse;margin-bottom:16px"><tr><td style="background:#1565C0;padding:9px 16px;${BD}"><span style="color:white;font-weight:900;font-size:15px">#${p.num}&nbsp;&nbsp;</span><span style="background:${tc.bg};color:${tc.color};font-weight:700;font-size:12px;padding:2px 8px">${tc.label}</span>${p.date?`&nbsp;&nbsp;<span style="color:#BDD8FF;font-size:12px">${fmt(p.date)} | ${dn(p.date)}</span>`:""}</td></tr><tr><td style="background:#FFFFFF;${BD};padding:14px 18px;font-size:13px;font-family:Arial,sans-serif;line-height:1.85;color:#1A2733">${bodyHtml}</td></tr></table>`;
  }).join("\n");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>גאנט תוכן | ${MHE[month]} ${year}</title><style>body{font-family:Arial,sans-serif;direction:rtl;background:#FFF;margin:0;padding:0}.wrap{max-width:760px;margin:0 auto;padding:32px 24px}.st{font-size:17px;font-weight:900;color:#1565C0;margin:0 0 12px;padding-bottom:5px;border-bottom:2px solid #1565C0}</style></head><body dir="rtl"><div class="wrap"><table width="100%" style="border-collapse:collapse;margin-bottom:20px;background:#1565C0"><tr><td style="padding:28px 24px;text-align:center"><div style="font-size:52px;font-weight:900;line-height:1;color:white">דלק <span style="color:#FFB3B3">Ten</span></div><div style="color:rgba(255,255,255,0.85);font-size:16px;margin-top:10px">גאנט תוכן | ${MHE[month]} ${year}</div><div style="color:rgba(255,255,255,0.55);font-size:12px;margin-top:6px">${doneCnt} פוסטים מוכנים מתוך ${posts.length}</div></td></tr></table><p class="st">📋 סיכום גאנט</p><table width="100%" style="border-collapse:collapse;margin-bottom:28px"><thead><tr style="background:#1565C0"><th style="color:white;padding:9px 12px;font-size:13px;text-align:center;border:1px solid #1565C0">#</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:right;border:1px solid #1565C0">תאריך</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:right;border:1px solid #1565C0">יום</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:right;border:1px solid #1565C0">סוג פוסט</th><th style="color:white;padding:9px 12px;font-size:13px;text-align:center;border:1px solid #1565C0">סטטוס</th></tr></thead><tbody>${rows}</tbody></table><p class="st">📝 פוסטים מלאים</p>${postBlocks}<p style="text-align:center;color:#AAA;font-size:11px;margin-top:24px;padding-top:12px;border-top:1px solid #EEE">גאנט תוכן | דלק Ten | ${MHE[month]} ${year}</p></div></body></html>`;
}

function downloadExport(posts,month,year,c){
  const html=buildExportHTML(posts,month,year,c);
  const blob=new Blob([html],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=`גאנט-Ten-${MHE[month]}-${year}.html`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}

export default function ExportModal({posts,month,year,c,onClose}){
  const [tab,setTab]=useState("preview");
  const [copied,setCopied]=useState(false);
  const [exportDone,setExportDone]=useState(false);
  const textContent=[
    `גאנט תוכן | דלק Ten | ${MHE[month]} ${year}`,
    `עונה: ${c.season} | ${c.weather}`,
    `חגים: ${c.holidays.map(h=>h.n).join(", ")||"אין"}`,
    `הקשר: ${c.news}`,"","=== סיכום ===",
    ...posts.map(p=>`${p.num}. ${p.date?fmt(p.date):"לפי מבצע"} | ${p.type} | ${p.copy?"✅ מוכן":"⭕ ממתין"}`),
    "","=== פוסטים מלאים ===","",
    ...posts.map(p=>[`────────────────────────`,`פוסט #${p.num} | ${p.type}`,p.date?`${fmt(p.date)} | ${dn(p.date)}`:"","",p.copy||"[טרם נוצר]",""].join("\n"))
  ].join("\n");
  const donePosts=posts.filter(p=>p.copy);
  return(
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
