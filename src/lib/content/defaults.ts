import type { SiteContent } from "./types";

/*
 * Default content (Hebrew). Used to seed the database and as a fallback for any field that is missing.
 * Text conventions (see Rich.tsx):
 *   *word*      → accent word in the serif
 *   new lines   → separate animated headline lines
 *   {cup} {croissant} {cookie}  → image pill (manifesto only)
 * Prices are in shekels (₪).
 */
export const defaults: SiteContent = {
  brand: {
    name: "אהבות קטנות",
    email: "hello@ahavotktanot.co",
    phone: "050-000-0000",
    instagram: "@ahavot.ktanot",
    instagramUrl: "#",
    tiktokUrl: "#",
    googleUrl: "#",
  },
  seo: {
    title: "אהבות קטנות — קפה ומאפים על גלגלים",
    description:
      "אספרסו בעבודת יד, קולד ברו ניטרו ומאפים טריים מטנדר קפה כחול. מצאו את התחנות של השבוע או הזמינו אותנו לאירוע שלכם.",
  },
  hero: {
    eyebrow: "קפה · מאפייה · על גלגלים",
    headline: "חומרים פשוטים,\nטעם *יוצא דופן.*",
    chips: [{ label: "מאפייה" }, { label: "קפה" }, { label: "קינוחים" }],
    intro: "אספרסו חד־זני, קולד ברו של 18 שעות ומאפים מהתנור של הבוקר. מוגש מטנדר כחול שמתייצב כל יום בפינה אחרת.",
    primaryCta: "איפה הטנדר? ←",
    secondaryCta: "לתפריט",
  },
  marquee: {
    words: ["אספרסו", "קולד ברו", "מאפים טריים", "ניטרו מהברז", "רד ולווט", "לאטה שיבולת שועל", "קייטרינג"].map((text) => ({ text })),
  },
  manifesto: {
    eyebrow: "המניפסט שלנו",
    text: "אנחנו מאמינים שקפה ברמה של בית קפה {cup} לא צריך בית קפה. אז הברגנו מכונת אספרסו לתוך טנדר, מצאנו אופה מעולה {croissant} והתחלנו להגיע לאן שאנשים באמת נמצאים {cookie}",
  },
  menu: {
    eyebrow: "התפריט",
    headline: "רשימה קצרה.\nעשויה *כמו שצריך.*",
    noteTitle: "שיבולת שועל, שקדים או חלב רגיל — *תמיד בלי תוספת.*",
    noteBody: "שוט נוסף ‎+4 ₪ · נטול קפאין לפי בקשה · מביאים כוס משלכם? ‎2 ₪ הנחה",
    categories: [
      {
        label: "אספרסו",
        items: [
          { name: "אספרסו", description: "שוט כפול מתערובת הבית העונתית. קקאו, דובדבן, סוכר חום.", price: 9, tag: "", art: "cup" },
          { name: "קורטדו", description: "אספרסו וחלב מוקצף משיי, חצי־חצי.", price: 13, tag: "", art: "cup" },
          { name: "פלאט וייט", description: "שוטים של ריסטרטו מתחת לקצף דק ומבריק.", price: 15, tag: "", art: "cup" },
          { name: "לאטה שיבולת שועל", description: "תערובת הבית, חלב שיבולת שועל קרמי ולב אמיתי מלמעלה.", price: 17, tag: "Vegan", art: "cup" },
          { name: "לאטה דבש ולבנדר", description: "דבש פרחי בר מקומי, לבנדר מיובש וקורט מלח ים.", price: 19, tag: "Signature", art: "cup" },
        ],
      },
      {
        label: "בר קר",
        items: [
          { name: "קולד ברו", description: "משרים 18 שעות. חלק, שוקולדי וחזק באופן מסוכן.", price: 15, tag: "", art: "iced" },
          { name: "ניטרו קולד ברו", description: "קולד ברו מברז חנקן, נמזג כמו בירה שחורה.", price: 18, tag: "Signature", art: "iced" },
          { name: "אספרסו טוניק", description: "שוט כפול על טוניק עם קליפת תפוז.", price: 17, tag: "", art: "iced" },
          { name: "ענן מאצ׳ה", description: "מאצ׳ה טקסית מתחת לקצף וניל קר.", price: 19, tag: "Vegan", art: "iced" },
        ],
      },
      {
        label: "נשנושים",
        items: [
          { name: "קרואסון חמאה", description: "בצק עלים שלושה ימים. מתפצפץ בביס הראשון.", price: 14, tag: "", art: "croissant" },
          { name: "שבלול הל", description: "בסגנון שוודי, מגולגל ומזוגג בסוכר פנינים.", price: 15, tag: "Signature", art: "bun" },
          { name: "בוריטו בוקר", description: "ביצים רכות, תפוחי אדמה פריכים, צ׳דר וסלסה ורדה.", price: 32, tag: "", art: "burrito" },
        ],
      },
      {
        label: "קינוחים",
        items: [
          { name: "עוגיית שוקולד צ׳יפס", description: "חמאה חומה, בריכות שוקולד מריר ופתיתי מלח.", price: 12, tag: "", art: "cookie" },
          { name: "עוגת רד ולווט", description: "שלוש שכבות, קרם גבינה מוקצף.", price: 22, tag: "Signature", art: "cake" },
          { name: "עוגיית בראוניז טבעונית", description: "פאדג׳ית, עם קרום סדוק. אף אחד לא ינחש.", price: 13, tag: "Vegan", art: "cookie" },
        ],
      },
    ],
  },
  findTruck: {
    eyebrow: "איפה הטנדר",
    headline: "אותו טנדר.\nפינה *חדשה.*",
    body: "מזג אוויר או פנצ׳ר יכולים לשנות תוכניות — עדכונים חיים מופיעים קודם באינסטגרם.",
    stops: [
      { day: 1, location: "פארק העסקים", area: "חניון ג׳, ליד המזרקה", open: "07:00", close: "11:00", x: 18, y: 30 },
      { day: 2, location: "קמפוס המכללה", area: "הכניסה הראשית לרחבה", open: "07:30", close: "13:00", x: 42, y: 18 },
      { day: 3, location: "כיכר העיר", area: "פינת הרחובות הראשיים", open: "07:00", close: "12:00", x: 52, y: 48 },
      { day: 4, location: "מתחם ההייטק", area: "חצר בניין 2", open: "07:00", close: "11:30", x: 76, y: 26 },
      { day: 5, location: "הנמל", area: "ליד תחנת המעבורת", open: "07:00", close: "14:00", x: 84, y: 72 },
      { day: 6, location: "שוק האיכרים", area: "דוכן 14, רחוב השוק", open: "08:00", close: "14:00", x: 34, y: 70 },
      { day: 0, location: "הפארק העירוני", area: "ליד מגרש המשחקים", open: "09:00", close: "13:00", x: 62, y: 84 },
    ],
  },
  story: {
    eyebrow: "הסיפור שלנו",
    headline: "טנדר אחד שאול.\nרעיון אחד *עקשן.*",
    body: "ב־2019 דחסנו מכונת אספרסו עם שני ראשים לתוך טנדר שאול וחנינו מול פארק משרדים. שש שנים אחר כך יש לנו טנדר אמיתי, צוות של ארבעה, ואותה אובססיה: פולים שנקלים 20 ק״מ מכאן, אף פעם לא בני יותר מעשרה ימים, ונמזגים בתשומת לב לכל מי שעומד בתור.",
    stats: [
      { value: 120000, suffix: "+", label: "כוסות מאז היום הראשון" },
      { value: 7, suffix: "", label: "תחנות ברחבי העיר, כל שבוע" },
      { value: 20, suffix: " ק״מ", label: "מהקלייה עד הכוס שלכם" },
    ],
    tileBar: "הבר, מאז 2019",
    tileBakery: "נאפה ב־5 בבוקר",
    tileRoasted: "נקלה מקומית",
    badge: "בקבוצות קטנות · מאז 2019 · ",
  },
  gallery: {
    headline: "החיים *על גלגלים.*",
    hint: "גררו כדי לגלות",
    tiles: [
      { caption: "שעת העומס, בנמל", art: "cup", color: "cobalt" },
      { caption: "טרי מהתנור", art: "croissant", color: "amber" },
      { caption: "ניטרו מהברז", art: "iced", color: "deep" },
      { caption: "שישי של רד ולווט", art: "cake", color: "foam" },
      { caption: "חמאה חומה, תמיד", art: "cookie", color: "azure" },
      { caption: "עונת ההל", art: "bun", color: "latte" },
      { caption: "שוק של שבת", art: "burrito", color: "velvet" },
    ],
  },
  events: {
    eyebrow: "אירועים וקייטרינג",
    headline: "מביאים\nאת הטנדר *אליכם.*",
    body: "חתונות, בקרים במשרד, סטים של צילומים ומסיבות השקה. אנחנו מגיעים, עובדים על סוללה שקטה משלנו ומוזגים משקאות אספרסו ללא הגבלה לאורחים שלכם.",
    bullets: [{ text: "מ־20 עד 500 אורחים" }, { text: "תפריט משקאות מותאם וכוסות ממותגות" }, { text: "עצמאיים לגמרי — בלי צורך בחשמל או מים" }],
    eventTypes: ["משרד / חברה", "חתונה", "יום הולדת / מסיבה", "צילומים", "אחר"].map((text) => ({ text })),
    minGuests: 20,
    submitLabel: "בדיקת זמינות ←",
    successTitle: "הבקשה *התקבלה.*",
    successBody: "נחזור אליכם תוך יום עסקים אחד עם זמינות והצעת מחיר.",
  },
  ordering: {
    enabled: "yes",
    title: "ההזמנה שלך",
    intro: "מזמינים מראש ואוספים מהטנדר בלי לחכות בתור.",
    addLabel: "הוספה +",
    pickupNote: "האיסוף מהטנדר, בתחנה של אותו יום.",
    leadMinutes: 15,
    slotMinutes: 15,
    bitPhone: "050-000-0000",
    bitLink: "",
    bitNote: "משלמים ב־Bit למספר שלנו. כתבו את מספר ההזמנה בהערה לתשלום.",
    cashNote: "משלמים במזומן באיסוף מהטנדר.",
    successTitle: "ההזמנה *התקבלה.*",
    successBody: "נתחיל להכין קרוב לשעת האיסוף. נתראה בטנדר!",
  },
  footer: {
    headline: "בואו להגיד שלום.\n*הכוס כבר תחכה לכם.*",
    hoursTitle: "כל יום, 7 ימים בשבוע",
    hoursLine: "07:00-14:00 (משתנה לפי תחנה)",
    newsletterTitle: "מכתבים קטנים",
    newsletterBody: "תחנות חדשות, משקאות עונתיים ומדי פעם עוגייה חינם. פעם בחודש, בלי ספאם.",
    bottomLine: "חומרים פשוטים, טעם יוצא דופן.",
  },
};
