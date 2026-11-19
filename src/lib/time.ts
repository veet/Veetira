"use client";

import { useSyncExternalStore } from "react";
import type { Stop } from "./content/types";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
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
  if (!stop) return { stop, isOpen: false, label: "Off the road today" };
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(stop.open);
  const close = toMinutes(stop.close);
  if (mins >= open && mins < close) return { stop, isOpen: true, label: `Open now · ${stop.location}` };
  if (mins < open) return { stop, isOpen: false, label: `Today ${formatTime(stop.open)} · ${stop.location}` };
  return { stop, isOpen: false, label: "Closed · back tomorrow" };
}
