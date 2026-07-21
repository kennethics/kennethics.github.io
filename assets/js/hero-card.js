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

  // Nav drawer (hamburger + slide-in panel) is now handled centrally by
  // assets/js/interactions.js — initNavDrawer() — so index.html no longer
  // carries its own separate copy of that logic.
});