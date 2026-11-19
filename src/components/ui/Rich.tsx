import { Fragment, type ReactNode } from "react";

/** Renders `*word*` as the serif accent (upright: Hebrew has no true italic). */
export function rich(text: string, accentClass = "text-amber"): ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    p.startsWith("*") && p.endsWith("*") && p.length > 2 ? (
      <span key={i} className={`font-serif font-medium ${accentClass}`}>
        {p.slice(1, -1)}
      </span>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    )
  );
}

/** Splits a multi-line headline into lines (for SplitReveal), each with accent markup applied. */
export function richLines(text: string, accentClass?: string): ReactNode[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l, i) => <Fragment key={i}>{rich(l, accentClass)}</Fragment>);
}

/** Plain text without markup — for aria labels, meta tags, etc. */
export const plain = (text: string) => text.replace(/\*/g, "").replace(/\s*\n\s*/g, " ");
