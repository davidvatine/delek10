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

// --- לוגיקת AI - גרסת "אפס טעויות" ---
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

    const STRICT_HEBREW_DIRECTIVES = `
חוקי עברית וקריאייטיב (בלתי ניתנים לשינוי):
1. עברית טבעית בלבד: אל תשתמש בביטויים כמו "בגמר חצי", "מזגינים", "נפסדים" או "הטלפון נגמר". אמור: "הסוללה נגמרה", "חם בטירוף", "הילד צועק".
2. דקדוק: "שלוש שקיות" (נקבה), "שלושה שקלים" (זכר). בדוק היטב! 
3. פנייה אחידה: פנה לקהל ב"אתם" או "נהגים". אל תחליף בין זכר לנקבה באותו פוסט. [cite: 2, 4, 10]
4. אימוג'ים: 1 עד 3 אימוג'ים בלבד. לא יותר. 
5. איסור מוחלט על "מילים של רובוט": אל תשתמש במילים "בשורה", "מיוחד", "הזדמנות", "מוביל", "טכנולוגיה", "פרודוקטיביות". [cite: 2, 6, 10]
6. שם המותג: Ten היא נקבה. היא "מבטיחה", "נותנת", "חוסכת". [cite: 2, 8]
`;

    const TYPE_STRATEGIES = {
        "שני חסכוני": `
נושא: שני חסכוני (40 אג' הנחה).
קריאייטיב: יום שני הוא היום שבו כולם לוקחים ממך אנרגיה (הבוס, הפקקים, המיילים). Ten היא היחידה שמחזירה לך.
אירוע: ${news || ""} - שלב אותו בנגיעה בלבד, אל תהפוך את כל הפוסט עליו.
סיים ב: ${APP_LINK} \n ${DISCLAIMER}`,

        "חג / אירוע": `
נושא: ${holidays || "חופשה/טיולים"}.
קריאייטיב: אל תברך "חג שמח". תאר סיטואציה של נסיעה משפחתית (הילדים ששואלים 'מתי מגיעים', הצידנית שנוזלת). Ten היא העצירה שמצילה את הטיול. [cite: 1, 2, 8]
סיים ב: ${DISCLAIMER}`,

        "מצחיק / אפליקציה": `
נושא: סיטואציה מהחיים.
קריאייטיב: תאר את הרגע הזה שנכנסים לתחנה "רק לקנות מים" ויוצאים עם שקיות של פינוקים כי הריח של המאפים שבר אתכם. 
סיים ב: ${APP_LINK}`,

        "דרושים": `
נושא: גיוס לצוות.
קריאייטיב: "משפחה שבוחרים". מקום שכיף לבוא אליו בגלל האנשים והמזגן. בלי קלישאות "דייטים". 
סיים ב: שלחו וואטסאפ (מגיל 18+) ל-054-3207261 או לאתר הקריירה. `,

        "פוסט מבצע": `
נושא: מבצע על ${promoText}.
קריאייטיב: תאר בעיה של נהג (המצבר עייף, המגב חורק) והצג את הפתרון של Ten עם מחיר אפליקציה מול רגיל. 
סיים ב: ${APP_LINK} \n ${DISCLAIMER}`
    };

    const strategy = TYPE_STRATEGIES[type] || "כתוב פוסט חברי ושנון על Ten.";

    return STRICT_HEBREW_DIRECTIVES + `
סיטואציות השראה מגאנטי עבר של Ten:
- הילד שנזכר בבריסטול בבוקר 
- הפקק שבו רק הקפה של Ten מציל אותך [cite: 2, 4]
- נכנסים 'רק לשנייה' ויוצאים עם שקיות 

הפוסט ליצירה כעת:
תאריך: ${date} (${day})
עונה: ${season}
אירוע/חדשות: ${holidays || "אין"} ${news || ""}

כתוב פוסט קצר (עד 10 שורות), עברית מושלמת, שנון ומדויק:
`;
}

// --- פונקציות שמירה וניהול נשארות זהות (Supabase) ---
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
