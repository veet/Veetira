/* Validation shared by the browser forms and the API routes. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type BookingInput = { name: string; email: string; date: string; guests: number; type: string; message: string };
export type BookingErrors = Partial<Record<"name" | "email" | "date" | "guests" | "type", string>>;

export function parseBooking(raw: Record<string, unknown>, opts: { minGuests: number; eventTypes: string[]; today?: string }) {
  const str = (k: string, max: number) => String(raw[k] ?? "").trim().slice(0, max);
  const input: BookingInput = {
    name: str("name", 100),
    email: str("email", 200).toLowerCase(),
    date: str("date", 10),
    guests: Math.floor(Number(raw.guests)),
    type: str("type", 60),
    message: str("message", 2000),
  };
  const errors: BookingErrors = {};
  if (input.name.length < 2) errors.name = "איך קוראים לך?";
  if (!EMAIL_RE.test(input.email)) errors.email = "כתובת המייל לא נראית תקינה.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.date = "בחרו תאריך.";
  else if (input.date < (opts.today ?? localToday())) errors.date = "בחרו תאריך עתידי.";
  if (!Number.isFinite(input.guests) || input.guests < opts.minGuests) errors.guests = `אנחנו מגיעים לאירועים מ־${opts.minGuests} אורחים.`;
  else if (input.guests > 10000) errors.guests = "זה הרבה קפה — תתקשרו אלינו!";
  if (opts.eventTypes.length && !opts.eventTypes.includes(input.type)) input.type = opts.eventTypes[opts.eventTypes.length - 1];
  return { input, errors, ok: Object.keys(errors).length === 0 };
}

export function localToday(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
