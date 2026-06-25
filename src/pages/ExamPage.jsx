import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getRandomQuestions, allQuestions, sections } from '../data/examData'
import { useLang } from '../lib/i18n'

const EXAM_DURATION = 30 * 60
const QUESTIONS_PER_EXAM = 20

function loadHistory() {
  try { return JSON.parse(localStorage.getItem('bsf_exam_history')) || [] }
  catch { return [] }
}

function saveHistory(entry) {
  const h = loadHistory()
  h.unshift(entry)
  localStorage.setItem('bsf_exam_history', JSON.stringify(h.slice(0, 20)))
}

export default function ExamPage() {
  const { t, lang } = useLang()
  const [phase, setPhase] = useState('menu')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState(loadHistory())

  const timerRef = useRef()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [phase])

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
  }, [phase, current])

  const startExam = useCallback(() => {
    const qs = getRandomQuestions(QUESTIONS_PER_EXAM)
    setQuestions(qs)
    setCurrent(0)
    setAnswers({})
    setTimeLeft(EXAM_DURATION)
    setSubmitted(false)
    setScore(0)
    setPhase('exam')
  }, [])

  useEffect(() => {
    if (phase !== 'exam' || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); finishExam(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, submitted])

  function finishExam() {
    clearInterval(timerRef.current)
    let s = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) s++
    })
    setScore(s)
    setSubmitted(true)
    const entry = {
      date: Date.now(),
      score: s,
      total: questions.length,
      percentage: Math.round(s / questions.length * 100),
      timeTaken: EXAM_DURATION - timeLeft,
    }
    saveHistory(entry)
    setHistory(loadHistory())
  }

  function handleAnswer(qIdx, optIdx) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length * 100) : 0

  if (phase === 'menu') {
    const best = history.length > 0 ? Math.max(...history.map(h => h.percentage)) : 0
    const last = history.length > 0 ? history[0] : null
    const avg = history.length > 0
      ? Math.round(history.reduce((a, h) => a + h.percentage, 0) / history.length)
      : 0

    return (
      <section className="section exam-page" style={{ paddingTop: 120 }}>
        <div className="section-header animate">
          <h2>{t('exam_title')} <span className="badge">{allQuestions.length} {t('exam_badge')}</span></h2>
          <div className="section-divider" />
          <p>{t('exam_desc')}</p>
        </div>

        <div className="exam-menu animate d1">
          <div className="exam-info-cards">
            <div className="info-card"><div className="eic-num">{QUESTIONS_PER_EXAM}</div><div className="eic-label">{t('exam_questions_count')}</div></div>
            <div className="info-card"><div className="eic-num">30</div><div className="eic-label">{t('exam_duration')}</div></div>
            <div className="info-card"><div className="eic-num">{allQuestions.length}</div><div className="eic-label">{t('exam_total_qs')}</div></div>
            <div className="info-card"><div className="eic-num">{sections.length}</div><div className="eic-label">{t('exam_sections_count')}</div></div>
          </div>

          <button className="btn btn-primary exam-start-btn" onClick={startExam}>
            {t('exam_start')}
          </button>

          {history.length > 0 && (
            <div className="exam-stats animate d2">
              <h3>{t('exam_stats')}</h3>
              <div className="exam-stats-grid">
                <div className="exam-stat-card"><div className="esc-num">{avg}%</div><div className="esc-label">{t('exam_avg')}</div></div>
                <div className="exam-stat-card"><div className="esc-num">{best}%</div><div className="esc-label">{t('exam_best')}</div></div>
                <div className="exam-stat-card"><div className="esc-num">{history.length}</div><div className="esc-label">{t('exam_tests_count')}</div></div>
                {last && <div className="exam-stat-card"><div className="esc-num">{last.percentage}%</div><div className="esc-label">{t('exam_last')}</div></div>}
              </div>

              <h4 style={{ marginTop: 24, marginBottom: 12 }}>{t('exam_history')}</h4>
              <div className="exam-history">
                {history.map((h, i) => (
                  <div className="exam-history-row" key={i}>
                    <span className="ehr-date">{new Date(h.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    <span className="ehr-score" style={{ color: h.percentage >= 70 ? 'var(--primary)' : h.percentage >= 40 ? '#ffc107' : '#ff1744' }}>
                      {h.score}/{h.total} ({h.percentage}%)
                    </span>
                    <span className="ehr-time">⏱ {formatDuration(h.timeTaken)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="cta-back">
          <Link to="/" className="btn btn-outline">{t('back_home')}</Link>
        </div>
      </section>
    )
  }

  if (phase === 'exam') {
    const q = questions[current]

    return (
      <section className="section exam-page" style={{ paddingTop: 120 }}>
        <div className="exam-header animate">
          <div className="exam-timer" style={{ color: timeLeft < 60 ? '#ff1744' : 'var(--primary)' }}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <div className="exam-progress-text">{current + 1} / {questions.length}</div>
          <div className="exam-progress-bar-bg">
            <div className="exam-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="exam-card animate">
          <div className="exam-q-section">
            <span className="tag tag-green">{t('exam_sections_count')} {sections.find(s => s.num === q.section)?.num}</span>
            <span className="exam-section-name">{sections.find(s => s.num === q.section)?.name}</span>
          </div>
          <h3 className="exam-q-text">{current + 1}. {q.q}</h3>
          <div className="exam-options">
            {q.options.map((opt, j) => {
              let cls = 'exam-option'
              if (submitted) {
                if (j === q.answer) cls += ' correct'
                else if (j === answers[current] && j !== q.answer) cls += ' wrong'
              } else if (answers[current] === j) {
                cls += ' selected'
              }
              return (
                <button key={j} className={cls} onClick={() => handleAnswer(current, j)} disabled={submitted}>
                  <span className="eo-letter">{String.fromCharCode(65 + j)}</span>
                  <span className="eo-text">{opt}</span>
                  {submitted && j === q.answer && <span className="eo-mark">✅</span>}
                  {submitted && j === answers[current] && j !== q.answer && <span className="eo-mark">❌</span>}
                </button>
              )
            })}
          </div>

          <div className="exam-nav">
            <button className="btn btn-outline" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>{t('exam_prev')}</button>
            <span className="exam-answered">{Object.keys(answers).length} / {questions.length} {t('exam_answered')}</span>
            {current < questions.length - 1 ? (
              <button className="btn btn-outline" onClick={() => setCurrent(c => c + 1)}>{t('exam_next')}</button>
            ) : (
              <button className="btn btn-primary" disabled={Object.keys(answers).length < questions.length} onClick={finishExam}>
                {t('exam_finish')}
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  const sectionResults = {}
  questions.forEach((q, i) => {
    if (!sectionResults[q.section]) sectionResults[q.section] = { correct: 0, total: 0 }
    sectionResults[q.section].total++
    if (answers[i] === q.answer) sectionResults[q.section].correct++
  })

  const grade = score >= 17 ? t('exam_grade_excellent') : score >= 14 ? t('exam_grade_verygood') : score >= 10 ? t('exam_grade_good') : score >= 7 ? t('exam_grade_ok') : t('exam_grade_bad')

  return (
    <section className="section exam-page" style={{ paddingTop: 120 }}>
      <div className="section-header animate">
        <h2>{t('quiz_your_score')}</h2>
        <div className="section-divider" />
      </div>

      <div className="exam-result animate d1">
        <div className="exam-score-ring">
          <svg viewBox="0 0 36 36" className="ring-svg">
            <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="ring-fg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              strokeDasharray={`${score / questions.length * 100}, 100`} />
          </svg>
          <div className="ring-text">{score}/{questions.length}</div>
        </div>
        <div className="exam-result-text">
          <div className="exam-grade">{grade}</div>
          <div className="exam-percentage">{Math.round(score / questions.length * 100)}%</div>
          <div className="exam-time-taken">⏱ {formatDuration(EXAM_DURATION - timeLeft)}</div>
        </div>
      </div>

      <div className="exam-section-breakdown animate d2">
        <h3>{t('exam_breakdown')}</h3>
        <div className="exam-section-grid">
          {Object.entries(sectionResults).map(([num, r]) => {
            const s = sections.find(s => s.num === Number(num))
            const pct = Math.round(r.correct / r.total * 100)
            return (
              <div className="exam-section-result" key={num}>
                <div className="esr-header">
                  <span className="tag tag-green">{t('exam_sections_count')} {num}</span>
                  <span>{s?.name}</span>
                </div>
                <div className="esr-bar-bg">
                  <div className="esr-bar-fill" style={{ width: `${pct}%`, background: pct >= 70 ? 'var(--primary)' : pct >= 40 ? '#ffc107' : '#ff1744' }} />
                </div>
                <div className="esr-text">{r.correct}/{r.total} ({pct}%)</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="exam-actions animate d3">
        <button className="btn btn-primary" onClick={startExam}>{t('exam_new')}</button>
        <button className="btn btn-outline" onClick={() => { setPhase('menu'); setHistory(loadHistory()) }}>{t('exam_back_stats')}</button>
        <Link to="/" className="btn btn-outline">{t('nav_home')}</Link>
      </div>
    </section>
  )
}
