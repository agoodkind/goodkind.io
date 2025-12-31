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
	buildKindSSR
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
	case buildKindSSR:
		// SSR mode: skip builder, templates render dynamically
		return []buildPhase{
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

func triggerReloadWithFile(changedFile string) {
	port := "3000"
	if data, err := os.ReadFile(".build/.dev-server-port"); err == nil {
		port = strings.TrimSpace(string(data))
	}

	url := fmt.Sprintf("http://localhost:%s/__reload", port)
	if changedFile != "" {
		// Normalize file path to relative path
		relPath := changedFile
		if strings.Contains(changedFile, "/goodkind.io/") {
			parts := strings.Split(changedFile, "/goodkind.io/")
			if len(parts) > 1 {
				relPath = parts[1]
			}
		}
		url = fmt.Sprintf("%s?file=%s", url, relPath)
		fmt.Printf("[DEBUG] Triggering HMR for: %s\n", relPath)
	}

	resp, err := http.Post(url, "text/plain", nil)
	if err != nil {
		return
	}
	defer resp.Body.Close()
}

func runPipeline(ctx context.Context, kind buildKind) error {
	return runPipelineWithFile(ctx, kind, "")
}

func runPipelineWithFile(ctx context.Context, kind buildKind, changedFile string) error {
	phases := buildPhases(kind)

	for _, phase := range phases {
		g, gctx := errgroup.WithContext(ctx)

		for _, step := range phase.steps {
			step := step // capture loop variable
			g.Go(func() error {
				_, err := step.run(gctx)
				return err
			})
		}

		if err := g.Wait(); err != nil {
			return err
		}
	}

	triggerReloadWithFile(changedFile)
	return nil
}
