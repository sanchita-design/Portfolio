(function () {
  // Image slider for case studies: rotates every 4 seconds, with dot controls underneath.
  var INTERVAL = 4000;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.media-slider').forEach(function (root) {
    var track = root.querySelector('.slider-track');
    var slides = track.children;
    var dotsEl = root.querySelector('.slider-dots');
    var count = slides.length, idx = 0, timer = null, paused = false, inView = true, dots = [];

    for (var i = 0; i < count; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'slider-dot';
      b.setAttribute('aria-label', 'Show image ' + (i + 1) + ' of ' + count);
      b.addEventListener('click', function (i) { show(i); restart(); }.bind(null, i));
      dotsEl.appendChild(b);
      dots.push(b);
    }
    function show(i) {
      idx = (i + count) % count;
      track.style.transform = 'translateX(' + (-100 * idx) + '%)';
      dots.forEach(function (d, n) { d.setAttribute('aria-current', n === idx ? 'true' : 'false'); });
    }
    function playing() { return !reduce && !paused && inView && !document.hidden; }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() {
      stop();
      if (playing()) timer = setInterval(function () { show(idx + 1); }, INTERVAL);
    }
    root.addEventListener('mouseenter', function () { paused = true; restart(); });
    root.addEventListener('mouseleave', function () { paused = false; restart(); });
    root.addEventListener('focusin', function () { paused = true; restart(); });
    root.addEventListener('focusout', function () { paused = false; restart(); });
    document.addEventListener('visibilitychange', restart);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; restart(); }, { threshold: 0.3 }).observe(root);
    }
    show(0);
    restart();
  });
})();
