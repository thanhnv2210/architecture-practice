export default function FileExplorer({ documents, selected, onSelect }) {
  return (
    <nav className="file-explorer">
      <ul>
        {documents.map(doc => (
          <li
            key={doc.id}
            className={`file-item ${selected?.id === doc.id ? 'active' : ''}`}
            onClick={() => onSelect(doc)}
          >
            <span className="file-name">{doc.title}</span>
            <div className="file-tags">
              {doc.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}
