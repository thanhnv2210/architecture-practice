# ArchDoc AI Viewer (Static-First)

A lightweight static web application to view, render, and enhance architecture documents (Markdown + PlantUML) with local LLM support.

## 🎯 Goals

* Render architecture documents directly in browser
* Support Markdown and PlantUML
* Integrate with local LLM (Ollama / llama.cpp)
* Enable AI-assisted architecture understanding and generation
* Follow "docs-as-code" principle

## 🧩 Tech Stack

* Frontend: Vanilla JS / React (TBD)
* Rendering:

  * Markdown: markdown-it / marked.js
  * PlantUML: public server (initial)
* AI: Local LLM (Ollama)

## 🚀 Features (Planned)

* 📂 File explorer (docs/index.json)
* 📄 Markdown viewer
* 📊 PlantUML renderer
* 🤖 AI panel:

  * Explain document
  * Improve diagram
  * Generate new content
* 🌙 Developer-friendly UI

## 🏃 Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 in your browser.

To stop, press `Ctrl+C` in the terminal.

## 📁 Project Structure

* `/docs` → architecture documents
* `/prompts` → AI prompt templates
* `/services` → core logic (file, render, AI)
* `/components` → UI components

## ⚠️ Constraints

* Static-only (no backend initially)
* Manual document management
* Local LLM only (no external API)

## 🔮 Future

* Backend with Spring WebFlux
* Database (PostgreSQL + R2DBC)
* Auth & collaboration
* Versioning system

---
