// The recommendations' x-y plane: the two crossing lines are drawn out from the middle the first time the
// section scrolls into view. (The lines themselves are CSS; this just adds the class that draws them.)
(function () {
  var grid = document.querySelector('.quote-grid');
  if (!grid) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { grid.classList.add('is-drawn'); return; }
  var watcher = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    grid.classList.add('is-drawn');
    watcher.disconnect();
  }, { threshold: 0.35 });
  watcher.observe(grid);
})();
