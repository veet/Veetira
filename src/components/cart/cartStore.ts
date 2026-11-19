"use client";

import { useSyncExternalStore } from "react";
import { MAX_LINES, MAX_QTY, type CartLine } from "@/lib/ordering";

/*
 * Tiny cart store shared by the menu cards and the cart panel. Kept in localStorage so a refresh
 * doesn't empty the cart (wrapped in try/catch: storage can be blocked or unavailable).
 */
const KEY = "ak-cart-v1";
const EMPTY: CartLine[] = [];
let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function load(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((l) => l && typeof l.name === "string" && Number.isFinite(l.price) && l.qty > 0).slice(0, MAX_LINES) : [];
  } catch {
    return [];
  }
}

function set(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

const getSnapshot = () => (lines ??= load());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

const same = (a: Pick<CartLine, "ci" | "ii" | "name">, b: Pick<CartLine, "ci" | "ii" | "name">) => a.ci === b.ci && a.ii === b.ii && a.name === b.name;

export const cart = {
  add(item: Omit<CartLine, "qty">) {
    const cur = getSnapshot();
    const hit = cur.find((l) => same(l, item));
    if (hit) return set(cur.map((l) => (l === hit ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l)));
    if (cur.length >= MAX_LINES) return;
    set([...cur, { ...item, qty: 1 }]);
  },
  setQty(line: CartLine, qty: number) {
    const cur = getSnapshot();
    set(qty <= 0 ? cur.filter((l) => !same(l, line)) : cur.map((l) => (same(l, line) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  },
  clear() {
    set([]);
  },
};
