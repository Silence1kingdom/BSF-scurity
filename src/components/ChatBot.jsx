import { useState, useRef, useEffect } from 'react'
import { knowledge } from '../data/knowledge'
import { useLang } from '../lib/i18n'
import { getAIResponse, getAIKeys, getAIProvider, saveAIKeys, saveAIProvider, hasAIReady, generateSmartQuestions } from '../lib/ai'

function normalizedSimilarity(a, b) {
  if (!a || !b) return 0
  let matches = 0
  const aLower = a.toLowerCase().trim()
  const bLower = b.toLowerCase().trim()
  const minLen = Math.min(aLower.length, bLower.length)
  for (let i = 0; i < minLen; i++) {
    if (aLower[i] === bLower[i]) matches++
  }
  return matches / Math.max(aLower.length, bLower.length, 1)
}

function findBestMatch(input) {
  const q = input.toLowerCase().trim().replace(/[؟?،,!\-.]/g, '')
  const words = q.split(/\s+/).filter(w => w.length > 1)

  let bestScore = 0
  let bestAnswer = null
  let bestCat = ''

  for (const entry of knowledge) {
    for (const kw of entry.keywords) {
      const k = kw.toLowerCase().trim()
      let score = 0

      if (q === k) { score = 1.0 }
      else if (q.includes(k)) { score = 0.85 + (k.length / Math.max(q.length, 1)) * 0.1 }
      else if (k.includes(q) && q.length > 2) { score = 0.75 }
      else {
        const sim = normalizedSimilarity(q, k)
        if (sim > 0.5) { score = sim * 0.7 }
        const kwWords = k.split(/\s+/).filter(w => w.length > 1)
        if (kwWords.length > 0) {
          const overlap = kwWords.filter(w => words.includes(w)).length
          const ratio = overlap / Math.max(kwWords.length, words.length, 1)
          if (ratio > 0.3) { score = Math.max(score, ratio * 0.8) }
        }
        for (const w of words) {
          for (const kw_w of kwWords) {
            if (w.length > 2 && kw_w.length > 2 &&
                (kw_w.includes(w) || w.includes(kw_w))) {
              score = Math.max(score, 0.55)
            }
          }
        }
      }

      if (score > bestScore) {
        bestScore = score
        bestAnswer = entry.a
        bestCat = entry.cat
      }
    }
  }

  return { answer: bestAnswer, category: bestCat, score: bestScore }
}

function detectIntent(q) {
  const lq = q.toLowerCase()
  if (/^(write|اكتب|قول|عطيني|create|make|build)/.test(lq) &&
      /(code|script|كود|سكريبت|program|function)/.test(lq))
    return 'code'
  if (/^(explain|شرح|عرف|describe|what is|ما هو|ما هي|إيه)/.test(lq))
    return 'explain'
  if (/(error|خطأ|غلط|مشكلة|bug|fix|صلح|solve|problem|issue|not working|مش شغال|fatal|fail)/.test(lq))
    return 'fix'
  if (/(command|أمر|how to use|طريقة استخدام|usage)/.test(lq) &&
      !/(code|script|كود)/.test(lq))
    return 'command'
  if (/(analyze|حلل|تحليل|check|افحص|scan|review)/.test(lq))
    return 'analyze'
  if (/(diff|فرق|between|vs|مقارنة|الفرق)/.test(lq))
    return 'compare'
  return 'general'
}

const defaultSuggestions = [
  'اكتب سكريبت بايثون لفحص منافذ',
  'ما هو الأمن السيبراني؟',
  'إزاي أبدأ في المجال؟',
  'اشرح أمر nmap -sV',
  'عندي خطأ في npm install',
  'ما هو SQL Injection؟',
  'نصيحة باسورد قوي',
  'الفرق بين TCP و UDP',
]

const followUpsByCategory = {
  'عام': 'تقدر تسأل عن أي مفهوم أو كود أو أمر.',
  'هجمات': 'اقرأ عن طرق الحماية من الهجمات في قسم السايبر.',
  'أدوات': 'جرب TryHackMe للتدرب على الأدوات دي.',
  'شهادات': 'شوف المسار الوظيفي الكامل.',
  'مسارات': 'ابدأ مع TryHackMe أو Hack The Box.',
  'مفاهيم': 'في قاموس المصطلحات شرح مفصل.',
  'شبكات': 'اقرأ دليل الشبكات في صفحة الكتب.',
  'تشفير': 'تقدر تتعلم أكثر في قسم السايبر.',
  'أكواد': 'جرب تكتب أكواد بنفسك على Replit.',
  'أوامر': 'طبق الأوامر في Kali Linux أو أي توزيعة.',
  'تصليح': 'جرب تبحث عن الخطأ في StackOverflow كمان.',
  'تحليل': 'جرب أدوات التحليل بنفسك.',
  'سحابة': 'AWS و Azure عندهم موارد مجانية.',
  'ويب': 'OWASP Top 10 هو المرجع الأول.',
  'أنظمة': 'Linux أساسي جداً لأي متخصص أمن.',
  'قوانين': 'الأخلاقيات أهم حاجة في المجال.',
}

export default function ChatBot() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: t('chat_hello'), showSuggestions: true },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [context, setContext] = useState({ lastQuestion: '', lastAnswer: '', lastCategory: '' })
  const [history, setHistory] = useState([])
  const [aiReady, setAiReady] = useState(hasAIReady())
  const [provider, setProvider] = useState(getAIProvider())
  const [geminiKey, setGeminiKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false)
  const listRef = useRef()
  const inputRef = useRef()
  const settingsRef = useRef()

  useEffect(() => {
    const keys = getAIKeys()
    if (keys.gemini) setGeminiKey(keys.gemini)
    if (keys.openai) setOpenaiKey(keys.openai)
  }, [])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [msgs, typing])

  useEffect(() => {
    if (open && inputRef.current && !showSettings) inputRef.current.focus()
  }, [open, showSettings])

  useEffect(() => {
    if (showSettings && settingsRef.current) settingsRef.current.focus()
  }, [showSettings])

  useEffect(() => {
    const handleClick = (e) => {
      if (showSettings && settingsRef.current && !settingsRef.current.contains(e.target) &&
          !e.target.closest('.ch-settings-btn')) {
        setShowSettings(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showSettings])

  const addMsg = (from, text, opts = {}) => {
    setMsgs(prev => [...prev, { from, text, ...opts }])
  }

  const saveSettings = () => {
    saveAIKeys({ gemini: geminiKey.trim(), openai: openaiKey.trim() })
    saveAIProvider(provider)
    setAiReady(hasAIReady())
    setShowSettings(false)
    addMsg('bot', provider === 'gemini'
      ? (geminiKey.trim() ? '✅ **تم تفعيل Google Gemini!** الآن أقدر أجاوب على أي سؤال بشكل ذكي.' : '❌ تم إزالة مفتاح Gemini.')
      : (openaiKey.trim() ? '✅ **تم تفعيل OpenAI!** الآن أقدر أجاوب على أي سؤال بشكل ذكي.' : '❌ تم إزالة مفتاح OpenAI.'))
  }

  const handleSend = async (customInput) => {
    const q = (customInput || input).trim()
    if (!q || typing) return
    setInput('')
    setShowSmartSuggestions(false)

    addMsg('user', q)
    setTyping(true)

    try {
      // Try AI first if API key is available
      if (aiReady) {
        try {
          const convHistory = [...history, { role: 'user', content: q }]
          console.log('🤖 Sending to AI provider:', getAIProvider(), 'key length:', getAIKeys()[getAIProvider()]?.length)
          const aiReply = await getAIResponse(q, history)
          setHistory(convHistory.concat([{ role: 'assistant', content: aiReply }]))
          setContext({ lastQuestion: q, lastAnswer: aiReply, lastCategory: '' })
          setShowSmartSuggestions(true)
          addMsg('bot', aiReply, { showSmartSuggestions: true })
          setTyping(false)
          return
        } catch (err) {
          const errMsg = err.message || 'خطأ غير معروف'
          console.error('🤖 AI failed:', errMsg)
          addMsg('bot', `⚠️ **الـ AI واجه مشكلة:**\n\`${errMsg.substring(0, 300)}\`\n\n🔄 بستخدم المعرفة المحلية بدلاً منه...`)
        }
      }

      // Local knowledge base fallback
      setTimeout(() => {
        const intent = detectIntent(q)
        const result = findBestMatch(q)
        let reply = ''

        if (result.answer && result.score > 0.3) {
          reply = result.answer
          if (context.lastCategory &&
              result.category === context.lastCategory &&
              context.lastQuestion !== q) {
            const fb = followUpsByCategory[result.category] || followUpsByCategory['عام']
            reply += '\n\n💡 **للاستزادة:** ' + fb
          }
          setContext({ lastQuestion: q, lastAnswer: result.answer, lastCategory: result.category })
          addMsg('bot', reply, { showSuggestions: result.score < 0.5 })
        } else {
          if (context.lastAnswer && context.lastCategory) {
            const combined = findBestMatch(q + ' ' + context.lastCategory)
            if (combined.answer && combined.score > 0.3) {
              reply = `بناءً على سؤالك السابق عن **${context.lastCategory}**:\n\n${combined.answer}`
            } else {
              reply = generateFallback(q, intent)
            }
          } else {
            reply = generateFallback(q, intent)
          }
          addMsg('bot', reply, { showSuggestions: true })
        }
        setTyping(false)
      }, 400 + Math.random() * 600)
    } catch (err) {
      addMsg('bot', '❌ **عذرا، حدث خطأ.**\n\n`' + err.message + '`')
      setTyping(false)
    }
  }

  const generateFallback = (q, intent) => {
    const related = knowledge.filter(e => {
      const kw = e.keywords.join(' ')
      const words = q.split(/\s+/)
      return words.some(w => w.length > 2 && kw.includes(w))
    }).slice(0, 3)

    let reply = '🤔 **لم أجد إجابة دقيقة لسؤالك.**\n\n'

    if (related.length > 0) {
      reply += '**مواضيع مشابهة:**\n'
      reply += related.map(e => `• ${e.keywords[0]}`).join('\n')
      reply += '\n\n🔄 حاول تسأل بصيغة مختلفة.'
    } else {
      reply += '**جرب تسأل عن:**\n'
      reply += '• **أكواد:** اكتب سكريبت بايثون لمسح منافذ\n'
      reply += '• **أوامر:** اشرح أمر nmap -sV\n'
      reply += '• **أخطاء:** عندي خطأ في python module\n'
      reply += '• **تحليل:** حلل هجمة Ransomware\n'
      reply += '• **مفاهيم:** ما هو Zero Day؟\n'
      reply += '• **هجمات:** ما هو SQL Injection؟\n'
      reply += '• **شهادات:** الفرق بين CEH و OSCP\n'
      reply += '• **مسارات:** إزاي أبدأ في السايبر؟'
    }
    return reply
  }

  const handleSmartQuestions = async () => {
    const lastContext = context.lastQuestion || 'الأمن السيبراني'
    const questions = await generateSmartQuestions(lastContext)
    if (questions.length > 0) {
      addMsg('bot', '💡 **أسئلة ذكية مقترحة:**\n' + questions.map(q => `• ${q}`).join('\n'), { smartQuestions: questions })
    } else {
      addMsg('bot', '💡 **أسئلة ذكية مقترحة:**\n' + defaultSuggestions.slice(0, 4).map(q => `• ${q}`).join('\n'), { suggestions: defaultSuggestions.slice(0, 4) })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      <button className={`chatbot-toggle${open ? ' active' : ''}`} onClick={() => setOpen(!open)} title={t('chat_name')}>
        {open ? '✕' : '🤖'}
      </button>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="ch-header-left">
              <span className="ch-avatar">🤖</span>
              <div>
                <div className="ch-name">{t('chat_name')}</div>
                <div className="ch-status">
                  {aiReady ? '🟢 ' + provider.toUpperCase() : '🟡 محلي'}
                </div>
              </div>
            </div>
            <div className="ch-header-actions">
              <button className="ch-settings-btn" onClick={() => setShowSettings(!showSettings)} title="إعدادات API">
                ⚙️
              </button>
              <button className="ch-smart-btn" onClick={handleSmartQuestions} title={t('chat_smart') || 'أسئلة ذكية'}>
                💡
              </button>
              <button className="ch-clear" onClick={() => {
                setMsgs([{ from: 'bot', text: t('chat_cleared'), showSuggestions: true }])
                setContext({ lastQuestion: '', lastAnswer: '', lastCategory: '' })
                setHistory([])
              }} title={t('chat_clear')}>🗑️</button>
              <button className="ch-close" onClick={() => {
                setOpen(false)
                setShowSettings(false)
              }}>✕</button>
            </div>
          </div>

          <div className="chatbot-body" ref={listRef}>
            {showSettings && (
              <div className="chatbot-settings" ref={settingsRef} tabIndex={-1} dir="ltr">
                <h4 style={{ color: 'var(--primary)', margin: '0 0 12px', fontSize: '14px', textAlign: 'center' }}>
                  ⚙️ AI Settings
                </h4>

                <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--text)' }}>
                  <strong>Provider:</strong>
                </label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button
                    className={`provider-btn${provider === 'gemini' ? ' active' : ''}`}
                    onClick={() => setProvider('gemini')}
                    style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: provider === 'gemini' ? '2px solid var(--primary)' : '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: 12 }}
                  >
                    Gemini
                  </button>
                  <button
                    className={`provider-btn${provider === 'openai' ? ' active' : ''}`}
                    onClick={() => setProvider('openai')}
                    style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: provider === 'openai' ? '2px solid var(--primary)' : '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: 12 }}
                  >
                    OpenAI
                  </button>
                </div>

                {provider === 'gemini' ? (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--text)' }}>
                      <strong>Gemini API Key</strong>
                      <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style={{ color: 'var(--primary)', marginLeft: 6 }}>ⓘ</a>
                    </label>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={e => setGeminiKey(e.target.value)}
                      placeholder="AIza..."
                      style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 12 }}
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--text)' }}>
                      <strong>OpenAI API Key</strong>
                      <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" style={{ color: 'var(--primary)', marginLeft: 6 }}>ⓘ</a>
                    </label>
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={e => setOpenaiKey(e.target.value)}
                      placeholder="sk-..."
                      style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 12 }}
                    />
                  </div>
                )}

                <button
                  onClick={saveSettings}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: 'none', background: 'var(--primary)', color: '#000', fontWeight: 700, cursor: 'pointer' }}
                >
                  حفظ الإعدادات
                </button>

                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text)', opacity: 0.7, textAlign: 'center' }}>
                  💾 المفاتيح مخزنة محلياً في متصفحك فقط
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from}`}>
                <div className="msg-content">{formatText(m.text)}</div>
                {m.showSmartSuggestions && m.from === 'bot' && (
                  <SuggestionChips onSelect={handleSend} provider={provider} context={context.lastQuestion} />
                )}
                {m.showSuggestions && !m.showSmartSuggestions && m.from === 'bot' && i === msgs.length - 1 && (
                  <div className="msg-suggestions">
                    {defaultSuggestions.slice(0, 4).map((s, j) => (
                      <button key={j} className="suggestion-chip" onClick={() => handleSend(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {m.smartQuestions && m.from === 'bot' && (
                  <div className="msg-suggestions">
                    {m.smartQuestions.map((q, j) => (
                      <button key={j} className="suggestion-chip" onClick={() => handleSend(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                {m.suggestions && m.from === 'bot' && (
                  <div className="msg-suggestions">
                    {m.suggestions.map((s, j) => (
                      <button key={j} className="suggestion-chip" onClick={() => handleSend(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="chatbot-msg bot typing">
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <button className="ci-suggest" onClick={() => {
              const next = defaultSuggestions[Math.floor(Math.random() * defaultSuggestions.length)]
              handleSend(next)
            }} title="اقتراح سؤال">🎲</button>
            <input
              ref={inputRef}
              type="text"
              placeholder={t('chat_placeholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={typing}
            />
            <button className="ci-send" onClick={() => handleSend()} disabled={!input.trim() || typing}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function SuggestionChips({ onSelect, provider, context }) {
  const [chips, setChips] = useState(defaultSuggestions.slice(0, 4))

  useEffect(() => {
    if (!context) return
    generateSmartQuestions(context || 'عام', 4).then(qs => {
      if (qs.length > 0) setChips(qs)
    }).catch(() => {})
  }, [context])

  return (
    <div className="msg-suggestions">
      {chips.map((s, j) => (
        <button key={j} className="suggestion-chip" onClick={() => onSelect(s)}>
          {s}
        </button>
      ))}
    </div>
  )
}

function formatText(text) {
  const lines = text.split('\n')
  const result = []
  let inCodeBlock = false
  let codeLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('```') && !inCodeBlock) {
      inCodeBlock = true
      codeLines = []
      continue
    }

    if (line.startsWith('```') && inCodeBlock) {
      inCodeBlock = false
      result.push(
        <pre key={result.length} className="code-block" dir="ltr">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    if (line.startsWith('### ')) {
      result.push(<h4 key={result.length} className="msg-h4">{line.slice(4)}</h4>)
    } else if (line.startsWith('**') && line.endsWith('**')) {
      result.push(<strong key={result.length}>{line.slice(2, -2)}</strong>)
    } else if (line.startsWith('• ') || line.startsWith('- ')) {
      result.push(<div key={result.length} className="msg-bullet">{line.slice(2)}</div>)
    } else if (/^\d+[.)]/.test(line)) {
      result.push(<div key={result.length} className="msg-bullet">{line}</div>)
    } else if (line === '') {
      result.push(<br key={result.length} />)
    } else {
      result.push(<span key={result.length}>{line}<br /></span>)
    }
  }

  if (inCodeBlock && codeLines.length > 0) {
    result.push(
      <pre key={result.length} className="code-block" dir="ltr">
        <code>{codeLines.join('\n')}</code>
      </pre>
    )
  }

  return result
}
