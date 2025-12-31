# VSCode Configuration

This directory contains VSCode-specific configuration for the goodkind.io project.

## Launch Configurations

### Individual Configurations

#### Server Configurations
- **Launch Server** - Builds all assets and launches the Go server with debugging
  - Runs preLaunchTask to build assets
  - Listens on port 3000
  - Verbose logging enabled

- **Launch Server (no build)** - Launches the Go server without building assets
  - Useful when assets are already built
  - Faster startup for iterative debugging

#### Watcher Configuration
- **Launch Watcher** - Launches the file watcher for hot reload during development
  - Watches for changes to templates, JS, CSS
  - Automatically rebuilds changed assets

#### Browser Configurations
- **Launch Chrome** - Opens Chrome in debug mode at http://localhost:3000
  - Auto-opens DevTools
  - Uses isolated profile in `.vscode/chrome-debug-profile`
  - Source maps enabled for debugging TypeScript/JavaScript

- **Attach to Chrome** - Attaches to an already-running Chrome instance
  - Chrome must be launched with `--remote-debugging-port=9222`

- **Launch Edge** - Opens Edge in debug mode (alternative to Chrome)
  - Auto-opens DevTools
  - Uses isolated profile in `.vscode/edge-debug-profile`

### Compound Configurations

These launch multiple configurations together:

- **Full Stack (Server + Chrome)** - Complete debugging setup
  - Builds assets
  - Launches Go server
  - Opens Chrome with debugger attached
  - **Recommended for most debugging sessions**

- **Full Stack (Server + Watcher + Chrome)** - Development mode with hot reload
  - Builds assets once
  - Launches Go server
  - Launches watcher for automatic rebuilds
  - Opens Chrome with debugger attached
  - **Recommended for active development**

- **Dev Mode (Server + Watcher)** - Server-side development
  - Launches server and watcher without browser
  - Useful when using external browser

## Tasks

Available tasks (can be run via `Cmd+Shift+P` > "Tasks: Run Task"):

- **build-assets** - Full build (templ, Go builder, CSS, JS, copy assets)
- **build-js** - Build JavaScript/TypeScript only
- **build-css** - Build Tailwind CSS only
- **build-templ** - Generate Go files from templ templates
- **clean** - Remove dist directory
- **watch-js** - Watch and rebuild JS/TS on changes
- **typecheck** - Run TypeScript type checking
- **format** - Format code with Prettier

## Recommended Extensions

The `extensions.json` file recommends these extensions:

- **golang.go** - Go language support
- **a-h.templ** - Templ template syntax highlighting
- **bradlc.vscode-tailwindcss** - Tailwind CSS IntelliSense
- **esbenp.prettier-vscode** - Code formatting
- **msjsdiag.debugger-for-chrome** - Chrome debugging support

## Usage

### Quick Start

1. Press `F5` or select "Full Stack (Server + Chrome)" from the debug menu
2. Chrome will open automatically with the debugger attached
3. Set breakpoints in Go files or TypeScript files and they'll work!

### Development Workflow

1. Start "Full Stack (Server + Watcher + Chrome)"
2. Edit files - changes will rebuild automatically
3. Browser will refresh via live reload
4. Debug both server and client code simultaneously

### Debug Go Server Only

1. Select "Launch Server"
2. Open http://localhost:3000 in your regular browser
3. Set breakpoints in Go code and step through

### Debug Client JavaScript Only

1. Start server manually: `make serve`
2. Select "Launch Chrome"
3. Set breakpoints in TypeScript files (source maps will map to built JS)

## Tips

- The Chrome debug profile is isolated from your regular Chrome, so you can use both simultaneously
- TypeScript source maps are enabled, so you can debug the original TS files
- The watcher is smart and only rebuilds what changed
- Use `Cmd+Shift+D` to open the Run and Debug panel

