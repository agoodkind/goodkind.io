# goodkind.io

Static site source and build pipeline for `goodkind.io`.

## Requirements

- Go toolchain
- `templ` CLI (`github.com/a-h/templ/cmd/templ`)
- `pnpm`

## Common commands

```bash
make dev
make all
make serve
```

- `make dev`: dev server + watcher with live reload (default: `http://localhost:3000`)
- `make all`: full rebuild into `dist/`
- `make serve`: serve the already-built `dist/`
- `pnpm install`: runs via `make dev` / `make all` when needed

## Output

Build artifacts are written to `dist/`.

## Deployment

Auto-deploys via GitHub Actions; see `.github/workflows/deploy.yml`.
