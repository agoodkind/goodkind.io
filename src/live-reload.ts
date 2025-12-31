/**
 * Live Reload Client
 * Connects to the dev server via Server-Sent Events (SSE)
 */

const eventSource = new EventSource("/__livereload");

eventSource.addEventListener("reload", function () {
  console.log("🔄 Files changed, reloading...");
  window.location.reload();
});

eventSource.addEventListener("open", function () {
  console.log("🔌 Live reload connected");
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
