import { bus, store, AppState, setState } from './state.js';

// Import Panels. Every panel/module exposes a single initX() entry point (no self-execution),
// so this file is the one place panels are wired up. To add a panel: import its init here and
// call it in the init block below (append-only — keeps merge conflicts minimal).
import { initLeftSidebar } from './panels/leftSidebar.js';
import { initBakaId } from './panels/bakaId.js';
import { initMapMode } from './panels/mapMode.js';
import { initAnalysisResults } from './panels/analysisResults.js';
import { initRightSidebar } from './panels/rightSidebar.js';
import { initLegend } from './panels/legend.js';
import { initProcessing } from './panels/processing.js';
import { initUserManual } from './panels/userManual.js';
import { initMapOverlays } from './map/overlays.js';
import { initDevToolbar } from './devToolbar.js';

// Global Toast Handler
const toastContainer = document.getElementById('toast-container');
bus.on('toast', ({ message, ms = 2000 }) => {
  const el = document.createElement('div');
  el.className = 'toast-msg';
  el.textContent = message;
  toastContainer.appendChild(el);
  
  // Animate in
  requestAnimationFrame(() => {
    el.classList.add('show');
  });

  // Animate out and remove
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, ms);
});

// Fullscreen Modal Handler for Charts
const modalContainer = document.getElementById('modal-container');
const modalClose = document.getElementById('modal-close');
const modalCanvas = document.getElementById('modal-canvas');
let currentModalChart = null;

bus.on('chart:expand', ({ chartId, config }) => {
  modalContainer.classList.remove('hidden');
  requestAnimationFrame(() => {
    modalContainer.classList.remove('opacity-0');
    modalContainer.classList.add('opacity-100');
  });

  if (currentModalChart) {
    currentModalChart.destroy();
  }

  currentModalChart = new Chart(modalCanvas, config);
});

modalClose.addEventListener('click', () => {
  modalContainer.classList.remove('opacity-100');
  modalContainer.classList.add('opacity-0');
  setTimeout(() => {
    modalContainer.classList.add('hidden');
    if (currentModalChart) {
      currentModalChart.destroy();
      currentModalChart = null;
    }
  }, 200);
});

// Kick off
document.addEventListener('DOMContentLoaded', () => {
  // Initialize every panel (each is idempotent / self-contained).
  initLeftSidebar();
  initBakaId();
  initMapMode();
  initAnalysisResults();
  initRightSidebar();
  initLegend();
  initProcessing();
  initUserManual();
  initMapOverlays();
  initDevToolbar();

  // Start app in HOME state
  setState(AppState.HOME);
});
