const AI_KEYS = 'bsf_ai_keys'
const AI_PROVIDER = 'bsf_ai_provider'
const AI_CACHE = 'bsf_ai_cache'

export function getAIKeys() {
  try {
    return JSON.parse(localStorage.getItem(AI_KEYS)) || {}
  } catch { return {} }
}

export function getAIProvider() {
  return localStorage.getItem(AI_PROVIDER) || 'gemini'
}

export function saveAIKeys(keys) {
  localStorage.setItem(AI_KEYS, JSON.stringify(keys))
}

export function saveAIProvider(provider) {
  localStorage.setItem(AI_PROVIDER, provider)
}

export function hasAIReady() {
  const keys = getAIKeys()
  const provider = getAIProvider()
  return provider === 'gemini' ? !!keys.gemini : !!keys.openai
}

function getCached(q) {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE)) || {}
    return cache[q]
  } catch { return null }
}

function setCached(q, answer) {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE)) || {}
    cache[q] = answer
    // Keep only last 100
    const keys = Object.keys(cache)
    if (keys.length > 100) {
      delete cache[keys[0]]
    }
    localStorage.setItem(AI_CACHE, JSON.stringify(cache))
  } catch {}
}

export async function callGemini(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })
  })
  if (!res.ok) {
    let err
    try { err = await res.text() } catch { err = res.statusText }
    throw new Error(`Gemini (${res.status}): ${err?.substring(0, 200) || 'خطأ غير معروف'}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response from Gemini')
  return text
}

export async function callOpenAI(prompt, apiKey) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error (${res.status}): ${err}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('No response from OpenAI')
  return text
}

export async function getAIResponse(userQuery, conversationHistory = []) {
  const cached = getCached(userQuery)
  if (cached) return cached

  const keys = getAIKeys()
  const provider = getAIProvider()

  const systemPrompt = `أنت مساعد BSF AI — خبير في الأمن السيبراني والبرمجة والشبكات.
أجب باللغة العربية الفصحى دائماً.
كن دقيقاً ومختصراً (لا تتجاوز 500 كلمة).
استخدم تنسيق Markdown: \`\`\`للأكواد، **للتأكيد**، • للقوائم.
إذا سأل عن كود، اكتب الكود كاملاً مع مثال استخدام.
إذا سأل عن خطأ، اشرح السبب والحل.
إذا سأل عن مفهوم، اشرحه ببساطة مع أمثلة.`

  let fullPrompt = systemPrompt + '\n\n'
  if (conversationHistory.length > 0) {
    fullPrompt += 'تاريخ المحادثة:\n'
    for (const msg of conversationHistory.slice(-6)) {
      fullPrompt += `${msg.role === 'user' ? 'المستخدم' : 'المساعد'}: ${msg.content}\n`
    }
    fullPrompt += '\n'
  }
  fullPrompt += `السؤال الحالي: ${userQuery}\n\nأجب:`

  let answer
  if (provider === 'gemini' && keys.gemini) {
    answer = await callGemini(fullPrompt, keys.gemini)
  } else if (provider === 'openai' && keys.openai) {
    answer = await callOpenAI(fullPrompt, keys.openai)
  } else {
    throw new Error('لا يوجد مفتاح API نشط')
  }

  setCached(userQuery, answer)
  return answer
}

export async function generateSmartQuestions(context, count = 4) {
  const keys = getAIKeys()
  const provider = getAIProvider()
  const apiKey = provider === 'gemini' ? keys.gemini : keys.openai
  if (!apiKey) return []

  const prompt = `اقترح ${count} أسئلة ذكية في الأمن السيبراني بناءً على هذا السياق: "${context || 'عام'}".
كل سؤال يكون سطر واحد فقط بالعربية.
لا ترقمها ولا تضف تنسيق.
اكتب السؤال فقط بدون شرح.
مثال: ما هو الفرق بين التشفير المتماثل وغير المتماثل؟`

  try {
    let text
    if (provider === 'gemini') {
      text = await callGemini(prompt, apiKey)
    } else {
      text = await callOpenAI(prompt, apiKey)
    }
    return text.split('\n').filter(s => s.trim().length > 5).slice(0, count)
  } catch {
    return []
  }
}
