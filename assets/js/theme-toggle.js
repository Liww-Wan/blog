(function () {
  var STORAGE_KEY = 'theme';
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  var icon = toggle.querySelector('i');

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function updateButton(theme) {
    var isDark = theme === 'dark';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    if (icon) {
      icon.className = isDark ? 'fa fa-sun-o' : 'fa fa-moon-o';
    }
  }

  // Tell an already-loaded giscus comment widget to switch theme too.
  // The dark variant points at a custom giscus theme (window.GISCUS_DARK_THEME,
  // set in head.html) so the widget matches the site's exact dark palette
  // instead of giscus's built-in dark preset.
  function syncGiscusTheme(theme) {
    var frame = document.querySelector('iframe.giscus-frame');
    if (!frame) return;
    var giscusTheme = theme === 'dark' ? (window.GISCUS_DARK_THEME || 'dark') : 'light';
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      'https://giscus.app'
    );
  }

  updateButton(currentTheme());

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) { /* localStorage unavailable, ignore */ }
    updateButton(next);
    syncGiscusTheme(next);
  });

  // giscus loads async and may not be ready when the page first paints;
  // once it signals it's ready, push the current site theme to it.
  window.addEventListener('message', function (event) {
    if (event.origin !== 'https://giscus.app') return;
    if (event.data && event.data.giscus && event.data.giscus.discussion !== undefined) {
      syncGiscusTheme(currentTheme());
    }
  });
})();
