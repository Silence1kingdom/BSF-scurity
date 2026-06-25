const books = [
  {
    icon: '🐧', title: 'دليل أوامر Linux',
    desc: 'شرح كامل لأوامر لينكس من الأوامر الأساسية إلى المتقدمة مع أمثلة عملية.',
    pages: '83', file: 'Linux_Commands_Compendium.pdf',
  },
  {
    icon: '🐉', title: 'موسوعة أدوات Kali',
    desc: 'دليل شامل لأدوات Kali Linux واستخداماتها في الاختبارات الأمنية والاختراق.',
    pages: '100+', file: 'Kali_Tools_Encyclopedia.pdf',
  },
  {
    icon: '🌐', title: 'دليل الشبكات',
    desc: 'أساسيات الشبكات، البروتوكولات، TCP/IP، OSI، والأمان في الشبكات.',
    pages: '90+', file: 'Networking_Guide.pdf',
  },
  {
    icon: '🐍', title: 'دليل لغة بايثون',
    desc: 'شرح لغة Python كاملة من الصفر إلى الاحتراف مع أمثلة تطبيقية.',
    pages: '60+', file: 'Python_Guide.pdf',
  },
  {
    icon: '⚡', title: 'دليل لغة C++',
    desc: 'شرح لغة C++ كاملة من الأساسيات إلى OOP، Templates، STL، والمؤشرات الذكية.',
    pages: '50+', file: 'C++.pdf',
  },
  {
    icon: '🗡️', title: 'أدوات Kali - المجلد 2',
    desc: 'استمرار شرح أدوات Kali Linux مع تغطية أدوات متقدمة للاختبارات الأمنية.',
    pages: '70+', file: 'Kali_Tools_Vol2.pdf',
  },
]

export default function Books() {
  return (
    <section className="section" id="books">
      <div className="section-header animate">
        <h2>📖 المكتبة <span className="badge">6 كتب</span></h2>
        <div className="section-divider" />
        <p>مجموعة من الكتب والشروحات الأساسية في الأمن السيبراني ولغات البرمجة.</p>
      </div>

      <div className="books-grid">
        {books.map((b, i) => (
          <div className={`book-card animate d${(i % 4) + 1}`} key={b.file}>
            <div className="icon">{b.icon}</div>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
            <div className="meta">
              <span>📄 {b.pages} صفحة</span>
              <span>📅 2026</span>
            </div>
            <a href={b.file} className="btn-sm" target="_blank" rel="noreferrer">
              📥 تحميل PDF
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
