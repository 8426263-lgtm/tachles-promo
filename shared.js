/* =====================================================================
   shared.js — נאבר, פוטר ולוגיקה משותפת לכל עמודי אתר תכל'ס
   כל עמוד טוען את הקובץ הזה. עריכת הנאבר/פוטר נעשית כאן — מקום אחד.
   נכתב כמחרוזות מוזרקות (לא fetch) כדי לעבוד גם בפתיחת קובץ מקומי file://
   ===================================================================== */

// ===== גרסאות המוצר — מקום אחד לעדכון =====
// כשיהיה קישור תשלום ל-Web: לשנות web.mode ל-'pay' ולמלא buyUrl. שאר הזרימה כבר תומכת.
const PLANS = {
    desktop: {
        mode: 'pay',  // תשלום אוטומטי מיידי
        // לינק uPay — Desktop 930 ₪ (מחיר השקה, עודכן 2026-06-26 — סיום מבצע, קישור חדש)
        buyUrl: 'https://app.upay.co.il/API6/s.php?m=aUZzRTZuNE0zT2pWeG8wdExKQlptZz09',
        licenseLine: 'הרכישה מקנה רישיון שימוש לכל החיים למחשב אחד, ללא דמי מנוי.',
        refundLine: 'המוצר הינו מוצר דיגיטלי. בהתאם לחוק, <strong>לא יינתן החזר כספי</strong> לאחר קבלת קוד הרישוי.',
    },
    web: {
        mode: 'pay',  // תשלום אוטומטי מיידי — גישה לאתר נפתחת מיד אחרי התשלום
        // לינק uPay — Web 1130 ₪ (מחיר השקה, עודכן 2026-06-26 — סיום מבצע, קישור חדש)
        buyUrl: 'https://app.upay.co.il/API6/s.php?m=c2NmZ2dIcytXTEptOWNDdVcrYWR1dz09',
        leadUrl: 'demo.html#zoom-form',
        licenseLine: 'הרכישה מקנה רישיון שימוש בגרסת הענן (Web), עם גישה מכל דפדפן ומכשיר וגיבוי ענן אוטומטי. הגישה לאתר נפתחת מיד עם השלמת התשלום, לפי כתובת המייל שאיתה תזדהו במערכת. מהשנה השנייה — 170 ₪/שנה דמי אחסון בענן בלבד.',
        refundLine: 'המוצר הינו מוצר דיגיטלי המאפשר גישה מיידית. בהתאם לחוק, <strong>לא יינתן החזר כספי</strong> לאחר פתיחת הגישה לאתר.',
    },
    premium: {
        mode: 'notify',  // "בקרוב" → רישום להתעניינות
        buyUrl: null,
        leadUrl: 'demo.html#zoom-form',
    },
};
const DEMO_URL = 'https://tacles.vercel.app/?demo=1';
const SUPPORT_EMAIL = 'tachles263@gmail.com';

// הגרסה שנבחרה כעת בזרימת הרכישה (נקבע ע"י initiateBuyProcess)
let selectedPlan = 'desktop';

/* ---------- קביעת העמוד הנוכחי לסימון אקטיבי בנאבר ---------- */
function currentPage() {
    const p = location.pathname.split('/').pop().toLowerCase();
    if (!p || p === 'index.html' || p === 'index.html') return 'home';
    if (p.startsWith('features')) return 'features';
    if (p.startsWith('flexibility')) return 'flexibility';
    if (p.startsWith('pricing'))  return 'pricing';
    if (p.startsWith('demo') || p.startsWith('contact')) return 'demo';
    return 'home';
}

/* ---------- HTML של הנאבר ---------- */
function navHTML() {
    const page = currentPage();
    const link = (href, label, key, extra = '') =>
        `<a href="${href}" class="nav-link px-3 py-2 transition ${page === key ? 'nav-active' : 'text-slate-300 hover:text-white'} ${extra}">${label}</a>`;

    return `
    <div class="container mx-auto px-4 h-16 flex justify-between items-center">
        <a href="index.html" class="flex items-center">
            <img src="33.jpg" alt="תכל'ס" class="h-12 w-auto object-contain">
        </a>

        <!-- ניווט דסקטופ -->
        <nav class="hidden md:flex gap-1 font-medium items-center text-sm">
            ${link('index.html', "למה תכל'ס", 'home')}

            <!-- DROPDOWN פיצ'רים — mega menu -->
            <div class="nav-dropdown" tabindex="0">
                <button class="px-3 py-2 transition flex items-center gap-1 ${page === 'features' ? 'nav-active' : 'text-slate-300 hover:text-white'}">
                    פיצ'רים <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </button>
                <div class="nav-mega">
                    <!-- עמודת רשימת פיצ'רים -->
                    <div class="nav-mega-list">
                        <div class="nm-eyebrow">היכולות של תכל'ס</div>
                        <div class="nm-title">חלק ממה שתכל'ס עושה <span>בשבילך</span></div>
                        <div class="grid grid-cols-2 gap-1">
                            <a href="features.html#tab-0" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-green"><i data-lucide="trending-up" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">נטו אמיתי</span><span class="text-xs text-slate-500">המספר שנשאר בכיס</span></span>
                            </a>
                            <a href="features.html#tab-1" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-amber"><i data-lucide="calculator" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">סימולטור מס</span><span class="text-xs text-slate-500">כמה יישאר לפני שחותמים</span></span>
                            </a>
                            <a href="features.html#tab-2" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-blue"><i data-lucide="users" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">לקוחות ופרויקטים</span><span class="text-xs text-slate-500">מי חייב לך וכמה</span></span>
                            </a>
                            <a href="features.html#tab-3" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-cyan"><i data-lucide="clock" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">שעות וחשבוניות</span><span class="text-xs text-slate-500">שעון נוכחות → חשבונית</span></span>
                            </a>
                            <a href="features.html#tab-4" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-purple"><i data-lucide="wallet" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">ארנק ויומן</span><span class="text-xs text-slate-500">שום שקל לא הולך לאיבוד</span></span>
                            </a>
                            <a href="features.html#tab-6" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-emerald"><i data-lucide="send" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">שליחת מייל <span class="dd-new">חדש</span></span><span class="text-xs text-slate-500">דוח/חשבונית/הצעה ישיר</span></span>
                            </a>
                            <a href="features.html#tab-7" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-indigo"><i data-lucide="badge-check" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">הצעות מחיר ולידים</span><span class="text-xs text-slate-500">פנייה → פרויקט בלחיצה</span></span>
                            </a>
                            <a href="features.html#tab-8" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-rose"><i data-lucide="folder" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">קבצים ומסמכים</span><span class="text-xs text-slate-500">הכל בכרטיס הלקוח</span></span>
                            </a>
                            <a href="features.html#tab-9" class="nav-dd-item">
                                <span class="nav-dd-icon dd-c-orange"><i data-lucide="bar-chart-3" class="w-5 h-5"></i></span>
                                <span><span class="block font-bold text-slate-900 text-sm">אנליטיקה ודוחות</span><span class="text-xs text-slate-500">מי הלקוח הכי רווחי</span></span>
                            </a>
                        </div>
                    </div>

                    <!-- עמודת תמונה + CTA -->
                    <div class="nav-mega-promo">
                        <div class="promo-txt">
                            <div class="promo-h">תדע בדיוק <span>כמה נשאר לך</span> בכיס.</div>
                            <div class="promo-p">לא בסוף השנה אצל רואה החשבון — עכשיו, בזמן אמת.</div>
                        </div>
                        <div class="promo-img">
                            <img src="תמונות חדשות/extracted/image4.png" alt="מסך מיסוי ונטו אמיתי">
                        </div>
                        <a href="${DEMO_URL}" target="_blank" rel="noopener" class="promo-cta">
                            <i data-lucide="play-circle" class="w-4 h-4"></i> נסה דמו חינמי ←
                        </a>
                    </div>
                </div>
            </div>

            ${link('flexibility.html', 'גמישות לכל עסק', 'flexibility')}
            ${link('pricing.html', 'מחירון', 'pricing', 'text-amber-300 font-bold hover:text-amber-200')}
            <a href="${DEMO_URL}" target="_blank" rel="noopener"
               class="flex items-center gap-1 px-3 py-2 text-brand-400 hover:text-brand-300 font-bold transition">
                <i data-lucide="play-circle" class="w-4 h-4"></i> דמו חי
            </a>
        </nav>

        <!-- CTA דסקטופ -->
        <div class="hidden md:flex items-center gap-3">
            <a href="demo.html"
               class="group flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-navy-950 px-5 py-2 rounded-full font-extrabold transition text-sm shadow-lg shadow-brand-500/30 cta-pulse">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <i data-lucide="video" class="w-4 h-4"></i>
                מפגש זום חי — חינם
            </a>
            <a href="pricing.html"
                class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full font-extrabold transition text-sm">
                התחילו עכשיו ←
            </a>
        </div>

        <!-- כפתור נייד -->
        <button id="mobile-menu-btn" onclick="toggleMobileMenu()" class="md:hidden text-white p-2" aria-label="תפריט">
            <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
    </div>

    <!-- תפריט נייד -->
    <div id="mobile-menu" class="md:hidden hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2">
        <a href="index.html" class="block text-slate-300 hover:text-white font-medium py-1">למה תכל'ס</a>
        <a href="features.html" class="block text-slate-300 hover:text-white font-medium py-1">פיצ'רים</a>
        <a href="flexibility.html" class="block text-brand-400 hover:text-brand-300 font-medium py-1">✦ גמישות לכל עסק</a>
        <a href="pricing.html" class="block text-amber-300 font-bold py-1">מחירון</a>
        <a href="demo.html" class="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-navy-950 font-extrabold py-2.5 px-3 rounded-lg my-2">
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <i data-lucide="video" class="w-4 h-4"></i> מפגש זום חי — חינם
        </a>
        <a href="${DEMO_URL}" target="_blank" rel="noopener" class="block text-brand-400 font-bold py-1">▶ דמו חי</a>
        <a href="pricing.html" onclick="toggleMobileMenu();"
            class="block w-full text-center bg-brand-400 hover:bg-brand-300 text-navy-950 px-4 py-3 rounded-lg font-extrabold mt-2">התחילו עכשיו ←</a>
    </div>`;
}

/* ---------- HTML של הפוטר ---------- */
function footerHTML() {
    return `
    <div class="container mx-auto px-4 py-12">
        <div class="grid md:grid-cols-4 gap-8 text-slate-400 text-sm">
            <div class="md:col-span-1">
                <img src="33.jpg" alt="תכל'ס" class="h-12 w-auto object-contain mb-4">
                <p class="leading-relaxed">תוכנה לניהול עסק לעצמאיים בישראל — נטו אמיתי, ניהול לקוחות וחשבוניות במקום אחד.</p>
            </div>
            <div>
                <h4 class="font-black text-white mb-3">המוצר</h4>
                <ul class="space-y-2">
                    <li><a href="features.html" class="hover:text-brand-400 transition">פיצ'רים</a></li>
                    <li><a href="pricing.html" class="hover:text-amber-400 transition">מחירון</a></li>
                    <li><a href="${DEMO_URL}" target="_blank" rel="noopener" class="hover:text-brand-400 transition">דמו חי</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-black text-white mb-3">מידע</h4>
                <ul class="space-y-2">
                    <li><a href="index.html#pain" class="hover:text-brand-400 transition">למה תכל'ס</a></li>
                    <li><a href="index.html#faq" class="hover:text-brand-400 transition">שאלות נפוצות</a></li>
                    <li><a href="demo.html" class="hover:text-brand-400 transition">מפגש זום חי</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-black text-white mb-3">תמיכה אישית</h4>
                <p class="leading-relaxed">מענה <strong class="text-white">ישירות ממפתח המערכת</strong> — לא מוקד בחו"ל. תוך 24 שעות בימי עבודה.</p>
                <a href="mailto:${SUPPORT_EMAIL}" dir="ltr" class="text-brand-400 hover:text-brand-300 transition font-bold inline-block mt-2">${SUPPORT_EMAIL}</a>
            </div>
        </div>
        <div class="mt-10 pt-6 border-t border-slate-800 text-slate-600 text-sm text-center">
            <p>&copy; 2026 תכל'ס — כל הזכויות שמורות.</p>
        </div>
    </div>`;
}

/* ---------- HTML של מודל התקנון (דינמי לפי גרסה) ---------- */
function termsModalHTML(plan = 'desktop') {
    const p = PLANS[plan] || PLANS.desktop;
    const versionLabel = plan === 'web' ? 'Web' : 'Desktop';
    return `
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[82vh] overflow-hidden flex flex-col shadow-2xl">
        <div class="p-6 border-b flex justify-between items-center bg-slate-50">
            <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                <i data-lucide="file-text" class="text-brand-600"></i> תקנון שימוש ואישור רכישה — תכל'ס ${versionLabel}
            </h3>
            <button onclick="closeTerms()" class="text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full p-1.5"><i data-lucide="x"></i></button>
        </div>
        <div class="p-8 overflow-y-auto text-right text-slate-700 leading-relaxed">
            <p class="font-bold mb-4">אנא קרא/י בעיון לפני הרכישה:</p>
            ${plan === 'web' ? `
            <div class="mb-5 p-4 bg-brand-50 border border-brand-200 rounded-lg text-sm text-slate-800 flex items-start gap-2">
                <i data-lucide="info" class="w-5 h-5 text-brand-600 shrink-0 mt-0.5"></i>
                <span>שימו לב: הגישה למערכת נפתחת <strong>אוטומטית ומיד</strong> עם השלמת התשלום, לפי <strong>כתובת המייל</strong> שתזינו בעמוד התשלום. הקפידו להזין את אותה כתובת מייל שאיתה תתחברו למערכת.</span>
            </div>` : ''}
            <h4 class="font-bold text-slate-900 mt-4">1. מהות המוצר</h4>
            <p>תוכנת "תכל'ס" הינה כלי לניהול עסק המסופקת "כמות שהיא". ${p.licenseLine}</p>
            <h4 class="font-bold text-slate-900 mt-4">2. מדיניות החזרים</h4>
            <p>${p.refundLine}</p>
            <h4 class="font-bold text-slate-900 mt-4">3. אחריות</h4>
            <p>השימוש בתוכנה הוא באחריות המשתמש. יש לבצע גיבויים שוטפים.</p>
            <h4 class="font-bold text-slate-900 mt-4">4. עדכונים ותמיכה</h4>
            <p>הרכישה כוללת עדכונים עתידיים ותמיכה דרך דוא"ל.</p>
            <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <strong>שימו לב:</strong> בלחיצה על "אני מסכים" מצהיר/ה שקראת את התקנון ומסכים/ה לתנאיו.
            </div>
            <div class="flex gap-3 mt-6">
                <button onclick="approveAndPay()" class="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-xl transition text-lg flex items-center justify-center gap-2">
                    <i data-lucide="check-circle-2" class="w-5 h-5"></i>
                    קראתי ואני מאשר — עבור לתשלום מאובטח
                </button>
                <button onclick="closeTerms()" class="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition">ביטול</button>
            </div>
        </div>
    </div>`;
}

/* ===================== לוגיקה משותפת ===================== */
function toggleMobileMenu() {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
}

// רכישה / תקנון
// version: 'desktop' (ברירת מחדל) | 'web' | 'premium'
function initiateBuyProcess(version = 'desktop') {
    selectedPlan = (version in PLANS) ? version : 'desktop';
    const plan = PLANS[selectedPlan];

    // Web/פרימיום עדיין בלי תשלום אוטומטי → ישר לטופס ליד, בלי מודל תקנון (אין עסקה לאשר)
    if (plan.mode !== 'pay') {
        window.location.href = plan.leadUrl;
        return;
    }

    // Desktop (mode:'pay') → מודל התקנון עם טקסט מותאם לגרסה
    const m = document.getElementById('terms-modal');
    m.innerHTML = termsModalHTML(selectedPlan);
    if (window.lucide) lucide.createIcons();
    m.classList.remove('hidden'); m.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeTerms() {
    const m = document.getElementById('terms-modal');
    m.classList.add('hidden'); m.classList.remove('open');
    document.body.style.overflow = '';
}
function proceedToBuy() {
    closeTerms();
    const plan = PLANS[selectedPlan] || PLANS.desktop;
    if (plan.mode === 'pay' && plan.buyUrl) {
        openPayModal(plan.buyUrl);  // תשלום מוטמע בתוך הדף (iframe), בלי חלון קופץ
    } else {
        window.location.href = plan.leadUrl;  // נפילה בטוחה — בלי חלון uPay ריק
    }
}
function approveAndPay() { proceedToBuy(); }

/* ---------- מודאל תשלום מוטמע (iframe uPay) ---------- */
// פותח את עמוד התשלום של uPay בתוך חלון על-גבי הדף, בלי טאב/חלון נפרד.
// רשת ביטחון: כפתור "פתח בחלון מלא" נופל ל-window.open אם דף הסליקה הסופי חוסם iframe.
let _payUrl = '';
function openPayModal(url) {
    _payUrl = url;
    let m = document.getElementById('pay-modal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'pay-modal';
        m.className = 'modal-overlay hidden';
        document.body.appendChild(m);
    }
    m.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-4xl h-[94vh] max-h-[900px] overflow-hidden flex flex-col shadow-2xl">
            <div class="px-4 py-3 border-b flex justify-between items-center bg-slate-50 shrink-0">
                <span class="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <i data-lucide="lock" class="w-4 h-4 text-brand-600"></i> תשלום מאובטח — uPay
                </span>
                <button onclick="closePayModal()" class="text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full p-1.5" aria-label="סגור"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <iframe src="${url}" class="flex-1 w-full border-0" title="תשלום מאובטח"
                    allow="payment" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div class="px-4 py-3 border-t bg-slate-50 text-center shrink-0">
                <button onclick="openPayInWindow()" class="inline-flex items-center gap-2 bg-brand-100 hover:bg-brand-200 text-brand-800 font-bold text-sm px-5 py-2.5 rounded-lg transition">
                    <i data-lucide="external-link" class="w-4 h-4"></i> התשלום לא נטען? פתח בחלון מלא ←
                </button>
            </div>
        </div>`;
    if (window.lucide) lucide.createIcons();
    m.classList.remove('hidden'); m.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closePayModal() {
    const m = document.getElementById('pay-modal');
    if (!m) return;
    m.classList.add('hidden'); m.classList.remove('open');
    m.innerHTML = '';  // עוצר את ה-iframe (מפסיק טעינה/תשלום ברקע)
    document.body.style.overflow = '';
}
function openPayInWindow() {
    if (_payUrl) window.open(_payUrl, '_blank');
}

// לייטבוקס
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    document.getElementById('lightbox')?.classList.remove('open');
    document.body.style.overflow = '';
}

/* ===================== אתחול ===================== */
document.addEventListener('DOMContentLoaded', () => {
    // הזרקת נאבר
    const nav = document.getElementById('navbar');
    if (nav) nav.innerHTML = navHTML();

    // הזרקת פוטר
    const ft = document.getElementById('site-footer');
    if (ft) ft.innerHTML = footerHTML();

    // הזרקת מודל תקנון + לייטבוקס (פעם אחת לכל עמוד)
    const tm = document.createElement('div');
    tm.id = 'terms-modal';
    tm.className = 'modal-overlay hidden';
    tm.innerHTML = termsModalHTML();
    document.body.appendChild(tm);

    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<span id="lightbox-close" onclick="closeLightbox()">&times;</span><img id="lightbox-img" src="" alt="תצוגה מורחבת">';
    document.body.appendChild(lb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

    // אייקונים
    if (window.lucide) lucide.createIcons();

    // נאבר scrolled
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 40);
    });

    // reveal on scroll
    const obs = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .flip-reveal').forEach(el => obs.observe(el));

    // ESC סוגר מודלים
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeTerms(); closeLightbox(); closePayModal(); }
    });
});
