import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { sections } from '../data/cyberData.jsx'
import { quizzes } from '../data/quizData.js'
import { store } from '../lib/store'
import QuizBox from '../components/QuizBox'
import Comments from '../components/Comments'
import { useLang } from '../lib/i18n'

export default function CyberPage() {
  const { t } = useLang()
  const [searchParams] = useSearchParams()
  const [openSections, setOpenSections] = useState({})
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [bookmarks, setBookmarks] = useState(store.getBookmarks())

  useEffect(() => {
    window.scrollTo(0, 0)
    const quizParam = searchParams.get('quiz')
    if (quizParam) setActiveQuiz(Number(quizParam))
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
  }, [openSections])

  const readCount = useMemo(() =>
    Object.keys(openSections).filter(k => openSections[k]).length,
    [openSections]
  )

  const quizTakenCount = useMemo(() => {
    const qs = store.getQuizzes()
    return Object.keys(qs).length
  }, [])

  const toggle = (num) => {
    const wasClosed = !openSections[num]
    setOpenSections(prev => ({ ...prev, [num]: wasClosed }))
    if (wasClosed) store.markSectionRead(num)
  }

  const handleBookmark = (sectionNum, e) => {
    e.stopPropagation()
    const updated = store.toggleBookmark('sections', String(sectionNum))
    setBookmarks({ ...bookmarks, sections: updated.sections })
  }

  return (
    <section className="section cyber-page" style={{ paddingTop: 120 }}>
      <div className="section-header animate">
        <h2>{t('cyber_title')} <span className="badge">{t('cyber_badge')}</span></h2>
        <div className="section-divider" />
        <p>{t('cyber_desc')}</p>
      </div>

      <div className="cyber-progress animate d1">
        <span>📖 {readCount} / {sections.length} {t('cyber_progress')}</span>
        <span className="cyber-progress-sep">|</span>
        <span>🧪 {quizTakenCount} {t('cyber_tests')}</span>
        <button className="btn-sm" onClick={() => {
          const all = {}
          sections.forEach(s => {
            all[s.num] = true
            store.markSectionRead(s.num)
          })
          setOpenSections(all)
        }}>{t('cyber_open_all')}</button>
        <button className="btn-sm" onClick={() => setOpenSections({})}>{t('cyber_close_all')}</button>
      </div>

      {sections.map((s, i) => {
        const isRead = store.isSectionRead(s.num)
        const isBm = bookmarks.sections?.includes(String(s.num))
        const hasQuiz = quizzes[s.num]
        const quizResult = store.getQuizResult(s.num)

        return (
          <div className={`cyber-accordion animate d${(i % 3) + 1}`} key={s.num}>
            <button
              className={`accordion-header${openSections[s.num] ? ' open' : ''}`}
              onClick={() => toggle(s.num)}
            >
              <span className="accordion-badges">
                {isRead && <span className="tag tag-green" title={t('cyber_read')}>✓</span>}
                {isBm && <span className="tag tag-yellow" title={t('cyber_fav')}>★</span>}
                {quizResult && <span className="tag tag-blue" title={`${t('exam_title')}: ${quizResult.score}/${quizResult.total}`}>🧪</span>}
              </span>
              <span className="num">{s.num}</span>
              <span className="title">{s.title}</span>
              <button className="bookmark-btn-sm" onClick={(e) => handleBookmark(s.num, e)}>
                {isBm ? '★' : '☆'}
              </button>
              <span className="arrow">{openSections[s.num] ? '▲' : '▼'}</span>
            </button>
            <div className={`accordion-body${openSections[s.num] ? ' open' : ''}`}>
              <div className="accordion-inner">
                {s.content}
                {hasQuiz && (
                  <div className="quiz-section">
                    <button
                      className="btn btn-primary quiz-toggle"
                      onClick={() => setActiveQuiz(activeQuiz === s.num ? null : s.num)}
                    >
                      🧪 {activeQuiz === s.num ? t('cyber_quiz_hide') : t('cyber_quiz_show')}
                    </button>
                    {activeQuiz === s.num && <QuizBox sectionNum={s.num} quiz={quizzes[s.num]} />}
                  </div>
                )}
                <div className="quiz-section">
                  <Comments
                    sectionKey={`cyber-section-${s.num}`}
                    sectionTitle={s.title}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <div className="cta-back">
        <Link to="/" className="btn btn-outline">{t('back_home')}</Link>
      </div>
    </section>
  )
}
