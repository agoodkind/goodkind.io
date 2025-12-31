package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
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

	// Create SSE broker for live reload
	broker := NewSSEBroker()

	// Register routes
	http.HandleFunc("/__livereload", broker.ServeHTTP)
	http.HandleFunc("/__livereload.js", ServeJavaScript)
	http.HandleFunc("/__reload", HandleReloadTrigger(broker))

	// Static file server with live reload injection
	fs := http.FileServer(http.Dir(dir))
	http.Handle("/", InjectLiveReload(fs))

	// Server info
	addr := fmt.Sprintf(":%d", port)
	if port != preferredPort {
		fmt.Printf("🚀 Server: http://localhost:%d (port %d was busy)\n", port, preferredPort)
	} else {
		fmt.Printf("🚀 Server: http://localhost:%d\n", port)
	}

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
