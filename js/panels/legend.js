import { bus, store, AppState } from '../state.js';

const COLORS = [
  { value: '0.0', color: '#7B1A00' },
  { value: '0.1', color: '#E06000' },
  { value: '0.2', color: '#F5C07A' },
  { value: '0.3', color: '#FFFF00' },
  { value: '0.4', color: '#AEDD8A' },
  { value: '0.5', color: '#5CC44A' },
  { value: '0.6', color: '#2A9A2A' },
  { value: '0.7', color: '#006600' },
];

export function initLegend() {
  const container = document.getElementById('panel-legend');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white border border-gray-300 shadow-md pointer-events-auto" style="min-width: 130px;">
      <div class="px-3 pt-2 pb-1">
        <div class="font-bold text-sm text-gray-800 mb-2">บาก้าอินเด็กซ์</div>
        <div id="legend-body">
          ${COLORS.map(({ value, color }) => `
            <div class="flex items-center gap-2 mb-1">
              <div style="width:16px; height:16px; background:${color}; flex-shrink:0;"></div>
              <span class="text-xs text-gray-700">${value}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-end mt-1">
          <button id="legend-toggle" class="text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-100 bg-white">ย่อ</button>
        </div>
      </div>
    </div>
  `;

  let collapsed = false;
  const body = container.querySelector('#legend-body');
  const btn = container.querySelector('#legend-toggle');
  btn.addEventListener('click', () => {
    collapsed = !collapsed;
    body.style.display = collapsed ? 'none' : '';
    btn.textContent = collapsed ? 'ขยาย' : 'ย่อ';
  });

  const updateVisibility = () => {
    if (store.currentState === AppState.PROCESSED) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  };

  updateVisibility();
  bus.on('state:change', updateVisibility);
}
