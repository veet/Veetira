"use client";

import { useRef, useState, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MOTION_OK, ScrollTrigger, scrollToTarget } from "@/lib/motion";
import type { MenuItem, SiteContent } from "@/lib/content/types";
import { blockFontStyle } from "@/lib/content/fonts";
import { rich, richLines } from "@/components/ui/Rich";
import { foodArt } from "@/components/art/Food";
import SplitReveal from "@/components/ui/SplitReveal";

const TAG_LABEL: Record<string, string> = { Signature: "מנת הבית", Vegan: "טבעוני" };
const shekel = (n: number) => `₪${Number.isInteger(n) ? n : n.toFixed(2)}`;

function Card({ item, index }: { item: MenuItem; index: number }) {
  const Art = foodArt[item.art];
  const ref = useRef<HTMLElement>(null);

  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 10, rotateX: -y * 10, duration: 0.6, ease: "power3.out" });
  };
  const reset = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });

  return (
    <article
      ref={ref}
      onPointerMove={tilt}
      onPointerLeave={reset}
      data-cursor="להזמנה"
      className="menu-card group relative flex h-full w-[min(78vw,340px)] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-cream p-6 text-ink [transform-style:preserve-3d] md:w-[340px]"
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-sm font-semibold text-cobalt/50">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex gap-1.5">
          {(item.tag ? [item.tag] : []).map((t) => (
            <span
              key={t}
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.05em] ${t === "Signature" ? "bg-velvet text-cream" : "bg-foam text-walnut"}`}
            >
              {TAG_LABEL[t] ?? t}
            </span>
          ))}
        </div>
      </div>
      <div className="relative my-5 grid h-[min(24svh,230px)] place-items-center max-md:h-56 rounded-[1.5rem] bg-foam/60 transition-colors duration-500 group-hover:bg-cobalt">
        <Art className="h-[62%] w-auto transition-transform duration-700 ease-expo [transform:translateZ(40px)] group-hover:-rotate-6 group-hover:scale-110" />
      </div>
      <div className="mt-auto">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">{item.name}</h3>
          <span className="shrink-0 font-display text-xl font-semibold text-latte">{shekel(item.price)}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.description}</p>
      </div>
    </article>
  );
}

export default function MenuSection({ content }: { content: SiteContent["menu"] }) {
  const menu = content.categories.filter((c) => c.items.length).map((c, i) => ({ ...c, id: `c${i}` }));
  const flat = menu.flatMap((c) => c.items.map((item) => ({ ...item, category: c.id })));
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(menu[0]?.id ?? "");
  const stRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        const el = track.current!;
        el.style.overflow = "visible";
        el.style.scrollSnapType = "none";
        const distance = () => el.scrollWidth - window.innerWidth + 64;
        const tween = gsap.to(track.current, {
          x: () => distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".menu-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(flat.length - 1, Math.round(self.progress * (flat.length - 1)));
              setActive(flat[idx].category);
            },
          },
        });
        stRef.current = tween.scrollTrigger ?? null;
        return () => {
          stRef.current = null;
          el.style.overflow = "";
          el.style.scrollSnapType = "";
        };
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const goTo = (id: string) => {
    setActive(id);
    const st = stRef.current;
    if (st) {
      const idx = flat.findIndex((f) => f.category === id);
      scrollToTarget(st.start + (st.end - st.start) * (idx / Math.max(1, flat.length - 1)));
    }
  };


  return (
    <section ref={root} id="menu" style={blockFontStyle(content)} className="relative bg-cobalt font-sans text-cream">
      <div className="menu-pin flex min-h-[100svh] flex-col justify-center gap-10 overflow-hidden py-24 md:gap-10 md:py-20">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-end">
          <div>
            <p className="mb-5 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-amber">
              <span className="h-px w-12 bg-amber" /> {content.eyebrow}
            </p>
            <SplitReveal
              className="font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.9] tracking-[-0.035em]"
              lines={richLines(content.headline)}
            />
          </div>
          <div role="tablist" aria-label="קטגוריות בתפריט" className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-cobalt-deep/60 p-1.5 backdrop-blur [scrollbar-width:none]">
            {menu.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={active === c.id}
                onClick={() => goTo(c.id)}
                className={`shrink-0 rounded-full px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 sm:px-5 ${
                  active === c.id ? "bg-cream text-cobalt" : "text-cream/70 hover:text-cream"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: pinned horizontal track. Mobile: swipeable row filtered by tab. */}
        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8 md:ps-[max(2rem,calc((100vw-1440px)/2+2rem))]"
        >
          {flat.map((item, i) => (
            <div
              key={`${item.category}-${i}`}
              className={`snap-start [perspective:1000px] ${item.category !== active ? "max-md:hidden" : ""}`}
            >
              <Card item={item} index={i} />
            </div>
          ))}
          <div className="hidden w-[360px] shrink-0 flex-col justify-end rounded-[2rem] border border-cream/20 p-8 md:flex">
            <p className="font-display text-3xl font-semibold leading-tight">
              {rich(content.noteTitle)}
            </p>
            <p className="mt-4 text-sm text-cream/60">{content.noteBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
