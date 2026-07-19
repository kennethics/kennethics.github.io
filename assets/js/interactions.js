/*
  Shared site-wide micro-interactions.
  - Scroll reveal: elements with class "fade-in" animate into view once,
    the first time they cross into the viewport (not on every re-scroll).
  - Nav: stays visible ("floating") at all times while scrolling; it only
    picks up its background/blur/border once the page leaves the very top,
    so it never competes with a hero image but is never hidden from the
    user either.
  Both respect prefers-reduced-motion.
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

  /* ---------- Nav: float + solidify on scroll ---------- */
  function initNavScrollState() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var solidifyThreshold = 8; // pick up the nav surface just after leaving the very top

    function updateSolidify() {
      nav.classList.toggle('nav-scrolled', window.scrollY > solidifyThreshold);
    }

    updateSolidify();

    if (reduceMotion) {
      window.addEventListener('scroll', updateSolidify, { passive: true });
      return;
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateSolidify();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Back to top (site-wide) ---------- */
  function initBackToTop() {
    var SHOW_AFTER = 400;
    var btn = document.getElementById('back-to-top');

    // Create it once if the page doesn't already have one, so every page
    // gets the same control without needing to hand-copy markup into it.
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.title = 'Back to top';
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<line x1="12" y1="19" x2="12" y2="5"></line>' +
        '<polyline points="5 12 12 5 19 12"></polyline></svg>';
      document.body.appendChild(btn);
    }

    function updateVisibility() {
      btn.classList.toggle('show', window.scrollY > SHOW_AFTER);
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }

  function init() {
    initScrollReveal();
    initNavScrollState();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();