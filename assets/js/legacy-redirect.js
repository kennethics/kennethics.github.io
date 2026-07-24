/*
  Legacy page redirect map.
  Each retired page (about.html, contact.html, etc.) is now a thin stub
  that loads this script to redirect into the matching section of the
  single-page index.html. Centralizing the map here means adding/removing
  a legacy redirect only ever requires editing ONE line in this file.
*/
(function () {
  var redirectMap = {
    '/about.html': '#about',
    '/experience.html': '#experience',
    '/projects.html': '#projects',
    '/writing.html': '#writing',
    '/recommendations.html': '#recommendations',
    '/contact.html': '#contact'
  };

  var path = window.location.pathname;
  var anchor = redirectMap[path] || '';

  // replace() (not href=) so the stub URL never enters browser history —
  // pressing "back" after landing on index.html won't bounce the user
  // back to the stub page.
  window.location.replace('/' + anchor);
})();
