package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port := "3000"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	dir := "dist"

	// Create SSE broker for live reload
	broker := NewSSEBroker()

	// Register routes
	http.HandleFunc("/__livereload", broker.ServeHTTP)        // SSE endpoint
	http.HandleFunc("/__livereload.js", ServeJavaScript)      // JavaScript client
	http.HandleFunc("/__reload", HandleReloadTrigger(broker)) // Manual trigger endpoint

	// Static file server with live reload injection
	fs := http.FileServer(http.Dir(dir))
	http.Handle("/", InjectLiveReload(fs))

	// Server info
	addr := fmt.Sprintf(":%s", port)
	fmt.Println("🚀 Dev Server with Live Reload (SSE)")
	fmt.Printf("   ├─ Serving: %s\n", dir)
	fmt.Printf("   ├─ URL: http://localhost%s\n", addr)
	fmt.Printf("   ├─ SSE endpoint: /__livereload\n")
	fmt.Printf("   └─ Reload trigger: POST /__reload\n")
	fmt.Println("\nPress Ctrl+C to stop")

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
