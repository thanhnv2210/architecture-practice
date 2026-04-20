# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ArchDoc AI Viewer** — a static-first web application for viewing, rendering, and AI-enhancing architecture documents (Markdown + PlantUML). Currently in the planning/brainstorming phase — no application code exists yet.

## Planned Tech Stack

- **Frontend**: Vanilla JS or React (TBD)
- **Markdown rendering**: markdown-it or marked.js
- **PlantUML rendering**: public PlantUML server (initial), local server later
- **AI**: Local LLM via [Ollama](https://ollama.ai) (no external API)
- **Future backend**: Spring WebFlux + PostgreSQL + R2DBC

## Project Structure

```
/                          # repo root = arch-doc-viewer project
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── FileExplorer.jsx
│   │   ├── MarkdownViewer.jsx
│   │   └── aiPanel.jsx        # planned
│   ├── services/
│   │   ├── fileService.js     # fetches /docs/index.json and document files
│   │   ├── renderService.js   # planned
│   │   └── aiService.js       # planned — calls local Ollama HTTP API
│   └── styles/
│       └── main.css
└── public/
    └── docs/                  # architecture documents (served at /docs/)
        ├── index.json         # document registry — source of truth for file explorer
        └── *.md / *.puml
```

## Architecture Principles

**Adapter-based service layer** — even in the frontend, logic is split into `fileService`, `renderService`, and `aiService`. This makes migration to a backend straightforward: each service becomes a backend endpoint.

**docs/index.json is the document registry** — the file explorer is driven entirely by this file. Adding a document requires registering it here with `id`, `title`, `type`, `path`, and `tags`.

**AI as assistant, not author** — AI generates suggestions only; the user manually reviews and saves. No auto-write to docs.

**Static-only constraint** — no backend in MVP. All operations happen in the browser or via Ollama's local HTTP API.

## Development Milestones

1. **Milestone 1** — Static viewer: load `docs/index.json`, file explorer, Markdown + PlantUML rendering
2. **Milestone 2** — AI integration: Ollama setup, `aiService`, "Explain" feature
3. **Milestone 3** — AI authoring: "Improve diagram", "Generate diagram", prompt templates
4. **Milestone 4** — UX: split view, dark mode, loading/error states
5. **Milestone 5** — Optional backend: Spring WebFlux, move AI + rendering server-side, add persistence

## Key Constraints

- Static-only initially (no build step required, serve via any static file server)
- Local LLM only — Ollama must be running locally; `aiService` calls its HTTP API
- PlantUML diagrams initially rendered via public server; switch to local if privacy is a concern
- Manual document management — no auto-indexing; `docs/index.json` is maintained by hand
