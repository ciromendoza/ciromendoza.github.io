/* =============================================================
 * modules/prompt-toggle.js
 * -------------------------------------------------------------
 * Each [data-target] toggle button reveals/hides the prompt
 * window whose id matches the data-target attribute. The
 * `open` class is mirrored on both the button (for the arrow
 * rotation) and the target panel (for display toggling).
 * ============================================================= */
(function (App) {
  'use strict';

  var SELECTOR = '.prompt-toggle';

  function init() {
    App.dom.$$(SELECTOR).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.dataset.target);
        if (!target) return;
        var isOpen = target.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
      });
    });
  }

  App.promptToggle = { init: init };
})(window.App = window.App || {});
