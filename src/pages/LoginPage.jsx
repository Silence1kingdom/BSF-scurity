import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, signInWithGoogle, onAuthChange } from '../lib/firebase'
import { useLang } from '../lib/i18n'

export default function LoginPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(user => {
      if (user) navigate('/profile', { replace: true })
      else setChecking(false)
    })
    return unsub
  }, [navigate])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      navigate('/profile', { replace: true })
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(t('login_error'))
      }
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-loader" />
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card animate">
        <div className="login-icon">🛡️</div>
        <h1>{t('login_title')}</h1>
        <p className="login-subtitle">{t('login_subtitle')}</p>
        <p className="login-desc">{t('login_desc')}</p>

        {error && <div className="login-error">{error}</div>}

        <button
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loader" />
          ) : (
            <>
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="google-icon"
              />
              <span>{t('login_google')}</span>
            </>
          )}
        </button>

        <p className="login-footer">
          {t('login_terms')}{' '}
          <Link to="/">{t('login_terms_link')}</Link>
        </p>
      </div>

      <div className="login-bg" />
    </div>
  )
}
