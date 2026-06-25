import { useState } from 'react'
import { store } from '../lib/store'
import { useLang } from '../lib/i18n'

export default function QuizBox({ sectionNum, quiz }) {
  const { t } = useLang()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const saved = store.getQuizResult(sectionNum)

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleSubmit = () => {
    let score = 0
    const total = quiz.questions.length
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++
    })
    store.saveQuizResult(sectionNum, score, total)
    setSubmitted(true)
  }

  const total = quiz.questions.length
  const answered = Object.keys(answers).length

  if (saved && !submitted) {
    return (
      <div className="quiz-box">
        <div className="quiz-result-card">
          <span>✅</span>
          <span>{t('quiz_prev_score')} <strong>{saved.score}/{saved.total}</strong></span>
          <button className="btn-sm" onClick={() => { setAnswers({}); setSubmitted(true) }}>{t('quiz_retry')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-box">
      <h4>{quiz.title}</h4>
      {quiz.questions.map((q, i) => (
        <div key={i} className={`quiz-question${submitted ? ' submitted' : ''}`}>
          <p className="quiz-q"><strong>{i + 1}.</strong> {q.q}</p>
          <div className="quiz-options">
            {q.options.map((opt, j) => {
              let cls = 'quiz-option'
              if (submitted) {
                if (j === q.answer) cls += ' correct'
                else if (j === answers[i] && j !== q.answer) cls += ' wrong'
              } else if (answers[i] === j) {
                cls += ' selected'
              }
              return (
                <button key={j} className={cls} onClick={() => handleSelect(i, j)}>
                  {opt}
                  {submitted && j === q.answer && ' ✅'}
                  {submitted && j === answers[i] && j !== q.answer && ' ❌'}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {!submitted && (
        <button className="btn btn-primary" disabled={answered < total} onClick={handleSubmit}>
          {answered < total ? `${t('quiz_answer_remaining')} ${total - answered} ${t('quiz_questions')}` : t('quiz_submit')}
        </button>
      )}
      {submitted && (
        <div className="quiz-result">
          {t('quiz_result')} {Object.keys(answers).filter(i => quiz.questions[i].answer === answers[i]).length} / {total}
        </div>
      )}
    </div>
  )
}
