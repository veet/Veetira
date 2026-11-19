/*
 * Describes every editable block for the admin editor, and sanitises incoming data.
 * One schema drives both the form UI and server-side validation, so they can't drift apart.
 */
import type { BlockKey, SiteContent } from "./types";
import { defaults } from "./defaults";
import { FONT_OPTIONS, LEADING_OPTIONS, SIZE_OPTIONS, WEIGHT_OPTIONS } from "./fonts";

type Base = { key: string; label: string; help?: string };
export type Field =
  | (Base & { type: "text"; max?: number; placeholder?: string })
  | (Base & { type: "textarea"; max?: number; rows?: number })
  | (Base & { type: "number"; min?: number; max?: number; step?: number })
  | (Base & { type: "time" })
  | (Base & { type: "select"; options: { value: string | number; label: string }[]; preview?: "font" })
  | (Base & { type: "list"; itemLabel: string; titleKey?: string; fields: Field[]; max?: number });

export type BlockSchema = { key: BlockKey; title: string; description: string; fields: Field[] };

const ART = ["cup", "iced", "croissant", "cookie", "cake", "bun", "burrito"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));
const ACCENT_HELP = "Wrap a word in *asterisks* for the italic accent. Each new line animates separately.";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const contentSchemas: BlockSchema[] = [
  {
    key: "brand",
    title: "Brand & contact",
    description: "Name, contact details and social links used across the site.",
    fields: [
      { key: "name", label: "Brand name", type: "text", max: 60 },
      { key: "email", label: "Email", type: "text", max: 120 },
      { key: "phone", label: "Phone", type: "text", max: 40 },
      { key: "instagram", label: "Instagram handle", type: "text", max: 60 },
      { key: "instagramUrl", label: "Instagram link", type: "text", max: 300 },
      { key: "tiktokUrl", label: "TikTok link", type: "text", max: 300 },
      { key: "googleUrl", label: "Google Maps / reviews link", type: "text", max: 300 },
    ],
  },
  {
    key: "seo",
    title: "SEO & sharing",
    description: "Browser tab title and the description search engines and social previews show.",
    fields: [
      { key: "title", label: "Page title", type: "text", max: 120 },
      { key: "description", label: "Description", type: "textarea", max: 300, rows: 3 },
    ],
  },
  {
    key: "hero",
    title: "Hero",
    description: "The first screen: tagline, headline, icons and buttons.",
    fields: [
      { key: "eyebrow", label: "Line under the logo", type: "text", max: 80 },
      { key: "headline", label: "Headline", type: "textarea", rows: 3, max: 200, help: ACCENT_HELP },
      { key: "chips", label: "Icon labels", type: "list", itemLabel: "Label", titleKey: "label", max: 3, fields: [{ key: "label", label: "Label", type: "text", max: 20 }] },
      { key: "intro", label: "Intro paragraph", type: "textarea", rows: 3, max: 400 },
      { key: "primaryCta", label: "Main button", type: "text", max: 40 },
      { key: "secondaryCta", label: "Second button", type: "text", max: 40 },
    ],
  },
  {
    key: "marquee",
    title: "Scrolling words",
    description: "The band of words that scrolls under the hero.",
    fields: [{ key: "words", label: "Words", type: "list", itemLabel: "Word", titleKey: "text", max: 20, fields: [{ key: "text", label: "Word", type: "text", max: 40 }] }],
  },
  {
    key: "manifesto",
    title: "Manifesto",
    description: "The big paragraph that lights up word by word.",
    fields: [
      { key: "eyebrow", label: "Label", type: "text", max: 40 },
      { key: "text", label: "Text", type: "textarea", rows: 5, max: 600, help: "Insert {cup}, {croissant} or {cookie} to place a small image pill." },
    ],
  },
  {
    key: "menu",
    title: "Menu",
    description: "Categories, drinks, food and prices.",
    fields: [
      { key: "eyebrow", label: "Label", type: "text", max: 40 },
      { key: "headline", label: "Headline", type: "textarea", rows: 2, max: 120, help: ACCENT_HELP },
      {
        key: "categories",
        label: "Categories",
        type: "list",
        itemLabel: "Category",
        titleKey: "label",
        max: 8,
        fields: [
          { key: "label", label: "Category name", type: "text", max: 30 },
          {
            key: "items",
            label: "Items",
            type: "list",
            itemLabel: "Item",
            titleKey: "name",
            max: 30,
            fields: [
              { key: "name", label: "Name", type: "text", max: 60 },
              { key: "description", label: "Description", type: "textarea", rows: 2, max: 200 },
              { key: "price", label: "Price (₪)", type: "number", min: 0, max: 1000, step: 0.5 },
              { key: "tag", label: "Badge", type: "select", options: [{ value: "", label: "None" }, { value: "Signature", label: "Signature" }, { value: "Vegan", label: "Vegan" }] },
              { key: "art", label: "Illustration", type: "select", options: ART },
            ],
          },
        ],
      },
      { key: "noteTitle", label: "Last card — title", type: "text", max: 120, help: "Use *asterisks* for the accent." },
      { key: "noteBody", label: "Last card — small print", type: "text", max: 200 },
    ],
  },
  {
    key: "findTruck",
    title: "Find the truck",
    description: "Weekly schedule and map pins. Today's stop and open/closed status are worked out automatically.",
    fields: [
      { key: "eyebrow", label: "Label", type: "text", max: 40 },
      { key: "headline", label: "Headline", type: "textarea", rows: 2, max: 120, help: ACCENT_HELP },
      { key: "body", label: "Note", type: "textarea", rows: 2, max: 300 },
      {
        key: "stops",
        label: "Weekly stops",
        type: "list",
        itemLabel: "Stop",
        titleKey: "location",
        max: 7,
        fields: [
          { key: "day", label: "Day", type: "select", options: DAYS.map((d, i) => ({ value: i, label: d })) },
          { key: "location", label: "Location", type: "text", max: 60 },
          { key: "area", label: "Where exactly", type: "text", max: 80 },
          { key: "open", label: "Opens", type: "time" },
          { key: "close", label: "Closes", type: "time" },
          { key: "x", label: "Map pin — across (0–100)", type: "number", min: 2, max: 98 },
          { key: "y", label: "Map pin — down (0–100)", type: "number", min: 4, max: 96 },
        ],
      },
    ],
  },
  {
    key: "story",
    title: "Our story",
    description: "Story text, counting numbers and tile captions.",
    fields: [
      { key: "eyebrow", label: "Label", type: "text", max: 40 },
      { key: "headline", label: "Headline", type: "textarea", rows: 2, max: 120, help: ACCENT_HELP },
      { key: "body", label: "Story", type: "textarea", rows: 5, max: 800 },
      {
        key: "stats",
        label: "Numbers",
        type: "list",
        itemLabel: "Number",
        titleKey: "label",
        max: 3,
        fields: [
          { key: "value", label: "Number", type: "number", min: 0, max: 1_000_000 },
          { key: "suffix", label: "After the number (e.g. k+, mi)", type: "text", max: 6 },
          { key: "label", label: "Caption", type: "text", max: 60 },
        ],
      },
      { key: "tileBar", label: "Big tile caption", type: "text", max: 40 },
      { key: "tileBakery", label: "Bakery tile caption", type: "text", max: 40 },
      { key: "tileRoasted", label: "Cream tile text", type: "text", max: 30 },
      { key: "badge", label: "Rotating badge text", type: "text", max: 40 },
    ],
  },
  {
    key: "gallery",
    title: "Gallery",
    description: "The draggable strip of tiles.",
    fields: [
      { key: "headline", label: "Headline", type: "text", max: 60, help: "Use *asterisks* for the accent." },
      { key: "hint", label: "Hint text", type: "text", max: 60 },
      {
        key: "tiles",
        label: "Tiles",
        type: "list",
        itemLabel: "Tile",
        titleKey: "caption",
        max: 12,
        fields: [
          { key: "caption", label: "Caption", type: "text", max: 50 },
          { key: "art", label: "Illustration", type: "select", options: ART },
          {
            key: "color",
            label: "Background",
            type: "select",
            options: ["cobalt", "deep", "azure", "amber", "foam", "latte", "velvet"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })),
          },
        ],
      },
    ],
  },
  {
    key: "events",
    title: "Events & booking form",
    description: "Catering pitch and the booking form options.",
    fields: [
      { key: "eyebrow", label: "Label", type: "text", max: 40 },
      { key: "headline", label: "Headline", type: "textarea", rows: 2, max: 120, help: ACCENT_HELP },
      { key: "body", label: "Paragraph", type: "textarea", rows: 3, max: 400 },
      { key: "bullets", label: "Selling points", type: "list", itemLabel: "Point", titleKey: "text", max: 6, fields: [{ key: "text", label: "Text", type: "text", max: 80 }] },
      { key: "eventTypes", label: "Event types (form choices)", type: "list", itemLabel: "Type", titleKey: "text", max: 10, fields: [{ key: "text", label: "Type", type: "text", max: 40 }] },
      { key: "minGuests", label: "Minimum guests", type: "number", min: 1, max: 1000 },
      { key: "submitLabel", label: "Button text", type: "text", max: 40 },
      { key: "successTitle", label: "Success title", type: "text", max: 60, help: "Use *asterisks* for the accent." },
      { key: "successBody", label: "Success message", type: "textarea", rows: 2, max: 200 },
    ],
  },
  {
    key: "footer",
    title: "Footer & newsletter",
    description: "Closing headline, hours and the newsletter signup.",
    fields: [
      { key: "headline", label: "Headline", type: "textarea", rows: 2, max: 120, help: ACCENT_HELP },
      { key: "hoursTitle", label: "Hours — first line", type: "text", max: 60 },
      { key: "hoursLine", label: "Hours — second line", type: "text", max: 60, help: "Use a plain hyphen between times (07:00-14:00); a long dash flips their order in Hebrew." },
      { key: "newsletterTitle", label: "Newsletter title", type: "text", max: 40 },
      { key: "newsletterBody", label: "Newsletter text", type: "textarea", rows: 2, max: 200 },
      { key: "bottomLine", label: "Bottom line", type: "text", max: 80 },
    ],
  },
];

/* ---------- per-block typography ---------- */

const withDefault = (opts: readonly { value: string; label: string }[]) => [{ value: "", label: "Default" }, ...opts.map((o) => ({ value: o.value, label: o.label }))];
const FONT_CHOICES = withDefault(FONT_OPTIONS);
const SIZE_CHOICES = withDefault(SIZE_OPTIONS);
const WEIGHT_CHOICES = withDefault(WEIGHT_OPTIONS);
const LEADING_CHOICES = withDefault(LEADING_OPTIONS);

/** Blocks that are visible on the page get headline and text typography controls. */
const NO_FONTS: BlockKey[] = ["seo"];

const typeFields = (): Field[] => [
  { key: "fontHeadline", label: "Font", type: "select", preview: "font", options: FONT_CHOICES },
  { key: "sizeHeadline", label: "Size", type: "select", options: SIZE_CHOICES },
  { key: "weightHeadline", label: "Weight", type: "select", options: WEIGHT_CHOICES },
  { key: "leadingHeadline", label: "Line height", type: "select", options: LEADING_CHOICES },
  { key: "fontText", label: "Font", type: "select", preview: "font", options: FONT_CHOICES },
  { key: "sizeText", label: "Size", type: "select", options: SIZE_CHOICES },
  { key: "weightText", label: "Weight", type: "select", options: WEIGHT_CHOICES },
  { key: "leadingText", label: "Line height", type: "select", options: LEADING_CHOICES },
];

export const blockSchemas: BlockSchema[] = contentSchemas.map((s) => (NO_FONTS.includes(s.key) ? s : { ...s, fields: [...s.fields, ...typeFields()] }));

export const schemaFor = (key: string) => blockSchemas.find((b) => b.key === key);

/* ---------- sanitising ---------- */

function sanitizeField(field: Field, value: unknown, fallback: unknown): unknown {
  switch (field.type) {
    case "text":
    case "textarea": {
      if (typeof value !== "string") return fallback;
      const max = field.max ?? 2000;
      return value.replace(/\r\n/g, "\n").slice(0, max);
    }
    case "number": {
      const n = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
      if (!Number.isFinite(n)) return fallback;
      return Math.min(field.max ?? Infinity, Math.max(field.min ?? -Infinity, n));
    }
    case "time":
      return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : fallback;
    case "select": {
      const match = field.options.find((o) => String(o.value) === String(value));
      return match ? match.value : fallback;
    }
    case "list": {
      if (!Array.isArray(value)) return fallback;
      const fbItems = Array.isArray(fallback) ? fallback : [];
      return value.slice(0, field.max ?? 100).map((item, i) => sanitizeObject(field.fields, item, fbItems[i] ?? fbItems[0] ?? {}));
    }
  }
}

function sanitizeObject(fields: Field[], value: unknown, fallback: unknown): Record<string, unknown> {
  const src = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const fb = fallback && typeof fallback === "object" ? (fallback as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const fbVal = fb[f.key] ?? emptyValue(f);
    out[f.key] = f.key in src ? sanitizeField(f, src[f.key], fbVal) : fbVal;
  }
  return out;
}

export function emptyValue(f: Field): unknown {
  switch (f.type) {
    case "number":
      return f.min ?? 0;
    case "time":
      return "09:00";
    case "select":
      return f.options[0]?.value ?? "";
    case "list":
      return [];
    default:
      return "";
  }
}

export function emptyItem(fields: Field[]) {
  return Object.fromEntries(fields.map((f) => [f.key, emptyValue(f)]));
}

/** Clean data for a block: keeps only known fields, coerces types, clamps lengths, falls back to defaults. */
export function sanitizeBlock<K extends BlockKey>(key: K, value: unknown): SiteContent[K] {
  const schema = schemaFor(key);
  if (!schema) throw new Error(`Unknown block "${key}"`);
  return sanitizeObject(schema.fields, value, defaults[key]) as SiteContent[K];
}
