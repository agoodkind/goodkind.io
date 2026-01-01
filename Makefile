.PHONY: \
	all \
	build \
	clean \
	copy-assets \
	css \
	dev \
	dev-clean \
	fmt \
	generate \
	help \
	install \
	serve \
	serve-build \
	serve-only \
	templ \
	ts \
	watch \
	watch-only

PNPM ?= pnpm
GO ?= go
DIST_DIR ?= dist
BUILD_DIR ?= .build
ASSETS_DIR ?= assets

TEMPL ?= $(shell command -v templ 2>/dev/null || printf '%s\n' "$$HOME/go/bin/templ")

all: clean install templ build generate css ts copy-assets

help:
	@printf '%s\n' \
		'Targets:' \
		'  all          clean install templ build generate css ts copy-assets' \
		'  clean        reset $(DIST_DIR)/' \
		'  install      pnpm install' \
		'  templ        generate Go from .templ' \
		'  build        build $(BUILD_DIR)/builder' \
		'  generate     run $(BUILD_DIR)/builder' \
		'  css          build Tailwind CSS' \
		'  ts           build JS bundle' \
		'  copy-assets  copy images/favicon into $(DIST_DIR)/' \
		'  serve        all + run dev server' \
		'  serve-build  build $(BUILD_DIR)/serve' \
		'  watch        run watcher (expects dev server separately)' \
		'  dev          run serve + watch (graceful shutdown)' \
		'  dev-clean    stop dev server from $(BUILD_DIR)/.dev-server-pid' \
		'  fmt          format templ + prettier'

clean:
	@rm -rf $(DIST_DIR) && mkdir -p $(DIST_DIR)

install:
	@$(PNPM) install

templ:
	@$(TEMPL) generate > /dev/null 2>&1

build:
	@mkdir -p $(BUILD_DIR)
	@$(GO) build -o $(BUILD_DIR)/builder ./cmd/builder

generate: build
	@./$(BUILD_DIR)/builder > /dev/null 2>&1

css: install
	@$(PNPM) exec tailwindcss \
		-i $(ASSETS_DIR)/css/input.css \
		-o $(DIST_DIR)/styles.css \
		--minify

ts: install
	@$(PNPM) run build:js > /dev/null 2>&1

copy-assets:
	@mkdir -p $(DIST_DIR)/images
	@cp -r $(ASSETS_DIR)/images/* $(DIST_DIR)/images/
	@cp -f $(ASSETS_DIR)/images/favicon.ico $(DIST_DIR)/favicon.ico

serve: all serve-only

serve-only:
	@$(MAKE) serve-build
	@./$(BUILD_DIR)/serve; status=$$?; \
	if [ $$status -eq 130 ] || [ $$status -eq 2 ]; then exit 0; fi; \
	exit $$status

serve-build:
	@mkdir -p $(BUILD_DIR)
	@$(GO) build -o $(BUILD_DIR)/serve ./cmd/serve

watch: watch-only

watch-only:
	@TEMPL_CMD=$(TEMPL) $(GO) run ./cmd/watch

dev: clean install
	@$(MAKE) -j2 serve-only watch-only

dev-clean:
	@printf 'Stopping orphaned dev servers...\n'
	@pkill -TERM -f '\.build/serve' 2>/dev/null || true
	@pkill -TERM -f 'go run ./cmd/serve' 2>/dev/null || true
	@pkill -TERM -f 'go run ./cmd/watch' 2>/dev/null || true
	@sleep 1
	@printf 'Cleanup complete.\n'

fmt:
	@echo "Formatting files..."
	@$(TEMPL) fmt .
	@$(PNPM) run format
