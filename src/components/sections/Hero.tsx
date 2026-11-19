"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MOTION_OK, onIntroDone } from "@/lib/motion";
import { Bean, Cake, Cookie, Cup, Lamp, Mark } from "@/components/art/Food";
import SplitReveal from "@/components/ui/SplitReveal";
import Logotype from "@/components/art/Logotype";
import Magnetic from "@/components/ui/Magnetic";
import { richLines } from "@/components/ui/Rich";
import type { SiteContent } from "@/lib/content/types";
import { blockTypeProps } from "@/lib/content/fonts";

/* Icons for the three hero chips, in order; labels come from the CMS. */
const chipIcons = ["M4 16c2-8 14-8 16 0M7 16c0-3 2-6 5-6s5 3 5 6M12 10V7", "M12 3c5 2 7 7 5 12s-8 6-10 3-1-9 1-12 3-4 4-3zM11 5c-2 4 3 7 0 14", "M5 12h14l-2 8H7zM6 12a6 6 0 0 1 12 0M12 3v3"];

export default function Hero({ content }: { content: SiteContent["hero"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Paused timeline of fromTo tweens: start states render immediately and live inside
        // the timeline, so a ScrollTrigger refresh can't leave elements stuck hidden.
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        // Hebrew reads right-to-left, so letters rise in from the right edge.
        tl.fromTo(".hero-letter", { y: 150, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: { each: 0.06, from: "end" } })
          .fromTo(".hero-heart", { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 1.2, ease: "back.out(3)" }, 0.75)
          .fromTo(".hero-lamp", { yPercent: -60 }, { yPercent: 0, duration: 1.6, stagger: 0.1 }, 0)
          .fromTo(".hero-float-in", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, stagger: 0.08, ease: "back.out(1.4)" }, 0.35)
          .fromTo(".hero-fade", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.7);
        const unsub = onIntroDone(() => tl.play());

        // Parallax layers: each `data-speed` moves at its own rate while scrolling out.
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const speed = parseFloat(el.dataset.speed ?? "0");
          gsap.to(el, {
            yPercent: speed * -100,
            rotate: speed * 20,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
        gsap.to(".hero-word", {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return unsub;
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" {...blockTypeProps(content)} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-cobalt pt-24 font-sans text-cream">
      {/* lamp glows */}
      <div aria-hidden className="pointer-events-none absolute -top-32 left-[12%] -z-10 h-[34rem] w-[34rem] rounded-full bg-amber/20 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[8%] -z-10 h-[30rem] w-[30rem] rounded-full bg-amber/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-azure/40 blur-[140px]" />

      <Lamp className="hero-lamp pointer-events-none absolute -top-36 left-[8%] hidden w-20 md:block lg:w-24" />
      <Lamp className="hero-lamp pointer-events-none absolute -top-48 right-[10%] hidden w-20 md:block lg:w-24" />
      <Mark className="pointer-events-none absolute -left-10 top-40 -z-10 hidden h-80 w-80 opacity-15 lg:block" stroke="#3d66e0" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-8">
        {/* Wordmark */}
        <div className="hero-word relative z-10 mt-6 text-center md:mt-10">
          <h1 className="mx-auto w-[min(90vw,1080px)]">
            <Logotype className="h-auto w-full overflow-visible" color="#f4eee4" accent="#f2b65a" glyphClassName="hero-letter" heartClassName="hero-heart" title={`אהבות קטנות — ${content.eyebrow}`} />
          </h1>
          <div className="hero-fade mt-6 flex sm:mt-8 items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.25em] text-cream/80 sm:text-xs sm:tracking-[0.4em]">
            <span className="h-px w-6 bg-cream/40 sm:w-20" />
            {content.eyebrow}
            <span className="h-px w-6 bg-cream/40 sm:w-20" />
          </div>
        </div>

        {/* Composition */}
        <div className="relative mt-6 grid flex-1 grid-cols-1 items-end gap-8 pb-10 md:grid-cols-2 md:pb-14 lg:grid-cols-[1fr_auto_1fr]">
          <div className="order-2 md:self-center lg:order-1">
            <SplitReveal
              as="p"
              onIntro
              delay={0.6}
              className="font-display text-3xl font-medium leading-[1.02] tracking-tight sm:text-4xl lg:text-5xl"
              lines={richLines(content.headline, "text-amber text-[1.15em]")}
            />
            <div className="hero-fade mt-8 flex items-stretch gap-0 text-cream/90">
              {content.chips.slice(0, 3).map((c, i) => (
                <div key={i} className={`flex flex-col items-center gap-2 px-5 first:ps-0 ${i ? "border-s border-cream/25" : ""}`}>
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={chipIcons[i]} />
                  </svg>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em]">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Food stack */}
          <div className="relative order-1 mx-auto h-[min(64vw,440px)] w-[min(80vw,520px)] md:col-span-2 lg:order-2 lg:col-span-1 lg:h-[min(34vw,440px)] lg:w-[min(40vw,520px)]">
            <div aria-hidden className="absolute left-1/2 top-[6%] h-[88%] w-[70%] -translate-x-1/2 rounded-full bg-azure/70 blur-[2px]" />
            <div className="hero-float absolute left-1/2 top-0 w-[46%] -translate-x-1/2" data-speed="0.15">
              <div className="hero-float-in relative">
                <div aria-hidden className="absolute -top-10 left-1/2 flex -translate-x-1/2 gap-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="block h-10 w-1.5 animate-steam rounded-full bg-cream/60 blur-[2px]" style={{ animationDelay: `${i * 0.8}s` }} />
                  ))}
                </div>
                <Cup className="w-full drop-shadow-[0_30px_40px_rgba(14,21,48,0.45)]" />
              </div>
            </div>
            <div className="hero-float absolute bottom-[4%] left-0 w-[34%] -rotate-12" data-speed="0.45">
              <Cookie className="hero-float-in w-full drop-shadow-[0_20px_30px_rgba(14,21,48,0.45)]" />
            </div>
            <div className="hero-float absolute bottom-[2%] right-[-4%] w-[42%]" data-speed="0.3">
              <Cake className="hero-float-in w-full drop-shadow-[0_20px_30px_rgba(14,21,48,0.45)]" />
            </div>
            <span className="block hero-float absolute left-[18%] top-[40%] w-5 rotate-45" data-speed="0.8"><Bean className="hero-float-in block w-full" /></span>
            <span className="block hero-float absolute right-[16%] top-[30%] w-4 -rotate-12" data-speed="1.1"><Bean className="hero-float-in block w-full" /></span>
            <span className="block hero-float absolute bottom-[34%] left-[40%] w-3.5 rotate-90" data-speed="0.6"><Bean className="hero-float-in block w-full" /></span>
          </div>

          <div className="hero-fade order-3 flex flex-col items-start gap-6 md:items-end md:self-center md:text-end">
            <p className="max-w-xs text-base leading-relaxed text-cream/75">
              {content.intro}
            </p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Magnetic href="#find-us" cursor="מצאו" className="rounded-full bg-cream px-7 py-4 text-sm font-bold text-cobalt transition-colors hover:bg-amber">
                {content.primaryCta}
              </Magnetic>
              <Magnetic href="#menu" className="rounded-full border border-cream/40 px-7 py-4 text-sm font-bold transition-colors hover:bg-cream/10">
                {content.secondaryCta}
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hero-fade absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-cream/60 md:flex">
          גללו
          <span className="relative block h-10 w-px overflow-hidden bg-cream/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-cream" />
          </span>
        </div>
      </div>
    </section>
  );
}
