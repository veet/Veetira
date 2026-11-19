"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MOTION_OK } from "@/lib/motion";
import type { SiteContent } from "@/lib/content/types";
import { DAY_SHORT, formatRange, getStatus, useNow } from "@/lib/time";
import { richLines } from "@/components/ui/Rich";
import SplitReveal from "@/components/ui/SplitReveal";

export default function FindTruck({ content }: { content: SiteContent["findTruck"] }) {
  // Stops arrive sorted Monday → Sunday; the map route visits them in that order.
  const schedule = content.stops;
  const route = schedule;
  const routePath = route.map((s, i) => `${i ? "L" : "M"}${s.x * 10} ${s.y * 6}`).join(" ") || "M0 0";
  const root = useRef<HTMLElement>(null);
  const now = useNow();
  const status = now ? getStatus(now, schedule) : null;
  const today = now?.getDay();
  const current = schedule.find((s) => s.day === today) ?? schedule[0];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const path = root.current!.querySelector<SVGPathElement>(".route")!;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ".map-box", start: "top 80%", end: "bottom 40%", scrub: 1 },
        });
        gsap.from(".map-pin", {
          scale: 0,
          transformOrigin: "50% 100%",
          stagger: 0.08,
          ease: "back.out(3)",
          duration: 0.8,
          scrollTrigger: { trigger: ".map-box", start: "top 70%" },
        });
        gsap.from(".stop-row", {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".stop-list", start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="find-us" className="bg-cream py-28 text-ink sm:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-cobalt">
              <span className="h-px w-12 bg-cobalt" /> {content.eyebrow}
            </p>
            <SplitReveal
              className="font-display text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.035em]"
              lines={richLines(content.headline, "text-cobalt")}
            />
          </div>
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-3 rounded-full bg-cobalt px-4 py-2 text-sm font-medium text-cream">
              <span className={`h-2.5 w-2.5 rounded-full ${status?.isOpen ? "animate-pulse-amber bg-amber" : "bg-cream/40"}`} />
              {status ? status.label : "בודקים את התחנה של היום…"}
            </div>
            <p className="mt-4 text-ink/60">
              {content.body}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* Stylized map */}
          <div className="map-box relative aspect-[5/3] overflow-hidden rounded-[2rem] bg-cobalt" data-cursor="מפה">
            <svg viewBox="0 0 1000 600" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M50 0H0V50" fill="none" stroke="#3d66e0" strokeOpacity="0.25" />
                </pattern>
              </defs>
              <rect width="1000" height="600" fill="url(#grid)" />
              {/* river & park */}
              <path d="M-20 500 C 200 420, 320 560, 520 470 S 820 380, 1020 460 L1020 620 L-20 620Z" fill="#132563" />
              <circle cx="640" cy="470" r="60" fill="#3d66e0" opacity="0.35" />
              {/* main roads */}
              {["M0 180 H1000", "M0 330 C 300 300, 600 360, 1000 300", "M300 0 V600", "M620 0 C 600 200, 680 400, 640 600", "M100 0 L380 600"].map((d) => (
                <path key={d} d={d} stroke="#f4eee4" strokeOpacity="0.18" strokeWidth="10" fill="none" />
              ))}
              {/* route */}
              <path className="route" d={routePath} fill="none" stroke="#f2b65a" strokeWidth="4" strokeDasharray="1" strokeLinecap="round" strokeLinejoin="round" />
              {route.map((s, i) => {
                const isToday = s.day === today;
                return (
                  <g key={i} className="map-pin" transform={`translate(${s.x * 10} ${s.y * 6})`}>
                    {isToday && <circle r="34" fill="#f2b65a" opacity="0.25" className="animate-pulse" />}
                    <circle r={isToday ? 16 : 9} fill={isToday ? "#f2b65a" : "#f4eee4"} stroke="#0e1530" strokeWidth="3" />
                    <text y={isToday ? -26 : -18} textAnchor="middle" fontSize="18" fontWeight="700" fill="#f4eee4" fontFamily="var(--font-heebo), sans-serif">
                      {DAY_SHORT[s.day]}
                    </text>
                  </g>
                );
              })}
            </svg>
            {current && (
            <div className="absolute bottom-4 start-4 end-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream/95 p-4 backdrop-blur sm:bottom-6 sm:start-6 sm:end-auto sm:max-w-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">{now && current?.day === today ? "היום" : "השבוע"}</p>
                <p className="font-display text-lg font-semibold leading-tight">{current.location}</p>
                <p className="text-sm text-ink/60">
                  {current.area} · {formatRange(current.open, current.close)}
                </p>
              </div>
            </div>
            )}
          </div>

          {/* Weekly list */}
          <ol className="stop-list divide-y divide-ink/10 border-y border-ink/10">
            {schedule.map((s, i) => {
              const isToday = s.day === today;
              return (
                <li key={i} className={`stop-row group relative flex items-center justify-between gap-4 overflow-hidden px-2 py-4 sm:py-5 ${isToday ? "text-cream" : ""}`}>
                  <span
                    aria-hidden
                    className={`absolute inset-0 -z-0 origin-bottom bg-cobalt transition-transform duration-500 ease-expo ${isToday ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`}
                  />
                  <div className="relative flex items-center gap-5 transition-colors duration-300 group-hover:text-cream">
                    <span className="w-10 font-display text-sm font-semibold uppercase opacity-60">{DAY_SHORT[s.day]}</span>
                    <div>
                      <p className="flex items-center gap-2 font-display text-lg font-semibold leading-tight sm:text-xl">
                        {s.location}
                        {isToday && <span className="rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">היום</span>}
                      </p>
                      <p className="text-sm opacity-60">{s.area}</p>
                    </div>
                  </div>
                  <span className="relative shrink-0 text-sm font-medium tabular-nums transition-colors duration-300 group-hover:text-cream">
                    {formatRange(s.open, s.close)}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
