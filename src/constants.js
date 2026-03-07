// ── קבועים ──
export const PU="#6D28D9",PU2="#7C3AED";
export const BG="#EEF2FF",WH="#fff",BR="#E2E8F0",DK="#1E293B";
export const BL="#1565C0",RD="#C62828";
export const HDR="linear-gradient(135deg,#1E1B4B 0%,#312E81 50%,#1565C0 100%)";
export const MHE=["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
export const YEARS=[2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036];

export export function getMCTX(year){
  // חגים יהודיים מאומתים 2025-2035
  const JH={
    2026:{purim:[3,3],pesach:[4,9,4,16],atzmaut:[4,22],zikaron:[4,21],lag:[5,5],shavuot:[5,28],rh:[9,11],yk:[9,20],sukkot:[9,25,10,1],hanuka:[12,4,12,11]},
    2027:{purim:[3,23],pesach:[3,30,4,6],atzmaut:[4,12],zikaron:[4,11],lag:[5,25],shavuot:[5,18],rh:[10,1],yk:[10,10],sukkot:[10,15,10,21],hanuka:[12,24,12,31]},
    2028:{purim:[3,11],pesach:[4,28,5,5],atzmaut:[5,1],zikaron:[4,30],lag:[6,12],shavuot:[6,16],rh:[10,2],yk:[10,11],sukkot:[10,17,10,23],hanuka:[12,12,12,19]},
    2029:{purim:[3,1],pesach:[4,17,4,24],atzmaut:[4,19],zikaron:[4,18],lag:[6,1],shavuot:[6,5],rh:[9,20],yk:[9,29],sukkot:[10,5,10,11],hanuka:[12,1,12,8]},
    2030:{purim:[3,19],pesach:[4,6,4,13],atzmaut:[5,7],zikaron:[5,6],lag:[5,20],shavuot:[5,25],rh:[9,9],yk:[9,18],sukkot:[9,24,9,30],hanuka:[12,20,12,27]},
    2031:{purim:[3,9],pesach:[3,27,4,3],atzmaut:[4,27],zikaron:[4,26],lag:[5,10],shavuot:[5,15],rh:[9,29],yk:[10,8],sukkot:[10,14,10,20],hanuka:[12,10,12,17]},
    2032:{purim:[3,25],pesach:[4,13,4,20],atzmaut:[4,15],zikaron:[4,14],lag:[5,27],shavuot:[6,1],rh:[9,16],yk:[9,25],sukkot:[10,1,10,7],hanuka:[11,29,12,6]},
    2033:{purim:[3,13],pesach:[4,2,4,9],atzmaut:[5,3],zikaron:[5,2],lag:[5,17],shavuot:[5,22],rh:[9,5],yk:[9,14],sukkot:[9,20,9,26],hanuka:[12,17,12,24]},
    2034:{purim:[3,3],pesach:[3,21,3,28],atzmaut:[4,23],zikaron:[4,22],lag:[5,6],shavuot:[5,11],rh:[9,25],yk:[10,4],sukkot:[10,10,10,16],hanuka:[12,7,12,14]},
    2035:{purim:[2,20],pesach:[4,10,4,17],atzmaut:[4,12],zikaron:[4,11],lag:[5,24],shavuot:[5,29],rh:[9,14],yk:[9,23],sukkot:[9,29,10,5],hanuka:[11,26,12,3]},
    2036:{purim:[3,3],pesach:[3,22,3,29],atzmaut:[4,21],zikaron:[4,20],lag:[5,5],shavuot:[5,11],rh:[9,21],yk:[9,30],sukkot:[10,6,10,12],hanuka:[12,14,12,21]},
  };

  // אירועים בינלאומיים ידועים מראש
  const INTL={
    2025:{5:['אירוויזיון 2025 - בזל 🎤']},
    2026:{5:['אירוויזיון 2026 🎤'],6:['מונדיאל 2026 - ארה"ב/קנדה/מקסיקו ⚽ (שלב בתים)'],7:['מונדיאל 2026 - שלב נוקאאוט ⚽']},
    2027:{8:['אליפות העולם באתלטיקה - טוקיו 🏃']},
    2028:{7:['אולימפיאדה 2028 - לוס אנג\'לס 🏅'],8:['אולימפיאדה 2028 - לוס אנג\'לס (המשך) 🏅']},
    2029:{5:['אירוויזיון 2029 🎤']},
    2030:{6:['מונדיאל 2030 - ספרד/פורטוגל/מרוקו ⚽'],7:['מונדיאל 2030 - שלב נוקאאוט ⚽']},
    2031:{5:['אירוויזיון 2031 🎤']},
    2032:{5:['אירוויזיון 2032 🎤'],7:['אולימפיאדה 2032 - בריסביין 🏅'],8:['אולימפיאדה 2032 - המשך 🏅']},
    2033:{5:['אירוויזיון 2033 🎤']},
    2034:{6:['מונדיאל 2034 - ערב הסעודית ⚽'],7:['מונדיאל 2034 - נוקאאוט ⚽']},
    2035:{5:['אירוויזיון 2035 🎤']},
    2036:{7:['מונדיאל 2034 - המשך ⚽'],5:['אירוויזיון 2036 🎤']},
  };

  const h=JH[year]||JH[2026];
  const intl=(INTL[year]||{});

  const holidays=(m)=>{
    const d=[];
    if(h.purim[0]===m) d.push(`פורים (${h.purim[1]}.${h.purim[0]})`);
    if(h.pesach[0]===m) d.push(`פסח (${h.pesach[1]}-${h.pesach[2]}=${h.pesach[3] > h.pesach[1] ? h.pesach[3]+'.'+h.pesach[2] : h.pesach[3]+'.'+h.pesach[0]})`);
    // פסח שמתחיל במרץ ונגמר באפריל
    if(h.pesach[2]===m && h.pesach[0]!==m) d.push(`פסח - המשך (עד ${h.pesach[3]}.${h.pesach[2]})`);
    if(h.zikaron[0]===m) d.push(`יום הזיכרון (${h.zikaron[1]}.${h.zikaron[0]})`);
    if(h.atzmaut[0]===m) d.push(`יום העצמאות (${h.atzmaut[1]}.${h.atzmaut[0]})`);
    if(h.lag[0]===m) d.push(`לג בעומר (${h.lag[1]}.${h.lag[0]})`);
    if(h.shavuot[0]===m) d.push(`שבועות (${h.shavuot[1]}.${h.shavuot[0]})`);
    if(h.rh[0]===m) d.push(`ראש השנה (${h.rh[1]}.${h.rh[0]})`);
    if(h.yk[0]===m) d.push(`יום כיפור (${h.yk[1]}.${h.yk[0]})`);
    if(h.sukkot[0]===m) d.push(`סוכות (${h.sukkot[1]}.${h.sukkot[0]}-${h.sukkot[3]}.${h.sukkot[2]})`);
    if(h.sukkot[2]===m && h.sukkot[0]!==m) d.push(`שמחת תורה (${h.sukkot[3]}.${h.sukkot[2]})`);
    if(h.hanuka[0]===m) d.push(`חנוכה (${h.hanuka[1]}.${h.hanuka[0]}-${h.hanuka[3]}.${h.hanuka[2]})`);
    if(h.hanuka[2]===m && h.hanuka[0]!==m) d.push(`חנוכה - המשך (עד ${h.hanuka[3]}.${h.hanuka[2]})`);
    return d.join(' | ')||'ללא';
  };

  const news=(m)=>(intl[m]||[]).join(' | ')||'';

  return{
    1:{season:'חורף',weather:'קר וגשמי',holidays:holidays(1),special:'טו בשבט | יום החינוך (24.1)',news:news(1),emoji:'❄️'},
    2:{season:'חורף-אביב',weather:'מתחמם, גשמים',holidays:holidays(2),special:'יום האהבה (14.2) | יום המעשים הטובים (17.2)',news:news(2),emoji:'🎭'},
    3:{season:'אביב',weather:'נעים, פריחה',holidays:holidays(3),special:'יום האשה (8.3) | יום האביב (21.3)',news:news(3),emoji:'🌸'},
    4:{season:'אביב',weather:'חם ונעים',holidays:holidays(4),special:'יום כדור הארץ (22.4) | יום הספר (23.4)',news:news(4),emoji:'🌼'},
    5:{season:'אביב-קיץ',weather:'חם',holidays:holidays(5),special:'יום האם | יום המשפחה (15.5)',news:news(5),emoji:'🇮🇱'},
    6:{season:'קיץ',weather:'חם מאוד',holidays:holidays(6),special:'יום הסביבה (5.6) | יום המוסיקה (21.6)',news:news(6),emoji:'☀️'},
    7:{season:'קיץ',weather:'שיא החום',holidays:holidays(7),special:'יום הידידות (30.7) | יום הספורט (17.7)',news:news(7),emoji:'🏖️'},
    8:{season:'קיץ',weather:'חם',holidays:holidays(8),special:'יום הצדקה (19.8) | יום הצילום (19.8)',news:news(8),emoji:'🌊'},
    9:{season:'סתיו',weather:'מתקרר',holidays:holidays(9),special:'יום השלום (21.9)',news:news(9),emoji:'🍂'},
    10:{season:'סתיו',weather:'נעים',holidays:holidays(10),special:'יום בריאות הנפש (10.10) | יום המזון (16.10)',news:news(10),emoji:'🕍'},
    11:{season:'סתיו-חורף',weather:'מתקרר, גשמים',holidays:holidays(11),special:'יום הנדיבות (13.11) | יום ילדי העולם (20.11)',news:news(11),emoji:'🌧️'},
    12:{season:'חורף',weather:'קר וגשמי',holidays:holidays(12),special:'יום זכויות האדם (10.12) | יום ההתנדבות (5.12)',news:news(12),emoji:'🕎'},
  };
}

export const APP_LINK="https://ten.onelink.me/Cdb1/e3lfcju1";
export const DISCLAIMER='*החיסכון בתשלום באמצעות כרטיס מועדון TenVIP או בתשלום באפליקציית Ten. החיסכון ממחיר בנזין בשירות מלא, כפי שנקבע על ידי מנהל הדלק. החיסכון הוא בתדלוק בשירות עצמי בלבד, אין כפל מבצעים והנחות.';

export const SUPABASE_URL="https://oexdfprqbhlbuesaxfjx.supabase.co";
export const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGRmcHJxYmhsYnVlc2F4Zmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDk4MzQsImV4cCI6MjA4ODI4NTgzNH0.jh-Tv2d8dQOW8UQ6UgiBcpVTTzlaePzWQg9ozm6BSgs";

export const TEN_LOGO="/tenlogo.png";
export const DV_LOGO="/davidlogo.png";
