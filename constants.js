/* ─── COLORS ──────────────────────────────────────────────────────── */
export const BL="#1565C0", BLl="#42A5F5", RD="#D32F2F";
export const WH="#FFFFFF", BG="#F0F4F8", BR="#E0E7EF", DK="#1A2733";
export const DV_PURPLE="#4A1D96";
export const DV_GRAD="linear-gradient(135deg,#4A1D96 0%,#6D28D9 100%)";
export const DV_GRAD2="linear-gradient(135deg,#6D28D9 0%,#7C3AED 100%)";

export const DAVID_LOGO=`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'><rect width='120' height='40' rx='8' fill='%234A1D96'/><text x='60' y='27' text-anchor='middle' font-family='Arial Black,Arial' font-weight='900' font-size='14' fill='white'>DAVID VATINE</text></svg>`;

export const APP_VERSION="v7.0";
export const APP_LINK="https://onelink.to/ten";
export const CAREER_LINK="https://ten.co.il/career";
export const WHATSAPP="050-0000000";
export const DISC=`*בתוקף עד [תאריך] או עד גמר המלאי, בתנאי התחנה, אין כפל מבצעים.`;

/* ─── MONTH / DAY NAMES ───────────────────────────────────────────── */
export const MHE=["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
export const DHE=["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

/* ─── MONTH METADATA ──────────────────────────────────────────────── */
export const MD={
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

/* ─── CLIENTS ─────────────────────────────────────────────────────── */
export const DEFAULT_CLIENTS=[{id:"delek-ten",name:"דלק Ten",logo:null,color:BL}];
export function loadClients(){try{const s=localStorage.getItem("dv_clients");return s?JSON.parse(s):DEFAULT_CLIENTS;}catch(e){return DEFAULT_CLIENTS;}}
export function saveClients(cl){try{localStorage.setItem("dv_clients",JSON.stringify(cl));}catch(e){}}

/* ─── STORAGE KEYS ────────────────────────────────────────────────── */
export const STORAGE_KEY="tenGanttState";
export const GANTT_LIST_KEY="tenGanttList";
export const ganttKey=(year,month)=>`tenGantt_${year}_${month}`;

/* ─── SUPABASE ────────────────────────────────────────────────────── */
export const SUPABASE_URL="https://hlqzioizjmzfxivpgqma.supabase.co";
export const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscXppb2l6am16Znh…";
