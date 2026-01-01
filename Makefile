.PHONY: \
	all \
	build \
	clean \
	copy-assets \
	css \
	dev \
	fmt \
	generate \
	help \
	install \
	serve \
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
		'  watch        run watcher (expects dev server separately)' \
		'  dev          run serve + watch in parallel' \
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
	@$(GO) run ./cmd/serve

watch: watch-only

watch-only:
	@TEMPL_CMD=$(TEMPL) $(GO) run ./cmd/watch

dev: clean install
	@$(MAKE) -j2 serve-only watch-only

fmt:
	@echo "Formatting files..."
	@$(TEMPL) fmt .
	@$(PNPM) run format
