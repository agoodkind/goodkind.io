import Alpine from "alpinejs";
import "htmx.org";
import { initializeThemeStore } from "./theme";
import { initializeThemeToggleComponent } from "./theme-toggle";

// Make Alpine available globally for HTMX integration
window.Alpine = Alpine;

initializeThemeStore(Alpine);
initializeThemeToggleComponent(Alpine);

Alpine.start();
