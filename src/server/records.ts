import "server-only";
import { db } from "./db";

/* ---------- bookings ---------- */

export const BOOKING_STATUSES = ["new", "contacted", "confirmed", "declined"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type Booking = {
  id: number;
  name: string;
  email: string;
  event_date: string;
  guests: number;
  event_type: string;
  message: string;
  status: BookingStatus;
  notes: string;
  created_at: string;
};

export type NewBooking = Pick<Booking, "name" | "email" | "event_date" | "guests" | "event_type" | "message">;

export function createBooking(b: NewBooking): number {
  const res = db
    .prepare("INSERT INTO bookings (name, email, event_date, guests, event_type, message) VALUES (?, ?, ?, ?, ?, ?)")
    .run(b.name, b.email, b.event_date, b.guests, b.event_type, b.message);
  return Number(res.lastInsertRowid);
}

export function listBookings(status?: BookingStatus): Booking[] {
  const sql = status ? "SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC, id DESC" : "SELECT * FROM bookings ORDER BY created_at DESC, id DESC";
  const rows = status ? db.prepare(sql).all(status) : db.prepare(sql).all();
  return rows.map((r) => ({ ...r })) as unknown as Booking[]; // node:sqlite rows have a null prototype
}

export function updateBooking(id: number, patch: { status?: BookingStatus; notes?: string }) {
  if (patch.status) db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(patch.status, id);
  if (patch.notes !== undefined) db.prepare("UPDATE bookings SET notes = ? WHERE id = ?").run(patch.notes.slice(0, 2000), id);
}

export function deleteBooking(id: number) {
  db.prepare("DELETE FROM bookings WHERE id = ?").run(id);
}

export function bookingCounts(): Record<BookingStatus | "all", number> {
  const rows = db.prepare("SELECT status, COUNT(*) AS n FROM bookings GROUP BY status").all() as { status: BookingStatus; n: number }[];
  const out = { all: 0, new: 0, contacted: 0, confirmed: 0, declined: 0 };
  for (const r of rows) {
    out[r.status] = r.n;
    out.all += r.n;
  }
  return out;
}

/* ---------- newsletter ---------- */

export type Subscriber = { id: number; email: string; created_at: string };

/** Returns true when the address is new. */
export function addSubscriber(email: string): boolean {
  const res = db.prepare("INSERT OR IGNORE INTO subscribers (email) VALUES (?)").run(email);
  return res.changes > 0;
}

export function listSubscribers(): Subscriber[] {
  return db.prepare("SELECT * FROM subscribers ORDER BY created_at DESC, id DESC").all().map((r) => ({ ...r })) as unknown as Subscriber[];
}

export function deleteSubscriber(id: number) {
  db.prepare("DELETE FROM subscribers WHERE id = ?").run(id);
}

/* ---------- orders ---------- */

export const ORDER_STATUSES = ["new", "preparing", "ready", "picked_up", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = { name: string; price: number; qty: number };
export type Order = {
  id: number;
  name: string;
  phone: string;
  pickup_date: string;
  pickup_time: string;
  location: string;
  items: OrderItem[];
  total: number;
  payment: "bit" | "cash";
  paid: boolean;
  status: OrderStatus;
  note: string;
  created_at: string;
};

type NewOrder = Omit<Order, "id" | "paid" | "status" | "created_at">;

export function createOrder(o: NewOrder): number {
  const res = db
    .prepare("INSERT INTO orders (name, phone, pickup_date, pickup_time, location, items, total, payment, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(o.name, o.phone, o.pickup_date, o.pickup_time, o.location, JSON.stringify(o.items), o.total, o.payment, o.note);
  return Number(res.lastInsertRowid);
}

const toOrder = (r: Record<string, unknown>): Order => {
  let items: OrderItem[] = [];
  try {
    items = JSON.parse(String(r.items));
  } catch {}
  return { ...(r as unknown as Order), items, paid: Boolean(r.paid) };
};

/** Active orders (new / preparing / ready) first by pickup time; the rest newest first. */
export function listOrders(status?: OrderStatus): Order[] {
  const rows = status
    ? db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY pickup_date, pickup_time, id").all(status)
    : db
        .prepare(
          "SELECT * FROM orders ORDER BY CASE WHEN status IN ('new','preparing','ready') THEN 0 ELSE 1 END, CASE WHEN status IN ('new','preparing','ready') THEN pickup_date || ' ' || pickup_time END, created_at DESC, id DESC"
        )
        .all();
  return rows.map((r) => toOrder({ ...r }));
}

export function updateOrder(id: number, patch: { status?: OrderStatus; paid?: boolean }) {
  if (patch.status) db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(patch.status, id);
  if (patch.paid !== undefined) db.prepare("UPDATE orders SET paid = ? WHERE id = ?").run(patch.paid ? 1 : 0, id);
}

export function deleteOrder(id: number) {
  db.prepare("DELETE FROM orders WHERE id = ?").run(id);
}

export function orderCounts(): Record<OrderStatus | "all" | "unpaid", number> {
  const out = { all: 0, unpaid: 0, new: 0, preparing: 0, ready: 0, picked_up: 0, cancelled: 0 };
  for (const r of db.prepare("SELECT status, paid, COUNT(*) AS n FROM orders GROUP BY status, paid").all() as { status: OrderStatus; paid: number; n: number }[]) {
    out[r.status] += r.n;
    out.all += r.n;
    if (!r.paid && r.status !== "cancelled") out.unpaid += r.n;
  }
  return out;
}

/* ---------- CSV ---------- */

export function toCsv(rows: Record<string, unknown>[], columns: string[]) {
  const esc = (v: unknown) => {
    let s = String(v ?? "");
    // Neutralise spreadsheet formula injection.
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => esc(r[c])).join(","))].join("\n");
}
