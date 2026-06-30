import { bus, store, AppState } from '../state.js';

let isCollapsed = false;

export function initBakaId() {
  const container = document.getElementById('panel-bakaId');
  if (!container) return;

  container.innerHTML = `
    <div class="flex flex-col pointer-events-auto" style="width: 320px;">
    <div class="bg-white shadow-md overflow-hidden border border-gray-200">
      <!-- Header -->
      <div class="px-2 py-1.5 bg-white border-b border-gray-200">
        <span class="text-xs font-bold text-gray-800">BAKA ID</span>
      </div>

      <!-- Body -->
      <div id="bakaId-body" class="bg-gray-100 px-2 pt-2 pb-1">
        <form id="bakaId-search-form" class="flex gap-1 mb-2">
          <input id="bakaId-search-input" type="text" placeholder="@BAKA ID หรือค้นหาสถานที่"
            class="flex-1 border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500">
          <button type="submit" id="bakaId-search-btn"
            class="bg-white border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-50 flex items-center gap-1">
            <span id="bakaId-search-icon">🔍</span>
            <div id="bakaId-spinner" class="hidden w-3 h-3 border-2 border-gray-400 border-t-green-600 rounded-full animate-spin"></div>
            ค้นหา
          </button>
        </form>

        <div class="text-xs text-gray-500 mb-1">ประวัติการค้นหา</div>
        <ul id="bakaId-history-list" class="max-h-40 overflow-y-auto bg-white border border-gray-200 rounded"></ul>

        <div class="flex justify-end mt-2">
          <button id="bakaId-collapse-btn" class="text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200 bg-white">ย่อ</button>
        </div>
      </div>
    </div>

    <!-- Zoom buttons -->
    <div class="flex flex-col shadow-md border border-gray-200 overflow-hidden bg-white" style="margin-top: 16px; width: fit-content;">
      <button id="zoom-in" class="w-8 h-8 text-xl font-light text-gray-700 hover:bg-gray-100 border-b border-gray-200 flex items-center justify-center">+</button>
      <button id="zoom-out" class="w-8 h-8 text-xl font-light text-gray-700 hover:bg-gray-100 flex items-center justify-center">−</button>
    </div>

    </div>
  `;

  const collapseBtn = document.getElementById('bakaId-collapse-btn');
  const bodyDiv = document.getElementById('bakaId-body');
  const searchForm = document.getElementById('bakaId-search-form');
  const searchInput = document.getElementById('bakaId-search-input');
  const searchIcon = document.getElementById('bakaId-search-icon');
  const spinner = document.getElementById('bakaId-spinner');
  const historyList = document.getElementById('bakaId-history-list');

  renderHistory(historyList);

  collapseBtn.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      bodyDiv.classList.add('hidden');
      collapseBtn.textContent = 'ขยาย';
    } else {
      bodyDiv.classList.remove('hidden');
      collapseBtn.textContent = 'ย่อ';
    }
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchIcon.classList.add('hidden');
    spinner.classList.remove('hidden');
    searchInput.disabled = true;

    setTimeout(() => {
      searchIcon.classList.remove('hidden');
      spinner.classList.add('hidden');
      searchInput.disabled = false;
      searchInput.value = '';
      
      bus.emit('search:submit', { query });
    }, 1000);
  });

  bus.on('search:submit', () => {
    renderHistory(historyList);
  });

  bus.on('state:change', ({ state }) => {
    if (state === AppState.PROCESSED) {
      container.classList.add('hidden');
    } else {
      container.classList.remove('hidden');
    }
  });
}

function renderHistory(containerEl) {
  containerEl.innerHTML = '';
  store.searchHistory.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'py-2 px-2 border-b border-gray-100 text-sm cursor-pointer transition-colors hover:bg-gray-50';
    li.textContent = item;
    
    li.addEventListener('click', () => {
      li.classList.add('bg-green-100');
      li.classList.remove('hover:bg-gray-50');
      setTimeout(() => {
        li.classList.remove('bg-green-100');
        li.classList.add('hover:bg-gray-50');
      }, 1000);
    });
    
    containerEl.appendChild(li);
  });
}
