/*
  Shared site-wide micro-interactions.
  - Scroll reveal: elements with class "fade-in" animate into view once,
    the first time they cross into the viewport (not on every re-scroll).
  - Nav scroll behavior: <nav> starts in the normal document flow (not
    floating). As soon as the page scrolls past a small threshold
    (~16px), nav switches to position: fixed with a soft fade + drop-in
    (.nav-floating, see shared.css). It stays floating and visible for
    the rest of the scroll (no hide-on-scroll-down). Scrolling back up
    past that same threshold returns nav to its original in-flow spot.
    A JS-measured .nav-spacer keeps the page from jumping when nav
    leaves/re-enters the flow.
  - Nav solidify: the navbar deepens its shadow and shrinks slightly once
    the page scrolls past the very top (it never hides), independent of
    whether it's currently inline or floating.
  - Back to top: a single reusable #back-to-top button, shown after the
    page scrolls past a threshold, on any page that includes the markup.
  All of the above respect prefers-reduced-motion (see the global
  "animation/transition duration: 0.001ms" override in shared.css).
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

  /* ---------- Nav: inline → floating almost immediately on scroll ---------- */
  /* nav starts in the normal document flow (see shared.css — no more
     position: fixed by default). This now watches actual scroll distance
     (window.scrollY) rather than waiting for a hero/page-header sentinel
     to fully leave the viewport — as soon as the page scrolls past
     FLOAT_THRESHOLD, nav switches to .nav-floating. Scrolling back up
     past that same threshold returns nav to its original in-flow spot.
     Once floating, nav stays visible for the rest of the scroll (no
     hide-on-scroll-down behavior) — floating is purely a function of
     scroll position, so it's consistent on every page regardless of
     hero/header height. */
  function initNavFloat() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    // How far the page must scroll before nav switches to floating mode.
    var FLOAT_THRESHOLD = 16;

    var spacer = null;

    function getSpacer() {
      if (spacer) return spacer;
      spacer = document.createElement('div');
      spacer.className = 'nav-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      nav.insertAdjacentElement('afterend', spacer);
      return spacer;
    }

    function setFloating(shouldFloat) {
      var isFloating = nav.classList.contains('nav-floating');
      if (shouldFloat === isFloating) return;

      if (shouldFloat) {
        // Measure nav's own height right before pulling it out of the
        // flow, so the spacer left behind matches exactly (never a
        // hardcoded value).
        var h = nav.offsetHeight;
        getSpacer().style.height = h + 'px';
        nav.classList.add('nav-floating');
      } else {
        nav.classList.remove('nav-floating');
        if (spacer) spacer.style.height = '0px';
      }
    }

    function updateFloating(y) {
      setFloating(y > FLOAT_THRESHOLD);
    }

    // Set correct state on load too (e.g. page refreshed mid-scroll).
    updateFloating(window.scrollY);

    window.addEventListener('scroll', function () {
      updateFloating(window.scrollY);
    }, { passive: true });

    // Keep the spacer height accurate if nav's own height changes
    // (font load, orientation change, hamburger swap at 1250px, etc.).
    window.addEventListener('resize', function () {
      if (nav.classList.contains('nav-floating') && spacer) {
        spacer.style.height = nav.offsetHeight + 'px';
      }
    }, { passive: true });
  }

  /* ---------- Nav solidify on scroll ---------- */
  /* Deepens the navbar's shadow slightly once the page has scrolled past
     the very top, as a subtle depth cue. Works whether nav is currently
     inline or floating. */
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
    initNavFloat();
    initNavSolidify();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();