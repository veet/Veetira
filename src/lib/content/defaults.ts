import type { SiteContent } from "./types";

/*
 * Default content. Used to seed the database and as a fallback for any field that is missing.
 * Text conventions (see Rich.tsx):
 *   *word*      → accent word in the italic serif
 *   new lines   → separate animated headline lines
 *   {cup} {croissant} {cookie}  → image pill (manifesto only)
 */
export const defaults: SiteContent = {
  brand: {
    name: "אהבות קטנות",
    email: "hello@ahavotktanot.co",
    phone: "(555) 018-2024",
    instagram: "@ahavot.ktanot",
    instagramUrl: "#",
    tiktokUrl: "#",
    googleUrl: "#",
  },
  seo: {
    title: "אהבות קטנות — Coffee & Bakery on Wheels",
    description:
      "Small-batch espresso, nitro cold brew and fresh bakes served from a cobalt-blue coffee truck. Find this week's stops or book us for your event.",
  },
  hero: {
    eyebrow: "Coffee · Bakery · On wheels",
    headline: "Simple ingredients,\n*extraordinary*\ntaste.",
    chips: [{ label: "Bakery" }, { label: "Coffee" }, { label: "Desserts" }],
    intro: "Single-origin espresso, 18-hour cold brew and bakes from our morning oven. Served from a cobalt truck that rolls to a new corner every day.",
    primaryCta: "Find the truck →",
    secondaryCta: "Menu",
  },
  marquee: {
    words: ["Espresso", "Cold Brew", "Fresh Bakes", "Nitro on Tap", "Red Velvet", "Oat Lattes", "Catering"].map((text) => ({ text })),
  },
  manifesto: {
    eyebrow: "Our manifesto",
    text: "We believe café-quality coffee {cup} shouldn't need a café. So we bolted an espresso machine into a truck, found a great baker {croissant} and started showing up where people actually are {cookie}",
  },
  menu: {
    eyebrow: "The menu",
    headline: "Short list.\nDone *properly.*",
    noteTitle: "Oat, almond or whole milk — *always free.*",
    noteBody: "Extra shot +$1 · Decaf on request · Bring your own cup, save $0.50",
    categories: [
      {
        label: "Espresso",
        items: [
          { name: "Espresso", description: "A double shot of our seasonal house blend. Cocoa, cherry, brown sugar.", price: 3.25, tag: "", art: "cup" },
          { name: "Cortado", description: "Equal parts espresso and silky steamed milk.", price: 4.25, tag: "", art: "cup" },
          { name: "Flat White", description: "Ristretto shots under a thin, glossy microfoam.", price: 4.75, tag: "", art: "cup" },
          { name: "Oat Latte", description: "House blend, creamy oat milk, a proper heart on top.", price: 5.25, tag: "Vegan", art: "cup" },
          { name: "Honey Lavender Latte", description: "Local wildflower honey, dried lavender, a pinch of sea salt.", price: 6.0, tag: "Signature", art: "cup" },
        ],
      },
      {
        label: "Cold Bar",
        items: [
          { name: "Cold Brew", description: "Steeped for 18 hours. Smooth, chocolatey, dangerously strong.", price: 4.75, tag: "", art: "iced" },
          { name: "Nitro Cold Brew", description: "Cold brew on a nitrogen tap, poured like a stout.", price: 5.5, tag: "Signature", art: "iced" },
          { name: "Espresso Tonic", description: "Double shot over tonic with an orange twist.", price: 5.25, tag: "", art: "iced" },
          { name: "Matcha Cloud", description: "Ceremonial matcha under vanilla cold foam.", price: 6.0, tag: "Vegan", art: "iced" },
        ],
      },
      {
        label: "Bites",
        items: [
          { name: "Butter Croissant", description: "Laminated for three days. Shatters on the first bite.", price: 4.0, tag: "", art: "croissant" },
          { name: "Cardamom Bun", description: "Swedish-style, twisted and glazed with pearl sugar.", price: 4.75, tag: "Signature", art: "bun" },
          { name: "Breakfast Burrito", description: "Soft eggs, crispy potato, cheddar, salsa verde.", price: 9.5, tag: "", art: "burrito" },
        ],
      },
      {
        label: "Desserts",
        items: [
          { name: "Chocolate Chip Cookie", description: "Brown butter, dark chocolate pools, flaky salt.", price: 3.75, tag: "", art: "cookie" },
          { name: "Red Velvet Cake", description: "Three layers, whipped cream-cheese frosting.", price: 6.5, tag: "Signature", art: "cake" },
          { name: "Vegan Brownie Cookie", description: "Fudgy, crackly-topped, no one can tell.", price: 4.0, tag: "Vegan", art: "cookie" },
        ],
      },
    ],
  },
  findTruck: {
    eyebrow: "Find the truck",
    headline: "Same truck.\nNew *corner.*",
    body: "Weather or a flat tire can change plans — we post live updates on Instagram first.",
    stops: [
      { day: 1, location: "Riverside Business Park", area: "Lot C, by the fountain", open: "07:00", close: "11:00", x: 18, y: 30 },
      { day: 2, location: "City College", area: "Main quad entrance", open: "07:30", close: "13:00", x: 42, y: 18 },
      { day: 3, location: "Union Square", area: "Corner of 5th & Pine", open: "07:00", close: "12:00", x: 52, y: 48 },
      { day: 4, location: "Tech Hub Campus", area: "Building 2 courtyard", open: "07:00", close: "11:30", x: 76, y: 26 },
      { day: 5, location: "Harbor Pier", area: "Next to the ferry terminal", open: "07:00", close: "14:00", x: 84, y: 72 },
      { day: 6, location: "Farmers Market", area: "Stall 14, Market Street", open: "08:00", close: "14:00", x: 34, y: 70 },
      { day: 0, location: "Greenway Park", area: "Near the playground", open: "09:00", close: "13:00", x: 62, y: 84 },
    ],
  },
  story: {
    eyebrow: "Our story",
    headline: "One borrowed van.\nOne *stubborn* idea.",
    body: "In 2019 we squeezed a two-group espresso machine into a borrowed van and parked outside an office park. Six years later it's a proper truck, a crew of four, and the same obsession: beans roasted 12 miles away, never more than ten days old, pulled with care for whoever is in line.",
    stats: [
      { value: 120, suffix: "k+", label: "Cups poured since day one" },
      { value: 7, suffix: "", label: "Stops across the city, every week" },
      { value: 12, suffix: " mi", label: "From our roaster to your cup" },
    ],
    tileBar: "The bar, since 2019",
    tileBakery: "Baked at 5am",
    tileRoasted: "Roasted locally",
    badge: "SMALL BATCH · SINCE 2019 ·",
  },
  gallery: {
    headline: "Life on *wheels.*",
    hint: "Drag to explore",
    tiles: [
      { caption: "Morning rush, Harbor Pier", art: "cup", color: "cobalt" },
      { caption: "Fresh out of the oven", art: "croissant", color: "amber" },
      { caption: "Nitro on tap", art: "iced", color: "deep" },
      { caption: "Red velvet Fridays", art: "cake", color: "foam" },
      { caption: "Brown butter, always", art: "cookie", color: "azure" },
      { caption: "Cardamom season", art: "bun", color: "latte" },
      { caption: "Saturday market", art: "burrito", color: "velvet" },
    ],
  },
  events: {
    eyebrow: "Events & catering",
    headline: "Bring the\ntruck *to you.*",
    body: "Weddings, office mornings, film sets, launch parties. We pull up, run on our own silent battery, and pour unlimited espresso drinks for your guests.",
    bullets: [{ text: "20 to 500 guests" }, { text: "Custom drink menu & branded cups" }, { text: "Fully self-sufficient — no power or water needed" }],
    eventTypes: ["Office / Corporate", "Wedding", "Birthday / Party", "Film / Photo shoot", "Other"].map((text) => ({ text })),
    minGuests: 20,
    submitLabel: "Check availability →",
    successTitle: "Request *received.*",
    successBody: "We'll reply within one business day with availability and a quote.",
  },
  footer: {
    headline: "Come say hi.\n*We'll have the cup ready.*",
    hoursTitle: "Every day, 7 days a week",
    hoursLine: "7am – 2pm (varies by stop)",
    newsletterTitle: "Little letters",
    newsletterBody: "New stops, seasonal drinks, the odd free cookie. Once a month, no spam.",
    bottomLine: "Simple ingredients, extraordinary taste.",
  },
};
