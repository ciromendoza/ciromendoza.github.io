/* =============================================================
 * modules/flow-accordion.js
 * -------------------------------------------------------------
 * Accordion behavior for the Flujo de Trabajo section. Each
 * [data-flow-toggle] button toggles the `open` class on its
 * closest [data-flow-item] ancestor, which in turn shows or
 * hides the .flow-body and rotates the arrow.
 * ============================================================= */
(function (App) {
  'use strict';

  var TOGGLE_SELECTOR = '[data-flow-toggle]';
  var ITEM_SELECTOR   = '[data-flow-item]';

  function init() {
    App.dom.$$(TOGGLE_SELECTOR).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest(ITEM_SELECTOR);
        if (item) item.classList.toggle('open');
      });
    });
  }

  App.flowAccordion = { init: init };
})(window.App = window.App || {});
