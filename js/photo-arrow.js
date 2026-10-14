(function () {
  // A thin hand-drawn style arrow under the community photo. It starts at the far left
  // and curves up to just below one person, then draws itself when scrolled into view.
  var fig = document.querySelector('.community-figure');
  if (!fig) return;
  var img = fig.querySelector('.community-media');
  var band = fig.querySelector('.community-arrow');
  if (!img || !band) return;

  // Where the person stands in the original photo (pixels of the 2048 x 1060 image).
  var TARGET_X = 690;
  var NATURAL_W = 2048, NATURAL_H = 1060;
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var svg = band.querySelector('svg');
  var line = svg.querySelector('.arrow-line');
  var head = svg.querySelector('.arrow-head');

  // The shape follows a hand-drawn reference: a round curl on the left, a long sweep along the bottom,
  // then a rise that ends pointing straight up. It is five cubic Bezier curves joined end to end.
  // Every join has the same direction on both sides, so the line has no kinks or bumps.
  // Coordinates are in the reference's own box (383 wide, y measured down), then scaled to fit.
  var SEGMENTS = [
    [[0, 285],   [70, 282],  [160, 210], [160, 130]],   // up from the left, into the right side of the curl
    [[160, 130], [160, 103], [138, 92],  [108, 92]],    // over the top of the curl
    [[108, 92],  [76, 92],   [43, 118],  [43, 150]],    // down the left side
    [[43, 150],  [43, 200],  [100, 283], [160, 283]],   // crossing back over itself, into the sweep
    [[160, 283], [283, 283], [383, 170], [383, 12]]     // the long sweep, rising to a vertical tip
  ];
  var SHAPE_W = 383, TIP_Y = 12, START_Y = 285;

  function layout() {
    var w = img.clientWidth, h = img.clientHeight;
    if (!w || !h) return;
    // the photo is shown with object-fit: cover, centred
    var scale = Math.max(w / NATURAL_W, h / NATURAL_H);
    var offsetX = (NATURAL_W * scale - w) / 2;
    var tx = Math.min(w - 24, Math.max(170, TARGET_X * scale - offsetX));
    var bh = band.clientHeight;

    // fit the shape: far-left start, tip exactly under the person, 9px below the photo
    var left = 3, top = 9, bottom = bh * 0.9;
    var kx = (tx - left) / SHAPE_W, ky = (bottom - top) / (START_Y - TIP_Y);
    function pt(q) { return (left + q[0] * kx).toFixed(2) + ' ' + (top + (q[1] - TIP_Y) * ky).toFixed(2); }

    var d = 'M' + pt(SEGMENTS[0][0]);
    SEGMENTS.forEach(function (sg) { d += ' C' + pt(sg[1]) + ' ' + pt(sg[2]) + ' ' + pt(sg[3]); });

    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + bh);
    svg.setAttribute('width', w);
    svg.setAttribute('height', bh);
    line.setAttribute('d', d);

    // arrowhead: an open chevron, pointing straight up at the person
    var L = 13, spread = 0.62;
    head.setAttribute('d', 'M' + (tx - L * Math.sin(spread)).toFixed(2) + ' ' + (top + L * Math.cos(spread)).toFixed(2) +
      ' L' + tx.toFixed(2) + ' ' + top + ' L' + (tx + L * Math.sin(spread)).toFixed(2) + ' ' + (top + L * Math.cos(spread)).toFixed(2));
  }

  function ready() { fig.classList.add('has-arrow'); layout(); }
  // The arrow redraws itself in a continuous loop, but only while the photo is on screen.
  function play() { band.classList.add('is-playing'); }
  function stop() { band.classList.remove('is-playing'); }

  if (img.complete) ready(); else img.addEventListener('load', ready);
  window.addEventListener('resize', layout);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { band.classList.add('is-static'); return; }
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) play(); else stop(); });
  }, { threshold: 0.4 }).observe(fig);
})();
