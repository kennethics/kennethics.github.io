document.addEventListener('DOMContentLoaded', function () {
  const profileCard = document.querySelector('[data-flip-card]');

  if (!profileCard) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isFlipped = false;

  function setCardState(flipped) {
    profileCard.classList.toggle('is-flipped', flipped);
    profileCard.classList.toggle('is-reduced-motion', reducedMotion.matches);
  }

  function toggleCard() {
    isFlipped = !isFlipped;
    setCardState(isFlipped);
  }

  profileCard.addEventListener('click', toggleCard);
  profileCard.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCard();
    }
  });

  reducedMotion.addEventListener('change', function () {
    setCardState(isFlipped);
  });

  setCardState(false);

  const navDrawer = document.getElementById('nav-drawer');
  const hamburger = document.querySelector('.nav-hamburger');

  // Hamburger doubles as the close control: it morphs into an X while the
  // drawer is open (see .nav-hamburger.is-open in this page's CSS), so
  // there is only ever one visible toggle instead of two icons stacking.
  function toggleDrawer() {
    const isOpen = navDrawer && navDrawer.classList.contains('open');
    if (!navDrawer) return;

    if (isOpen) {
      closeDrawer();
    } else {
      navDrawer.classList.add('open');
      if (hamburger) {
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close menu');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.remove('open');
    document.body.style.overflow = '';
    if (hamburger) {
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  }

  if (navDrawer) {
    navDrawer.addEventListener('click', function (event) {
      if (event.target === this) closeDrawer();
    });

    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape so keyboard users are never stuck in the drawer
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) closeDrawer();
    });
  }

  window.toggleDrawer = toggleDrawer;
  window.closeDrawer = closeDrawer;
});