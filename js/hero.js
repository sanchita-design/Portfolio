// The home page hero: the live London weather note and the Figma-style cursor tag.
(function () {
  // ---------- Weather note ----------
  // Open-Meteo needs no account or key. If the request fails, the written
  // fallback in the page (drizzle) stays as it is.
  // Lined icons, one stroke weight, drawn in the text colour (the rain is blue).
  var CLOUD = 'M8.1 18A3.9 3.9 0 0 1 7.512 10.245A5.1 5.1 0 0 1 17.657 11.264A3.4 3.4 0 0 1 17 18Z';
  var CLOUD_HIGH = 'M8.1 15A3.9 3.9 0 0 1 7.512 7.245A5.1 5.1 0 0 1 17.657 8.264A3.4 3.4 0 0 1 17 15Z';
  var icons = {
    rain: '<path d="' + CLOUD_HIGH + '"/><path class="rain-drops" d="M8.8 18.1l-1.2 2.9M12.3 18.1l-1.2 2.9M15.8 18.1l-1.2 2.9M19.3 18.1l-1.2 2.9"/>',
    cloud: '<path d="' + CLOUD + '"/>',
    sun: '<path d="M12 7.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Z"/><path d="M12 1.9v2.6M12 19.5v2.6M1.9 12h2.6M19.5 12h2.6M4.83 4.83l1.84 1.84M17.33 17.33l1.84 1.84M19.17 4.83l-1.84 1.84M6.67 17.33l-1.84 1.84"/>',
    moon: '<path d="M20.223 13.331A8.3 8.3 0 1 1 9.913 4.167A6.9 6.9 0 0 0 20.223 13.331Z"/>'
  };
  var states = {
    rain: { icon: 'rain', weather: 'Drizzle over London', comment: 'Nice time to untangle a complex workflow.', aside: 'Sipping on a hot cup of tea.' },
    sun: { icon: 'sun', weather: 'Sunny in London', comment: 'Good light for a close look at the details.', aside: 'Soaking up some vitamin D.' },
    cloud: { icon: 'cloud', weather: 'Grey skies over London', comment: 'A good day to dig into the research.', aside: 'Sipping on a hot cup of tea.' },
    evening: { icon: 'moon', weather: 'Evening in London', comment: 'Time to write up what I noticed.', aside: 'Sipping on a hot cup of tea.' }
  };
  var note = document.getElementById('weather-note');
  if (note) {
    var icon = note.querySelector('.weather-icon');
    var text = note.querySelector('.weather-text');
    var timeEl = note.querySelector('.weather-time');
    var lines = note.querySelectorAll('.weather-swap span');
    var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' });
    var tick = function () { timeEl.textContent = fmt.format(new Date()); };
    tick();
    setTimeout(function () { tick(); setInterval(tick, 60000); }, 60000 - (Date.now() % 60000));

    var show = function (key) {
      var s = states[key]; if (!s) return;
      icon.innerHTML = icons[s.icon]; icon.setAttribute('data-state', s.icon); text.textContent = s.weather;
      lines[0].textContent = s.comment; lines[1].textContent = s.aside;
    };
    // the line under the weather rotates between its two messages, one every 6.5 seconds
    setInterval(function () { note.classList.toggle('is-alt'); }, 6500);

    var url = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=weather_code,is_day&timezone=Europe%2FLondon';
    fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      var c = d && d.current; if (!c || typeof c.weather_code !== 'number') return;
      if (c.is_day === 0) return show('evening');
      show(c.weather_code <= 1 ? 'sun' : c.weather_code <= 48 ? 'cloud' : 'rain');
    }).catch(function () {});
  }

  // ---------- Cursor tag ----------
  // One tag, shared by the years and the tool names. With a mouse it follows the
  // pointer over any [data-cursor-tag] element. With the keyboard it sits under
  // the focused element.
  var tag = document.createElement('span');
  tag.className = 'cursor-tag';
  tag.setAttribute('aria-hidden', 'true');
  tag.innerHTML = '<svg viewBox="0 0 13 18" class="cursor-tag-arrow"><path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"/></svg><span class="cursor-tag-label"></span>';
  document.body.appendChild(tag);
  var label = tag.querySelector('.cursor-tag-label');
  var root = document.documentElement;
  var overMouse = false;

  function place(x, y, name) {
    label.textContent = name;
    tag.style.left = x + 'px';
    tag.style.top = y + 'px';
    tag.classList.toggle('is-up', y > window.innerHeight - 70);   // near the bottom of the window the label sits above the arrow
    tag.classList.add('is-on');
  }
  function hide() { tag.classList.remove('is-on'); root.classList.remove('tag-active'); }

  document.querySelectorAll('[data-cursor-tag]').forEach(function (el) {
    var name = el.getAttribute('data-cursor-tag');
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      overMouse = true; root.classList.add('tag-active');
      place(e.clientX, e.clientY, name);
    });
    el.addEventListener('pointerleave', function () { overMouse = false; hide(); });
    el.addEventListener('focus', function () {
      if (overMouse) return;
      var r = el.getBoundingClientRect();
      place(r.left + r.width / 2, r.bottom + 2, name);
      tag.classList.add('is-focus');
    });
    el.addEventListener('blur', function () { tag.classList.remove('is-focus'); hide(); });
  });
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse') tag.classList.remove('is-focus');
  }, { passive: true });
  // ---------- "View case study" tag on the work tiles ----------
  var follow = document.createElement('span');
  follow.className = 'follow-tag';
  follow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(follow);
  document.querySelectorAll('[data-follow-tag]').forEach(function (el) {
    var name = el.getAttribute('data-follow-tag');
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      follow.textContent = name;
      follow.style.left = (e.clientX + 18) + 'px';
      follow.style.top = e.clientY + 'px';
      follow.classList.add('is-on');
      root.classList.add('tag-active');
    });
    el.addEventListener('pointerleave', function () { follow.classList.remove('is-on'); root.classList.remove('tag-active'); });
    el.addEventListener('blur', function () { follow.classList.remove('is-on'); });
  });
})();
