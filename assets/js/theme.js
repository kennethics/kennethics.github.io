(function () {
  const storageKey = 'theme-preference';
  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getSystemTheme() {
    return mediaQuery.matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    const stored = localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto';
  }

  function applyTheme(theme) {
    const resolved = theme === 'auto' ? getSystemTheme() : theme;
    root.setAttribute('data-theme', resolved);

    const buttons = Array.from(document.querySelectorAll('.theme-toggle'));
    buttons.forEach(function (button) {
      const isActive = button.getAttribute('data-theme-set') === theme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setTheme(theme) {
    localStorage.setItem(storageKey, theme);
    applyTheme(theme);
  }

  function bindButtons() {
    const buttons = Array.from(document.querySelectorAll('.theme-toggle'));
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        setTheme(button.getAttribute('data-theme-set'));
      });
    });
  }

  function initialize() {
    bindButtons();
    applyTheme(getStoredTheme());
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', function () {
      if (getStoredTheme() === 'auto') applyTheme('auto');
    });
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(function () {
      if (getStoredTheme() === 'auto') applyTheme('auto');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
