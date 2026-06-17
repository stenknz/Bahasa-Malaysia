"use client";

import { useEffect, useState } from "react";
import { getStoredTheme, getEffectiveTheme, applyTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    applyTheme(getStoredTheme());
  }, []);

  function toggle() {
    const current = getEffectiveTheme();
    const next: Theme = current === "dark" ? "light" : "dark";
    applyTheme(next);
    setMounted(false);
    setTimeout(() => setMounted(true), 0);
  }

  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <button
      onClick={toggle}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {getEffectiveTheme() === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
