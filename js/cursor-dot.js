(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targetX = 0, targetY = 0;
  var currentX = 0, currentY = 0;
  var visible = false;
  var started = false;

  function render() {
    dot.style.transform = 'translate(' + currentX + 'px,' + currentY + 'px)';
  }

  function loop() {
    // Ease toward the pointer each frame instead of snapping to it —
    // this is what makes the follow read as smooth rather than jittery.
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;
    render();
    requestAnimationFrame(loop);
  }

  window.addEventListener('mousemove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;

    if (!started) {
      started = true;
      currentX = targetX;
      currentY = targetY;
      render();
      if (!reduceMotion) requestAnimationFrame(loop);
    } else if (reduceMotion) {
      currentX = targetX;
      currentY = targetY;
      render();
    }

    if (!visible) {
      dot.style.opacity = '1';
      visible = true;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0';
    visible = false;
  });
})();
