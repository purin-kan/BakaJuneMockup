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

export function initDevToolbar() {
  const mount = document.getElementById('dev-toolbar-mount');
  if (!mount) return;

  const tb = document.createElement('div');
  tb.className = 'fixed bottom-2 left-1/2 -translate-x-1/2 z-[9999] bg-black/70 backdrop-blur text-white p-2 rounded-full flex gap-2 text-xs shadow-lg font-mono';

  const states = [
    { label: 'Home', action: () => setState(AppState.HOME) },
    { label: 'All Hide', action: () => {
      // Hide every panel, leaving only the header and the map.
      document.body.classList.add('all-hide-active');
      setPanelsDisplay('none');
    }},
    { label: 'Processing', action: () => setState(AppState.PROCESSING) },
    { label: 'Processed', action: () => setState(AppState.PROCESSED) }
  ];

  states.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = s.label;
    btn.className = 'px-3 py-1 bg-white/20 hover:bg-white/40 rounded-full transition';
    btn.onclick = () => {
      // Clear any "All Hide" override so state-driven visibility takes over again.
      document.body.classList.remove('all-hide-active');
      setPanelsDisplay('');

      s.action();
    };
    tb.appendChild(btn);
  });

  mount.appendChild(tb);
}
