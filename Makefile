.PHONY: all clean install templ build generate css copy-assets serve serve-only watch watch-only dev

TEMPL := $(shell which templ || echo ~/go/bin/templ)

all: clean install templ build generate css copy-assets

clean:
	rm -rf dist && mkdir -p dist

install:
	pnpm install

templ:
	$(TEMPL) generate

build:
	go build -o builder ./cmd/builder

generate: build
	./builder

css: install
	pnpm exec tailwindcss -i assets/css/input.css -o dist/styles.css --minify

copy-assets:
	cp -r assets/images/* dist/

serve: all serve-only

serve-only:
	@echo "🚀 Starting dev server with live reload..."
	@go run ./cmd/serve

watch: watch-only

watch-only:
	@echo "👀 Starting file watcher..."
	@TEMPL_CMD=$(TEMPL) go run ./cmd/watch

dev: all
	@echo "🔥 Hot Reload Development Mode"
	@echo ""
	@echo "This will start TWO processes:"
	@echo "  1. Dev server with live reload (port 3000)"
	@echo "  2. File watcher that auto-rebuilds on changes"
	@echo ""
	@echo "Open http://localhost:3000 in your browser"
	@echo "Press Ctrl+C to stop both processes"
	@echo ""
	@make -j2 serve-only watch-only