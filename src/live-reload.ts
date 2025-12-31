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
      return "main"; // Default: update main content
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

  // Use HTMX to fetch and swap the fragment
  // Use morph swap to preserve Alpine.js state
  window.htmx.ajax("GET", "/?fragment=main", {
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
