import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

/*
 * SQLite database (Node's built-in driver — no native packages to install).
 * File location: DATABASE_PATH, default ./data/app.db. To move to Postgres later, re-implement
 * the small repository functions in src/server/*.ts; nothing else talks to the database.
 */
const DB_PATH = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.DATABASE_PATH ?? "data/app.db");

function open() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  // `timeout`: if another process (e.g. a parallel build worker) holds the lock, wait up to 5s
  // instead of failing with "database is locked".
  const db = new DatabaseSync(DB_PATH, { timeout: 5000 });
  db.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS blocks (
      key        TEXT PRIMARY KEY,
      data       TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      event_date TEXT NOT NULL,
      guests     INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      message    TEXT NOT NULL DEFAULT '',
      status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','declined')),
      notes      TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS bookings_created ON bookings(created_at DESC);

    CREATE TABLE IF NOT EXISTS subscribers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

// One connection per process, reused across hot reloads in development.
const g = globalThis as unknown as { __db?: DatabaseSync };
const getDb = () => g.__db ?? (g.__db = open());

/**
 * Opened lazily on first use, not when a module is imported: `next build` imports every route in
 * several workers at once, and opening (and creating) the file from all of them at the same moment
 * made Railway builds fail with "database is locked".
 */
export const db = new Proxy({} as DatabaseSync, {
  get(_, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
