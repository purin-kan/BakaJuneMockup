import { bus, store, AppState } from '../state.js';

let isCollapsed = false;

export function initBakaId() {
  const container = document.getElementById('panel-bakaId');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white rounded shadow-md w-[320px] overflow-hidden flex flex-col pointer-events-auto border border-gray-200">
      <!-- Header -->
      <div class="bg-brand-green text-white px-3 py-2 flex items-center justify-between">
        <div class="font-bold text-sm">BAKA ID</div>
        <button id="bakaId-collapse-btn" class="text-white hover:bg-green-700 px-2 py-0.5 rounded text-xs transition-colors">ย่อ</button>
      </div>
      
      <!-- Body -->
      <div id="bakaId-body" class="p-3 bg-white">
        <form id="bakaId-search-form" class="flex gap-2 mb-3">
          <input id="bakaId-search-input" type="text" placeholder="@BAKA ID หรือค้นหาสถานที่" class="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green">
          <button type="submit" id="bakaId-search-btn" class="bg-gray-100 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-200 flex items-center justify-center transition-colors min-w-[40px]">
            <span id="bakaId-search-icon">🔍</span>
            <div id="bakaId-spinner" class="hidden w-4 h-4 border-2 border-gray-400 border-t-brand-green rounded-full animate-spin"></div>
          </button>
        </form>
        
        <div class="text-xs text-gray-500 mb-1">ประวัติการค้นหา</div>
        <ul id="bakaId-history-list" class="max-h-48 overflow-y-auto border-t border-gray-200"></ul>
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
