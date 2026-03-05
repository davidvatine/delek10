import { APP_LINK, CAREER_LINK, WHATSAPP, DISC, MHE } from "./constants.js";
import { fmt, dn } from "./utils.js";

/* ─── LANGUAGE RULES ──────────────────────────────────────────────── */
const LANG_RULES=`חוקי שפה: עברית תקנית, ללא "אתה/את" בודד — פנה לרבים "אתם", ריבוי אחרי מספר "5 דקות", מקף ארוך — לא מקף קצר.`;

/* ─── PROMPT TEMPLATES ────────────────────────────────────────────── */
export const pMonday=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמאות: "יום שני מגיע מהר... אבל אתם מגיעים מוכנים! ⛽ בכל יום שני — 40 אגורות חיסכון לכל ליטר דלק בתחנות Ten."
כתוב פוסט שני חסכוני לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | ${c.weather} | מצב: ${ne||c.news}
חגים קרובים: ${c.holidays.filter(h=>Math.abs(h.d-d.getDate())<=8).map(h=>h.n).join(", ")||"אין"}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 110-160 מילים כולל דיסקליימר. CTA עם לינק ${APP_LINK}.
${DISC}
כתוב רק הטקסט הסופי.`;

export const pHoliday=(d,c,ne,notes)=>{
  const h=c.holidays.filter(hh=>Math.abs(hh.d-d.getDate())<=10);
  return `אתה קופירייטר בכיר של Ten.
כתוב פוסט חגי לתאריך ${fmt(d)} (${dn(d)}).
חגים: ${h.length?h.map(hh=>hh.n).join(", "):"ללא חג, כתוב על המצב הנוכחי"}
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 80-130 מילים. CTA לתחנה.
כתוב רק הטקסט הסופי.`;
};

export const pFun=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
דוגמאות: "זה קורה לכולם, נכון?... 👀 תייגו חבר/ה שנכנסו לתדלק ויצאו עם חצי חנות."
כתוב פוסט מצחיק/אפליקציה לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 70-120 מילים. CTA תיוג/תגובה/אפליקציה ${APP_LINK}.
כתוב רק הטקסט הסופי.`;

export const pRecruit=(d,c,ne,notes)=>`אתה קופירייטר בכיר של Ten.
כתוב פוסט דרושים לתאריך ${fmt(d)} (${dn(d)}).
עונה: ${c.season} | מצב: ${ne||c.news}
${notes?`הערות: ${notes}`:""}
${LANG_RULES}
אורך: 120-150 מילים. פתיחה יצירתית, 4 הטבות עם אמוג'י, CTA ווטסאפ ${WHATSAPP} + אתר ${CAREER_LINK}.
כתוב רק הטקסט הסופי.`;

export const pPromo=(pt,m,notes)=>`אתה קופירייטר בכיר של Ten.
כתוב פוסט מבצע לחודש ${MHE[m]}.
המבצע: ${pt}
${notes?`הערות: ${notes}`:""}
חוק אבסולוטי: כתוב רק על המוצר/מבצע שצוין. אסור להמציא פרטים.
${LANG_RULES}
אורך: 100-150 מילים. פתיחה חזקה, מחיר ברור, לינק ${APP_LINK}, דיסקליימר: ${DISC}
כתוב רק הטקסט הסופי.`;

/* ─── LANG CHECK ──────────────────────────────────────────────────── */
const LANG_CHECK_PROMPT=(text)=>`אתה עורך לשון עברי. תקן רק שגיאות דקדוק — ריבוי אחרי מספר, גוף שני לרבים. אל תשנה סגנון, אמוג'י, קישורים. אם אין שגיאות — החזר כמות שהוא. החזר רק הטקסט המתוקן.\nטקסט:\n${text}`;

/* ─── CALL AI ─────────────────────────────────────────────────────── */
export async function callAI(prompt,skipCheck=false){
  const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
  if(!r.ok)throw new Error(`API error: ${r.status}`);
  const d=await r.json();const text=(d.text||"").trim();
  if(skipCheck||!text)return text;
  try{
    const r2=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:LANG_CHECK_PROMPT(text)})});
    if(r2.ok){const d2=await r2.json();return(d2.text||text).trim();}
  }catch(e){}
  return text;
}
