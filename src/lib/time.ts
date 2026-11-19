"use client";

import { useSyncExternalStore } from "react";
import type { Stop } from "./content/types";

export const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
/** Short Hebrew day letters, as on Israeli calendars. */
export const DAY_SHORT = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** 24-hour clock, as used in Israel: "07:00". */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
}

/** "07:00–11:00", kept left-to-right inside Hebrew text with Unicode isolates. */
export function formatRange(open: string, close: string) {
  return `⁦${formatTime(open)}–${formatTime(close)}⁩`;
}

/* Clock store, minute resolution. Server snapshot is null so prerendered HTML never bakes in a stale day. */
let cached: Date | null = null;
const getSnapshot = () => {
  const minute = Math.floor(Date.now() / 60_000);
  if (!cached || Math.floor(cached.getTime() / 60_000) !== minute) cached = new Date();
  return cached;
};
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};

export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Media-query hook; false on the server. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export type TruckStatus = { stop: Stop | undefined; isOpen: boolean; label: string };

export function getStatus(now: Date, stops: Stop[]): TruckStatus {
  const stop = stops.find((s) => s.day === now.getDay());
  if (!stop) return { stop, isOpen: false, label: "היום לא בדרכים" };
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(stop.open);
  const close = toMinutes(stop.close);
  if (mins >= open && mins < close) return { stop, isOpen: true, label: `פתוח עכשיו · ${stop.location}` };
  if (mins < open) return { stop, isOpen: false, label: `היום מ־${formatTime(stop.open)} · ${stop.location}` };
  return { stop, isOpen: false, label: "סגור · נחזור מחר" };
}
