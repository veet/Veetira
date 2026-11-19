"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Reveal-on-enter triggers stay "active" until the page end, so jumping past them
  // (anchor links, reload mid-page) still plays them. Scrubbed triggers set their own end.
  ScrollTrigger.defaults({ end: "max" });
  if (process.env.NODE_ENV !== "production") Object.assign(window, { ScrollTrigger });
}

export { gsap, ScrollTrigger };

/* ---- shared Lenis instance ---- */
let lenisInstance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenisInstance = l);
export const getLenis = () => lenisInstance;

export function scrollToTarget(target: string | number | HTMLElement) {
  const l = getLenis();
  if (l) l.scrollTo(target, { duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }
}

/* ---- intro (preloader) gate ---- */
let introDone = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

/** Calls `cb` once the preloader has finished (immediately if it already has). */
export function onIntroDone(cb: () => void) {
  if (introDone) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
