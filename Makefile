.PHONY: all clean install templ build generate css ts copy-assets serve serve-only watch watch-only dev

TEMPL := $(shell which templ || echo ~/go/bin/templ)

all: clean install templ build generate css ts copy-assets

clean:
	@rm -rf dist && mkdir -p dist

install:
	@pnpm install

templ:
	@$(TEMPL) generate > /dev/null 2>&1

build:
	@mkdir -p .build
	@go build -o .build/builder ./cmd/builder

generate: build
	@./.build/builder > /dev/null 2>&1

css: install
	@pnpm exec tailwindcss -i assets/css/input.css -o dist/styles.css --minify

ts: install
	@pnpm run build:js > /dev/null 2>&1

copy-assets:
	@mkdir -p dist/images
	@cp -r assets/images/* dist/images/

serve: all serve-only

serve-only:
	@go run ./cmd/serve

watch: watch-only

watch-only:
	@TEMPL_CMD=$(TEMPL) go run ./cmd/watch

dev: clean install
	@echo "Starting development server..."
	@make -j2 serve-only watch-only
