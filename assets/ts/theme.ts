/**
 * Theme management for dark/light mode toggle
 */

import type { Alpine as AlpineType } from "alpinejs";
import Alpine from "alpinejs";

type Theme = "light" | "dark" | "auto";

interface ThemeStore {
  current: Theme;
  toggle(): void;
  init(): void;
}

declare global {
  interface Window {
    Alpine: AlpineType;
  }
}

// Make Alpine available globally
window.Alpine = Alpine;

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
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", isDark ? "#2e1065" : "#f5f3ff");
  }
}

/**
 * Apply theme to document and update icons
 */
function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  const darkIcon = document.getElementById("theme-toggle-dark-icon");
  const lightIcon = document.getElementById("theme-toggle-light-icon");

  let effectiveTheme: "light" | "dark";

  if (theme === "auto") {
    effectiveTheme = getSystemPreference();
  } else {
    effectiveTheme = theme;
  }

  if (effectiveTheme === "dark") {
    html.classList.add("dark");
    darkIcon?.classList.add("hidden");
    lightIcon?.classList.remove("hidden");
    updateThemeColor(true);
  } else {
    html.classList.remove("dark");
    darkIcon?.classList.remove("hidden");
    lightIcon?.classList.add("hidden");
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
 * Get next theme in cycle: light → dark → auto → light
 */
function getNextTheme(current: Theme): Theme {
  switch (current) {
    case "light":
      return "dark";
    case "dark":
      return "auto";
    case "auto":
    default:
      return "light";
  }
}

// Register Alpine store
Alpine.store("theme", {
  current: getCurrentTheme(),

  toggle(this: ThemeStore) {
    this.current = getNextTheme(this.current);
    localStorage.setItem(THEME_KEY, this.current);
    applyTheme(this.current);
  },

  init(this: ThemeStore) {
    applyTheme(this.current);
  },
} as ThemeStore);

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", initializeThemeIcons);

// Listen for system preference changes when in auto mode
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (getCurrentTheme() === "auto") {
    applyTheme("auto");
  }
});

// Start Alpine
Alpine.start();
