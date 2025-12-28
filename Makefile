.PHONY: all clean templ build generate css copy-assets serve dev

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

serve:
	@echo "Starting dev server..."
	@go run cmd/serve/main.go

dev:
	@echo "Starting development mode..."
	@echo "Run 'make serve' in another terminal to start the dev server"
	@$(TEMPL) generate --watch &
	@npx tailwindcss -i assets/css/input.css -o dist/styles.css --watch

