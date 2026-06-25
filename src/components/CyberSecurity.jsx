import { sections } from '../data/cyberData.jsx'

export default function CyberSecurity() {
  return (
    <section className="section" id="cybersecurity">
      <div className="section-header animate">
        <h2>🛡️ الأمن السيبراني <span className="badge">دليل كامل</span></h2>
        <div className="section-divider" />
        <p>شرح شامل لمفاهيم الأمن السيبراني من الأساسيات إلى الاحتراف.</p>
      </div>

      {sections.map((s, i) => (
        <div className={`cyber-section animate d${(i % 3) + 1}`} key={s.num}>
          <h3><span className="num">{s.num}</span> {s.title}</h3>
          {s.content}
        </div>
      ))}
    </section>
  )
}
