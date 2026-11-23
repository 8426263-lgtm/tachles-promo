/* ספירת פעולות בדפי המטבח (kc = kitchen counter).
   אין שרת משלנו: כל פעולה מדווחת ל-Cloudflare Web Analytics כ"עמוד וירטואלי" /e/kitchen/<פעולה>
   (אותה שיטה שבה נספרים /demo ו-/app באפליקציה). רואים ב: dash.cloudflare.com > Analytics > Web analytics > Pages.
   מופעל רק ב-http/https, כך שקובץ שהורד ונפתח מקומית לא מדווח כלום ולא נשבר. */
(function () {
  if (!/^https?:$/.test(location.protocol)) return;
  var prefix = '/e/' + (window.KC_AREA || 'kitchen');
  var last = {};
  /* הכתובת האמיתית נשמרת פעם אחת, ואף פעם לא מתעדכנת מכתובת וירטואלית (/e/...) */
  var real = location.pathname + location.search + location.hash;
  function realUrl() {
    if (location.pathname.indexOf('/e/') !== 0) real = location.pathname + location.search + location.hash;
    return real;
  }
  window.addEventListener('hashchange', realUrl);
  function ev(name) {
    try {
      var now = Date.now();
      if (last[name] && now - last[name] < 800) return false;
      last[name] = now;
      var orig = realUrl();
      history.pushState(null, '', prefix + '/' + name);
      setTimeout(function () { try { history.replaceState(null, '', real); } catch (x) {} }, 400);
      return true;
    } catch (x) { return false; }
  }
  window.kcEvent = ev;

  /* זמן שהייה: 30 שנ׳ / דקה / 2 דק׳ / 5 דק׳ (רק כשהלשונית פתוחה לפנים) */
  [30, 60, 120, 300].forEach(function (s) {
    setTimeout(function () { if (!document.hidden) ev('stay-' + s + 's'); }, s * 1000);
  });

  /* עומק גלילה (רלוונטי לדף ההסבר) */
  var depths = { 25: 0, 50: 0, 75: 0, 100: 0 };
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (max < 200) return;
    var pct = Math.round((h.scrollTop || document.body.scrollTop) / max * 100);
    [25, 50, 75, 100].forEach(function (d) {
      if (!depths[d] && pct >= d - (d === 100 ? 3 : 0)) { depths[d] = 1; ev('scroll-' + d); }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* כל אלמנט עם data-kc="שם" נספר בלחיצה */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-kc]') : null;
    if (!t) return;
    /* חשוב: קישור יחסי מתפרש מול כתובת הדף ברגע הניווט. אם נשנה את הכתובת (pushState) לפני כן,
       הקישור יוביל לנתיב שבור. לכן הופכים אותו לכתובת מלאה לפני הדיווח. */
    if (t.tagName === 'A') { try { t.href = t.href; } catch (x) {} }
    /* קישור שעוזב את הדף באותה לשונית: ה-pushState משאיר "כתובת רפאים" /e/... בהיסטוריה, וכפתור "חזור" מנחית עליה
       (ושם מוצג דף הבית בלי שום הסבר). לכן מדווחים, חוזרים צעד אחד אחורה (הכתובת הוירטואלית נזרקת), ורק אז עוברים. */
    var leaves = t.tagName === 'A' && e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey &&
      (!t.target || t.target === '_self') && !t.hasAttribute('download') && /^https?:$/.test(t.protocol) &&
      t.href.split('#')[0] !== (location.origin + realUrl()).split('#')[0];
    var pushed = ev(t.getAttribute('data-kc'));
    if (!leaves || !pushed) return;
    e.preventDefault();
    var dest = t.href, gone = false;
    function go() { if (gone) return; gone = true; window.removeEventListener('popstate', go); location.href = dest; }
    window.addEventListener('popstate', go);
    setTimeout(function () { try { history.back(); } catch (x) { go(); } }, 150);
    setTimeout(go, 700);
  }, true);

  /* מציג המטבח התלת-ממדי: כל כפתור בפאנל */
  if (document.getElementById('views')) {
    var once = {};
    function first(name) { if (!once[name]) { once[name] = 1; ev(name); } }
    var viewEl = document.getElementById('view');
    if (viewEl) {
      viewEl.addEventListener('pointerdown', function () { first('orbit-first'); }, true);
      viewEl.addEventListener('wheel', function () { first('zoom-first'); }, { passive: true, capture: true });
    }
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button,input') : null;
      if (!b) return;
      var p = b.parentElement;
      if (p && p.id === 'views') {
        var idx = Array.prototype.indexOf.call(p.children, b) + 1;
        return ev('view-' + idx);
      }
      if (b.id === 'tour') return ev('tour');
      if (b.id === 'snap') return ev('snap');
      if (b.id === 'snap4k') return ev('snap-4k');
      if (b.id === 'fold') return ev('menu-toggle');
      if (b.dataset) {
        if (b.dataset.w) return ev('walls-' + b.dataset.w);
        if (b.dataset.l) return ev('light-' + b.dataset.l);
        if (b.dataset.q) return ev('quality-' + b.dataset.q);
        if (b.dataset.p) return ev('pathtrace-' + b.dataset.p);
      }
      if (p && p.closest && p.closest('#toggles')) return ev('layer-toggle');
    }, true);
  }
})();
