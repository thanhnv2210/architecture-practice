# 🧠 Strategy

## 1. Static-First Approach

Start with:

* No backend
* No database
* Local file system only

Reason:

* Faster iteration
* Lower complexity
* Focus on UX + core value

---

## 2. Docs-as-Code Principle

* All documents stored as files
* Use `docs/index.json` as registry
* Manual versioning (Git)

---

## 3. Adapter-Based Design (Even in Frontend)

Apply backend mindset:

* `fileService` → load documents
* `renderService` → render markdown/uml
* `aiService` → interact with LLM

Benefits:

* Easy migration to backend later
* Clear separation of concerns

---

## 4. AI as Assistant (Not Source of Truth)

* AI generates suggestions
* User manually reviews and saves
* Avoid auto-write to docs

---

## 5. Incremental Complexity

Phase 1:

* Viewer only

Phase 2:

* AI explain

Phase 3:

* AI generate

Phase 4:

* Full platform

---

## 6. Risk Mitigation

### ❗ PlantUML Rendering

* Start with public server
* Switch to local if needed

### ❗ LLM Performance

* Use small local model first
* Limit input size

### ❗ Scope Creep

* Keep MVP minimal
* Avoid adding backend early

---

## 7. Migration Plan

When scaling:

* Move `aiService` → backend
* Move `renderService` → backend
* Add API layer
* Add DB (Postgres)

---

## 8. Engineering Principles

* Keep it simple
* Modular design
* Observable (logs)
* Reusable components
