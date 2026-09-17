/* =============================================================
 * lib/dom.js — tiny DOM helpers
 * -------------------------------------------------------------
 * Provides two short aliases that every module uses:
 *
 *   App.dom.$(selector, scope?)   -> Element | null
 *   App.dom.$$(selector, scope?)   -> Element[]
 *
 * scope defaults to document. $$(...) always returns a real
 * Array (so .forEach / .map / .filter are available without
 * converting a NodeList).
 * ============================================================= */
(function (App) {
  'use strict';

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector)
    );
  }

  App.dom = { $: $, $$: $$ };
})(window.App = window.App || {});
