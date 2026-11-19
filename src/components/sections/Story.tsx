"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MOTION_OK } from "@/lib/motion";
import type { SiteContent } from "@/lib/content/types";
import { blockTypeProps, imageColumnClass } from "@/lib/content/fonts";
import { richLines } from "@/components/ui/Rich";
import { Bun, Cup, IcedCup, Mark } from "@/components/art/Food";
import SplitReveal from "@/components/ui/SplitReveal";

export default function Story({ content }: { content: SiteContent["story"] }) {
  const { stats } = content;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Count-ups run regardless of motion preference, but snap instantly when reduced.
      const mm = gsap.matchMedia();
      mm.add({ ok: MOTION_OK, reduced: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const ok = ctx.conditions?.ok;
        gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
          const target = Number(el.dataset.value);
          const obj = { v: ok ? 0 : target };
          const render = () => (el.textContent = Math.round(obj.v).toLocaleString("he-IL"));
          render();
          if (!ok) return;
          gsap.to(obj, { v: target, duration: 2.2, ease: "power3.out", onUpdate: render, scrollTrigger: { trigger: el, start: "top 85%" } });
        });
        if (!ok) return;
        gsap.utils.toArray<HTMLElement>(".story-tile").forEach((el, i) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0% round 2rem)" },
            { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.4, ease: "expo.out", delay: i * 0.1, scrollTrigger: { trigger: el, start: "top 85%" } }
          );
          gsap.fromTo(el.querySelector(".story-art"), { scale: 1.4 }, { scale: 1, duration: 1.8, ease: "expo.out", delay: i * 0.1, scrollTrigger: { trigger: el, start: "top 85%" } });
        });
        gsap.to(".story-badge", { rotate: 360, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="story" {...blockTypeProps(content)} className="relative overflow-hidden bg-cobalt-deep py-28 font-sans text-cream sm:py-40">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-amber/10 blur-[120px]" />
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="mb-5 eyebrow flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-amber">
            <span className="h-px w-12 bg-amber" /> {content.eyebrow}
          </p>
          <SplitReveal
            className="font-display text-[clamp(2.8rem,5.5vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.035em]"
            lines={richLines(content.headline)}
          />
          <p className="mt-8 max-w-lg whitespace-pre-line text-lg leading-relaxed text-cream/70">{content.body}</p>

          <dl className="mt-14 grid grid-cols-1 gap-8 border-t border-cream/15 pt-10 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  {/* "120,000+" stays together left-to-right; Hebrew units like ק״מ keep the normal right-to-left flow. */}
                  <p dir={/[֐-׿]/.test(s.suffix) ? undefined : "ltr"} className="text-right font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                    <span className="stat-num" data-value={s.value}>
                      {s.value.toLocaleString("he-IL")}
                    </span>
                    <span className="text-azure">{s.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm text-cream/60">{s.label}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Collage */}
        <div className={`relative grid grid-cols-2 gap-4 sm:gap-5 ${imageColumnClass(content.alignImage, "two-second")}`}>
          <div className="story-tile relative col-span-2 grid aspect-[16/9] place-items-center overflow-hidden rounded-[2rem] bg-azure">
            <div className="story-art flex items-end gap-6">
              <Cup className="h-40 w-auto sm:h-56" />
              <IcedCup className="h-32 w-auto sm:h-44" />
            </div>
            <span className="absolute bottom-4 start-5 text-xs font-bold uppercase tracking-[0.1em] text-cream/80">{content.tileBar}</span>
          </div>
          <div className="story-tile relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-amber">
            <Bun className="story-art h-3/5 w-auto" />
            <span className="absolute bottom-4 start-5 text-xs font-bold uppercase tracking-[0.1em] text-ink/70">{content.tileBakery}</span>
          </div>
          <div className="story-tile relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-cream text-cobalt">
            <div className="story-art text-center">
              <Mark className="mx-auto h-16 w-16" stroke="#1f3a93" />
              <p className="mt-3 font-serif text-3xl font-medium">{content.tileRoasted}</p>
            </div>
          </div>
          <div className="story-badge absolute -start-6 top-[46%] hidden h-28 w-28 place-items-center rounded-full bg-cream text-cobalt sm:grid">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <path id="circ" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              {/* direction="ltr": right-to-left text on a path runs backwards off the circle in browsers.
                  Letters within each Hebrew word still come out in the right order. */}
              <text direction="ltr" textLength={234} lengthAdjust="spacing" fontSize="10.5" fontWeight="700" fill="currentColor" fontFamily="var(--font-sans)">
                <textPath href="#circ">{content.badge}</textPath>
              </text>
            </svg>
            <Mark className="h-8 w-8" stroke="#1f3a93" />
          </div>
        </div>
      </div>
    </section>
  );
}
