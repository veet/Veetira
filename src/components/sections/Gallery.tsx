"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { foodArt } from "@/components/art/Food";
import SplitReveal from "@/components/ui/SplitReveal";

import type { SiteContent, TileColor } from "@/lib/content/types";
import { blockFontStyle } from "@/lib/content/fonts";
import { richLines } from "@/components/ui/Rich";

/* Tile sizes cycle so the strip feels like a loose collage; captions, art and colors come from the CMS. */
const SIZES = [
  { w: "w-[300px] sm:w-[380px]", h: "h-[400px] sm:h-[480px]" },
  { w: "w-[260px] sm:w-[320px]", h: "h-[320px] sm:h-[380px]" },
  { w: "w-[280px] sm:w-[340px]", h: "h-[380px] sm:h-[440px]" },
  { w: "w-[320px] sm:w-[420px]", h: "h-[300px] sm:h-[360px]" },
  { w: "w-[260px] sm:w-[320px]", h: "h-[360px] sm:h-[420px]" },
  { w: "w-[280px] sm:w-[360px]", h: "h-[400px] sm:h-[460px]" },
  { w: "w-[300px] sm:w-[380px]", h: "h-[320px] sm:h-[400px]" },
];
const BG: Record<TileColor, string> = {
  cobalt: "bg-cobalt",
  deep: "bg-cobalt-deep",
  azure: "bg-azure",
  amber: "bg-amber",
  foam: "bg-foam",
  latte: "bg-latte",
  velvet: "bg-velvet",
};

export default function Gallery({ content, instagram }: { content: SiteContent["gallery"]; instagram: string }) {
  const tiles = content.tiles.map((t, i) => ({ ...t, bg: BG[t.color], ...SIZES[i % SIZES.length] }));
  const wrap = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (wrap.current && strip.current) setLimit(Math.max(0, strip.current.scrollWidth - wrap.current.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tiles.length]);

  return (
    <section style={blockFontStyle(content)} className="overflow-hidden bg-cream py-28 font-sans text-ink sm:py-40">
      <div className="mx-auto mb-14 flex max-w-[1440px] flex-col justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-end">
        <SplitReveal
          className="font-display text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.035em]"
          lines={richLines(content.headline, "text-cobalt")}
        />
        <p className="flex items-center gap-3 text-sm font-medium text-ink/60">
          <span className="inline-block h-px w-10 bg-ink/40" /> {content.hint} · <bdi>{instagram}</bdi>
        </p>
      </div>

      <div ref={wrap} className="px-5 sm:px-8" data-cursor="גררו">
        <motion.div
          ref={strip}
          drag="x"
          dragConstraints={{ left: 0, right: limit }}
          dragElastic={0.12}
          dragTransition={{ power: 0.25, timeConstant: 300 }}
          className="flex w-max touch-pan-y items-center gap-5 active:cursor-grabbing"
        >
          {tiles.map((t, i) => {
            const Art = foodArt[t.art];
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative shrink-0 select-none overflow-hidden rounded-[2rem] ${t.bg} ${t.w} ${t.h}`}
              >
                <div className="grid h-full place-items-center">
                  <Art className="pointer-events-none h-1/2 w-auto transition-transform duration-1000 ease-expo group-hover:scale-110 group-hover:-rotate-3" />
                </div>
                <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-cream/90 px-4 py-2 text-xs font-bold text-ink backdrop-blur">
                  {t.caption}
                  <span className="text-ink/40">0{i + 1}</span>
                </figcaption>
              </motion.figure>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
