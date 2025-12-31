/**
 * Theme management for dark/light mode toggle
 */

import type { Alpine as AlpineType } from "alpinejs";

type Theme = "light" | "dark" | "auto";

interface ThemeStore {
  current: Theme;
  toggle(): void;
  set(theme: Theme): void;
  sliderStyle(): string;
  currentLabel(): string;
  init(): void;
}

declare global {
  interface Window {
    Alpine: AlpineType;
  }
}

const THEME_KEY = "theme";

/**
 * Get system preference for dark mode
 */
function getSystemPreference(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Get current theme from localStorage or default to auto
 */
function getCurrentTheme(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) || "auto";
}

/**
 * Update Safari theme-color meta tag
 */
function updateThemeColor(isDark: boolean): void {
  const existingTags = document.querySelectorAll('meta[name="theme-color"]');
  existingTags.forEach((tag) => tag.remove());

  const metaThemeColor = document.createElement("meta");
  metaThemeColor.setAttribute("name", "theme-color");
  metaThemeColor.setAttribute("content", isDark ? "#0f172a" : "#f8fafc");
  document.head.appendChild(metaThemeColor);
}

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme): void {
  const html = document.documentElement;

  let effectiveTheme: "light" | "dark";

  if (theme === "auto") {
    effectiveTheme = getSystemPreference();
  } else {
    effectiveTheme = theme;
  }

  if (effectiveTheme === "dark") {
    html.classList.add("dark");
    updateThemeColor(true);
  } else {
    html.classList.remove("dark");
    updateThemeColor(false);
  }
}

/**
 * Initialize theme icons based on current theme
 */
function initializeThemeIcons(): void {
  const theme = getCurrentTheme();
  applyTheme(theme);
}

/**
 * Get next theme in 3-state cycle
 * - auto (showing light) → dark → light → auto → ...
 * - auto (showing dark) → light → dark → auto → ...
 * - light → auto → dark → light → ...
 * - dark → light → auto → dark → ...
 */
function getNextTheme(current: Theme): Theme {
  if (current === "auto") {
    // When in auto, switch to opposite of what's currently showing
    const systemPreference = getSystemPreference();
    return systemPreference === "dark" ? "light" : "dark";
  }

  switch (current) {
    case "light":
      return "auto";
    case "dark":
      return "light";
    default:
      return "light";
  }
}

function getThemeLabel(theme: Theme): string {
  switch (theme) {
    case "light":
      return "Light";
    case "dark":
      return "Dark";
    case "auto":
      return "Auto";
    default:
      return "Auto";
  }
}

function getThemeSliderX(theme: Theme): string {
  switch (theme) {
    case "light":
      return "0%";
    case "auto":
      return "100%";
    case "dark":
      return "200%";
    default:
      return "100%";
  }
}

function handleSystemPreferenceChange(): void {
  if (getCurrentTheme() === "auto") {
    applyTheme("auto");
  }
}

/**
 * Initialize theme store with Alpine instance
 * @param {AlpineType} Alpine - Alpine.js instance
 */
export function initializeThemeStore(Alpine: AlpineType): void {
  // Register Alpine store
  Alpine.store("theme", {
    current: getCurrentTheme(),

    toggle(this: ThemeStore) {
      this.current = getNextTheme(this.current);
      localStorage.setItem(THEME_KEY, this.current);
      applyTheme(this.current);
    },

    set(this: ThemeStore, theme: Theme) {
      this.current = theme;
      localStorage.setItem(THEME_KEY, this.current);
      applyTheme(this.current);
    },

    sliderStyle(this: ThemeStore) {
      return `transform: translateX(${getThemeSliderX(this.current)});`;
    },

    currentLabel(this: ThemeStore) {
      return getThemeLabel(this.current);
    },

    init(this: ThemeStore) {
      applyTheme(this.current);
    },
  } as ThemeStore);

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", initializeThemeIcons);

  // Listen for system preference changes when in auto mode
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", handleSystemPreferenceChange);
}
