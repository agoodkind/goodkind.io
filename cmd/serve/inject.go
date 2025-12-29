package main

import (
	"net/http"
	"os"
	"strings"
)

const liveReloadScript = `<script src="/__livereload.js"></script>`

// InjectLiveReload wraps an http.Handler and injects the live reload script
func InjectLiveReload(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only inject for HTML pages
		if r.URL.Path == "/index.html" || r.URL.Path == "/" {
			file, err := os.ReadFile("dist/index.html")
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			html := string(file)
			if len(html) > 0 {
				// Inject before </body>
				injected := injectBeforeTag(html, "</body>", liveReloadScript)

				w.Header().Set("Content-Type", "text/html; charset=utf-8")
				w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
				w.Write([]byte(injected))
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// injectBeforeTag finds the last occurrence of a closing tag and injects content before it
func injectBeforeTag(html, tag, content string) string {
	// Find last occurrence of tag
	idx := strings.LastIndex(html, tag)
	if idx == -1 {
		// Tag not found, append to end
		return html + content
	}
	return html[:idx] + content + html[idx:]
}
