import { useEffect, useRef, useState } from "react";

const OPTIONS = [
  { value: "pending", label: "Pending", color: "var(--st-pending)" },
  { value: "in-progress", label: "In Progress", color: "var(--st-progress)" },
  { value: "completed", label: "Completed", color: "var(--st-completed)" },
];

const Chevron = () => (
  <svg className="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Check = () => (
  <svg className="check" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12l5 5L20 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Custom status selector (ARIA listbox) — replaces the native <select>.
 * Keyboard: Enter/Space/Arrow to open, Up/Down to move, Enter to pick,
 * Esc to close. Closes on outside click / blur.
 */
export default function StatusDropdown({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef(null);

  const selected = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDocClick);
    return () => document.removeEventListener("pointerdown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = OPTIONS.findIndex((o) => o.value === value);
      setActiveIdx(idx < 0 ? 0 : idx);
    }
  }, [open, value]);

  const commit = (val) => {
    onChange(val);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) return setOpen(true);
        setActiveIdx((i) => (i + 1) % OPTIONS.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) return setOpen(true);
        setActiveIdx((i) => (i - 1 + OPTIONS.length) % OPTIONS.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) commit(OPTIONS[activeIdx].value);
        else setOpen(true);
        break;
      case "Escape":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="dropdown" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="swatch" style={{ background: selected.color }} />
          {selected.label}
        </span>
        <Chevron />
      </button>

      {open && (
        <ul className="dropdown-menu" role="listbox" aria-activedescendant={`opt-${activeIdx}`}>
          {OPTIONS.map((opt, i) => (
            <li key={opt.value} role="none">
              <button
                type="button"
                id={`opt-${i}`}
                role="option"
                aria-selected={opt.value === value}
                className={`dropdown-option ${i === activeIdx ? "active" : ""}`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => commit(opt.value)}
              >
                <span className="swatch" style={{ background: opt.color }} />
                {opt.label}
                <Check />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
