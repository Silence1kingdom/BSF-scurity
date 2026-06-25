const STORE_KEY = 'bsf_library'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {}
  } catch { return {} }
}

function save(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data))
}

export const store = {
  getProgress() {
    return load().progress || { books: [], sections: [] }
  },

  markBookOpened(bookId) {
    const data = load()
    if (!data.progress) data.progress = { books: [], sections: [] }
    if (!data.progress.books.includes(bookId)) {
      data.progress.books.push(bookId)
      save(data)
    }
  },

  markSectionRead(sectionNum) {
    const data = load()
    if (!data.progress) data.progress = { books: [], sections: [] }
    if (!data.progress.sections.includes(sectionNum)) {
      data.progress.sections.push(sectionNum)
      save(data)
    }
  },

  isSectionRead(sectionNum) {
    return load().progress?.sections?.includes(sectionNum) || false
  },

  getBookmarks() {
    return load().bookmarks || { books: [], sections: [] }
  },

  toggleBookmark(type, id) {
    const data = load()
    if (!data.bookmarks) data.bookmarks = { books: [], sections: [] }
    const list = data.bookmarks[type]
    const idx = list.indexOf(id)
    if (idx > -1) list.splice(idx, 1)
    else list.push(id)
    save(data)
    return data.bookmarks
  },

  isBookmarked(type, id) {
    return load().bookmarks?.[type]?.includes(id) || false
  },

  getQuizzes() {
    const data = load()
    if (!data.quizzes) {
      data.quizzes = {}
      save(data)
    }
    return data.quizzes
  },

  saveQuizResult(sectionNum, score, total) {
    const data = load()
    if (!data.quizzes) data.quizzes = {}
    data.quizzes[sectionNum] = { score, total, date: Date.now() }
    save(data)
  },

  getQuizResult(sectionNum) {
    return load().quizzes?.[sectionNum] || null
  },

  // === Admin Management ===
  SUPER_ADMIN: 'vectorblack03@gmail.com',

  getAdmins() {
    return load().admins || []
  },

  isAdmin(email) {
    if (!email) return false
    if (email === this.SUPER_ADMIN) return true
    return this.getAdmins().includes(email)
  },

  isSuperAdmin(email) {
    return email === this.SUPER_ADMIN
  },

  addAdmin(email) {
    if (!email || email === this.SUPER_ADMIN) return false
    const data = load()
    if (!data.admins) data.admins = []
    if (data.admins.includes(email)) return false
    data.admins.push(email)
    save(data)
    return true
  },

  removeAdmin(email) {
    if (!email || email === this.SUPER_ADMIN) return false
    const data = load()
    if (!data.admins) return false
    const idx = data.admins.indexOf(email)
    if (idx === -1) return false
    data.admins.splice(idx, 1)
    save(data)
    return true
  },

  clearAll() {
    localStorage.removeItem(STORE_KEY)
  }
}
