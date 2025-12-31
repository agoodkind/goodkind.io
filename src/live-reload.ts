/**
 * Live Reload Client with HMR
 * Connects to the dev server via Server-Sent Events (SSE)
 * Uses HTMX for partial page updates
 */

export {};

declare global {
  interface Window {
    htmx?: {
      ajax: (
        method: string,
        url: string,
        options: { target: string; swap: string }
      ) => void;
    };
  }
}

const eventSource = new EventSource("/__livereload");

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

  console.log("🔥 HMR update:", changedFile, "→", target);

  const targetElement = document.querySelector(target);
  if (!targetElement || !window.htmx) {
    console.log("⚠️  HTMX not available, falling back to full reload");
    window.location.reload();
    return;
  }

  // Use HTMX to fetch and swap the target
  // Morph swap intelligently diffs and updates only what changed
  window.htmx.ajax("GET", "/", {
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

// HTMX event listeners for detailed logging
document.body.addEventListener("htmx:beforeSwap", function (e: Event) {
  const event = e as CustomEvent;
  console.log("🔄 HTMX beforeSwap:", {
    target: event.detail.target,
    swapStyle: event.detail.swapStyle,
  });
});

document.body.addEventListener("htmx:afterSwap", function (e: Event) {
  const event = e as CustomEvent;
  console.log("✅ HTMX afterSwap:", {
    target: event.detail.target,
    elapsed: event.detail.requestConfig?.timeout || "N/A",
  });
});

document.body.addEventListener("htmx:beforeOnLoad", function (e: Event) {
  const event = e as CustomEvent;
  const start = performance.now();
  event.detail.swapStartTime = start;
  console.log("⏱️  Swap started");
});

document.body.addEventListener("htmx:afterOnLoad", function (e: Event) {
  const event = e as CustomEvent;
  const start = event.detail.swapStartTime;
  if (start) {
    const elapsed = Math.round(performance.now() - start);
    console.log(`⚡ Swap completed in ${elapsed}ms`);
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
