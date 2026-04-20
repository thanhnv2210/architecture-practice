arch-doc-viewer/
│
├── index.html
├── app/
│   ├── main.js
│   ├── router.js
│   ├── state.js
│
├── components/
│   ├── fileExplorer.js
│   ├── editor.js
│   ├── markdownViewer.js
│   ├── plantumlViewer.js
│   ├── aiPanel.js
│
├── services/
│   ├── fileService.js
│   ├── renderService.js
│   ├── aiService.js   // calls local LLM
│
├── docs/
│   ├── index.json     // document registry (IMPORTANT)
│   ├── error-handling.md
│   ├── architecture.puml
│
├── prompts/
│   ├── explain.txt
│   ├── improve.txt
│   ├── generate.txt
│
├── styles/
│   └── main.css
│
└── README.md