import { useState, useEffect } from 'react'
import FileExplorer from './components/FileExplorer'
import MarkdownViewer from './components/MarkdownViewer'
import { loadIndex } from './services/fileService'

export default function App() {
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadIndex()
      .then(setDocuments)
      .catch(err => setError(err.message))
  }, [])

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="app-title">ArchDoc Viewer</h1>
        {error && <p className="error">{error}</p>}
        <FileExplorer
          documents={documents}
          selected={selectedDoc}
          onSelect={setSelectedDoc}
        />
      </aside>
      <main className="viewer">
        {selectedDoc
          ? <MarkdownViewer doc={selectedDoc} />
          : <p className="placeholder">Select a document to view</p>
        }
      </main>
    </div>
  )
}
