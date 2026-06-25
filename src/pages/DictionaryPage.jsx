import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dictionary } from '../data/dictionary'
import { useLang } from '../lib/i18n'

export default function DictionaryPage() {
  const { t } = useLang()
  const [search, setSearch] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1' }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.animate').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.style.opacity = '1'
      else observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const filtered = dictionary.filter(d =>
    !search || d.term.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="section" style={{ paddingTop: 120 }}>
      <div className="section-header animate">
        <h2>{t('dict_title')} <span className="badge">{dictionary.length} {t('dict_badge')}</span></h2>
        <div className="section-divider" />
        <p>{t('dict_desc')}</p>
      </div>

      <div className="books-controls animate d1">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder={t('dict_search')} value={search}
            onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
      </div>

      <div className="dictionary-grid">
        {filtered.map((d, i) => (
          <div className={`dictionary-card animate d${(i % 3) + 1}`} key={d.term}>
            <h4>{d.term.split('(')[0].trim()}</h4>
            {d.term.includes('(') && <span className="dict-english">({d.term.split('(')[1]}</span>}
            <p>{d.def}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <p>{t('dict_no_results')}</p>
        </div>
      )}

      <div className="cta-back">
        <Link to="/" className="btn btn-outline">{t('back_home')}</Link>
      </div>
    </section>
  )
}
