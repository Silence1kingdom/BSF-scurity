export const sections = [
  {
    num: 1, title: 'مقدمة في الأمن السيبراني',
    content: (
      <>
        <p>
          <strong>الأمن السيبراني (Cybersecurity)</strong> هو مجال يهدف إلى حماية الأنظمة
          والشبكات والبرامج والبيانات من الهجمات الرقمية. تشمل هذه الهجمات أهدافاً مثل
          الوصول غير المصرح به، تغيير أو تدمير المعلومات الحساسة، ابتزاز الأموال، أو
          interruption للعمليات التجارية.
        </p>
        <div className="grid-2">
          <div className="info-card">
            <h4>🎯 أهداف الأمن السيبراني (CIA Triad)</h4>
            <ul>
              <li><strong>السرية (Confidentiality)</strong> - حماية البيانات من الوصول غير المصرح به</li>
              <li><strong>السلامة (Integrity)</strong> - ضمان عدم تعديل البيانات بشكل غير مصرح به</li>
              <li><strong>التوفر (Availability)</strong> - ضمان وصول المستخدمين المصرح لهم إلى المعلومات عند الحاجة</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>📊 إحصائيات مهمة (2025-2026)</h4>
            <ul>
              <li>متوسط تكلفة اختراق البيانات: <strong>$4.5 مليون</strong></li>
              <li>هجوم سيبراني يحدث كل <strong>39 ثانية</strong></li>
              <li><strong>95%</strong> من الاختراقات سببها خطأ بشري</li>
              <li>نقص <strong>3.5 مليون</strong> متخصص في الأمن السيبراني عالمياً</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    num: 2, title: 'أنواع التهديدات والهجمات',
    content: (
      <div className="grid-3">
        <div className="info-card">
          <h4>🦠 Malware</h4>
          <ul>
            <li><strong>فيروسات (Viruses)</strong> - تتكاثر بالارتباط ببرامج أخرى</li>
            <li><strong>ديدان (Worms)</strong> - تنتشر عبر الشبكات ذاتياً</li>
            <li><strong>أحصنة طروادة (Trojans)</strong> - تتنكر كبرامج شرعية</li>
            <li><strong>Ransomware</strong> - تشفير البيانات وطلب فدية</li>
            <li><strong>Spyware</strong> - تجسس وجمع معلومات</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🎣 Social Engineering</h4>
          <ul>
            <li><strong>Phishing</strong> - رسائل بريد مزيفة</li>
            <li><strong>Spear Phishing</strong> - استهداف محدد</li>
            <li><strong>Smishing</strong> - عبر الرسائل النصية</li>
            <li><strong>Vishing</strong> - عبر المكالمات الهاتفية</li>
            <li><strong>Pretexting</strong> - انتحال شخصية</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🌐 هجمات الشبكات</h4>
          <ul>
            <li><strong>DDoS</strong> - هجمات الحرمان من الخدمة</li>
            <li><strong>MITM</strong> - رجل في المنتصف</li>
            <li><strong>DNS Spoofing</strong> - تزوير DNS</li>
            <li><strong>Packet Sniffing</strong> - التنصت على الحزم</li>
            <li><strong>Session Hijacking</strong> - اختطاف الجلسات</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🔑 هجمات المصادقة</h4>
          <ul>
            <li><strong>Brute Force</strong> - تخمين كلمات المرور</li>
            <li><strong>Credential Stuffing</strong> - استغلال بيانات مسربة</li>
            <li><strong>Pass the Hash</strong> - سرقة الهاش</li>
            <li><strong>Kerberos Attack</strong> - هجمات Kerberos</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>💉 Web Attacks</h4>
          <ul>
            <li><strong>SQL Injection</strong> - حقن SQL</li>
            <li><strong>XSS</strong> - Cross-Site Scripting</li>
            <li><strong>CSRF</strong> - تزوير الطلبات</li>
            <li><strong>SSRF</strong> - تزوير الطلبات من الخادم</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🆕 هجمات متقدمة</h4>
          <ul>
            <li><strong>Zero-Day</strong> - استغلال ثغرات غير معروفة</li>
            <li><strong>APT</strong> - تهديدات متقدمة مستمرة</li>
            <li><strong>Supply Chain</strong> - هجمات سلسلة التوريد</li>
            <li><strong>AI-Powered</strong> - هجمات بالذكاء الاصطناعي</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    num: 3, title: 'أمن الشبكات (Network Security)',
    content: (
      <>
        <p>أمن الشبكات هو حماية البنية التحتية للشبكة من الوصول غير المصرح به، سوء الاستخدام، أو التعطيل.</p>
        <div className="grid-2">
          <div className="info-card">
            <h4>🛡️ أدوات الحماية</h4>
            <ul>
              <li><strong>Firewall</strong> - جدار ناري لتصفية الحركة</li>
              <li><strong>IDS/IPS</strong> - كشف/منع الاختراق</li>
              <li><strong>VPN</strong> - شبكة خاصة افتراضية</li>
              <li><strong>NAC</strong> - التحكم بالوصول للشبكة</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>🔍 بروتوكولات آمنة</h4>
            <ul>
              <li><strong>HTTPS/TLS</strong> - تشفير المواقع</li>
              <li><strong>SSH</strong> - اتصال آمن عن بعد</li>
              <li><strong>IPsec</strong> - أمان بروتوكول IP</li>
              <li><strong>DNSSEC</strong> - أمان DNS</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    num: 4, title: 'التشفير (Cryptography)',
    content: (
      <>
        <p>التشفير هو علم حماية المعلومات عن طريق تحويلها إلى صيغة غير مفهومة إلا لمن يملك مفتاح فك التشفير.</p>
        <div className="grid-2">
          <div className="info-card">
            <h4>🔐 التشفير المتماثل (Symmetric)</h4>
            <ul>
              <li><strong>AES</strong> - المعيار المتقدم (128/256 بت)</li>
              <li><strong>ChaCha20</strong> - حديث وسريع</li>
              <li><strong>DES/3DES</strong> - قديم، غير آمن حالياً</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>🔑 التشفير غير المتماثل (Asymmetric)</h4>
            <ul>
              <li><strong>RSA</strong> - الأكثر شيوعاً (2048/4096 بت)</li>
              <li><strong>ECC</strong> - تشفير المنحنيات الإهليلجية</li>
              <li><strong>Diffie-Hellman</strong> - تبادل المفاتيح</li>
            </ul>
          </div>
        </div>
        <div className="grid-2">
          <div className="info-card">
            <h4>🔏 دوال التجزئة (Hashing)</h4>
            <ul>
              <li><strong>SHA-256/512</strong> - آمن ومستخدم</li>
              <li><strong>SHA-3</strong> - الأحدث</li>
              <li><strong>bcrypt/argon2</strong> - لتخزين كلمات المرور</li>
              <li><strong>MD5/SHA-1</strong> - غير آمن!</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>📜 الشهادات الرقمية (PKI)</h4>
            <ul>
              <li><strong>CA</strong> - سلطة التصديق</li>
              <li><strong>X.509</strong> - معيار الشهادات</li>
              <li><strong>SSL/TLS</strong> - أمان المواقع</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    num: 5, title: 'أمن تطبيقات الويب',
    content: (
      <>
        <p>تطبيقات الويب هي أكثر الأهداف استهدافاً. إليك أهم الثغرات والوقاية منها:</p>
        <div className="grid-2">
          <div className="info-card">
            <h4>⚠️ OWASP Top 10 (2021)</h4>
            <ol style={{ marginRight: 18 }}>
              <li>ضعف التحكم في الوصول (Broken Access Control)</li>
              <li>أخطاء التشفير (Cryptographic Failures)</li>
              <li>حقن (Injection) - SQL, NoSQL, OS</li>
              <li>تصميم غير آمن (Insecure Design)</li>
              <li>خطأ في الإعدادات (Security Misconfiguration)</li>
              <li>مكونات ضعيفة (Vulnerable Components)</li>
              <li>فشل المصادقة (Authentication Failures)</li>
              <li>ضعف سلامة البيانات (Integrity Failures)</li>
              <li>فشل المراقبة (Monitoring Failures)</li>
              <li>تزوير الطلبات (SSRF)</li>
            </ol>
          </div>
          <div className="info-card">
            <h4>🛡️ ممارسات آمنة</h4>
            <ul>
              <li><strong>Input Validation</strong> - التحقق من المدخلات</li>
              <li><strong>Parameterized Queries</strong> - استعلامات محمية</li>
              <li><strong>CSP</strong> - سياسة أمان المحتوى</li>
              <li><strong>Rate Limiting</strong> - تحديد المعدل</li>
              <li><strong>Security Headers</strong> - روؤس أمان HTTP</li>
              <li><strong>2FA/MFA</strong> - مصادقة متعددة العوامل</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    num: 6, title: 'أمن أنظمة التشغيل',
    content: (
      <div className="grid-2">
        <div className="info-card">
          <h4>🐧 أمن Linux</h4>
          <ul>
            <li>إدارة الصلاحيات (chmod, chown, ACL)</li>
            <li>SELinux / AppArmor - أمان إضافي</li>
            <li>Auditd - مراقبة الأنشطة</li>
            <li>Fail2ban - منع الهجمات</li>
            <li>UFW / iptables - جدار ناري</li>
            <li>Lynis - أداة تدقيق أمني</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🪟 أمن Windows</h4>
          <ul>
            <li>Group Policy - سياسات المجموعة</li>
            <li>Windows Defender</li>
            <li>BitLocker - تشفير الأقراص</li>
            <li>UAC - التحكم بحساب المستخدم</li>
            <li>PowerShell Constrained Language</li>
            <li>Credential Guard</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    num: 7, title: 'منهجية الاختراق الأخلاقي',
    content: (
      <>
        <p>الاختراق الأخلاقي (Ethical Hacking) هو اختبار أمني مصرح به لاكتشاف الثغرات قبل المخترقين.</p>
        <div className="timeline">
          {[
            ['1. الاستطلاع (Reconnaissance)', 'جمع معلومات عن الهدف: نطاقات، IPs، بريد إلكتروني، موظفين. أدوات: whois, nslookup, theHarvester, Shodan, Google Dorks.'],
            ['2. المسح (Scanning)', 'مسح المنافذ والخدمات: Nmap, Masscan, Nessus, OpenVAS.'],
            ['3. الاستغلال (Exploitation)', 'استغلال الثغرات: Metasploit, Burp Suite, SQLMap, BeEF.'],
            ['4. الحفاظ على الوصول (Maintaining Access)', 'تثبيت أبواب خلفية، رفع صلاحيات: Mimikatz, PowerShell Empire.'],
            ['5. تغطية الآثار (Covering Tracks)', 'مسح السجلات، إخفاء الأدلة: تنظيف logs, استخدام proxies.'],
            ['6. إعداد التقارير (Reporting)', 'توثيق الثغرات، تقييم المخاطر، اقتراح الحلول.'],
          ].map(([title, desc]) => (
            <div className="timeline-item" key={title}>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    num: 8, title: 'أدوات الاختبار الاختراق',
    content: (
      <div className="grid-3">
        {[
          { h: '🌐 معلومات (Recon)', items: ['Nmap / Zenmap', 'theHarvester', 'Recon-ng', 'Shodan', 'Google Dorks', 'Amass'] },
          { h: '🔍 فحص الثغرات', items: ['Nessus', 'OpenVAS', 'Nikto', 'WPScan', 'Burp Suite'] },
          { h: '💥 استغلال', items: ['Metasploit', 'SQLMap', 'BeEF', 'Hydra', 'Hashcat'] },
          { h: '📡 الشبكات', items: ['Wireshark', 'tcpdump', 'Aircrack-ng', 'Bettercap', 'Responder'] },
          { h: '🔑 كلمات المرور', items: ['Hashcat', 'John the Ripper', 'Hydra', 'Medusa', 'Crunch'] },
          { h: '🛡️ دفاع', items: ['Snort / Suricata', 'Fail2ban', 'Lynis', 'ClamAV', 'OSSEC'] },
        ].map(g => (
          <div className="info-card" key={g.h}>
            <h4>{g.h}</h4>
            <ul>{g.items.map(i => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: 9, title: 'الأمن الدفاعي (Defensive Security)',
    content: (
      <>
        <div className="grid-2">
          <div className="info-card">
            <h4>🔍 Blue Team أدوات</h4>
            <ul>
              <li><strong>SIEM</strong> - Splunk, ELK Stack, Wazuh</li>
              <li><strong>EDR</strong> - CrowdStrike, SentinelOne</li>
              <li><strong>DLP</strong> - منع تسرب البيانات</li>
              <li><strong>Honeypots</strong> - مصائد للقراصنة</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>🔄 Incident Response (IR)</h4>
            <ol style={{ marginRight: 18 }}>
              <li><strong>Preparation</strong> - التجهيز</li>
              <li><strong>Detection</strong> - الكشف</li>
              <li><strong>Containment</strong> - احتواء الضرر</li>
              <li><strong>Eradication</strong> - إزالة التهديد</li>
              <li><strong>Recovery</strong> - استعادة الأنظمة</li>
              <li><strong>Lessons Learned</strong> - الدروس المستفادة</li>
            </ol>
          </div>
        </div>
        <div className="grid-2">
          <div className="info-card">
            <h4>📋 Frameworks & Standards</h4>
            <ul>
              <li><strong>NIST Cybersecurity Framework</strong></li>
              <li><strong>ISO 27001</strong></li>
              <li><strong>PCI DSS</strong></li>
              <li><strong>MITRE ATT&CK</strong></li>
            </ul>
          </div>
          <div className="info-card">
            <h4>🧪 أنواع اختبار الاختراق</h4>
            <ul>
              <li><strong>Black Box</strong> - لا معلومات</li>
              <li><strong>White Box</strong> - معلومات كاملة</li>
              <li><strong>Grey Box</strong> - معلومات جزئية</li>
              <li><strong>Web App / Mobile</strong></li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    num: 10, title: 'المسار الوظيفي والشهادات',
    content: (
      <div className="grid-2">
        <div className="info-card">
          <h4>📜 الشهادات المهنية</h4>
          <ul>
            <li><strong>CompTIA Security+</strong> - للمبتدئين</li>
            <li><strong>CEH</strong> - اختراق أخلاقي</li>
            <li><strong>CISSP</strong> - للمحترفين (5+ سنوات)</li>
            <li><strong>OSCP</strong> - اختراق عملي</li>
            <li><strong>CCNA / CCNP Security</strong> - شبكات</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>💼 الوظائف في المجال</h4>
          <ul>
            <li><strong>Penetration Tester</strong> - مختبر اختراق</li>
            <li><strong>SOC Analyst</strong> - محلل أمني</li>
            <li><strong>Security Engineer</strong> - مهندس أمن</li>
            <li><strong>Incident Responder</strong> - مستجيب</li>
            <li><strong>Security Consultant</strong> - مستشار</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    num: 11, title: 'مصادر تعليمية',
    content: (
      <div className="grid-3">
        <div className="info-card">
          <h4>📺 منصات تعليمية</h4>
          <ul>
            <li>TryHackMe ← للمبتدئين</li>
            <li>Hack The Box ← للمتقدمين</li>
            <li>PortSwigger Web Academy</li>
            <li>PicoCTF / VulnHub</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>📖 كتب أساسية</h4>
          <ul>
            <li>The Web Application Hacker's Handbook</li>
            <li>Hacking: The Art of Exploitation</li>
            <li>Red Team Field Manual</li>
            <li>Practical Malware Analysis</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🌐 مواقع ومجتمعات</h4>
          <ul>
            <li>Exploit-DB (exploit-db.com)</li>
            <li>OWASP (owasp.org)</li>
            <li>YouTube: IppSec, John Hammond</li>
            <li>Reddit: r/netsec</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    num: 12, title: 'أوامر Linux أساسية للأمن',
    content: (
      <div className="grid-2">
        <div className="info-card">
          <h4>🔍 استكشاف النظام</h4>
          <div className="code-block">
            {`uname -a                # معلومات النظام
whoami                  # المستخدم الحالي
cat /etc/passwd         # قائمة المستخدمين
cat /etc/shadow         # كلمات المرور المشفرة
netstat -tulpn          # المنافذ المفتوحة
ps aux                  # العمليات الجارية`}
          </div>
        </div>
        <div className="info-card">
          <h4>🔎 فحص الشبكات</h4>
          <div className="code-block">
            {`nmap -sV 192.168.1.1     # فحص الخدمات
nmap -p- 192.168.1.1    # كل المنافذ
tcpdump -i eth0         # التقاط حزم
whois example.com       # معلومات نطاق
dig example.com         # استعلام DNS`}
          </div>
        </div>
      </div>
    ),
  },
]
