// Page-load intro for the home page. The hero headline fades in letter by letter, each letter coming into
// focus out of a blur a little after the one before it; then the supporting line eases in. The header and
// the weather note are always there. Visitors who prefer reduced motion get none of it
// (the page's own head script never hides anything for them).
(function () {
  var root = document.documentElement;
  var h1 = document.querySelector('.hero-text .lead');
  var glare = document.getElementById('ai-glare-anim');
  function ai() { return document.querySelector('.ai-wrap'); }   // looked up when needed: the headline is rebuilt below
  function pass() { if (glare && glare.beginElement) glare.beginElement(); }
  function stars(delay) {                           // the sparkles open up, then a band of light passes through them
    setTimeout(function () { var el = ai(); if (!el) return; el.classList.add('is-starred'); setTimeout(pass, 750); }, delay);
  }
  document.addEventListener('pointerover', function (e) {   // hovering the word sends the light through again
    var el = e.target.closest && e.target.closest('.ai-wrap');
    if (el && el.classList.contains('is-starred') && !el.hasAttribute('data-over')) { el.setAttribute('data-over', ''); pass(); }
  });
  document.addEventListener('pointerout', function (e) { var el = e.target.closest && e.target.closest('.ai-wrap'); if (el && !el.contains(e.relatedTarget)) el.removeAttribute('data-over'); });
  if (!root.classList.contains('intro') || !h1) { root.classList.remove('intro'); var el0 = ai(); if (el0) el0.classList.add('is-starred'); return; }

  var text = h1.textContent.replace(/\s+/g, ' ').trim();
  h1.setAttribute('aria-label', text);              // a screen reader reads the sentence, not the loose letters
  var nodes = Array.prototype.slice.call(h1.childNodes);
  h1.textContent = '';
  var wrap = document.createElement('span');
  wrap.className = 'intro-line';
  wrap.setAttribute('aria-hidden', 'true');
  var chars = [];

  // splits some text into words made of single letters, adding them to `into`; spaces stay as plain spaces
  function letters(str, into) {
    str.split(/(\s+)/).forEach(function (tok) {
      if (!tok) return;
      if (/^\s+$/.test(tok)) { into.appendChild(document.createTextNode(' ')); return; }
      var w = document.createElement('span');
      w.className = 'intro-word';
      tok.split('').forEach(function (ch) {
        var c = document.createElement('span');
        c.className = 'intro-char'; c.textContent = ch; w.appendChild(c); chars.push(c);
      });
      into.appendChild(w);
    });
  }
  // the headline's own words and its marked-up words ("designer", "AI" with its sparkles) all become letters,
  // and the marked-up words keep their element so their hover effects and sparkles still work
  nodes.forEach(function (n) {
    if (n.nodeType === 3) { letters(n.textContent, wrap); return; }
    var shell = n.cloneNode(false);
    Array.prototype.slice.call(n.childNodes).forEach(function (k) {
      if (k.nodeType === 3) letters(k.textContent, shell); else shell.appendChild(k);
    });
    wrap.appendChild(shell);
  });
  h1.appendChild(wrap);
  h1.style.opacity = '1';                           // the letters are each hidden, so the line itself can show

  // Each letter rises out of a blur, skewed and dropped slightly, a little after the one before it. The fade takes much longer than
  // the gap between letters, so at any moment several letters are part-way: the line sharpens from left to
  // right like a wave rather than being typed.
  var STEP = 30;                                    // milliseconds between one letter starting and the next
  var DUR = 900;                                    // how long each letter takes to come into focus
  chars.forEach(function (c, i) { c.style.transitionDelay = (i * STEP) + 'ms'; });
  requestAnimationFrame(function () { requestAnimationFrame(function () { chars.forEach(function (c) { c.classList.add('is-in'); }); }); });
  setTimeout(finish, chars.length * STEP + DUR * 0.6);   // the rest follows just before the last letters settle

  function finish() {
    // then the supporting line eases in (the header and the weather note were never hidden)
    var sub = document.querySelector('.hero-sub');
    if (sub) sub.style.transitionDelay = '100ms';
    root.classList.remove('intro');
    setTimeout(function () { if (sub) sub.style.transitionDelay = ''; }, 1200);   // so later hovers are not slowed
    stars(1100);                                    // once the page has settled
  }
})();
