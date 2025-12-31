package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

func findAvailablePort(start int) (int, error) {
	for port := start; port < start+100; port++ {
		addr := fmt.Sprintf(":%d", port)
		ln, err := net.Listen("tcp", addr)
		if err == nil {
			ln.Close()
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available ports found")
}

func main() {
	preferredPort := 3000
	if p := os.Getenv("PORT"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil {
			preferredPort = parsed
		}
	}

	port, err := findAvailablePort(preferredPort)
	if err != nil {
		log.Fatal(err)
	}

	dir := "dist"
	devSSR := os.Getenv("DEV_SSR") == "true"

	// Create SSE broker for live reload
	broker := NewSSEBroker()

	// Register routes
	http.HandleFunc("/__livereload", broker.ServeHTTP)
	http.HandleFunc("/__livereload.js", ServeJavaScript)
	http.HandleFunc("/__reload", HandleReloadTrigger(broker))

	// Choose handler based on mode
	fs := http.FileServer(http.Dir(dir))
	var handler http.Handler
	if devSSR {
		fmt.Println("🔥 SSR mode enabled (dynamic template rendering)")
		handler = InjectLiveReload(NewSSRHandler(fs))
	} else {
		handler = InjectLiveReload(fs)
	}
	http.Handle("/", handler)

	// Server info
	addr := fmt.Sprintf(":%d", port)
	if port != preferredPort {
		fmt.Printf("🚀 Server: http://localhost:%d (port %d was busy)\n", port, preferredPort)
	} else {
		fmt.Printf("🚀 Server: http://localhost:%d\n", port)
	}

	// Write port to file for watcher
	if err := os.MkdirAll(".build", 0755); err != nil {
		log.Printf("Warning: could not create .build directory: %v", err)
	}
	portFile := ".build/.dev-server-port"
	if err := os.WriteFile(portFile, []byte(fmt.Sprintf("%d", port)), 0644); err != nil {
		log.Printf("Warning: could not write port file: %v", err)
	}
	defer os.Remove(portFile)

	pidFile := ".build/.dev-server-pid"
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
