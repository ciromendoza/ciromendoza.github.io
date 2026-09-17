/* =============================================================
 * theme.js — synchronous theme bootstrap
 * -------------------------------------------------------------
 * Loaded in <head> as a classic (blocking) script so the
 * correct color palette is applied BEFORE the first paint.
 * Without this, the page would flash the default light theme
 * before the user's preference kicks in (a "FOUC").
 *
 * Behavior is identical to the original inline snippet:
 *   1. Read the saved theme from localStorage.
 *   2. If none, fall back to the OS-level prefers-color-scheme.
 *   3. Apply the resulting theme to <html data-theme="…">.
 *
 * The toggle that lets the user change the theme lives in
 * modules/theme-switch.js; this file only handles the
 * initial paint decision.
 * ============================================================= */
(function () {
  'use strict';

  var stored = localStorage.getItem('theme');
  var prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  document.documentElement.setAttribute(
    'data-theme',
    stored || (prefersDark ? 'dark' : 'light')
  );
})();
