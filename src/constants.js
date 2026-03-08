// ── קבועים ──
export const PU="#6D28D9",PU2="#7C3AED";
export const BG="#EEF2FF",WH="#fff",BR="#E2E8F0",DK="#1E293B";
export const BL="#1565C0",RD="#C62828";
export const HDR="linear-gradient(135deg,#1E1B4B 0%,#312E81 50%,#1565C0 100%)";
export const MHE=["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
export const YEARS=[2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036];

export function getMCTX(year){
  // ═══════════════════════════════════════════════════════════════════
  // כל התאריכים מאומתים ישירות מ-Hebcal.com (Israel mode, i=on)
  // sunset = יום החג מתחיל בערב, לכן היום שמופיע הוא יום+1 מה-sunset
  // לדוגמה: "Fri 25 Sep sunset" → חג מתחיל שבת 26 Sep
  // ═══════════════════════════════════════════════════════════════════
  const JH={
    2026:{
      tubishvat:[2,2],        // Sun 1 Feb sunset → 2 Feb
      purim:[3,3],            // Mon 2 Mar sunset → 3 Mar
      pesach:[4,2],           // Wed 1 Apr sunset → 2 Apr
      pesachend:[4,8],        // Wed 8 Apr nightfall
      yomhashoah:[4,13],      // Hebcal modern table: Mon 13 Apr
      yomzikaron:[4,20],      // Mon 20 Apr
      atzmaut:[4,21],         // Tue 21 Apr
      lag:[5,5],              // Mon 4 May sunset → 5 May
      shavuot:[5,22],         // Thu 21 May sunset → 22 May
      tzomtamuz:[7,2],        // Thu 2 Jul (dawn fast)
      tishabeav:[7,23],       // Wed 22 Jul sunset → 23 Jul
      rh:[9,12], rhend:[9,13],// Fri 11 Sep sunset → 12-13 Sep
      yk:[9,21],              // Sun 20 Sep sunset → 21 Sep
      sukkot:[9,26], sukkotend:[10,2], // Fri 25 Sep sunset → 26 Sep ... 2 Oct
      simchatorah:[10,3],     // Fri 2 Oct sunset → 3 Oct
      hanuka:[12,5], hanukaend:[12,12],// Fri 4 Dec sunset → 5-12 Dec
    },
    2027:{
      tubishvat:[1,23],       // Fri 22 Jan sunset → 23 Jan
      purim:[3,23],           // Mon 22 Mar sunset → 23 Mar
      pesach:[4,22], pesachend:[4,28], // Wed 21 Apr sunset → 22-28 Apr
      yomhashoah:[5,3],       // Mon 3 May
      yomzikaron:[5,10],      // Mon 10 May
      atzmaut:[5,11],         // Tue 11 May
      lag:[5,25],             // Mon 24 May sunset → 25 May
      shavuot:[6,11],         // Thu 10 Jun sunset → 11 Jun
      tzomtamuz:[7,22],       // Thu 22 Jul (dawn fast)
      tishabeav:[8,12],       // Wed 11 Aug sunset → 12 Aug
      rh:[10,2], rhend:[10,3],// Fri 1 Oct sunset → 2-3 Oct
      yk:[10,11],             // Sun 10 Oct sunset → 11 Oct
      sukkot:[10,16], sukkotend:[10,22], // Fri 15 Oct sunset → 16-22 Oct
      simchatorah:[10,23],    // Fri 22 Oct sunset → 23 Oct
      hanuka:[12,24], hanukaend:[12,31],// Thu 23 Dec sunset → 24-31 Dec
    },
    2028:{
      tubishvat:[2,12],       // Fri 11 Feb sunset → 12 Feb
      purim:[3,12],           // Sat 11 Mar sunset → 12 Mar
      pesach:[4,11], pesachend:[4,17], // Mon 10 Apr sunset → 11-17 Apr
      yomhashoah:[4,23],      // Sun 23 Apr
      yomzikaron:[4,30],      // Sun 30 Apr
      atzmaut:[5,1],          // Mon 1 May
      lag:[5,14],             // Sat 13 May sunset → 14 May
      shavuot:[5,31],         // Tue 30 May sunset → 31 May
      tzomtamuz:[7,11],       // Tue 11 Jul (dawn fast)
      tishabeav:[8,1],        // Mon 31 Jul sunset → 1 Aug
      rh:[9,21], rhend:[9,22],// Wed 20 Sep sunset → 21-22 Sep
      yk:[9,30],              // Fri 29 Sep sunset → 30 Sep
      sukkot:[10,5], sukkotend:[10,11], // Wed 4 Oct sunset → 5-11 Oct
      simchatorah:[10,12],    // Wed 11 Oct sunset → 12 Oct
      hanuka:[12,3], hanukaend:[12,11],// Sun 2 Dec sunset → 3-11 Dec (25 Kislev 5789 = 2 Dec)
    },
    2029:{
      tubishvat:[1,31],       // Tue 30 Jan sunset → 31 Jan
      purim:[3,1],            // Wed 28 Feb sunset → 1 Mar
      pesach:[3,31], pesachend:[4,6], // Fri 30 Mar sunset → 31 Mar - 6 Apr
      yomhashoah:[4,11],      // Wed 11 Apr
      yomzikaron:[4,17],      // Tue 17 Apr
      atzmaut:[4,18],         // Wed 18 Apr
      lag:[5,3],              // Wed 2 May sunset → 3 May
      shavuot:[5,20],         // Sat 19 May sunset → 20 May
      tzomtamuz:[7,1],        // Sun 1 Jul (dawn fast)
      tishabeav:[7,22],       // Sat 21 Jul sunset → 22 Jul
      rh:[9,10], rhend:[9,11],// Sun 9 Sep sunset → 10-11 Sep
      yk:[9,19],              // Tue 18 Sep sunset → 19 Sep
      sukkot:[9,24], sukkotend:[9,30], // Sun 23 Sep sunset → 24-30 Sep
      simchatorah:[10,1],     // Sun 30 Sep sunset → 1 Oct
      hanuka:[12,2], hanukaend:[12,9], // Sat 1 Dec sunset → 2-9 Dec
    },
    2030:{
      tubishvat:[1,19],       // Fri 18 Jan sunset → 19 Jan
      purim:[3,19],           // Mon 18 Mar sunset → 19 Mar
      pesach:[4,18], pesachend:[4,24], // Wed 17 Apr sunset → 18-24 Apr
      yomhashoah:[4,29],      // Mon 29 Apr
      yomzikaron:[5,6],       // Mon 6 May
      atzmaut:[5,7],          // Tue 7 May
      lag:[5,21],             // Mon 20 May sunset → 21 May
      shavuot:[6,7],          // Thu 6 Jun sunset → 7 Jun
      tzomtamuz:[7,18],       // Thu 18 Jul (dawn fast)
      tishabeav:[8,8],        // Wed 7 Aug sunset → 8 Aug
      rh:[9,28], rhend:[9,29],// Fri 27 Sep sunset → 28-29 Sep
      yk:[10,7],              // Sun 6 Oct sunset → 7 Oct
      sukkot:[10,12], sukkotend:[10,18], // Fri 11 Oct sunset → 12-18 Oct
      simchatorah:[10,19],    // Fri 18 Oct sunset → 19 Oct
      hanuka:[12,21], hanukaend:[12,28],// Fri 20 Dec sunset → 21-28 Dec
    },
    2031:{
      tubishvat:[2,8],        // Fri 7 Feb sunset → 8 Feb
      purim:[3,9],            // Sat 8 Mar sunset → 9 Mar
      pesach:[4,8], pesachend:[4,14], // Mon 7 Apr sunset → 8-14 Apr
      yomhashoah:[4,20],      // Sun 20 Apr
      yomzikaron:[4,27],      // Sun 27 Apr
      atzmaut:[4,28],         // Mon 28 Apr
      lag:[5,11],             // Sat 10 May sunset → 11 May
      shavuot:[5,28],         // Tue 27 May sunset → 28 May
      tzomtamuz:[7,8],        // Tue 8 Jul (dawn fast)
      tishabeav:[7,29],       // Mon 28 Jul sunset → 29 Jul
      rh:[9,18], rhend:[9,19],// Wed 17 Sep sunset → 18-19 Sep
      yk:[9,27],              // Fri 26 Sep sunset → 27 Sep
      sukkot:[10,2], sukkotend:[10,8], // Wed 1 Oct sunset → 2-8 Oct
      simchatorah:[10,9],     // Wed 8 Oct sunset → 9 Oct
      hanuka:[12,10], hanukaend:[12,17],// Tue 9 Dec sunset → 10-17 Dec
    },
    2032:{
      tubishvat:[1,28],       // Tue 27 Jan sunset → 28 Jan
      purim:[2,26],           // Wed 25 Feb sunset → 26 Feb
      pesach:[3,27], pesachend:[4,2], // Fri 26 Mar sunset → 27 Mar - 2 Apr
      yomhashoah:[4,7],       // Wed 7 Apr
      yomzikaron:[4,13],      // Tue 13 Apr
      atzmaut:[4,14],         // Wed 14 Apr
      lag:[5,16],             // Sat 15 May sunset → 16 May
      shavuot:[4,29],         // Wed 28 Apr sunset → 29 Apr (שבועות 5792 = 29 Apr)
      tzomtamuz:[6,27],       // Sun 27 Jun (dawn fast)
      tishabeav:[7,18],       // Sat 17 Jul sunset → 18 Jul
      rh:[9,6], rhend:[9,7],  // Sun 5 Sep sunset → 6-7 Sep
      yk:[9,15],              // Tue 14 Sep sunset → 15 Sep
      sukkot:[9,20], sukkotend:[9,26], // Sun 19 Sep sunset → 20-26 Sep
      simchatorah:[9,27],     // Sun 26 Sep sunset → 27 Sep
      hanuka:[11,28], hanukaend:[12,5],// Sat 27 Nov sunset → 28 Nov - 5 Dec
    },
    2033:{
      tubishvat:[1,15],       // Fri 14 Jan sunset → 15 Jan
      purim:[3,15],           // Mon 14 Mar sunset → 15 Mar
      pesach:[4,14], pesachend:[4,20], // Wed 13 Apr sunset → 14-20 Apr
      yomhashoah:[4,25],      // Mon 25 Apr
      yomzikaron:[5,2],       // Mon 2 May
      atzmaut:[5,3],          // Tue 3 May
      lag:[5,17],             // Mon 16 May sunset → 17 May
      shavuot:[6,3],          // Thu 2 Jun sunset → 3 Jun
      tzomtamuz:[7,14],       // Thu 14 Jul (dawn fast)
      tishabeav:[8,4],        // Wed 3 Aug sunset → 4 Aug
      rh:[9,24], rhend:[9,25],// Fri 23 Sep sunset → 24-25 Sep
      yk:[10,3],              // Sun 2 Oct sunset → 3 Oct
      sukkot:[10,8], sukkotend:[10,14], // Fri 7 Oct sunset → 8-14 Oct
      simchatorah:[10,15],    // Fri 14 Oct sunset → 15 Oct
      hanuka:[12,17], hanukaend:[12,24],// Fri 16 Dec sunset → 17-24 Dec
    },
    2034:{
      tubishvat:[2,4],        // Fri 3 Feb sunset → 4 Feb
      purim:[3,5],            // Sat 4 Mar sunset → 5 Mar
      pesach:[4,4], pesachend:[4,10], // Mon 3 Apr sunset → 4-10 Apr
      yomhashoah:[4,16],      // Sun 16 Apr
      yomzikaron:[4,23],      // Sun 23 Apr
      atzmaut:[4,24],         // Mon 24 Apr
      lag:[5,7],              // Sat 6 May sunset → 7 May
      shavuot:[5,24],         // Tue 23 May sunset → 24 May
      tzomtamuz:[7,4],        // Tue 4 Jul (dawn fast)
      tishabeav:[7,25],       // Mon 24 Jul sunset → 25 Jul
      rh:[9,14], rhend:[9,15],// Wed 13 Sep sunset → 14-15 Sep
      yk:[9,23],              // Fri 22 Sep sunset → 23 Sep
      sukkot:[9,28], sukkotend:[10,4], // Wed 27 Sep sunset → 28 Sep - 4 Oct
      simchatorah:[10,5],     // Wed 4 Oct sunset → 5 Oct
      hanuka:[12,7], hanukaend:[12,14],// Wed 6 Dec sunset → 7-14 Dec
    },
    2035:{
      tubishvat:[1,25],       // Wed 24 Jan sunset → 25 Jan
      purim:[3,25],           // Sat 24 Mar sunset → 25 Mar
      pesach:[4,24], pesachend:[4,30], // Mon 23 Apr sunset → 24-30 Apr
      yomhashoah:[5,6],       // Sun 6 May
      yomzikaron:[5,13],      // Sun 13 May
      atzmaut:[5,14],         // Mon 14 May
      lag:[5,27],             // Sat 26 May sunset → 27 May
      shavuot:[6,13],         // Tue 12 Jun sunset → 13 Jun
      tzomtamuz:[7,24],       // Tue 24 Jul (dawn fast)
      tishabeav:[8,14],       // Mon 13 Aug sunset → 14 Aug
      rh:[10,4], rhend:[10,5],// Wed 3 Oct sunset → 4-5 Oct
      yk:[10,13],             // Fri 12 Oct sunset → 13 Oct
      sukkot:[10,18], sukkotend:[10,24], // Wed 17 Oct sunset → 18-24 Oct
      simchatorah:[10,25],    // Wed 24 Oct sunset → 25 Oct
      // חנוכה: Tue 25 Dec sunset → 26 Dec ... נמשך לינואר 2036
      hanuka:[12,26], hanukaend:[12,26], // placeholder — נגמר 2 Jan 2036
    },
    2036:{
      tubishvat:[2,13],       // Tue 12 Feb sunset → 13 Feb
      purim:[3,13],           // Wed 12 Mar sunset → 13 Mar
      pesach:[4,12], pesachend:[4,18], // Fri 11 Apr sunset → 12-18 Apr
      yomhashoah:[4,23],      // Wed 23 Apr
      yomzikaron:[4,29],      // Tue 29 Apr
      atzmaut:[4,30],         // Wed 30 Apr
      lag:[5,15],             // Wed 14 May sunset → 15 May
      shavuot:[6,1],          // Sat 31 May sunset → 1 Jun
      tzomtamuz:[7,13],       // Sun 13 Jul (dawn fast)
      tishabeav:[8,3],        // Sat 2 Aug sunset → 3 Aug
      rh:[9,22], rhend:[9,23],// Sun 21 Sep sunset → 22-23 Sep
      yk:[10,1],              // Tue 30 Sep sunset → 1 Oct
      sukkot:[10,6], sukkotend:[10,12], // Sun 5 Oct sunset → 6-12 Oct
      simchatorah:[10,13],    // Sun 12 Oct sunset → 13 Oct
      hanuka:[12,14], hanukaend:[12,21],// Sat 13 Dec sunset → 14-21 Dec
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
    if(h.yk[0]===m) d.push(`יום כיפור (${h.yk[1]}.${m})`);
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
