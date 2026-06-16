import { FAKE_DATA } from '../data.js';
import { bus, store, AppState } from '../state.js';

export function initLeftSidebar() {
  const container = document.getElementById('panel-leftSidebar');
  if (!container) return;

  // Build UI
  container.innerHTML = `
    <div id="left-sidebar-content" class="w-80 h-full bg-white shadow-xl flex flex-col transition-all duration-300 z-50 relative">
      <!-- Header -->
      <div class="p-4 bg-green-700 text-white flex justify-between items-center">
        <div>
          <h2 class="font-bold text-lg">SugarCane@2025.12.30</h2>
          <p class="text-xs text-green-200">ระบบประเมินและวิเคราะห์</p>
        </div>
        <button id="btn-collapse" class="p-1 hover:bg-green-600 rounded text-sm bg-green-800">ย่อ</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-6" id="left-sidebar-body">
        
        <!-- Smart Dates & Cloud -->
        <div class="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h3 class="font-semibold text-gray-700">ช่วงเวลา & เมฆปกคลุม</h3>
          <div class="flex space-x-2">
            <div class="flex-1">
              <label class="text-xs text-gray-500">วันเริ่มต้น</label>
              <select id="select-start-date" class="w-full text-sm p-1 border rounded">
                <option value="">เลือกวันที่</option>
                ${FAKE_DATA.presets.dates.map((d, i) => `<option value="${d}" data-idx="${i}">${d}</option>`).join('')}
              </select>
            </div>
            <div class="flex-1">
              <label class="text-xs text-gray-500">วันสิ้นสุด</label>
              <select id="select-end-date" class="w-full text-sm p-1 border rounded">
                <option value="">เลือกวันที่</option>
                ${FAKE_DATA.presets.dates.map((d, i) => `<option value="${d}" data-idx="${i}">${d}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500">เมฆปกคลุม (%)</label>
            <input type="text" id="input-cloud" class="w-full text-sm p-1 border rounded" placeholder="เช่น 20%" />
          </div>
        </div>

        <!-- Section 1 -->
        <div class="space-y-2">
          <h3 class="font-semibold text-gray-700">1. วาดเส้นขอบเขตพื้นที่แปลง</h3>
          <div class="flex flex-wrap gap-2">
            <button class="tool-btn flex-1 py-1 px-2 bg-white hover:bg-green-50 rounded text-sm border border-gray-300" data-tool="วาด">✍️ วาด</button>
            <button class="tool-btn flex-1 py-1 px-2 bg-white hover:bg-green-50 rounded text-sm border border-gray-300" data-tool="วาดอัตโนมัติ">🪄 วาดอัตโนมัติ</button>
            <button class="tool-btn py-1 px-2 bg-white hover:bg-green-50 rounded text-sm border border-gray-300" data-tool="ย้อนจุด">↩️</button>
            <button class="tool-btn py-1 px-2 bg-white hover:bg-green-50 rounded text-sm border border-gray-300" data-tool="ขยับ">✋</button>
            <button class="tool-btn py-1 px-2 bg-white hover:bg-red-50 rounded text-sm border border-gray-300 text-red-600" data-tool="ลบ">❌</button>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-gray-700">2. เลือกแปลง</h3>
            <label class="text-xs flex items-center space-x-1 cursor-pointer text-blue-600 hover:text-blue-800">
              <input type="checkbox" id="check-all-plots" ${[1, 2, 3].every(id => store.selectedPlots[id]) ? 'checked' : ''} />
              <span>เลือกทั้งหมด</span>
            </label>
          </div>
          <div class="space-y-1">
            ${[1, 2, 3].map(id => `
              <label class="flex items-center space-x-2 p-2 bg-white hover:bg-gray-50 rounded border border-gray-200 cursor-pointer">
                <input type="checkbox" class="plot-check" value="${id}" ${store.selectedPlots[id] ? 'checked' : ''} />
                <span class="text-sm">แปลง ${id}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Section 3 -->
        <div class="space-y-3">
          <h3 class="font-semibold text-gray-700">3. ประมวลผล</h3>
          
          <div class="space-y-2">
            <p class="text-xs font-bold text-gray-500">ข้อมูล</p>
            <div class="flex flex-wrap gap-2">
              ${['บาก้าอินเด็กซ์', 'รายวัน', 'เปรียบเทียบ'].map(fn => `
                <button class="func-btn px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-green-50 transition-colors" data-func="${fn}" data-group="ข้อมูล">${fn}</button>
              `).join('')}
            </div>

            <p class="text-xs font-bold text-gray-500 mt-2">ปัญหา</p>
            <div class="flex flex-wrap gap-2">
              ${['วิเคราะห์', 'แต่งหน้าอ้อย'].map(fn => `
                <button class="func-btn px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-green-50 transition-colors" data-func="${fn}" data-group="ปัญหา">${fn}</button>
              `).join('')}
            </div>

            <p class="text-xs font-bold text-gray-500 mt-2">ผลผลิต</p>
            <div class="flex flex-wrap gap-2">
              ${['ผลผลิตอ้อย'].map(fn => `
                <button class="func-btn px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-green-50 transition-colors" data-func="${fn}" data-group="ผลผลิต">${fn}</button>
              `).join('')}
            </div>
          </div>

          <!-- Function Description -->
          <div id="func-desc-box" class="p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100 hidden mt-3">
            <strong id="func-desc-title" class="block mb-1"></strong>
            <span id="func-desc-text"></span>
          </div>

          <!-- Actions -->
          <div class="flex flex-col space-y-2 pt-4">
            <button id="btn-process" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold text-sm transition-colors shadow">กลับไปที่แปลง</button>
            <button id="btn-cancel" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-semibold text-sm transition-colors">ยกเลิก</button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Setup references
  const leftSidebarBody = document.getElementById('left-sidebar-body');
  const btnCollapse = document.getElementById('btn-collapse');
  const selectStart = document.getElementById('select-start-date');
  const selectEnd = document.getElementById('select-end-date');
  const inputCloud = document.getElementById('input-cloud');
  const toolBtns = document.querySelectorAll('.tool-btn');
  const checkAllPlots = document.getElementById('check-all-plots');
  const plotChecks = document.querySelectorAll('.plot-check');
  const funcBtns = document.querySelectorAll('.func-btn');
  const funcDescBox = document.getElementById('func-desc-box');
  const funcDescTitle = document.getElementById('func-desc-title');
  const funcDescText = document.getElementById('func-desc-text');
  const btnProcess = document.getElementById('btn-process');
  const btnCancel = document.getElementById('btn-cancel');

  // Collapse logic
  let collapsed = false;
  btnCollapse.addEventListener('click', () => {
    collapsed = !collapsed;
    const content = document.getElementById('left-sidebar-content');
    if (collapsed) {
      content.classList.remove('w-80');
      content.classList.add('w-0');
      content.style.overflow = 'hidden';
      btnCollapse.textContent = 'ขยาย';
      btnCollapse.classList.add('absolute', '-right-12', 'top-4', 'bg-green-700', 'text-white', 'p-2', 'rounded-r');
      btnCollapse.classList.remove('p-1', 'bg-green-800');
    } else {
      content.classList.remove('w-0');
      content.classList.add('w-80');
      content.style.overflow = 'visible';
      btnCollapse.textContent = 'ย่อ';
      btnCollapse.classList.remove('absolute', '-right-12', 'top-4', 'bg-green-700', 'text-white', 'p-2', 'rounded-r');
      btnCollapse.classList.add('p-1', 'bg-green-800');
    }
  });

  // Event emission for Date
  let isAutoFilling = false;
  
  selectStart.addEventListener('change', (e) => {
    if (!isAutoFilling) bus.emit('date:change', { which: 'start', value: e.target.value });
  });
  
  selectEnd.addEventListener('change', (e) => {
    if (!isAutoFilling) bus.emit('date:change', { which: 'end', value: e.target.value });
  });

  inputCloud.addEventListener('change', (e) => {
    bus.emit('cloud:auto', { value: e.target.value });
  });

  // Event consumption for Date (Smart Dates & Cloud)
  bus.on('date:change', ({ which, value }) => {
    if (!value || isAutoFilling) return;
    
    isAutoFilling = true;
    
    // Find index of the selected date
    const idx = FAKE_DATA.presets.dates.indexOf(value);
    
    if (idx !== -1) {
      // Setup smart cloud cover based on date index
      const cloud = FAKE_DATA.presets.cloudCovers[idx];
      if (cloud) {
        inputCloud.value = cloud;
        bus.emit('cloud:auto', { value: cloud });
      }

      // Bidirectional auto-fill (+1yr or -1yr roughly by picking next/prev index)
      const otherWhich = which === 'start' ? 'end' : 'start';
      const otherSelect = otherWhich === 'start' ? selectStart : selectEnd;
      
      if (!otherSelect.value) {
        let otherIdx = which === 'start' ? idx + 1 : idx - 1;
        // fallback bounds
        if (otherIdx >= FAKE_DATA.presets.dates.length) otherIdx = idx;
        if (otherIdx < 0) otherIdx = 0;
        
        const otherVal = FAKE_DATA.presets.dates[otherIdx];
        otherSelect.value = otherVal;
        
        // Ensure state is updated for the auto-filled value
        setTimeout(() => bus.emit('date:change', { which: otherWhich, value: otherVal }), 0);
      }
    }
    
    isAutoFilling = false;
  });

  bus.on('cloud:auto', ({ value }) => {
    inputCloud.value = value;
  });

  // Tool selection
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // visual feedback
      toolBtns.forEach(b => {
        b.classList.remove('ring-2', 'ring-green-500', 'bg-green-50');
        if (b.dataset.tool !== 'ลบ') b.classList.add('bg-white');
      });
      btn.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
      btn.classList.remove('bg-white');
      
      bus.emit('tool:select', { tool: btn.dataset.tool });
    });
  });

  // Plots toggle
  checkAllPlots.addEventListener('change', (e) => {
    const on = e.target.checked;
    plotChecks.forEach(chk => {
      // Emit only if changed
      if (chk.checked !== on) {
        chk.checked = on;
        bus.emit('plot:toggle', { id: parseInt(chk.value), on });
      }
    });
  });

  plotChecks.forEach(chk => {
    chk.addEventListener('change', (e) => {
      bus.emit('plot:toggle', { id: parseInt(e.target.value), on: e.target.checked });
      const allChecked = Array.from(plotChecks).every(c => c.checked);
      checkAllPlots.checked = allChecked;
    });
  });

  // Function selection (Dynamic description)
  funcBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.func;
      const group = btn.dataset.group;
      const desc = FAKE_DATA.functionDescriptions[key] || '';
      
      bus.emit('func:select', { key, group, desc });
    });
  });

  bus.on('func:select', ({ key, group, desc }) => {
    // visual feedback
    funcBtns.forEach(b => {
      b.classList.remove('ring-2', 'ring-green-500', 'bg-green-50');
      if (b.dataset.func === key) {
        b.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
      }
    });
    
    // Update UI desc
    funcDescTitle.textContent = key;
    funcDescText.textContent = desc;
    funcDescBox.classList.remove('hidden');
  });

  // Process Actions
  btnProcess.addEventListener('click', () => {
    bus.emit('process:start', {});
  });

  btnCancel.addEventListener('click', () => {
    bus.emit('process:cancel', {});
  });

  // Listen to State Changes to disable inputs during processing
  bus.on('state:change', ({ state }) => {
    if (state === AppState.PROCESSING) {
      leftSidebarBody.classList.add('opacity-50', 'pointer-events-none');
    } else {
      leftSidebarBody.classList.remove('opacity-50', 'pointer-events-none');
    }
  });

}
