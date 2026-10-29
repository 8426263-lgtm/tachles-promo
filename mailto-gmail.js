/* mailto: לבדו לא עושה כלום במחשב בלי תוכנת מייל מוגדרת (או כש-Chrome הוא ברירת המחדל בלי Gmail רשום).
   במחשב: כל קישור mailto: נפתח ככתיבה ב-Gmail בדפדפן. בנייד נשאר mailto (יש שם אפליקציית מייל). */
(function () {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
        var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
        if (!a) return;
        var u;
        try { u = new URL(a.getAttribute('href')); } catch (err) { return; }
        var to = decodeURIComponent(u.pathname);
        var subject = u.searchParams.get('subject');
        var body = u.searchParams.get('body');
        var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to)
            + (subject ? '&su=' + encodeURIComponent(subject) : '')
            + (body ? '&body=' + encodeURIComponent(body) : '');
        e.preventDefault();
        var w = window.open(url, '_blank');
        if (w) w.opener = null; else location.href = url;
    });
})();
