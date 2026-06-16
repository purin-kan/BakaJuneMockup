import { bus, store, AppState } from '../state.js';

export function initMapMode() {
  const mountPoint = document.getElementById('panel-mapMode');
  if (!mountPoint) return;

  // Render UI
  mountPoint.innerHTML = `
    <div class="pointer-events-auto bg-white/95 backdrop-blur shadow-lg border border-gray-200 rounded-2xl p-3 flex flex-col gap-3 transition-all duration-300" id="mapMode-content">
      <div class="flex bg-gray-100 rounded-full p-1 relative">
        <button data-mode="แผนที่" class="mode-btn flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200">
          แผนที่
        </button>
        <button data-mode="ภาพถ่ายดาวเทียม" class="mode-btn flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200">
          ภาพถ่ายดาวเทียม
        </button>
      </div>
      
      <div class="flex items-center gap-5 px-2">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" data-layer="ที่ราดฉัน" class="layer-checkbox w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer">
          <span class="text-sm text-gray-700 group-hover:text-gray-900 select-none">ที่ราดฉัน</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" data-layer="ป้ายชื่อ" class="layer-checkbox w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer">
          <span class="text-sm text-gray-700 group-hover:text-gray-900 select-none">ป้ายชื่อ</span>
        </label>
      </div>
    </div>
  `;

  const modeBtns = mountPoint.querySelectorAll('.mode-btn');
  const layerCheckboxes = mountPoint.querySelectorAll('.layer-checkbox');
  const panelContent = mountPoint.querySelector('#mapMode-content');

  const updateUI = () => {
    // Update Mode Tabs
    modeBtns.forEach(btn => {
      const isActive = btn.dataset.mode === store.mapMode;
      if (isActive) {
        btn.classList.add('bg-white', 'text-gray-900', 'shadow');
        btn.classList.remove('text-gray-500', 'hover:text-gray-700');
      } else {
        btn.classList.remove('bg-white', 'text-gray-900', 'shadow');
        btn.classList.add('text-gray-500', 'hover:text-gray-700');
      }
    });

    // Update Checkboxes
    layerCheckboxes.forEach(cb => {
      const layer = cb.dataset.layer;
      cb.checked = !!store.mapLayers[layer];
    });
  };

  // Initial Sync
  updateUI();

  // Event Listeners: Mode toggle
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (store.mapMode !== mode) {
        bus.emit('mapmode:change', { mode });
        // The store updates itself via its own listener,
        // we can re-sync UI to reflect the local update instantly.
        setTimeout(updateUI, 0);
      }
    });
  });

  // Event Listeners: Layer toggle
  layerCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const layer = e.target.dataset.layer;
      const on = e.target.checked;
      bus.emit('maplayer:toggle', { layer, on });
      setTimeout(updateUI, 0);
    });
  });

  // Contract: Listen to state:change 
  // We keep it visible across all states as instructed, 
  // but registering the listener to satisfy the contract.
  bus.on('state:change', ({ state }) => {
    // The Map Mode is preserved across processing, keeping it fully visible
    // and interactive in HOME, PROCESSING, and PROCESSED states.
  });
}
