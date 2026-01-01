// Command watch runs the dev file watcher and rebuild pipeline.
package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"golang.org/x/sync/errgroup"
)

var lastRebuild time.Time

type buildKind int

const (
	buildKindFull buildKind = iota
	buildKindTypeScriptOnly
)

type buildStep struct {
	label string
	run   func(context.Context) ([]byte, error)
}

func getTemplCmd() string {
	if cmd := os.Getenv("TEMPL_CMD"); cmd != "" {
		return cmd
	}
	if cmd, err := exec.LookPath("templ"); err == nil {
		return cmd
	}
	return filepath.Join(os.Getenv("HOME"), "go", "bin", "templ")
}

func runCmd(ctx context.Context, name string, args ...string) ([]byte, error) {
	cmd := exec.CommandContext(ctx, name, args...)
	return cmd.CombinedOutput()
}

type buildPhase struct {
	steps []buildStep
}

func buildPhases(kind buildKind) []buildPhase {
	switch kind {
	case buildKindTypeScriptOnly:
		return []buildPhase{
			{steps: []buildStep{
				{label: "ts", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "pnpm", "run", "build:js:dev")
				}},
			}},
		}
	default:
		return []buildPhase{
			// Phase 1: Independent tasks (parallel)
			{steps: []buildStep{
				{label: "templ", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, getTemplCmd(), "generate")
				}},
				{label: "css", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "pnpm", "exec", "tailwindcss",
						"-i", "assets/css/input.css",
						"-o", "dist/styles.css",
						"--minify")
				}},
				{label: "ts", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "pnpm", "run", "build:js:dev")
				}},
				{label: "assets", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "cp", "-r", "assets/images/", "dist/")
				}},
			}},
			// Phase 2: Depends on templ
			{steps: []buildStep{
				{label: "go", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "go", "build", "-o", ".build/builder", "./cmd/builder")
				}},
			}},
			// Phase 3: Depends on go
			{steps: []buildStep{
				{label: "html", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "./.build/builder")
				}},
			}},
		}
	}
}

// Flatten phases into steps for UI display
func buildSteps(kind buildKind) []buildStep {
	phases := buildPhases(kind)
	var steps []buildStep
	for _, phase := range phases {
		steps = append(steps, phase.steps...)
	}
	return steps
}

func debugLog(msg string) {
	f, _ := os.OpenFile(".build/watcher-debug.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if f != nil {
		defer f.Close()
		fmt.Fprintf(f, "%s %s\n", time.Now().Format("2006/01/02 15:04:05.000000"), msg)
	}
}

func normalizeChangedFilePath(changedFile string) string {
	if changedFile == "" {
		return ""
	}

	if strings.Contains(changedFile, "/goodkind.io/") {
		parts := strings.Split(changedFile, "/goodkind.io/")
		if len(parts) > 1 {
			return parts[1]
		}
	}

	return changedFile
}

func triggerReloadWithFile(changedFile string) {
	port := "3000"
	if data, err := os.ReadFile(".build/.dev-server-port"); err == nil {
		port = strings.TrimSpace(string(data))
	}

	url := fmt.Sprintf("http://localhost:%s/__reload", port)
	if changedFile != "" {
		relPath := normalizeChangedFilePath(changedFile)
		url = fmt.Sprintf("%s?file=%s", url, relPath)
		debugLog(fmt.Sprintf("[TRIGGER] HMR for: %s (URL: %s)", relPath, url))
	} else {
		debugLog("[TRIGGER] Full reload (no file)")
	}

	// Retry logic for when server is restarting
	for i := 0; i < 10; i++ {
		resp, err := http.Post(url, "text/plain", nil)
		if err == nil {
			defer resp.Body.Close()
			debugLog(fmt.Sprintf("[TRIGGER] Response: %d (attempt %d)", resp.StatusCode, i+1))
			return
		}

		if i < 9 {
			time.Sleep(200 * time.Millisecond)
			debugLog(fmt.Sprintf("[TRIGGER] Retry %d after error: %v", i+1, err))
		} else {
			debugLog(fmt.Sprintf("[TRIGGER] Final error after %d attempts: %v", i+1, err))
		}
	}
}

func runPipeline(ctx context.Context, kind buildKind) error {
	return runPipelineWithFile(ctx, kind, "")
}

func runPipelineWithFile(ctx context.Context, kind buildKind, changedFile string) error {
	debugLog(fmt.Sprintf("[PIPELINE] Starting build: kind=%v file=%s", kind, changedFile))
	phases := buildPhases(kind)
	debugLog(fmt.Sprintf("[PIPELINE] Total phases: %d", len(phases)))

	for phaseIdx, phase := range phases {
		debugLog(fmt.Sprintf("[PIPELINE] Starting phase %d with %d steps", phaseIdx, len(phase.steps)))
		g, gctx := errgroup.WithContext(ctx)

		for _, step := range phase.steps {
			step := step // capture loop variable
			g.Go(func() error {
				debugLog(fmt.Sprintf("[STEP] Starting: %s", step.label))
				output, err := step.run(gctx)
				if err != nil {
					debugLog(fmt.Sprintf("[STEP] FAILED: %s - error: %v - output: %s", step.label, err, string(output)))
				} else {
					debugLog(fmt.Sprintf("[STEP] Complete: %s", step.label))
				}
				return err
			})
		}

		if err := g.Wait(); err != nil {
			debugLog(fmt.Sprintf("[PIPELINE] Phase %d failed: %v", phaseIdx, err))
			return err
		}
		debugLog(fmt.Sprintf("[PIPELINE] Phase %d complete", phaseIdx))
	}

	debugLog(fmt.Sprintf("[PIPELINE] All phases complete for file: %s", changedFile))

	// Wait for dist/index.html to be written (give file system time to flush)
	time.Sleep(100 * time.Millisecond)

	// Don't trigger reload here - caller handles it
	return nil
}
