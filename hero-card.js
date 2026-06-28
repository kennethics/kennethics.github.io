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

  function toggleDrawer() {
    const isOpen = navDrawer && navDrawer.classList.contains('open');
    if (!navDrawer) return;

    if (isOpen) {
      navDrawer.classList.remove('open');
      document.body.style.overflow = '';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    } else {
      navDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    }
  }

  function closeDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.remove('open');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (navDrawer) {
    navDrawer.addEventListener('click', function (event) {
      if (event.target === this) closeDrawer();
    });

    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  window.toggleDrawer = toggleDrawer;
  window.closeDrawer = closeDrawer;
});
