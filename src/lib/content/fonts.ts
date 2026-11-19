import type { CSSProperties } from "react";

/*
 * Fonts an admin can pick per block. Every one supports Hebrew. The font files are declared in
 * src/app/fonts.ts; browsers only download a font once a section actually uses it.
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

export type FontValue = "" | (typeof FONT_OPTIONS)[number]["value"];

/** Per-block font choice; "" keeps the site default. */
export type BlockFonts = { fontHeadline?: FontValue; fontText?: FontValue };

/** CSS font-family stack for a choice, or undefined for "default". */
export function fontStack(value: string | undefined): string | undefined {
  const opt = FONT_OPTIONS.find((o) => o.value === value);
  return opt ? `var(${opt.cssVar}), var(--font-heebo), ui-sans-serif, system-ui, sans-serif` : undefined;
}

/**
 * Style for a section's root element. It overrides the theme's font variables, which every
 * `font-display` / `font-sans` element inside reads. Put `font-sans` on the same root so plain
 * inherited text picks the override up too.
 */
export function blockFontStyle(fonts: BlockFonts): CSSProperties | undefined {
  const display = fontStack(fonts.fontHeadline);
  const sans = fontStack(fonts.fontText);
  if (!display && !sans) return undefined;
  return {
    ...(display ? { "--font-display": display } : {}),
    ...(sans ? { "--font-sans": sans } : {}),
  } as CSSProperties;
}
