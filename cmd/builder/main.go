package main

import (
	"context"
	_ "embed"
	"fmt"
	"os"
	"path/filepath"
	"text/template"

	"goodkind.io/views/pages"
)

//go:embed templates/vanity.html
var vanityTmpl string

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

	if err := generateVanityPage("agent-gate", "https://github.com/agoodkind/agent-gate"); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating vanity page: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Build complete!")
}

// generateVanityPage writes dist/<pkg>/index.html from assets/vanity.html,
// enabling `go install goodkind.io/<pkg>@latest` to resolve to GitHub.
func generateVanityPage(pkg, repoURL string) error {
	dir := filepath.Join("dist", pkg)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	tmpl, err := template.New("vanity").Parse(vanityTmpl)
	if err != nil {
		return err
	}

	path := filepath.Join(dir, "index.html")
	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()

	if err := tmpl.Execute(out, struct{ Pkg, RepoURL string }{pkg, repoURL}); err != nil {
		return err
	}

	fmt.Printf("✓ Generated %s/index.html\n", pkg)
	return nil
}
