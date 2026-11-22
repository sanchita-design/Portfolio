// The copy button beside the email address in the Connect section: copies the address, shows a tick for two
// seconds, then goes back. If the browser refuses to copy, nothing happens: the address is written out in full
// beside the button either way.
(function () {
  var btn = document.querySelector('.connect-copy');
  if (!btn) return;
  var timer = 0;
  btn.addEventListener('click', function () {
    var text = btn.getAttribute('data-copy');
    var done = function () {
      btn.classList.add('is-copied'); btn.setAttribute('aria-label', 'Email address copied');
      clearTimeout(timer);
      timer = setTimeout(function () { btn.classList.remove('is-copied'); btn.setAttribute('aria-label', 'Copy email address'); }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
  });
})();
