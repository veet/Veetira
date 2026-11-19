"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, getLenis, markIntroDone, prefersReducedMotion } from "@/lib/motion";

const KEY = "rr-intro-seen";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<SVGRectElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}

    if (seen || prefersReducedMotion()) {
      if (root.current) root.current.style.display = "none";
      markIntroDone();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
        document.documentElement.style.overflow = "";
        getLenis()?.start();
        setGone(true);
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.v)),
    })
      .to(fill.current, { attr: { y: 22, height: 74 }, duration: 2, ease: "power2.inOut" }, 0)
      .to(".pl-content", { y: -40, opacity: 0, duration: 0.5, ease: "power3.in" }, "+=0.15")
      .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, "-=0.1")
      .add(markIntroDone, "-=0.55");

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[95] flex items-center justify-center bg-ink text-cream"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="pl-content flex flex-col items-center">
        <svg viewBox="0 0 120 120" className="h-28 w-28">
          <defs>
            <clipPath id="pl-cup">
              <path d="M28 22 h64 l-8 74 a6 6 0 0 1 -6 5 h-36 a6 6 0 0 1 -6 -5 z" />
            </clipPath>
          </defs>
          <rect ref={fill} x="0" y="96" width="120" height="0" fill="#c8956a" clipPath="url(#pl-cup)" />
          <path d="M28 22 h64 l-8 74 a6 6 0 0 1 -6 5 h-36 a6 6 0 0 1 -6 -5 z" fill="none" stroke="#f4eee4" strokeWidth="3" />
          <rect x="22" y="14" width="76" height="9" rx="4.5" fill="#f4eee4" />
          <path d="M36 50 h48" stroke="#3d66e0" strokeWidth="10" opacity="0.9" />
        </svg>
        <p className="mt-8 font-display text-7xl font-semibold tabular-nums tracking-tight sm:text-8xl">
          {count}
          <span className="text-azure">%</span>
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-cream/50">מכינים משהו טוב</p>
      </div>
    </div>
  );
}
