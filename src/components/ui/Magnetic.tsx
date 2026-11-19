"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  strength?: number;
  cursor?: string;
  ariaLabel?: string;
};

/** Button/link that is pulled toward the pointer; its label moves a bit further for depth. */
export default function Magnetic({ children, className = "", href, onClick, type = "button", strength = 0.35, cursor, ariaLabel }: Props) {
  const el = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || !window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(node, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const ixTo = gsap.quickTo(inner.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const iyTo = gsap.quickTo(inner.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      xTo(x * strength);
      yTo(y * strength);
      ixTo(x * strength * 0.4);
      iyTo(y * strength * 0.4);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
      ixTo(0);
      iyTo(0);
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", reset);
    return () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
    };
  }, [strength]);

  const content = (
    <span ref={inner} className="relative inline-flex items-center gap-2">
      {children}
    </span>
  );

  if (href) {
    return (
      <a ref={el as React.Ref<HTMLAnchorElement>} href={href} onClick={onClick} className={`whitespace-nowrap ${className}`} data-cursor={cursor} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }
  return (
    <button ref={el as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} className={`whitespace-nowrap ${className}`} data-cursor={cursor} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
