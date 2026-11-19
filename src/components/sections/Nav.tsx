"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger, getLenis, onIntroDone, gsap } from "@/lib/motion";
import { getStatus, useNow } from "@/lib/time";
import Logotype from "@/components/art/Logotype";
import type { SiteContent, Stop } from "@/lib/content/types";

const links = [
  { href: "#menu", label: "תפריט" },
  { href: "#find-us", label: "איפה אנחנו" },
  { href: "#story", label: "הסיפור" },
  { href: "#events", label: "אירועים" },
];

export default function Nav({ brand, stops }: { brand: SiteContent["brand"]; stops: Stop[] }) {
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const now = useNow();
  const status = now ? getStatus(now, stops) : null;

  useEffect(() => {
    const intro = gsap.fromTo(bar.current, { yPercent: -100 }, { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.4, paused: true });
    const unsub = onIntroDone(() => intro.play());

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setSolid(self.scroll() > 40);
        if (self.scroll() < 120) return gsap.to(bar.current, { yPercent: 0, duration: 0.5, ease: "power3.out" });
        gsap.to(bar.current, { yPercent: self.direction === 1 ? -110 : 0, duration: 0.5, ease: "power3.out" });
      },
    });
    return () => {
      unsub();
      st.kill();
    };
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid && !open ? "bg-cobalt/80 backdrop-blur-xl" : ""}`}
      >
        <nav className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 text-cream sm:px-8">
          <a href="#top" className="flex items-center" aria-label={`${brand.name} — דף הבית`}>
            <Logotype className="h-7 w-auto sm:h-8" color="#f4eee4" accent="#f2b65a" title={brand.name} />
          </a>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-9 text-sm font-medium lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative py-1">
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cream transition-transform duration-500 ease-expo group-hover:origin-right group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#find-us"
              className="hidden items-center gap-2.5 rounded-full border border-cream/25 bg-cream/5 py-2 ps-3 pe-4 text-xs font-medium backdrop-blur sm:flex"
            >
              <span className={`h-2 w-2 rounded-full ${status?.isOpen ? "animate-pulse-amber bg-amber" : "bg-cream/40"}`} />
              {status ? status.label : "בודקים איפה הטנדר…"}
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
              className="relative z-10 grid h-11 w-11 place-items-center rounded-full bg-cream text-cobalt lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-500 ease-expo ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-500 ease-expo ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at 0% 0%)" }}
            animate={{ clipPath: "circle(150% at 0% 0%)" }}
            exit={{ clipPath: "circle(0% at 0% 0%)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-cobalt px-6 pb-10 pt-28 text-cream lg:hidden"
          >
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-4 font-display text-[clamp(3rem,15vw,5.5rem)] font-semibold leading-[1.02] tracking-tight"
                  >
                    <span className="font-sans text-sm text-azure">0{i + 1}</span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0 }} className="text-sm text-cream/60">
              {status?.label} · {brand.email}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
