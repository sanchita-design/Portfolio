(function () {
  var el = document.querySelector('.typed');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var words = (el.getAttribute('data-words') || '').split('|').filter(Boolean);
  if (!words.length) return;

  var heading = el.closest('h1');
  var TYPE_MS = 130, ERASE_MS = 70, HOLD_MS = 1500, GAP_MS = 350;

  // Reserve the height of the tallest state so the content below never jumps.
  function reserveHeight() {
    var original = el.textContent;
    heading.style.minHeight = '';
    var tallest = 0;
    words.forEach(function (w) {
      el.textContent = w;
      tallest = Math.max(tallest, heading.offsetHeight);
    });
    el.textContent = original;
    heading.style.minHeight = tallest + 'px';
  }
  reserveHeight();
  window.addEventListener('resize', reserveHeight);

  var caret = document.createElement('span');
  caret.className = 'typed-caret';
  caret.setAttribute('aria-hidden', 'true');
  el.parentNode.appendChild(caret);

  var i = 0, n = 0;
  el.textContent = '';

  function type() {
    var w = words[i];
    if (n < w.length) {
      el.textContent = w.slice(0, ++n);
      setTimeout(type, TYPE_MS);
    } else {
      setTimeout(erase, HOLD_MS);
    }
  }
  function erase() {
    if (n > 0) {
      el.textContent = words[i].slice(0, --n);
      setTimeout(erase, ERASE_MS);
    } else {
      i = (i + 1) % words.length;
      setTimeout(type, GAP_MS);
    }
  }
  setTimeout(type, GAP_MS);
})();
