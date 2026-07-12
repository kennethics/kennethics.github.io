(function () {
  const toggles = Array.from(document.querySelectorAll('.theme-toggle'));
  const storageKey = 'theme-preference';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto';
  }

  function applyTheme(theme) {
    const resolved = theme === 'auto' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    document.body.setAttribute('data-theme', resolved);

    toggles.forEach(function (button) {
      const isActive = button.getAttribute('data-theme-set') === theme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setTheme(theme) {
    localStorage.setItem(storageKey, theme);
    applyTheme(theme);
  }

  toggles.forEach(function (button) {
    button.addEventListener('click', function () {
      setTheme(button.getAttribute('data-theme-set'));
    });
  });

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', function () {
      if (getPreferredTheme() === 'auto') applyTheme('auto');
    });
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(function () {
      if (getPreferredTheme() === 'auto') applyTheme('auto');
    });
  }

  applyTheme(getPreferredTheme());
})();
