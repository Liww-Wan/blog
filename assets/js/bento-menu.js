(function () {
  var toggle = document.getElementById('bento-toggle');
  var menu = document.getElementById('bento-menu');
  if (!toggle || !menu) return;

  function isOpen() {
    return !menu.hidden;
  }

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-active');
  }

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-active');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('click', function (e) {
    if (isOpen() && !menu.contains(e.target) && e.target !== toggle) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });
})();
