async function fetchVirtualLoverMessage({ forceRefresh = false } = {}) {
  const response = await fetch('/api/lover/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ forceRefresh }),
  })

  if (!response.ok) {
    throw new Error(`Virtual lover API ${response.status}`)
  }

  return response.json()
}

async function clearVirtualLoverMemory() {
  const response = await fetch('/api/lover/memory', {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Virtual lover memory API ${response.status}`)
  }

  return response.json()
}

export { clearVirtualLoverMemory, fetchVirtualLoverMessage }