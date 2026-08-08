(function () {
  var STORAGE_KEY = 'cookie-consent';
  var banner = document.getElementById('cookie-consent');
  if (!banner) return;

  var acceptBtn = document.getElementById('cookie-consent-accept');
  var declineBtn = document.getElementById('cookie-consent-decline');

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // localStorage indisponível (modo privado, etc.) — o banner
      // voltará a aparecer na próxima visita, o que é um fallback aceitável.
    }
    document.dispatchEvent(new CustomEvent('cookieconsentchange', { detail: { consent: value } }));
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function showBanner() {
    banner.hidden = false;
  }

  var existing = getConsent();
  if (existing === 'accepted' || existing === 'declined') {
    hideBanner();
    // Ainda dispara o evento no carregamento para que scripts que dependem
    // do consentimento (ex.: analytics.html) saibam a escolha já feita.
    document.dispatchEvent(new CustomEvent('cookieconsentchange', { detail: { consent: existing } }));
  } else {
    showBanner();
  }

  acceptBtn.addEventListener('click', function () {
    setConsent('accepted');
    hideBanner();
  });

  declineBtn.addEventListener('click', function () {
    setConsent('declined');
    hideBanner();
  });

  // Helper global simples para outros scripts consultarem o estado atual.
  window.getCookieConsent = getConsent;
})();
