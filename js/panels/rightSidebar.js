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

  const mapMode = document.getElementById('panel-mapMode');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const userManual = document.getElementById('panel-userManual');
  const SIDEBAR_W = 325;

  function shiftRight(toProcessed) {
    const r = toProcessed ? `${SIDEBAR_W + 16}px` : '16px';
    if (mapMode) mapMode.style.right = r;
    if (btnFullscreen) btnFullscreen.style.right = r;
    if (userManual) userManual.style.right = r;
  }

  // Contract 1: Listen to state:change to show/hide the whole panel
  bus.on('state:change', ({ state }) => {
    if (state === AppState.PROCESSED) {
      container.classList.remove('hidden');
      updatePlotVisibility(plotCards);
      shiftRight(true);
    } else {
      container.classList.add('hidden');
      shiftRight(false);
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

const EXPAND_ICON = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`;

function renderSidebar(container) {
  container.style.width = '325px';
  container.style.height = 'calc(100vh - 70px)';

  let html = `<div class="flex flex-col h-full overflow-y-auto bg-white">`;

  Object.keys(FAKE_DATA.plots).forEach(id => {
    const plot = FAKE_DATA.plots[id];
    html += `
      <div id="plot-card-${id}" class="hidden border-b border-gray-200">
        <!-- Card header -->
        <div class="px-3 py-2 bg-white flex justify-between items-center">
          <span class="font-bold text-sm text-gray-800">แปลง ${id}</span>
        </div>
        <!-- Card body -->
        <div id="plot-body-${id}" class="px-3 pb-2">
          <p class="text-xs text-gray-700 mb-2 leading-relaxed">${plot.stats}</p>
    `;

    if (plot.histogramData) {
      html += `
          <div class="mb-2 border border-gray-200 rounded overflow-hidden bg-white">
            <div class="flex justify-between items-center px-2 pt-1.5 pb-0">
              <span class="text-xs text-gray-500">Compare histograms by BAKA Index</span>
              <button class="expand-chart-btn text-gray-400 hover:text-gray-700 p-0.5" data-type="histogram" data-id="${id}">${EXPAND_ICON}</button>
            </div>
            <div class="h-24 px-1 pb-1"><canvas id="chart-hist-${id}"></canvas></div>
          </div>
      `;
    }

    if (plot.lineData) {
      html += `
          <div class="mb-2 border border-gray-200 rounded overflow-hidden bg-white">
            <div class="flex justify-between items-center px-2 pt-1.5 pb-0">
              <span class="text-xs text-gray-500">BAKA Index: Sugarcane Growth</span>
              <button class="expand-chart-btn text-gray-400 hover:text-gray-700 p-0.5" data-type="line" data-id="${id}">${EXPAND_ICON}</button>
            </div>
            <div class="h-24 px-1 pb-1"><canvas id="chart-line-${id}"></canvas></div>
          </div>
      `;
    }

    if (plot.doughnutData) {
      html += `
          <div class="mb-2 border border-gray-200 rounded overflow-hidden bg-white">
            <div class="flex justify-between items-center px-2 pt-1.5 pb-0">
              <span class="text-xs text-gray-500">สัดส่วน BAKA Index</span>
              <button class="expand-chart-btn text-gray-400 hover:text-gray-700 p-0.5" data-type="doughnut" data-id="${id}">${EXPAND_ICON}</button>
            </div>
            <div class="h-24 px-1 pb-1"><canvas id="chart-doughnut-${id}"></canvas></div>
          </div>
      `;
    }

    html += `
          <div class="flex justify-end mt-1 mb-1">
            <button class="card-toggle text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-100 bg-white" data-id="${id}">ย่อ</button>
          </div>
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
