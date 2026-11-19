import "server-only";

/*
 * Email notifications through Resend's HTTP API (no SDK needed).
 *   RESEND_API_KEY – from resend.com (free tier is fine)
 *   NOTIFY_EMAIL   – where booking / signup alerts go
 *   EMAIL_FROM     – sender, e.g. "אהבות קטנות <hello@yourdomain.com>" (domain must be verified in Resend)
 * Without RESEND_API_KEY the email is printed to the server console instead, so local dev just works.
 */
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL);

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendEmail({ subject, html, replyTo }: { subject: string; html: string; replyTo?: string }) {
  if (!emailConfigured()) {
    console.info(`[email:dev] Would send "${subject}" to NOTIFY_EMAIL (set RESEND_API_KEY + NOTIFY_EMAIL to send for real).`);
    return { ok: true, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: process.env.NOTIFY_EMAIL!.split(",").map((s) => s.trim()),
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
    return { ok: res.ok, skipped: false };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, skipped: false };
  }
}

const row = (k: string, v: string) =>
  `<tr><td style="padding:6px 16px 6px 0;color:#5b6078;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;color:#0e1530">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`;

export function orderEmailHtml(
  o: { id: number; name: string; phone: string; pickup_date: string; pickup_time: string; location: string; items: { name: string; price: number; qty: number }[]; total: number; payment: string; note: string },
  adminUrl: string
) {
  const lines = o.items.map((i) => `${i.qty} × ${i.name} — ₪${(i.price * i.qty).toFixed(2)}`).join("\n");
  return `<div style="font-family:system-ui,sans-serif;max-width:560px">
  <div style="background:#1f3a93;color:#f4eee4;padding:20px 24px;border-radius:16px 16px 0 0;font-size:20px;font-weight:700">New order #${o.id} ☕</div>
  <div style="border:1px solid #e6d3b8;border-top:0;padding:20px 24px;border-radius:0 0 16px 16px">
    <table style="border-collapse:collapse;font-size:15px">
      ${row("Name", o.name)}${row("Phone", o.phone)}${row("Pickup", `${o.pickup_date} ${o.pickup_time} · ${o.location}`)}${row("Items", lines)}${row("Total", `₪${o.total.toFixed(2)}`)}${row("Payment", o.payment === "bit" ? "Bit (check it arrived)" : "Cash at pickup")}${o.note ? row("Note", o.note) : ""}
    </table>
    <p style="margin:20px 0 0"><a href="${escapeHtml(adminUrl)}" style="background:#1f3a93;color:#f4eee4;padding:10px 18px;border-radius:99px;text-decoration:none;font-weight:600">Open in admin</a></p>
  </div></div>`;
}

export function bookingEmailHtml(b: { name: string; email: string; event_date: string; guests: number; event_type: string; message: string }, adminUrl: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px">
  <div style="background:#1f3a93;color:#f4eee4;padding:20px 24px;border-radius:16px 16px 0 0;font-size:20px;font-weight:700">New event request ☕</div>
  <div style="border:1px solid #e6d3b8;border-top:0;padding:20px 24px;border-radius:0 0 16px 16px">
    <table style="border-collapse:collapse;font-size:15px">
      ${row("Name", b.name)}${row("Email", b.email)}${row("Date", b.event_date)}${row("Guests", String(b.guests))}${row("Event", b.event_type)}${b.message ? row("Message", b.message) : ""}
    </table>
    <p style="margin:20px 0 0"><a href="${escapeHtml(adminUrl)}" style="background:#1f3a93;color:#f4eee4;padding:10px 18px;border-radius:99px;text-decoration:none;font-weight:600">Open in admin</a></p>
  </div></div>`;
}
