export type Theme = "light" | "dark" | "system";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) ?? "system";
}

export function getEffectiveTheme(): "light" | "dark" {
  const stored = getStoredTheme();
  if (stored !== "system") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const effective = theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : theme;

  document.documentElement.classList.toggle("dark", effective === "dark");
  localStorage.setItem("theme", theme);
}
