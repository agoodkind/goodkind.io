package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime/debug"
	"sync"
)

type sseClient struct {
	ch        chan string
	closeOnce sync.Once
}

func newSSEClient() *sseClient {
	return &sseClient{ch: make(chan string)}
}

func (c *sseClient) close() {
	c.closeOnce.Do(func() {
		close(c.ch)
	})
}

// SSEBroker manages Server-Sent Events connections
type SSEBroker struct {
	clients   map[*sseClient]bool
	clientsMu sync.Mutex
	broadcast chan string
}

// NewSSEBroker creates a new SSE broker
func NewSSEBroker() *SSEBroker {
	broker := &SSEBroker{
		clients:   make(map[*sseClient]bool),
		broadcast: make(chan string),
	}
	go broker.run()
	return broker
}

// run listens for broadcast messages and sends them to all clients
func (b *SSEBroker) run() {
	defer func() {
		if rec := recover(); rec != nil {
			log.Printf("panic in SSE broker: %v\n%s", rec, debug.Stack())
		}
	}()

	for message := range b.broadcast {
		b.clientsMu.Lock()
		for client := range b.clients {
			select {
			case client.ch <- message:
			default:
				// Client is not responding, close it
				client.close()
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
	defer func() {
		if rec := recover(); rec != nil {
			log.Printf("panic in SSE handler: %v\n%s", rec, debug.Stack())
		}
	}()

	// Set SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Create a new client channel
	client := newSSEClient()

	// Register the client
	b.clientsMu.Lock()
	b.clients[client] = true
	b.clientsMu.Unlock()

	// Remove client when done
	defer func() {
		b.clientsMu.Lock()
		delete(b.clients, client)
		b.clientsMu.Unlock()
		client.close()
	}()

	// Send initial connection message
	_, _ = fmt.Fprintf(w, "event: connected\ndata: ok\n\n")
	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}

	// Listen for messages
	for {
		select {
		case message, ok := <-client.ch:
			if !ok {
				return
			}

			if _, err := fmt.Fprintf(
				w,
				"event: %s\ndata: %s\n\n",
				message,
				message,
			); err != nil {
				return
			}
			if f, ok := w.(http.Flusher); ok {
				f.Flush()
			}
		case <-r.Context().Done():
			return
		}
	}
}
