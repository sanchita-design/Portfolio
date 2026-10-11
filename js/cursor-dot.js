(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<svg class="cursor-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3.2"/></svg>';
  document.body.appendChild(dot);
  document.documentElement.classList.add('custom-cursor');

  // Over a case study card the dot becomes a "view" (eye) icon.
  document.addEventListener('mouseover', function (e) {
    dot.classList.toggle('is-view', !!(e.target.closest && e.target.closest('.project-card')));
  });

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
    dot.classList.remove('is-view');
    dot.style.opacity = '0';
    visible = false;
  });
})();
