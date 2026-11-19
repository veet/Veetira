"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";
import { Cup } from "@/components/art/Food";
import { rich, richLines } from "@/components/ui/Rich";
import { parseBooking, type BookingErrors } from "@/lib/validation";
import type { SiteContent } from "@/lib/content/types";

const field =
  "peer w-full border-b border-cream/30 bg-transparent pb-3 pt-6 text-lg text-cream outline-none transition-colors placeholder:text-transparent focus:border-amber";
const floatLabel =
  "pointer-events-none absolute left-0 top-6 text-cream/60 transition-all duration-300 ease-expo peer-focus:top-0 peer-focus:text-xs peer-focus:text-amber peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

export default function Events({ content }: { content: SiteContent["events"] }) {
  const eventTypes = content.eventTypes.map((t) => t.text).filter(Boolean);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    // Same rules as the server, so most mistakes are caught instantly.
    const { errors: errs, ok } = parseBooking(raw, { minGuests: content.minGuests, eventTypes });
    setErrors(errs);
    setFormError("");
    if (!ok) return;

    setSending(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(raw) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        setSent(true);
      } else {
        if (data.errors) setErrors(data.errors);
        setFormError(data.error ?? "Something went wrong. Please try again or email us.");
      }
    } catch {
      setFormError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  const err = (k: keyof BookingErrors) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-2 text-sm text-amber">
        {errors[k]}
      </p>
    ) : null;

  return (
    <section id="events" className="relative overflow-hidden bg-cobalt py-28 text-cream sm:py-40">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-azure/50 blur-[140px]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          <p className="mb-5 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-amber">
            <span className="h-px w-12 bg-amber" /> {content.eyebrow}
          </p>
          <SplitReveal className="font-display text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.035em]" lines={richLines(content.headline)} />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-cream/70">{content.body}</p>
          <ul className="mt-10 space-y-4">
            {content.bullets.map((f, i) => (
              <li key={i} className="flex items-center gap-4 border-b border-cream/10 pb-4 font-medium">
                <span className="font-display text-sm text-amber">{String(i + 1).padStart(2, "0")}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[520px] rounded-[2rem] border border-cream/15 bg-cobalt-deep/50 p-6 backdrop-blur sm:p-10">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full min-h-[440px] flex-col items-center justify-center text-center"
                role="status"
              >
                <motion.div initial={{ y: 40, rotate: -15 }} animate={{ y: 0, rotate: 0 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}>
                  <Cup className="h-36 w-auto" />
                </motion.div>
                <h3 className="mt-8 font-display text-4xl font-semibold tracking-tight">{rich(content.successTitle)}</h3>
                <p className="mt-3 max-w-xs text-cream/70">{content.successBody}</p>
                <button onClick={() => setSent(false)} className="mt-8 text-sm font-bold text-amber underline underline-offset-4">
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="grid gap-8">
                {/* Honeypot for bots — hidden from people and screen readers. */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Company <input name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="relative">
                    <input id="name" name="name" placeholder="Name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
                    <label htmlFor="name" className={floatLabel}>
                      Your name
                    </label>
                    {err("name")}
                  </div>
                  <div className="relative">
                    <input id="email" name="email" type="email" placeholder="Email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
                    <label htmlFor="email" className={floatLabel}>
                      Email
                    </label>
                    {err("email")}
                  </div>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="relative">
                    <input id="date" name="date" type="date" placeholder="Date" className={`${field} [color-scheme:dark]`} aria-invalid={!!errors.date} aria-describedby={errors.date ? "date-err" : undefined} />
                    <label htmlFor="date" className="pointer-events-none absolute left-0 top-0 text-xs text-cream/60">
                      Event date
                    </label>
                    {err("date")}
                  </div>
                  <div className="relative">
                    <input id="guests" name="guests" type="number" min={content.minGuests} placeholder="Guests" className={field} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? "guests-err" : undefined} />
                    <label htmlFor="guests" className={floatLabel}>
                      Number of guests
                    </label>
                    {err("guests")}
                  </div>
                </div>
                <fieldset>
                  <legend className="mb-3 text-xs text-cream/60">Event type</legend>
                  <div className="flex flex-wrap gap-2">
                    {eventTypes.map((t, i) => (
                      <label key={i} className="cursor-pointer">
                        <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
                        <span className="block rounded-full border border-cream/25 px-4 py-2 text-sm transition-colors peer-checked:border-cream peer-checked:bg-cream peer-checked:text-cobalt peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="relative">
                  <textarea id="message" name="message" rows={3} placeholder="Message" maxLength={2000} className={`${field} resize-none`} />
                  <label htmlFor="message" className={floatLabel}>
                    Tell us more (location, timing…)
                  </label>
                </div>
                {formError && (
                  <p role="alert" className="rounded-xl bg-amber/15 px-4 py-3 text-sm text-amber">
                    {formError}
                  </p>
                )}
                <div>
                  <Magnetic type="submit" cursor="Send" className="rounded-full bg-cream px-8 py-4 text-sm font-bold text-cobalt transition-colors hover:bg-amber">
                    {sending ? "Sending…" : content.submitLabel}
                  </Magnetic>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
