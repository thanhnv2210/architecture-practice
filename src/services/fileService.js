export async function loadIndex() {
  const res = await fetch('/docs/index.json')
  if (!res.ok) throw new Error('Failed to load document index')
  const data = await res.json()
  return data.tree
}

export async function loadDocument(path) {
  const res = await fetch(`/${path}`)
  if (!res.ok) throw new Error(`Failed to load: ${path}`)
  return res.text()
}
