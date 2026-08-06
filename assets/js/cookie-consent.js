(function () {
  var STORAGE_KEY = 'cookie-consent';
  var banner = document.getElementById('cookie-consent');
  if (!banner) return;

  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');
  var settingsLink = document.getElementById('cookie-settings-link');

  function getConsent() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  // Exposto globalmente para o snippet do AdSense (ou qualquer outro
  // script de terceiros) verificar antes de carregar.
  // Uso: if (window.hasAdConsent()) { /* injeta o script do AdSense aqui */ }
  window.hasAdConsent = function () {
    return getConsent() === 'accepted';
  };

  acceptBtn.addEventListener('click', function () {
    setConsent('accepted');
    hideBanner();
    // Avisa o resto da pagina que o consentimento foi dado agora,
    // caso o script de anuncios precise ser carregado dinamicamente.
    document.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
  });

  declineBtn.addEventListener('click', function () {
    setConsent('declined');
    hideBanner();
    document.dispatchEvent(new CustomEvent('cookie-consent-declined'));
  });

  if (settingsLink) {
    settingsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showBanner();
    });
  }

  if (getConsent() === null) {
    showBanner();
  }
})();
