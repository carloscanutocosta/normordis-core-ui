export const THEMES = [
  { id: "light",           label: "Light",              icon: "Sun" },
  { id: "dark",            label: "Dark",               icon: "Moon" },
  { id: "high-contrast",      label: "High Contrast",      icon: "Contrast" },
  { id: "high-contrast-dark", label: "High Contrast Dark", icon: "Monitor" },
];

const STORAGE_KEY = "app-theme";

export function applyTheme(themeId) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.remove("dark", "high-contrast", "high-contrast-dark");
  if (themeId !== "light") root.classList.add(themeId);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, themeId);
  }
}

export function getStoredTheme() {
  if (typeof localStorage === "undefined") return "light";

  return localStorage.getItem(STORAGE_KEY) || "light";
}
