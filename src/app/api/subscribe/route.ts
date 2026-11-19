import { after } from "next/server";
import { addSubscriber } from "@/server/records";
import { escapeHtml, sendEmail } from "@/server/email";
import { clientIp, rateLimit } from "@/server/rateLimit";
import { EMAIL_RE } from "@/lib/validation";

/** POST /api/subscribe — newsletter signup from the footer. */
export async function POST(request: Request) {
  const limit = rateLimit(`subscribe:${clientIp(request.headers)}`, 8, 10 * 60_000);
  if (!limit.ok) return Response.json({ error: "Too many requests — try again soon." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.company === "string" && body.company.trim() !== "") return Response.json({ ok: true });

  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  if (!EMAIL_RE.test(email)) return Response.json({ error: "That email doesn't look right." }, { status: 422 });

  const isNew = addSubscriber(email);
  if (isNew) {
    after(() => sendEmail({ subject: "New newsletter subscriber", html: `<p style="font-family:system-ui">${escapeHtml(email)} just joined the list.</p>` }));
  }
  return Response.json({ ok: true, alreadySubscribed: !isNew });
}
