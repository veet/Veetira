"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/time";
import { gsap } from "@/lib/motion";

/**
 * Cream dot + trailing ring. Elements can set `data-cursor="Label"` to show a label
 * in an enlarged ring. Disabled on touch / coarse pointers and reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    let visible = false;
    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, input, select, textarea, label, [role=tab]");
      const text = labelled?.dataset.cursor ?? "";
      setLabel(text);
      gsap.to(ring.current, {
        scale: text ? 2.6 : interactive ? 1.6 : 1,
        backgroundColor: text ? "rgba(242,182,90,0.95)" : interactive ? "rgba(244,238,228,0.15)" : "rgba(244,238,228,0)",
        borderColor: text ? "rgba(242,182,90,0)" : "rgba(244,238,228,0.9)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot.current, { scale: text ? 0 : 1, duration: 0.25 });
    };

    const leave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-cream/90 opacity-0 mix-blend-difference"
        style={{ mixBlendMode: label ? "normal" : "difference" }}
      >
        <span className="font-display text-[5px] font-semibold uppercase tracking-[0.15em] text-ink">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-cream opacity-0 mix-blend-difference"
      />
    </>
  );
}
