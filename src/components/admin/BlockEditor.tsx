"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { saveBlockAction, resetBlockAction } from "@/app/admin/actions";
import { emptyItem, type BlockSchema, type Field } from "@/lib/content/schema";
import { fontStack } from "@/lib/content/fonts";
import LocalDate from "./LocalDate";

type Obj = Record<string, unknown>;

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] outline-none transition focus:border-cobalt focus:ring-4 focus:ring-cobalt/10";

/* Where each block lives on the public page, for the "View on site" link. */
const anchors: Record<string, string> = { hero: "#top", menu: "#menu", findTruck: "#find-us", story: "#story", events: "#events" };

export default function BlockEditor({ schema, initial, updatedAt }: { schema: BlockSchema; initial: unknown; updatedAt?: string }) {
  const [value, setValue] = useState<Obj>(initial as Obj);
  const [saved, setSaved] = useState<string>(JSON.stringify(initial));
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = useMemo(() => JSON.stringify(value) !== saved, [value, saved]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const save = () =>
    start(async () => {
      const res = await saveBlockAction(schema.key, JSON.stringify(value));
      if (res.ok) {
        setValue(res.data as Obj);
        setSaved(JSON.stringify(res.data));
        setStatus({ kind: "ok", text: "Saved — the website is updated." });
      } else setStatus({ kind: "error", text: res.error });
    });

  const reset = () => {
    if (!confirm(`Reset "${schema.title}" to the original content? Your edits to this section will be lost.`)) return;
    start(async () => {
      await resetBlockAction(schema.key);
      setStatus({ kind: "ok", text: "Restored the original content." });
    });
  };

  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(id);
  }, [status]);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cobalt/70">Website content</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">{schema.title}</h1>
          <p className="mt-2 text-ink/60">{schema.description}</p>
          <p className="mt-1 text-xs text-ink/40">{updatedAt ? <>Last saved <LocalDate value={updatedAt} /></> : "Showing the original content"}</p>
        </div>
        <a href={`/${anchors[schema.key] ?? ""}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-cobalt underline-offset-4 hover:underline">
          View on site ↗
        </a>
      </header>

      <form
        className="mt-8 space-y-5 rounded-3xl border border-ink/10 bg-white/70 p-5 sm:p-7"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        {schema.fields.map((f) => (
          <div key={f.key}>
            {f.key === "fontHeadline" && (
              <div className="mb-5 border-t border-ink/10 pt-6">
                <h2 className="font-display text-xl font-semibold">Fonts</h2>
                <p className="mt-1 text-sm text-ink/60">Pick fonts for this section only. “Default” keeps the site-wide fonts.</p>
              </div>
            )}
            <FieldInput field={f} value={value[f.key]} onChange={(v) => setValue((o) => ({ ...o, [f.key]: v }))} path={f.key} />
          </div>
        ))}

        <div className="sticky bottom-4 z-10 -mx-2 flex flex-wrap items-center gap-3 rounded-2xl bg-ink/90 p-3 text-cream shadow-xl backdrop-blur sm:-mx-3">
          <button type="submit" disabled={!dirty || pending} className="rounded-full bg-amber px-6 py-2.5 text-sm font-bold text-ink transition hover:bg-cream disabled:opacity-40">
            {pending ? "Saving…" : "Save changes"}
          </button>
          <button type="button" disabled={!dirty || pending} onClick={() => setValue(JSON.parse(saved))} className="rounded-full px-4 py-2.5 text-sm font-medium text-cream/80 hover:text-cream disabled:opacity-40">
            Discard
          </button>
          <span role="status" className={`text-sm ${status?.kind === "error" ? "text-amber" : "text-cream/80"}`}>
            {status?.text ?? (dirty ? "Unsaved changes" : "All changes saved")}
          </span>
          <button type="button" onClick={reset} disabled={pending} className="ml-auto text-xs text-cream/50 underline-offset-4 hover:text-cream hover:underline">
            Reset to original
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldInput({ field, value, onChange, path }: { field: Field; value: unknown; onChange: (v: unknown) => void; path: string }) {
  const id = `f-${path}`;
  const label = (
    <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
      {field.label}
    </label>
  );
  const help = field.help ? <p className="mt-1.5 text-xs text-ink/50">{field.help}</p> : null;

  switch (field.type) {
    case "text":
      return (
        <div>
          {label}
          <input id={id} className={inputCls} value={String(value ?? "")} maxLength={field.max} onChange={(e) => onChange(e.target.value)} dir="auto" />
          {help}
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea id={id} className={`${inputCls} resize-y`} rows={field.rows ?? 3} value={String(value ?? "")} maxLength={field.max} onChange={(e) => onChange(e.target.value)} dir="auto" />
          {help}
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input
            id={id}
            type="number"
            className={inputCls}
            value={value === "" || value === undefined ? "" : Number(value)}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
          {help}
        </div>
      );
    case "time":
      return (
        <div>
          {label}
          <input id={id} type="time" className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select
            id={id}
            className={inputCls}
            value={String(value ?? "")}
            onChange={(e) => {
              const opt = field.options.find((o) => String(o.value) === e.target.value);
              onChange(opt ? opt.value : e.target.value);
            }}
          >
            {field.options.map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
          {field.preview === "font" && <FontPreview value={String(value ?? "")} headline={field.key === "fontHeadline"} />}
          {help}
        </div>
      );
    case "list":
      return <ListInput field={field} value={Array.isArray(value) ? (value as Obj[]) : []} onChange={onChange} path={path} />;
  }
}

function ListInput({ field, value, onChange, path }: { field: Extract<Field, { type: "list" }>; value: Obj[]; onChange: (v: unknown) => void; path: string }) {
  const [open, setOpen] = useState<number | null>(value.length <= 3 && field.fields.length <= 1 ? -1 : null);
  const simple = field.fields.length === 1 && field.fields[0].type === "text";
  const full = field.max !== undefined && value.length >= field.max;

  const update = (i: number, item: Obj) => onChange(value.map((v, j) => (j === i ? item : v)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (open === i) setOpen(j);
  };
  const remove = (i: number) => {
    const title = field.titleKey ? String(value[i][field.titleKey] ?? "") : "";
    if (!simple && !confirm(`Remove ${field.itemLabel.toLowerCase()}${title ? ` "${title}"` : ""}?`)) return;
    onChange(value.filter((_, j) => j !== i));
  };
  const add = () => {
    onChange([...value, emptyItem(field.fields)]);
    setOpen(value.length);
  };

  const iconBtn = "grid h-8 w-8 place-items-center rounded-lg text-ink/50 transition hover:bg-ink/5 hover:text-ink disabled:opacity-30";

  return (
    <fieldset className="rounded-2xl border border-ink/10 bg-[#f7f3ec]/70 p-3 sm:p-4">
      <legend className="px-1 text-sm font-bold">
        {field.label} <span className="font-normal text-ink/40">({value.length}{field.max ? ` / ${field.max}` : ""})</span>
      </legend>
      {field.help && <p className="mb-2 text-xs text-ink/50">{field.help}</p>}

      <ul className="space-y-2">
        {value.map((item, i) => {
          const title = field.titleKey ? String(item[field.titleKey] ?? "") : "";
          const controls = (
            <div className="flex shrink-0 items-center">
              <button type="button" className={iconBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                ↑
              </button>
              <button type="button" className={iconBtn} onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">
                ↓
              </button>
              <button type="button" className={`${iconBtn} hover:text-velvet`} onClick={() => remove(i)} aria-label={`Remove ${field.itemLabel}`}>
                ✕
              </button>
            </div>
          );

          if (simple) {
            const f = field.fields[0];
            return (
              <li key={i} className="flex items-center gap-2">
                <input
                  aria-label={`${field.itemLabel} ${i + 1}`}
                  className={inputCls}
                  value={String(item[f.key] ?? "")}
                  maxLength={"max" in f ? f.max : undefined}
                  onChange={(e) => update(i, { ...item, [f.key]: e.target.value })}
                  dir="auto"
                />
                {controls}
              </li>
            );
          }

          const isOpen = open === i || open === -1;
          return (
            <li key={i} className="rounded-xl border border-ink/10 bg-white">
              <div className="flex items-center gap-2 pl-3">
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2 py-2.5 text-left text-sm">
                  <span className={`text-ink/40 transition ${isOpen ? "rotate-90" : ""}`}>▸</span>
                  <span className="truncate font-medium" dir="auto">
                    {title || `${field.itemLabel} ${i + 1}`}
                  </span>
                </button>
                {controls}
              </div>
              {isOpen && (
                <div className="grid gap-4 border-t border-ink/10 p-4 sm:grid-cols-2">
                  {field.fields.map((f) => (
                    <div key={f.key} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
                      <FieldInput field={f} value={item[f.key]} onChange={(v) => update(i, { ...item, [f.key]: v })} path={`${path}-${i}-${f.key}`} />
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <button type="button" onClick={add} disabled={full} className="mt-3 rounded-full border border-dashed border-cobalt/40 px-4 py-2 text-sm font-bold text-cobalt transition hover:bg-cobalt/5 disabled:opacity-40">
        + Add {field.itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}

/** Live sample of a font choice, in Hebrew, so the admin can see it before saving. */
function FontPreview({ value, headline }: { value: string; headline: boolean }) {
  const family = fontStack(value) ?? (headline ? "var(--font-hebrew), var(--font-heebo), sans-serif" : "var(--font-heebo), sans-serif");
  return (
    <p
      dir="rtl"
      lang="he"
      className={`mt-2 rounded-xl bg-cobalt px-4 py-3 text-cream ${headline ? "text-3xl font-semibold leading-tight" : "text-base"}`}
      style={{ fontFamily: family }}
    >
      {headline ? "חומרים פשוטים, טעם יוצא דופן" : "אספרסו חד־זני, קולד ברו של 18 שעות ומאפים מהתנור של הבוקר. ₪15"}
    </p>
  );
}
