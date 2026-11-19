/* Shape of every editable block on the site. Defaults live in ./defaults.ts, the admin form schema in ./schema.ts. */

import type { BlockFonts } from "./fonts";

export type Art = "cup" | "iced" | "croissant" | "cookie" | "cake" | "bun" | "burrito";
export type Tag = "" | "Signature" | "Vegan";
export type TileColor = "cobalt" | "amber" | "deep" | "foam" | "azure" | "latte" | "velvet";

export type MenuItem = { name: string; description: string; price: number; tag: Tag; art: Art };
export type MenuCategory = { label: string; items: MenuItem[] };

export type Stop = {
  day: number; // 0 = Sunday
  location: string;
  area: string;
  open: string; // "HH:MM"
  close: string;
  x: number; // map position, % of width
  y: number; // % of height
};

type Content = {
  brand: { name: string; email: string; phone: string; instagram: string; instagramUrl: string; tiktokUrl: string; googleUrl: string };
  seo: { title: string; description: string };
  hero: { eyebrow: string; headline: string; chips: { label: string }[]; intro: string; primaryCta: string; secondaryCta: string };
  marquee: { words: { text: string }[] };
  manifesto: { eyebrow: string; text: string };
  menu: { eyebrow: string; headline: string; categories: MenuCategory[]; noteTitle: string; noteBody: string };
  findTruck: { eyebrow: string; headline: string; body: string; stops: Stop[] };
  story: {
    eyebrow: string;
    headline: string;
    body: string;
    stats: { value: number; suffix: string; label: string }[];
    tileBar: string;
    tileBakery: string;
    tileRoasted: string;
    badge: string;
  };
  gallery: { headline: string; hint: string; tiles: { caption: string; art: Art; color: TileColor }[] };
  events: {
    eyebrow: string;
    headline: string;
    body: string;
    bullets: { text: string }[];
    eventTypes: { text: string }[];
    minGuests: number;
    submitLabel: string;
    successTitle: string;
    successBody: string;
  };
  footer: { headline: string; hoursTitle: string; hoursLine: string; newsletterTitle: string; newsletterBody: string; bottomLine: string };
};

/** Every visible block also carries its own font choices (picked in /admin). */
export type SiteContent = { [K in keyof Content]: K extends "seo" ? Content[K] : Content[K] & BlockFonts };

export type BlockKey = keyof SiteContent;
