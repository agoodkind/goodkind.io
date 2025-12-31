package main

import (
	"path/filepath"
	"strings"
)

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
