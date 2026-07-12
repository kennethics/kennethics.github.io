(function () {
  const select = document.getElementById('theme-select');
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
    if (select) select.value = theme;
  }

  function setTheme(theme) {
    localStorage.setItem(storageKey, theme);
    applyTheme(theme);
  }

  if (select) {
    select.addEventListener('change', function (event) {
      setTheme(event.target.value);
    });
  }

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
