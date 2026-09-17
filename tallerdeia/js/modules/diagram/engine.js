/* =============================================================
 * modules/diagram/engine.js
 * -------------------------------------------------------------
 * Drives the scalable SVG diagram. Responsibilities:
 *
 *   - Cache the DOM nodes the engine reads/writes.
 *   - Walk through App.diagram.STEPS, animating a "traveler"
 *     dot along each path between nodes.
 *   - Synchronize the status card (title / badge / desc),
 *     the step pills, and the active classes on paths and
 *     nodes (including the special loop / pass variants).
 *   - Expose play / pause / reset controls and let the
 *     step-pills and SVG nodes themselves be clickable.
 *   - Auto-start the first time the diagram scrolls into
 *     view via IntersectionObserver.
 *
 * The algorithm is identical to the original IIFE; the code
 * has only been split out, namespaced and lightly cleaned.
 * ============================================================= */
(function (App) {
  'use strict';

  var dom = App.dom;
  var STEPS = App.diagram.STEPS;

  /* ----- CSS class names (kept in one place for clarity) ----- */
  var CLS = {
    pathActive:     'active',
    pathActiveLoop: 'active-loop',
    pathActivePass: 'active-pass',
    nodeActive:     'active',
    nodeActiveLoop: 'active-loop',
    nodeActivePass: 'active-pass',
    pillActive:     'active'
  };

  /* ----- Timing constants (ms) ----- */
  var NEXT_STEP_DELAY    = 700;   // pause at the end of each step
  var LOOP_RESTART_DELAY = 2400;  // pause before restarting the cycle

  /* ----- Module-internal state ----- */
  var state = {
    currentStepIndex: 0,
    isPlaying: false,
    hasStarted: false,
    animFrameId: null,
    stepTimeoutId: null
  };

  /* ----- Cached DOM references (populated in init) ----- */
  var ui = {
    dot: null,
    playBtn: null,
    playIcon: null,
    playText: null,
    resetBtn: null,
    stepNumEl: null,
    statusTitleEl: null,
    statusBadgeEl: null,
    statusDescEl: null,
    stepPills: null,
    diagramWrap: null
  };

  /* ----- Helpers ----- */

  function clearVisuals() {
    dom.$$('.seg-path').forEach(function (p) {
      p.classList.remove(CLS.pathActive, CLS.pathActiveLoop, CLS.pathActivePass);
    });
    dom.$$('.diagram-node').forEach(function (n) {
      n.classList.remove(CLS.nodeActive, CLS.nodeActiveLoop, CLS.nodeActivePass);
    });
    ui.stepPills.forEach(function (p) {
      p.classList.remove(CLS.pillActive);
    });
  }

  /**
   * Pick the right "active" class name for a path or node,
   * based on whether the step is a normal, loop or pass step.
   */
  function activeClassFor(step, isPath) {
    if (step.isLoop) return isPath ? CLS.pathActiveLoop : CLS.nodeActiveLoop;
    if (step.isPass) return isPath ? CLS.pathActivePass : CLS.nodeActivePass;
    return isPath ? CLS.pathActive : CLS.nodeActive;
  }

  function setStepUI(step, index) {
    ui.stepNumEl.textContent = index + 1;
    ui.statusTitleEl.textContent = step.title;
    ui.statusBadgeEl.textContent = step.badge;
    ui.statusBadgeEl.className =
      'status-badge' + (step.badgeClass ? ' ' + step.badgeClass : '');
    ui.statusDescEl.textContent = step.desc;

    ui.stepPills.forEach(function (p) {
      var pIdx = parseInt(p.getAttribute('data-step'), 10);
      // Preserve original quirk: when on the "Coder corrige → Revisión"
      // step (index 5), also light up the "Loop FAIL" pill (pIdx 5).
      if (pIdx === step.pillIndex || (index === 5 && pIdx === 5)) {
        p.classList.add(CLS.pillActive);
      }
    });
  }

  /**
   * Cubic ease-in-out, identical to the original implementation:
   *
   *   t < 0.5  -> 2 * t * t
   *   t >= 0.5 -> -1 + (4 - 2 * t) * t
   */
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /* ----- Core animation loop ----- */

  function runStep(index) {
    if (state.stepTimeoutId) clearTimeout(state.stepTimeoutId);
    if (state.animFrameId) cancelAnimationFrame(state.animFrameId);

    if (index >= STEPS.length) {
      // Cycle complete: wait a bit, then restart from step 1.
      state.stepTimeoutId = setTimeout(function () {
        if (state.isPlaying) runStep(0);
      }, LOOP_RESTART_DELAY);
      return;
    }

    state.currentStepIndex = index;
    var step = STEPS[index];

    clearVisuals();
    setStepUI(step, index);

    var path = document.getElementById(step.pathId);
    if (!path) return;

    // Highlight the path itself.
    path.classList.add(activeClassFor(step, true));

    // Highlight the "from" node.
    var fromNode = document.getElementById(step.from);
    if (fromNode) fromNode.classList.add(activeClassFor(step, false));

    // Animate the traveler dot along the path.
    var totalLen = path.getTotalLength();
    var startTime = performance.now();
    ui.dot.style.opacity = '1';

    function stepFrame(time) {
      if (!state.isPlaying) return;
      var elapsed = time - startTime;
      var t = Math.min(elapsed / step.duration, 1);
      var eased = easeInOut(t);

      var pt = path.getPointAtLength(eased * totalLen);
      ui.dot.setAttribute('cx', pt.x);
      ui.dot.setAttribute('cy', pt.y);

      if (t < 1) {
        state.animFrameId = requestAnimationFrame(stepFrame);
      } else {
        // Snap the traveler onto the target node and light it up.
        var toNode = document.getElementById(step.to);
        if (toNode) toNode.classList.add(activeClassFor(step, false));

        state.stepTimeoutId = setTimeout(function () {
          if (state.isPlaying) runStep(index + 1);
        }, NEXT_STEP_DELAY);
      }
    }

    state.animFrameId = requestAnimationFrame(stepFrame);
  }

  /* ----- Public play / pause ----- */

  function play() {
    state.isPlaying = true;
    ui.playIcon.textContent = '⏸';
    ui.playText.textContent = 'Pausar';
    runStep(state.currentStepIndex);
  }

  function pause() {
    state.isPlaying = false;
    ui.playIcon.textContent = '▶';
    ui.playText.textContent = 'Reproducir';
    if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
    if (state.stepTimeoutId) clearTimeout(state.stepTimeoutId);
  }

  /* ----- Event wiring ----- */

  function wireControls() {
    ui.playBtn.addEventListener('click', function () {
      if (state.isPlaying) pause();
      else play();
    });

    ui.resetBtn.addEventListener('click', function () {
      pause();
      state.currentStepIndex = 0;
      play();
    });

    ui.stepPills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetStep = parseInt(btn.getAttribute('data-step'), 10);
        pause();
        state.currentStepIndex = targetStep;
        play();
      });
    });
  }

  /**
   * Map of SVG node ids -> step index used when the user
   * clicks directly on a node. Matches the original mapping.
   */
  var NODE_TO_STEP = {
    'node-idea':        0,
    'node-orquestador': 1,
    'node-prompt':      2,
    'node-coder':       3,
    'node-revision':    4,
    'node-resultado':   6
  };

  function wireNodes() {
    Object.keys(NODE_TO_STEP).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', function () {
        pause();
        state.currentStepIndex = NODE_TO_STEP[id];
        play();
      });
    });
  }

  function wireAutoStart() {
    if (!ui.diagramWrap || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !state.hasStarted) {
          state.hasStarted = true;
          play();
        }
      });
    }, { threshold: 0.2 });
    io.observe(ui.diagramWrap);
  }

  /* ----- Init ----- */

  function init() {
    ui.dot           = document.getElementById('travelerDot');
    ui.playBtn       = document.getElementById('playBtn');
    ui.playIcon      = document.getElementById('playIcon');
    ui.playText      = document.getElementById('playText');
    ui.resetBtn      = document.getElementById('resetBtn');
    ui.stepNumEl     = document.getElementById('stepNum');
    ui.statusTitleEl = document.getElementById('statusTitle');
    ui.statusBadgeEl = document.getElementById('statusBadge');
    ui.statusDescEl  = document.getElementById('statusDesc');
    ui.stepPills     = dom.$$('.step-pill');
    ui.diagramWrap   = document.getElementById('diagramWrap');

    wireControls();
    wireNodes();
    wireAutoStart();
  }

  App.diagram.engine = {
    init: init,
    play: play,
    pause: pause
  };
})(window.App = window.App || {});
