import { bus, store, AppState } from '../state.js';

export function initDataLevel() {
  const container = document.getElementById('panel-dataLevel');
  if (!container) return;

  const checkboxes = [
    'อ้อย(ไม่ดี)',
    'อ้อย(ดี)',
    'อ้อย(ปัจจุบัน)',
    'บาก้าอินเด็กซ์ (สะสม-แถบสี)',
    'บาก้าอินเด็กซ์ (สะสม)',
    'บาก้าอินเด็กซ์ (ปัจจุบัน-แถบสี)',
    'บาก้าอินเด็กซ์ (ปัจจุบัน)',
    'เส้นขอบเขต'
  ];

  container.innerHTML = `
    <div class="bg-white border border-gray-300 rounded shadow-md pointer-events-auto overflow-hidden" style="width: 230px;">
      <div class="bg-blue-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
        <span>เลเยอร์ข้อมูล</span>
      </div>
      <div class="p-2.5 bg-gray-50 flex flex-col gap-1.5 max-h-[220px] overflow-y-auto">
        ${checkboxes.map((label, idx) => `
          <label class="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input type="checkbox" class="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" ${idx >= 3 ? 'checked' : ''} />
            <span>${label}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;

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
