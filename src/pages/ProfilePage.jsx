import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, signOutUser, onAuthChange } from '../lib/firebase'
import { store } from '../lib/store'
import { useLang } from '../lib/i18n'

export default function ProfilePage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    const unsub = onAuthChange(u => {
      if (!u) { navigate('/login', { replace: true }); return }
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [navigate])

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
  }, [user])

  if (loading) return (
    <div className="profile-page"><div className="page-loader" /></div>
  )

  const isAdmin = store.isAdmin(user.email)
  const isSuper = store.isSuperAdmin(user.email)
  const progress = store.getProgress()
  const bookmarks = store.getBookmarks()
  const quizzes = store.getQuizzes()
  const sectionsCount = progress.sections.length
  const booksCount = progress.books.length
  const bookmarksCount = (bookmarks.books?.length || 0) + (bookmarks.sections?.length || 0)
  const quizCount = Object.keys(quizzes).length
  const quizAvg = quizCount > 0
    ? Math.round(Object.values(quizzes).reduce((a, q) => a + q.score / q.total, 0) / quizCount * 100)
    : 0

  return (
    <div className="profile-page">
      <div className="profile-header animate">
        <div className="profile-cover" />
        <div className="profile-info">
          <img
            src={user.photoURL || 'https://ui-avatars.com/api/?name=User&background=003d0d&color=00ff41&size=128'}
            alt="avatar"
            className="profile-avatar"
          />
          <h1>{user.displayName || t('profile_user')}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-badges">
            <span className={`tag ${isAdmin ? 'tag-yellow' : 'tag-green'}`}>
              {isSuper ? t('admin_super_admin') : isAdmin ? '⚡ ' + t('profile_user') : '👤 ' + t('profile_user')}
            </span>
            <span className="tag tag-blue">{t('profile_online')}</span>
            {quizAvg > 0 && <span className="tag tag-purple">🎯 {quizAvg}% {t('exam_avg')}</span>}
          </div>
        </div>
      </div>

      <div className="profile-body section">
        <div className="profile-grid">
          <div className="profile-card animate d1">
            <div className="pc-icon">📊</div>
            <h3>{t('profile_stats')}</h3>
            <div className="pc-stats">
              <div className="pc-stat"><span className="pc-num">{booksCount}</span><span className="pc-lbl">{t('profile_books_read')}</span></div>
              <div className="pc-stat"><span className="pc-num">{sectionsCount}</span><span className="pc-lbl">{t('profile_lessons_done')}</span></div>
              <div className="pc-stat"><span className="pc-num">{quizCount}</span><span className="pc-lbl">{t('profile_quizzes_done')}</span></div>
              <div className="pc-stat"><span className="pc-num">{bookmarksCount}</span><span className="pc-lbl">{t('profile_bookmarks')}</span></div>
            </div>
          </div>

          <div className="profile-card animate d2">
            <div className="pc-icon">📖</div>
            <h3>{t('profile_recent')}</h3>
            {booksCount > 0 ? (
              <p className="pc-empty">{t('profile_read_msg')} {booksCount} {t('profile_books_suffix')}</p>
            ) : (
              <p className="pc-empty">{t('profile_no_books')}</p>
            )}
            <Link to="/books" className="btn-sm">{t('profile_browse_books')}</Link>
          </div>

          <div className="profile-card animate d3">
            <div className="pc-icon">🛡️</div>
            <h3>{t('profile_progress')}</h3>
            <div className="progress-ring">
              <svg viewBox="0 0 36 36" className="ring-svg">
                <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="ring-fg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeDasharray={`${Math.min(sectionsCount, 12) * 100 / 12}, 100`} />
              </svg>
              <div className="ring-text">{Math.round(sectionsCount / 12 * 100)}%</div>
            </div>
            <Link to="/cybersecurity" className="btn-sm">{t('profile_continue')}</Link>
          </div>
        </div>

        <div className="profile-actions animate d4">
          <h3>{t('profile_settings')}</h3>
          <div className="actions-list">
            <button className="action-item" onClick={() => alert(t('admin_coming_soon'))}>
              <span className="action-icon">🔔</span>
              <span>{t('profile_notifications')}</span>
            </button>
            <Link to="/dictionary" className="action-item">
              <span className="action-icon">📖</span>
              <span>{t('profile_dictionary')}</span>
            </Link>
            <Link to="/exam" className="action-item">
              <span className="action-icon">🧪</span>
              <span>{t('profile_exam')}</span>
            </Link>
            <Link to={isAdmin ? '/admin' : '#'} className="action-item">
              <span className="action-icon">⚙️</span>
              <span>{isAdmin ? t('profile_admin') : t('profile_settings_account')}</span>
            </Link>
            <button className="action-item" onClick={() => { store.clearAll(); window.location.reload() }}>
              <span className="action-icon">🗑️</span>
              <span>{t('profile_clear_data')}</span>
            </button>
            <button className="action-item logout" onClick={signOutUser}>
              <span className="action-icon">🚪</span>
              <span>{t('profile_logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
