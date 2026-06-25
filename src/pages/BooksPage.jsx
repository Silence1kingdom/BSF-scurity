import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import { store } from '../lib/store'
import { staticBooks } from '../data/booksStatic'
import { downloadAllAsZip } from '../lib/zip'
import { useLang } from '../lib/i18n'

const allTags = [...new Set(staticBooks.flatMap(b => b.tags))]

export default function BooksPage() {
  const { t } = useLang()
  const [searchParams] = useSearchParams()
  const [books, setBooks] = useState(staticBooks)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeTag, setActiveTag] = useState('')
  const [loading, setLoading] = useState(true)
  const [apiFailed, setApiFailed] = useState(false)
  const [bookmarks, setBookmarks] = useState(store.getBookmarks())

  useEffect(() => {
    window.scrollTo(0, 0)
    loadBooks()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1' }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.animate').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.style.opacity = '1'
      else observer.observe(el)
    })
    return () => observer.disconnect()
  }, [books])

  async function loadBooks() {
    try {
      const data = await api.getBooks()
      if (data && data.length) setBooks(data)
    } catch {
      setApiFailed(true)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = (bookId, e) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = store.toggleBookmark('books', bookId)
    setBookmarks({ ...bookmarks, books: updated.books })
  }

  const filtered = books.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !search
      || b.title?.toLowerCase().includes(q)
      || b.description?.toLowerCase().includes(q)
    const matchTag = !activeTag || b.tags?.includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <section className="section books-page" style={{ paddingTop: 120 }}>
      <div className="section-header animate">
        <h2>{t('books_all')} <span className="badge">{books.length} {t('books_count')}</span></h2>
        <div className="section-divider" />
        <p>{t('books_desc')}</p>
        {apiFailed && <p className="offline-badge">{t('books_offline')}</p>}
      </div>

      <div className="books-controls animate d1">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder={t('books_search')} value={search}
            onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="tags-filter">
          <button className={`tag-btn${!activeTag ? ' active' : ''}`} onClick={() => setActiveTag('')}>{t('books_all_tags')}</button>
          {allTags.map(t => (
            <button key={t} className={`tag-btn${activeTag === t ? ' active' : ''}`} onClick={() => setActiveTag(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="download-all-section">
        <button className="btn btn-primary" onClick={() => {
          const files = staticBooks.map(b => ({ name: b.file, url: `/pdfs/${b.file}` }))
          downloadAllAsZip(files, 'BSF_All_Books.zip')
        }}>
          {t('books_download_all')}
        </button>
        <p>{t('books_download_all_desc')}</p>
      </div>

      <div className="results-count">{loading ? t('loading') : `${filtered.length} ${t('books_result')}`}</div>

      <div className="books-grid">
        {filtered.map((b, i) => {
          const bm = bookmarks.books?.includes(b.id)
          return (
            <div className={`book-card animate d${(i % 4) + 1}`} key={b.id}>
              <button
                className={`bookmark-btn${bm ? ' active' : ''}`}
                onClick={(e) => handleBookmark(b.id, e)}
                title={bm ? t('books_bookmark_remove') : t('books_bookmark_add')}
              >
                {bm ? '★' : '☆'}
              </button>
              <div className="icon">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.description}</p>
              {b.tags && <div className="book-tags">{b.tags.map(t => <span key={t} className="tag tag-green">{t}</span>)}</div>}
              <div className="meta">
                <span>📄 {b.pages} {t('books_page')}</span>
                <span>📅 {t('books_year')}</span>
              </div>
              <a
                href={`/pdfs/${b.file}`}
                className="btn-sm"
                target="_blank"
                rel="noreferrer"
                onClick={() => store.markBookOpened(b.id)}
              >
                {t('books_download')}
              </a>
            </div>
          )
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="no-results">
          <p>{t('books_no_results')}</p>
          <button className="btn btn-outline" onClick={() => { setSearch(''); setActiveTag('') }}>{t('books_reset')}</button>
        </div>
      )}

      <div className="cta-back">
        <Link to="/" className="btn btn-outline">{t('back_home')}</Link>
      </div>
    </section>
  )
}
