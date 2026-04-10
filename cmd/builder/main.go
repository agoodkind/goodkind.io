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

	// Generate Go vanity import pages
	if err := generateVanityPage("agent-gate", "https://github.com/agoodkind/agent-gate"); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating vanity page: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Build complete!")
}

// generateVanityPage writes dist/<pkg>/index.html with the go-import meta tag
// needed for `go install goodkind.io/<pkg>@latest` to resolve to GitHub.
func generateVanityPage(pkg, repoURL string) error {
	dir := filepath.Join("dist", pkg)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	content := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="go-import" content="goodkind.io/%s git %s">
<meta http-equiv="refresh" content="0; url=%s">
</head>
<body>
Redirecting to <a href="%s">%s</a>
</body>
</html>
`, pkg, repoURL, repoURL, repoURL, repoURL)
	path := filepath.Join(dir, "index.html")
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		return err
	}
	fmt.Printf("✓ Generated %s/index.html\n", pkg)
	return nil
}
