import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../lib/store'
import { useLang } from '../lib/i18n'

export default function LeaderboardPage() {
  const { t } = useLang()
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    const quizzes = store.getQuizzes()
    const progress = store.getProgress()
    const bookmarks = store.getBookmarks()

    const userData = {
      name: t('lb_you'),
      quizScore: Object.values(quizzes).reduce((a, q) => a + q.score, 0),
      quizTotal: Object.values(quizzes).reduce((a, q) => a + q.total, 0),
      sections: progress.sections.length,
      books: progress.books.length,
      bookmarks: (bookmarks.books?.length || 0) + (bookmarks.sections?.length || 0),
    }
    setLeaders([userData])
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
  }, [])

  const totalScore = leaders[0]?.quizTotal || 0
  const userScore = leaders[0]?.quizScore || 0
  const pct = totalScore > 0 ? Math.round(userScore / totalScore * 100) : 0

  return (
    <section className="section" style={{ paddingTop: 120 }}>
      <div className="section-header animate">
        <h2>{t('lb_title')}</h2>
        <div className="section-divider" />
        <p>{t('lb_desc')}</p>
      </div>

      <div className="leaderboard-grid animate d1">
        <div className="leaderboard-card gold">
          <div className="lb-rank">👑</div>
          <div className="lb-name">{leaders[0]?.name || t('lb_you')}</div>
          <div className="lb-score">{pct}%</div>
          <div className="lb-details">
            <span>{t('lb_books')} {leaders[0]?.books || 0}</span>
            <span>{t('lb_sections')} {leaders[0]?.sections || 0}</span>
            <span>🧪 {userScore}/{totalScore}</span>
            <span>{t('lb_bookmarks')} {leaders[0]?.bookmarks || 0}</span>
          </div>
        </div>
      </div>

      <div className="leaderboard-stats animate d2">
        <h3>{t('lb_stats')}</h3>
        <div className="lb-stats-grid">
          <div className="lb-stat">
            <div className="lbs-num">{leaders[0]?.books || 0}</div>
            <div className="lbs-label">{t('lb_books')}</div>
          </div>
          <div className="lb-stat">
            <div className="lbs-num">{leaders[0]?.sections || 0}/12</div>
            <div className="lbs-label">{t('lb_sections')}</div>
          </div>
          <div className="lb-stat">
            <div className="lbs-num">{pct}%</div>
            <div className="lbs-label">{t('lb_quiz_avg')}</div>
          </div>
          <div className="lb-stat">
            <div className="lbs-num">{leaders[0]?.bookmarks || 0}</div>
            <div className="lbs-label">{t('lb_bookmarks')}</div>
          </div>
        </div>
      </div>

      <div className="leaderboard-tips animate d3">
        <h3>{t('lb_tips')}</h3>
        <div className="tips-grid">
          <div className="tip-card"><span className="tip-icon">📚</span><p>{t('lb_tip1')}</p></div>
          <div className="tip-card"><span className="tip-icon">🛡️</span><p>{t('lb_tip2')}</p></div>
          <div className="tip-card"><span className="tip-icon">🧪</span><p>{t('lb_tip3')}</p></div>
          <div className="tip-card"><span className="tip-icon">⭐</span><p>{t('lb_tip4')}</p></div>
        </div>
      </div>

      <div className="cta-back">
        <Link to="/profile" className="btn btn-primary">{t('lb_my_profile')}</Link>
        <Link to="/" className="btn btn-outline">{t('back_home')}</Link>
      </div>
    </section>
  )
}
