(function () {
  var root = document.querySelector('.carousel');
  if (!root) return;
  var track = root.querySelector('.carousel-track');
  var cards = track.querySelectorAll('.card');
  var dotsEl = root.querySelector('.carousel-dots');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var behavior = reduce ? 'auto' : 'smooth';
  var INTERVAL = 4000;
  var dots = [], step = 0, count = 0, ticking = false;
  var timer = null, hoverPaused = false, inView = true;

  function measure() {
    step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    count = step > 0 ? Math.round(maxScroll() / step) + 1 : 1;
  }
  function maxScroll() { return track.scrollWidth - track.clientWidth; }
  function buildDots() {
    dotsEl.innerHTML = '';
    dots = [];
    if (count < 2) return;
    for (var i = 0; i < count; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot';
      b.setAttribute('aria-label', 'Show testimonial ' + (i + 1) + ' of ' + count);
      b.addEventListener('click', function (i) { goTo(i); restart(); }.bind(null, i));
      dotsEl.appendChild(b);
      dots.push(b);
    }
    dotsEl.removeAttribute('aria-hidden');
  }
  function goTo(i) { track.scrollTo({ left: i * step, behavior: behavior }); }
  function update() {
    ticking = false;
    var idx = step ? Math.round(track.scrollLeft / step) : 0;
    if (track.scrollLeft >= maxScroll() - 2) idx = count - 1;
    idx = Math.max(0, Math.min(count - 1, idx));
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  function advance(dir) {
    var atEnd = track.scrollLeft >= maxScroll() - 2;
    var atStart = track.scrollLeft <= 2;
    if (dir > 0) {
      if (atEnd) track.scrollTo({ left: 0, behavior: behavior });
      else track.scrollBy({ left: step, behavior: behavior });
    } else {
      if (atStart) track.scrollTo({ left: maxScroll(), behavior: behavior });
      else track.scrollBy({ left: -step, behavior: behavior });
    }
  }

  // Auto-rotates unless the visitor prefers reduced motion; pauses while the
  // pointer or keyboard focus is inside, when off-screen, or in a background tab.
  function playing() { return !reduce && !hoverPaused && inView && !document.hidden; }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() {
    stop();
    if (playing()) timer = setInterval(function () { advance(1); }, INTERVAL);
  }

  track.addEventListener('scroll', onScroll, { passive: true });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); advance(1); restart(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); advance(-1); restart(); }
  });
  root.addEventListener('mouseenter', function () { hoverPaused = true; restart(); });
  root.addEventListener('mouseleave', function () { hoverPaused = false; restart(); });
  root.addEventListener('focusin', function () { hoverPaused = true; restart(); });
  root.addEventListener('focusout', function () { hoverPaused = false; restart(); });
  document.addEventListener('visibilitychange', restart);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      restart();
    }, { threshold: 0.3 }).observe(root);
  }

  function layout() { measure(); buildDots(); update(); }
  window.addEventListener('resize', layout);
  layout();
  restart();
})();
