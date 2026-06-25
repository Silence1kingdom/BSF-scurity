import { useState, useEffect } from 'react'
import { useLang } from '../lib/i18n'

function loadComments(key) {
  try { return JSON.parse(localStorage.getItem('bsf_comments_' + key)) || [] } catch { return [] }
}
function saveComments(key, comments) {
  localStorage.setItem('bsf_comments_' + key, JSON.stringify(comments))
}

export default function Comments({ sectionKey, sectionTitle }) {
  const { t, lang } = useLang()
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    setComments(loadComments(sectionKey))
  }, [sectionKey])

  const addComment = () => {
    if (!text.trim()) return
    const c = {
      id: Date.now(),
      name: name.trim() || t('profile_user'),
      text: text.trim(),
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US'),
    }
    const updated = [c, ...comments]
    setComments(updated)
    saveComments(sectionKey, updated)
    setText('')
  }

  const deleteComment = (id) => {
    const updated = comments.filter(c => c.id !== id)
    setComments(updated)
    saveComments(sectionKey, updated)
  }

  return (
    <div className="comments-section">
      <h4>{t('comments_title')} {sectionTitle}</h4>

      <div className="comments-form">
        <input
          type="text"
          placeholder={t('comments_name')}
          value={name}
          onChange={e => setName(e.target.value)}
          className="comments-input"
        />
        <textarea
          placeholder={t('comments_placeholder')}
          value={text}
          onChange={e => setText(e.target.value)}
          className="comments-textarea"
          rows="3"
        />
        <button className="btn btn-primary" disabled={!text.trim()} onClick={addComment}>
          {t('comments_add')}
        </button>
      </div>

      <div className="comments-list">
        {comments.length === 0 && <p className="comments-empty">{t('comments_empty')}</p>}
        {comments.map(c => (
          <div className="comment-item" key={c.id}>
            <div className="comment-header">
              <span className="comment-name">👤 {c.name}</span>
              <span className="comment-date">{c.date}</span>
              <button className="comment-delete" onClick={() => deleteComment(c.id)}>🗑️</button>
            </div>
            <p className="comment-text">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
