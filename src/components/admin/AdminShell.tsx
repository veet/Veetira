import Link from "next/link";
import type { ReactNode } from "react";
import { blockSchemas } from "@/lib/content/schema";
import { logout } from "@/app/admin/actions";
import Logotype from "@/components/art/Logotype";

type Props = {
  tab: string;
  blockKey: string;
  newBookings: number;
  subscriberCount: number;
  emailOn: boolean;
  children: ReactNode;
};

const item = (active: boolean) =>
  `flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${active ? "bg-cream font-bold text-cobalt" : "text-cream/80 hover:bg-cream/10 hover:text-cream"}`;

export default function AdminShell({ tab, blockKey, newBookings, subscriberCount, emailOn, children }: Props) {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-ink lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="bg-cobalt text-cream lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" aria-label="Admin home">
            <Logotype className="h-7 w-auto" color="#f4eee4" accent="#f2b65a" />
          </Link>
          <span className="rounded-full bg-cream/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Admin</span>
        </div>

        <nav className="space-y-6 px-3 pb-6">
          <div>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cream/45">Inbox</p>
            <Link href="/admin?tab=bookings" className={item(tab === "bookings")}>
              Event bookings
              {newBookings > 0 && <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-bold text-ink">{newBookings} new</span>}
            </Link>
            <Link href="/admin?tab=subscribers" className={item(tab === "subscribers")}>
              Newsletter
              <span className="text-xs opacity-70">{subscriberCount}</span>
            </Link>
          </div>

          <div>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cream/45">Website content</p>
            <div className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-0.5 lg:overflow-visible">
              {blockSchemas.map((b) => (
                <Link key={b.key} href={`/admin?tab=content&block=${b.key}`} className={`${item(tab === "content" && blockKey === b.key)} shrink-0 whitespace-nowrap`}>
                  {b.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-1 border-t border-cream/15 pt-4">
            <a href="/" target="_blank" rel="noreferrer" className={item(false)}>
              View website ↗
            </a>
            <form action={logout}>
              <button className={`${item(false)} w-full`}>Sign out</button>
            </form>
          </div>

          <p className="px-3 text-xs leading-relaxed text-cream/50">
            Email alerts: {emailOn ? <span className="text-amber">on</span> : <span>off — add RESEND_API_KEY + NOTIFY_EMAIL</span>}
          </p>
        </nav>
      </aside>

      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
    </div>
  );
}
