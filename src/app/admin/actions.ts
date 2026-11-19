"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { checkPassword, endSession, requireAdmin, startSession } from "@/server/auth";
import { CONTENT_TAG, resetBlock, saveBlock } from "@/server/content";
import { BOOKING_STATUSES, deleteBooking, deleteSubscriber, updateBooking, type BookingStatus } from "@/server/records";
import { clientIp, rateLimit } from "@/server/rateLimit";
import { schemaFor } from "@/lib/content/schema";
import type { BlockKey } from "@/lib/content/types";

/* ---------- auth ---------- */

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const ip = clientIp(await headers());
  const limit = rateLimit(`login:${ip}`, 6, 15 * 60_000);
  if (!limit.ok) return { error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} min.` };

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Wrong password." };

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

/* ---------- content ---------- */

export async function saveBlockAction(key: string, json: string) {
  await requireAdmin();
  if (!schemaFor(key)) return { ok: false as const, error: "Unknown block." };
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return { ok: false as const, error: "Could not read the form data." };
  }
  const data = saveBlock(key as BlockKey, value);
  updateTag(CONTENT_TAG); // public site shows the change on the next request
  return { ok: true as const, data, savedAt: new Date().toISOString() };
}

export async function resetBlockAction(key: string) {
  await requireAdmin();
  if (!schemaFor(key)) return { ok: false as const };
  resetBlock(key as BlockKey);
  updateTag(CONTENT_TAG);
  refresh();
  return { ok: true as const };
}

/* ---------- bookings & subscribers ---------- */

export async function setBookingStatus(id: number, status: string) {
  await requireAdmin();
  if (!BOOKING_STATUSES.includes(status as BookingStatus)) return;
  updateBooking(Number(id), { status: status as BookingStatus });
  refresh();
}

export async function saveBookingNotes(id: number, notes: string) {
  await requireAdmin();
  updateBooking(Number(id), { notes: String(notes) });
  refresh();
}

export async function removeBooking(id: number) {
  await requireAdmin();
  deleteBooking(Number(id));
  refresh();
}

export async function removeSubscriber(id: number) {
  await requireAdmin();
  deleteSubscriber(Number(id));
  refresh();
}
