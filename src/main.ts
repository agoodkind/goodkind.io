import Alpine from "alpinejs";
import { initializeThemeStore } from "./theme";
import { initializeThemeToggleComponent } from "./theme_toggle";

// Make Alpine available globally for HTMX integration
window.Alpine = Alpine;

initializeThemeStore(Alpine);
initializeThemeToggleComponent(Alpine);

Alpine.start();
