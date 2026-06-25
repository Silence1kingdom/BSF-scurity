import { useState, createContext, useContext, useEffect } from 'react'

const LANG_KEY = 'bsf_lang'

const translations = {
  ar: {
    // Navbar
    nav_home: 'الرئيسية',
    nav_books: 'الكتب',
    nav_cyber: 'السايبر سيكيوريتي',
    nav_dict: 'القاموس',
    nav_exam: 'الاختبارات',
    nav_leaderboard: '🏆 المتصدرين',
    search: 'بحث...',
    login: 'تسجيل الدخول',
    logout: 'خروج',
    profile: 'الملف الشخصي',
    admin: 'لوحة التحكم',
    loading: 'جاري التحميل...',
    back_home: 'العودة للرئيسية',
    theme_toggle: 'تبديل الوضع',
    lang_toggle: 'English',

    // Hero
    hero_title: 'مكتبة الأمن السيبراني',
    hero_subtitle: 'BSF Library',
    hero_desc: 'دليل شامل لتعلم الأمن السيبراني من الصفر إلى الاحتراف. كتب، شروحات، وأدوات تفاعلية.',
    hero_btn_books: '📚 تصفح الكتب',
    hero_btn_learn: '🛡️ ابدأ التعلم',

    // Home
    home_features: '✨ مميزات المكتبة',
    home_h1: '6 كتب تعليمية',
    home_d1: 'بايثون، C++، لينكس، شبكات، أدوات Kali',
    home_h2: '12 قسم للسايبر سيكيوريتي',
    home_d2: 'من الأساسيات إلى الاحتراف',
    home_h3: 'اختبارات تفاعلية',
    home_d3: '60+ سؤال لاختبار معلوماتك',
    home_h4: 'قاموس مصطلحات',
    home_d4: '30+ مصطلح أمن سيبراني',
    home_h5: '50+ أداة اختراق',
    home_d5: 'Nmap, Metasploit, Wireshark وغيرها',
    home_h6: 'شهادات ومسارات وظيفية',
    home_d6: 'CEH, OSCP, CISSP, Security+',
    home_stats_books: 'كتب تعليمية',
    home_stats_sections: 'فصل في السايبر',
    home_stats_tools: 'أداة أمنية',
    home_stats_free: 'مجاني',
    home_cta_books: '📚 استعرض الكتب',
    home_cta_cyber: '🛡️ ابدأ رحلة التعلم',

    // Books
    books_all: 'جميع الكتب',
    books_count: 'كتب',
    books_desc: 'مجموعة من الكتب والشروحات الأساسية في الأمن السيبراني ولغات البرمجة.',
    books_offline: '⚡ يعمل بدون اتصال بالخادم',
    books_search: 'ابحث عن كتاب...',
    books_all_tags: 'الكل',
    books_result: 'نتيجة',
    books_no_results: '😕 لا توجد نتائج تطابق بحثك',
    books_reset: 'إعادة تعيين',
    books_page: 'صفحة',
    books_year: '2026',
    books_download: '📥 تحميل PDF',
    books_download_all: '📥 تحميل كل الكتب كملف ZIP',
    books_download_all_desc: 'جميع الكتب الستة في ملف واحد مضغوط',
    books_bookmark_add: 'إضافة للمفضلة',
    books_bookmark_remove: 'إزالة من المفضلة',

    // Cyber
    cyber_title: '🛡️ الأمن السيبراني',
    cyber_badge: 'دليل كامل',
    cyber_desc: 'شرح شامل لمفاهيم الأمن السيبراني من الأساسيات إلى الاحتراف.',
    cyber_progress: 'أقسام مفتوحة',
    cyber_tests: 'اختبارات',
    cyber_open_all: 'فتح الكل',
    cyber_close_all: 'طي الكل',
    cyber_read: 'تمت القراءة',
    cyber_fav: 'مفضلة',
    cyber_quiz_show: 'اختبر نفسك',
    cyber_quiz_hide: 'إخفاء الاختبار',

    // Quiz
    quiz_prev_score: 'النتيجة السابقة:',
    quiz_retry: 'إعادة',
    quiz_answer_remaining: 'أجب على',
    quiz_questions: 'أسئلة',
    quiz_submit: 'تقديم الإجابات ✅',
    quiz_result: '🎯 نتيجتك:',
    quiz_your_score: 'نتيجتك',

    // Comments
    comments_title: '💬 تعليقات على:',
    comments_name: 'اسمك (اختياري)',
    comments_placeholder: 'اكتب تعليقك...',
    comments_add: '➕ إضافة تعليق',
    comments_empty: 'لا توجد تعليقات بعد. كن أول من يعلق!',
    comments_delete: 'حذف',

    // Exam
    exam_title: '🧪 اختبار المعلومات',
    exam_badge: 'سؤال',
    exam_desc: 'اختبر معلوماتك في الأمن السيبراني بأسئلة شاملة من جميع الأقسام.',
    exam_questions_count: 'سؤال لكل اختبار',
    exam_duration: 'دقيقة مدة الاختبار',
    exam_total_qs: 'إجمالي الأسئلة',
    exam_sections_count: 'قسم',
    exam_start: '🧪 ابدأ الاختبار الآن',
    exam_stats: '📊 إحصائياتك',
    exam_avg: 'متوسط الدرجات',
    exam_best: 'أفضل نتيجة',
    exam_tests_count: 'اختبارات',
    exam_last: 'آخر اختبار',
    exam_history: '📜 سجل الاختبارات',
    exam_answered: 'تمت الإجابة',
    exam_finish: 'إنهاء الاختبار ✅',
    exam_prev: '◀ السابق',
    exam_next: 'التالي ▶',
    exam_new: '🔄 اختبار جديد',
    exam_back_stats: '📊 العودة للإحصائيات',
    exam_breakdown: '📊 تفصيل النتائج حسب الأقسام',
    exam_grade_excellent: 'ممتاز 🎉',
    exam_grade_verygood: 'جيد جداً 👍',
    exam_grade_good: 'جيد 👌',
    exam_grade_ok: 'مقبول 💪',
    exam_grade_bad: 'تحتاج مذاكرة 📚',

    // Dictionary
    dict_title: '📖 قاموس المصطلحات',
    dict_badge: 'مصطلح',
    dict_desc: 'قاموس شامل لأهم المصطلحات في عالم الأمن السيبراني.',
    dict_search: 'ابحث عن مصطلح...',
    dict_no_results: '😕 لا توجد نتائج تطابق بحثك',

    // Profile
    profile_user: 'مستخدم',
    profile_online: '🟢 متصل',
    profile_stats: '📊 الإحصائيات',
    profile_books_read: 'كتب مقروءة',
    profile_lessons_done: 'دروس مكتملة',
    profile_quizzes_done: 'اختبارات محلولة',
    profile_bookmarks: 'مفضلات',
    profile_recent: '📖 آخر الكتب',
    profile_read_msg: 'قرأت',
    profile_books_suffix: 'كتب! استمر 👍',
    profile_no_books: 'لم تقرأ أي كتاب بعد. ابدأ رحلتك!',
    profile_progress: '🛡️ التقدم في السايبر',
    profile_continue: 'أكمل التعلم',
    profile_settings: 'الإعدادات',
    profile_notifications: '🔔 إعدادات الإشعارات',
    profile_dictionary: '📖 قاموس المصطلحات',
    profile_exam: '🧪 اختبار المعلومات',
    profile_admin: 'لوحة التحكم',
    profile_settings_account: 'إعدادات الحساب',
    profile_clear_data: '🗑️ مسح البيانات المحفوظة',
    profile_logout: '🚪 تسجيل الخروج',
    profile_browse_books: 'تصفح الكتب',

    // Admin
    admin_overview: '📊 نظرة عامة',
    admin_books: '📚 الكتب',
    admin_admins: '👑 إدارة الأدمن',
    admin_settings: '⚙️ الإعدادات',
    admin_back: '🏠 العودة للموقع',
    admin_logout: '🚪 خروج',
    admin_books_count: 'الكتب',
    admin_sections_count: 'أقسام السايبر',
    admin_users: 'المستخدمين',
    admin_admins_count: 'عدد الأدمن',
    admin_total_content: 'إجمالي المحتوى',
    admin_questions: 'سؤال اختبارات',
    admin_platform_status: '🔐 حالة المنصة',
    admin_status_firebase: 'Firebase Auth',
    admin_status_local: 'التخزين المحلي',
    admin_status_server: 'الخادم (Server)',
    admin_status_admin: 'أدمن',
    admin_connected: '✅ متصل',
    admin_optional: '⚡ اختياري',
    admin_protected: '✅ محمي',
    admin_quick: 'إجراءات سريعة',
    admin_manage_admins: '👑 إدارة الأدمن',
    admin_manage_books: '📚 إدارة الكتب',
    admin_exam: '🧪 الاختبارات',
    admin_super_admin: '👑 الأدمن الرئيسي',
    admin_super_admin_desc: '👑 أدمن رئيسي — لا يمكن إزالته',
    admin_add_admin: '➕ إضافة أدمن جديد',
    admin_add_placeholder: 'أدخل البريد الإلكتروني...',
    admin_add_btn: 'إضافة',
    admin_admins_list: '📋 قائمة الأدمن',
    admin_no_admins: '📋 لا يوجد أدمن إضافيين حتى الآن',
    admin_remove: '🗑️ إزالة',
    admin_added: 'منذ الإضافة',
    admin_edit: '✏️ تعديل',
    admin_copy_link: '📋 نسخ الرابط',
    admin_link_copied: '📋 تم نسخ الرابط',
    admin_coming_soon: '✏️ قريباً',
    admin_admin_manage: '👑 إدارة',
    admin_test: 'اختبار',
    admin_delete: 'مسح',
    admin_delete_confirm: 'متأكد؟',
    admin_deleted: '🗑️ تم المسح',

    // Login
    login_title: 'BSF Library',
    login_subtitle: 'مكتبة الأمن السيبراني',
    login_desc: 'سجل دخولك للوصول إلى جميع الكتب والدروس',
    login_error: 'فشل تسجيل الدخول. حاول مرة أخرى.',
    login_google: 'تسجيل الدخول عبر Google',
    login_terms: 'بالضغط على تسجيل الدخول، أنت توافق على',
    login_terms_link: 'شروط الاستخدام',

    // Leaderboard
    lb_title: '🏆 لوحة المتصدرين',
    lb_desc: 'إحصائيات تقدمك وإنجازاتك في المنصة.',
    lb_you: 'أنت',
    lb_stats: '📊 إحصائيات شاملة',
    lb_books: '📚 كتب مقروءة',
    lb_sections: '🛡️ أقسام مكتملة',
    lb_quiz_avg: '🧪 متوسط الاختبارات',
    lb_bookmarks: '⭐ المفضلات',
    lb_tips: '💡 نصائح للصدارة',
    lb_tip1: 'اقرأ كل الكتب الستة',
    lb_tip2: 'افتح كل أقسام السايبر الـ 12',
    lb_tip3: 'حل كل الاختبارات واجمع أعلى الدرجات',
    lb_tip4: 'أضف كل محتوى المفضلة',
    lb_my_profile: '👤 ملفي الشخصي',

    // Footer
    footer_rights: 'جميع الحقوق محفوظة',

    // ChatBot
    chat_hello: '👋 **مرحباً بك في بوت BSF الذكي!**\n\nأسألني أي سؤال عن الأمن السيبراني:\n• هجمات وأدوات\n• شهادات ومسارات\n• مفاهيم ومصطلحات\n• نصائح وأمان',
    chat_name: 'BSF AI Assistant',
    chat_status: '🟢 متصل — ذكي',
    chat_placeholder: 'اسأل عن أي شيء في السايبر سيكيوريتي...',
    chat_cleared: '🧹 **تم مسح المحادثة.**\n\nأنا موجود لأي سؤال تاني! 👋',
    chat_clear: 'مسح المحادثة',

    // General
    yes: 'نعم',
    no: 'لا',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    all: 'الكل',
    page: 'صفحة',
    result: 'نتيجة',
    no_results: 'لا توجد نتائج',
    reset: 'إعادة تعيين',
    download: 'تحميل',
    read: 'قراءة',
    bookmark: 'مفضلة',
    and: 'و',
    back_to_top: 'العودة للأعلى',
    close: 'إغلاق',
  },

  en: {
    // Navbar
    nav_home: 'Home',
    nav_books: 'Books',
    nav_cyber: 'Cybersecurity',
    nav_dict: 'Dictionary',
    nav_exam: 'Exams',
    nav_leaderboard: '🏆 Leaderboard',
    search: 'Search...',
    login: 'Sign In',
    logout: 'Sign Out',
    profile: 'Profile',
    admin: 'Dashboard',
    loading: 'Loading...',
    back_home: 'Back to Home',
    theme_toggle: 'Toggle theme',
    lang_toggle: 'العربية',

    // Hero
    hero_title: 'Cybersecurity Library',
    hero_subtitle: 'BSF Library',
    hero_desc: 'A comprehensive guide to learn cybersecurity from scratch to professional. Books, tutorials, and interactive tools.',
    hero_btn_books: '📚 Browse Books',
    hero_btn_learn: '🛡️ Start Learning',

    // Home
    home_features: '✨ Features',
    home_h1: '6 Educational Books',
    home_d1: 'Python, C++, Linux, Networks, Kali Tools',
    home_h2: '12 Cyber Sections',
    home_d2: 'From basics to professional level',
    home_h3: 'Interactive Quizzes',
    home_d3: '60+ questions to test your knowledge',
    home_h4: 'Terminology Dictionary',
    home_d4: '30+ cybersecurity terms',
    home_h5: '50+ Hacking Tools',
    home_d5: 'Nmap, Metasploit, Wireshark and more',
    home_h6: 'Certifications & Career Paths',
    home_d6: 'CEH, OSCP, CISSP, Security+',
    home_stats_books: 'Educational Books',
    home_stats_sections: 'Cyber Chapters',
    home_stats_tools: 'Security Tools',
    home_stats_free: 'Free',
    home_cta_books: '📚 Browse Books',
    home_cta_cyber: '🛡️ Start Learning Journey',

    // Books
    books_all: 'All Books',
    books_count: 'Books',
    books_desc: 'A collection of essential books and tutorials in cybersecurity and programming languages.',
    books_offline: '⚡ Working without server connection',
    books_search: 'Search for a book...',
    books_all_tags: 'All',
    books_result: 'Result',
    books_no_results: '😕 No results matching your search',
    books_reset: 'Reset',
    books_page: 'Page',
    books_year: '2026',
    books_download: '📥 Download PDF',
    books_download_all: '📥 Download All Books as ZIP',
    books_download_all_desc: 'All six books in one compressed file',
    books_bookmark_add: 'Add to bookmarks',
    books_bookmark_remove: 'Remove from bookmarks',

    // Cyber
    cyber_title: '🛡️ Cybersecurity',
    cyber_badge: 'Complete Guide',
    cyber_desc: 'Comprehensive explanation of cybersecurity concepts from basics to professional level.',
    cyber_progress: 'Sections opened',
    cyber_tests: 'Quizzes',
    cyber_open_all: 'Open All',
    cyber_close_all: 'Close All',
    cyber_read: 'Read',
    cyber_fav: 'Favorite',
    cyber_quiz_show: 'Take Quiz',
    cyber_quiz_hide: 'Hide Quiz',

    // Quiz
    quiz_prev_score: 'Previous score:',
    quiz_retry: 'Retry',
    quiz_answer_remaining: 'Answer',
    quiz_questions: 'Questions',
    quiz_submit: 'Submit Answers ✅',
    quiz_result: '🎯 Your Result:',
    quiz_your_score: 'Your Score',

    // Comments
    comments_title: '💬 Comments on:',
    comments_name: 'Your name (optional)',
    comments_placeholder: 'Write your comment...',
    comments_add: '➕ Add Comment',
    comments_empty: 'No comments yet. Be the first to comment!',
    comments_delete: 'Delete',

    // Exam
    exam_title: '🧪 Knowledge Test',
    exam_badge: 'Questions',
    exam_desc: 'Test your cybersecurity knowledge with comprehensive questions from all sections.',
    exam_questions_count: 'Questions per test',
    exam_duration: 'Minutes exam duration',
    exam_total_qs: 'Total Questions',
    exam_sections_count: 'Sections',
    exam_start: '🧪 Start Exam Now',
    exam_stats: '📊 Your Statistics',
    exam_avg: 'Average Score',
    exam_best: 'Best Score',
    exam_tests_count: 'Tests',
    exam_last: 'Last Test',
    exam_history: '📜 Test History',
    exam_answered: 'Answered',
    exam_finish: 'Finish Exam ✅',
    exam_prev: '◀ Previous',
    exam_next: 'Next ▶',
    exam_new: '🔄 New Test',
    exam_back_stats: '📊 Back to Statistics',
    exam_breakdown: '📊 Results Breakdown by Section',
    exam_grade_excellent: 'Excellent 🎉',
    exam_grade_verygood: 'Very Good 👍',
    exam_grade_good: 'Good 👌',
    exam_grade_ok: 'Acceptable 💪',
    exam_grade_bad: 'Need More Study 📚',

    // Dictionary
    dict_title: '📖 Terminology Dictionary',
    dict_badge: 'Terms',
    dict_desc: 'A comprehensive dictionary of the most important cybersecurity terms.',
    dict_search: 'Search for a term...',
    dict_no_results: '😕 No results matching your search',

    // Profile
    profile_user: 'User',
    profile_online: '🟢 Online',
    profile_stats: '📊 Statistics',
    profile_books_read: 'Books Read',
    profile_lessons_done: 'Lessons Completed',
    profile_quizzes_done: 'Quizzes Solved',
    profile_bookmarks: 'Bookmarks',
    profile_recent: '📖 Recent Books',
    profile_read_msg: 'You read',
    profile_books_suffix: 'books! Keep going 👍',
    profile_no_books: "You haven't read any books yet. Start your journey!",
    profile_progress: '🛡️ Cyber Progress',
    profile_continue: 'Continue Learning',
    profile_settings: 'Settings',
    profile_notifications: '🔔 Notification Settings',
    profile_dictionary: '📖 Terminology Dictionary',
    profile_exam: '🧪 Knowledge Test',
    profile_admin: 'Dashboard',
    profile_settings_account: 'Account Settings',
    profile_clear_data: '🗑️ Clear Saved Data',
    profile_logout: '🚪 Sign Out',
    profile_browse_books: 'Browse Books',

    // Admin
    admin_overview: '📊 Overview',
    admin_books: '📚 Books',
    admin_admins: '👑 Admin Management',
    admin_settings: '⚙️ Settings',
    admin_back: '🏠 Back to Site',
    admin_logout: '🚪 Logout',
    admin_books_count: 'Books',
    admin_sections_count: 'Cyber Sections',
    admin_users: 'Users',
    admin_admins_count: 'Admins',
    admin_total_content: 'Total Content',
    admin_questions: 'Exam Questions',
    admin_platform_status: '🔐 Platform Status',
    admin_status_firebase: 'Firebase Auth',
    admin_status_local: 'Local Storage',
    admin_status_server: 'Server',
    admin_status_admin: 'Admin',
    admin_connected: '✅ Connected',
    admin_optional: '⚡ Optional',
    admin_protected: '✅ Protected',
    admin_quick: 'Quick Actions',
    admin_manage_admins: '👑 Manage Admins',
    admin_manage_books: '📚 Manage Books',
    admin_exam: '🧪 Exams',
    admin_super_admin: '👑 Super Admin',
    admin_super_admin_desc: '👑 Super Admin — Cannot be removed',
    admin_add_admin: '➕ Add New Admin',
    admin_add_placeholder: 'Enter email address...',
    admin_add_btn: 'Add',
    admin_admins_list: '📋 Admin List',
    admin_no_admins: '📋 No additional admins yet',
    admin_remove: '🗑️ Remove',
    admin_added: 'Since added',
    admin_edit: '✏️ Edit',
    admin_copy_link: '📋 Copy Link',
    admin_link_copied: '📋 Link copied',
    admin_coming_soon: '✏️ Coming soon',
    admin_admin_manage: '👑 Manage',
    admin_test: 'Test',
    admin_delete: 'Delete',
    admin_delete_confirm: 'Are you sure?',
    admin_deleted: '🗑️ Deleted',

    // Login
    login_title: 'BSF Library',
    login_subtitle: 'Cybersecurity Library',
    login_desc: 'Sign in to access all books and lessons',
    login_error: 'Login failed. Please try again.',
    login_google: 'Sign in with Google',
    login_terms: 'By signing in, you agree to our',
    login_terms_link: 'Terms of Service',

    // Leaderboard
    lb_title: '🏆 Leaderboard',
    lb_desc: 'Your progress stats and achievements on the platform.',
    lb_you: 'You',
    lb_stats: '📊 Comprehensive Stats',
    lb_books: '📚 Books Read',
    lb_sections: '🛡️ Sections Completed',
    lb_quiz_avg: '🧪 Quiz Average',
    lb_bookmarks: '⭐ Bookmarks',
    lb_tips: '💡 Tips for the Top',
    lb_tip1: 'Read all 6 books',
    lb_tip2: 'Open all 12 cyber sections',
    lb_tip3: 'Solve all quizzes and get high scores',
    lb_tip4: 'Add all content to bookmarks',
    lb_my_profile: '👤 My Profile',

    // Footer
    footer_rights: 'All rights reserved',

    // ChatBot
    chat_hello: '👋 **Welcome to the BSF AI Chatbot!**\n\nAsk me anything about cybersecurity:\n• Attacks and Tools\n• Certifications and Career\n• Concepts and Terms\n• Tips and Security',
    chat_name: 'BSF AI Assistant',
    chat_status: '🟢 Online — Smart',
    chat_placeholder: 'Ask anything about cybersecurity...',
    chat_cleared: '🧹 **Chat cleared.**\n\nI\'m here for any other questions! 👋',
    chat_clear: 'Clear chat',

    // General
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    cancel: 'Cancel',
    all: 'All',
    page: 'Page',
    result: 'Result',
    no_results: 'No Results',
    reset: 'Reset',
    download: 'Download',
    read: 'Read',
    bookmark: 'Bookmark',
    and: 'and',
    back_to_top: 'Back to top',
    close: 'Close',
  }
}

function loadLang() {
  try { return localStorage.getItem(LANG_KEY) || 'ar' } catch { return 'ar' }
}

function saveLang(l) {
  localStorage.setItem(LANG_KEY, l)
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(loadLang)

  const t = (key) => translations[lang]?.[key] || translations.ar[key] || key

  const toggle = () => {
    setLang(l => {
      const next = l === 'ar' ? 'en' : 'ar'
      saveLang(next)
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = next
      return next
    })
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
