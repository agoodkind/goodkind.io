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
					return runCmd(ctx, "pnpm", "dlx", "@tailwindcss/cli",
						"-i", "assets/css/input.css",
						"-o", "dist/styles.css",
						"--minify")
				}},
				{label: "ts", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "pnpm", "run", "build:js:dev")
				}},
				{label: "assets", run: func(ctx context.Context) ([]byte, error) {
					runCmd(ctx, "cp", "-r", "assets/images/", "dist/")
					return nil, nil
				}},
			}},
			// Phase 2: Depends on templ
			{steps: []buildStep{
				{label: "go", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "go", "build", "-o", "builder", "./cmd/builder")
				}},
			}},
			// Phase 3: Depends on go
			{steps: []buildStep{
				{label: "html", run: func(ctx context.Context) ([]byte, error) {
					return runCmd(ctx, "./builder")
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

func triggerReload() {
	port := "3000"
	if data, err := os.ReadFile(".dev-server-port"); err == nil {
		port = strings.TrimSpace(string(data))
	}

	url := fmt.Sprintf("http://localhost:%s/__reload", port)
	resp, err := http.Post(url, "text/plain", nil)
	if err != nil {
		return
	}
	defer resp.Body.Close()
}

func runPipeline(ctx context.Context, kind buildKind) error {
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

	triggerReload()
	return nil
}
