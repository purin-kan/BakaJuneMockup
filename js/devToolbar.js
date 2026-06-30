import { bus, AppState, setState } from './state.js';

// Every floating panel mount point — used to hide/restore them all for "All Hide".
const ALL_PANEL_IDS = [
  'panel-leftSidebar',
  'panel-bakaId',
  'panel-mapMode',
  'panel-analysisResults',
  'panel-rightSidebar',
  'panel-legend',
  'panel-processing',
  'panel-userManual'
];

function setPanelsDisplay(value) {
  ALL_PANEL_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = value;
  });
}

function expandAll() {
  const sidebarContent = document.getElementById('left-sidebar-content');
  const sidebarBody = document.getElementById('left-sidebar-body');
  const collapseBtn = document.getElementById('btn-collapse');
  if (sidebarBody) sidebarBody.classList.remove('hidden');
  if (sidebarContent) {
    sidebarContent.style.background = '';
    sidebarContent.style.boxShadow = '';
    const titleBlock = sidebarContent.querySelector('.shrink-0');
    if (titleBlock) { titleBlock.style.background = ''; titleBlock.style.borderBottom = ''; }
  }
  if (collapseBtn) collapseBtn.textContent = 'ย่อ';

  const googleLogo = document.getElementById('google-logo');
  const zoomButtons = document.getElementById('zoom-buttons');
  const legendPanel = document.getElementById('panel-legend');
  if (googleLogo) googleLogo.style.left = '333px';
  if (zoomButtons) zoomButtons.style.left = '341px';
  if (legendPanel) legendPanel.style.left = '333px';

  const bakaBody = document.getElementById('bakaId-body');
  const bakaBtn = document.getElementById('bakaId-collapse-btn');
  if (bakaBody) bakaBody.classList.remove('hidden');
  if (bakaBtn) bakaBtn.textContent = 'ย่อ';
}

function collapseAll() {
  const sidebarContent = document.getElementById('left-sidebar-content');
  const sidebarBody = document.getElementById('left-sidebar-body');
  const collapseBtn = document.getElementById('btn-collapse');
  if (sidebarBody) sidebarBody.classList.add('hidden');
  if (sidebarContent) {
    sidebarContent.style.background = 'transparent';
    sidebarContent.style.boxShadow = 'none';
    const titleBlock = sidebarContent.querySelector('.shrink-0');
    if (titleBlock) { titleBlock.style.background = 'rgba(255,255,255,1)'; titleBlock.style.borderBottom = 'none'; }
  }
  if (collapseBtn) collapseBtn.textContent = 'ขยาย';

  const googleLogo = document.getElementById('google-logo');
  const zoomButtons2 = document.getElementById('zoom-buttons');
  const legendPanel2 = document.getElementById('panel-legend');
  if (googleLogo) googleLogo.style.left = '8px';
  if (zoomButtons2) zoomButtons2.style.left = '8px';
  if (legendPanel2) legendPanel2.style.left = '8px';

  const bakaBody = document.getElementById('bakaId-body');
  const bakaBtn = document.getElementById('bakaId-collapse-btn');
  if (bakaBody) bakaBody.classList.add('hidden');
  if (bakaBtn) bakaBtn.textContent = 'ขยาย';
}

export function initDevToolbar() {
  const mount = document.getElementById('dev-toolbar-mount');
  if (!mount) return;

  const tb = document.createElement('div');
  tb.className = 'fixed bottom-2 left-1/2 -translate-x-1/2 z-[9999] bg-black/70 backdrop-blur text-white p-2 rounded-full flex gap-2 text-xs shadow-lg font-mono';

  const states = [
    { label: 'Home', action: () => { setState(AppState.HOME); expandAll(); }},
    { label: 'All Hide', action: () => collapseAll() },
    { label: 'Processing', action: () => setState(AppState.PROCESSING) },
    { label: 'Processed', action: () => setState(AppState.PROCESSED) }
  ];

  states.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = s.label;
    btn.className = 'px-3 py-1 bg-white/20 hover:bg-white/40 rounded-full transition';
    btn.onclick = () => s.action();
    tb.appendChild(btn);
  });

  mount.appendChild(tb);
}
