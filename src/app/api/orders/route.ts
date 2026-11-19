import { after } from "next/server";
import { getContent } from "@/server/content";
import { createOrder } from "@/server/records";
import { orderEmailHtml, sendEmail } from "@/server/email";
import { clientIp, rateLimit } from "@/server/rateLimit";
import { parseOrder, safeHttpsUrl } from "@/lib/ordering";

/** POST /api/orders — a pre-order from the website cart. Prices are re-calculated from the current menu. */
export async function POST(request: Request) {
  const limit = rateLimit(`order:${clientIp(request.headers)}`, 8, 10 * 60_000);
  if (!limit.ok) {
    return Response.json({ error: "יותר מדי הזמנות — נסו שוב בעוד כמה דקות." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "בקשה לא תקינה." }, { status: 400 });
  }
  if (typeof body.company === "string" && body.company.trim() !== "") return Response.json({ ok: true, id: 0, total: 0 }, { status: 201 }); // honeypot

  const { menu, findTruck, ordering } = await getContent();
  if (ordering.enabled !== "yes") return Response.json({ error: "ההזמנות אונליין סגורות כרגע." }, { status: 403 });

  const { input, errors, ok, total, location } = parseOrder(body, {
    menu: menu.categories,
    stops: findTruck.stops,
    todayUtc: new Date().toISOString().slice(0, 10),
  });
  if (!ok) return Response.json({ error: Object.values(errors)[0] ?? "נא לתקן את הפרטים.", errors }, { status: 422 });

  const record = {
    name: input.name,
    phone: input.phone,
    pickup_date: input.date,
    pickup_time: input.time,
    location,
    items: input.lines.map((l) => ({ name: l.name, price: l.price, qty: l.qty })),
    total,
    payment: input.payment,
    note: input.note,
  };
  const id = createOrder(record);

  const adminUrl = new URL("/admin?tab=orders", request.url).toString();
  after(() =>
    sendEmail({
      subject: `New order #${id}: ₪${total.toFixed(2)} · ${input.payment === "bit" ? "Bit" : "cash"} · pickup ${input.date} ${input.time}`,
      html: orderEmailHtml({ id, ...record }, adminUrl),
    })
  );

  return Response.json(
    {
      ok: true,
      id,
      total,
      payment: input.payment,
      pickup: { date: input.date, time: input.time, location },
      bitPhone: input.payment === "bit" ? ordering.bitPhone : undefined,
      bitLink: input.payment === "bit" ? safeHttpsUrl(ordering.bitLink) || undefined : undefined,
    },
    { status: 201 }
  );
}
