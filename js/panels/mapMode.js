import { bus, store, AppState } from '../state.js';

export function initMapMode() {
  const mountPoint = document.getElementById('panel-mapMode');
  if (!mountPoint) return;

  // Render UI
  mountPoint.innerHTML = `
    <div class="pointer-events-auto bg-white border border-gray-300 shadow-md overflow-hidden" id="mapMode-content">
      <!-- Mode tabs row -->
      <div class="flex">
        <button data-mode="แผนที่" class="mode-btn px-4 py-1.5 text-sm font-bold text-gray-800 border-r border-gray-300 transition-colors">
          แผนที่
        </button>
        <button data-mode="ภาพถ่ายดาวเทียม" class="mode-btn px-4 py-1.5 text-sm font-bold text-gray-800 transition-colors">
          ภาพถ่ายดาวเทียม
        </button>
      </div>
      <!-- Layer + fullscreen row -->
      <div class="hidden border-t border-gray-300 flex items-center justify-between" id="mapMode-layers">
        <label class="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-800 cursor-pointer hover:bg-gray-50" id="mapMode-layer-terrain">
          <input type="checkbox" data-layer="ที่ราดชัน" class="layer-checkbox w-4 h-4 cursor-pointer">
          <span>ที่ราดชัน</span>
        </label>
        <label class="hidden items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-800 cursor-pointer hover:bg-gray-50" id="mapMode-layer-labels">
          <input type="checkbox" data-layer="ป้ายชื่อ" class="layer-checkbox w-4 h-4 cursor-pointer">
          <span>ป้ายชื่อ</span>
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
      btn.style.backgroundColor = isActive ? '#D9D9D9' : '#ffffff';
    });

    // Update Checkboxes
    layerCheckboxes.forEach(cb => {
      const layer = cb.dataset.layer;
      cb.checked = !!store.mapLayers[layer];
    });
  };

  // Initial Sync
  updateUI();

  const layersRow = mountPoint.querySelector('#mapMode-layers');
  const layerTerrain = mountPoint.querySelector('#mapMode-layer-terrain');
  const layerLabels = mountPoint.querySelector('#mapMode-layer-labels');

  const updateLayerRow = () => {
    layersRow.classList.remove('hidden');
    if (store.mapMode === 'แผนที่') {
      layerTerrain.classList.remove('hidden');
      layerTerrain.classList.add('flex');
      layerLabels.classList.add('hidden');
      layerLabels.classList.remove('flex');
    } else {
      layerLabels.classList.remove('hidden');
      layerLabels.classList.add('flex');
      layerTerrain.classList.add('hidden');
      layerTerrain.classList.remove('flex');
    }
  };

  // Event Listeners: Mode toggle
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (store.mapMode !== mode) {
        bus.emit('mapmode:change', { mode });
        setTimeout(() => { updateUI(); updateLayerRow(); }, 0);
      } else {
        const isVisible = !layersRow.classList.contains('hidden');
        if (isVisible) {
          layersRow.classList.add('hidden');
        } else {
          updateLayerRow();
        }
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
