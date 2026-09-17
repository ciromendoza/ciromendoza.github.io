/* =============================================================
 * modules/theme-switch.js
 * -------------------------------------------------------------
 * Wires the #themeSwitch button to toggle between light and
 * dark themes. The initial theme is already set by
 * theme.js (the head bootstrap). This module only handles
 * the user-driven toggle and persists the choice so the
 * next page load honors it.
 * ============================================================= */
(function (App) {
  'use strict';

  var STORAGE_KEY = 'theme';
  var SELECTOR = '#themeSwitch';

  function init() {
    var dom = App.dom;
    var root = document.documentElement;
    var switchBtn = dom.$(SELECTOR);
    if (!switchBtn) return;

    switchBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  App.themeSwitch = { init: init };
})(window.App = window.App || {});
