package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"goodkind.io/views/pages"
)

// SSRHandler renders templates dynamically in dev mode
type SSRHandler struct {
	staticFS http.Handler
}

func NewSSRHandler(staticFS http.Handler) *SSRHandler {
	return &SSRHandler{staticFS: staticFS}
}

func (h *SSRHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Serve static assets directly
	if isStaticAsset(r.URL.Path) {
		h.staticFS.ServeHTTP(w, r)
		return
	}

	// Render pages dynamically
	ctx := context.Background()

	switch r.URL.Path {
	case "/", "/index.html":
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		if err := pages.Home().Render(ctx, w); err != nil {
			fmt.Fprintf(os.Stderr, "Error rendering page: %v\n", err)
			http.Error(w, "Error rendering page", http.StatusInternalServerError)
			return
		}
	default:
		http.NotFound(w, r)
	}
}

func isStaticAsset(path string) bool {
	staticExtensions := []string{
		".js", ".css", ".webp", ".jpeg", ".jpg", ".png", ".gif",
		".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot",
	}

	for _, ext := range staticExtensions {
		if len(path) >= len(ext) && path[len(path)-len(ext):] == ext {
			return true
		}
	}

	return false
}
