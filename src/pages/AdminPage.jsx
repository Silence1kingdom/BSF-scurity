import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, signOutUser, onAuthChange } from '../lib/firebase'
import { store } from '../lib/store'
import { staticBooks } from '../data/booksStatic'
import { useLang } from '../lib/i18n'

export default function AdminPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState({ books: 6, sections: 12, users: 1 })
  const [admins, setAdmins] = useState(store.getAdmins())
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    window.scrollTo(0, 0)
    const unsub = onAuthChange(u => {
      if (!u || !store.isAdmin(u.email)) {
        navigate('/', { replace: true })
        return
      }
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [navigate])

  useEffect(() => {
    if (!loading && user) {
      setAdmins(store.getAdmins())
    }
  }, [loading, user])

  if (loading) return <div className="admin-page"><div className="page-loader" /></div>
  if (!user) return null

  const isSuper = store.isSuperAdmin(user.email)

  const showMsg = (text, type) => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const handleAddAdmin = () => {
    const email = newAdminEmail.trim().toLowerCase()
    if (!email) { showMsg(t('admin_add_placeholder'), 'error'); return }
    if (store.addAdmin(email)) {
      setAdmins(store.getAdmins())
      setNewAdminEmail('')
      showMsg(`✅ ${email}`, 'success')
    } else {
      showMsg(`${t('admin_super_admin')}`, 'error')
    }
  }

  const handleRemoveAdmin = (email) => {
    if (store.removeAdmin(email)) {
      setAdmins(store.getAdmins())
      showMsg(`✅ ${email}`, 'success')
    }
  }

  const tabs = [
    { id: 'overview', labelKey: 'admin_overview' },
    { id: 'books', labelKey: 'admin_books' },
    { id: 'admins', labelKey: 'admin_admins' },
    { id: 'settings', labelKey: 'admin_settings' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-brand">🛡️ BSF Admin</div>
        <div className="admin-admin-info">
          <img src={user.photoURL} alt="" className="admin-avatar" />
          <div>
            <div className="admin-name">{user.displayName}</div>
            <div className="admin-role">{isSuper ? t('admin_super_admin') : '⚡ ' + t('profile_user')}</div>
          </div>
        </div>
        <nav className="admin-nav">
          {tabs.map(t => (
            <button key={t.id}
              className={`admin-nav-item${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}>
              {t(t.labelKey)}
            </button>
          ))}
        </nav>
        <div className="admin-nav-footer">
          <Link to="/" className="admin-nav-item">{t('admin_back')}</Link>
          <button className="admin-nav-item logout" onClick={signOutUser}>{t('admin_logout')}</button>
        </div>
      </div>

      <div className="admin-main">
        {msg.text && <div className={`admin-msg ${msg.type}`}>{msg.text}</div>}

        {tab === 'overview' && (
          <>
            <h2 className="animate">{t('admin_overview')}</h2>
            <div className="admin-stats-grid animate d1">
              <div className="admin-stat-card">
                <div className="as-icon">📚</div>
                <div className="as-num">{stats.books}</div>
                <div className="as-label">{t('admin_books_count')}</div>
              </div>
              <div className="admin-stat-card">
                <div className="as-icon">🛡️</div>
                <div className="as-num">{stats.sections}</div>
                <div className="as-label">{t('admin_sections_count')}</div>
              </div>
              <div className="admin-stat-card">
                <div className="as-icon">👥</div>
                <div className="as-num">{stats.users}</div>
                <div className="as-label">{t('admin_users')}</div>
              </div>
              <div className="admin-stat-card">
                <div className="as-icon">👑</div>
                <div className="as-num">{admins.length + 1}</div>
                <div className="as-label">{t('admin_admins_count')}</div>
              </div>
              <div className="admin-stat-card">
                <div className="as-icon">📄</div>
                <div className="as-num">{stats.books + stats.sections}</div>
                <div className="as-label">{t('admin_total_content')}</div>
              </div>
              <div className="admin-stat-card">
                <div className="as-icon">🧪</div>
                <div className="as-num">60+</div>
                <div className="as-label">{t('admin_questions')}</div>
              </div>
            </div>

            <div className="admin-section animate d2">
              <h3>{t('admin_platform_status')}</h3>
              <div className="admin-status-grid">
                <div className="admin-status-item">
                  <span className="status-dot green" />
                  <span>Firebase Auth</span>
                  <span className="tag tag-green">{t('admin_connected')}</span>
                </div>
                <div className="admin-status-item">
                  <span className="status-dot green" />
                  <span>{t('admin_status_local')}</span>
                  <span className="tag tag-green">{t('admin_connected')}</span>
                </div>
                <div className="admin-status-item">
                  <span className="status-dot yellow" />
                  <span>{t('admin_status_server')}</span>
                  <span className="tag tag-yellow">{t('admin_optional')}</span>
                </div>
                <div className="admin-status-item">
                  <span className="status-dot green" />
                  <span>{t('admin_status_admin')}</span>
                  <span className="tag tag-green">{t('admin_protected')}</span>
                </div>
              </div>
            </div>

            <div className="admin-section animate d3">
              <h3>{t('admin_quick')}</h3>
              <div className="quick-actions">
                <button className="btn btn-primary" onClick={() => setTab('admins')}>{t('admin_manage_admins')}</button>
                <button className="btn btn-outline" onClick={() => setTab('books')}>{t('admin_manage_books')}</button>
                <Link to="/exam" className="btn btn-outline">{t('admin_exam')}</Link>
              </div>
            </div>
          </>
        )}

        {tab === 'books' && (
          <>
            <h2 className="animate">{t('admin_books')}</h2>
            <p className="animate d1" style={{ color: 'var(--text)', marginBottom: 20, fontSize: 15 }}>
              {t('admin_manage_books')}
            </p>
            <div className="admin-table animate d2">
              <div className="table-header">
                <span>{t('books_all')}</span>
                <span>{t('books_page')}</span>
                <span>{t('books_all_tags')}</span>
                <span>{t('download')}</span>
                <span>{t('admin_add_admin')}</span>
              </div>
              {staticBooks.map((b, i) => (
                <div className="table-row animate d1" key={b.id}>
                  <span className="tr-title">{b.icon} {b.title}</span>
                  <span>{b.pages}</span>
                  <span>{b.tags.map(t => <span key={t} className="tag tag-green">{t}</span>)}</span>
                  <span className="tr-file">{b.file}</span>
                  <span className="tr-actions">
                    <button className="btn-sm" title={t('admin_edit')} onClick={() => showMsg(t('admin_coming_soon'), 'success')}>✏️</button>
                    <button className="btn-sm" title={t('admin_copy_link')} onClick={() => { navigator.clipboard?.writeText(`/pdfs/${b.file}`); showMsg(t('admin_link_copied'), 'success') }}>📋</button>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'admins' && (
          <>
            <h2 className="animate">{t('admin_admins')}</h2>
            <p className="animate d1" style={{ color: 'var(--text)', marginBottom: 20, fontSize: 15 }}>
              {t('admin_admin_manage')}
            </p>

            <div className="admin-section animate d2">
              <h3>{t('admin_super_admin')}</h3>
              <div className="admin-super-admin-card">
                <div className="asa-avatar">🛡️</div>
                <div>
                  <div className="asa-email">{store.SUPER_ADMIN}</div>
                  <div className="asa-role">{t('admin_super_admin_desc')}</div>
                </div>
              </div>
            </div>

            {isSuper && (
              <div className="admin-section animate d3">
                <h3>{t('admin_add_admin')}</h3>
                <div className="admin-add-admin">
                  <input
                    type="email"
                    placeholder={t('admin_add_placeholder')}
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    className="admin-input"
                    onKeyDown={e => e.key === 'Enter' && handleAddAdmin()}
                  />
                  <button className="btn btn-primary" onClick={handleAddAdmin}>{t('admin_add_btn')}</button>
                </div>
              </div>
            )}

            {admins.length > 0 && (
              <div className="admin-section animate d4">
                <h3>{t('admin_admins_list')}</h3>
                <div className="admin-admins-list">
                  {admins.map((email, i) => (
                    <div className="admin-admins-row" key={email}>
                      <span className="aar-index">{i + 1}</span>
                      <span className="aar-email">{email}</span>
                      <span className="aar-date">{t('admin_added')}</span>
                      {isSuper && (
                        <button className="btn-sm danger" onClick={() => handleRemoveAdmin(email)}>
                          {t('admin_remove')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {admins.length === 0 && (
              <div className="admin-empty animate d3">
                <p>{t('admin_no_admins')}</p>
              </div>
            )}
          </>
        )}

        {tab === 'settings' && (
          <>
            <h2 className="animate">{t('admin_settings')}</h2>
            <div className="admin-settings animate d1">
              <div className="setting-item">
                <div><strong>{t('admin_settings')}</strong><p>BSF Library</p></div>
                <button className="btn-sm" onClick={() => showMsg(t('admin_coming_soon'), 'success')}>{t('admin_edit')}</button>
              </div>
              <div className="setting-item">
                <div><strong>{t('admin_status_admin')}</strong><p>{store.SUPER_ADMIN}</p></div>
                <button className="btn-sm" onClick={() => showMsg(t('admin_coming_soon'), 'success')}>{t('admin_edit')}</button>
              </div>
              <div className="setting-item">
                <div><strong>Firebase Project</strong><p>shadow-anime-26eb1</p></div>
                <button className="btn-sm" onClick={() => showMsg(t('admin_coming_soon'), 'success')}>{t('admin_edit')}</button>
              </div>
              <div className="setting-item">
                <div><strong>{t('admin_admins_count')}</strong><p>{admins.length + 1}</p></div>
                <button className="btn-sm" onClick={() => setTab('admins')}>{t('admin_admin_manage')}</button>
              </div>
              <div className="setting-item">
                <div><strong>{t('admin_protected')}</strong><p className="status-ok">{t('admin_protected')}</p></div>
                <button className="btn-sm" onClick={() => showMsg(t('admin_protected'), 'success')}>{t('admin_test')}</button>
              </div>
              <div className="setting-item">
                <div><strong>{t('profile_clear_data')}</strong><p className="status-warn">⚠️ {t('profile_clear_data')}</p></div>
                <button className="btn-sm danger" onClick={() => { if (confirm(t('admin_delete_confirm'))) { store.clearAll(); showMsg(t('admin_deleted'), 'success') } }}>{t('admin_delete')}</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
