import Alpine from "alpinejs";
import { initializeThemeStore } from "./theme";

// Make Alpine available globally for HTMX integration
window.Alpine = Alpine;

initializeThemeStore(Alpine);

Alpine.start();
