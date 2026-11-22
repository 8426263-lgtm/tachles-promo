/* ספירת פעולות בדפי המטבח (kc = kitchen counter).
   אין שרת משלנו: כל פעולה מדווחת ל-Cloudflare Web Analytics כ"עמוד וירטואלי" /e/kitchen/<פעולה>
   (אותה שיטה שבה נספרים /demo ו-/app באפליקציה). רואים ב: dash.cloudflare.com > Analytics > Web analytics > Pages.
   מופעל רק ב-http/https, כך שקובץ שהורד ונפתח מקומית לא מדווח כלום ולא נשבר. */
(function () {
  if (!/^https?:$/.test(location.protocol)) return;
  var prefix = '/e/' + (window.KC_AREA || 'kitchen');
  var last = {};
  function ev(name) {
    try {
      var now = Date.now();
      if (last[name] && now - last[name] < 800) return;
      last[name] = now;
      var orig = location.pathname + location.search + location.hash;
      history.pushState(null, '', prefix + '/' + name);
      setTimeout(function () { try { history.replaceState(null, '', orig); } catch (x) {} }, 400);
    } catch (x) {}
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
    if (t) ev(t.getAttribute('data-kc'));
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
