// Hovering the word "designer" in the hero sends out a set of name tags, like the multiplayer cursors in
// Figma: each is a small coloured arrow with a rounded label. They glide out of the word, then each one
// wanders from element to element on the page, settling on one for a moment before sliding on to another,
// and glide back into the word when the pointer leaves.
//
// THE LABELS ARE THE SKILLS SANCHITA GAVE FOR THIS EFFECT, exactly as she wrote them. They are hers to
// change: edit, remove or add to the list and the cursors adapt.
(function () {
  var trigger = document.querySelector('[data-skills]');
  if (!trigger || !window.matchMedia('(pointer: fine)').matches) return;

  // pastel pills with dark text; each has a deeper shade of the same colour for its arrow
  var TAGS = [
    { text: 'User Experience',          color: '#ffc7d6', arrow: '#f0668f' },
    { text: 'usability testing',        color: '#d8c8ff', arrow: '#8e6bf0' },
    { text: 'prototyping',              color: '#bcd8ff', arrow: '#5a9af0' },
    { text: 'journey mapping',          color: '#b4ecdf', arrow: '#2cbfa0' },
    { text: 'Information architecture', color: '#d3f0b4', arrow: '#7ac24a' },
    { text: 'conversational UX',        color: '#ffe1b5', arrow: '#f0a03a' },
    { text: 'design thinking',          color: '#fff1a6', arrow: '#e6c200' }
  ];
  // the kinds of element on the page a cursor may visit (only ones in view, and not too small)
  var VISIT = 'h1,h2,h3,p,.tool,.primary-nav a,.brand,.weather-note,.design-word,.hero-accent,.tag,img,video,.project-card,.view-case-study,.quote-tile';

  var ARROW = '<svg viewBox="0 0 13 18" class="fc-arrow" aria-hidden="true"><path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"/></svg>';
  var layer = document.createElement('div');
  layer.className = 'fc-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var on = false, raf = 0, t0 = 0;
  var items = TAGS.map(function (t, i) {
    var el = document.createElement('span');
    el.className = 'fc';
    el.style.setProperty('--c', t.color); el.style.setProperty('--a', t.arrow);
    el.innerHTML = ARROW + '<span class="fc-label">' + t.text + '</span>';
    layer.appendChild(el);
    return { el: el, w: 0, x: 0, y: 0, a: 0, mode: 'idle', delay: i * 120, target: null, ph: i * 1.9 };
  });

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }   // slow, fast, slow
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function origin() { var r = trigger.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

  // An element to visit, and a spot on it, such that this tag will not cover the spot another tag is on or
  // heading for. Tags can pass over one another briefly while they glide, but they never come to rest on
  // each other.
  var TAGH = 46, GAP = 10;
  function box(it, pt) {                      // where the tag would be drawn if its arrow tip were at pt
    var w = (it.w || 170) + 11;
    return { x: Math.max(8, Math.min(pt.x, innerWidth - w - 24)), y: Math.max(24, Math.min(pt.y, innerHeight - 52)), w: w };
  }
  function clash(it, pt) {
    var a = box(it, pt);
    return items.some(function (o) {
      if (o === it || !o.target) return false;
      var b = box(o, point(o.target));
      return Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + GAP > 0 && Math.min(a.y + TAGH, b.y + TAGH) - Math.max(a.y, b.y) + GAP > 0;
    });
  }
  function pick(it) {
    var taken = items.map(function (o) { return o.target && o.target.el; });
    var list = [];
    document.querySelectorAll(VISIT).forEach(function (el) {
      if (layer.contains(el) || taken.indexOf(el) > -1) return;
      var r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 14) return;
      if (r.bottom < 40 || r.top > innerHeight - 60 || r.right < 40 || r.left > innerWidth - 60) return;
      list.push(el);
    });
    if (!list.length) return null;
    var far = list.filter(function (el) {
      var r = el.getBoundingClientRect();
      return Math.hypot(r.left + r.width / 2 - it.x, r.top + r.height / 2 - it.y) > 140;
    });
    var pool = far.length ? far : list;
    for (var tries = 0; tries < 30; tries++) {
      var tg = { el: pool[Math.floor(Math.random() * pool.length)], u: rnd(0.12, 0.88), v: rnd(0.2, 0.8) };
      if (!clash(it, point(tg))) return tg;
    }
    return null;                               // nowhere clear right now: the caller waits a moment and tries again
  }

  function point(tg) {                         // the spot on the target element the arrow tip lands on
    var r = tg.el.getBoundingClientRect();
    return { x: r.left + tg.u * r.width, y: r.top + tg.v * r.height };
  }

  function go(it, now, to) {                   // start a glide from where the cursor is now
    it.fx = it.x; it.fy = it.y; it.t1 = now;
    it.dur = to === 'home' ? 700 : rnd(1100, 1900);
    var dx = (to === 'home' ? origin().x : point(it.target).x) - it.fx;
    var dy = (to === 'home' ? origin().y : point(it.target).y) - it.fy;
    var bend = rnd(-0.22, 0.22);                // a gentle curve, so the path is not a straight line
    it.cx = it.fx + dx / 2 - dy * bend; it.cy = it.fy + dy / 2 + dx * bend;
    it.mode = to === 'home' ? 'home' : 'move';
  }

  function frame(now) {
    var o = origin(), busy = false;
    items.forEach(function (it) {
      if (!it.w) it.w = it.el.lastChild.offsetWidth + 11;
      if (it.mode === 'idle') {
        if (on && now - t0 >= it.delay) { it.x = o.x; it.y = o.y; it.target = pick(it); if (it.target) go(it, now, 'target'); else it.mode = 'wait'; }
      } else if (it.mode === 'move' || it.mode === 'home') {
        var p = Math.min(1, (now - it.t1) / it.dur), e = reduce ? 1 : ease(p);
        var tx = it.mode === 'home' ? o.x : point(it.target).x, ty = it.mode === 'home' ? o.y : point(it.target).y;
        var m = 1 - e;
        it.x = m * m * it.fx + 2 * m * e * it.cx + e * e * tx;
        it.y = m * m * it.fy + 2 * m * e * it.cy + e * e * ty;
        if (it.mode === 'home') it.a = 1 - e; else it.a = Math.min(1, it.a + 0.06);
        if (p >= 1) {
          if (it.mode === 'home') { it.mode = 'idle'; it.a = 0; it.target = null; }
          else { it.mode = 'dwell'; it.dwellUntil = now + rnd(1400, 3200); }
        }
      } else if (it.mode === 'dwell') {
        var pt = point(it.target);                 // follows the element if the page scrolls
        it.x = pt.x + (reduce ? 0 : Math.sin(now / 900 + it.ph) * 3); it.y = pt.y + (reduce ? 0 : Math.cos(now / 1100 + it.ph) * 3);
        if (!on) go(it, now, 'home');
        else if (now >= it.dwellUntil) { var prev = it.target; it.target = null; var nt = pick(it); if (nt) { it.target = nt; go(it, now, 'target'); } else { it.target = prev; it.dwellUntil = now + 1000; } }
      } else if (it.mode === 'wait') {
        if (!on) it.mode = 'idle'; else { it.target = pick(it); if (it.target) go(it, now, 'target'); }
      }
      if (!on && (it.mode === 'move')) go(it, now, 'home');   // leaving mid-glide: turn round and head home
      if (it.mode !== 'idle') busy = true;
      it.bx = Math.max(8, Math.min(it.x, innerWidth - it.w - 24)); it.by = Math.max(24, Math.min(it.y, innerHeight - 52));
    });
    items.forEach(function (it) {
      it.el.style.transform = 'translate(' + it.bx.toFixed(1) + 'px,' + it.by.toFixed(1) + 'px) scale(' + (0.7 + 0.3 * it.a).toFixed(3) + ')';
      it.el.style.opacity = it.a.toFixed(3);
    });
    if (busy || on) raf = requestAnimationFrame(frame);
    else { raf = 0; layer.classList.remove('is-on'); }
  }
  function run() { layer.classList.add('is-on'); if (!raf) raf = requestAnimationFrame(frame); }

  trigger.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'mouse') return; on = true; t0 = performance.now(); run(); });
  trigger.addEventListener('pointerleave', function () { on = false; run(); });
})();
