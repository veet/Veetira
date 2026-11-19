"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, onIntroDone, prefersReducedMotion, setLenis } from "@/lib/motion";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // Parent effects run after all section effects, so every trigger exists by now.
  // Re-sort and refresh so triggers created before a pin account for its spacing,
  // and refresh again once custom fonts have swapped in (they change text heights).
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const id = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh);
    const unsub = onIntroDone(refresh);
    return () => {
      cancelAnimationFrame(id);
      unsub();
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -72 }, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    // Hold scrolling while the preloader is on screen.
    lenis.stop();
    const unsub = onIntroDone(() => lenis.start());

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      unsub();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
