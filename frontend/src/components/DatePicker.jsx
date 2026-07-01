import { useEffect, useMemo, useRef, useState } from "react";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Local-time yyyy-mm-dd (avoids the UTC off-by-one of toISOString). */
const toKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const parseKey = (key) => {
  if (!key) return null;
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const fmtDisplay = (key) => {
  const d = parseKey(key);
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Custom popover calendar — replaces the native <input type="date">.
 * `value` and the value passed to onChange are yyyy-mm-dd strings (or "").
 */
export default function DatePicker({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(() => parseKey(value) || today);
  const rootRef = useRef(null);

  useEffect(() => {
    if (open) setView(parseKey(value) || new Date());
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Build a 6-week grid starting on Monday.
  const cells = useMemo(() => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // Mon=0
    const start = new Date(year, month, 1 - startOffset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return {
        date: d,
        key: toKey(d),
        inMonth: d.getMonth() === month,
        isToday: toKey(d) === toKey(today),
      };
    });
  }, [view, today]);

  const shift = (delta) =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  const pick = (key) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div className="datepicker" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="dropdown-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ color: value ? "var(--ink)" : "var(--muted)" }}>
          {value ? fmtDisplay(value) : "No due date"}
        </span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="chevron">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="dp-menu" role="dialog" aria-label="Choose due date">
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => shift(-1)} aria-label="Previous month">
              ‹
            </button>
            <span className="dp-title">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </span>
            <button type="button" className="dp-nav" onClick={() => shift(1)} aria-label="Next month">
              ›
            </button>
          </div>

          <div className="dp-grid" role="grid">
            {DOW.map((d, i) => (
              <div className="dp-dow" key={i}>
                {d}
              </div>
            ))}
            {cells.map((c) => {
              const selected = c.key === value;
              return (
                <button
                  type="button"
                  key={c.key}
                  className={[
                    "dp-cell",
                    c.inMonth ? "" : "other",
                    c.isToday ? "today" : "",
                    selected ? "selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={selected}
                  onClick={() => pick(c.key)}
                >
                  {c.date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="dp-foot">
            <button type="button" className="dp-link" onClick={() => pick(toKey(new Date()))}>
              Today
            </button>
            <button type="button" className="dp-link" onClick={() => pick("")}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
