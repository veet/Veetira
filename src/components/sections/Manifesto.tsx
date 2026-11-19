"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MOTION_OK } from "@/lib/motion";
import { Cookie, Croissant, Cup } from "@/components/art/Food";
import type { SiteContent } from "@/lib/content/types";
import { blockFontStyle } from "@/lib/content/fonts";

type Token = string | { pill: "cup" | "croissant" | "cookie" };

/** Splits the CMS text into words, turning {cup} {croissant} {cookie} into image pills. */
function tokenize(text: string): Token[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((w): Token[] => {
      const m = w.match(/^\{(cup|croissant|cookie)\}$/);
      return [m ? { pill: m[1] as "cup" | "croissant" | "cookie" } : w];
    });
}

const pills = {
  cup: { bg: "bg-cobalt", Art: Cup },
  croissant: { bg: "bg-amber", Art: Croissant },
  cookie: { bg: "bg-azure", Art: Cookie },
};

export default function Manifesto({ content }: { content: SiteContent["manifesto"] }) {
  const root = useRef<HTMLElement>(null);
  const text = tokenize(content.text);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".mf-word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: ".mf-text", start: "top 75%", end: "bottom 45%", scrub: true },
          }
        );
        gsap.from(".mf-pill", {
          scale: 0,
          rotate: -20,
          stagger: 0.2,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".mf-text", start: "top 70%", end: "bottom 50%", scrub: 1 },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} style={blockFontStyle(content)} className="bg-cream py-28 font-sans sm:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="mb-12 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-cobalt">
          <span className="h-px w-12 bg-cobalt" /> {content.eyebrow}
        </div>
        <p className="mf-text max-w-[22ch] font-display text-[clamp(2.2rem,6vw,6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink md:max-w-[24ch]">
          {text.map((w, i) => (
            <Fragment key={i}>
              {typeof w === "string" ? (
                <span className="mf-word">{w}</span>
              ) : (
                (() => {
                  const { bg, Art } = pills[w.pill];
                  return (
                    <span aria-hidden className={`mf-pill relative mx-[0.08em] inline-flex h-[0.8em] w-[1.6em] translate-y-[0.08em] items-center justify-center overflow-hidden rounded-full align-baseline ${bg}`}>
                      <Art className="h-[85%] w-auto" />
                    </span>
                  );
                })()
              )}{" "}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
