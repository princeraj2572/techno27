"use client";

import { useEffect, useState, useTransition } from "react";
import type { ReactElement } from "react";

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "techno27-theme";

const applyTheme = (theme: ThemeMode): void => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.style.colorScheme = theme;
};

export function ThemeToggle(): ReactElement {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = (): void => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

    startTransition(() => {
      setTheme(nextTheme);
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-white/10 bg-[var(--app-card)] px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:border-aurora-300/60 hover:bg-[var(--app-card-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-300"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "light"}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default ThemeToggle;