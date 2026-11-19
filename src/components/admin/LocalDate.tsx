"use client";

/**
 * Shows a date in the viewer's own locale and timezone. Server and browser can format differently,
 * so hydration warnings are suppressed for just this text.
 * `value` is either an SQLite UTC timestamp ("YYYY-MM-DD HH:MM:SS") or a calendar date ("YYYY-MM-DD").
 */
export default function LocalDate({ value, mode = "datetime" }: { value: string; mode?: "datetime" | "date" | "day" }) {
  const isCalendarDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const d = isCalendarDate ? new Date(value + "T12:00") : new Date(value.replace(" ", "T") + "Z");
  const text =
    mode === "day"
      ? d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })
      : mode === "date"
        ? d.toLocaleDateString()
        : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  return (
    <time dateTime={value} suppressHydrationWarning>
      {text}
    </time>
  );
}
