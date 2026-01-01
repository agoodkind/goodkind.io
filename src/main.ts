import Alpine from "alpinejs";
import htmx from "htmx.org";
import { initializeThemeStore } from "./theme";
import { initializeThemeToggleComponent } from "./theme-toggle";

// Make Alpine and HTMX available globally
window.Alpine = Alpine;
window.htmx = htmx;

initializeThemeStore(Alpine);
initializeThemeToggleComponent(Alpine);

Alpine.start();
