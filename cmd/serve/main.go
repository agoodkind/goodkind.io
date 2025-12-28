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
	fs := http.FileServer(http.Dir(dir))

	http.Handle("/", fs)

	addr := fmt.Sprintf(":%s", port)
	fmt.Printf("🚀 Serving %s on http://localhost%s\n", dir, addr)
	fmt.Println("Press Ctrl+C to stop")

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
