// ── כלים ──
import React,{useState}from"react";
import{PU,WH,BL,APP_LINK,DISCLAIMER,MHE,SUPABASE_URL,SUPABASE_KEY}from"./constants.js";
export const SLogo=({src,alt,style})=>{const[e,sE]=useState(false);if(e||!src)return<div style={{...style,display:"flex",alignItems:"center",justifyContent:"center",background:PU,color:WH,fontWeight:"bold",fontSize:(style.width||40)/3,borderRadius:"8px"}}>{alt}</div>;return<img src={src} alt={alt} style={style} onError={()=>sE(true)}/>;};
export const BADGE={"שני חסכוני":["#DBEAFE","#1565C0"],"חג / אירוע":["#DCFCE7","#166534"],"מצחיק / אפליקציה":["#FEF3C7","#92400E"],"דרושים":["#FCE7F3","#9D174D"],"פוסט מבצע":["#FFE4E6","#9F1239"]};
export const Badge=({t})=>{const[bg,c]=BADGE[t]||["#F3F4F6","#374151"];return<span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color:c,whiteSpace:"nowrap"}}>{t}</span>;};
export function dayName(d,m,y){return["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"][new Date(y,m-1,d).getDay()];}
export async function callAI(prompt){try{const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});if(!r.ok)throw new Error();const d=await r.json();return(d.text||"").trim();}catch{return"שגיאה. נסה שוב.";}}

export function buildPrompt(type,ctx,date,day,promoText=""){
  const{season,weather,holidays,news,emoji}=ctx;
  const HL=holidays||"ללא";
  const NW=news||(ctx.extra||"");

  const RULES=`
כללי ברזל - חובה לקיים את כולם:
1. כתוב אך ורק בעברית תקינה ומדויקת - ללא שגיאות כתיב, פיסוק או הגהה.
2. אסור להשתמש במקף הארוך (—). אם צריך מקף, רק מקף רגיל (-).
3. STRICT: לא יותר מ-2 אימוג'ים בכל הפוסט. לא 3, לא 4. מקסימום 2. ספור אותם לפני שאתה מסיים.
4. הפוסט חייב להיות קשור ישירות לרכב, דלק, תדלוק, נסיעה או תחנת הדלק.
5. אסור לפתוח עם "!" בשורה הראשונה. אסור פתיחה עונתית שחוקה ("הקיץ כאן", "החורף הגיע" וכד').
6. אסור להשתמש במילות מפתח שיווקיות: "בשורה", "מוביל", "מיוחד", "הזדמנות מעולה", "בשבילכם".
7. הפתיחה: שאלה, מצב מוכר לנהג, או הומור עדין - לפני שמגיעים לפרסום.
8. סגנון: חברי ואישי, כמו חבר שמספר לחבר. קצר וחד, לא יותר מ-12 שורות.
9. אירועי החודש: השתמש לכל היותר באירוע אחד, ורק אם הוא קשור ישירות לרכב או נסיעה.
10. משחק מילים: כשרלוונטי, נסה לשלב משחק מילים עם השם "Ten" - "תמיד 10", "10 מתוך 10", "ספרנו 10 סיבות", "Ten לי את ה..", "Ten בראש".

הקשר לחודש (השתמש באירוע אחד בלבד, לא בכולם):
עונה: ${season} ${weather} ${emoji}
אירועים אפשריים לחודש: ${HL}
${NW?"הקשר נוסף שביקשו: "+NW:""}
תאריך הפוסט: ${date||"לפי מבצע"}${day?" (יום "+day+")":""}
`;

  const EXAMPLES_MONDAY=`
דוגמאות לפוסטי שני חסכוני (ללמוד מהסגנון, לא להעתיק):

דוגמה 1:
"ביום שני כולם רוצים מכם משהו.
ב-Ten זה הפוך.
הבוס רוצה דוחות, המיילים רוצים תשובות, קבוצת הגן רוצה מתנדב לעוגה והשעון המעורר... טוב, הוא סתם אכזרי.
יום שני הוא היום שבו העולם לוקח מכם אנרגיה.
חוץ מב-Ten, ביום שני אתם דווקא מקבלים מאיתנו.
40 אגורות הנחה לליטר בנזין. פשוט כי זה יום שני.
תדלקו בתחנות Ten ביום שני, שלמו באפליקציה או עם כרטיס מועדון VIP."

דוגמה 2:
"מה עושה את שני כל כך מושלם?
שביזות יום ראשון שכבר נעלמה? השאריות משבת נגמרו?
לא.
זה שני חסכוני.
באים לתדלק בתחנות Ten ביום שני, מתדלקים באמצעות אפליקציית Ten או מצטרפים למועדון VIP בתחנה,
ונהנים מ-40 אגורות חיסכון לליטר בנזין.
בוקר טוב, לעוד יום שני מושלם."

כתוב כעת פוסט שני חסכוני חדש לגמרי - שונה בסגנון ובפתיחה מהדוגמאות.
חשוב: הפוסט הזה עוסק רק ביום שני ובחיסכון בדלק - ללא אזכור מונדיאל, חג, חום, קיץ או חורף.
אם מתאים, שלב משחק מילים עם Ten, למשל: "Ten לא מבטיח לכם שני קל, אבל Ten כן מבטיח 40 אגורות".
סיים עם:
עוד אין לכם את האפליקציה? מורידים מכאן:
${APP_LINK}

${DISCLAIMER}`;

  const EXAMPLES_HAG=`
דוגמאות לפוסטי חג (ללמוד מהסגנון, לא להעתיק):

דוגמה 1 (חנוכה):
"חנוכה הגיע, ותודו, זה אחד החגים הכי כיפים בשנה.
אז נכון, שנרות ותחנות דלק הם לא ממש חברים טובים,
אבל יש בכל זאת המון סיבות לעצור ב-Ten בחנוכה.
אנחנו ספרנו לפחות 10 (מפתיע, נכון?)
סיבה 1 - נס פך השמן זה אחלה, אבל האספרסו שלנו קטלני.
סיבה 5 - אמרתם נס פך השמן? השמן למנוע שלנו באמת ירגיש כמו נס.
חג אורים שמח!"

דוגמה 2 (סוכות):
"אמרתם סוכות - אמרתם חול המועד.
אמרתם חול המועד - אמרתם טיולים, משפחה, ועצירות ב-Ten.
לים? למדבר? לחברים?
עוצרים, ממלאים מיכל וקפה, מצטיידים בכל מה שצריך ויוצאים לדרך בראש שקט.
חג שמח מצוות Ten."

כתוב כעת פוסט לחג: ${HL}. חייב להיות קשור ישירות לנסיעה, לרכב או לתחנה.
אם אין חג בחודש - כתוב פוסט אירוע/עונה שקשור לנהיגה.
נסה לשלב משחק מילים עם Ten אם מתאים (דוגמה: "ספרנו 10 סיבות לעצור ב-Ten בחנוכה").
סיים ב: ${DISCLAIMER}`;

  const EXAMPLES_FUN=`
דוגמאות לפוסטי מצחיק/מעורבות (ללמוד מהסגנון, לא להעתיק):

דוגמה 1:
"לכל מי שנמצא יום-יום על הכבישים, יש תמיד 'ניצחונות קטנים' שיכולים לעשות לו את היום.
למשל:
לתפוס גל ירוק וכל הרמזורים נפתחים לך ברצף.
למצוא חניה מושלמת שמתפנה ברגע שהגעת.
שיר אהוב שמתחיל להתנגן כשהתנעת.
וכמובן - תחנת דלק של Ten שמגיעה בדיוק ברגע הנכון.
מה הניצחון הקטן שלכם בנסיעות? ספרו לנו בתגובות."

דוגמה 2:
"מה שהזמנת ב-Ten לעומת מה שקיבלת...
זה בדיוק אותו הדבר.
דלק איכותי, שירות יוצא מן הכלל, מבצעים מעולים, קפה טוב וכל מה שצריך לדרך.
הכל - 10 מתוך 10."

כתוב כעת פוסט מצחיק/מעורבות חדש. חייב לכלול:
- קשר ישיר לנהיגה, רכב, תחנת דלק
- אסור לאזכר שוב את אותו אירוע שאוזכר בפוסטים אחרים
- קריאה לתגובות או תיוג
- נסה לסיים עם משחק מילים על Ten (למשל: "כי אצלנו זה תמיד 10 מתוך 10")
- סיים: ${APP_LINK}`;

  const EXAMPLES_JOBS=`
דוגמאות לפוסטי דרושים (ללמוד מהסגנון, לא להעתיק):

דוגמה 1:
"מה הופך מקום עבודה לכזה שכיף לקום אליו כל בוקר?
האנשים שאיתך, האפשרות באמת לעזור לאנשים, הידיעה שסומכים עליך, והאופק לעתיד.
טוב, ובואו נהיה אמיתיים - זה עוזר כשהקפה הכי טוב והנשנושים הכי שווים נמצאים במרחק נגיעה.
אם יש לכם אנרגיה טובה ורוצים להצטרף למשפחה שהיא הרבה יותר ממקום עבודה, אנחנו מחפשים אתכם.
ב-Ten תמצאו: שכר הוגן, קידום אמיתי, הטבות שוות על דלק.
שלחו וואטסאפ (מגיל 18) למספר 054-3207261 או היכנסו: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94"

דוגמה 2:
"יש לכם אנרגיה טובה ואהבה לאנשים? אנחנו מחפשים אתכם.
יש לכם הזדמנות להפיץ את הטוב ולהפוך כל עצירה בדרך לחוויה חיובית.
Ten מגייסת - עובדים שאוהבים להתקדם באווירה מעולה ועם המון חברים טובים.
מה תקבלו? עבודה יציבה, קידום מהיר, הטבות על דלק.
להגשת מועמדות מגיל 18: וואטסאפ 054-3207261 או https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94"

כתוב כעת פוסט דרושים חדש לגמרי - שונה בגישה ובפתיחה מהדוגמאות.
חייב לכלול בסוף:
שלחו וואטסאפ (מגיל 18 ומעלה בלבד) למספר 054-3207261
או היכנסו לאתר: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94`;

  const EXAMPLES_PROMO=`
דוגמאות לפוסטי מבצע (ללמוד מהסגנון, לא להעתיק):

דוגמה 1 (מגבים):
"כמו בכל חורף, גם השנה אתם משתתפים ללא ידיעתכם באתגר המגבים הגדול.
מה זה? האם תצליחו להחליף מגבים לפני שיתפוס אתכם מבול שלא תראו בו כלום בגלל המגב השחוק.
ואנחנו כל כך רוצים שתצליחו, שסידרנו לכם יופי של מבצע:
זוג מגבי PLATINUM - רק ב-59.90 שקלים.
משלמים באפליקציה? זוג מגבי PLATINUM ב-49.90 שקלים בלבד."

דוגמה 2 (בוסטר התנעה):
"אף אחד לא אוהב להיתקע עם רכב לא מניע.
אבל כשיש לכם בוסטר התנעה שקניתם אצלנו ב-299 שקלים בלבד,
והוא כל כך פשוט לשימוש, שכמעט תרצו שמדי פעם הרכב לא יניע...
(כמעט, אמרנו כמעט)
רוצו להצטייד בתחנות ובחנויות הנוחות של Ten."

כתוב כעת פוסט מבצע עבור: ${promoText||"מוצר/שירות מיוחד"}
הפוסט חייב:
- להתחיל ממצב של הנהג/הלקוח, לא מהמוצר
- לציין מחיר רגיל ומחיר אפליקציה אם רלוונטי
- לסיים: ${DISCLAIMER}
עוד אין לכם את האפליקציה? מורידים מכאן:
${APP_LINK}`;

  if(type==="שני חסכוני") return RULES+EXAMPLES_MONDAY;
  if(type==="חג / אירוע") return RULES+EXAMPLES_HAG;
  if(type==="מצחיק / אפליקציה") return RULES+EXAMPLES_FUN;
  if(type==="דרושים") return RULES+EXAMPLES_JOBS;
  if(type==="פוסט מבצע") return RULES+EXAMPLES_PROMO;
  return RULES+"כתוב פוסט כללי לתחנות Ten. קשור לרכב, דלק או נסיעה. סיים ב: "+DISCLAIMER;
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
