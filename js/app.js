(() => {
  'use strict';

  const WHATSAPP_NUMBER = '40700000000'; // înlocuiește cu numărul real, fără +
  const SUPPORTED = ['ro', 'en', 'de'];
  const THEME_LABEL = { ro: 'Mod întunecat', en: 'Dark mode', de: 'Dunkelmodus' };
  let lang = 'ro';

  const t = (key) => translations[lang][key] ?? key;

  /* ---------- Temă ---------- */
  const themeBtn = document.getElementById('theme-toggle');

  function syncThemeUI() {
    const dark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (themeBtn) {
      themeBtn.setAttribute('aria-checked', String(dark));
      themeBtn.setAttribute('aria-label', THEME_LABEL[lang]);
      themeBtn.setAttribute('title', THEME_LABEL[lang]);
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0B0D10' : '#F3F4F6');
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage indisponibil */ }
    syncThemeUI();
  }
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  /* ---------- Limbă ---------- */
  function setLang(next) {
    if (!SUPPORTED.includes(next)) next = 'ro';
    lang = next;
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage indisponibil */ }

    document.documentElement.lang = lang;
    document.title = t('pageTitle');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('pageDesc'));

    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });
    syncThemeUI();
  }

  /* ---------- WhatsApp + GPS ---------- */
  function openWhatsApp(text) {
    window.location.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function sendLocation(btn) {
    const label = btn.querySelector('[data-i18n]');
    const key = label.dataset.i18n;

    if (!navigator.geolocation) { openWhatsApp(t('waNoLoc')); return; }

    btn.disabled = true;
    label.textContent = t('locating');
    const restore = () => { btn.disabled = false; label.textContent = t(key); };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = 'https://maps.google.com/?q=' + latitude.toFixed(6) + ',' + longitude.toFixed(6);
        restore();
        openWhatsApp(t('waLoc').replace('{url}', url));
      },
      () => { restore(); openWhatsApp(t('waNoLoc')); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  /* ---------- Fade-in discret la scroll ---------- */
  function initReveal() {
    const items = document.querySelectorAll('[data-rv]');
    if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Parallax pe poze + mișcarea marcajelor la scroll ---------- */
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layers = Array.from(document.querySelectorAll('[data-px]'));
    const decos = Array.from(document.querySelectorAll('.deco'));
    let ticking = false;

    function update() {
      ticking = false;
      const vh = window.innerHeight;

      layers.forEach((layer) => {
        const box = layer.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        const d = box.top + box.height / 2 - vh / 2;   // distanța față de centrul ecranului
        const lim = box.height * 0.1;                   // stratul are 10% rezervă sus și jos
        const off = Math.max(-lim, Math.min(lim, -d * 0.15));
        layer.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });

      const y = window.scrollY;
      decos.forEach((el) => el.style.setProperty('--sx', y));
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Init ---------- */
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  document.querySelectorAll('.js-wa').forEach((btn) => {
    btn.addEventListener('click', () => sendLocation(btn));
  });

  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* ignorat */ }
  setLang(saved || 'ro');
  initReveal();
  initParallax();
})();