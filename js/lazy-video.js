// Plays looping videos only while they are on screen, so off-screen ones never download or decode.
(function () {
  var videos = document.querySelectorAll('video[data-lazy]');
  if (!videos.length) return;
  if (!('IntersectionObserver' in window)) {
    videos.forEach(function (v) { v.preload = 'auto'; v.play().catch(function () {}); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.play().catch(function () {}); }
      else { v.pause(); }
    });
  }, { rootMargin: '200px 0px' });
  videos.forEach(function (v) { io.observe(v); });
})();
