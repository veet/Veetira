"use client";

import Link from "next/link";
import { useTransition } from "react";
import { removeOrder, setOrderPaid, setOrderStatus } from "@/app/admin/actions";
import LocalDate from "./LocalDate";

type Order = {
  id: number;
  name: string;
  phone: string;
  pickup_date: string;
  pickup_time: string;
  location: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  payment: "bit" | "cash";
  paid: boolean;
  status: "new" | "preparing" | "ready" | "picked_up" | "cancelled";
  note: string;
  created_at: string;
};

const STATUS_LABEL: Record<Order["status"], string> = { new: "New", preparing: "Preparing", ready: "Ready", picked_up: "Picked up", cancelled: "Cancelled" };
const STATUS_STYLE: Record<Order["status"], string> = {
  new: "bg-amber text-ink",
  preparing: "bg-azure/15 text-cobalt",
  ready: "bg-emerald-100 text-emerald-800",
  picked_up: "bg-ink/10 text-ink/60",
  cancelled: "bg-velvet/10 text-velvet",
};
const money = (n: number) => `₪${n.toFixed(2)}`;

export default function OrdersPanel({ orders, counts, status }: { orders: Order[]; counts: Record<string, number>; status: string }) {
  const filters = ["all", "new", "preparing", "ready", "picked_up", "cancelled"];
  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cobalt/70">Inbox</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-2 text-ink/60">
            Pre-orders from the website menu. Active orders are sorted by pickup time.{" "}
            {counts.unpaid > 0 && <span className="font-bold text-velvet">{counts.unpaid} not marked paid yet.</span>}
          </p>
        </div>
        <a href="/api/admin/export?type=orders" className="rounded-full border border-cobalt/30 px-4 py-2 text-sm font-bold text-cobalt hover:bg-cobalt/5">
          Export CSV
        </a>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin?tab=orders" : `/admin?tab=orders&status=${f}`}
            className={`rounded-full px-4 py-1.5 text-sm transition ${status === f ? "bg-cobalt font-bold text-cream" : "bg-white text-ink/70 hover:text-ink"}`}
          >
            {f === "all" ? "All" : STATUS_LABEL[f as Order["status"]]} <span className="opacity-60">{counts[f] ?? 0}</span>
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink/15 p-12 text-center text-ink/50">
          No orders {status !== "all" ? "with this status" : "yet"}. They appear here as soon as a customer checks out on the website.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <OrderCard key={o.id} o={o} />
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderCard({ o }: { o: Order }) {
  const [pending, start] = useTransition();
  const active = o.status === "new" || o.status === "preparing" || o.status === "ready";

  return (
    <li className={`rounded-2xl border bg-white p-5 transition ${o.status === "new" ? "border-amber" : "border-ink/10"} ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">
              #{o.id} · <span dir="auto">{o.name}</span>
            </h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${o.paid ? "bg-emerald-100 text-emerald-800" : "bg-velvet/10 text-velvet"}`}>
              {o.payment === "bit" ? "Bit" : "Cash"} · {o.paid ? "paid" : "not paid"}
            </span>
          </div>
          <a href={`tel:${o.phone.replace(/[^\d+]/g, "")}`} className="text-sm text-cobalt hover:underline" dir="ltr">
            {o.phone}
          </a>
        </div>
        <div className="text-end">
          <p className={`text-lg font-bold ${active ? "text-cobalt" : ""}`}>
            Pickup <LocalDate value={o.pickup_date} mode="day" /> · {o.pickup_time}
          </p>
          <p className="text-sm text-ink/60" dir="auto">
            {o.location}
          </p>
          <p className="text-xs text-ink/40">
            Ordered <LocalDate value={o.created_at} />
          </p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-ink/10 rounded-xl bg-[#f7f3ec] px-4 text-sm">
        {o.items.map((i, k) => (
          <li key={k} className="flex justify-between gap-3 py-2">
            <span dir="auto">
              {i.qty} × {i.name}
            </span>
            <span className="tabular-nums">{money(i.price * i.qty)}</span>
          </li>
        ))}
        <li className="flex justify-between py-2 font-bold">
          <span>Total</span>
          <span className="tabular-nums">{money(o.total)}</span>
        </li>
      </ul>
      {o.note && (
        <p className="mt-3 whitespace-pre-line rounded-xl border border-ink/10 p-3 text-sm" dir="auto">
          📝 {o.note}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-ink/10 pt-4">
        <label className="text-sm">
          <span className="mb-1 block text-xs text-ink/50">Status</span>
          <select value={o.status} onChange={(e) => start(() => setOrderStatus(o.id, e.target.value))} className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm">
            {(Object.keys(STATUS_LABEL) as Order["status"][]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => start(() => setOrderPaid(o.id, !o.paid))}
          className={`rounded-lg px-4 py-2 text-sm font-bold ${o.paid ? "border border-ink/15 text-ink/70" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
        >
          {o.paid ? "Mark as not paid" : o.payment === "bit" ? "Bit received — mark paid" : "Cash received — mark paid"}
        </button>
        <button
          type="button"
          onClick={() => confirm(`Delete order #${o.id} from ${o.name}? This can't be undone.`) && start(() => removeOrder(o.id))}
          className="ms-auto rounded-lg px-3 py-2 text-sm text-ink/50 hover:bg-velvet/10 hover:text-velvet"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
