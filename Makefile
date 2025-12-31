.PHONY: all clean install templ build generate css ts copy-assets serve serve-only watch watch-only dev

TEMPL := $(shell which templ || echo ~/go/bin/templ)

all: clean install templ build generate css ts copy-assets

clean:
	@rm -rf dist && mkdir -p dist

install:
	@pnpm install > /dev/null 2>&1 || true

templ:
	@$(TEMPL) generate > /dev/null 2>&1

build:
	@go build -o builder ./cmd/builder

generate: build
	@./builder > /dev/null 2>&1

css: install
	@pnpm exec tailwindcss -i assets/css/input.css -o dist/styles.css --minify > /dev/null 2>&1

ts: install
	@pnpm run build:js > /dev/null 2>&1

copy-assets:
	@cp -r assets/images/* dist/

serve: all serve-only

serve-only:
	@go run ./cmd/serve

watch: watch-only

watch-only:
	@TEMPL_CMD=$(TEMPL) go run ./cmd/watch

dev: all
	@make -j2 serve-only watch-only