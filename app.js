/* Schuler Auktionen – közös viselkedés + scroll-animációk */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Ikonok (a Figma Font Awesome Pro ikonjai helyett inline SVG) ---------- */
  var I = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.6 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.3 0 5.3 3.1 4.1 6.6-1.7 4.8-9.2 9.4-9.2 9.4z"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z"/><path d="M5 17a3 3 0 013-3h11"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/></svg>',
    sliders: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0115 0"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>'
  };
  window.__icons = I;
  function icons(root) {
    $$('[data-i]', root).forEach(function (el) {
      if (!el.innerHTML.trim() || el.hasAttribute('data-i-fill')) { el.innerHTML = I[el.getAttribute('data-i')] || ''; }
    });
  }

  /* ---------- Képek: helyi assets/, tartalékként a Figma ideiglenes URL ---------- */
  var REMOTE = {
    e82591ca: 'e82591ca-20bc-4add-b6ef-1aae7895d449', a459: '459a0d45-a626-4771-b48c-4a730fc215c6',
    c60e6: '60e633d2-5158-40cc-9a8b-f397e4288f9d', p2100: '21003f36-c52b-435e-a891-416090515ba6'
  };
  var MAP = {};
  ('28cc9.svg a7177.svg fe9a5.svg b4716.png ecdf5.png 2187b.png c853b.png 2eb2d.png 2ba54.png fbcd9.png 86edd.png 95f9f.png ' +
   'bbc8f.png 2e2b0.png ec488.png 60bbd.png 369ab.png 51067.png e3ae1.png df121.png 2ec11.png a0526.png bbf48.svg c8189.svg ' +
   '9a758.svg 872ef.svg 34621.svg 45c02.svg 1db70.svg ff8bb.svg 0a81c.svg').split(' ').forEach(function (f) { MAP[f] = REMOTE.e82591ca; });
  '843cc.png 37009.png dacf9.png b58cb.png ab91e.png ecb6f.png 0c017.png 5b81c.png d8664.png c3f32.svg 0e694.svg febb3.svg 1904a.svg d71f2.svg 09edc.svg 9ee79.svg 453b8.svg 2d06e.svg 88ba8.svg 59615.svg'.split(' ').forEach(function (f) { MAP[f] = REMOTE.a459; });
  '9ff51.png 16464.png 1bb1b.png ad5f1.png 3b3ce.png'.split(' ').forEach(function (f) { MAP[f] = REMOTE.c60e6; });
  'ece15.png e7da7.png b309e.svg b17ae.svg fb1c1.svg db7a2.svg'.split(' ').forEach(function (f) { MAP[f] = REMOTE.p2100; });
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    if (!t.dataset.tried) {
      var m = (t.getAttribute('src') || '').match(/assets\/([^/]+)$/);
      if (m && MAP[m[1]]) { t.dataset.tried = '1'; t.src = 'https://www.figma.com/api/mcp/asset/' + MAP[m[1]] + '/' + m[1]; return; }
    }
    // Ha a kép sehonnan sem tölthető be: nincs törött ikon, a logó szövegként jelenik meg
    t.style.visibility = 'hidden';
    var fb = t.getAttribute('data-fb');
    if (fb && !t.dataset.fbDone) { t.dataset.fbDone = '1'; var s = document.createElement('span'); s.className = 'fbtxt'; s.textContent = fb; t.parentNode.insertBefore(s, t); }
  }, true);

  /* ---------- Fejléc, menü, lábléc ---------- */
  var favs;
  try { favs = JSON.parse(localStorage.getItem('sch-favs')); } catch (e) {}
  if (!Array.isArray(favs)) favs = ['3005', '128'];
  function saveFavs() { try { localStorage.setItem('sch-favs', JSON.stringify(favs)); } catch (e) {} }

  var page = $('.page');
  var hdr = $('#site-header');
  if (hdr) {
    hdr.outerHTML =
      '<div class="progress"><i></i></div>' +
      '<header class="top"><button class="burger" aria-label="Menu"><i></i><i></i><i></i></button>' +
      '<a class="logo" href="index.html"><img src="assets/logo.svg" alt="Schuler" data-fb="SCHULER"></a>' +
      '<div class="icons"><a class="icbtn" href="auction.html#lots" aria-label="Search">' + I.search + '</a>' +
      '<a class="icbtn" href="auction.html" aria-label="Favorites">' + I.heart + '<span class="badge">' + favs.length + '</span></a></div></header>' +
      menuHTML();
  }
  var top = $('.top'), burger = $('.burger');

  /* ---------- Mobil navigációs panel (Figma: Mobile navigation panel) ---------- */
  function menuHTML() {
    function sub(items, first) {
      return '<div class="sub"><div class="subin">' + items.map(function (it, i) {
        return '<a' + (it[1] ? ' href="' + it[1] + '"' : '') + (first && i === 0 ? ' class="cur"' : '') + '>' + it[0] + '</a>';
      }).join('') + '</div></div>';
    }
    function item(label, items, open, big) {
      return '<div class="mn' + (open ? ' open' : '') + '"><button aria-expanded="' + (open ? 'true' : 'false') + '"><span' + (big ? ' class="big"' : '') + '>' + label + '</span><i class="pm"></i></button>' + sub(items, open) + '</div>';
    }
    function link(label, href) {
      return '<div class="mn single"><a href="' + href + '"><span>' + label + '</span>' + I.right + '</a></div>';
    }
    return '<div class="mpanel" aria-hidden="true" role="dialog" aria-label="Menu">' +
      '<div class="mp-head"><button class="mp-close" aria-label="Close menu">' + I.x + '</button>' +
      '<a class="logo" href="index.html"><img src="assets/logo.svg" alt="Schuler" data-fb="SCHULER"></a>' +
      '<div class="icons"><a class="icbtn" href="auction.html#lots" aria-label="Search">' + I.search + '</a>' +
      '<a class="icbtn" href="auction.html" aria-label="Favorites">' + I.heart + '<span class="badge">' + favs.length + '</span></a></div></div>' +
      '<div class="mp-body">' +
      '<form class="mp-search" action="auction.html"><span class="si">' + I.search + '</span><input id="mp-q" type="search" placeholder="Search auctions, lots, artists…" aria-label="Search"></form>' +
      '<nav class="mp-nav">' +
      item('Auction', [['Auction dates', 'auction.html#overview'], ['Online catalogue', 'auction.html#lots'], ['Archive', 'category.html']], true, true) +
      item('Consignment &amp; Selling', [['How to sell', 'auction.html#selling'], ['Departments', 'index.html#departments'], ['Consignment', 'index.html#sell'], ['Appraisal', 'appraisal.html']]) +
      item('Bidding &amp; Buying', [['How to bid', 'auction.html#bidding'], ['Information for buyers', 'auction.html#bidding']]) +
      item('About Schuler', [['Team', 'index.html#expertise'], ['Our Story', 'index.html#about'], ['Press', null]]) +
      link('Contact', 'index.html#contact') +
      '</nav>' +
      '<div class="mp-row"><div class="lang"><button class="lang-btn" aria-haspopup="listbox" aria-expanded="false"><span class="g">' + I.globe + '</span><span class="lt">English</span><span class="ch">' + I.down + '</span></button>' +
      '<ul class="lang-list" role="listbox"><li role="option" class="on">English</li><li role="option">Deutsch</li><li role="option">Français</li></ul></div>' +
      '<a class="btn mp-login"><span class="u">' + I.user + '</span><span>Login</span><span data-i="right"></span></a></div>' +
      '<div class="mp-note"><span>Schuler Auktionen · Zürich</span><span>+41 44 123 45 67</span></div>' +
      '</div></div>';
  }
  var panel = $('.mpanel');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && panel) { var c = $('.mp-close', panel); setTimeout(function () { c && c.focus({ preventScroll: true }); }, 60); }
    else if (burger) { try { burger.focus({ preventScroll: true }); } catch (e) {} }
  }
  if (burger && panel) {
    burger.addEventListener('click', function () { setMenu(true); });
    $('.mp-close', panel).addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false); });
    $$('.mn > button', panel).forEach(function (b) {
      b.addEventListener('click', function () {
        var mn = b.parentNode, willOpen = !mn.classList.contains('open');
        $$('.mn', panel).forEach(function (o) { var ob = $('button', o); if (!ob) return; o.classList.remove('open'); ob.setAttribute('aria-expanded', 'false'); });
        if (willOpen) { mn.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
      });
    });
    $$('.mn a, .mp-head .logo, .mp-head .icbtn', panel).forEach(function (a) {
      a.addEventListener('click', function () {
        var h = a.getAttribute('href') || '';
        var same = h.split('#')[0] === (location.pathname.split('/').pop() || 'index.html');
        setMenu(false);
        if (same && h.indexOf('#') > -1) { /* ugyanazon az oldalon: a böngésző görget */ }
      });
    });
    var lang = $('.lang', panel), lb = $('.lang-btn', lang);
    lb.addEventListener('click', function (e) { e.stopPropagation(); var o = !lang.classList.contains('open'); lang.classList.toggle('open', o); lb.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    $$('.lang-list li', lang).forEach(function (li) {
      li.addEventListener('click', function () {
        $$('.lang-list li', lang).forEach(function (x) { x.classList.remove('on'); }); li.classList.add('on');
        $('.lt', lang).textContent = li.textContent; lang.classList.remove('open'); lb.setAttribute('aria-expanded', 'false');
      });
    });
    panel.addEventListener('click', function () { lang.classList.remove('open'); });
    $('.mp-search', panel).addEventListener('submit', function (e) { e.preventDefault(); setMenu(false); location.href = 'auction.html#lots'; });
  }
  var ft = $('#site-footer');
  if (ft) {
    ft.outerHTML =
      '<footer class="footer">' +
      '<img class="flogo" data-fb="SCHULER AUKTIONEN" src="assets/logo-footer.svg" alt="Schuler Auktionen">' +
      '<div class="cols" data-reveal><div><b>Schuler Auktionen</b><br>Seestrasse 341<br>8038 Zürich</div><div class="vsep"></div>' +
      '<div style="line-height:1.5"><b style="font-size:16px">Opening hours</b><br><b style="font-size:16px">09:00–12:00 · 13:00–17:00</b><br><span style="font-size:14px">Monday to Friday</span></div></div><hr>' +
      '<div class="nav" data-reveal><div><b>Buying</b><a href="auction.html">Auctions</a><a href="auction.html#lots">Search lots</a><a href="auction.html#bidding">Bidding</a><a href="category.html">Results</a></div>' +
      '<div><b>Selling</b><a href="appraisal.html">Valuation</a><a href="index.html#sell">Consign</a><a href="index.html#departments">Departments</a><a>Estates</a></div>' +
      '<div><b>Schuler</b><a href="index.html#about">About us</a><a href="index.html#expertise">Specialists</a><a>News</a><a href="index.html#contact">Contact</a></div></div><hr>' +
      '<div class="social"><span>Follow us on</span><a aria-label="Facebook">f</a><a aria-label="Instagram">ig</a><a aria-label="LinkedIn">in</a></div><hr>' +
      '<div class="legal"><div class="l"><a>Privacy</a><a>Terms</a><a>Imprint</a></div><div>© 2026 Schuler Auktionen AG. All rights reserved.</div></div></footer>';
  }
  icons(document);

  /* ---------- Kedvencek ---------- */
  function syncFavs() {
    $$('.badge').forEach(function (b) { b.textContent = favs.length; b.classList.add('bump'); setTimeout(function () { b.classList.remove('bump'); }, 280); });
    $$('[data-fav]').forEach(function (btn) {
      var on = favs.indexOf(btn.getAttribute('data-fav')) > -1;
      btn.classList.toggle('on', on);
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-fav]'); if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    var id = btn.getAttribute('data-fav'), i = favs.indexOf(id);
    if (i > -1) favs.splice(i, 1); else favs.push(id);
    saveFavs(); syncFavs();
    btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
  });
  syncFavs();

  /* ---------- Reveal (belépő animációk) ---------- */
  var revealEls = $$('[data-reveal], .eyebrow, .step, .more');
  function showAll() { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  if (reduce || !('IntersectionObserver' in window)) { showAll(); }
  else {
    // késleltetés a testvér elemek között (stagger)
    $$('[data-stagger]').forEach(function (p) {
      $$('[data-reveal]', p).forEach(function (c, i) { c.style.setProperty('--d', (i * 0.09) + 's'); });
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); if (en.target.hasAttribute('data-count')) countUp(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    // A clip elem 1%-a látszik (lásd CSS), így küszöb 0-val is megfigyelhető
    var ioClip = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ioClip.unobserve(en.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    revealEls.forEach(function (el) {
      if (el.getAttribute('data-reveal') === 'clip') ioClip.observe(el); else io.observe(el);
    });
  }

  /* ---------- Számlálók ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '', pad = +el.getAttribute('data-pad') || 0;
    var from = +el.getAttribute('data-from') || 0, dur = 1400, t0 = null;
    var pre = el.getAttribute('data-prefix') || '', sep = el.hasAttribute('data-prefix') ? "'" : '';
    function fmt(v) { var s = String(Math.round(v)); while (s.length < pad) s = '0' + s; if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, sep); return pre + s + suf; }
    if (reduce) { el.textContent = fmt(to); return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(from + (to - from) * e); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if (reduce || !('IntersectionObserver' in window)) $$('[data-count]').forEach(function (el) { countUp(el); });

  /* ---------- Slider / carousel ---------- */
  $$('[data-slider]').forEach(function (root) {
    var track = $('.slides', root), n = track.children.length, cur = 0, timer, dotsWrap = $('.dots', root);
    var dots = [];
    if (dotsWrap) { for (var i = 0; i < n; i++) { (function (k) { var d = document.createElement('i'); d.addEventListener('click', function () { go(k, true); }); dotsWrap.appendChild(d); dots.push(d); })(i); } }
    function go(k, user) {
      cur = (k + n) % n; track.style.transform = 'translateX(' + (-100 * cur) + '%)';
      dots.forEach(function (d, j) { d.classList.toggle('on', j === cur); });
      Array.prototype.forEach.call(track.children, function (c, j) { c.classList.toggle('cur', j === cur); });
      root.dispatchEvent(new CustomEvent('slide', { detail: cur }));
      if (user) restart();
    }
    function restart() { clearInterval(timer); if (!reduce && root.hasAttribute('data-auto')) timer = setInterval(function () { go(cur + 1); }, 5200); }
    var p = $('.prev', root), nx = $('.next', root);
    if (p) p.addEventListener('click', function () { go(cur - 1, true); });
    if (nx) nx.addEventListener('click', function () { go(cur + 1, true); });
    var x0 = null;
    root.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    root.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), true); });
    root.addEventListener('pointercancel', function () { x0 = null; });
    root._go = go; go(0); restart();
  });
  // galéria bélyegképek szinkronja
  $$('[data-thumbs]').forEach(function (th) {
    var sl = $(th.getAttribute('data-thumbs')); if (!sl) return;
    var bs = $$('button', th);
    bs.forEach(function (b, i) { b.addEventListener('click', function () { sl._go(i, true); }); });
    sl.addEventListener('slide', function (e) { bs.forEach(function (b, i) { b.classList.toggle('on', i === e.detail); }); });
    bs.forEach(function (b, i) { b.classList.toggle('on', i === 0); });
  });

  /* ---------- Scroll-vezérelt effektek (egy rAF ciklus) ---------- */
  var par = $$('[data-parallax]'), rails = $$('.rail[data-meter]'), bar = $('.progress i'), lines = $$('[data-scrub]');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset, vh = window.innerHeight, h = document.documentElement.scrollHeight - vh;
    if (top) top.classList.toggle('scrolled', y > 8);
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    if (!reduce) {
      par.forEach(function (el) {
        var r = el.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
        var f = parseFloat(el.getAttribute('data-parallax')) || 0.12, c = (r.top + r.height / 2 - vh / 2);
        var img = el.querySelector('img') || el; img.style.transform = 'translate3d(0,' + (-c * f).toFixed(1) + 'px,0)';
      });
      lines.forEach(function (el) { // scroll-vezérelt kitöltés (pl. címsor alatti vonal)
        var r = el.getBoundingClientRect(), p = Math.min(Math.max((vh * 0.85 - r.top) / (vh * 0.5), 0), 1);
        el.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      });
    }
    rails.forEach(function (rail) {
      var m = $(rail.getAttribute('data-meter')); if (!m) return;
      var max = rail.scrollWidth - rail.clientWidth, p = max > 0 ? rail.scrollLeft / max : 0, i = $('i', m);
      i.style.transform = 'translateX(' + (p * (m.clientWidth - i.offsetWidth)).toFixed(1) + 'px)';
    });
    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  rails.forEach(function (r) { r.addEventListener('scroll', req, { passive: true }); });
  onScroll();

  /* ---------- Tab scrollspy (aukció oldal) ---------- */
  var tabs = $('.tabs');
  if (tabs) {
    var links = $$('a', tabs), bar2 = $('.bar', tabs);
    var secs = links.map(function (a) { return $(a.getAttribute('href')); });
    function mark(i) {
      links.forEach(function (a, j) { a.classList.toggle('on', i === j); });
      if (bar2 && links[i]) { bar2.style.width = links[i].offsetWidth + 'px'; bar2.style.transform = 'translateX(' + links[i].offsetLeft + 'px)'; links[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
    }
    function spy() {
      var line = (top ? top.offsetHeight : 60) + tabs.offsetHeight + 40, idx = 0;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) idx = i; });
      mark(idx);
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(spy); }, { passive: true });
    window.addEventListener('load', spy); spy();
    secs.forEach(function (s) { if (s) s.style.scrollMarginTop = '130px'; });
    // Kattintás: a megfelelő szakaszhoz gördül (sticky fejléc + tabsor alá igazítva).
    // Saját rAF-animáció (a natív smooth scroll beágyazott keretben néha nem fut), majd ellenőrzés:
    // ha az ablak nem tudott görgetni (pl. magasságra nyújtott iframe), scrollIntoView viszi a szülő oldalt.
    var offs = function () { return 60 + tabs.offsetHeight - 1; };
    function settle(s) {
      s.style.scrollMarginTop = offs() + 'px';
      if (Math.abs(s.getBoundingClientRect().top - offs()) > 6) {
        try { s.scrollIntoView({ behavior: 'auto', block: 'start' }); } catch (err) {}
      }
    }
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        var s = secs[i]; if (!s) return;
        e.preventDefault(); mark(i);
        var from = window.scrollY || window.pageYOffset || 0;
        var to = Math.max(0, from + s.getBoundingClientRect().top - offs());
        var dur = reduce ? 0 : Math.min(900, 350 + Math.abs(to - from) * 0.12), t0 = null;
        document.documentElement.style.scrollBehavior = 'auto';
        function step(ts) {
          if (t0 === null) t0 = ts;
          var k = dur ? Math.min((ts - t0) / dur, 1) : 1, ease = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          window.scrollTo(0, from + (to - from) * ease);
          if (k < 1) requestAnimationFrame(step); else { document.documentElement.style.scrollBehavior = ''; settle(s); }
        }
        requestAnimationFrame(step);
        setTimeout(function () { document.documentElement.style.scrollBehavior = ''; settle(s); }, dur + 400);
      });
    });
  }

  /* ---------- Accordion ---------- */
  $$('.acc > button').forEach(function (b) {
    b.addEventListener('click', function () { b.parentNode.classList.toggle('open'); });
  });

  /* ---------- Egyéb ---------- */
  $$('[data-notify]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); var s = $('span', b); if (s) s.textContent = 'You will be notified ✓'; });
  });
  $$('form[data-news]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); var b = $('.btn span', f); if (b) b.textContent = 'Thank you – subscribed'; });
  });
})();
