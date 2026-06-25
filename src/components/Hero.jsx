import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/i18n'

export default function Hero() {
  const { t } = useLang()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    let animId

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const cols = Math.floor(canvas.width / 14)
    const drops = Array(cols).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 14, 10, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff41'
      ctx.font = '14px monospace'
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * 14, drops[i] * 14)
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="hero" id="home">
      <div className="matrix-bg"><canvas ref={canvasRef} /></div>
      <div className="glitch-wrapper">
        <h1 className="glitch" data-text={t('hero_title')}>
          {t('hero_title').split(' ')[0]} <span className="highlight">{t('hero_title').split(' ').slice(1).join(' ')}</span>
        </h1>
      </div>
      <p className="animate d1">
        {t('hero_desc')}
      </p>
      <div className="hero-btns animate d2">
        <Link to="/books" className="btn btn-primary">{t('hero_btn_books')}</Link>
        <Link to="/cybersecurity" className="btn btn-outline">{t('hero_btn_learn')}</Link>
      </div>
    </section>
  )
}
