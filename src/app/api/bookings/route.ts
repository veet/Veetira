import { after } from "next/server";
import { getContent } from "@/server/content";
import { createBooking } from "@/server/records";
import { bookingEmailHtml, sendEmail } from "@/server/email";
import { clientIp, rateLimit } from "@/server/rateLimit";
import { parseBooking } from "@/lib/validation";

/** POST /api/bookings — event/catering request from the website form. */
export async function POST(request: Request) {
  const limit = rateLimit(`booking:${clientIp(request.headers)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return Response.json({ error: "Too many requests — please try again in a few minutes." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true }, { status: 201 });
  }

  const { events } = await getContent();
  const { input, errors, ok } = parseBooking(body, {
    minGuests: events.minGuests,
    eventTypes: events.eventTypes.map((t) => t.text),
    // Accept "today" in the visitor's timezone: allow anything from yesterday (UTC) onward.
    today: new Date(Date.now() - 86_400_000).toISOString().slice(0, 10),
  });
  if (!ok) return Response.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });

  const record = { name: input.name, email: input.email, event_date: input.date, guests: input.guests, event_type: input.type, message: input.message };
  const id = createBooking(record);

  const adminUrl = new URL("/admin?tab=bookings", request.url).toString();
  after(() =>
    sendEmail({
      subject: `New event request: ${input.type}, ${input.guests} guests on ${input.date}`,
      html: bookingEmailHtml(record, adminUrl),
      replyTo: input.email,
    })
  );

  return Response.json({ ok: true, id }, { status: 201 });
}
