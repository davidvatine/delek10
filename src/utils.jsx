import React, { useState } from "react";
import { PU, WH, BL, APP_LINK, DISCLAIMER, MHE, SUPABASE_URL, SUPABASE_KEY } from "./constants.js";

// --- רכיבים תצוגתיים ---
export const SLogo = ({ src, alt, style }) => {
    const [e, sE] = useState(false);
    if (e || !src) return <div style={{ ...style, display: "flex", alignItems: "center", justifyCenter: "center", background: PU, color: WH, fontWeight: "bold", fontSize: (style.width || 40) / 3, borderRadius: "8px" }}>{alt}</div>;
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

// --- לוגיקת AI ופרומפטים (הגרסה המושלמת) ---
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
תפקיד: מנהל קריאייטיב וקופירייטר בכיר בישראל. המותג: תחנות דלק Ten.
שפת כתיבה: עברית חדה, ישראלית, חברית ושנונה.
Strcit Rules - חוקים שאין להפר:
1. עברית מושלמת: וודא הטיות זכר/נקבה. אם הפוסט פונה לזכר, הוא נשאר זכר לכל אורכו. אם לנקבה, נשאר נקבה.
2. איסור מוחלט על "תרגום מכונה": אל תמציא פעלים כמו "מזגינים" או "מאותך".
3. שם המותג: Ten היא חברה (נקבה). Ten נותנת, Ten מבטיחה.
4. אימוג'ים: 1 עד 3 בלבד.
5. סימני פיסוק: אין מקף ארוך (—), רק מקף רגיל (-).
6. אל תהיה גנרי: אל תכתוב "הקיץ הגיע" או "מגיע לכם הכי טוב". דבר על סיטואציות אמיתיות: פקקים, הבוס, חלב שנגמר, הילד ששכח בריסטול.
`;

    const FEW_SHOT_EXAMPLES = `
השתמש בסגנון של דוגמאות העבר האלו:
- "ביום שני כולם רוצים מכם משהו. ב-Ten זה הפוך. הבוס רוצה דוחות, המיילים רוצים תשובות... העולם לוקח מכם אנרגיה, חוץ מב-Ten." 
- "בדרך לנטיעות עוצרים ב... Ten כמובן! לפני שאתם נוטעים שורשים בפקקים, עוצרים ב-Ten." 
- "נכון כבר נמאס לכם מדייטים גרועים... עם מעסיקים? בואו למצוא זוגיות ארוכת טווח ב-Ten." 
`;

    const TEMPLATES = {
        "שני חסכוני": `נושא: שני חסכוני (40 אגורות הנחה). 
קונספט: יום שני הוא היום שבו כולם שואבים ממך כוח (מיילים, פגישות, סידורים). Ten היא היחידה שמחזירה לך אנרגיה וחיסכון.
סיים עם: ${APP_LINK} 
${DISCLAIMER}`,

        "חג / אירוע": `נושא: ${holidays || "חג/אירוע"}. 
קונספט: חבר את החג לנסיעה משפחתית, לפקקים או לעצירה להתרעננות. אל תהיה בנאלי.
סיים עם: ${DISCLAIMER}`,

        "מצחיק / אפליקציה": `נושא: מצחיק / מעורבות. 
קונספט: האמת של הנהגים הישראלים (הילדים מאחורה, נכנסים 'רק לקפה' ויוצאים עם שקיות). 
סיים עם משחק מילים על Ten (למשל: "הכל 10 מתוך 10").
סיים עם: ${APP_LINK}`,

        "דרושים": `נושא: דרושים. 
קונספט: "משפחה שבוחרים", אנרגיות טובות, קפה ומזגן. בלי קלישאות זולות.
סיים עם: שלחו לנו וואטסאפ (מגיל 18 ומעלה בלבד) למספר 054-3207261 
או הכנסו לאתר: https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94`,

        "פוסט מבצע": `נושא: מבצע על ${promoText}. 
קונספט: הצג סיטואציה (מגבים חורקים בגשם, מצבר מת). תן פתרון ומחיר אפליקציה מול רגיל.
סיים עם: ${APP_LINK}
${DISCLAIMER}`
    };

    const currentTemplate = TEMPLATES[type] || `כתוב פוסט שנון על חוויית נסיעה ועצירה ב-Ten. סיים ב: ${DISCLAIMER}`;

    return SYSTEM_RULES + FEW_SHOT_EXAMPLES + `
נתוני הפוסט ליצירה:
תאריך: ${date} (יום ${day})
עונה: ${season}, ${weather}
אירוע/חדשות: ${holidays || "אין"} ${news || ""}

` + currentTemplate;
}

// --- ניהול נתונים (Supabase) ---
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
