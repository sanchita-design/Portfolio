// The AI guide icon in the header: a Figma-style cursor tag that follows the pointer
// (or sits under the icon with the keyboard) and says what the guide is.
(function () {
  var icon = document.querySelector('.ai-guide');
  if (!icon) return;
  var name = icon.getAttribute('data-tip');

  var tag = document.createElement('span');
  tag.className = 'ai-tag';
  tag.setAttribute('aria-hidden', 'true');
  tag.innerHTML = '<svg viewBox="0 0 13 18" class="ai-tag-arrow"><path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"/></svg><span class="ai-tag-label"></span>';
  document.body.appendChild(tag);
  var label = tag.querySelector('.ai-tag-label');
  label.textContent = name;

  function place(x, y) {
    tag.style.left = x + 'px';
    tag.style.top = y + 'px';
    // near the right edge of the window the label opens to the left of the arrow
    tag.classList.toggle('is-flip', x + 11 + label.offsetWidth > window.innerWidth - 8);
    tag.classList.add('is-on');
  }
  function hide() { tag.classList.remove('is-on'); }

  icon.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse') place(e.clientX, e.clientY);
  });
  icon.addEventListener('pointerleave', hide);
  icon.addEventListener('focus', function () {
    var r = icon.getBoundingClientRect();
    place(r.left + r.width / 2, r.bottom + 2);
  });
  icon.addEventListener('blur', hide);
})();
