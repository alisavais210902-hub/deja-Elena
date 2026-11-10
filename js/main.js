document.addEventListener('DOMContentLoaded', () => {

  /* ===== Галереи: стрелки + свайп + точки ===== */
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const track = gallery.querySelector('.gallery__track');
    const slides = [...track.children];
    const dotsBox = gallery.querySelector('.gallery__dots');
    let index = 0;

    // точки
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery__dot' + (i === 0 ? ' gallery__dot--active' : '');
      dot.setAttribute('aria-label', 'Фото ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(dot);
    });
    const dots = [...dotsBox.children];

    function syncDots(i) {
      index = i;
      dots.forEach((d, j) => d.classList.toggle('gallery__dot--active', j === i));
    }

    function goTo(i) {
      const next = (i + slides.length) % slides.length;
      syncDots(next);
      track.scrollTo({ left: track.clientWidth * next, behavior: 'smooth' });
    }

    // старт всегда с первого фото — сбрасываем позицию при загрузке
    track.scrollLeft = 0;
    syncDots(0);

    gallery.querySelector('.gallery__arrow--prev').addEventListener('click', () => goTo(index - 1));
    gallery.querySelector('.gallery__arrow--next').addEventListener('click', () => goTo(index + 1));

    // подсветка точек при любом скролле (свайп / прокрутка)
    let raf;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== index && i >= 0 && i < slides.length) syncDots(i);
      });
    }, { passive: true });

    // свайп мышью (для десктопа)
    let isDown = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', e => {
      isDown = true; startX = e.clientX; startScroll = track.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
      if (!isDown) return;
      track.scrollLeft = startScroll - (e.clientX - startX);
    });
    window.addEventListener('pointerup', () => {
      if (!isDown) return;
      isDown = false;
      goTo(Math.round(track.scrollLeft / track.clientWidth));
    });
  });

  /* ===== Плавное появление секций ===== */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        en.target.querySelectorAll('.howto__list li').forEach((li, i) => {
          setTimeout(() => li.classList.add('visible'), i * 120);
        });
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('section').forEach(s => io.observe(s));
});
