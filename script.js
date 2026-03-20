(() => {
  const gallery      = document.getElementById('gallery');
  const inner        = document.getElementById('galleryInner');
  const slides       = document.querySelectorAll('.slide');
  const total        = slides.length;
  let current        = 0;
  let animating      = false;

  const goTo = (i) => {
    if (animating) return;
    const target = Math.max(0, Math.min(i, total - 1));
    if (target === current) return;
    animating = true;
    current = target;
    inner.style.transform = `translateX(-${current * 100}vw)`;
    setTimeout(() => animating = false, 1200);
  };

  // ── Menu ──
  const menuBtn   = document.getElementById('menuBtn');
  const menuPopup = document.getElementById('menuPopup');

  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    menuPopup.classList.toggle('open');
  });

  document.addEventListener('click', () => menuPopup.classList.remove('open'));

  // ── Arrow buttons ──
  const prev = document.createElement('button');
  prev.className = 'arrow prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = `<svg width="16" height="30" viewBox="0 0 16 30" fill="none">
    <path d="M14 2L2 15l12 13" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const next = document.createElement('button');
  next.className = 'arrow next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = `<svg width="16" height="30" viewBox="0 0 16 30" fill="none">
    <path d="M2 2l12 13L2 28" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  document.body.append(prev, next);

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  // ── Keyboard ──
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(current - 1); }
  });

  // ── Wheel / trackpad ──
  let accumulated = 0;
  let wheelTimer;

  gallery.addEventListener('wheel', e => {
    e.preventDefault();
    accumulated += e.deltaX + e.deltaY;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { accumulated = 0; }, 200);

    if (accumulated > 80)  { accumulated = 0; goTo(current + 1); }
    if (accumulated < -80) { accumulated = 0; goTo(current - 1); }
  }, { passive: false });

  // ── Touch / drag ──
  let startX = 0;

  gallery.addEventListener('mousedown', e => { startX = e.pageX; });
  gallery.addEventListener('mouseup', e => {
    const delta = startX - e.pageX;
    if (Math.abs(delta) > 50) goTo(delta > 0 ? current + 1 : current - 1);
  });

  gallery.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  gallery.addEventListener('touchend', e => {
    const delta = startX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(delta > 0 ? current + 1 : current - 1);
  }, { passive: true });

})();
