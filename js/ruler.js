// Hovering the word "designing" in the hero draws a design-tool overlay, like selecting text in Figma:
// rulers along the top and left edges of the window, dashed guide lines through the edges of the word,
// a selection box with corner handles, and a small "width × height" label under it.
//
// It is drawn in one smooth motion rather than switched on. A single progress value, p, runs from 0 to 1
// while the pointer is on the word and back to 0 when it leaves. Each part of the overlay is tied to its
// own slice of that range, so they follow one another: the box opens out from the middle of the word, the
// guide lines run out from its edges to the edges of the window, the rulers slide in, and last the corner
// handles and the size label appear. It is one transparent canvas that ignores the pointer, and it only
// appears for a mouse.
(function () {
  var words = document.querySelectorAll('[data-ruler]');
  if (!words.length || !window.matchMedia('(pointer: fine)').matches) return;

  var ACCENT = '73,104,220';
  var RULER = 20;                        // thickness of the rulers, in CSS pixels
  var IN_MS = 900, OUT_MS = 350;         // how long it takes to draw, and to clear
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.createElement('canvas');
  canvas.className = 'ruler-overlay';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var current = null, W = 0, H = 0;
  var p = 0, target = 0, last = 0, raf = 0;

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // the part of p between a and b, as 0 to 1, eased so each move starts quickly and settles gently
  function seg(a, b) {
    var t = Math.min(1, Math.max(0, (p - a) / (b - a)));
    return 1 - Math.pow(1 - t, 3);
  }

  function tag(text, x, y) {             // a bold number on a ruler, on a white patch that covers the ticks
    ctx.font = '700 10px Montserrat, sans-serif';
    var w = ctx.measureText(text).width + 6;
    ctx.fillStyle = '#fff'; ctx.fillRect(x - w / 2, y - 7, w, 14);
    ctx.fillStyle = 'rgb(' + ACCENT + ')';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 0.5);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (!current || p <= 0) return;
    var rects = current.getClientRects();
    var r = rects.length ? rects[0] : current.getBoundingClientRect();
    var x1 = Math.round(r.left), x2 = Math.round(r.right), y1 = Math.round(r.top), y2 = Math.round(r.bottom);
    var cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;

    var box = seg(0, 0.38), guides = seg(0.12, 0.72), rulers = seg(0.2, 0.6), marks = seg(0.5, 0.85), end = seg(0.65, 1);

    // rulers slide in from the edges of the window
    ctx.save();
    ctx.globalAlpha = rulers;
    ctx.translate(0, -(1 - rulers) * RULER);
    ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.fillRect(0, 0, W, RULER);
    ctx.fillStyle = 'rgba(' + ACCENT + ',' + (0.14 * marks) + ')'; ctx.fillRect(x1, 0, x2 - x1, RULER);
    ctx.strokeStyle = 'rgba(58,58,58,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, RULER + 0.5); ctx.lineTo(W, RULER + 0.5); ctx.stroke();
    ctx.strokeStyle = 'rgba(58,58,58,0.45)'; ctx.fillStyle = 'rgba(58,58,58,0.6)';
    ctx.font = '400 9px Montserrat, sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.beginPath();
    for (var x = 0; x <= W; x += 10) { var l = x % 100 === 0 ? 11 : x % 50 === 0 ? 8 : 4; ctx.moveTo(x + 0.5, RULER); ctx.lineTo(x + 0.5, RULER - l); }
    ctx.stroke();
    for (x = 100; x <= W; x += 100) ctx.fillText(String(x), x + 3, 6);
    ctx.globalAlpha = rulers * marks; tag(String(x1), x1, RULER / 2); tag(String(x2), x2, RULER / 2);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = rulers;
    ctx.translate(-(1 - rulers) * RULER, 0);
    ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.fillRect(0, 0, RULER, H);
    ctx.fillStyle = 'rgba(' + ACCENT + ',' + (0.14 * marks) + ')'; ctx.fillRect(0, y1, RULER, y2 - y1);
    ctx.strokeStyle = 'rgba(58,58,58,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(RULER + 0.5, 0); ctx.lineTo(RULER + 0.5, H); ctx.stroke();
    ctx.strokeStyle = 'rgba(58,58,58,0.45)'; ctx.fillStyle = 'rgba(58,58,58,0.6)';
    ctx.font = '400 9px Montserrat, sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.beginPath();
    for (var y = 0; y <= H; y += 10) { var m = y % 100 === 0 ? 11 : y % 50 === 0 ? 8 : 4; ctx.moveTo(RULER, y + 0.5); ctx.lineTo(RULER - m, y + 0.5); }
    ctx.stroke();
    for (y = 100; y <= H; y += 100) { ctx.save(); ctx.translate(6, y - 3); ctx.rotate(-Math.PI / 2); ctx.fillText(String(y), 0, 0); ctx.restore(); }
    ctx.globalAlpha = rulers * marks;
    [y1, y2].forEach(function (py) { ctx.save(); ctx.translate(RULER / 2, py); ctx.rotate(-Math.PI / 2); tag(String(py), 0, 0); ctx.restore(); });
    ctx.restore();

    // dashed guides run out from the four edges of the word to the edges of the window
    if (guides > 0) {
      ctx.strokeStyle = 'rgba(' + ACCENT + ',0.75)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      ctx.beginPath();
      [x1, x2].forEach(function (gx) {
        ctx.moveTo(gx + 0.5, y1); ctx.lineTo(gx + 0.5, y1 - (y1 - RULER) * guides);
        ctx.moveTo(gx + 0.5, y2); ctx.lineTo(gx + 0.5, y2 + (H - y2) * guides);
      });
      [y1, y2].forEach(function (gy) {
        ctx.moveTo(x1, gy + 0.5); ctx.lineTo(x1 - (x1 - RULER) * guides, gy + 0.5);
        ctx.moveTo(x2, gy + 0.5); ctx.lineTo(x2 + (W - x2) * guides, gy + 0.5);
      });
      ctx.stroke(); ctx.setLineDash([]);
    }

    // the selection box opens out from the middle of the word
    if (box > 0) {
      var bw = (x2 - x1) * box, bh = (y2 - y1) * box;
      ctx.strokeStyle = 'rgb(' + ACCENT + ')'; ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(cx - bw / 2) + 0.5, Math.round(cy - bh / 2) + 0.5, Math.round(bw), Math.round(bh));
    }

    // corner handles and the size label come in last
    if (end > 0) {
      ctx.globalAlpha = end;
      ctx.strokeStyle = 'rgb(' + ACCENT + ')';
      [[x1, y1], [x2, y1], [x1, y2], [x2, y2]].forEach(function (c) {
        ctx.fillStyle = '#fff'; ctx.fillRect(c[0] - 3, c[1] - 3, 7, 7); ctx.strokeRect(c[0] - 2.5, c[1] - 2.5, 6, 6);
      });
      var label = Math.round(x2 - x1) + ' × ' + Math.round(y2 - y1);
      ctx.font = '600 11px Montserrat, sans-serif';
      var lw = ctx.measureText(label).width + 16, lx = cx - lw / 2, ly = y2 + 10 + (1 - end) * 6;
      ctx.fillStyle = 'rgb(' + ACCENT + ')';
      ctx.beginPath(); (ctx.roundRect ? ctx.roundRect(lx, ly, lw, 20, 4) : ctx.rect(lx, ly, lw, 20)); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, lx + lw / 2, ly + 10.5);
      ctx.globalAlpha = 1;
    }
  }

  // moves p towards its target each frame, and stops when it gets there
  function frame(now) {
    var dt = last ? now - last : 16; last = now;
    var step = dt / (target > p ? IN_MS : OUT_MS);
    p = target > p ? Math.min(target, p + step) : Math.max(target, p - step);
    draw();
    if (p !== target) raf = requestAnimationFrame(frame);
    else { raf = 0; last = 0; if (p === 0) { canvas.classList.remove('is-on'); current = null; } }
  }
  function go(to) {
    target = to;
    if (reduce) { p = to; draw(); if (!to) { canvas.classList.remove('is-on'); current = null; } return; }
    if (!raf) { last = 0; raf = requestAnimationFrame(frame); }
  }

  words.forEach(function (el) {
    el.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (current !== el) { p = 0; }
      current = el; size(); canvas.classList.add('is-on'); go(1);
    });
    el.addEventListener('pointerleave', function () { go(0); });
  });
  window.addEventListener('scroll', function () { if (current && !raf) draw(); }, { passive: true });
  window.addEventListener('resize', function () { if (current) { size(); draw(); } });
})();
