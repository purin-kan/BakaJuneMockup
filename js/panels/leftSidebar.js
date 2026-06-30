import { FAKE_DATA } from '../data.js';
import { bus, store, AppState } from '../state.js';

export function initLeftSidebar() {
  const container = document.getElementById('panel-leftSidebar');
  if (!container) return;

  container.innerHTML = `
    <div id="left-sidebar-content" class="bg-white shadow-xl flex flex-col z-50 relative transition-all duration-300" style="width: 325px; height: calc(100vh - 70px);">

      <!-- Title + Description + Collapse (always visible) -->
      <div class="px-3 pt-3 pb-2 flex justify-between items-start shrink-0 border-b border-gray-200">
        <div class="flex-1 pr-2">
          <div class="text-blue-500 font-bold text-lg leading-tight cursor-pointer hover:underline">SugarCane@2025.12.30</div>
          <div class="text-xs text-gray-900 mt-1 leading-snug">ค่าดัชนีบ่งบอกการเจริญเติบโตอ้อยโรงงานรายแปลงเพาะปลูก ตามระยะเวลาที่กำหนด</div>
        </div>
        <button id="btn-collapse" class="text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-600 hover:bg-gray-100 shrink-0 mt-1">ย่อ</button>
      </div>

      <!-- Scrollable body -->
      <div class="flex-1 overflow-y-auto" id="left-sidebar-body">

        <!-- Date row -->
        <div class="px-3 py-2 flex items-center gap-1 text-xs text-gray-700 border-t border-gray-200">
          <span class="shrink-0">วันที่ :</span>
          <select id="select-start-date" class="border border-gray-300 rounded px-1 py-0.5 text-xs flex-1 min-w-0">
            <option value="">เลือก</option>
            ${FAKE_DATA.presets.dates.map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
          <span class="shrink-0">ถึงวันที่ :</span>
          <select id="select-end-date" class="border border-gray-300 rounded px-1 py-0.5 text-xs flex-1 min-w-0">
            <option value="">เลือก</option>
            ${FAKE_DATA.presets.dates.map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
        </div>

        <!-- Cloud cover row -->
        <div class="px-3 py-2 flex items-center gap-2 text-xs text-gray-700 border-t border-b border-gray-200">
          <span class="shrink-0">เมฆปกคลุมท้องฟ้า :</span>
          <button id="btn-cloud-default" class="border border-gray-300 rounded px-3 py-0.5 text-xs hover:bg-gray-50">ค่ามาตรฐาน</button>
          <span id="cloud-value-display" class="text-gray-400"></span>
        </div>

        <!-- Section 1: วาดเส้นขอบเขต -->
        <div class="m-2 border border-gray-200 rounded overflow-hidden">
          <div class="px-2 py-1.5 bg-white">
            <span class="text-xs font-bold text-gray-800">1.วาดเส้นขอบเขตพื้นที่แปลง</span>
          </div>
          <div id="sec1-body" class="bg-gray-100 px-2 pt-2 pb-1">
            <div class="flex gap-1">
              <button class="tool-btn flex-1 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50" data-tool="ลบ">🥫 ลบ</button>
              <button class="tool-btn flex-1 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50" data-tool="วาด">✍ วาด</button>
              <button class="tool-btn flex-1 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50" data-tool="มือ">🖐 มือ</button>
            </div>
            <div class="flex justify-end mt-1">
              <button class="sec-toggle text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200 bg-white" data-target="sec1-body">ย่อ</button>
            </div>
          </div>
        </div>

        <!-- Section 2: เลือกแปลง -->
        <div class="m-2 border border-gray-200 rounded overflow-hidden">
          <div class="px-2 py-1.5 bg-white">
            <span class="text-xs font-bold text-gray-800">2.เลือกแปลง</span>
          </div>
          <div id="sec2-body" class="bg-gray-100 px-2 pt-2 pb-1">
            <label class="flex items-center gap-2 text-xs cursor-pointer mb-1">
              <input type="checkbox" id="check-all-plots" ${[1,2,3].every(id => store.selectedPlots[id]) ? 'checked' : ''} />
              <span>เลือกทั้งหมด</span>
            </label>
            ${[1, 2, 3].map(id => `
              <label class="flex items-center gap-2 text-xs cursor-pointer bg-white border border-gray-200 rounded px-2 py-1 mb-1">
                <input type="checkbox" class="plot-check" value="${id}" ${store.selectedPlots[id] ? 'checked' : ''} />
                <span>แปลง ${id}</span>
              </label>
            `).join('')}
            <div class="flex justify-end mt-1">
              <button class="sec-toggle text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200 bg-white" data-target="sec2-body">ย่อ</button>
            </div>
          </div>
        </div>

        <!-- Section 3: ประมวลผล -->
        <div class="m-2 border border-gray-200 rounded overflow-hidden">
          <div class="px-2 py-1.5 bg-white">
            <span class="text-xs font-bold text-gray-800">3.ประมวลผล</span>
          </div>
          <div id="sec3-body" class="bg-gray-100 px-2 pt-2 pb-1">
            ${[
              ['บาก้าอินเด็กซ์', 'รายวัน', 'เปรียบเทียบ'],
              ['วิเคราะห์', 'แต่งหน้าอ้อย', 'ผลผลิตอ้อย'],
              ['อุณหภูมิ', 'ความชื้นในดิน', 'ความเครียด'],
              ['เทียบฤดูกาล', 'อนุกรมเวลา', 'เนื้อดิน'],
              ['สถิติน้ำฝน', 'ติดตามผล', 'ไฟไหม้'],
            ].map(row => `
              <div class="flex gap-1 mb-1">
                ${row.map(fn => `
                  <button class="func-btn flex-1 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-green-50" data-func="${fn}">${fn}</button>
                `).join('')}
              </div>
            `).join('')}
            <div class="flex gap-1 mb-1 mt-2">
              <button class="flex-1 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">เมนู</button>
              <button id="btn-process" class="flex-1 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-green-50 font-semibold">แปลงอ้อย</button>
              <button id="btn-cancel" class="flex-1 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-red-50 text-red-600">ยกเลิก</button>
            </div>
            <div class="flex justify-end mt-1">
              <button class="sec-toggle text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200 bg-white" data-target="sec3-body">ย่อ</button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-3 pb-4 text-gray-400" style="margin-top: 30px;">
          <div class="text-blue-500 text-xs font-bold">© 2023 บริษัท บาก้า จำกัด สงวนลิขสิทธิ์.</div>
          <div style="font-size: 9px;">16/1 ซอยพหลโยธิน 30 แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900</div>
          <div style="font-size: 9px;">โทรศัพท์ 02-790-3555 โทรสาร 02-790-3556</div>
        </div>

      </div>
    </div>
  `;

  // References
  const leftSidebarBody = document.getElementById('left-sidebar-body');
  const btnCollapse = document.getElementById('btn-collapse');
  const selectStart = document.getElementById('select-start-date');
  const selectEnd = document.getElementById('select-end-date');
  const btnCloudDefault = document.getElementById('btn-cloud-default');
  const cloudDisplay = document.getElementById('cloud-value-display');
  const toolBtns = document.querySelectorAll('.tool-btn');
  const checkAllPlots = document.getElementById('check-all-plots');
  const plotChecks = document.querySelectorAll('.plot-check');
  const funcBtns = document.querySelectorAll('.func-btn');
  const btnProcess = document.getElementById('btn-process');
  const btnCancel = document.getElementById('btn-cancel');

  // Collapse: hide body, keep title visible, make bg transparent
  let collapsed = false;
  const sidebarContent = document.getElementById('left-sidebar-content');
  const titleBlock = sidebarContent.querySelector('.shrink-0');
  const googleLogo = document.getElementById('google-logo');
  const zoomButtons = document.getElementById('zoom-buttons');
  const legendPanel = document.getElementById('panel-legend');
  btnCollapse.addEventListener('click', () => {
    collapsed = !collapsed;
    if (collapsed) {
      leftSidebarBody.classList.add('hidden');
      sidebarContent.style.background = 'transparent';
      sidebarContent.style.boxShadow = 'none';
      titleBlock.style.background = 'rgba(255,255,255,1)';
      titleBlock.style.borderBottom = 'none';
      if (googleLogo) googleLogo.style.left = '8px';
      if (zoomButtons) zoomButtons.style.left = '8px';
      if (legendPanel) legendPanel.style.left = '8px';
      btnCollapse.textContent = 'ขยาย';
    } else {
      leftSidebarBody.classList.remove('hidden');
      sidebarContent.style.background = '';
      sidebarContent.style.boxShadow = '';
      titleBlock.style.background = '';
      titleBlock.style.borderBottom = '';
      if (googleLogo) googleLogo.style.left = '333px';
      if (zoomButtons) zoomButtons.style.left = '341px';
      if (legendPanel) legendPanel.style.left = '333px';
      btnCollapse.textContent = 'ย่อ';
    }
  });

  // Section collapse toggles
  document.querySelectorAll('.sec-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isCollapsed = target.classList.contains('hidden');
      target.classList.toggle('hidden', !isCollapsed);
      btn.textContent = isCollapsed ? 'ย่อ' : 'ขยาย';
    });
  });

  // Cloud default button
  btnCloudDefault.addEventListener('click', () => {
    const defaultCloud = '38';
    cloudDisplay.textContent = defaultCloud + '%';
    bus.emit('cloud:auto', { value: defaultCloud });
  });

  // Date selects
  let isAutoFilling = false;
  selectStart.addEventListener('change', (e) => {
    if (!isAutoFilling) bus.emit('date:change', { which: 'start', value: e.target.value });
  });
  selectEnd.addEventListener('change', (e) => {
    if (!isAutoFilling) bus.emit('date:change', { which: 'end', value: e.target.value });
  });

  bus.on('date:change', ({ which, value }) => {
    if (!value || isAutoFilling) return;
    isAutoFilling = true;
    const idx = FAKE_DATA.presets.dates.indexOf(value);
    if (idx !== -1) {
      const cloud = FAKE_DATA.presets.cloudCovers[idx];
      if (cloud) {
        cloudDisplay.textContent = cloud + '%';
        bus.emit('cloud:auto', { value: cloud });
      }
      const otherWhich = which === 'start' ? 'end' : 'start';
      const otherSelect = otherWhich === 'start' ? selectStart : selectEnd;
      if (!otherSelect.value) {
        let otherIdx = which === 'start' ? idx + 1 : idx - 1;
        if (otherIdx >= FAKE_DATA.presets.dates.length) otherIdx = idx;
        if (otherIdx < 0) otherIdx = 0;
        const otherVal = FAKE_DATA.presets.dates[otherIdx];
        otherSelect.value = otherVal;
        setTimeout(() => bus.emit('date:change', { which: otherWhich, value: otherVal }), 0);
      }
    }
    isAutoFilling = false;
  });

  bus.on('cloud:auto', ({ value }) => {
    cloudDisplay.textContent = value + '%';
  });

  // Tool buttons
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => b.classList.remove('ring-2', 'ring-green-500', 'bg-green-50'));
      btn.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
      bus.emit('tool:select', { tool: btn.dataset.tool });
    });
  });

  // Plot checkboxes
  checkAllPlots.addEventListener('change', (e) => {
    const on = e.target.checked;
    plotChecks.forEach(chk => {
      if (chk.checked !== on) {
        chk.checked = on;
        bus.emit('plot:toggle', { id: parseInt(chk.value), on });
      }
    });
  });
  plotChecks.forEach(chk => {
    chk.addEventListener('change', (e) => {
      bus.emit('plot:toggle', { id: parseInt(e.target.value), on: e.target.checked });
      checkAllPlots.checked = Array.from(plotChecks).every(c => c.checked);
    });
  });

  // Function buttons
  funcBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.func;
      const desc = FAKE_DATA.functionDescriptions?.[key] || '';
      funcBtns.forEach(b => b.classList.remove('ring-2', 'ring-green-500', 'bg-green-50'));
      btn.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
      bus.emit('func:select', { key, group: '', desc });
    });
  });

  // Process / Cancel
  btnProcess.addEventListener('click', () => bus.emit('process:start', {}));
  btnCancel.addEventListener('click', () => bus.emit('process:cancel', {}));

  // Disable during processing
  bus.on('state:change', ({ state }) => {
    if (state === AppState.PROCESSING) {
      leftSidebarBody.classList.add('opacity-50', 'pointer-events-none');
    } else {
      leftSidebarBody.classList.remove('opacity-50', 'pointer-events-none');
    }
  });
}
