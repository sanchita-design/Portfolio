// A slow, eased scroll for the links that go to the case studies ("Selected work" and "Work" in the nav).
// The browser's own smooth scrolling is quick and abrupt; this glides: it starts gently, speeds up through
// the middle and settles gently at the end, over about a second and a half. Scrolling by hand
// (wheel, touch or keys) stops it at once. Visitors who prefer reduced motion get a plain jump.
(function () {
  var links = document.querySelectorAll('a[href="#work"]');
  var target = document.getElementById('work');
  if (!links.length || !target) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = 0;

  function offset() {                                   // stop just under the fixed header
    var h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 84;
    return h + 16;
  }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; document.documentElement.style.scrollBehavior = ''; } }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function glide() {
    var from = window.scrollY;
    var to = Math.max(0, Math.round(target.getBoundingClientRect().top + from - offset()));
    if (reduce) { window.scrollTo(0, to); return; }
    var dist = Math.abs(to - from);
    var dur = Math.min(1800, Math.max(900, dist * 1.6));  // longer trips take a little longer
    var t0 = 0;
    document.documentElement.style.scrollBehavior = 'auto';   // so each step lands exactly where it is told
    function step(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, from + (to - from) * ease(p));
      if (p < 1) raf = requestAnimationFrame(step); else stop();
    }
    raf = requestAnimationFrame(step);
  }

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); stop(); glide(); history.replaceState(null, '', '#work');
      if (a.classList.contains('selected-work')) a.classList.add('is-clicked');   // its underline goes away once clicked
    });
    a.addEventListener('pointerleave', function () { a.classList.remove('is-clicked'); });
    a.addEventListener('blur', function () { a.classList.remove('is-clicked'); });
  });
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { window.addEventListener(ev, stop, { passive: true }); });
})();
