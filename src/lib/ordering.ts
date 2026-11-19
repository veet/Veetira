/*
 * Online pre-orders: pickup slots and order validation, shared by the checkout (browser) and the
 * API (server). The server always re-prices lines from the current menu, so a visitor can't
 * change prices in the browser.
 */
import type { MenuCategory, Stop } from "./content/types";
import { localToday } from "./validation";

export type CartLine = { ci: number; ii: number; name: string; price: number; qty: number };
export type Payment = "bit" | "cash";
export type Slot = { date: string; time: string; label: string; location: string };

export const MAX_QTY = 20;
export const MAX_LINES = 30;
export const PHONE_RE = /^[+\d][\d\s\-()]{7,18}$/;

// (lib/time.ts is a client module, so these small helpers live here too — this file runs on the server as well.)
const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

/** Pickup slots for the next stops (up to `days` days that still have times), in the visitor's local time. */
export function pickupSlots(now: Date, stops: Stop[], opts: { leadMinutes: number; slotMinutes: number; days?: number }): Slot[] {
  const step = Math.max(5, opts.slotMinutes || 15);
  const out: Slot[] = [];
  let daysWithSlots = 0;
  for (let offset = 0; offset < 8 && daysWithSlots < (opts.days ?? 2); offset++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const stop = stops.find((s) => s.day === d.getDay());
    if (!stop) continue;
    const earliest = offset === 0 ? now.getHours() * 60 + now.getMinutes() + (opts.leadMinutes || 0) : 0;
    const open = toMinutes(stop.open);
    const close = toMinutes(stop.close);
    let first = Math.max(open, earliest);
    first = Math.ceil((first - open) / step) * step + open; // snap to the step grid
    const dayLabel = offset === 0 ? "היום" : offset === 1 ? "מחר" : `יום ${DAY_NAMES[d.getDay()]}`;
    let added = 0;
    for (let m = first; m <= close - step; m += step) {
      out.push({ date: localToday(d), time: hhmm(m), label: `${dayLabel} · ${hhmm(m)}`, location: stop.location });
      added++;
    }
    if (added) daysWithSlots++;
  }
  return out;
}

export type OrderInput = {
  name: string;
  phone: string;
  date: string;
  time: string;
  note: string;
  payment: Payment;
  lines: CartLine[];
};
export type OrderErrors = Partial<Record<"name" | "phone" | "slot" | "payment" | "items", string>>;

/** Validates an order and re-prices every line from `menu`. Used by the API; the browser uses it for instant feedback. */
export function parseOrder(raw: Record<string, unknown>, ctx: { menu: MenuCategory[]; stops: Stop[]; todayUtc?: string }) {
  const str = (k: string, max: number) => String(raw[k] ?? "").trim().slice(0, max);
  const errors: OrderErrors = {};
  const name = str("name", 80);
  const phone = str("phone", 20);
  const date = str("date", 10);
  const time = str("time", 5);
  const note = str("note", 500);
  const payment = raw.payment === "bit" || raw.payment === "cash" ? (raw.payment as Payment) : null;

  if (name.length < 2) errors.name = "איך קוראים לך?";
  if (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 9) errors.phone = "מספר הטלפון לא נראה תקין.";
  if (!payment) errors.payment = "בחרו אמצעי תשלום.";

  // Pickup: a real date within the next 8 days, at a stop day, inside that stop's hours.
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  const today = ctx.todayUtc ?? localToday();
  const stop = validDate ? ctx.stops.find((s) => s.day === new Date(`${date}T12:00:00Z`).getUTCDay()) : undefined;
  const inRange = validDate && date >= shiftDate(today, -1) && date <= shiftDate(today, 8);
  if (!stop || !inRange || toMinutes(time) < toMinutes(stop.open) || toMinutes(time) > toMinutes(stop.close)) {
    errors.slot = "בחרו שעת איסוף.";
  }

  // Lines: look each one up in the current menu and take its price from there.
  const rawLines = Array.isArray(raw.lines) ? raw.lines.slice(0, MAX_LINES) : [];
  const lines: CartLine[] = [];
  let changed = false;
  for (const l of rawLines) {
    if (!l || typeof l !== "object") continue;
    const { ci, ii, name: lineName, qty } = l as Record<string, unknown>;
    const item = ctx.menu[Number(ci)]?.items[Number(ii)];
    const q = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(qty)) || 0));
    if (!item || item.name !== lineName) {
      changed = true;
      continue;
    }
    lines.push({ ci: Number(ci), ii: Number(ii), name: item.name, price: item.price, qty: q });
  }
  if (changed) errors.items = "התפריט התעדכן בינתיים — רעננו את הדף ונסו שוב.";
  else if (!lines.length) errors.items = "ההזמנה ריקה.";

  const total = Math.round(lines.reduce((sum, l) => sum + l.price * l.qty, 0) * 100) / 100;
  const input: OrderInput = { name, phone, date, time, note, payment: payment ?? "cash", lines };
  return { input, errors, ok: Object.keys(errors).length === 0, total, location: stop?.location ?? "" };
}

function shiftDate(yyyyMmDd: string, days: number) {
  const d = new Date(`${yyyyMmDd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const shekel = (n: number) => `₪${Number.isInteger(n) ? n : n.toFixed(2)}`;

/** Only allow real https links for the Bit button (never javascript: or other schemes). */
export const safeHttpsUrl = (url: string) => (/^https:\/\/[^\s"'<>]+$/i.test(url.trim()) ? url.trim() : "");
