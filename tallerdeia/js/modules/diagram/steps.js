/* =============================================================
 * modules/diagram/steps.js
 * -------------------------------------------------------------
 * Declarative description of the multi-agent flow that the
 * animation engine walks through. Each step defines:
 *
 *   id          — logical identifier (informational)
 *   pathId      — id of the SVG <path> the traveler follows
 *   from        — id of the SVG node where the step begins
 *   to          — id of the SVG node where the step ends
 *   title       — text shown in the status card
 *   badge       — short label rendered next to the title
 *   badgeClass  — optional class applied to the badge
 *                 (badge-loop / badge-pass)
 *   desc        — long-form description shown in the status card
 *   duration    — animation duration for the traveler, in ms
 *   isLoop      — true if this step represents a FAIL retry
 *   isPass      — true if this step represents a final PASS
 *   pillIndex   — index of the step-pill to highlight
 *
 * The order of the array IS the animation order.
 * ============================================================= */
(function (App) {
  'use strict';

  var STEPS = [
    {
      id: 'step-idea-orq',
      pathId: 'path-idea-orq',
      from: 'node-idea',
      to: 'node-orquestador',
      title: '1. Idea → Orquestador',
      badge: 'Planificación',
      desc: 'El usuario describe su idea en prosa común ("en criollo") directamente en el chat del Orquestador.',
      duration: 1300,
      pillIndex: 0
    },
    {
      id: 'step-orq-prompt',
      pathId: 'path-orq-prompt',
      from: 'node-orquestador',
      to: 'node-prompt',
      title: '2. Orquestador → Prompt',
      badge: 'Contrato Técnico',
      desc: 'El Orquestador traduce la idea en un contrato técnico estructurado (objetivo, stack, restricciones, criterios).',
      duration: 1300,
      pillIndex: 1
    },
    {
      id: 'step-prompt-coder',
      pathId: 'path-prompt-coder',
      from: 'node-prompt',
      to: 'node-coder',
      title: '3. Prompt → Coder',
      badge: 'Construcción',
      desc: 'El contrato técnico se entrega al Coder en una ventana de chat separada para iniciar la compilación.',
      duration: 1100,
      pillIndex: 2
    },
    {
      id: 'step-coder-rev',
      pathId: 'path-coder-rev',
      from: 'node-coder',
      to: 'node-revision',
      title: '4. Coder → Punto de Revisión',
      badge: 'Auditoría',
      desc: 'El Coder compila el código completo y se entrega al Punto de Revisión (junto al Orquestador) para ser auditado.',
      duration: 1300,
      pillIndex: 3
    },
    {
      id: 'step-loop-fail',
      pathId: 'path-loop',
      from: 'node-revision',
      to: 'node-coder',
      title: '5. Loop: Revisión → Coder (FAIL)',
      badge: 'Corrección (FAIL)',
      badgeClass: 'badge-loop',
      desc: 'Si no cumple todos los criterios (FAIL), el Orquestador emite correcciones quirúrgicas y se repite el ciclo.',
      duration: 1600,
      isLoop: true,
      pillIndex: 4
    },
    {
      id: 'step-coder-resubmit',
      pathId: 'path-coder-rev',
      from: 'node-coder',
      to: 'node-revision',
      title: '6. Coder corrige → Revisión',
      badge: 'Re-verificación',
      desc: 'El Coder aplica las correcciones solicitadas y reenvía el artefacto para su nueva validación.',
      duration: 1300,
      pillIndex: 3
    },
    {
      id: 'step-rev-pass',
      pathId: 'path-rev-pass',
      from: 'node-revision',
      to: 'node-resultado',
      title: '7. Revisión → Resultado Final (PASS)',
      badge: 'Aprobado (PASS)',
      badgeClass: 'badge-pass',
      desc: '¡Aprobado! Cumple al 100% los criterios de aceptación del contrato. El artefacto final queda listo y validado.',
      duration: 1600,
      isPass: true,
      pillIndex: 6
    }
  ];

  App.diagram = App.diagram || {};
  App.diagram.STEPS = STEPS;
})(window.App = window.App || {});
