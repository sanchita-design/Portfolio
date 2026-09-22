(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  var visible = false;

  window.addEventListener('mousemove', function (e) {
    if (!visible) {
      dot.style.opacity = '1';
      visible = true;
    }
    dot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0';
    visible = false;
  });
})();
