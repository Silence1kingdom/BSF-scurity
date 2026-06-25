import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { auth, signInWithGoogle, signOutUser, onAuthChange } from '../lib/firebase'
import { useTheme } from '../lib/theme'
import { useLang } from '../lib/i18n'
import { store } from '../lib/store'

const links = [
  { to: '/', labelKey: 'nav_home', emoji: '🏠' },
  { to: '/books', labelKey: 'nav_books', emoji: '📚' },
  { to: '/cybersecurity', labelKey: 'nav_cyber', emoji: '🛡️' },
  { to: '/dictionary', labelKey: 'nav_dict', emoji: '📖' },
  { to: '/exam', labelKey: 'nav_exam', emoji: '🧪' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const location = useLocation()
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, t, toggle: toggleLang } = useLang()

  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u))
    return unsub
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const base = location.pathname.startsWith('/cybersecurity') ? '/cybersecurity' : '/books'
    window.location.href = `${base}?search=${encodeURIComponent(searchQuery)}`
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span>🛡️</span> BSF Library
      </Link>
      <ul className={`nav-links${open ? ' show' : ''}`}>
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={location.pathname === l.to ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.emoji} {t(l.labelKey)}
            </Link>
          </li>
        ))}
        <li className="nav-mobile-only">
          <Link to="/leaderboard" onClick={() => setOpen(false)}>🏆 المتصدرين</Link>
        </li>
        <li className="nav-mobile-only">
          <Link to="/profile" onClick={() => setOpen(false)}>👤 {t('profile')}</Link>
        </li>
        {user && store.isAdmin(user.email) && (
          <li>
            <Link to="/admin" onClick={() => setOpen(false)}>{t('admin')}</Link>
          </li>
        )}
      </ul>
      <div className="navbar-left">
        <form className={`nav-search${searchOpen ? ' open' : ''}`} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onBlur={() => !searchQuery && setSearchOpen(false)}
          />
        </form>
        <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} title={t('search')}>🔍</button>
        <button className="nav-icon-btn" onClick={toggleLang} title={lang === 'ar' ? 'English' : 'العربية'}>
          {lang === 'ar' ? '🇬🇧' : '🇸🇦'}
        </button>
        <button className="nav-icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="auth-bar">
          {user ? (
            <div className="auth-user">
              <Link to="/profile" className="auth-profile-link">
                <img
                  src={user.photoURL || 'https://ui-avatars.com/api/?name=User&background=003d0d&color=00ff41'}
                  alt="avatar"
                  className="auth-avatar"
                />
              </Link>
              <Link to="/profile" className="auth-name">{user.displayName || t('profile')}</Link>
              <button className="auth-btn logout" onClick={signOutUser}>{t('logout')}</button>
            </div>
          ) : (
            <Link to="/login" className="auth-btn login">{t('login')}</Link>
          )}
        </div>
        <button className="menu-toggle" onClick={() => setOpen(!open)}>☰</button>
      </div>
    </nav>
  )
}
