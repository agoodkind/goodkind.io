package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"goodkind.io/views/pages"
)

func main() {
	// Create dist directory
	if err := os.MkdirAll("dist", 0755); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating dist directory: %v\n", err)
		os.Exit(1)
	}

	// Render home page
	indexPath := filepath.Join("dist", "index.html")
	f, err := os.Create(indexPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating %s: %v\n", indexPath, err)
		os.Exit(1)
	}
	defer f.Close()

	ctx := context.Background()
	if err := pages.Home().Render(ctx, f); err != nil {
		fmt.Fprintf(os.Stderr, "Error rendering home page: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("✓ Generated index.html")
	fmt.Println("Build complete!")
}
