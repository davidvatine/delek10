import React, { useState } from "react";
import { PU, WH, BL, APP_LINK, DISCLAIMER, MHE, SUPABASE_URL, SUPABASE_KEY } from "./constants.js";

// --- רכיבים תצוגתיים ---
export const SLogo = ({ src, alt, style }) => {
    const [e, sE] = useState(false);
    if (e || !src) return <div style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", background: PU, color: WH, fontWeight: "bold", fontSize: (style.width || 40) / 3, borderRadius: "8px" }}>{alt}</div>;
    return <img src={src} alt={alt} style={style} onError={() => sE(true)} />;
};

export const Badge = ({ t }) => {
    const BADGE = {
        "שני חסכוני": ["#DBEAFE", "#1565C0"],
        "חג / אירוע": ["#DCFCE7", "#166534"],
        "מצחיק / אפליקציה": ["#FEF3C7", "#92400E"],
        "דרושים": ["#FCE7F3", "#9D174D"],
        "פוסט מבצע": ["#FFE4E6", "#9F1239"]
    };
    const [bg, c] = BADGE[t] || ["#F3F4F6", "#374151"];
    return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: bg, color: c, whiteSpace: "nowrap" }}>{t}</span>;
};

export function dayName(d, m, y) {
    return ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"][new Date(y, m - 1, d).getDay()];
}

// --- לוגיקת AI עם מנגנון יצירתיות ---
export async function callAI(prompt) {
    try {
        const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
        if (!r.ok) throw new Error();
        const d = await r.json();
        return (d.text || "").trim();
    } catch { return "שגיאה ביצירת התוכן."; }
}

export function buildPrompt(type, ctx, date, day, promoText = "") {
    const { season, weather, holidays, news } = ctx;

    const CREATIVE_STRATEGY = `
אסטרטגיית תוכן:
אנחנו מחפשים את ה"אמת" הקטנה והמעצבנת של הנהג הישראלי ומחברים אותה ל-Ten[cite: 2, 4, 6].
הטון: שנון, קצת חוצפן, אבל תמיד חיובי[cite: 2, 8].

חוקי עברית (קדושים):
- "Ten" היא נקבה (תחנה/רשת). היא תמיד "נותנת" או "מפנקת"[cite: 2, 6].
- מספרים: שלוש שקיות (נקבה), שלושה שקלים (זכר).
- בלי תרגום מכונה: "הסוללה נגמרה" (לא הטלפון), "הילד צועק" (לא מסרב להתפשט), "שלוש שקיות" (לא שלושה)[cite: 2, 10].
- מקף רגיל (-) בלבד. 1-3 אימוג'ים מקסימום.
`;

    const TYPE_PROMPTS = {
        "שני חסכוני": `
המשימה: כתוב פוסט ל"שני חסכוני" (40 אג' הנחה).
הקריאייטיב: בחר סיטואציה אחת שונה בכל פעם:
1. פקק שבו כולם צופרים לחינם.
2. הבוס ששולח משימה "דחופה" לאתמול.
3. הילד שצריך להסיע לחוג בדיוק כשיש שיחה חשובה.
חבר את זה לזה ש-Ten היא הנקודה השפויה והמשתלמת ביום הזה[cite: 2, 8].`,

        "חג / אירוע": `
המשימה: פוסט ל${holidays || season}.
הקריאייטיב: אל תכתוב "חג שמח". כתוב על הצידנית שנוזלת בבגאז', על זה ששכחתם את המתנה אצל הדודה, או על התור בדרך לחרמון/אילת. 
Ten היא העצירה שתציל את הטיול[cite: 2, 8].`,

        "מצחיק / אפליקציה": `
המשימה: פוסט POV או מעורבות.
הקריאייטיב: תתמקד בסטטיסטיקה מצחיקה. למשל: "90% מהאנשים שנכנסים ל-Ten לקנות רק מים, יוצאים עם קפה ומאפה כי הריח גמר אותם"[cite: 4, 10].`,

        "דרושים": `
המשימה: גיוס עובדים.
הקריאייטיב: תמכור את ה"וויב". עבודה עם אנשים, מזגן בשירות עצמי, והטבות דלק[cite: 2, 6, 8]. בלי קלישאות זוגיות.`,

        "פוסט מבצע": `
המשימה: מבצע על ${promoText}.
הקריאייטיב: תאר רגע של "תסכול" (המגב משאיר סימן על השמשה, המצבר מוציא קול של גסיסה). Ten היא ה"עזרה הראשונה" לרכב[cite: 2, 4, 6].`
    };

    const currentPrompt = TYPE_PROMPTS[type] || "כתוב פוסט יצירתי על Ten.";

    return CREATIVE_STRATEGY + `
נתונים ליצירה:
תאריך: ${date} (${day})
עונה/חג: ${season}, ${holidays || "אין"}
חדשות/הקשר: ${news || "אין"}

כתוב פוסט מקורי, שונה מהקודמים, בעברית מושלמת (זכור: שלוש שקיות, Ten נותנת):
`;
}

// --- פונקציות Supabase נשארות כפי שהיו ---
const SB_HDR = { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY };

export async function uploadImage(file) {
    const ext = file.name.split('.').pop();
    const path = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/gantt-images/${path}`, {
        method: "POST", headers: { ...SB_HDR, "Content-Type": file.type }, body: file
    });
    if (!res.ok) return null;
    return `${SUPABASE_URL}/storage/v1/object/public/gantt-images/${path}`;
}

export async function saveGantt(ganttData) {
    const id = ganttData.year + "-" + ganttData.month + "-" + Math.random().toString(36).slice(2, 7);
    try {
        await fetch(SUPABASE_URL + "/rest/v1/gantts", {
            method: "POST", headers: { ...SB_HDR, "Prefer": "return=minimal" },
            body: JSON.stringify({ id, year: ganttData.year, month: ganttData.month, ne: ganttData.extraCtx || "", posts: ganttData.posts, created_at: new Date().toISOString() })
        });
    } catch (e) { console.error("save error", e); }
    return id;
}

export async function loadGantt(shareKey) {
    try {
        const r = await fetch(SUPABASE_URL + "/rest/v1/gantts?id=eq." + shareKey + "&select=id,year,month,ne,posts,created_at", { headers: SB_HDR });
        const d = await r.json();
        if (!d[0]) return null;
        const g = d[0];
        return { month: g.month, year: g.year, extraCtx: g.ne || "", posts: g.posts || [] };
    } catch { return null; }
}

export async function listGantts() {
    try {
        const r = await fetch(SUPABASE_URL + "/rest/v1/gantts?select=id,year,month,ne,posts,created_at&order=created_at.desc&limit=30", { headers: SB_HDR });
        const d = await r.json();
        if (!Array.isArray(d)) return [];
        return d.map(g => ({ id: g.id, created_at: g.created_at, data: { month: g.month, year: g.year, extraCtx: g.ne || "", posts: g.posts || [] } }));
    } catch { return []; }
}

export async function deleteGantt(id) {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/gantts?id=eq.${id}`, { method: "DELETE", headers: SB_HDR });
    } catch (e) { console.error(e); }
}
