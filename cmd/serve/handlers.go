package main

import (
	"net/http"
	"os"
)

// ServeJavaScript serves the live reload JavaScript file
func ServeJavaScript(w http.ResponseWriter, r *http.Request) {
	script, err := os.ReadFile("cmd/serve/livereload.js")
	if err != nil {
		http.Error(w, "Script not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/javascript")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Write(script)
}

// HandleReloadTrigger handles manual reload triggers (POST /__reload)
func HandleReloadTrigger(broker *SSEBroker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		broker.SendReload()
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}
}

