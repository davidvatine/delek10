// ── כלים ──
import React,{useState}from"react";
import{PU,WH,BL,APP_LINK,DISCLAIMER,MHE,SUPABASE_URL,SUPABASE_KEY}from"./constants.js";
export const SLogo=({src,alt,style})=>{const[e,sE]=useState(false);if(e||!src)return<div style={{...style,display:"flex",alignItems:"center",justifyContent:"center",background:PU,color:WH,fontWeight:"bold",fontSize:(style.width||40)/3,borderRadius:"8px"}}>{alt}</div>;return<img src={src} alt={alt} style={style} onError={()=>sE(true)}/>;};
export const BADGE={"שני חסכוני":["#DBEAFE","#1565C0"],"חג / אירוע":["#DCFCE7","#166534"],"מצחיק / אפליקציה":["#FEF3C7","#92400E"],"דרושים":["#FCE7F3","#9D174D"],"פוסט מבצע":["#FFE4E6","#9F1239"]};
export const Badge=({t})=>{const[bg,c]=BADGE[t]||["#F3F4F6","#374151"];return<span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color:c,whiteSpace:"nowrap"}}>{t}</span>;};
export function dayName(d,m,y){return["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"][new Date(y,m-1,d).getDay()];}
export async function callAI(prompt){try{const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});if(!r.ok)throw new Error();const d=await r.json();return(d.text||"").trim();}catch{return"שגיאה. נסה שוב.";}}

export function buildPrompt(type,ctx,date,day,promoText="",usedEvents=[]){
  const{season,weather,holidays,news,emoji}=ctx;
  const HL=holidays||"ללא";
  const NW=news||(ctx.extra||"");
  const USED=usedEvents.length>0?"אירועים שכבר נוצלו בפוסטים אחרים בגאנט זה (אסור לחזור עליהם!): "+usedEvents.join(", "):"";

  const RULES=`
אתה כותב פוסטים לדף הפייסבוק הרשמי של רשת תחנות הדלק Ten (דלק טן).

=== כללי ברזל - חובה לקיים את כולם ===

עברית ודקדוק:
- כתוב עברית תקינה ומדויקת לחלוטין - אפס שגיאות כתיב, פיסוק ודקדוק.
- אסור במקף ארוך (—). מקף רגיל (-) בלבד.
- Ten היא רשת/חברה - מין נקבה תמיד: "Ten מבטיחה", "Ten חוסכת", "Ten מגייסת". לא "Ten מבטיח".
- הקפד על התאמת מספר ומין לשמות עצם: "שלוש שקיות" (נקבה), "שלושה שקלים" (זכר).
- שמור על פנייה אחידה לאורך כל הפוסט - אל תערבב פנייה לזכר ופנייה לנקבה.

אימוג'ים:
- מותרים לכל היותר 2 אימוג'ים בכל הפוסט. לא 3. לא 4. 2 בלבד.
- לפני שאתה מסיים: ספור את האימוג'ים. אם יש יותר מ-2, הסר עד שנשארים 2 בלבד.

טון וסגנון:
- סגנון חברי ואנושי. כמו חבר שמספר לחבר, לא פרסומת.
- אסור לפתוח עם "!" בשורה הראשונה.
- אסור לפתוח בפתיחה עונתית שחוקה: "הקיץ כאן", "החורף הגיע", "הסתיו בפתח".
- אסור להשתמש במילים שיווקיות: "בשורה", "מוביל", "מיוחד", "הזדמנות", "עבורכם", "בשבילכם", "ייחודי".
- הפתיחה חייבת לבנות עניין לפני שמגיעים לפרסום: שאלה, מצב מוכר לנהג, הומור עדין על חיי היומיום בכביש.
- הומור עצמי ואמיתי: "מי שנכנס רק לקנות מים ויצא עם שקיות" - סיטואציות שנהגים מכירים מהחיים.
- אורך: לא יותר מ-12 שורות.

תוכן ואירועים:
- הפוסט חייב לעסוק בנסיעה, רכב, תדלוק או תחנת הדלק. לא בנושאים כלליים.
- השתמש לכל היותר באירוע אחד מהחודש, ורק אם הוא קשור ישירות לנהיגה.
${USED}

משחק מילים עם Ten:
- כשמתאים: שלב משחק מילים עם "Ten" - "תמיד 10", "10 מתוך 10", "ספרנו 10 סיבות", "אצלנו זה תמיד Ten מתוך Ten".

=== הקשר לחודש ===
עונה: ${season} ${weather} ${emoji}
אירועים אפשריים לחודש: ${HL}
${NW?"הקשר נוסף: "+NW:""}
תאריך: ${date||"לפי מבצע"}${day?" (יום "+day+")":""}
`;

  const EXAMPLES_MONDAY=`
=== דוגמאות לפוסטי שני חסכוני (ללמוד מהסגנון, לא להעתיק) ===

דוגמה 1:
"ביום שני כולם רוצים מכם משהו. ב-Ten זה הפוך.
הבוס רוצה דוחות, המיילים רוצים תשובות, השעון המעורר סתם אכזרי.
יום שני הוא היום שבו העולם לוקח מכם אנרגיה.
חוץ מב-Ten, ביום שני אתם דווקא מקבלים מאיתנו.
40 אגורות הנחה לליטר בנזין - פשוט כי זה יום שני.
תדלקו בתחנות Ten ביום שני, שלמו באפליקציה או עם כרטיס מועדון TenVIP.

עוד אין לכם את האפליקציה? מורידים מכאן:
${APP_LINK}"

דוגמה 2:
"תגידו, גם לכם זה קורה?
שכשאתם שומעים ברדיו את 'יום שישי את יודעת', אתם שרים באוטומט: 'יום ראשון דיכאון, יום שני חסכוני'.
טוב, זה ברור.
כי בימי שני אפשר לחסוך 40 אגורות לליטר בנזין בתחנות Ten.
מתדלקים באמצעות אפליקציית Ten או מצטרפים למועדון TenVIP בתחנה.

עוד אין לכם את האפליקציה? אפשר להתקין בכל יום, אבל עדיף היום:
${APP_LINK}"

=== כעת כתוב פוסט שני חסכוני חדש לגמרי ===
- שונה בסגנון ובפתיחה מהדוגמאות.
- עוסק אך ורק ביום שני ובחיסכון בדלק. אין מונדיאל, אין חג, אין עונה.
- שלב משחק מילים עם Ten אם מתאים.
- סיים חובה עם:
עוד אין לכם את האפליקציה? מורידים מכאן:
${APP_LINK}

${DISCLAIMER}`;

  const EXAMPLES_HAG=`
=== דוגמאות לפוסטי חג ואירוע (ללמוד מהסגנון, לא להעתיק) ===

דוגמה 1 (חנוכה):
"חנוכה הגיע, ותודו, זה אחד החגים הכי כיפים בשנה.
אז נכון, שנרות ותחנות דלק לא ממש הולכים ביחד,
אבל יש המון סיבות לעצור ב-Ten בחנוכה. ספרנו לפחות 10. (מפתיע, נכון?)
סיבה 1 - נס פך השמן זה אחלה, אבל האספרסו שלנו קטלני.
סיבה 5 - אמרתם נס פך השמן? השמן למנוע שלנו ירגיש כמו נס.
חג אורים שמח מצוות Ten."

דוגמה 2 (סוכות):
"אמרתם סוכות - אמרתם חול המועד.
אמרתם חול המועד - אמרתם טיולים, משפחה, ועצירות ב-Ten.
לים? למדבר? לחברים? עוצרים, ממלאים מיכל וקפה, מצטיידים בכל מה שצריך ויוצאים לדרך בראש שקט.
חג שמח מצוות Ten."

=== כעת כתוב פוסט לחג/אירוע: ${HL} ===
- קשור ישירות לנסיעה, לרכב או לתחנה.
- אם אין חג - כתוב פוסט על סיטואציה של נהגים הקשורה לתקופה.
- נסה משחק מילים עם Ten אם מתאים.
- סיים ב: ${DISCLAIMER}`;

  const EXAMPLES_FUN=`
=== דוגמאות לפוסטי מצחיק ומעורבות (ללמוד מהסגנון, לא להעתיק) ===

דוגמה 1:
"לכל מי שנמצא יום-יום על הכבישים, יש 'ניצחונות קטנים' שעושים את היום.
לתפוס גל ירוק ברצף.
למצוא חניה שמתפנה בדיוק כשהגעת.
שיר אהוב שמתחיל כשהתנעת.
וכמובן - תחנת Ten שמופיעה בדיוק ברגע הנכון.
מה הניצחון הקטן שלכם בנסיעות? ספרו לנו בתגובות."

דוגמה 2:
"אמרו לנו מה הנשנוש שלכם ב-Ten, ונאמר לכם מי אתם.
קפה ומאפה - הקלאסי. יודעים מה רוצים, לא מתחכמים.
משקה אנרגיה וחטיף חלבון - כן המפקד! משימתיים, ממוקדים, לא מפספסים.
קפה ובורקס - פתיתי שלג. שוברי מוסכמות בלי לעשות מהפכות.
אז איזה טיפוס אתם? ספרו בתגובות."

=== כעת כתוב פוסט מצחיק/מעורבות חדש ===
- סיטואציה שנהגים מכירים מהחיים - אמיתית, לא מומצאת.
- אסור לחזור על אירוע שאוזכר כבר בגאנט זה.
- קריאה לתגובות או לתיוג חברים.
- נסה לסיים עם משחק מילים על Ten.
- סיים: ${APP_LINK}`;

  const EXAMPLES_JOBS=`
=== דוגמאות לפוסטי דרושים (ללמוד מהסגנון, לא להעתיק) ===

דוגמה 1:
"מה הופך מקום עבודה לכזה שכיף לקום אליו כל בוקר?
האנשים שאיתך, האפשרות לעזור לאנשים, הידיעה שסומכים עליך.
טוב, ובואו נהיה אמיתיים - זה עוזר כשהקפה הכי טוב נמצא במרחק נגיעה.
אם יש לכם אנרגיה טובה ורוצים להצטרף למשפחה שהיא הרבה יותר ממקום עבודה, אנחנו מחפשים אתכם.
Ten מציעה: שכר הוגן, קידום אמיתי, הטבות על דלק ובחנות.
שלחו וואטסאפ (מגיל 18 ומעלה בלבד) למספר 054-3207261
או היכנסו לאתר: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94"

דוגמה 2:
"יש לכם אנרגיה טובה ואהבה לאנשים? אנחנו מחפשים אתכם.
Ten מגייסת עובדים שאוהבים להתקדם, באווירה מעולה, עם אנשים טובים מסביב.
מה תקבלו? עבודה יציבה, קידום מהיר, הטבות על דלק.
שלחו וואטסאפ (מגיל 18 ומעלה בלבד) למספר 054-3207261
או היכנסו לאתר: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94"

=== כעת כתוב פוסט דרושים חדש לגמרי ===
- שונה בגישה ובפתיחה מהדוגמאות. לא אותה מבנה.
- Ten היא נקבה: "Ten מגייסת", "Ten מחפשת", "Ten מציעה".
- לסיים חובה עם:
שלחו וואטסאפ (מגיל 18 ומעלה בלבד) למספר 054-3207261
או היכנסו לאתר: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94`;

  const EXAMPLES_PROMO=`
=== דוגמאות לפוסטי מבצע (ללמוד מהסגנון, לא להעתיק) ===

דוגמה 1 (מגבים):
"כמו בכל חורף, אתם משתתפים ללא ידיעתכם באתגר המגבים הגדול.
האם תצליחו להחליף מגבים לפני שמבול יתפוס אתכם עם מגב שחוק?
ואנחנו כל כך רוצים שתצליחו, שסידרנו מבצע:
זוג מגבי PLATINUM - רק ב-59.90 שקלים.
משלמים באפליקציה? קחו זוג מגבי PLATINUM ב-49.90 שקלים בלבד.
עוד אין לכם את האפליקציה? מורידים מפה: ${APP_LINK}"

דוגמה 2 (בוסטר התנעה):
"אף אחד לא אוהב להיתקע עם רכב לא מניע.
אבל כשיש לכם בוסטר התנעה שקניתם אצלנו ב-299 שקלים,
והוא כל כך פשוט לשימוש שכמעט תרצו שמדי פעם הרכב לא יניע...
(כמעט, אמרנו כמעט.)
רוצו להצטייד בתחנות ובחנויות הנוחות של Ten."

=== כעת כתוב פוסט מבצע עבור: ${promoText||"מוצר לרכב"} ===
- התחל ממצב שהנהג מכיר - לא מהמוצר עצמו.
- ציין מחיר רגיל ומחיר אפליקציה אם רלוונטי.
- Ten היא נקבה בכל הטקסט.
- סיים חובה עם:
עוד אין לכם את האפליקציה? מורידים מכאן:
${APP_LINK}
${DISCLAIMER}`;

  if(type==="שני חסכוני") return RULES+EXAMPLES_MONDAY;
  if(type==="חג / אירוע") return RULES+EXAMPLES_HAG;
  if(type==="מצחיק / אפליקציה") return RULES+EXAMPLES_FUN;
  if(type==="דרושים") return RULES+EXAMPLES_JOBS;
  if(type==="פוסט מבצע") return RULES+EXAMPLES_PROMO;
  return RULES+"כתוב פוסט כללי לתחנות Ten. קשור לרכב, דלק או נסיעה. Ten היא נקבה. סיים ב: "+DISCLAIMER;
}

const SB_HDR={"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY};
export async function uploadImage(file){
  const ext=file.name.split('.').pop();
  const path=`images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const res=await fetch(`${SUPABASE_URL}/storage/v1/object/gantt-images/${path}`,{
    method:"POST",
    headers:{...SB_HDR,"Content-Type":file.type},
    body:file
  });
  if(!res.ok) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/gantt-images/${path}`;
}
export async function saveGantt(ganttData){const id=ganttData.year+"-"+ganttData.month+"-"+Math.random().toString(36).slice(2,7);try{await fetch(SUPABASE_URL+"/rest/v1/gantts",{method:"POST",headers:{...SB_HDR,"Prefer":"return=minimal"},body:JSON.stringify({id,year:ganttData.year,month:ganttData.month,ne:ganttData.extraCtx||"",posts:ganttData.posts,created_at:new Date().toISOString()})});}catch(e){console.error("save error",e);}return id;}
export async function loadGantt(shareKey){try{const r=await fetch(SUPABASE_URL+"/rest/v1/gantts?id=eq."+shareKey+"&select=id,year,month,ne,posts,created_at",{headers:SB_HDR});const d=await r.json();if(!d[0])return null;const g=d[0];return{month:g.month,year:g.year,extraCtx:g.ne||"",posts:g.posts||[]};}catch{return null;}}
export async function listGantts(){try{const r=await fetch(SUPABASE_URL+"/rest/v1/gantts?select=id,year,month,ne,posts,created_at&order=created_at.desc&limit=30",{headers:SB_HDR});const d=await r.json();if(!Array.isArray(d))return[];return d.map(g=>({id:g.id,created_at:g.created_at,data:{month:g.month,year:g.year,extraCtx:g.ne||"",posts:g.posts||[]}}));}catch{return[];}}
export async function deleteGantt(id) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/gantts?id=eq.${id}`, {
      method: "DELETE",
      headers: SB_HDR
    });
  } catch(e) { console.error(e); }
}
