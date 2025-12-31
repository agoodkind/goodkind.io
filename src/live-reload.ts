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

// Extract component name from file path
// e.g. "views/components/theme_toggle.templ" -> "theme-toggle"
function getComponentName(filePath: string): string | null {
  const match = filePath.match(/views\/components\/(.+)\.templ$/);
  if (!match) return null;
  return match[1].replace(/_/g, "-");
}

// Map file patterns to target elements for HMR
function getUpdateTarget(changedFile: string): string | null {
  switch (true) {
    case changedFile.includes("views/pages/"):
      return "body";
    case changedFile.includes("views/components/"): {
      const componentName = getComponentName(changedFile);
      return componentName ?? "main";
    }
    case changedFile.includes(".css"):
      return null; // CSS reloads automatically
    case changedFile.includes(".js"):
      return null; // JS requires full reload
    default:
      return "main";
  }
}

// Get fragment parameter for server request
function getFragmentParam(target: string): string {
  if (target.startsWith("#")) {
    return target.substring(1); // Remove # for component name
  }
  return target; // body or main
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
  const fragment = getFragmentParam(target);
  window.htmx.ajax("GET", `/?fragment=${fragment}`, {
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
