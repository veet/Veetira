import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

/*
 * Single-owner admin login.
 *   ADMIN_PASSWORD  – the password for /admin (required; admin is locked if unset)
 *   SESSION_SECRET  – random string used to sign the session cookie (required)
 * The cookie holds "<expiry>.<hmac>", so there is no session table and nothing to leak.
 */
export const SESSION_COOKIE = "aq_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);

const sign = (payload: string) => crypto.createHmac("sha256", process.env.SESSION_SECRET!).update(payload).digest("base64url");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(input: string) {
  if (!adminConfigured()) return false;
  // Compare HMACs so lengths always match and timing doesn't reveal the password.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${process.env.ADMIN_PASSWORD}`));
}

export function makeSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${sign(`session:${exp}`)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(`session:${exp}`));
}

export async function isAdmin() {
  const jar = await cookies();
  // Session expiry depends on the current time, so this must run at request time, never during prerender.
  await connection();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function startSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Throws unless the request carries a valid admin session. Call at the top of every admin action. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not authorised");
}
