(function () {
  var storageKey = 'theme-preference';
  var root = document.documentElement;
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getSystemTheme() {
    return mediaQuery.matches ? 'dark' : 'light';
  }

  // Returns 'light' / 'dark' if the user has explicitly chosen, otherwise null.
  function getStoredTheme() {
    var stored = localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' ? stored : null;
  }

  // Explicit user choice wins; otherwise fall back to the OS preference.
  function getActiveTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function syncToggles(theme) {
    var isDark = theme === 'dark';
    var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-checked', isDark ? 'true' : 'false');
      buttons[i].setAttribute('aria-label', label);
      buttons[i].setAttribute('title', label);
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    syncToggles(theme);
  }

  function setTheme(theme) {
    localStorage.setItem(storageKey, theme);
    applyTheme(theme);
  }

  function toggleTheme() {
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  function bindToggles() {
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', toggleTheme);
    }
    // Sync button state/labels now that they exist in the DOM.
    syncToggles(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  }

  // Apply theme immediately (script is not deferred, so this runs before
  // the page paints) to avoid a flash of the wrong theme on load.
  root.setAttribute('data-theme', getActiveTheme());

  // If the user hasn't made an explicit choice, keep following the OS
  // setting live in case it changes while the page is open.
  function handleSystemChange() {
    if (!getStoredTheme()) applyTheme(getSystemTheme());
  }
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }
})();
