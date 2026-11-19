import "server-only";
import { cacheTag } from "next/cache";
import { db } from "./db";
import { defaults } from "@/lib/content/defaults";
import { blockSchemas, sanitizeBlock } from "@/lib/content/schema";
import type { BlockKey, SiteContent } from "@/lib/content/types";

export const CONTENT_TAG = "content";

/** Read every block straight from the database (uncached — for the admin editor). */
export function readAllBlocks(): SiteContent {
  const rows = db.prepare("SELECT key, data FROM blocks").all() as { key: string; data: string }[];
  const stored = new Map(rows.map((r) => [r.key, r.data]));
  const out = {} as Record<BlockKey, unknown>;
  for (const { key } of blockSchemas) {
    const raw = stored.get(key);
    let parsed: unknown = defaults[key];
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = defaults[key];
      }
    }
    out[key] = sanitizeBlock(key, parsed);
  }
  return out as SiteContent;
}

/** Site content for public pages. Cached until an admin save calls updateTag(CONTENT_TAG). */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  return readAllBlocks();
}

export function saveBlock<K extends BlockKey>(key: K, value: unknown): SiteContent[K] {
  const clean = sanitizeBlock(key, value);
  db.prepare(
    `INSERT INTO blocks (key, data, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
  ).run(key, JSON.stringify(clean));
  return clean;
}

export function resetBlock(key: BlockKey) {
  db.prepare("DELETE FROM blocks WHERE key = ?").run(key);
}

export function blockUpdatedAt(): Record<string, string> {
  const rows = db.prepare("SELECT key, updated_at FROM blocks").all() as { key: string; updated_at: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.updated_at]));
}
