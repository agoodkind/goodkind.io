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

	// Check if this is a fragment request
	fragment := r.URL.Query().Get("fragment")
	if fragment != "" {
		h.renderFragment(w, r, ctx, fragment)
		return
	}

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

func (h *SSRHandler) renderFragment(w http.ResponseWriter, r *http.Request, ctx context.Context, fragment string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")

	// For all fragments (including component-specific ones), render the whole page
	// HTMX will swap only the targeted element on the client side
	// This works because components have IDs matching their names (e.g. id="theme-toggle")
	if err := pages.Home().Render(ctx, w); err != nil {
		fmt.Fprintf(os.Stderr, "Error rendering fragment %s: %v\n", fragment, err)
		http.Error(w, "Error rendering page", http.StatusInternalServerError)
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
