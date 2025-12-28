.PHONY: all clean templ build generate css copy-assets dev

TEMPL := $(shell which templ || echo ~/go/bin/templ)

all: clean templ build generate css copy-assets

clean:
	rm -rf dist && mkdir -p dist

templ:
	$(TEMPL) generate

build:
	go build -o builder ./cmd/builder

generate:
	./builder

css:
	npx tailwindcss -i assets/css/input.css -o dist/styles.css --minify

copy-assets:
	cp -r assets/images/* dist/

dev:
	@echo "Starting development mode..."
	@$(TEMPL) generate --watch &
	@npx tailwindcss -i assets/css/input.css -o dist/styles.css --watch

