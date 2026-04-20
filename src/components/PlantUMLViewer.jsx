import { useState, useEffect } from 'react'
import { loadDocument } from '../services/fileService'

function toHex(content) {
  return Array.from(new TextEncoder().encode(content))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function PlantUMLViewer({ doc }) {
  const [content, setContent] = useState(null)
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSource, setShowSource] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    loadDocument(doc.path)
      .then(text => {
        setContent(text)
        setUrl(`https://www.plantuml.com/plantuml/svg/~h${toHex(text)}`)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [doc.path])

  if (loading) return <p className="loading">Loading...</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="plantuml-body">
      <div className="plantuml-source">
        <button className="plantuml-toggle" onClick={() => setShowSource(s => !s)}>
          <span className="tree-arrow">{showSource ? '▾' : '▸'}</span>
          Source
        </button>
        {showSource && <pre><code>{content}</code></pre>}
      </div>
      <div className="plantuml-preview">
        <span className="plantuml-label">Diagram</span>
        <img src={url} alt={doc.title} />
      </div>
    </div>
  )
}
