package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)

	for {
		fmt.Println("🚀 Starting server...")
		cmd := exec.Command("./.build/serve")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Env = os.Environ()

		if err := cmd.Start(); err != nil {
			log.Fatal(err)
		}

		// Wait for either process exit or signal
		done := make(chan error, 1)
		go func() {
			done <- cmd.Wait()
		}()

		select {
		case <-sigCh:
			// User killed supervisor - kill server and exit
			cmd.Process.Kill()
			return
		case err := <-done:
			if err != nil {
				fmt.Printf("❌ Server exited with error: %v\n", err)
				return
			}
			// Server exited cleanly - restart it
			fmt.Println("🔄 Server exited, restarting...")
			time.Sleep(500 * time.Millisecond)
		}
	}
}
