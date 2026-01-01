import type { Alpine as AlpineType } from "alpinejs";

interface DevControlsComponent {
  // Minimal component, no state needed
}

interface DevControlsStore {
  enabled: boolean;
  glassEnabled: boolean;
  toggleGlass(): void;
}

function getGlassEnabled(): boolean {
  if (!__DEV__) {
    return false;
  }

  const stored = localStorage.getItem("dev:liquid-glass");
  if (stored === "true" || stored === "1") {
    return true;
  }
  if (stored === "false" || stored === "0") {
    return false;
  }

  return document.documentElement.classList.contains("ios26-glass");
}

function setGlassEnabled(enabled: boolean): void {
  if (!__DEV__) {
    return;
  }

  localStorage.setItem("dev:liquid-glass", enabled ? "1" : "0");

  if (enabled) {
    document.documentElement.classList.add("ios26-glass");
  } else {
    document.documentElement.classList.remove("ios26-glass");
  }
}

export function initializeDevControlsStore(Alpine: AlpineType): void {
  Alpine.store("devControls", {
    enabled: __DEV__,
    glassEnabled: getGlassEnabled(),

    toggleGlass(this: DevControlsStore) {
      this.glassEnabled = !this.glassEnabled;
      setGlassEnabled(this.glassEnabled);
    },
  } as DevControlsStore);
}

export function initializeDevControlsComponent(Alpine: AlpineType): void {
  Alpine.data("devControls", function (): DevControlsComponent {
    return {};
  });
}
