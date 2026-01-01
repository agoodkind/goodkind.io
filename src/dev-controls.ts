import type { Alpine as AlpineType } from "alpinejs";

interface DevControlsComponent {
  // Minimal component, no state needed
}

interface DevControlsStore {
  enabled: boolean;
}

export function initializeDevControlsStore(Alpine: AlpineType): void {
  Alpine.store("devControls", {
    enabled: __DEV__,
  } as DevControlsStore);
}

export function initializeDevControlsComponent(Alpine: AlpineType): void {
  Alpine.data("devControls", function (): DevControlsComponent {
    return {};
  });
}
