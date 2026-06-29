(function () {
  'use strict';

  const overlay = document.getElementById('contact-overlay');
  const drawer = document.getElementById('contact-drawer');
  const trigger = document.getElementById('contact-trigger');
  const closeBtn = document.getElementById('contact-close');

  function openContact() {
    overlay.classList.add('open');
    drawer.classList.add('open');
  }

  function closeContact() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  }

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openContact();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeContact);
  if (overlay) overlay.addEventListener('click', closeContact);
})();
