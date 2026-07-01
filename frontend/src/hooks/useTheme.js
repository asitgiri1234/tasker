import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tasker-theme";

const getInitial = () => {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
  }
  return "dark";
};

/**
 * Theme state synced to <html data-theme> and localStorage.
 * The initial value is read from the attribute the inline bootstrap script
 * set (so React never disagrees with the pre-paint theme).
 */
export default function useTheme() {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#F4F1EA" : "#141210");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore write failures (private mode) */
    }
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );

  return { theme, toggle };
}
