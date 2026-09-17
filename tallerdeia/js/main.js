/* =============================================================
 * main.js — application bootstrap
 * -------------------------------------------------------------
 * Loaded at the end of <body> (classic script — no defer
 * needed since the DOM is already parsed by the time this
 * runs). Initializes every module in dependency order.
 *
 * Module files attach their API to the shared `window.App`
 * namespace; this file simply calls each `init()` in turn.
 *
 * Load order (defined by the <script> tags in index.html):
 *   1. theme.js            (head, synchronous — prevents FOUC)
 *   2. lib/dom.js          (defines App.dom)
 *   3. modules/*.js        (register APIs on App.<module>)
 *   4. main.js             (this file — kicks everything off)
 * ============================================================= */
(function (App) {
  'use strict';

  function init() {
    App.themeSwitch.init();
    App.promptToggle.init();
    App.flowAccordion.init();
    App.diagram.engine.init();
  }

  // DOM is fully parsed by the time this script runs (it is
  // the last element in <body>), so we can init immediately.
  init();
})(window.App = window.App || {});
