(function () {
  var backdrop = document.querySelector('.hero-backdrop');
  if (!backdrop) return;

  function update() {
    var rect = backdrop.getBoundingClientRect();
    var total = rect.height;
    if (total <= 0) return;
    var scrolledPast = Math.min(Math.max(-rect.top, 0), total);
    var progress = scrolledPast / total;
    backdrop.style.setProperty('--scroll-progress', progress.toFixed(3));
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
