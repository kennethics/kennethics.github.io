/*
  Shared site-wide micro-interactions.
  - Scroll reveal: elements with class "fade-in" animate into view once,
    the first time they cross into the viewport (not on every re-scroll).
  - Nav auto-hide: the fixed nav tucks away on scroll-down, reappears on
    scroll-up, and always stays visible near the top of the page.
  Both respect prefers-reduced-motion.
*/
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal (animate once) ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('.fade-in');
    if (!items.length) return;

    // No motion preference or no observer support: just show everything.
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // reveal once, don't re-animate on re-scroll
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Nav auto-hide on scroll ---------- */
  function initNavAutoHide() {
    var nav = document.querySelector('nav');
    if (!nav || reduceMotion) return;

    var lastY = window.scrollY;
    var ticking = false;
    var revealThreshold = 80; // stay visible near the top regardless of direction

    function isDrawerOpen() {
      return document.body.style.overflow === 'hidden';
    }

    function onScroll() {
      var y = window.scrollY;

      if (!isDrawerOpen()) {
        if (y <= revealThreshold) {
          nav.classList.remove('nav-hidden');
        } else if (y > lastY) {
          nav.classList.add('nav-hidden');    // scrolling down -> tuck away
        } else if (y < lastY) {
          nav.classList.remove('nav-hidden'); // scrolling up -> reappear
        }
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  function init() {
    initScrollReveal();
    initNavAutoHide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
