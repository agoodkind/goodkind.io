/**
 * Live Reload Client with HMR
 * Connects to the dev server via Server-Sent Events (SSE)
 * Uses HTMX for partial page updates
 */

import type htmx from "htmx.org";

export {};

declare global {
  interface Window {
    htmx?: typeof htmx;
  }
}

const eventSource = new EventSource("/__livereload");

let swapId = 0;
const activeSwaps = new Map<
  Element,
  { id: number; target: string; file: string; start: number }
>();

// Map file patterns to target elements for HMR
// Always swap main or body - morph handles granular updates
function getUpdateTarget(changedFile: string): string | null {
  switch (true) {
    case changedFile.includes("views/pages/"):
      return "body";
    case changedFile.includes("views/components/"):
      return "main";
    case changedFile.includes(".css"):
      return null; // CSS reloads automatically
    case changedFile.includes(".js"):
      return null; // JS requires full reload
    default:
      return "main";
  }
}

// Perform HMR update using HTMX
function performHMRUpdate(changedFile: string) {
  const target = getUpdateTarget(changedFile);

  if (!target) {
    console.log("🔄 Full reload required for:", changedFile);
    window.location.reload();
    return;
  }

  const targetElement = document.querySelector(target);
  if (!targetElement || !window.htmx) {
    console.log("⚠️  HTMX not available, falling back to full reload");
    window.location.reload();
    return;
  }

  const currentSwapId = ++swapId;
  const swapInfo = {
    id: currentSwapId,
    target,
    file: changedFile,
    start: performance.now(),
  };
  activeSwaps.set(targetElement, swapInfo);

  // Use HTMX to fetch and swap the target
  // Morph swap intelligently diffs and updates only what changed
  window.htmx.ajax("get", "/", {
    target: target,
    swap: "morph:outerHTML",
  });
}

eventSource.addEventListener("reload", function () {
  console.log("🔄 Full reload triggered");
  window.location.reload();
});

eventSource.addEventListener("update", function (event: MessageEvent) {
  const changedFile = event.data.replace("update:", "");
  performHMRUpdate(changedFile);
});

eventSource.addEventListener("open", function () {
  console.log("🔌 Live reload connected (HMR enabled)");
});

// HTMX event listener - log swap completion
document.body.addEventListener("htmx:afterSwap", function (e: Event) {
  const event = e as CustomEvent;
  const swapInfo = activeSwaps.get(event.detail.target);

  if (swapInfo) {
    const elapsed = Math.round(performance.now() - swapInfo.start);
    console.log(
      `⚡ [${swapInfo.id}] ${swapInfo.file} → ${swapInfo.target} (${elapsed}ms)`
    );
    activeSwaps.delete(event.detail.target);
  }
});

eventSource.addEventListener("error", function (event) {
  const target = event.target as EventSource | null;
  if (target?.readyState === EventSource.CLOSED) {
    console.log("⚠️  Dev server disconnected, retrying...");
    setTimeout(() => window.location.reload(), 1000);
  } else {
    console.log("⚠️  Live reload connection error");
  }
});

// Cleanup on page unload
window.addEventListener("beforeunload", function () {
  eventSource.close();
});
