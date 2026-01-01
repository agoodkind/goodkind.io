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

```bash
make dev
```

This starts the dev server and watcher with live reload at `http://localhost:3000`.

**Static Mode (SSG)**

```bash
make serve    # Serves pre-built static files
```

**Legacy Mode (Manual Refresh)**

```bash
make dev-old        # Watches files but requires manual browser refresh
```

The dev server serves the `dist/` folder on port 3000 (configurable via `PORT` env var).

## Output

The `dist/` folder contains deployment-ready static files:

- `index.html` - Main page
- `styles.css` - Minified CSS
- `*.jpeg`, `*.webp`, `*.ico`, `*.png` - Images

## Deployment

### Cloudflare Pages (GitHub Actions)

The site auto-deploys on push via `.github/workflows/deploy.yml`:

1. **Setup**: Go 1.23 + Templ CLI + pnpm
2. **Build**: `make all`
3. **Deploy**: `dist/` → Cloudflare Pages

Required secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Manual Deployment

```bash
make all
wrangler pages deploy dist --project-name=goodkind-io
```

## Component System

### Layouts

- `layouts/base.templ` - HTML5 shell with dark mode support and HTMX

### Components

- `components/section.templ` - Card wrapper (supports `WithPadding`/`WithoutPadding`)
- `components/title.templ` - Heading component (H1/H2)
- `components/link_button.templ` - CTA button
- `components/htmx_example.templ` - HTMX usage examples (optional)

### Pages

- `pages/home.templ` - Main page composing Hero, Information, and Skills sections

## HTMX Integration

HTMX is included via CDN in `layouts/base.templ`. Use it in your components for dynamic interactions:

```go
templ MyButton() {
    <button
        hx-get="/api/data"
        hx-target="#result"
        hx-swap="innerHTML"
        class="btn"
    >
        Load Data
    </button>
    <div id="result"></div>
}
```

See `components/htmx_example.templ` for more patterns.

## Phase 2 Preparation

The architecture includes reserved slots for future interactivity:

- `cmd/wasm/` - TinyGo WASM entry point
- `internal/islands/` - Interactive component logic
- `views/layouts/base.templ` - Contains commented script injection slot

## Tech Stack

- **Go** - Build tool and templating logic
- **Templ** (`a-h/templ`) - Type-safe HTML components
- **HTMX** - High-power tools for HTML (included via CDN)
- **Tailwind CSS v4.1** - Utility-first CSS framework
  - Uses `@import "tailwindcss"` syntax (v4 native)
  - Content sources defined via `@source` directive in CSS
  - Config in `tailwind.config.ts` for additional settings
- **Make** - Build automation
- **SSE Live Reload** - Hot reload development experience using Server-Sent Events
