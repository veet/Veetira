import type { Metadata } from "next";
import { Suspense } from "react";
import { adminConfigured, isAdmin } from "@/server/auth";
import { blockUpdatedAt, readAllBlocks } from "@/server/content";
import {
  bookingCounts,
  listBookings,
  listOrders,
  listSubscribers,
  orderCounts,
  BOOKING_STATUSES,
  ORDER_STATUSES,
  type BookingStatus,
  type OrderStatus,
} from "@/server/records";
import { emailConfigured } from "@/server/email";
import { blockSchemas } from "@/lib/content/schema";
import LoginForm from "@/components/admin/LoginForm";
import AdminShell from "@/components/admin/AdminShell";
import BlockEditor from "@/components/admin/BlockEditor";
import BookingsPanel from "@/components/admin/BookingsPanel";
import SubscribersPanel from "@/components/admin/SubscribersPanel";
import OrdersPanel from "@/components/admin/OrdersPanel";

export const metadata: Metadata = {
  title: "Admin · אהבות קטנות",
  robots: { index: false, follow: false },
};

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-cream text-cobalt">Loading…</div>}>
      <AdminGate searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminGate({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  // Reading the cookie first makes this subtree request-time, so nothing below is prerendered.
  if (!(await isAdmin())) return <LoginForm configured={adminConfigured()} />;

  const sp = await searchParams;
  const tab = typeof sp.tab === "string" ? sp.tab : "content";
  const blockKey = typeof sp.block === "string" && blockSchemas.some((b) => b.key === sp.block) ? sp.block : blockSchemas[0].key;
  const status = typeof sp.status === "string" && BOOKING_STATUSES.includes(sp.status as BookingStatus) ? (sp.status as BookingStatus) : undefined;

  const orderStatus = typeof sp.status === "string" && ORDER_STATUSES.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined;
  const oCounts = orderCounts();
  const counts = bookingCounts();
  const subscribers = listSubscribers();
  const updated = blockUpdatedAt();

  return (
    <AdminShell tab={tab} blockKey={blockKey} newOrders={oCounts.new} newBookings={counts.new} subscriberCount={subscribers.length} emailOn={emailConfigured()}>
      {tab === "orders" ? (
        <OrdersPanel orders={listOrders(orderStatus)} counts={oCounts} status={orderStatus ?? "all"} />
      ) : tab === "bookings" ? (
        <BookingsPanel bookings={listBookings(status)} counts={counts} status={status ?? "all"} />
      ) : tab === "subscribers" ? (
        <SubscribersPanel subscribers={subscribers} />
      ) : (
        <BlockEditor
          key={`${blockKey}-${updated[blockKey] ?? "default"}`}
          schema={blockSchemas.find((b) => b.key === blockKey)!}
          initial={readAllBlocks()[blockKey as keyof ReturnType<typeof readAllBlocks>]}
          updatedAt={updated[blockKey]}
        />
      )}
    </AdminShell>
  );
}
