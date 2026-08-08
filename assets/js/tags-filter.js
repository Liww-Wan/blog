(function () {
  var grid = document.getElementById('tag-posts');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.post'));
  var emptyMsg = document.getElementById('tag-posts-empty');
  var heading = document.getElementById('tag-filter-heading');
  var pills = Array.prototype.slice.call(document.querySelectorAll('#tag-nav a[data-tag]'));

  function currentTag() {
    var hash = window.location.hash.replace('#', '');
    return hash ? decodeURIComponent(hash) : '';
  }

  function applyFilter() {
    var tag = currentTag();
    var visible = 0;

    cards.forEach(function (card) {
      var tags = (card.getAttribute('data-tags') || '').split('|');
      var show = !tag || tags.indexOf(tag) !== -1;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (heading) {
      heading.textContent = tag ? ('Posts com a tag "' + tag + '"') : 'Todos os posts';
    }

    if (emptyMsg) {
      emptyMsg.hidden = visible !== 0;
    }

    pills.forEach(function (pill) {
      pill.classList.toggle('active', pill.getAttribute('data-tag') === tag);
    });
  }

  window.addEventListener('hashchange', applyFilter);
  applyFilter();
})();
