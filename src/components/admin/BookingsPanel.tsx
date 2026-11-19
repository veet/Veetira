"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { removeBooking, saveBookingNotes, setBookingStatus } from "@/app/admin/actions";
import LocalDate from "./LocalDate";

type Booking = {
  id: number;
  name: string;
  email: string;
  event_date: string;
  guests: number;
  event_type: string;
  message: string;
  status: "new" | "contacted" | "confirmed" | "declined";
  notes: string;
  created_at: string;
};

const STATUS_STYLE: Record<Booking["status"], string> = {
  new: "bg-amber text-ink",
  contacted: "bg-azure/15 text-cobalt",
  confirmed: "bg-emerald-100 text-emerald-800",
  declined: "bg-ink/10 text-ink/60",
};

export default function BookingsPanel({ bookings, counts, status }: { bookings: Booking[]; counts: Record<string, number>; status: string }) {
  const filters = ["all", "new", "contacted", "confirmed", "declined"];
  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cobalt/70">Inbox</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">Event bookings</h1>
          <p className="mt-2 text-ink/60">Requests from the website&apos;s events form. Update the status as you go.</p>
        </div>
        <a href="/api/admin/export?type=bookings" className="rounded-full border border-cobalt/30 px-4 py-2 text-sm font-bold text-cobalt hover:bg-cobalt/5">
          Export CSV
        </a>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin?tab=bookings" : `/admin?tab=bookings&status=${f}`}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${status === f ? "bg-cobalt font-bold text-cream" : "bg-white text-ink/70 hover:text-ink"}`}
          >
            {f} <span className="opacity-60">{counts[f] ?? 0}</span>
          </Link>
        ))}
      </nav>

      {bookings.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink/15 p-12 text-center text-ink/50">
          No bookings {status !== "all" ? `marked “${status}”` : "yet"}. They&apos;ll appear here as soon as someone sends the form.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {bookings.map((b) => (
            <BookingCard key={b.id} b={b} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BookingCard({ b }: { b: Booking }) {
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState(b.notes);

  return (
    <li className={`rounded-2xl border bg-white p-5 transition ${b.status === "new" ? "border-amber" : "border-ink/10"} ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">{b.name}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLE[b.status]}`}>{b.status}</span>
          </div>
          <a href={`mailto:${b.email}?subject=${encodeURIComponent(`Your event on ${b.event_date}`)}`} className="text-sm text-cobalt hover:underline">
            {b.email}
          </a>
        </div>
        <p className="text-xs text-ink/40">Received <LocalDate value={b.created_at} /></p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-ink/50">Date</dt>
          <dd className="font-medium"><LocalDate value={b.event_date} mode="day" /></dd>
        </div>
        <div>
          <dt className="text-ink/50">Guests</dt>
          <dd className="font-medium">{b.guests}</dd>
        </div>
        <div>
          <dt className="text-ink/50">Event</dt>
          <dd className="font-medium">{b.event_type}</dd>
        </div>
      </dl>
      {b.message && <p className="mt-4 whitespace-pre-line rounded-xl bg-[#f7f3ec] p-3 text-sm" dir="auto">{b.message}</p>}

      <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-ink/10 pt-4">
        <label className="text-sm">
          <span className="mb-1 block text-xs text-ink/50">Status</span>
          <select
            value={b.status}
            onChange={(e) => start(() => setBookingStatus(b.id, e.target.value))}
            className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm capitalize"
          >
            {["new", "contacted", "confirmed", "declined"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-[200px] flex-1 text-sm">
          <span className="mb-1 block text-xs text-ink/50">Private notes (saved when you click away)</span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => notes !== b.notes && start(() => saveBookingNotes(b.id, notes))}
            placeholder="Quote sent, deposit paid…"
            className="w-full rounded-lg border border-ink/15 px-3 py-2"
            dir="auto"
          />
        </label>
        <button
          onClick={() => confirm(`Delete the booking from ${b.name}? This can't be undone.`) && start(() => removeBooking(b.id))}
          className="rounded-lg px-3 py-2 text-sm text-ink/50 hover:bg-velvet/10 hover:text-velvet"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
