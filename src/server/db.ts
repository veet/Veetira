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
  const db = new DatabaseSync(DB_PATH);
  db.exec(`
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

// Reuse one connection across hot reloads in development.
const g = globalThis as unknown as { __db?: DatabaseSync };
export const db: DatabaseSync = g.__db ?? (g.__db = open());
