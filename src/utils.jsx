import React, { useState } from "react";
import { PU, WH, BL, APP_LINK, DISCLAIMER, MHE, SUPABASE_URL, SUPABASE_KEY } from "./constants.js";

// --- רכיבים תצוגתיים ---
export const SLogo = ({ src, alt, style }) => {
    const [e, sE] = useState(false);
    if (e || !src) return <div style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", background: PU, color: WH, fontWeight: "bold", fontSize: (style.width || 40) / 3, borderRadius: "8px" }}>{alt}</div>;
    return <img src={src} alt={alt} style={style} onError={() => sE(true)} />;
};

export const BADGE = {
    "שני חסכוני": ["#DBEAFE", "#1565C0"],
    "חג / אירוע": ["#DCFCE7", "#166534"],
    "מצחיק / אפליקציה": ["#FEF3C7", "#92400E"],
    "דרושים": ["#FCE7F3", "#9D174D"],
    "פוסט מבצע": ["#FFE4E6", "#9F1239"]
};

export const Badge = ({ t }) => {
    const [bg, c] = BADGE[t] || ["#F3F4F6", "#374151"];
    return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: bg, color: c, whiteSpace: "nowrap" }}>{t}</span>;
};

export function dayName(d, m, y) {
    return ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"][new Date(y, m - 1, d).getDay()];
}

// --- לוגיקת AI ופרומפטים ---
export async function callAI(prompt) {
    try {
        const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
        if (!r.ok) throw new Error();
        const d = await r.json();
        return (d.text || "").trim();
    } catch { return "שגיאה ביצירת התוכן. נסה שוב."; }
}

export function buildPrompt(type, ctx, date, day, promoText = "") {
    const { season, weather, holidays, news } = ctx;

    const SYSTEM_RULES = `
תפקיד: מנהל קריאייטיב בכיר של רשת תחנות הדלק Ten.
קהל יעד: נהגים ישראלים.
שפה: עברית חדה, שנונה, חברית. "סלנג תקני" (בלי המצאת מילים).

כללי ברזל (חובה):
1. עברית מושלמת 2000%: ללא שגיאות כתיב, פיסוק או הגהה.
2. דקדוק: "Ten" היא חברה/תחנה ולכן היא נקבה. (Ten מבטיחה, Ten נותנת).
3. אימוג'ים: חובה בין 1 ל-3 אימוג'ים בלבד. לא יותר, לא פחות.
4. אסור להשתמש במקף ארוך (—). רק מקף רגיל (-).
5. פתיחה: תמיד מסיטואציה יומיומית של נהג/ת (פקקים, הבוס, הילדים, רעב). בלי קלישאות.
6. מילים אסורות: "בשורה", "מיוחד", "הזדמנות", "מוביל", "הכי טוב", "שלנו", "עבורכם".
7. אורך: מקסימום 12 שורות קצרות.
`;

    const MONDAY_TEMPLATE = `
סוג: שני חסכוני (40 אג' הנחה).
הקשר: יום שני בישראל הוא אמצע השבוע. כולם לוקחים ממך אנרגיה - Ten היחידה שנותנת.
דרישה: אל תכתוב "יום שני קשה". תכתוב על המייל מהבוס או הילד ששכח בריסטול.
סיים ב: ${APP_LINK}
${DISCLAIMER}`;

    const HOLIDAY_TEMPLATE = `
סוג: חג/אירוע (${holidays || "כללי"}).
הקשר: טיולים משפחתיים, פקקים בחול המועד, עצירה לקפה בדרך לצפון/דרום.
דרישה: חבר את החג לנסיעה. אל תברך "חג שמח" גנרי.
סיים ב: ${DISCLAIMER}`;

    const FUN_TEMPLATE = `
סוג: מצחיק / POV / מעורבות.
הקשר: "האמת" של הנהגים. (למשל: נכנסים רק לשלם ויוצאים עם חצי חנות נוחות).
דרישה: קצר, קולע, מעודד תגובות או תיוגים. סיים עם משחק מילים על Ten.
סיים ב: ${APP_LINK}`;

    const JOBS_TEMPLATE = `
סוג: דרושים.
הקשר: מקום שכיף לקום אליו, צוות צעיר, עבודה מועדפת.
דרישה: השתמש במושגים "משפחה שכן בוחרים" או "אנרגיה טובה". בלי קלישאות זוגיות.
סיים ב: שלחו לנו וואטסאפ (מגיל 18 ומעלה בלבד) למספר 054-3207261.
או הכנסו לאתר: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94`;

    const PROMO_TEMPLATE = `
סוג: מבצע על ${promoText}.
הקשר: סיטואציה שבה הנהג צריך את המוצר (מצבר מת, גשם ראשון ומגבים חורקים).
דרישה: מחיר רגיל מול מחיר אפליקציה. הצג את הפתרון של Ten.
סיים ב: ${APP_LINK}
${DISCLAIMER}`;

    let template = "";
    if (type === "שני חסכוני") template = MONDAY_TEMPLATE;
    else if (type === "חג / אירוע") template = HOLIDAY_TEMPLATE;
    else if (type === "מצחיק / אפליקציה") template = FUN_TEMPLATE;
    else if (type === "דרושים") template = JOBS_TEMPLATE;
    else if (type === "פוסט מבצע") template = PROMO_TEMPLATE;
    else template = "כתוב פוסט שנון על חוויית הנסיעה ועצירה ב-Ten. סיים ב: " + DISCLAIMER;

    return SYSTEM_RULES + `
הקשר ליצירה:
תאריך: ${date} (יום ${day})
עונה: ${season}, ${weather}
אירוע/חדשות: ${holidays || "אין"} ${news || ""}

` + template;
}

// --- ניהול קבצים ושמירה ---
const SB_HDR = { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY };

export async function uploadImage(file) {
    const ext = file.name.split('.').pop();
    const path = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/gantt-images/${path}`, {
        method: "POST",
        headers: { ...SB_HDR, "Content-Type": file.type },
        body: file
    });
    if (!res.ok) return null;
    return `${SUPABASE_URL}/storage/v1/object/public/gantt-images/${path}`;
}

export async function saveGantt(ganttData) {
    const id = ganttData.year + "-" + ganttData.month + "-" + Math.random().toString(36).slice(2, 7);
    try {
        await fetch(SUPABASE_URL + "/rest/v1/gantts", {
            method: "POST",
            headers: { ...SB_HDR, "Prefer": "return=minimal" },
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
