"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MOTION_OK, onIntroDone } from "@/lib/motion";

type Props = {
  /** Each entry is rendered as its own masked line. */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Play after the preloader instead of on scroll (for above-the-fold headings). */
  onIntro?: boolean;
  delay?: number;
};

/** Headline whose lines rise out of a mask, one after another. */
export default function SplitReveal({ lines, as: Tag = "h2", className = "", lineClassName = "", onIntro, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const inners = ref.current!.querySelectorAll(".line-inner");
        const from = { yPercent: 110, rotate: -3 };
        const to = { yPercent: 0, rotate: 0, duration: 1.2, ease: "expo.out", stagger: 0.09, delay };

        if (onIntro) {
          const tween = gsap.fromTo(inners, from, { ...to, paused: true });
          return onIntroDone(() => tween.play());
        }
        // A single fromTo keeps start/end state inside one tween, so ScrollTrigger refreshes
        // (fonts loading, resize) can't strand the lines in their hidden state.
        gsap.fromTo(inners, from, { ...to, scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className={`line-inner origin-bottom-right ${lineClassName}`}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
