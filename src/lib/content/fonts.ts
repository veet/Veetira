import type { CSSProperties } from "react";

/*
 * Per-block typography an admin can set in /admin: font, size, weight and line height, for the
 * section's headlines and for its text. Every font supports Hebrew. Font files are declared in
 * src/app/fonts.ts; browsers only download a font once a section actually uses it.
 * "" always means "keep the design's default".
 */
export const FONT_OPTIONS = [
  { value: "fredoka", label: "Fredoka — rounded (logo font)", cssVar: "--font-hebrew" },
  { value: "heebo", label: "Heebo — clean sans", cssVar: "--font-heebo" },
  { value: "rubik", label: "Rubik — soft sans", cssVar: "--font-rubik" },
  { value: "assistant", label: "Assistant — light sans", cssVar: "--font-assistant" },
  { value: "varela", label: "Varela Round — friendly", cssVar: "--font-varela" },
  { value: "secular", label: "Secular One — bold display", cssVar: "--font-secular" },
  { value: "suez", label: "Suez One — chunky serif", cssVar: "--font-suez" },
  { value: "frank", label: "Frank Ruhl Libre — classic serif", cssVar: "--font-frank" },
  { value: "david", label: "David Libre — book serif", cssVar: "--font-david" },
  { value: "amatic", label: "Amatic SC — handwritten", cssVar: "--font-amatic" },
  { value: "karantina", label: "Karantina — tall condensed", cssVar: "--font-karantina" },
] as const;

/** Size is a multiplier on the design's own size, so responsive sizes keep working. */
export const SIZE_OPTIONS = [
  { value: "0.7", label: "70% — much smaller" },
  { value: "0.8", label: "80%" },
  { value: "0.9", label: "90% — a bit smaller" },
  { value: "1.1", label: "110% — a bit bigger" },
  { value: "1.25", label: "125%" },
  { value: "1.5", label: "150% — much bigger" },
];

export const WEIGHT_OPTIONS = [
  { value: "200", label: "Thin (200)" },
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semi-bold (600)" },
  { value: "700", label: "Bold (700)" },
  { value: "800", label: "Extra-bold (800)" },
  { value: "900", label: "Black (900)" },
];

export const LEADING_OPTIONS = [
  { value: "0.85", label: "Very tight (0.85)" },
  { value: "0.95", label: "Tight (0.95)" },
  { value: "1.1", label: "Snug (1.1)" },
  { value: "1.3", label: "Normal (1.3)" },
  { value: "1.5", label: "Relaxed (1.5)" },
  { value: "1.8", label: "Loose (1.8)" },
];

export type FontValue = "" | (typeof FONT_OPTIONS)[number]["value"];

/** Per-block typography; every field is optional and "" keeps the default. */
export type BlockFonts = {
  fontHeadline?: FontValue;
  fontAccent?: FontValue;
  sizeHeadline?: string;
  weightHeadline?: string;
  leadingHeadline?: string;
  fontText?: FontValue;
  sizeText?: string;
  weightText?: string;
  leadingText?: string;
  alignText?: Align;
  alignButtons?: Align;
  alignImage?: Align;
};

/** Physical directions, since the site is right-to-left: "right" is where lines start. "" = design default. */
export type Align = "" | "right" | "center" | "left";
export const ALIGN_OPTIONS = [
  { value: "right", label: "Right" },
  { value: "center", label: "Center" },
  { value: "left", label: "Left" },
];
export const ALIGN_KEYS = ["alignText", "alignButtons", "alignImage"] as const;

/** Tailwind classes that move a section's main image column (hero, map, story collage). */
export function imageColumnClass(align: Align | undefined, layout: "three" | "two-first" | "two-second"): string {
  if (!align) return "";
  if (layout === "three") return align === "right" ? "lg:order-first" : align === "left" ? "lg:order-last" : "";
  // two-column grids: the image is the first (right) or second (left) column by default
  if (align === "center") return "lg:col-span-2";
  if (layout === "two-first") return align === "left" ? "lg:order-last" : "";
  return align === "right" ? "lg:order-first" : "";
}

/** The typography fields, in panel order: [headline…, text…]. */
export const TYPE_KEYS = ["fontHeadline", "fontAccent", "sizeHeadline", "weightHeadline", "leadingHeadline", "fontText", "sizeText", "weightText", "leadingText"] as const;

/** CSS font-family stack for a choice, or undefined for "default". */
export function fontStack(value: string | undefined): string | undefined {
  const opt = FONT_OPTIONS.find((o) => o.value === value);
  return opt ? `var(${opt.cssVar}), var(--font-heebo), ui-sans-serif, system-ui, sans-serif` : undefined;
}

/**
 * Props for a section's root element: CSS variables plus data-* flags that switch on the
 * matching rules in globals.css (only for settings that aren't "default"). Put `font-sans`
 * on the same root so plain inherited text picks up a text-font change.
 */
export function blockTypeProps(t: BlockFonts): { style?: CSSProperties } & Record<`data-${string}`, string> {
  const vars: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  const display = fontStack(t.fontHeadline);
  const sans = fontStack(t.fontText);
  const accent = fontStack(t.fontAccent);
  if (display) vars["--font-display"] = display;
  if (accent) vars["--font-serif"] = accent;
  if (sans) vars["--font-sans"] = sans;
  const set = (value: string | undefined, name: string) => {
    if (!value) return;
    vars[`--${name}`] = value;
    attrs[`data-${name}`] = "";
  };
  set(t.sizeHeadline, "hl-size");
  set(t.weightHeadline, "hl-weight");
  set(t.leadingHeadline, "hl-leading");
  set(t.sizeText, "tx-size");
  set(t.weightText, "tx-weight");
  set(t.leadingText, "tx-leading");
  if (t.alignText) attrs["data-align-text"] = t.alignText;
  if (t.alignButtons) attrs["data-align-buttons"] = t.alignButtons;
  if (t.alignImage) attrs["data-align-image"] = t.alignImage;
  return { ...(Object.keys(vars).length ? { style: vars as CSSProperties } : {}), ...attrs };
}
