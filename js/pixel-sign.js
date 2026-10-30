(function () {
  // The pixel sign at the very end of the home page: a message written in small blue pixels that types
  // itself out once, the first time it scrolls into view, then stays. Four rows of tiny pixels flicker faintly below it.
  var canvas = document.querySelector('.pixel-sign-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var MESSAGE = 'THINK. DESIGN. CREATE.';
  var BLUE = '73,104,220', ORANGE = '226,128,78';
  var CELL = 7;                 // one quarter of the 28px squares in the page background
  var BAND_ROWS = 4;            // the four lines of small pixels along the bottom
  var FRAME_MS = 1000 / 30;

  // 5 x 7 pixel letters, one string per row
  var FONT = {
    L: ['10000','10000','10000','10000','10000','10000','11111'],
    E: ['11111','10000','10000','11110','10000','10000','11111'],
    T: ['11111','00100','00100','00100','00100','00100','00100'],
    U: ['10001','10001','10001','10001','10001','10001','01110'],
    S: ['01111','10000','10000','01110','00001','00001','11110'],
    B: ['11110','10001','10001','11110','10001','10001','11110'],
    I: ['01110','00100','00100','00100','00100','00100','01110'],
    D: ['11110','10001','10001','10001','10001','10001','11110'],
    O: ['01110','10001','10001','10001','10001','10001','01110'],
    M: ['10001','11011','10101','10101','10001','10001','10001'],
    H: ['10001','10001','10001','11111','10001','10001','10001'],
    N: ['10001','11001','10101','10011','10001','10001','10001'],
    G: ['01110','10001','10000','10111','10001','10001','01111'],
    R: ['11110','10001','10001','11110','10100','10010','10001'],
    K: ['10001','10010','10100','11000','10100','10010','10001'],
    C: ['01110','10001','10000','10000','10000','10001','01110'],
    A: ['01110','10001','10001','11111','10001','10001','10001'],
    '.': ['00000','00000','00000','00000','00000','11000','11000']   // full stop: a small square
  };

  var TYPE_MS = 130, FADE = 140;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var w = 0, h = 0, dpr = 1, px = [], letters = 0, startedAt = null;
  var band = [], raf = 0, last = 0, inView = !('IntersectionObserver' in window);   // waits for the observer, so typing starts when first seen

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.parentNode.clientWidth;
    // one line if it fits at a comfortable size, otherwise two
    var lines = [MESSAGE], cell = CELL;
    var oneLineW = (MESSAGE.length * 6 - 3) * CELL;
    if (oneLineW > w * 0.92) lines = ['THINK. DESIGN.', 'CREATE.'];
    var longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    cell = Math.max(2, Math.min(CELL, Math.floor((w * 0.92) / (longest * 6))));

    var lineH = 7 * cell, gap = 3 * cell, pad = 8 * cell;
    var textH = lines.length * lineH + (lines.length - 1) * gap;
    h = pad + textH + pad + BAND_ROWS * CELL;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // pixels of the message, each tagged with the letter it belongs to
    px = []; letters = 0;
    lines.forEach(function (line, li) {
      // each letter is 5 columns plus 1 of spacing; the full stop only takes 3
      var cols = 0;
      for (var n = 0; n < line.length; n++) cols += line[n] === '.' ? 3 : 6;
      var x0 = Math.round((w - (cols - 1) * cell) / 2), y0 = pad + li * (lineH + gap), at = 0;
      for (var i = 0; i < line.length; i++) {
        var g = FONT[line[i]];
        if (g && line[i] !== ' ') {
          for (var r = 0; r < 7; r++) for (var c = 0; c < 5; c++) {
            if (g[r][c] === '1') px.push({ x: x0 + (at + c) * cell, y: y0 + r * cell, s: cell, k: letters, d: Math.random() });
          }
          letters++;
        }
        at += line[i] === '.' ? 3 : 6;
      }
    });

    // the four lines of small pixels along the bottom edge
    var cols = Math.ceil(w / CELL);
    band = [];
    for (var b = 0; b < cols * BAND_ROWS; b++) band.push({ phase: Math.random() * 6000, period: 900 + Math.random() * 1300, on: Math.random() < 0.35, orange: Math.random() < 0.2 });
  }

  function messageAlpha(p, t) {
    var inAt = p.k * TYPE_MS + p.d * 90;
    return Math.min(1, Math.max(0, (t - inAt) / FADE));
  }

  function draw(now, still) {
    ctx.clearRect(0, 0, w, h);
    // the message types out once, from the moment the sign first scrolls into view, and then stays
    var t = still || startedAt === null ? (still ? 1e9 : -1) : now - startedAt;
    // message: with reduced motion it is shown whole and stays put
    px.forEach(function (p) {
      var a = still ? 1 : messageAlpha(p, t);
      if (a <= 0) return;
      ctx.fillStyle = 'rgba(' + BLUE + ',' + a.toFixed(3) + ')';
      ctx.fillRect(p.x, p.y, p.s - (p.s > 3 ? 1 : 0), p.s - (p.s > 3 ? 1 : 0));
    });
    // band of tiny pixels
    var cols = Math.ceil(w / CELL), top = h - BAND_ROWS * CELL;
    for (var i = 0; i < band.length; i++) {
      var q = band[i];
      if (!q.on) continue;
      var f = still ? 0.5 : 0.5 + 0.5 * Math.sin(((now + q.phase) / q.period) * Math.PI * 2);
      ctx.fillStyle = 'rgba(' + (q.orange ? ORANGE : BLUE) + ',' + (0.1 + f * 0.32).toFixed(3) + ')';
      ctx.fillRect((i % cols) * CELL, top + Math.floor(i / cols) * CELL, CELL - 1, CELL - 1);
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < FRAME_MS) return;
    last = now;
    if (startedAt === null) startedAt = now;
    draw(now, false);
  }
  function play() { if (!raf && !reduce && inView && !document.hidden) raf = requestAnimationFrame(frame); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  layout();
  draw(0, reduce);   // before it first plays, only the tiny pixels show; the message waits for the first view
  window.addEventListener('resize', function () { layout(); draw(performance.now(), reduce); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) play(); else stop();
    }, { threshold: 0.05 }).observe(canvas);
  }
  play();
})();
