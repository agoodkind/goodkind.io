package main

import (
	"fmt"
	"net/http"
	"sync"
)

// SSEBroker manages Server-Sent Events connections
type SSEBroker struct {
	clients   map[chan string]bool
	clientsMu sync.Mutex
	broadcast chan string
}

// NewSSEBroker creates a new SSE broker
func NewSSEBroker() *SSEBroker {
	broker := &SSEBroker{
		clients:   make(map[chan string]bool),
		broadcast: make(chan string),
	}
	go broker.run()
	return broker
}

// run listens for broadcast messages and sends them to all clients
func (b *SSEBroker) run() {
	for message := range b.broadcast {
		b.clientsMu.Lock()
		for client := range b.clients {
			select {
			case client <- message:
			default:
				// Client is not responding, close it
				close(client)
				delete(b.clients, client)
			}
		}
		b.clientsMu.Unlock()
	}
}

// SendReload broadcasts a reload event to all connected clients
func (b *SSEBroker) SendReload() {
	select {
	case b.broadcast <- "reload":
	default:
	}
}

// ServeHTTP handles SSE connections
func (b *SSEBroker) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Set SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Create a new client channel
	clientChan := make(chan string)

	// Register the client
	b.clientsMu.Lock()
	b.clients[clientChan] = true
	b.clientsMu.Unlock()

	// Remove client when done
	defer func() {
		b.clientsMu.Lock()
		delete(b.clients, clientChan)
		b.clientsMu.Unlock()
		close(clientChan)
	}()

	// Send initial connection message
	fmt.Fprintf(w, "event: connected\ndata: ok\n\n")
	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}

	// Listen for messages
	for {
		select {
		case message := <-clientChan:
			fmt.Fprintf(w, "event: %s\ndata: %s\n\n", message, message)
			if f, ok := w.(http.Flusher); ok {
				f.Flush()
			}
		case <-r.Context().Done():
			return
		}
	}
}
