import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { useLang } from '../lib/i18n'

const highlights = [
  { emoji: '📚', titleKey: 'home_h1', descKey: 'home_d1' },
  { emoji: '🛡️', titleKey: 'home_h2', descKey: 'home_d2' },
  { emoji: '🧪', titleKey: 'home_h3', descKey: 'home_d3' },
  { emoji: '📖', titleKey: 'home_h4', descKey: 'home_d4' },
  { emoji: '🔧', titleKey: 'home_h5', descKey: 'home_d5' },
  { emoji: '📜', titleKey: 'home_h6', descKey: 'home_d6' },
]

export default function Home() {
  const { t } = useLang()
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
  }, [])

  return (
    <>
      <Hero />

      <section className="section">
        <div className="section-header animate">
          <h2>{t('home_features')}</h2>
          <div className="section-divider" />
        </div>
        <div className="highlights-grid">
          {highlights.map((h, i) => (
            <div className={`highlight-card animate d${(i % 4) + 1}`} key={h.titleKey}>
              <div className="h-icon">{h.emoji}</div>
              <h3>{t(h.titleKey)}</h3>
              <p>{t(h.descKey)}</p>
            </div>
          ))}
        </div>
        <div className="cta animate d2">
          <Link to="/books" className="btn btn-primary">{t('home_cta_books')}</Link>
          <Link to="/cybersecurity" className="btn btn-outline">{t('home_cta_cyber')}</Link>
        </div>
      </section>

      <section className="section stats-section">
        <div className="stats-grid">
          {[
            { num: '6', labelKey: 'home_stats_books' },
            { num: '12', labelKey: 'home_stats_sections' },
            { num: '50+', labelKey: 'home_stats_tools' },
            { num: '100%', labelKey: 'home_stats_free' },
          ].map((s, i) => (
            <div className={`stat-card animate d${(i % 4) + 1}`} key={s.labelKey}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
