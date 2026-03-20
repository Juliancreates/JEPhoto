(() => {
  const gallery = document.getElementById('gallery');
  const slides  = document.querySelectorAll('.slide');
  const total   = slides.length;
  let current   = 0;

  // ── Custom cursor ──
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

  const tick = () => {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(tick);
  };
  tick();

  // ── Arrow buttons ──
  const prev = document.createElement('button');
  prev.className = 'arrow prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = `<svg width="16" height="30" viewBox="0 0 16 30" fill="none">
    <path d="M14 2L2 15l12 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const next = document.createElement('button');
  next.className = 'arrow next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = `<svg width="16" height="30" viewBox="0 0 16 30" fill="none">
    <path d="M2 2l12 13L2 28" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  document.body.append(prev, next);

  const goTo = i => {
    const target = Math.max(0, Math.min(i, total - 1));
    gallery.scrollTo({ left: target * gallery.clientWidth, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  // ── Track current slide ──
  gallery.addEventListener('scroll', () => {
    current = Math.round(gallery.scrollLeft / gallery.clientWidth);
  }, { passive: true });

  // ── Keyboard ──
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(current - 1); }
  });

  // ── Wheel → horizontal scroll ──
  gallery.addEventListener('wheel', e => {
    e.preventDefault();
    gallery.scrollLeft += e.deltaY + e.deltaX;
  }, { passive: false });

  // ── Click-drag ──
  let dragging = false, startX = 0, scrollStart = 0;

  gallery.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.pageX;
    scrollStart = gallery.scrollLeft;
    cursor.classList.add('drag');
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    cursor.classList.remove('drag');
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    gallery.scrollLeft = scrollStart + (startX - e.pageX);
  });

  // ── Parallax ──
  gallery.addEventListener('scroll', () => {
    const sl = gallery.scrollLeft;
    const w  = gallery.clientWidth;
    slides.forEach((slide, i) => {
      const img = slide.querySelector('img');
      if (img) img.style.transform = `translateX(${(sl - i * w) * 0.06}px)`;
    });
  }, { passive: true });

})();
