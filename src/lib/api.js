const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  // Books
  getBooks: (params = {}) => {
    const q = new URLSearchParams()
    if (params.search) q.set('search', params.search)
    if (params.tag) q.set('tag', params.tag)
    const qs = q.toString()
    return fetchJSON(`/books${qs ? `?${qs}` : ''}`)
  },
  getBook: (id) => fetchJSON(`/books/${id}`),

  // Cybersecurity
  getSections: (params = {}) => {
    const q = params.tag ? `?tag=${params.tag}` : ''
    return fetchJSON(`/cybersecurity${q}`)
  },
  getSection: (id) => fetchJSON(`/cybersecurity/${id}`),

  // Auth
  verifyToken: (idToken) =>
    fetchJSON('/auth/verify', { method: 'POST', body: JSON.stringify({ idToken }) }),
  getProfile: (token) =>
    fetchJSON('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),

  // Health
  health: () => fetchJSON('/health'),
}

export default api
