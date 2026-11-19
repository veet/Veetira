"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import Logotype from "@/components/art/Logotype";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="grid min-h-screen place-items-center bg-cobalt px-4 text-cream">
      <div className="w-full max-w-sm">
        <Logotype className="mx-auto h-12 w-auto" color="#f4eee4" accent="#f2b65a" />
        <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-cream/60">Admin</p>

        {configured ? (
          <form action={action} className="mt-10 rounded-3xl bg-cream p-6 text-ink shadow-2xl">
            <label htmlFor="password" className="text-sm font-bold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-cobalt focus:ring-4 focus:ring-cobalt/15"
            />
            {state?.error && (
              <p role="alert" className="mt-3 text-sm font-medium text-velvet">
                {state.error}
              </p>
            )}
            <button disabled={pending} className="mt-5 w-full rounded-full bg-cobalt py-3 font-bold text-cream transition hover:bg-cobalt-deep disabled:opacity-60">
              {pending ? "Checking…" : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="mt-10 rounded-3xl bg-cream p-6 text-sm leading-relaxed text-ink">
            <p className="font-bold">Admin is locked.</p>
            <p className="mt-2">
              Set <code className="rounded bg-foam px-1">ADMIN_PASSWORD</code> and <code className="rounded bg-foam px-1">SESSION_SECRET</code> in{" "}
              <code className="rounded bg-foam px-1">.env.local</code>, then restart the server.
            </p>
          </div>
        )}
        <Link href="/" className="mt-6 block text-center text-sm text-cream/70 hover:text-cream">
          ← Back to the website
        </Link>
      </div>
    </main>
  );
}
