package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"golang.org/x/term"
)

func main() {
	time.Sleep(100 * time.Millisecond)

	// Setup debug logging to file
	logFile, _ := os.OpenFile(".build/watcher-debug.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if logFile != nil {
		defer logFile.Close()
		log.SetOutput(logFile)
		log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds)
	}

	appCtx, cancelApp := context.WithCancel(context.Background())
	defer cancelApp()

	// Determine build mode
	initialBuildKind := buildKindFull
	if os.Getenv("DEV_SSR") == "true" {
		initialBuildKind = buildKindSSR
	}

	rebuildRequests := make(chan rebuildRequest, 1)

	// Bubble Tea requires a TTY. Fallback for CI/piping/timeout.
	if !term.IsTerminal(int(os.Stdout.Fd())) {
		// Handle Ctrl+C gracefully in non-TTY mode
		signalCh := make(chan os.Signal, 1)
		signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)
		go func() {
			<-signalCh
			cancelApp()
		}()

		_ = runPipeline(appCtx, initialBuildKind)

		go func() {
			_ = watchFiles(appCtx, rebuildRequests)
		}()

		for {
			select {
			case <-appCtx.Done():
				return
			case req := <-rebuildRequests:
				if err := runPipelineWithFile(appCtx, req.kind, req.changedFile); err == nil {
					triggerReloadWithFile(req.changedFile)
				}
			}
		}
	}

	uiModel := newModel()
	program := tea.NewProgram(uiModel)

	// Handle Ctrl+C gracefully - let Bubble Tea handle it
	go func() {
		signalCh := make(chan os.Signal, 1)
		signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)
		<-signalCh
		program.Send(tea.KeyMsg{Type: tea.KeyCtrlC})
	}()

	go func() {
		if err := watchFiles(appCtx, rebuildRequests); err != nil {
			cancelApp()
		}
	}()

	go func() {
		program.Send(buildStartMsg{kind: initialBuildKind, changedFile: ""})
		for {
			select {
			case <-appCtx.Done():
				return
			case req := <-rebuildRequests:
				program.Send(buildStartMsg(req))
			}
		}
	}()

	if _, err := program.Run(); err != nil {
		os.Exit(1)
	}
}
