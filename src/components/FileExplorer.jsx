import { useState } from 'react'

const MAX_DEPTH = 3

function filterTree(nodes, query) {
  if (!query) return nodes
  const q = query.toLowerCase()
  return nodes.reduce((acc, node) => {
    if (node.children) {
      const filtered = filterTree(node.children, q)
      if (filtered.length > 0) acc.push({ ...node, children: filtered })
    } else if (node.title.toLowerCase().includes(q)) {
      acc.push(node)
    }
    return acc
  }, [])
}

function FolderNode({ node, depth, selected, onSelect, forceOpen }) {
  const [open, setOpen] = useState(true)
  const isOpen = forceOpen || open

  return (
    <li className="tree-folder">
      <button
        className="tree-folder-btn"
        style={{ paddingLeft: `${depth * 12}px` }}
        onClick={() => setOpen(o => !o)}
      >
        <span className="tree-arrow">{isOpen ? '▾' : '▸'}</span>
        {node.label}
      </button>
      {isOpen && (
        <ul>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} forceOpen={forceOpen} />
          ))}
        </ul>
      )}
    </li>
  )
}

function DocNode({ node, depth, selected, onSelect }) {
  const icon = node.type === 'plantuml' ? '◈' : '◉'
  return (
    <li
      className={`tree-doc ${selected?.id === node.id ? 'active' : ''}`}
      style={{ paddingLeft: `${depth * 12 + 4}px` }}
      onClick={() => onSelect(node)}
    >
      <span className="tree-doc-icon">{icon}</span>
      {node.title}
    </li>
  )
}

function TreeNode({ node, depth, selected, onSelect, forceOpen }) {
  if (depth > MAX_DEPTH) return null
  if (node.children) return <FolderNode node={node} depth={depth} selected={selected} onSelect={onSelect} forceOpen={forceOpen} />
  return <DocNode node={node} depth={depth} selected={selected} onSelect={onSelect} />
}

export default function FileExplorer({ tree, selected, onSelect }) {
  const [query, setQuery] = useState('')
  const filtered = filterTree(tree, query)
  const isFiltering = query.length > 0

  return (
    <nav className="file-explorer">
      <div className="tree-search">
        <input
          type="text"
          placeholder="Filter..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="tree-search-input"
        />
        {isFiltering && (
          <button className="tree-search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>
      <ul>
        {filtered.map(node => (
          <TreeNode key={node.id} node={node} depth={1} selected={selected} onSelect={onSelect} forceOpen={isFiltering} />
        ))}
      </ul>
      {isFiltering && filtered.length === 0 && (
        <p className="tree-no-results">No results for "{query}"</p>
      )}
    </nav>
  )
}
