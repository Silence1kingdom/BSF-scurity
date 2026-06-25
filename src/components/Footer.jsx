import { Link } from 'react-router-dom'
import { useLang } from '../lib/i18n'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer>
      <div className="footer-links">
        <Link to="/">{t('nav_home')}</Link>
        <Link to="/books">{t('nav_books')}</Link>
        <Link to="/cybersecurity">{t('nav_cyber')}</Link>
        <Link to="/exam">{t('nav_exam')}</Link>
        <Link to="/dictionary">{t('nav_dict')}</Link>
        <Link to="/leaderboard">{t('nav_leaderboard')}</Link>
      </div>
      <p>🛡️ BSF Library | {t('footer_rights')} © 2026</p>
    </footer>
  )
}
