(function () {
  // A faint grid of small squares behind the page. Squares in the brand blue (and now and then orange)
  // fade in at random places, hold for a moment, then fade away.
  var canvas = document.querySelector('.pixel-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var CELL = 28;            // size of one square, in CSS pixels
  var DENSITY = 0.045;      // share of the grid that is lit at any moment
  var PEAK = 0.11;          // brightest a square gets (opacity), kept very faint
  var BLUE = '73,104,220', ORANGE = '226,128,78';
  var FADE_IN = 1000, HOLD = 1200, FADE_OUT = 1800;   // milliseconds
  var FRAME_MS = 1000 / 30;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cols = 0, rows = 0, w = 0, h = 0, dpr = 1;
  var cells = [], taken = {};
  var raf = 0, last = 0, spawnDebt = 0;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL);
    cells = []; taken = {};
  }

  function add(c, r, now, color) {
    if (c < 0 || r < 0 || c >= cols || r >= rows || taken[c + ',' + r]) return false;
    taken[c + ',' + r] = true;
    cells.push({ c: c, r: r, t0: now, color: color || (Math.random() < 0.22 ? ORANGE : BLUE), peak: PEAK * (0.5 + Math.random() * 0.5) });
    return true;
  }

  // new squares appear at random places and fade away on their own, with no spreading from one to the next
  function spawn(now) { add(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), now); }

  function alpha(cell, now) {
    var age = now - cell.t0;
    if (age < FADE_IN) return cell.peak * (age / FADE_IN);
    if (age < FADE_IN + HOLD) return cell.peak;
    var out = (age - FADE_IN - HOLD) / FADE_OUT;
    return out >= 1 ? -1 : cell.peak * (1 - out);
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(73,104,220,0.045)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = 0; x <= cols; x++) { ctx.moveTo(x * CELL + 0.5, 0); ctx.lineTo(x * CELL + 0.5, h); }
    for (var y = 0; y <= rows; y++) { ctx.moveTo(0, y * CELL + 0.5); ctx.lineTo(w, y * CELL + 0.5); }
    ctx.stroke();
  }

  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    for (var i = cells.length - 1; i >= 0; i--) {
      var cell = cells[i], a = alpha(cell, now);
      if (a < 0) { delete taken[cell.c + ',' + cell.r]; cells.splice(i, 1); continue; }
      ctx.fillStyle = 'rgba(' + cell.color + ',' + a.toFixed(3) + ')';
      ctx.fillRect(cell.c * CELL + 1, cell.r * CELL + 1, CELL - 1, CELL - 1);
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < FRAME_MS) return;
    var dt = now - last; last = now;
    // keep the lit share steady: each square lives about 4s, so spawn that many per second
    var lifetime = (FADE_IN + HOLD + FADE_OUT) / 1000;
    spawnDebt += (cols * rows * DENSITY / lifetime) * (Math.min(dt, 200) / 1000);
    while (spawnDebt >= 1) { spawn(now); spawnDebt -= 1; }
    draw(now);
  }

  function play() { if (!raf && !reduce) { last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  size();
  if (reduce) {
    // static: a few squares held at full strength, no movement
    var now = performance.now();
    for (var i = 0; i < cols * rows * DENSITY; i++) spawn(now - FADE_IN);
    draw(now);
  } else {
    var start = performance.now();
    for (var j = 0; j < cols * rows * DENSITY; j++) { spawn(start - Math.random() * 5000); }
    play();
  }
  window.addEventListener('resize', function () { size(); if (reduce) { draw(performance.now()); } });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
})();
