# Go SSG - goodkind.io

A Go-based Static Site Generator using Templ and Tailwind CSS v3.

## Architecture

This is **Phase 1** of a two-phase architecture:

- **Phase 1 (Current)**: Pure static HTML generation with Go + Templ + Tailwind CSS
- **Phase 2 (Future)**: Adding "Islands of Interactivity" with Alpine.js + TinyGo WASM

The folder structure is designed to accommodate Phase 2 without refactoring.

## Project Structure

```
├── cmd/
│   ├── builder/          # SSG executable
│   └── wasm/             # [Reserved for Phase 2]
├── internal/
│   └── islands/          # [Reserved for Phase 2]
├── views/
│   ├── layouts/          # Base HTML shells
│   ├── components/       # Reusable UI components
│   └── pages/            # Page content
├── assets/
│   ├── css/              # Tailwind source
│   └── images/           # Static assets
└── dist/                 # Build output (git-ignored)
```

## Prerequisites

```bash
# Install Go (if not already installed)
brew install go

# Install Templ CLI
go install github.com/a-h/templ/cmd/templ@latest

# Install Node.js dependencies (Tailwind CSS)
pnpm install
```

## Build Commands

### Full Build

```bash
make all
```

This runs the complete pipeline:

1. Cleans `dist/`
2. Generates Go code from `.templ` files
3. Compiles the builder
4. Generates HTML
5. Compiles CSS
6. Copies assets

### Individual Steps

```bash
make clean          # Clean output directory
make templ          # Generate Go from Templ
make build          # Build the SSG executable
make generate       # Run builder to create HTML
make css            # Compile Tailwind CSS
make copy-assets    # Copy images to dist/
```

### Development Mode

**Option 1: Two terminals (recommended)**

Terminal 1 - Start the dev server:
```bash
make serve
# Server runs at http://localhost:3000
```

Terminal 2 - Watch for changes:
```bash
make dev
# Rebuilds on .templ and CSS changes
```

**Option 2: Manual workflow**

```bash
# Make changes to .templ or CSS files
make all          # Rebuild
# Refresh browser
```

The dev server serves the `dist/` folder on port 3000 (configurable via `PORT` env var).

## Output

The `dist/` folder contains deployment-ready static files:

- `index.html` - Main page
- `styles.css` - Minified CSS
- `*.jpeg`, `*.webp`, `*.ico`, `*.png` - Images

## Deployment

### Cloudflare Pages

1. Build command: `make all`
2. Output directory: `dist`

The site is configured for Cloudflare Pages deployment.

## Component System

### Layouts

- `layouts/base.templ` - HTML5 shell with dark mode support

### Components

- `components/section.templ` - Card wrapper (supports `WithPadding`/`WithoutPadding`)
- `components/title.templ` - Heading component (H1/H2)
- `components/link_button.templ` - CTA button

### Pages

- `pages/home.templ` - Main page composing Hero, Information, and Skills sections

## Phase 2 Preparation

The architecture includes reserved slots for future interactivity:

- `cmd/wasm/` - TinyGo WASM entry point
- `internal/islands/` - Interactive component logic
- `views/layouts/base.templ` - Contains commented script injection slot

## Tech Stack

- **Go** - Build tool and templating logic
- **Templ** (`a-h/templ`) - Type-safe HTML components
- **Tailwind CSS v4.1** - Utility-first CSS framework
  - Uses `@import "tailwindcss"` syntax (v4 native)
  - Content sources defined via `@source` directive in CSS
  - Config in `tailwind.config.ts` for additional settings
- **Make** - Build automation
