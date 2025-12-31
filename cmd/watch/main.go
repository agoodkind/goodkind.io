package main

import (
	"context"
	"os"
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"golang.org/x/term"
)

func main() {
	time.Sleep(100 * time.Millisecond)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	reqCh := make(chan rebuildRequest, 1)

	// Bubble Tea requires a TTY. Fallback for CI/piping/timeout.
	if !term.IsTerminal(int(os.Stdout.Fd())) {
		_ = runPipeline(ctx, buildKindFull)

		go func() {
			_ = watchFiles(ctx, reqCh)
		}()

		for {
			select {
			case <-ctx.Done():
				return
			case req := <-reqCh:
				_ = runPipeline(ctx, req.kind)
			}
		}
	}

	m := newModel()
	p := tea.NewProgram(m)

	go func() {
		if err := watchFiles(ctx, reqCh); err != nil {
			cancel()
		}
	}()

	go func() {
		p.Send(buildStartMsg{kind: buildKindFull})
		for {
			select {
			case <-ctx.Done():
				return
			case req := <-reqCh:
				p.Send(buildStartMsg{kind: req.kind})
			}
		}
	}()

	if _, err := p.Run(); err != nil {
		os.Exit(1)
	}
}
