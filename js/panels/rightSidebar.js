import { FAKE_DATA } from '../data.js';
import { bus, store, AppState } from '../state.js';

export function initRightSidebar() {
  const container = document.getElementById('panel-rightSidebar');
  if (!container) return;

  // Render initial UI Structure
  renderSidebar(container);

  // Store references to the cards
  const plotCards = {
    1: container.querySelector('#plot-card-1'),
    2: container.querySelector('#plot-card-2'),
    3: container.querySelector('#plot-card-3'),
  };

  // Initialize charts after canvas elements are in DOM
  initCharts(container);
  
  // Setup interactive behaviors (collapse & expand chart)
  setupInteractions(container);

  // Contract 1: Listen to state:change to show/hide the whole panel
  bus.on('state:change', ({ state }) => {
    if (state === AppState.PROCESSED) {
      container.classList.remove('hidden');
      updatePlotVisibility(plotCards);
    } else {
      container.classList.add('hidden');
    }
  });

  // Contract 2: Listen to plot:toggle to show/hide individual plot cards
  bus.on('plot:toggle', ({ id, on }) => {
    if (store.currentState === AppState.PROCESSED) {
      updatePlotVisibility(plotCards);
    }
  });

  // Initial visibility check in case state is already PROCESSED
  if (store.currentState === AppState.PROCESSED) {
    container.classList.remove('hidden');
    updatePlotVisibility(plotCards);
  } else {
    container.classList.add('hidden');
  }
}

function updatePlotVisibility(cards) {
  Object.keys(cards).forEach(id => {
    const card = cards[id];
    if (card) {
      if (store.selectedPlots[id]) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    }
  });
}

function renderSidebar(container) {
  // Ensure the container itself acts as a side panel.
  // Tailwind classes added to style it.
  container.className = 'w-96 bg-white border-l shadow-xl flex flex-col h-full hidden transition-transform duration-300 relative z-20';
  
  let html = `
    <!-- Top Tabs and Checkboxes (Visual Only) -->
    <div class="p-4 border-b">
      <div class="flex space-x-2 mb-4">
        <button class="flex-1 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition shadow-sm">หนังสือ</button>
        <button class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md font-bold hover:bg-gray-200 transition shadow-sm">ค่าดาวเทียมเทียม</button>
      </div>
      <div class="flex items-center space-x-4 text-sm text-gray-600">
        <label class="flex items-center space-x-1 cursor-pointer group">
          <input type="checkbox" class="form-checkbox h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500">
          <span class="group-hover:text-green-700">ค้าพล</span>
        </label>
        <label class="flex items-center space-x-1 cursor-pointer group">
          <input type="checkbox" class="form-checkbox h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500">
          <span class="group-hover:text-green-700">ค้าพยิ่ง</span>
        </label>
      </div>
    </div>
    
    <!-- Scrollable list of plot cards -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-300">
  `;

  // Plot Cards using FAKE_DATA
  Object.keys(FAKE_DATA.plots).forEach(id => {
    const plot = FAKE_DATA.plots[id];
    html += `
      <div id="plot-card-${id}" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hidden transition-all duration-300 hover:shadow-md">
        <!-- Card Header with Toggle -->
        <div class="bg-green-50/80 px-4 py-3 border-b border-green-100 flex justify-between items-center cursor-pointer toggle-collapse group" data-id="${id}">
          <h3 class="font-bold text-green-800 group-hover:text-green-900">แปลง ${id}</h3>
          <span class="text-xs font-medium text-green-600 px-2 py-1 bg-green-100 rounded-full group-hover:bg-green-200 transition toggle-text">[ย่อ]</span>
        </div>
        
        <!-- Card Content -->
        <div class="p-4 collapse-content">
          <p class="text-sm text-gray-600 whitespace-pre-line mb-5 leading-relaxed bg-gray-50 p-3 rounded-lg">${plot.stats}</p>
    `;

    // Histogram Chart
    if (plot.histogramData) {
      html += `
          <div class="mb-6 relative group/chart bg-white p-2 rounded-lg border border-gray-50">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">ฮิสโตแกรม</h4>
              <button class="p-1.5 bg-gray-50 hover:bg-green-50 rounded-md shadow-sm text-gray-400 hover:text-green-600 expand-chart-btn opacity-0 group-hover/chart:opacity-100 transition-opacity" data-type="histogram" data-id="${id}" title="ขยายกราฟ">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              </button>
            </div>
            <div class="h-40 relative">
              <canvas id="chart-hist-${id}"></canvas>
            </div>
          </div>
      `;
    }
    
    // Line Chart
    if (plot.lineData) {
      html += `
          <div class="mb-6 relative group/chart bg-white p-2 rounded-lg border border-gray-50">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">แนวโน้ม</h4>
              <button class="p-1.5 bg-gray-50 hover:bg-green-50 rounded-md shadow-sm text-gray-400 hover:text-green-600 expand-chart-btn opacity-0 group-hover/chart:opacity-100 transition-opacity" data-type="line" data-id="${id}" title="ขยายกราฟ">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              </button>
            </div>
            <div class="h-40 relative">
              <canvas id="chart-line-${id}"></canvas>
            </div>
          </div>
      `;
    }
    
    // Doughnut Chart
    if (plot.doughnutData) {
      html += `
          <div class="mb-2 relative group/chart bg-white p-2 rounded-lg border border-gray-50">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">สัดส่วน</h4>
              <button class="p-1.5 bg-gray-50 hover:bg-green-50 rounded-md shadow-sm text-gray-400 hover:text-green-600 expand-chart-btn opacity-0 group-hover/chart:opacity-100 transition-opacity" data-type="doughnut" data-id="${id}" title="ขยายกราฟ">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              </button>
            </div>
            <div class="h-40 flex justify-center relative">
              <canvas id="chart-doughnut-${id}"></canvas>
            </div>
          </div>
      `;
    }

    html += `
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function initCharts(container) {
  // Ensure Chart.js is loaded
  if (!window.Chart) {
    console.warn('Chart.js is not loaded globally. Canvas will be empty.');
    return;
  }
  
  // Set default global styling for charts
  Chart.defaults.font.family = "'Inter', 'Sarabun', sans-serif";
  Chart.defaults.color = '#64748b'; // text-slate-500

  Object.keys(FAKE_DATA.plots).forEach(id => {
    const plot = FAKE_DATA.plots[id];
    
    if (plot.histogramData) {
      const ctx = document.getElementById(`chart-hist-${id}`);
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: plot.histogramData.labels,
            datasets: [
              {
                label: 'Dataset 1',
                data: plot.histogramData.dataset1,
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderRadius: 4
              },
              {
                label: 'Dataset 2',
                data: plot.histogramData.dataset2,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 10,
                cornerRadius: 8
              }
            },
            scales: {
              y: { 
                beginAtZero: true, 
                ticks: { stepSize: 1 },
                grid: { borderDash: [4, 4], color: '#f1f5f9' },
                border: { display: false }
              },
              x: {
                grid: { display: false },
                border: { display: false }
              }
            }
          }
        });
      }
    }

    if (plot.lineData) {
      const ctx = document.getElementById(`chart-line-${id}`);
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: plot.lineData.labels,
            datasets: [
              {
                label: 'Trend',
                data: plot.lineData.values,
                borderColor: '#eab308', // yellow-500
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#eab308',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 10,
                cornerRadius: 8
              }
            },
            scales: {
              y: {
                grid: { borderDash: [4, 4], color: '#f1f5f9' },
                border: { display: false }
              },
              x: {
                grid: { display: false },
                border: { display: false },
                ticks: { maxTicksLimit: 5 } // prevent clutter
              }
            }
          }
        });
      }
    }

    if (plot.doughnutData) {
      const ctx = document.getElementById(`chart-doughnut-${id}`);
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: plot.doughnutData.labels,
            datasets: [{
              data: plot.doughnutData.values,
              backgroundColor: [
                '#22c55e', // green-500
                '#cbd5e1'  // slate-300
              ],
              borderWidth: 0,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: { 
                position: 'right', 
                labels: { 
                  usePointStyle: true,
                  boxWidth: 8,
                  padding: 15,
                  font: { size: 11 }
                } 
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 10,
                cornerRadius: 8
              }
            }
          }
        });
      }
    }
  });
}

function setupInteractions(container) {
  // Setup Collapse/Expand toggle for cards
  const toggles = container.querySelectorAll('.toggle-collapse');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const id = toggle.getAttribute('data-id');
      const card = document.getElementById(`plot-card-${id}`);
      const content = card.querySelector('.collapse-content');
      const text = toggle.querySelector('.toggle-text');
      
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        text.textContent = '[ย่อ]';
      } else {
        content.classList.add('hidden');
        text.textContent = '[ขยาย]';
      }
    });
  });

  // Contract 3: Emit chart:expand when a chart's ⤢ icon is clicked
  const expandBtns = container.querySelectorAll('.expand-chart-btn');
  expandBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card collapse if nested
      
      const type = btn.getAttribute('data-type');
      const id = btn.getAttribute('data-id');
      const plot = FAKE_DATA.plots[id];
      
      let config = {};
      
      // Build a fresh chart config for the expanded view
      if (type === 'histogram') {
        config = {
          type: 'bar',
          data: {
            labels: plot.histogramData.labels,
            datasets: [
              { label: 'Dataset 1', data: plot.histogramData.dataset1, backgroundColor: 'rgba(34, 197, 94, 0.8)', borderRadius: 4 },
              { label: 'Dataset 2', data: plot.histogramData.dataset2, backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 4 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
          }
        };
      } else if (type === 'line') {
        config = {
          type: 'line',
          data: {
            labels: plot.lineData.labels,
            datasets: [{ 
              label: 'Trend', 
              data: plot.lineData.values, 
              borderColor: '#eab308', 
              backgroundColor: 'rgba(234, 179, 8, 0.1)', 
              fill: true, 
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#eab308'
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        };
      } else if (type === 'doughnut') {
        config = {
          type: 'doughnut',
          data: {
            labels: plot.doughnutData.labels,
            datasets: [{ data: plot.doughnutData.values, backgroundColor: ['#22c55e', '#cbd5e1'], borderWidth: 0 }]
          },
          options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }
        };
      }
      
      bus.emit('chart:expand', { 
        chartId: `${type}-${id}`, 
        config 
      });
    });
  });
}
