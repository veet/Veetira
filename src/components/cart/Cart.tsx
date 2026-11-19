"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/lib/motion";
import { useNow } from "@/lib/time";
import { parseOrder, pickupSlots, safeHttpsUrl, shekel, type OrderErrors, type Payment } from "@/lib/ordering";
import { rich } from "@/components/ui/Rich";
import type { MenuCategory, SiteContent, Stop } from "@/lib/content/types";
import { cart, useCart } from "./cartStore";

type Done = { id: number; total: number; payment: Payment; pickup: { date: string; time: string; location: string }; bitPhone?: string; bitLink?: string };

const field = "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-base outline-none transition focus:border-cobalt focus:ring-4 focus:ring-cobalt/10";

/** Floating cart button + slide-in panel with the order form, Bit / cash choice and confirmation. */
export default function Cart({ ordering, menu, stops }: { ordering: SiteContent["ordering"]; menu: MenuCategory[]; stops: Stop[] }) {
  const lines = useCart();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    setDone(null);
  };

  return (
    <>
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            type="button"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.35 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 start-5 z-[60] flex items-center gap-3 rounded-full bg-amber py-3 ps-3 pe-5 font-sans text-sm font-bold text-ink shadow-[0_12px_30px_rgba(14,21,48,0.35)] sm:bottom-8 sm:start-8"
            aria-label={`פתיחת ההזמנה — ${count} פריטים`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-cream">{count}</span>
            {ordering.title} · {shekel(total)}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="shade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm" aria-hidden />
            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label={ordering.title}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="fixed inset-y-0 start-0 z-[80] flex w-full max-w-md flex-col overflow-y-auto bg-cream font-sans text-ink shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between bg-cobalt px-6 py-5 text-cream">
                <h2 className="font-display text-2xl font-semibold">{done ? `הזמנה #${done.id}` : ordering.title}</h2>
                <button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-full bg-cream/15 text-xl hover:bg-cream/25" aria-label="סגירה">
                  ✕
                </button>
              </div>
              {done ? <Confirmation done={done} ordering={ordering} onClose={close} /> : <Checkout ordering={ordering} menu={menu} stops={stops} onDone={setDone} />}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Checkout({ ordering, menu, stops, onDone }: { ordering: SiteContent["ordering"]; menu: MenuCategory[]; stops: Stop[]; onDone: (d: Done) => void }) {
  const lines = useCart();
  const now = useNow();
  const slots = useMemo(() => (now ? pickupSlots(now, stops, { leadMinutes: ordering.leadMinutes, slotMinutes: ordering.slotMinutes }) : []), [now, stops, ordering.leadMinutes, ordering.slotMinutes]);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [payment, setPayment] = useState<Payment>("bit");
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const [date = "", time = ""] = String(fd.slot ?? "").split("|");
    const body = { ...fd, date, time, payment, lines };
    const check = parseOrder(body, { menu, stops });
    setErrors(check.errors);
    setFormError("");
    if (!check.ok) return;
    setSending(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(data.error ?? "משהו השתבש. נסו שוב.");
        return;
      }
      cart.clear();
      onDone(data as Done);
    } catch {
      setFormError("אין חיבור לשרת. בדקו את החיבור ונסו שוב.");
    } finally {
      setSending(false);
    }
  }

  if (!lines.length) {
    return <p className="p-8 text-center text-ink/60">ההזמנה ריקה. הוסיפו משהו טעים מהתפריט ☕</p>;
  }

  const err = (k: keyof OrderErrors) => (errors[k] ? <p className="mt-1.5 text-sm font-medium text-velvet">{errors[k]}</p> : null);

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-1 flex-col gap-6 p-6">
      {ordering.intro && <p className="text-sm text-ink/60">{ordering.intro}</p>}

      <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
        {lines.map((l) => (
          <li key={`${l.ci}-${l.ii}`} className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{l.name}</p>
              <p className="text-sm text-ink/50">{shekel(l.price)}</p>
            </div>
            <div className="flex items-center rounded-full border border-ink/15" dir="ltr">
              <button type="button" onClick={() => cart.setQty(l, l.qty - 1)} className="grid h-9 w-9 place-items-center text-lg" aria-label={`פחות ${l.name}`}>
                −
              </button>
              <span className="w-6 text-center font-bold tabular-nums">{l.qty}</span>
              <button type="button" onClick={() => cart.setQty(l, l.qty + 1)} className="grid h-9 w-9 place-items-center text-lg" aria-label={`עוד ${l.name}`}>
                +
              </button>
            </div>
            <span className="w-14 text-end font-bold tabular-nums">{shekel(l.price * l.qty)}</span>
          </li>
        ))}
        <li className="flex items-center justify-between p-3 text-lg font-bold">
          <span>סה״כ</span>
          <span className="tabular-nums">{shekel(total)}</span>
        </li>
      </ul>
      {err("items")}

      {/* Honeypot for bots */}
      <div aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">שם</span>
          <input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} />
          {err("name")}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">טלפון</span>
          <input name="phone" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" placeholder="050-000-0000" className={`${field} text-right`} aria-invalid={!!errors.phone} />
          {err("phone")}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">שעת איסוף</span>
          {slots.length ? (
            <select name="slot" className={field} defaultValue={`${slots[0].date}|${slots[0].time}`} aria-invalid={!!errors.slot}>
              {slots.map((s) => (
                <option key={`${s.date}|${s.time}`} value={`${s.date}|${s.time}`}>
                  {s.label} · {s.location}
                </option>
              ))}
            </select>
          ) : (
            <p className="rounded-xl bg-amber/20 p-3 text-sm">{now ? "אין כרגע שעות איסוף פנויות השבוע." : "טוען שעות…"}</p>
          )}
          {err("slot")}
          {ordering.pickupNote && <span className="mt-1.5 block text-xs text-ink/50">{ordering.pickupNote}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">הערה (לא חובה)</span>
          <textarea name="note" rows={2} maxLength={500} className={`${field} resize-none`} placeholder="בלי סוכר, חלב שיבולת שועל…" />
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">תשלום</legend>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "bit", title: "Bit", sub: "משלמים עכשיו באפליקציה" },
              { value: "cash", title: "מזומן", sub: "משלמים באיסוף" },
            ] as const
          ).map((p) => (
            <label key={p.value} className={`cursor-pointer rounded-2xl border-2 p-4 transition ${payment === p.value ? "border-cobalt bg-cobalt/5" : "border-ink/10 bg-white"}`}>
              <input type="radio" name="payment" value={p.value} checked={payment === p.value} onChange={() => setPayment(p.value)} className="sr-only" />
              <span className="block font-display text-xl font-semibold">{p.title}</span>
              <span className="block text-xs text-ink/60">{p.sub}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink/60">{payment === "bit" ? ordering.bitNote : ordering.cashNote}</p>
        {err("payment")}
      </fieldset>

      {formError && <p role="alert" className="rounded-xl bg-velvet/10 px-4 py-3 text-sm font-medium text-velvet">{formError}</p>}

      <button type="submit" disabled={sending || !slots.length} className="mt-auto rounded-full bg-cobalt px-6 py-4 text-base font-bold text-cream transition hover:bg-cobalt-deep disabled:opacity-50">
        {sending ? "שולחים…" : `שליחת ההזמנה · ${shekel(total)}`}
      </button>
    </form>
  );
}

function Confirmation({ done, ordering, onClose }: { done: Done; ordering: SiteContent["ordering"]; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const bitLink = safeHttpsUrl(done.bitLink ?? "");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(done.bitPhone ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const [y, m, d] = done.pickup.date.split("-");

  return (
    <div role="status" className="flex flex-1 flex-col gap-5 p-6 text-center">
      <p className="mt-4 font-display text-4xl font-semibold">{rich(ordering.successTitle, "text-cobalt")}</p>
      <p className="text-ink/70">{ordering.successBody}</p>
      <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 text-start text-sm">
        <div>
          <dt className="text-ink/50">מספר הזמנה</dt>
          <dd className="text-lg font-bold">#{done.id}</dd>
        </div>
        <div>
          <dt className="text-ink/50">לתשלום</dt>
          <dd className="text-lg font-bold">{shekel(done.total)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-ink/50">איסוף</dt>
          <dd className="font-bold">
            <bdi>{`${d}/${m}/${y}`}</bdi> · <bdi>{done.pickup.time}</bdi> · {done.pickup.location}
          </dd>
        </div>
      </dl>

      {done.payment === "bit" ? (
        <div className="rounded-2xl border-2 border-cobalt p-5">
          <p className="font-display text-2xl font-semibold">תשלום ב־Bit</p>
          <p className="mt-1 text-sm text-ink/70">{ordering.bitNote}</p>
          {bitLink && (
            <a href={bitLink} target="_blank" rel="noopener noreferrer" className="mt-4 block rounded-full bg-cobalt px-6 py-3.5 font-bold text-cream hover:bg-cobalt-deep">
              לתשלום {shekel(done.total)} ב־Bit ←
            </a>
          )}
          {done.bitPhone && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-xl font-bold tabular-nums" dir="ltr">
                {done.bitPhone}
              </span>
              <button type="button" onClick={copy} className="rounded-full border border-cobalt/30 px-3 py-1 text-sm font-bold text-cobalt">
                {copied ? "הועתק!" : "העתקה"}
              </button>
            </div>
          )}
          <p className="mt-3 text-xs text-ink/50">בהערה לתשלום כתבו: הזמנה #{done.id}</p>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-ink/10 p-5">
          <p className="font-display text-2xl font-semibold">תשלום במזומן</p>
          <p className="mt-1 text-sm text-ink/70">{ordering.cashNote}</p>
        </div>
      )}

      <button type="button" onClick={onClose} className="mt-auto rounded-full border border-ink/20 px-6 py-3 font-bold">
        סגירה
      </button>
    </div>
  );
}
