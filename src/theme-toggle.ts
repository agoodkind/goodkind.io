import type { Alpine as AlpineType } from "alpinejs";

interface ThemeToggleComponent {
  open: boolean;
  closeTimer: ReturnType<typeof setTimeout> | null;
  cancelClose(): void;
  scheduleClose(): void;
}

function cancelCloseTimer(component: ThemeToggleComponent): void {
  if (component.closeTimer === null) {
    return;
  }

  clearTimeout(component.closeTimer);
  component.closeTimer = null;
}

function scheduleCloseTimer(component: ThemeToggleComponent): void {
  cancelCloseTimer(component);
  component.closeTimer = setTimeout(function () {
    component.open = false;
    component.closeTimer = null;
  }, 150);
}

export function initializeThemeToggleComponent(Alpine: AlpineType): void {
  Alpine.data("themeToggle", function (): ThemeToggleComponent {
    return {
      open: false,
      closeTimer: null,
      cancelClose() {
        cancelCloseTimer(this);
      },
      scheduleClose() {
        scheduleCloseTimer(this);
      },
    };
  });
}
