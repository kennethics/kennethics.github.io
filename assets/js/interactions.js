/*
  Shared site-wide micro-interactions.
  - Scroll reveal: elements with class "fade-in" animate into view once,
    the first time they cross into the viewport (not on every re-scroll).
  - Nav solidify: the floating navbar deepens its shadow and shrinks
    slightly once the page scrolls past the very top (it never hides).
  - Back to top: a single reusable #back-to-top button, shown after the
    page scrolls past a threshold, on any page that includes the markup.
  All three respect prefers-reduced-motion.
*/
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal (animate once) ---------- */
  var revealObserver = null;

  function revealImmediately(el) {
    el.classList.add('is-visible');
  }

  function observeForReveal(el) {
    if (el.classList.contains('is-visible')) return;

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      revealImmediately(el);
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target); // reveal once, don't re-animate on re-scroll
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    }

    revealObserver.observe(el);
  }

  function initScrollReveal() {
    document.querySelectorAll('.fade-in').forEach(observeForReveal);

    // Content added after initial load (e.g. cards fetched from an API,
    // like the recommendations list) won't exist yet during the scan
    // above. Watch for it so it still gets revealed instead of staying
    // stuck at opacity: 0 forever.
    if (typeof MutationObserver === 'undefined') return;

    var domObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return; // element nodes only
          if (node.classList && node.classList.contains('fade-in')) {
            observeForReveal(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('.fade-in').forEach(observeForReveal);
          }
        });
      });
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- Nav solidify on scroll ---------- */
  /* The floating navbar is always visible (position: fixed, no hide-on-
     scroll-down). This just deepens its shadow slightly once the page
     has scrolled past the very top, as a subtle depth cue. */
  function initNavSolidify() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var solidifyThreshold = 8;

    function updateSolidify(y) {
      nav.classList.toggle('nav-scrolled', y > solidifyThreshold);
    }

    updateSolidify(window.scrollY);

    window.addEventListener('scroll', function () {
      updateSolidify(window.scrollY);
    }, { passive: true });
  }

  /* ---------- Back to top ---------- */
  /* Reusable across every page: looks for #back-to-top in the DOM (see
     .back-to-top in shared.css) and wires up show/hide-on-scroll plus the
     smooth-scroll click handler. No-ops on pages that don't include the
     button markup. */
  function initBackToTop() {
    var backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    var SHOW_AFTER = 400;

    function updateVisibility() {
      backToTop.classList.toggle('show', window.scrollY > SHOW_AFTER);
    }

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }

  function init() {
    initScrollReveal();
    initNavSolidify();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();