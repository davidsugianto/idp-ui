.PHONY: help dev build preview lint test test-watch typecheck install clean docker-up docker-down docker-logs docker-build docker-build-prod

.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Development:"
	@echo "  install          Install dependencies"
	@echo "  dev              Start Vite dev server"
	@echo "  build            Production build"
	@echo "  preview          Preview production build"
	@echo ""
	@echo "Quality:"
	@echo "  lint             Run ESLint"
	@echo "  test             Run tests"
	@echo "  test-watch       Run tests in watch mode"
	@echo "  typecheck        Run TypeScript type checking"
	@echo ""
	@echo "Docker:"
	@echo "  docker-up        Start Docker Compose (dev, port 3089)"
	@echo "  docker-down      Stop Docker Compose"
	@echo "  docker-logs      Tail Docker Compose logs"
	@echo "  docker-build     Build dev Docker image"
	@echo "  docker-build-prod  Build production Docker image"
	@echo ""
	@echo "Other:"
	@echo "  clean            Remove dist and node_modules"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

lint:
	npm run lint

test:
	npm run test

test-watch:
	npm run test:watch

typecheck:
	npm run typecheck

clean:
	rm -rf dist node_modules

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-build:
	docker compose build

docker-build-prod:
	docker build -t idp-ui:latest .