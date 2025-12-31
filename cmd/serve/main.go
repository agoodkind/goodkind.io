package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
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

	// Write port to file for watcher
	portFile := "dist/.dev-server-port"
	if err := os.WriteFile(portFile, []byte(port), 0644); err != nil {
		log.Printf("Warning: could not write port file: %v", err)
	}
	defer os.Remove(portFile)

	pidFile := "dist/.dev-server-pid"
	if err := os.WriteFile(
		pidFile,
		[]byte(fmt.Sprintf("%d", os.Getpid())),
		0644,
	); err != nil {
		log.Printf("Warning: could not write pid file: %v", err)
	}
	defer os.Remove(pidFile)

	// Create server with graceful shutdown
	srv := &http.Server{Addr: addr}

	fmt.Printf("🚀 Server: http://localhost:%s\n", port)

	// Handle Ctrl+C gracefully
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-sigCh
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := srv.Shutdown(ctx); err != nil {
			log.Printf("Server shutdown error: %v", err)
		}
	}()

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
