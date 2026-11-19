"use client";

import { useState, useTransition } from "react";
import { removeSubscriber } from "@/app/admin/actions";
import LocalDate from "./LocalDate";

type Subscriber = { id: number; email: string; created_at: string };

export default function SubscribersPanel({ subscribers }: { subscribers: Subscriber[] }) {
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(subscribers.map((s) => s.email).join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cobalt/70">Inbox</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">Newsletter</h1>
          <p className="mt-2 text-ink/60">{subscribers.length} {subscribers.length === 1 ? "person has" : "people have"} signed up from the website footer.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyAll} disabled={!subscribers.length} className="rounded-full border border-cobalt/30 px-4 py-2 text-sm font-bold text-cobalt hover:bg-cobalt/5 disabled:opacity-40">
            {copied ? "Copied!" : "Copy all emails"}
          </button>
          <a href="/api/admin/export?type=subscribers" className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-cream hover:bg-cobalt-deep">
            Export CSV
          </a>
        </div>
      </header>

      {subscribers.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink/15 p-12 text-center text-ink/50">No subscribers yet.</div>
      ) : (
        <ul className={`mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white ${pending ? "opacity-60" : ""}`}>
          {subscribers.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{s.email}</p>
                <p className="text-xs text-ink/40"><LocalDate value={s.created_at} mode="date" /></p>
              </div>
              <button
                onClick={() => confirm(`Remove ${s.email} from the list?`) && start(() => removeSubscriber(s.id))}
                className="rounded-lg px-3 py-1.5 text-sm text-ink/50 hover:bg-velvet/10 hover:text-velvet"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
