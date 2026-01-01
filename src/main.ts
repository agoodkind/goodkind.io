import Alpine from "alpinejs";
import htmx from "htmx.org";
import { initializeThemeStore } from "./theme";
import { initializeThemeToggleComponent } from "./theme-toggle";
import {
  initializeDevControlsStore,
  initializeDevControlsComponent,
} from "./dev-controls";

// Make Alpine and HTMX available globally
window.Alpine = Alpine;
window.htmx = htmx;

initializeThemeStore(Alpine);
initializeThemeToggleComponent(Alpine);
initializeDevControlsStore(Alpine);
initializeDevControlsComponent(Alpine);

Alpine.start();
