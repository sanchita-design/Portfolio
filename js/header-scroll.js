(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 4);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
