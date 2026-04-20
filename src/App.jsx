import { useState, useEffect } from 'react'
import FileExplorer from './components/FileExplorer'
import MarkdownViewer from './components/MarkdownViewer'
import PlantUMLViewer from './components/PlantUMLViewer'
import { loadIndex } from './services/fileService'

export default function App() {
  const [tree, setTree] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadIndex()
      .then(setTree)
      .catch(err => setError(err.message))
  }, [])

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="app-title">ArchDoc Viewer</h1>
        {error && <p className="error">{error}</p>}
        <FileExplorer
          tree={tree}
          selected={selectedDoc}
          onSelect={setSelectedDoc}
        />
      </aside>
      <main className="viewer">
        {!selectedDoc && <p className="placeholder">Select a document to view</p>}
        {selectedDoc?.type === 'markdown' && <MarkdownViewer doc={selectedDoc} />}
        {selectedDoc?.type === 'plantuml' && <PlantUMLViewer doc={selectedDoc} />}
      </main>
    </div>
  )
}
