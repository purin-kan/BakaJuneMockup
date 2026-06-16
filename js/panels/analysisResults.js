import { bus, store, AppState } from '../state.js';
import { FAKE_DATA } from '../data.js';

export function initAnalysisResults() {
  const panel = document.getElementById('panel-analysisResults');
  if (!panel) return;

  // Render initial structure
  panel.innerHTML = `
    <div class="bg-white/95 backdrop-blur shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-xl flex flex-col pointer-events-auto border border-gray-100 transition-all duration-300 w-80 max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50/50">
        <div class="flex space-x-1">
          <button id="tab-book" class="px-3 py-1.5 bg-[#10b981] text-white rounded-lg text-sm font-medium shadow-sm transition-colors">หนังสือ</button>
          <button id="tab-sat" class="px-3 py-1.5 bg-transparent text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">ค่าดาวเทียมเทียม</button>
        </div>
        <button id="btn-minimize-analysis" class="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors" title="ย่อ">
          <svg class="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      <!-- Content Area -->
      <div id="analysis-content-area" class="transition-all duration-300">
        <!-- หนังสือ Tab -->
        <div id="content-book" class="p-4">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ส่งออกข้อมูล</label>
              <div class="relative">
                <select id="export-dropdown" class="w-full appearance-none p-2.5 pr-8 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981] cursor-pointer shadow-sm transition-all">
                  <option value="" disabled selected hidden>ประเภทส่งออก ▼</option>
                  <option value=".PNG">ส่งออกเป็น .PNG</option>
                  <option value=".SVG">ส่งออกเป็น .SVG</option>
                  <option value=".CSV">ส่งออกเป็น .CSV</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div class="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs flex gap-2">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>เลือกประเภทไฟล์ที่ต้องการส่งออกเพื่อดาวน์โหลดข้อมูลการวิเคราะห์</span>
            </div>
          </div>
        </div>
        
        <!-- ค่าดาวเทียมเทียม Tab -->
        <div id="content-sat" class="p-0 hidden max-h-[60vh] overflow-y-auto custom-scrollbar">
          <table class="w-full text-sm text-left">
            <tbody>
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 px-4 text-gray-500 w-1/2">วันที่ใช้</td>
                <td class="py-3 px-4 font-medium text-gray-800">${FAKE_DATA.analysisMetrics.dateUsed}</td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors bg-gray-50/30">
                <td class="py-3 px-4 text-gray-500">จำนวนภาพ</td>
                <td class="py-3 px-4 font-medium text-gray-800">${FAKE_DATA.analysisMetrics.totalImages}</td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 px-4 text-gray-500">ค่าส่งกลับ (2 แรก)</td>
                <td class="py-3 px-4 font-medium text-[#10b981]">${FAKE_DATA.analysisMetrics.returnValFirstTwo}</td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors bg-gray-50/30">
                <td class="py-3 px-4 text-gray-500">ค่าส่งกลับ (ล่าสุด)</td>
                <td class="py-3 px-4 font-medium text-[#10b981]">${FAKE_DATA.analysisMetrics.returnValLatest}</td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 px-4 text-gray-500">ค่าส่งกลับ (แรกถึงท้าย)</td>
                <td class="py-3 px-4 font-medium text-[#10b981]">${FAKE_DATA.analysisMetrics.returnValFirstToLast}</td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors bg-gray-50/30">
                <td class="py-3 px-4 text-gray-500">อ้อยสด</td>
                <td class="py-3 px-4 font-medium text-blue-600">${FAKE_DATA.analysisMetrics.freshCane}</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="py-3 px-4 text-gray-500 rounded-bl-xl">ดาวเทียม</td>
                <td class="py-3 px-4 font-medium text-gray-800 rounded-br-xl">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    ${FAKE_DATA.analysisMetrics.satelliteInfo}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <style>
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 20px;
      }
    </style>
  `;

  const tabBook = document.getElementById('tab-book');
  const tabSat = document.getElementById('tab-sat');
  const contentBook = document.getElementById('content-book');
  const contentSat = document.getElementById('content-sat');
  const btnMinimize = document.getElementById('btn-minimize-analysis');
  const contentArea = document.getElementById('analysis-content-area');
  const minimizeIcon = btnMinimize.querySelector('svg');
  const exportDropdown = document.getElementById('export-dropdown');

  let isMinimized = false;
  let activeTab = 'book'; // 'book' or 'sat'

  // Tab switching logic
  function switchTab(tab) {
    activeTab = tab;
    if (tab === 'book') {
      tabBook.className = 'px-3 py-1.5 bg-[#10b981] text-white rounded-lg text-sm font-medium shadow-sm transition-colors';
      tabSat.className = 'px-3 py-1.5 bg-transparent text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors';
      contentBook.classList.remove('hidden');
      contentSat.classList.add('hidden');
    } else {
      tabSat.className = 'px-3 py-1.5 bg-[#10b981] text-white rounded-lg text-sm font-medium shadow-sm transition-colors';
      tabBook.className = 'px-3 py-1.5 bg-transparent text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors';
      contentSat.classList.remove('hidden');
      contentBook.classList.add('hidden');
    }
    
    // If minimized and user clicks a tab, expand it automatically
    if (isMinimized) {
      toggleMinimize();
    }
  }

  tabBook.addEventListener('click', () => switchTab('book'));
  tabSat.addEventListener('click', () => switchTab('sat'));

  // Minimize logic
  function toggleMinimize() {
    isMinimized = !isMinimized;
    if (isMinimized) {
      contentArea.style.height = '0px';
      contentArea.style.opacity = '0';
      contentArea.style.overflow = 'hidden';
      minimizeIcon.classList.add('rotate-180');
    } else {
      contentArea.style.height = 'auto'; // Will just let it naturally expand due to hidden classes
      contentArea.style.opacity = '1';
      contentArea.style.overflow = 'visible';
      minimizeIcon.classList.remove('rotate-180');
    }
  }

  btnMinimize.addEventListener('click', toggleMinimize);

  // Export dropdown logic
  exportDropdown.addEventListener('change', (e) => {
    const type = e.target.value;
    if (type) {
      bus.emit('toast', { message: `กำลังส่งออก ${type}...`, ms: 3000 });
      // Reset dropdown selection after a short delay
      setTimeout(() => {
        e.target.value = '';
      }, 300);
    }
  });

  // State Management
  function updateVisibility() {
    if (store.currentState === AppState.PROCESSED) {
      panel.classList.remove('hidden');
      // Add subtle entrance animation
      panel.classList.add('animate-fade-in-up');
    } else {
      panel.classList.add('hidden');
      panel.classList.remove('animate-fade-in-up');
    }
  }

  // Bind events
  bus.on('state:change', updateVisibility);

  // Initial setup
  updateVisibility();
}
