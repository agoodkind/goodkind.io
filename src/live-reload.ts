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
  {
    id: number;
    target: string;
    file: string;
    start: number;
    beforeSnapshot?: { html: string; childCount: number };
  }
>();

let isSwapping = false;

// Debounce utility with cancellation support
function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

// Create a concise diff summary of what changed
function getDiffSummary(
  before: { html: string; childCount: number },
  afterElement: Element
): string {
  const afterChildCount = afterElement.children.length;
  const beforeHtml = before.html;
  const afterHtml = afterElement.innerHTML;

  // Quick identity check
  if (beforeHtml === afterHtml) {
    return "no changes";
  }

  const parts: string[] = [];

  // Check child count changes
  const childDiff = afterChildCount - before.childCount;
  if (childDiff > 0) {
    parts.push(`+${childDiff} element${childDiff > 1 ? "s" : ""}`);
  } else if (childDiff < 0) {
    parts.push(`${childDiff} element${childDiff < -1 ? "s" : ""}`);
  }

  // Check size change
  const sizeDiff = afterHtml.length - beforeHtml.length;
  if (Math.abs(sizeDiff) > 100) {
    const sign = sizeDiff > 0 ? "+" : "";
    parts.push(`${sign}${sizeDiff} chars`);
  }

  // Try to identify what changed by looking for class/attribute changes
  const beforeClasses = beforeHtml.match(/class="[^"]*"/g) || [];
  const afterClasses = afterHtml.match(/class="[^"]*"/g) || [];
  if (beforeClasses.length !== afterClasses.length) {
    parts.push("class changes");
  }

  return parts.length > 0 ? parts.join(", ") : "content updated";
}

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
  const shortFile = changedFile.replace(/^.*\/(views|src)\//, "$1/");

  // Prevent overlapping swaps
  if (isSwapping) {
    console.log(`⏭️  Skipped (swap in progress): ${shortFile}`);
    return;
  }

  const target = getUpdateTarget(changedFile);

  if (!target) {
    console.log(`🔄 Full reload: ${shortFile}`);
    window.location.reload();
    return;
  }

  const targetElement = document.querySelector(target);
  if (!targetElement || !window.htmx) {
    console.log("⚠️  HTMX not available, full reload required");
    window.location.reload();
    return;
  }

  isSwapping = true;

  console.log(`🔨 Applying: ${shortFile} → <${target}>`);

  const currentSwapId = ++swapId;
  const swapInfo = {
    id: currentSwapId,
    target,
    file: changedFile,
    start: performance.now(),
    beforeSnapshot: {
      html: targetElement.innerHTML,
      childCount: targetElement.children.length,
    },
  };
  activeSwaps.set(targetElement, swapInfo);

  // Use HTMX to fetch and swap the target
  // Morph swap intelligently diffs and updates only what changed
  window.htmx.ajax("get", "/", {
    target: target,
    swap: "morph:outerHTML",
  });
}

// Debounced version of HMR update (500ms delay to prevent rapid flashing)
const debouncedHMRUpdate = debounce(performHMRUpdate, 500);

eventSource.addEventListener("reload", function () {
  console.log("🔄 Full reload triggered");
  window.location.reload();
});

eventSource.addEventListener("update", function (event: MessageEvent) {
  const changedFile = event.data.replace("update:", "");
  const shortFile = changedFile.replace(/^.*\/(views|src)\//, "$1/");
  console.log(`🔍 Change detected: ${shortFile}`);
  debouncedHMRUpdate(changedFile);
});

eventSource.addEventListener("open", function () {
  console.log("🔌 Live reload connected (HMR enabled)");

  // Cancel any pending HMR updates on reconnect
  debouncedHMRUpdate.cancel();
  isSwapping = false;
});

// HTMX event listener - log swap completion with diff
document.body.addEventListener("htmx:afterSwap", function (e: Event) {
  const event = e as CustomEvent;
  const swapInfo = activeSwaps.get(event.detail.target);

  if (swapInfo) {
    const elapsed = Math.round(performance.now() - swapInfo.start);
    const shortFile = swapInfo.file.replace(/^.*\/(views|src)\//, "$1/");
    const diff = swapInfo.beforeSnapshot
      ? getDiffSummary(swapInfo.beforeSnapshot, event.detail.target)
      : "updated";

    console.log(`⚡ ${shortFile} → ${diff} (${elapsed}ms)`);
    activeSwaps.delete(event.detail.target);
  }

  // Clear swapping flag
  isSwapping = false;
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
