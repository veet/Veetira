"use client";

import { useState, type FormEvent } from "react";
import { scrollToTarget } from "@/lib/motion";
import Magnetic from "@/components/ui/Magnetic";
import { Mark } from "@/components/art/Food";
import Logotype from "@/components/art/Logotype";
import { richLines } from "@/components/ui/Rich";
import { EMAIL_RE } from "@/lib/validation";
import type { SiteContent } from "@/lib/content/types";

/**
 * Sticky-reveal footer: the outer box clips a fixed inner panel, so the footer looks like it is
 * uncovered from beneath the page as you reach the end.
 */
export default function Footer({ content, brand }: { content: SiteContent["footer"]; brand: SiteContent["brand"] }) {
  const socials = [
    { label: "Instagram", href: brand.instagramUrl },
    { label: "TikTok", href: brand.tiktokUrl },
    { label: "Google", href: brand.googleUrl },
  ].filter((s) => s.href);

  return (
    <footer className="relative h-[100svh] min-h-[720px]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      <div className="fixed bottom-0 left-0 flex h-[100svh] min-h-[720px] w-full flex-col justify-between overflow-hidden bg-cobalt-deep text-cream">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-amber/10 blur-[140px]" />
        <div className="relative mx-auto grid w-full max-w-[1440px] gap-10 px-5 pt-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:pt-28">
          <div>
            <p className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {richLines(content.headline).map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </p>
            <Newsletter title={content.newsletterTitle} body={content.newsletterBody} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-cream/40">יצירת קשר</p>
            <ul className="mt-4 space-y-2 text-cream/85">
              <li>
                <a href={`mailto:${brand.email}`} className="hover:text-amber">
                  {brand.email}
                </a>
              </li>
              <li>
                <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`} className="hover:text-amber" dir="ltr">
                  {brand.phone}
                </a>
              </li>
              <li className="text-cream/60"><bdi>{brand.instagram}</bdi></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-cream/40">שעות</p>
            <ul className="mt-4 space-y-2 text-cream/85">
              <li>{content.hoursTitle}</li>
              <li>{content.hoursLine}</li>
              <li className="flex gap-4 pt-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-sm underline decoration-cream/30 underline-offset-4 hover:text-amber">
                    {s.label}
                  </a>
                ))}
              </li>
            </ul>
          </div>
          <div className="hidden lg:block">
            <Magnetic onClick={() => scrollToTarget(0)} cursor="למעלה" ariaLabel="חזרה למעלה" className="grid h-24 w-24 place-items-center rounded-full bg-cream text-cobalt transition-colors hover:bg-amber">
              <span className="text-2xl">↑</span>
            </Magnetic>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <Logotype className="h-auto w-[min(78vw,1100px)] select-none" color="#f4eee4" accent="#f2b65a" title={brand.name} />
            <Mark className="mb-[2vw] hidden h-[10vw] w-[10vw] max-h-40 max-w-40 md:block" stroke="#3d66e0" />
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-cream/10 py-6 text-xs text-cream/40 sm:flex-row sm:justify-between">
            <p>© {brand.name} · קפה ומאפים על גלגלים</p>
            <p>{content.bottomLine}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Newsletter({ title, body }: { title: string; body: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (!EMAIL_RE.test(String(data.email ?? "").trim())) {
      setState("error");
      setMessage("כתובת המייל לא נראית תקינה.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "משהו השתבש.");
      form.reset();
      setState("done");
      setMessage(json.alreadySubscribed ? "כבר נרשמת — תודה!" : "נרשמת! נתראה בתיבת המייל ☕");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "משהו השתבש.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 max-w-md">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-cream/40">{title}</p>
      <p className="mt-2 text-sm text-cream/70">{body}</p>
      <div aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mt-4 flex rounded-full border border-cream/25 bg-cream/5 p-1 focus-within:border-amber">
        <label htmlFor="nl-email" className="sr-only">
          כתובת מייל
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          dir="ltr"
          required
          placeholder="you@example.com"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-4 text-right text-sm text-cream outline-none placeholder:text-cream/40"
        />
        <button disabled={state === "sending"} className="rounded-full bg-cream px-5 py-2.5 text-sm font-bold text-cobalt transition-colors hover:bg-amber disabled:opacity-60">
          {state === "sending" ? "…" : "הצטרפות"}
        </button>
      </div>
      {message && (
        <p role="status" className={`mt-2 text-sm ${state === "error" ? "text-amber" : "text-cream/80"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
