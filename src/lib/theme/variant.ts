"use client";

export type ThemeVariant = "default" | "red" | "green";
export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme_variant";
const STORAGE_KEY_MODE = "theme_mode";
const MODE_EVENT = "theme:mode";
const VARIANT_EVENT = "theme:variant";
const THEME_CLASSES: Record<Exclude<ThemeVariant, "default">, string> = {
  red: "theme-red",
  green: "theme-green",
};

function applyThemeVariant(variant: ThemeVariant): void {
  if (typeof document === "undefined") return;
  const classList = document.documentElement.classList;
  classList.remove(...Object.values(THEME_CLASSES));
  if (variant !== "default") classList.add(THEME_CLASSES[variant]);
}

function getSystemPrefersDark(): boolean {
  try {
    return (
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  } catch {
    return false;
  }
}

function computeEffectiveMode(mode: ThemeMode): Exclude<ThemeMode, "system"> {
  if (mode === "system") return getSystemPrefersDark() ? "dark" : "light";
  return mode;
}

function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const effective = computeEffectiveMode(mode);
  const classList = document.documentElement.classList;
  classList.toggle("dark", effective === "dark");
  try {
    document.documentElement.dataset.themeMode = effective;
  } catch {
    /* empty */
  }
}

export function initThemeVariant(): void {
  try {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeVariant | null) || "default";
    applyThemeVariant(stored);
  } catch {
    /* empty */
  }
}

export function setThemeVariant(variant: ThemeVariant): void {
  try {
    localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    /* empty */
  }
  applyThemeVariant(variant);
}

export function getThemeVariant(): ThemeVariant {
  try {
    return ((localStorage.getItem(STORAGE_KEY) as ThemeVariant | null) || "default") as ThemeVariant;
  } catch {
    return "default";
  }
}

export function initThemeMode(): void {
  try {
    // Default to light instead of system when nothing is stored
    const stored = (localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null) || "light";
    applyThemeMode(stored);
  } catch {
    /* empty */
  }
}

export function setThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  } catch {
    /* empty */
  }
  applyThemeMode(mode);
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent(MODE_EVENT, { detail: { mode, effectiveMode: computeEffectiveMode(mode) } }),
      );
    } catch {
      /* empty */
    }
  }
}

export function getThemeMode(): ThemeMode {
  try {
    // When not set, treat light as the default mode
    return ((localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null) || "light") as ThemeMode;
  } catch {
    return "light";
  }
}

export function getEffectiveThemeMode(): Exclude<ThemeMode, "system"> {
  return computeEffectiveMode(getThemeMode());
}

export function notifyVariantChange(variant: ThemeVariant): void {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent(VARIANT_EVENT, { detail: { variant } }));
    } catch {
      /* empty */
    }
  }
}
