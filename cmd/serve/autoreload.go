package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/fsnotify/fsnotify"
)

// WatchForRecompile watches for changes to _templ.go files and triggers restart
func WatchForRecompile() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return
	}
	defer watcher.Close()

	// Watch views directory for _templ.go changes
	watchDirs := []string{"views"}
	for _, dir := range watchDirs {
		filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				watcher.Add(path)
			}
			return nil
		})
	}

	var lastRestart time.Time
	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}

			// Only watch for _templ.go changes
			if event.Op&fsnotify.Write == 0 {
				continue
			}

			matched, _ := filepath.Match("*_templ.go", filepath.Base(event.Name))
			if !matched {
				continue
			}

			// Debounce restarts
			if time.Since(lastRestart) < 500*time.Millisecond {
				continue
			}
			lastRestart = time.Now()

			fmt.Println("🔄 Template code updated, restarting server...")

			// Write restart signal file
			os.WriteFile(".build/.restart-needed", []byte("1"), 0644)

			// Exit cleanly - external supervisor should restart us
			os.Exit(0)

		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			log.Println("Watcher error:", err)
		}
	}
}

