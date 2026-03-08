// ── קבועים ──
export const PU="#6D28D9",PU2="#7C3AED";
export const BG="#EEF2FF",WH="#fff",BR="#E2E8F0",DK="#1E293B";
export const BL="#1565C0",RD="#C62828";
export const HDR="linear-gradient(135deg,#1E1B4B 0%,#312E81 50%,#1565C0 100%)";
export const MHE=["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
export const YEARS=[2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036];

export function getMCTX(year){
  // חגים יהודיים מאומתים 2025-2035
const JH={
  2026:{
    tubishvat:[1,13], yomhashoah:[4,7], yomzikaron:[4,20], atzmaut:[4,22],
    lag:[5,5], shavuot:[5,21], tzomtamuz:[7,14], erevtisha:[7,29],
    tishabeav:[7,30], purim:[3,2], pesach:[4,1], pesachend:[4,8],
    rh:[9,11], yk:[9,20], sukkot:[9,25], hoshana:[10,2], hanuka:[12,4], hanukaend:[12,11]
  },
  2027:{
    tubishvat:[1,31], yomhashoah:[4,26], yomzikaron:[4,11], atzmaut:[4,12],
    lag:[5,24], shavuot:[6,10], tzomtamuz:[7,4], erevtisha:[7,24],
    tishabeav:[7,25], purim:[3,22], pesach:[4,21], pesachend:[4,28],
    rh:[10,1], yk:[10,10], sukkot:[10,15], hoshana:[10,22], hanuka:[12,24], hanukaend:[12,31]
  },
  2028:{
    tubishvat:[1,22], yomhashoah:[4,17], yomzikaron:[4,29], atzmaut:[5,1],
    lag:[5,27], shavuot:[5,30], tzomtamuz:[7,23], erevtisha:[8,12],
    tishabeav:[8,13], purim:[3,11], pesach:[4,10], pesachend:[4,17],
    rh:[9,20], yk:[9,29], sukkot:[10,4], hoshana:[10,11], hanuka:[12,12], hanukaend:[12,19]
  },
  2029:{
    tubishvat:[1,10], yomhashoah:[4,5], yomzikaron:[4,17], atzmaut:[4,19],
    lag:[5,1], shavuot:[5,19], tzomtamuz:[7,10], erevtisha:[7,31],
    tishabeav:[8,1], purim:[2,28], pesach:[3,30], pesachend:[4,6],
    rh:[9,9], yk:[9,18], sukkot:[9,23], hoshana:[9,30], hanuka:[12,1], hanukaend:[12,8]
  },
  2030:{
    tubishvat:[1,28], yomhashoah:[4,23], yomzikaron:[5,5], atzmaut:[5,6],
    lag:[5,20], shavuot:[6,6], tzomtamuz:[7,28], erevtisha:[8,17],
    tishabeav:[8,18], purim:[3,18], pesach:[4,17], pesachend:[4,24],
    rh:[9,27], yk:[10,6], sukkot:[10,11], hoshana:[10,18], hanuka:[12,20], hanukaend:[12,27]
  },
  2031:{
    tubishvat:[1,18], yomhashoah:[4,14], yomzikaron:[4,25], atzmaut:[4,26],
    lag:[5,10], shavuot:[5,27], tzomtamuz:[7,17], erevtisha:[8,6],
    tishabeav:[8,7], purim:[3,8], pesach:[4,7], pesachend:[4,14],
    rh:[9,18], yk:[9,27], sukkot:[10,2], hoshana:[10,9], hanuka:[12,10], hanukaend:[12,17]
  },
  2032:{
    tubishvat:[2,6], yomhashoah:[4,19], yomzikaron:[4,14], atzmaut:[4,15],
    lag:[5,27], shavuot:[6,1], tzomtamuz:[7,4], erevtisha:[7,24],
    tishabeav:[7,25], purim:[3,25], pesach:[4,13], pesachend:[4,20],
    rh:[9,15], yk:[9,24], sukkot:[9,29], hoshana:[10,6], hanuka:[11,29], hanukaend:[12,6]
  },
  2033:{
    tubishvat:[1,26], yomhashoah:[4,11], yomzikaron:[5,1], atzmaut:[5,2],
    lag:[5,16], shavuot:[6,1], tzomtamuz:[7,21], erevtisha:[8,10],
    tishabeav:[8,11], purim:[3,13], pesach:[4,2], pesachend:[4,9],
    rh:[9,4], yk:[9,13], sukkot:[9,18], hoshana:[9,25], hanuka:[12,16], hanukaend:[12,23]
  },
  2034:{
    tubishvat:[1,15], yomhashoah:[4,3], yomzikaron:[4,21], atzmaut:[4,22],
    lag:[5,6], shavuot:[5,22], tzomtamuz:[7,11], erevtisha:[7,31],
    tishabeav:[8,1], purim:[3,2], pesach:[3,21], pesachend:[3,28],
    rh:[9,24], yk:[10,3], sukkot:[10,8], hoshana:[10,15], hanuka:[12,7], hanukaend:[12,14]
  },
  2035:{
    tubishvat:[2,3], yomhashoah:[4,28], yomzikaron:[4,10], atzmaut:[4,11],
    lag:[5,23], shavuot:[5,28], tzomtamuz:[6,30], erevtisha:[7,20],
    tishabeav:[7,21], purim:[2,20], pesach:[4,9], pesachend:[4,16],
    rh:[9,13], yk:[9,22], sukkot:[9,27], hoshana:[10,4], hanuka:[11,27], hanukaend:[12,4]
  },
  2036:{
    tubishvat:[1,22], yomhashoah:[4,14], yomzikaron:[4,19], atzmaut:[4,20],
    lag:[5,12], shavuot:[5,28], tzomtamuz:[7,17], erevtisha:[8,5],
    tishabeav:[8,6], purim:[3,9], pesach:[4,7], pesachend:[4,14],
    rh:[9,21], yk:[9,30], sukkot:[10,5], hoshana:[10,12], hanuka:[12,16], hanukaend:[12,23]
  },
};

  // אירועים בינלאומיים ידועים מראש
 const INTL={
  2026:{5:['אירוויזיון 2026 🎤'],6:['מונדיאל 2026 ⚽ שלב בתים'],7:['מונדיאל 2026 ⚽ גמר'],11:['בחירות ארה"ב 2026 (ביניים) 🗳️']},
  2027:{5:['אירוויזיון 2027 🎤']},
  2028:{5:['אירוויזיון 2028 🎤'],7:['אולימפיאדה קיץ 2028 - לוס אנג\'לס 🏅'],8:['אולימפיאדה קיץ 2028 - המשך 🏅'],11:['בחירות ארה"ב 2028 🗳️']},
  2029:{5:['אירוויזיון 2029 🎤']},
  2030:{2:['אולימפיאדה חורף 2030 - אלפים צרפתיים ⛷️'],3:['אולימפיאדה חורף 2030 - המשך ⛷️'],5:['אירוויזיון 2030 🎤'],6:['מונדיאל 2030 ⚽ 100 שנה! שלב בתים'],7:['מונדיאל 2030 ⚽ גמר'],11:['בחירות ארה"ב 2030 (ביניים) 🗳️']},
  2031:{5:['אירוויזיון 2031 🎤']},
  2032:{5:['אירוויזיון 2032 🎤'],7:['אולימפיאדה קיץ 2032 - בריסביין 🏅'],8:['אולימפיאדה קיץ 2032 - המשך 🏅'],11:['בחירות ארה"ב 2032 🗳️']},
  2033:{5:['אירוויזיון 2033 🎤']},
  2034:{2:['אולימפיאדה חורף 2034 ⛷️'],3:['אולימפיאדה חורף 2034 - המשך ⛷️'],5:['אירוויזיון 2034 🎤'],6:['מונדיאל 2034 - ערב הסעודית ⚽ שלב בתים'],7:['מונדיאל 2034 ⚽ גמר'],11:['בחירות ארה"ב 2034 (ביניים) 🗳️']},
  2035:{5:['אירוויזיון 2035 🎤']},
  2036:{5:['אירוויזיון 2036 🎤'],7:['אולימפיאדה קיץ 2036 🏅'],8:['אולימפיאדה קיץ 2036 - המשך 🏅'],11:['בחירות ארה"ב 2036 🗳️']},
};

  const h=JH[year]||JH[2026];
  const intl=(INTL[year]||{});

 const holidays=(m)=>{
  const d=[];
  if(h.tubishvat[0]===m) d.push(`ט"ו בשבט (${h.tubishvat[1]}.${m})`);
  if(h.purim[0]===m) d.push(`פורים (${h.purim[1]}.${m})`);
  if(h.pesach[0]===m) d.push(`פסח (${h.pesach[1]}-${h.pesachend[1]}.${h.pesachend[0]})`);
  if(h.pesachend[0]===m&&h.pesachend[0]!==h.pesach[0]) d.push(`פסח המשך (עד ${h.pesachend[1]}.${m})`);
  if(h.yomhashoah[0]===m) d.push(`יום השואה (${h.yomhashoah[1]}.${m})`);
  if(h.yomzikaron[0]===m) d.push(`יום הזיכרון (${h.yomzikaron[1]}.${m})`);
  if(h.atzmaut[0]===m) d.push(`יום העצמאות (${h.atzmaut[1]}.${m})`);
  if(h.lag[0]===m) d.push(`לג בעומר (${h.lag[1]}.${m})`);
  if(h.shavuot[0]===m) d.push(`שבועות (${h.shavuot[1]}.${m})`);
  if(h.tzomtamuz[0]===m) d.push(`י"ז בתמוז (${h.tzomtamuz[1]}.${m})`);
  if(h.erevtisha[0]===m) d.push(`ערב תשעה באב (${h.erevtisha[1]}.${m})`);
  if(h.tishabeav[0]===m) d.push(`תשעה באב (${h.tishabeav[1]}.${m})`);
  if(h.rh[0]===m) d.push(`ראש השנה (${h.rh[1]}-${h.rh[1]+1}.${m})`);
  if(h.yk[0]===m) d.push(`יום כיפור (${h.yk[1]}.${m})`);
  if(h.sukkot[0]===m) d.push(`סוכות (${h.sukkot[1]}-${h.hoshana[1]}.${h.hoshana[0]})`);
  if(h.hoshana[0]===m&&h.hoshana[0]!==h.sukkot[0]) d.push(`שמחת תורה (${h.hoshana[1]}.${m})`);
  if(h.hanuka[0]===m) d.push(`חנוכה (${h.hanuka[1]}-${h.hanukaend[1]}.${h.hanukaend[0]})`);
  if(h.hanukaend[0]===m&&h.hanukaend[0]!==h.hanuka[0]) d.push(`חנוכה המשך (עד ${h.hanukaend[1]}.${m})`);
  return d.join(' | ')||'ללא';
};

  const news=(m)=>(intl[m]||[]).join(' | ')||'';

return(function(){
  const fam={2026:'17.2',2027:'7.2',2028:'27.2',2029:'15.2',2030:'3.2',2031:'23.2',2032:'11.2',2033:'31.1',2034:'20.2',2035:'9.2',2036:'28.2'};
  const mom={2026:'10.5',2027:'9.5',2028:'14.5',2029:'13.5',2030:'12.5',2031:'11.5',2032:'9.5',2033:'8.5',2034:'14.5',2035:'13.5',2036:'11.5'};
  const dad={2026:'21.6',2027:'20.6',2028:'18.6',2029:'17.6',2030:'16.6',2031:'15.6',2032:'20.6',2033:'19.6',2034:'18.6',2035:'17.6',2036:'21.6'};
  const gdd={2027:'18.4',2028:'2.4',2029:'15.4',2030:'7.4'};
  const famStr=fam[year]||'פברואר';
  const momStr=mom[year]||'מאי';
  const dadStr=dad[year]||'יוני';
  const gddStr=gdd[year]?(' | יום המעשים הטובים ('+gdd[year]+')'):'';
  return{
    1:{season:'חורף',weather:'קר וגשמי',holidays:holidays(1),special:'טו בשבט | יום החינוך הבינלאומי (24.1)',news:news(1),emoji:'❄️'},
    2:{season:'חורף-אביב',weather:'מתחמם, גשמים',holidays:holidays(2),special:'יום המשפחה / יום האם ('+famStr+') | יום האהבה (14.2)',news:news(2),emoji:'🎭'},
    3:{season:'אביב',weather:'נעים, פריחה',holidays:holidays(3),special:'יום האשה (8.3) | יום האביב (21.3)'+(year===2026?' | יום המעשים הטובים (10.3)':''),news:news(3),emoji:'🌸'},
    4:{season:'אביב',weather:'חם ונעים',holidays:holidays(4),special:'יום הספורט הבינלאומי (6.4) | יום כדור הארץ (22.4) | יום הספר (23.4)'+gddStr,news:news(4),emoji:'🌼'},
    5:{season:'אביב-קיץ',weather:'חם',holidays:holidays(5),special:'יום האם הבינלאומי ('+momStr+')',news:news(5),emoji:'🇮🇱'},
    6:{season:'קיץ',weather:'חם מאוד',holidays:holidays(6),special:'יום הסביבה (5.6) | יום האב ('+dadStr+') | יום המוסיקה (21.6)',news:news(6),emoji:'☀️'},
    7:{season:'קיץ',weather:'שיא החום',holidays:holidays(7),special:'יום הידידות הבינלאומי (30.7)',news:news(7),emoji:'🏖️'},
    8:{season:'קיץ',weather:'חם',holidays:holidays(8),special:'יום הצילום הבינלאומי (19.8)',news:news(8),emoji:'🌊'},
    9:{season:'סתיו',weather:'מתקרר',holidays:holidays(9),special:'יום השלום הבינלאומי (21.9)',news:news(9),emoji:'🍂'},
    10:{season:'סתיו',weather:'נעים',holidays:holidays(10),special:'יום בריאות הנפש העולמי (10.10) | יום המזון העולמי (16.10)',news:news(10),emoji:'🕍'},
    11:{season:'סתיו-חורף',weather:'מתקרר, גשמים',holidays:holidays(11),special:'יום הנדיבות הבינלאומי (13.11) | יום ילדי העולם (20.11)',news:news(11),emoji:'🌧️'},
    12:{season:'חורף',weather:'קר וגשמי',holidays:holidays(12),special:'יום ההתנדבות הבינלאומי (5.12) | יום זכויות האדם (10.12)',news:news(12),emoji:'🕎'},
 };
})();
}

export const APP_LINK="https://ten.onelink.me/Cdb1/e3lfcju1";
export const DISCLAIMER='*החיסכון בתשלום באמצעות כרטיס מועדון TenVIP או בתשלום באפליקציית Ten. החיסכון ממחיר בנזין בשירות מלא, כפי שנקבע על ידי מנהל הדלק. החיסכון הוא בתדלוק בשירות עצמי בלבד, אין כפל מבצעים והנחות.';

export const SUPABASE_URL="https://oexdfprqbhlbuesaxfjx.supabase.co";
export const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGRmcHJxYmhsYnVlc2F4Zmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDk4MzQsImV4cCI6MjA4ODI4NTgzNH0.jh-Tv2d8dQOW8UQ6UgiBcpVTTzlaePzWQg9ozm6BSgs";

export const TEN_LOGO="/tenlogo.png";
export const DV_LOGO="/davidlogo.png";
