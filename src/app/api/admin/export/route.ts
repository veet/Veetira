import { isAdmin } from "@/server/auth";
import { listBookings, listOrders, listSubscribers, toCsv } from "@/server/records";

/** GET /api/admin/export?type=orders|bookings|subscribers — CSV download for the admin. */
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Not authorised", { status: 401 });

  const type = new URL(request.url).searchParams.get("type");
  const stamp = new Date().toISOString().slice(0, 10);
  let csv: string;
  if (type === "subscribers") {
    csv = toCsv(listSubscribers(), ["email", "created_at"]);
  } else if (type === "bookings") {
    csv = toCsv(listBookings(), ["id", "created_at", "status", "name", "email", "event_date", "guests", "event_type", "message", "notes"]);
  } else if (type === "orders") {
    const rows = listOrders().map((o) => ({ ...o, items: o.items.map((i) => `${i.qty} x ${i.name}`).join("; "), paid: o.paid ? "yes" : "no" }));
    csv = toCsv(rows, ["id", "created_at", "status", "paid", "payment", "name", "phone", "pickup_date", "pickup_time", "location", "items", "total", "note"]);
  } else {
    return new Response("Unknown export", { status: 400 });
  }
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
