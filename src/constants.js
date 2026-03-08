// ── קבועים ──
export const PU="#6D28D9",PU2="#7C3AED";
export const BG="#EEF2FF",WH="#fff",BR="#E2E8F0",DK="#1E293B";
export const BL="#1565C0",RD="#C62828";
export const HDR="linear-gradient(135deg,#1E1B4B 0%,#312E81 50%,#1565C0 100%)";
export const MHE=["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
export const YEARS=[2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036];

export function getMCTX(year){
  // תאריכים מאומתים מול Wikipedia + Chabad + hebcal
  // פורמט: [חודש, יום_התחלה, יום_סוף] או [חודש, יום] לחגים חד-יומיים
  // ראש השנה: 2 ימים. סוכות: 25.9-2.10 (7 ימים). שמחת תורה: יום אחד אחרי.
  const JH={
    2026:{
      tubishvat:[1,13], purim:[3,2], pesach:[4,1], pesachend:[4,8],
      yomhashoah:[4,13], yomzikaron:[4,21], atzmaut:[4,22],
      lag:[5,5], shavuot:[5,21],
      tzomtamuz:[7,20], tishabeav:[8,10],
      rh:[9,11], rhend:[9,13], yk:[9,20], ykend:[9,21],
      sukkot:[9,25], sukkotend:[10,2], shiminiatzeret:[10,2], simchatorah:[10,3],
      hanuka:[12,4], hanukaend:[12,12]
    },
    2027:{
      tubishvat:[1,31], purim:[3,22], pesach:[4,21], pesachend:[4,29],
      yomhashoah:[4,26], yomzikaron:[5,10], atzmaut:[5,11],
      lag:[5,24], shavuot:[6,10],
      tzomtamuz:[7,8], tishabeav:[7,29],
      rh:[10,1], rhend:[10,3], yk:[10,9], ykend:[10,10],
      sukkot:[10,14], sukkotend:[10,21], shiminiatzeret:[10,21], simchatorah:[10,22],
      hanuka:[12,22], hanukaend:[12,30]
    },
    2028:{
      tubishvat:[1,22], purim:[3,11], pesach:[4,10], pesachend:[4,17],
      yomhashoah:[4,19], yomzikaron:[4,25], atzmaut:[4,26],
      lag:[5,11], shavuot:[5,28],
      tzomtamuz:[7,18], tishabeav:[8,7],
      rh:[9,20], rhend:[9,22], yk:[9,27], ykend:[9,28],
      sukkot:[10,2], sukkotend:[10,9], shiminiatzeret:[10,9], simchatorah:[10,10],
      hanuka:[12,10], hanukaend:[12,18]
    },
    2029:{
      tubishvat:[1,18], purim:[2,28], pesach:[3,30], pesachend:[4,6],
      yomhashoah:[4,9], yomzikaron:[4,16], atzmaut:[4,17],
      lag:[5,1], shavuot:[5,19],
      tzomtamuz:[7,8], tishabeav:[7,29],
      rh:[9,9], rhend:[9,11], yk:[9,16], ykend:[9,17],
      sukkot:[9,21], sukkotend:[9,28], shiminiatzeret:[9,28], simchatorah:[9,29],
      hanuka:[11,30], hanukaend:[12,8]
    },
    2030:{
      tubishvat:[2,7], purim:[3,7], pesach:[4,6], pesachend:[4,13],
      yomhashoah:[4,19], yomzikaron:[4,27], atzmaut:[4,28],
      lag:[5,9], shavuot:[5,26],
      tzomtamuz:[7,27], tishabeav:[8,17],
      rh:[9,27], rhend:[9,29], yk:[10,6], ykend:[10,7],
      sukkot:[10,11], sukkotend:[10,18], shiminiatzeret:[10,18], simchatorah:[10,19],
      hanuka:[12,20], hanukaend:[12,28]
    },
    2031:{
      tubishvat:[1,25], purim:[3,25], pesach:[4,24], pesachend:[5,1],
      yomhashoah:[5,5], yomzikaron:[5,12], atzmaut:[5,13],
      lag:[5,27], shavuot:[6,13],
      tzomtamuz:[7,17], tishabeav:[8,7],
      rh:[9,18], rhend:[9,20], yk:[9,25], ykend:[9,26],
      sukkot:[9,30], sukkotend:[10,7], shiminiatzeret:[10,7], simchatorah:[10,8],
      hanuka:[12,8], hanukaend:[12,16]
    },
    2032:{
      tubishvat:[2,6], purim:[3,21], pesach:[4,13], pesachend:[4,20],
      yomhashoah:[4,25], yomzikaron:[5,3], atzmaut:[5,4],
      lag:[5,16], shavuot:[6,2],
      tzomtamuz:[7,4], tishabeav:[7,25],
      rh:[9,23], rhend:[9,25], yk:[10,2], ykend:[10,3],
      sukkot:[10,7], sukkotend:[10,14], shiminiatzeret:[10,14], simchatorah:[10,15],
      hanuka:[12,16], hanukaend:[12,24]
    },
    2033:{
      tubishvat:[1,22], purim:[3,4], pesach:[4,3], pesachend:[4,10],
      yomhashoah:[4,16], yomzikaron:[4,24], atzmaut:[4,25],
      lag:[5,6], shavuot:[5,23],
      tzomtamuz:[7,24], tishabeav:[8,14],
      rh:[9,13], rhend:[9,15], yk:[9,22], ykend:[9,23],
      sukkot:[9,27], sukkotend:[10,4], shiminiatzeret:[10,4], simchatorah:[10,5],
      hanuka:[12,5], hanukaend:[12,13]
    },
    2034:{
      tubishvat:[1,30], purim:[3,21], pesach:[4,20], pesachend:[4,27],
      yomhashoah:[4,29], yomzikaron:[5,8], atzmaut:[5,9],
      lag:[5,23], shavuot:[6,9],
      tzomtamuz:[7,13], tishabeav:[8,3],
      rh:[9,30], rhend:[10,2], yk:[10,9], ykend:[10,10],
      sukkot:[10,14], sukkotend:[10,21], shiminiatzeret:[10,21], simchatorah:[10,22],
      hanuka:[12,22], hanukaend:[12,30]
    },
    2035:{
      tubishvat:[2,3], purim:[2,20], pesach:[4,9], pesachend:[4,16],
      yomhashoah:[4,28], yomzikaron:[5,10], atzmaut:[5,11],
      lag:[5,23], shavuot:[5,28],
      tzomtamuz:[6,30], tishabeav:[7,21],
      rh:[9,13], rhend:[9,15], yk:[9,22], ykend:[9,23],
      sukkot:[9,27], sukkotend:[10,4], shiminiatzeret:[10,4], simchatorah:[10,5],
      hanuka:[11,27], hanukaend:[12,5]
    },
    2036:{
      tubishvat:[1,22], purim:[3,9], pesach:[4,7], pesachend:[4,14],
      yomhashoah:[4,14], yomzikaron:[4,19], atzmaut:[4,20],
      lag:[5,12], shavuot:[5,28],
      tzomtamuz:[7,17], tishabeav:[8,10],
      rh:[9,21], rhend:[9,23], yk:[9,30], ykend:[10,1],
      sukkot:[10,5], sukkotend:[10,12], shiminiatzeret:[10,12], simchatorah:[10,13],
      hanuka:[12,16], hanukaend:[12,24]
    },
  };

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
    if(h.pesach[0]===m) d.push(`פסח (${h.pesach[1]}.${h.pesach[0]}-${h.pesachend[1]}.${h.pesachend[0]})`);
    if(h.pesachend[0]===m&&h.pesachend[0]!==h.pesach[0]) d.push(`פסח המשך (עד ${h.pesachend[1]}.${m})`);
    if(h.yomhashoah[0]===m) d.push(`יום השואה (${h.yomhashoah[1]}.${m})`);
    if(h.yomzikaron[0]===m) d.push(`יום הזיכרון (${h.yomzikaron[1]}.${m})`);
    if(h.atzmaut[0]===m) d.push(`יום העצמאות (${h.atzmaut[1]}.${m})`);
    if(h.lag[0]===m) d.push(`לג בעומר (${h.lag[1]}.${m})`);
    if(h.shavuot[0]===m) d.push(`שבועות (${h.shavuot[1]}.${m})`);
    if(h.tzomtamuz[0]===m) d.push(`י"ז בתמוז (${h.tzomtamuz[1]}.${m})`);
    if(h.tishabeav[0]===m) d.push(`תשעה באב (${h.tishabeav[1]}.${m})`);
    if(h.rh[0]===m) d.push(`ראש השנה (${h.rh[1]}-${h.rhend[1]}.${h.rhend[0]})`);
    if(h.yk[0]===m) d.push(`יום כיפור (${h.yk[1]}-${h.ykend[1]}.${h.ykend[0]})`);
    if(h.sukkot[0]===m) d.push(`סוכות (${h.sukkot[1]}.${h.sukkot[0]}-${h.sukkotend[1]}.${h.sukkotend[0]})`);
    if(h.sukkotend[0]===m&&h.sukkotend[0]!==h.sukkot[0]) d.push(`סוכות המשך (עד ${h.sukkotend[1]}.${m})`);
    if(h.simchatorah[0]===m) d.push(`שמחת תורה (${h.simchatorah[1]}.${m})`);
    if(h.hanuka[0]===m) d.push(`חנוכה (${h.hanuka[1]}.${h.hanuka[0]}-${h.hanukaend[1]}.${h.hanukaend[0]})`);
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
      1:{season:'חורף',weather:'קר וגשמי',holidays:holidays(1),special:'יום החינוך הבינלאומי (24.1)',news:news(1),emoji:'❄️'},
      2:{season:'חורף-אביב',weather:'מתחמם, גשמים',holidays:holidays(2),special:'יום המשפחה / יום האם ('+famStr+') | יום האהבה (14.2)',news:news(2),emoji:'🎭'},
      3:{season:'אביב',weather:'נעים, פריחה',holidays:holidays(3),special:'יום האשה (8.3) | יום האביב (21.3)'+(year===2026?' | יום המעשים הטובים (10.3)':''),news:news(3),emoji:'🌸'},
      4:{season:'אביב',weather:'חם ונעים',holidays:holidays(4),special:'יום הספורט הבינלאומי (6.4) | יום כדור הארץ (22.4) | יום הספר (23.4)'+gddStr,news:news(4),emoji:'🌼'},
      5:{season:'אביב-קיץ',weather:'חם',holidays:holidays(5),special:'יום האם הבינלאומי ('+momStr+')',news:news(5),emoji:'🇮🇱'},
      6:{season:'קיץ',weather:'חם מאוד',holidays:holidays(6),special:'סוף שנת לימודים 🎒 | יום הסביבה (5.6) | יום האב ('+dadStr+') | יום המוסיקה (21.6)',news:news(6),emoji:'☀️'},
      7:{season:'קיץ',weather:'שיא החום',holidays:holidays(7),special:'חופש גדול 🎒 | יום הידידות הבינלאומי (30.7)',news:news(7),emoji:'🏖️'},
      8:{season:'קיץ',weather:'חם',holidays:holidays(8),special:'חופש גדול 🎒 | יום הצילום הבינלאומי (19.8)',news:news(8),emoji:'🌊'},
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
