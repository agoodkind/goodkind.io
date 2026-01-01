/**
 * Critical: Prevent flash of wrong theme
 * Must run synchronously before body renders
 */

const theme = localStorage.getItem("theme") || "auto";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldBeDark = theme === "dark" || (theme === "auto" && prefersDark);

if (shouldBeDark) {
  document.documentElement.classList.add("dark");
}

const metaTags = document.querySelectorAll('meta[name="theme-color"]');
metaTags.forEach(function (tag) {
  tag.remove();
});

const metaThemeColor = document.createElement("meta");
metaThemeColor.setAttribute("name", "theme-color");
metaThemeColor.setAttribute("content", shouldBeDark ? "#0f172a" : "#f8fafc");
document.head.appendChild(metaThemeColor);
