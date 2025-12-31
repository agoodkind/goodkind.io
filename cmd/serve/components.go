package main

import (
	"context"
	"io"
	"path/filepath"
	"strings"

	"goodkind.io/views/components"
)

// ComponentRenderer is a function that renders a component
type ComponentRenderer func(context.Context, io.Writer) error

// componentRegistry maps component names to their renderers
var componentRegistry = map[string]ComponentRenderer{
	"theme-toggle": func(ctx context.Context, w io.Writer) error {
		return components.ThemeToggle().Render(ctx, w)
	},
	"section": func(ctx context.Context, w io.Writer) error {
		// Section requires props, so we can't render it standalone
		// Fall back to main content
		return nil
	},
}

// getComponentFromFile extracts component name from file path
// e.g. "views/components/theme_toggle.templ" -> "theme-toggle"
func getComponentFromFile(filePath string) string {
	base := filepath.Base(filePath)
	name := strings.TrimSuffix(base, ".templ")
	// Convert snake_case to kebab-case
	name = strings.ReplaceAll(name, "_", "-")
	return name
}

// getComponentTarget returns the CSS selector for a component
// e.g. "theme-toggle" -> "#theme-toggle"
func getComponentTarget(componentName string) string {
	return "#" + componentName
}
