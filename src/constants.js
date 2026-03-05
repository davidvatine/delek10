export const BL = "#1565C0";
export const BLl = "#1E88E5";
export const RD = "#D32F2F";
export const WH = "#fff";
export const BG = "#EEF2F7";
export const BR = "#CFD8DC";
export const DK = "#1A2733";

export const APP_LINK = "https://ten.onelink.me/Cdb1/e3lfcju1";
export const CAREER_LINK = "https://www.10ten.co.il/%D7%A7%D7%A8%D7%99%D7%99%D7%A8%D7%94";
export const WHATSAPP = "054-3207261";
export const STORAGE_KEY = "ten-gantt-v5";

export const DISC = `*החיסכון בתשלום באמצעות כרטיס מועדון TenVIP או בתשלום באפליקציית Ten. החיסכון ממחיר בנזין בשירות מלא, כפי שנקבע ע"י מנהל הדלק. החיסכון הינו בתדלוק בשירות עצמי בלבד, אין כפל מבצעים והנחות.`;

export const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
export const DHE = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

export const MD = {
  1:{season:"חורף",emoji:"❄️",weather:"קור וגשמים",holidays:[{d:15,n:'ט"ו בשבט'}],news:"גשמי חורף, עלייה במחירים"},
  2:{season:"חורף",emoji:"🌧️",weather:"גשמים, קור",holidays:[{d:14,n:"ולנטיינס"}],news:"חורף מלא, מלחמה עם איראן"},
  3:{season:"אביב",emoji:"🌸",weather:"מתחמם, פריחה",holidays:[{d:3,n:"פורים"},{d:20,n:"תחילת אביב"},{d:28,n:'ר"ח ניסן'}],news:"מלחמה עם איראן (מבצע שאגת הארי), פורים ב-3.3, ישראלים קרובים לבית בתחילת מרץ, האביב עם תקווה"},
  4:{season:"אביב",emoji:"🌿",weather:"פריחה, טיולים",holidays:[{d:2,n:"פסח"},{d:21,n:"יום הזיכרון"},{d:22,n:"יום העצמאות"}],news:"פסח ונסיעות לחג"},
  5:{season:"קיץ",emoji:"🌻",weather:"חמים, שמש",holidays:[{d:5,n:'ל"ג בעומר'},{d:21,n:"שבועות"}],news:"קיץ קרב"},
  6:{season:"קיץ",emoji:"☀️",weather:"חום, מזגן",holidays:[{d:21,n:"תחילת קיץ"}],news:"גל חום, חופשות"},
  7:{season:"קיץ",emoji:"🏖️",weather:"חום שיא",holidays:[{d:9,n:"תשעה באב"}],news:"חופשות קיץ"},
  8:{season:"קיץ",emoji:"🌊",weather:"חום, חזרה לשגרה",holidays:[{d:30,n:"פתיחת שנת לימודים"}],news:"חזרה לבתי ספר"},
  9:{season:"סתיו",emoji:"🍂",weather:"מתקרר, חגי תשרי",holidays:[{d:22,n:"ראש השנה"},{d:24,n:"כיפור"}],news:"חגי תשרי"},
  10:{season:"סתיו",emoji:"🌧️",weather:"גשמים ראשונים",holidays:[{d:1,n:"סוכות"}],news:"גשמים ראשונים"},
  11:{season:"חורף",emoji:"🍁",weather:"גשמים, קריר",holidays:[{d:28,n:"חנוכה"}],news:"חנוכה קרב"},
  12:{season:"חורף",emoji:"🕎",weather:"קור, חנוכה",holidays:[{d:1,n:"חנוכה"},{d:31,n:"סילבסטר"}],news:"חנוכה, עונת מתנות"},
};

export const getCtx = (m) => MD[m] || {season:"כללי",emoji:"📅",weather:"",holidays:[],news:""};
