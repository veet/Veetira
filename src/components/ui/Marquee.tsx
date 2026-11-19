"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/motion";

/** Infinite marquee whose speed follows scroll velocity and whose direction follows scroll direction. */
export default function Marquee({ words, className = "" }: { words: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      let x = 0;
      let dir = -1;
      let boost = 0;
      const wrap = gsap.utils.wrap(-50, 0);
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          dir = self.direction === 1 ? -1 : 1;
          boost = Math.min(Math.abs(self.getVelocity()) / 300, 8);
        },
      });
      const tick = (_: number, dt: number) => {
        boost *= 0.94;
        x = wrap(x + dir * (0.006 + boost * 0.004) * dt);
        gsap.set(track.current, { xPercent: x });
      };
      gsap.ticker.add(tick);
      return () => {
        st.kill();
        gsap.ticker.remove(tick);
      };
    });
    return () => mm.revert();
  });

  const row = (hidden: boolean) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 sm:px-10">{w}</span>
          <svg viewBox="0 0 24 24" className="h-[0.55em] w-[0.55em] fill-azure" aria-hidden>
            <path d="M12 0c1 6 6 11 12 12-6 1-11 6-12 12-1-6-6-11-12-12C6 11 11 6 12 0z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
