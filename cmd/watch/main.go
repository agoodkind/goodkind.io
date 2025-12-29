package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
)

var (
	lastRebuild   time.Time
	debounceTimer *time.Timer
)

func getTemplCmd() string {
	if cmd := os.Getenv("TEMPL_CMD"); cmd != "" {
		return cmd
	}
	if cmd, err := exec.LookPath("templ"); err == nil {
		return cmd
	}
	return filepath.Join(os.Getenv("HOME"), "go", "bin", "templ")
}

func triggerReload() {
	resp, err := http.Post("http://localhost:3000/__reload", "text/plain", nil)
	if err != nil {
		// Server might not be running yet, ignore
		return
	}
	defer resp.Body.Close()
}

func rebuild() {
	// Prevent rapid rebuilds
	if time.Since(lastRebuild) < 500*time.Millisecond {
		return
	}
	lastRebuild = time.Now()

	fmt.Println("🔨 Rebuilding...")

	// Generate templ files
	templCmd := getTemplCmd()
	cmd := exec.Command(templCmd, "generate")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Printf("❌ Templ generation failed: %v\n", err)
		return
	}

	// Build the builder
	cmd = exec.Command("go", "build", "-o", "builder", "./cmd/builder")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Printf("❌ Builder compilation failed: %v\n", err)
		return
	}

	// Run the builder
	cmd = exec.Command("./builder")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Printf("❌ HTML generation failed: %v\n", err)
		return
	}

	// Build CSS
	cmd = exec.Command("pnpm", "exec", "tailwindcss", "-i", "assets/css/input.css", "-o", "dist/styles.css", "--minify")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Printf("❌ CSS build failed: %v\n", err)
		return
	}

	// Copy assets
	cmd = exec.Command("cp", "-r", "assets/images/", "dist/")
	if err := cmd.Run(); err != nil {
		log.Printf("⚠️  Asset copy warning: %v\n", err)
	}

	fmt.Println("✅ Rebuild complete!")

	// Trigger browser reload
	triggerReload()
}

func shouldWatch(path string) bool {
	// Skip generated files
	if strings.HasSuffix(path, "_templ.go") {
		return false
	}

	// Skip hidden directories
	if strings.Contains(path, "/.") {
		return false
	}

	// Skip dist directory
	if strings.Contains(path, "/dist/") {
		return false
	}

	// Skip node_modules
	if strings.Contains(path, "/node_modules/") {
		return false
	}

	// Watch these extensions
	ext := filepath.Ext(path)
	return ext == ".templ" || ext == ".css" || ext == ".go"
}

func addRecursive(watcher *fsnotify.Watcher, path string) error {
	return filepath.Walk(path, func(walkPath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip unwanted directories
		if info.IsDir() {
			name := filepath.Base(walkPath)
			if name == "dist" || name == "node_modules" || strings.HasPrefix(name, ".") {
				return filepath.SkipDir
			}

			if err := watcher.Add(walkPath); err != nil {
				log.Printf("⚠️  Failed to watch %s: %v\n", walkPath, err)
			}
		}

		return nil
	})
}

func watchFiles() error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return fmt.Errorf("failed to create watcher: %w", err)
	}
	defer watcher.Close()

	// Watch directories recursively
	watchDirs := []string{"views", "assets/css", "cmd"}
	for _, dir := range watchDirs {
		if err := addRecursive(watcher, dir); err != nil {
			log.Printf("⚠️  Failed to watch %s: %v\n", dir, err)
		}
	}

	fmt.Println("👀 Watching for file changes...")
	fmt.Println("   ├─ views/**/*.templ")
	fmt.Println("   ├─ assets/css/*.css")
	fmt.Println("   └─ cmd/**/*.go")
	fmt.Println()

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return nil
			}

			// Only care about Write and Create events
			if event.Op&(fsnotify.Write|fsnotify.Create) == 0 {
				continue
			}

			// Check if we should watch this file
			if !shouldWatch(event.Name) {
				continue
			}

			fmt.Printf("📝 Changed: %s\n", event.Name)

			// Debounce: wait for more changes before rebuilding
			if debounceTimer != nil {
				debounceTimer.Stop()
			}
			debounceTimer = time.AfterFunc(200*time.Millisecond, rebuild)

		case err, ok := <-watcher.Errors:
			if !ok {
				return nil
			}
			log.Println("❌ Watcher error:", err)
		}
	}
}

func main() {
	fmt.Println("🔥 Hot Reload Watcher (fsnotify)")
	fmt.Println()

	// Initial build
	rebuild()

	// Watch for changes
	if err := watchFiles(); err != nil {
		log.Fatal(err)
	}
}
