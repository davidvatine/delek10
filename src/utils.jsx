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
    const { season, weather, holidays, news, emoji } = ctx;

    const SYSTEM_RULES = `
תפקיד: אתה מנהל קריאייטיב בכיר. המותג: תחנות דלק Ten. 
קהל יעד: נהגים ישראלים עייפים שרוצים רגע של נחת.
טון דיבור: חברי, שנון, "בגובה העיניים", ישראלי מאוד אבל תרבותי.

חוקי ברזל (חובה):
1. עברית מושלמת 2000%: ללא שגיאות כתיב, פיסוק או הגהה.
2. אסור להשתמש במקף ארוך (—). השתמש רק במקף רגיל (-).
3. הגבלת אימוג'ים: מקסימום 2 אימוג'ים בכל הפוסט.
4. מבנה פוסט: הוק (פתיחה) מבוסס סיטואציה -> חיבור ל-Ten -> הצעה/מבצע -> הנעה לפעולה.
5. איסור פתיחות שחוקות: אל תפתח ב"חג שמח", "הקיץ כאן" או "צריכים דלק?". תתחיל מהחיים עצמם.
6. מילים אסורות: "בשורה", "מיוחד", "הזדמנות", "מוביל", "שלנו", "עבורכם".
7. אורך: עד 12 שורות קצרות.
`;

    const MONDAY_TEMPLATE = `
סוג פוסט: שני חסכוני (40 אגורות הנחה).
קונספט: יום שני הוא היום שבו כולם לוקחים ממך אנרגיה (הבוס, הילדים, הפקקים) - ו-Ten היא היחידה שמחזירה לך.
דוגמה לסגנון[cite: 2, 6]: "ביום שני כולם רוצים מכם משהו. ב-Ten זה הפוך. הבוס רוצה דוחות, המיילים רוצים תשובות... יום שני הוא היום שבו העולם לוקח מכם אנרגיה. חוץ מב-Ten."
דרישה: כתוב פוסט "שני חסכוני" חדש ומקורי. השתמש במשחק מילים עם המילה Ten (למשל: "זה לא הופך את יום שני לקל, אבל זה הופך אותו ל-10").
סיים ב: ${APP_LINK}
${DISCLAIMER}`;

    const HOLIDAY_TEMPLATE = `
סוג פוסט: חג/אירוע (${holidays || "כללי"}).
קונספט: חבר את החג לנסיעה, לרכב או לעצירה להתרעננות.
דוגמה[cite: 2, 10]: "בדרך לנטיעות עוצרים ב... Ten כמובן! אבל לפני שאתם נוטעים שורשים בפקקים - עוצרים ב-Ten."
דרישה: אל תכתוב "חג שמח" גנרי. כתוב על החוויה של הנהג בחג הזה (הפקקים למשפחה, הילדים מאחורה).
סיים ב: ${DISCLAIMER}`;

    const FUN_TEMPLATE = `
סוג פוסט: מצחיק / POV / אינטראקציה.
קונספט: "האמת" של הנהגים.
דוגמה: "כשאני נכנסת לתדלק: 'רק דלק'. כשאני בתוך Ten: 'עם כאלה מבצעים אני קונה את כל החנות'."
דרישה: צור סיטואציה משעשעת על הכביש, על הקפה של הבוקר או על האפליקציה שחוסכת כסף. סיים עם משחק מילים על Ten.
סיים ב: ${APP_LINK}`;

    const JOBS_TEMPLATE = `
סוג פוסט: דרושים.
קונספט: עבודה שהיא משפחה, מקום שכיף לקום אליו (ובעיקר שיש בו מזגן וקפה טוב).
דוגמה[cite: 2, 6]: "מחפשים את ה-Match המושלם? ולנטיינ'ס זו הזדמנות למצוא זוגיות ארוכת טווח ב-Ten. משפחה שכן בוחרים."
דרישה: הנעה לפעולה בוואטסאפ למספר 054-3207261.
סיים ב: שלחו לנו וואטסאפ (מגיל 18 ומעלה בלבד) למספר 054-3207261.
או הכנסו לאתר: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94`;

    const PROMO_TEMPLATE = `
סוג פוסט: מבצע על ${promoText}.
קונספט: למה הנהג צריך את זה עכשיו?
דוגמה[cite: 2, 4]: "אף אחד לא אוהב להיתקע עם רכב לא מניע. אבל כשיש לכם בוסטר התנעה שקניתם אצלנו... שכמעט תרצו שהרכב לא יניע."
דרישה: תאר סיטואציה מעצבנת (מצבר מת, מגבים חורקים) והצג את הפתרון של Ten עם מחיר רגיל ומחיר אפליקציה.
סיים ב: ${APP_LINK}
${DISCLAIMER}`;

    let selectedTemplate = "";
    if (type === "שני חסכוני") selectedTemplate = MONDAY_TEMPLATE;
    else if (type === "חג / אירוע") selectedTemplate = HOLIDAY_TEMPLATE;
    else if (type === "מצחיק / אפליקציה") selectedTemplate = FUN_TEMPLATE;
    else if (type === "דרושים") selectedTemplate = JOBS_TEMPLATE;
    else if (type === "פוסט מבצע") selectedTemplate = PROMO_TEMPLATE;
    else selectedTemplate = "כתוב פוסט כללי יצירתי על תחנת דלק Ten. סיים ב: " + DISCLAIMER;

    return SYSTEM_RULES + `
הקשר נוכחי:
תאריך: ${date} (יום ${day})
עונה/מזג אוויר: ${season}, ${weather}
אירוע: ${holidays || "אין"}
מידע נוסף: ${news || ""}

` + selectedTemplate;
}

// --- פונקציות שמירה וניהול (Supabase) ---
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
