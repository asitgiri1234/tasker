import { useEffect, useRef, useState } from "react";

/**
 * The "Ember Check" — the app's signature completion control.
 *
 * At rest: a thin ring in the task's status color.
 * On complete: an ember arc sweeps around the ring like a lit fuse, a
 * checkmark strokes in, and the disc fills. The parent handles the
 * accompanying ink-strike on the title and the row re-file.
 *
 * Accessibility: a real toggle button with role="checkbox" + aria-checked,
 * operable by mouse, Enter, and Space. Motion is CSS-driven and disabled
 * under prefers-reduced-motion (handled in index.css).
 */
export default function EmberCheck({ checked, onToggle, disabled, label }) {
  const [animating, setAnimating] = useState(false);
  const prevChecked = useRef(checked);

  // Play the burn/draw sequence only on the false -> true transition.
  useEffect(() => {
    if (checked && !prevChecked.current) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 800);
      prevChecked.current = checked;
      return () => clearTimeout(t);
    }
    prevChecked.current = checked;
  }, [checked]);

  const cls = [
    "ember-check",
    checked ? "checked" : "",
    animating ? "animate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={cls}
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
    >
      <svg viewBox="0 0 26 26" aria-hidden="true">
        {/* hover glow */}
        <circle className="ec-glow" cx="13" cy="13" r="13" />
        {/* rest ring */}
        <circle className="ec-ring" cx="13" cy="13" r="11" />
        {/* filled disc */}
        <circle className="ec-fill" cx="13" cy="13" r="12" />
        {/* ember fuse arc (starts at top, sweeps clockwise) */}
        <circle
          className="ec-fuse"
          cx="13"
          cy="13"
          r="12"
          transform="rotate(-90 13 13)"
        />
        {/* checkmark */}
        <path className="ec-check" d="M7.5 13.5 L11.2 17 L18.5 9" />
      </svg>
    </button>
  );
}
