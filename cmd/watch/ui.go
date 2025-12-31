package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"syscall"
	"time"

	bspinner "github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"golang.org/x/sync/errgroup"
)

type buildStartMsg struct {
	kind        buildKind
	changedFile string
}

type buildStepResultMsg struct {
	index    int
	duration time.Duration
	err      error
	output   []byte
}

type buildPhaseResultMsg struct {
	phaseIndex  int
	stepResults []buildStepResultMsg
}

type buildStepMsg struct {
	label    string
	done     bool
	duration time.Duration
}

type model struct {
	spin bspinner.Model

	active      bool
	kind        buildKind
	changedFile string
	start       time.Time
	pending     *buildKind

	steps      []string
	stepStates map[string]buildStepMsg

	lastStatus string
	lastError  []byte
}

func newModel() model {
	sp := bspinner.New()
	sp.Spinner = bspinner.Dot

	return model{
		spin:       sp,
		stepStates: make(map[string]buildStepMsg),
		lastStatus: "ready",
	}
}

func (m model) Init() tea.Cmd {
	return tea.Batch(m.spin.Tick)
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch v := msg.(type) {
	case tea.KeyMsg:
		switch v.Type {
		case tea.KeyCtrlC:
			stopDevServer()
			return m, tea.Quit
		case tea.KeyEsc:
			return m, tea.Quit
		}
	case buildStartMsg:
		if time.Since(lastRebuild) < 500*time.Millisecond {
			return m, nil
		}
		lastRebuild = time.Now()

		if m.active {
			next := v.kind
			if m.pending != nil {
				if *m.pending == buildKindFull || next == buildKindTypeScriptOnly {
					return m, nil
				}
			}
			m.pending = &next
			return m, nil
		}

		m.active = true
		m.kind = v.kind
		m.changedFile = v.changedFile
		m.start = time.Now()
		m.pending = nil
		m.lastError = nil

		steps := buildSteps(v.kind)
		m.steps = m.steps[:0]
		m.stepStates = make(map[string]buildStepMsg)
		for _, s := range steps {
			m.steps = append(m.steps, s.label)
			m.stepStates[s.label] = buildStepMsg{label: s.label, done: false}
		}

		m.lastStatus = "building"
		return m, tea.Batch(m.spin.Tick, runPhaseCmd(v.kind, 0))

	case buildPhaseResultMsg:
		// Update all steps in this phase with their results
		for _, result := range v.stepResults {
			if result.index >= 0 && result.index < len(m.steps) {
				label := m.steps[result.index]
				m.stepStates[label] = buildStepMsg{
					label:    label,
					done:     result.err == nil,
					duration: result.duration,
				}
			}

			if result.err != nil {
				m.active = false
				m.lastStatus = "error"
				m.lastError = result.output
				m.pending = nil
				return m, nil
			}
		}

		// Move to next phase
		nextPhase := v.phaseIndex + 1
		if nextPhase < len(buildPhases(m.kind)) {
			return m, runPhaseCmd(m.kind, nextPhase)
		}

		// All phases complete
		m.active = false
		m.lastStatus = fmt.Sprintf("ready in %dms",
			time.Since(m.start).Milliseconds())
		m.lastError = nil

		log.Printf("[UI] Triggering reload with file: %q\n", m.changedFile)
		triggerReloadWithFile(m.changedFile)

		if m.pending != nil {
			next := *m.pending
			m.pending = nil
			return m, tea.Tick(0, func(time.Time) tea.Msg {
				return buildStartMsg{kind: next}
			})
		}

		return m, nil

	case bspinner.TickMsg:
		var cmd tea.Cmd
		m.spin, cmd = m.spin.Update(v)
		return m, cmd
	}

	return m, nil
}

func stopDevServer() {
	data, err := os.ReadFile(".build/.dev-server-pid")
	if err != nil {
		return
	}

	pidStr := strings.TrimSpace(string(data))
	pid, err := strconv.Atoi(pidStr)
	if err != nil || pid <= 0 {
		return
	}

	_ = syscall.Kill(pid, syscall.SIGTERM)
}

func (m model) View() string {
	pendingStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("8"))
	doneStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("10"))
	runStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("12"))
	errStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("9"))
	dimStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("243"))

	lines := make([]string, 0, len(m.steps)+1)

	// Find the current phase by checking which phase has incomplete steps
	currentPhaseStart := 0
	currentPhaseEnd := 0
	if m.active {
		phases := buildPhases(m.kind)
		offset := 0
		for _, phase := range phases {
			phaseEnd := offset + len(phase.steps)
			hasIncomplete := false
			for i := offset; i < phaseEnd; i++ {
				if !m.stepStates[m.steps[i]].done {
					hasIncomplete = true
					break
				}
			}
			if hasIncomplete {
				currentPhaseStart = offset
				currentPhaseEnd = phaseEnd
				break
			}
			offset = phaseEnd
		}
	}

	for i, step := range m.steps {
		state := m.stepStates[step]
		var icon, line string

		if state.done {
			icon = doneStyle.Render("✓")
			timing := dimStyle.Render(fmt.Sprintf("(%dms)", state.duration.Milliseconds()))
			line = fmt.Sprintf("%s %s %s", icon, step, timing)
		} else {
			// Check if this step is in the current running phase
			isRunning := m.active && i >= currentPhaseStart && i < currentPhaseEnd

			if isRunning {
				icon = m.spin.View()
				line = runStyle.Render(fmt.Sprintf("%s %s", icon, step))
			} else {
				// Not started yet
				icon = pendingStyle.Render("○")
				line = pendingStyle.Render(fmt.Sprintf("%s %s", icon, step))
			}
		}

		lines = append(lines, line)
	}

	// Summary line
	if !m.active && m.lastStatus != "building" {
		if strings.HasPrefix(m.lastStatus, "error") {
			lines = append(lines, errStyle.Render("✗ "+m.lastStatus))
			if len(m.lastError) > 0 {
				lines = append(lines, errStyle.Render(string(m.lastError)))
			}
		} else {
			lines = append(lines, dimStyle.Render(m.lastStatus))
		}
	}

	return strings.Join(lines, "\n")
}

func runPhaseCmd(kind buildKind, phaseIndex int) tea.Cmd {
	return func() tea.Msg {
		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		phases := buildPhases(kind)
		if phaseIndex < 0 || phaseIndex >= len(phases) {
			return buildPhaseResultMsg{phaseIndex: phaseIndex}
		}

		phase := phases[phaseIndex]
		results := make([]buildStepResultMsg, 0, len(phase.steps))

		// Calculate step indices for this phase
		stepOffset := 0
		for i := 0; i < phaseIndex; i++ {
			stepOffset += len(phases[i].steps)
		}

		// Run all steps in this phase in parallel
		g, gctx := errgroup.WithContext(ctx)
		resultsCh := make(chan buildStepResultMsg, len(phase.steps))

		for localIdx, step := range phase.steps {
			localIdx := localIdx
			step := step
			globalIdx := stepOffset + localIdx

			g.Go(func() error {
				stepStart := time.Now()
				out, err := step.run(gctx)

				resultsCh <- buildStepResultMsg{
					index:    globalIdx,
					duration: time.Since(stepStart),
					err:      err,
					output:   out,
				}

				return err
			})
		}

		// Wait for all parallel steps to complete
		err := g.Wait()
		close(resultsCh)

		// Collect results
		for result := range resultsCh {
			results = append(results, result)
		}

		// If any step failed, return early
		if err != nil {
			return buildPhaseResultMsg{
				phaseIndex:  phaseIndex,
				stepResults: results,
			}
		}

		return buildPhaseResultMsg{
			phaseIndex:  phaseIndex,
			stepResults: results,
		}
	}
}
