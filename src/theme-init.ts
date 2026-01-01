/**
 * Critical: Prevent flash of wrong theme
 * Must run synchronously before body renders
 */

import { UAParser } from "ua-parser-js";

const DEV_GLASS_KEY = "dev:liquid-glass";

function parseMajorVersion(version: string | undefined): number | null {
  if (!version) {
    return null;
  }

  const match = version.match(/^(\d+)\./);
  if (!match || !match[1]) {
    return null;
  }

  return Number.parseInt(match[1], 10);
}

function parseDevLiquidGlassOverride(): boolean | null {
  if (!__DEV__) {
    return null;
  }

  const stored = localStorage.getItem(DEV_GLASS_KEY);
  if (stored === "1") {
    return true;
  }

  if (stored === "0") {
    return false;
  }

  return null;
}

function getIOSMajorVersion(): number | null {
  const parser = new UAParser(navigator.userAgent);
  const os = parser.getOS();
  const browser = parser.getBrowser();

  if (os.name !== "iOS" && os.name !== "iPadOS") {
    return null;
  }

  const osMajor = parseMajorVersion(os.version);
  const browserMajor = browser.major ? Number.parseInt(browser.major, 10) : null;

  if (
    browser.name === "Mobile Safari" &&
    browserMajor !== null &&
    os.version === "18.6" &&
    browserMajor >= 26
  ) {
    return browserMajor;
  }

  return osMajor;
}

function supportsBackdropFilter(): boolean {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }

  return (
    CSS.supports("backdrop-filter: blur(1px)") ||
    CSS.supports("-webkit-backdrop-filter: blur(1px)")
  );
}

const iosMajorVersion = getIOSMajorVersion();
const devLiquidGlass = parseDevLiquidGlassOverride();
if (
  supportsBackdropFilter() &&
  (devLiquidGlass === true ||
    (devLiquidGlass === null && iosMajorVersion !== null && iosMajorVersion >= 26))
) {
  document.documentElement.classList.add("ios26-glass");
}

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
