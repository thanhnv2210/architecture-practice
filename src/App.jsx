import { useState, useEffect } from 'react'
import FileExplorer from './components/FileExplorer'
import MarkdownViewer from './components/MarkdownViewer'
import PlantUMLViewer from './components/PlantUMLViewer'
import AuthGuard from './components/AuthGuard'
import { loadIndex } from './services/fileService'

export default function App() {
  const [tree, setTree] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    loadIndex()
      .then(setTree)
      .catch(err => setError(err.message))
  }, [])

  function handleSelect(doc) {
    setSelectedDoc(doc)
    setSidebarOpen(false)
  }

  return (
    <AuthGuard>
    <div className="app">
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <h1 className="app-title">ArchDoc Viewer</h1>
        {error && <p className="error">{error}</p>}
        <FileExplorer
          tree={tree}
          selected={selectedDoc}
          onSelect={handleSelect}
        />
      </aside>
      <main className="viewer">
        <button className="menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
          ☰
        </button>
        {!selectedDoc && <p className="placeholder">Select a document to view</p>}
        {selectedDoc?.type === 'markdown' && <MarkdownViewer doc={selectedDoc} />}
        {selectedDoc?.type === 'plantuml' && <PlantUMLViewer doc={selectedDoc} />}
      </main>
    </div>
    </AuthGuard>
  )
}
