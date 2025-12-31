package main

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
)

type rebuildRequest struct {
	kind        buildKind
	changedFile string
}

func shouldWatch(path string) bool {
	if strings.HasSuffix(path, "_templ.go") {
		return false
	}

	switch {
	case strings.Contains(path, "/."),
		strings.Contains(path, "/dist/"),
		strings.Contains(path, "/node_modules/"):
		return false
	}

	switch filepath.Ext(path) {
	case ".templ", ".css", ".go", ".ts":
		return true
	default:
		return false
	}
}

func isTypeScriptFile(path string) bool {
	return filepath.Ext(path) == ".ts"
}

func addRecursive(watcher *fsnotify.Watcher, path string) error {
	return filepath.Walk(path, func(walkPath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			name := filepath.Base(walkPath)
			if name == "dist" || name == "node_modules" || strings.HasPrefix(name, ".") {
				return filepath.SkipDir
			}
			_ = watcher.Add(walkPath)
		}

		return nil
	})
}

func watchFiles(ctx context.Context, out chan<- rebuildRequest) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}
	defer watcher.Close()

	watchDirs := []string{"views", "assets/css", "src", "cmd"}
	for _, dir := range watchDirs {
		_ = addRecursive(watcher, dir)
	}

	var debounceTimer *time.Timer
	var debounceMu sync.Mutex

	for {
		select {
		case <-ctx.Done():
			return nil
		case event, ok := <-watcher.Events:
			if !ok {
				return nil
			}

			if event.Op&(fsnotify.Write|fsnotify.Create) == 0 {
				continue
			}

			if !shouldWatch(event.Name) {
				continue
			}

			debounceMu.Lock()
			if debounceTimer != nil {
				debounceTimer.Stop()
			}

			kind := buildKindFull
			if isTypeScriptFile(event.Name) {
				kind = buildKindTypeScriptOnly
			}

			changedFile := event.Name

			debounceTimer = time.AfterFunc(200*time.Millisecond, func() {
				select {
				case out <- rebuildRequest{kind: kind, changedFile: changedFile}:
				case <-ctx.Done():
				default:
				}
			})
			debounceMu.Unlock()

		case err, ok := <-watcher.Errors:
			if !ok {
				return nil
			}
			_ = err
		}
	}
}
