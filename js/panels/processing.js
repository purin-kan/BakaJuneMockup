import { bus, store, AppState } from '../state.js';

class ProcessingPanel {
  constructor() {
    this.el = document.getElementById('panel-processing');
    this.timeoutId = null;
    this.render();
    this.bindEvents();
    
    // Initial state check
    this.updateVisibility();
  }

  render() {
    this.el.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col items-center">
        <h3 class="text-lg font-medium text-gray-800 mb-4">กำลังประมวลผล...</h3>
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
          <div id="processing-bar" class="bg-green-500 h-full w-0 rounded-full"></div>
        </div>
        <button id="processing-cancel-btn" class="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          ยกเลิก
        </button>
      </div>
    `;
    
    this.progressBar = this.el.querySelector('#processing-bar');
    this.cancelBtn = this.el.querySelector('#processing-cancel-btn');
  }

  bindEvents() {
    bus.on('state:change', () => {
      this.updateVisibility();
    });

    this.cancelBtn.addEventListener('click', () => {
      bus.emit('process:cancel');
    });
  }

  updateVisibility() {
    if (store.currentState === AppState.PROCESSING) {
      // Show panel
      this.el.classList.remove('hidden');
      
      // Reset bar width without transition
      this.progressBar.style.transition = 'none';
      this.progressBar.style.width = '0%';
      
      // Trigger reflow to ensure reset is applied before animating
      void this.progressBar.offsetHeight; 
      
      // Animate bar width over 4s
      this.progressBar.style.transition = 'width 4s linear';
      this.progressBar.style.width = '100%';

      // Set complete timeout
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        if (store.currentState === AppState.PROCESSING) {
          bus.emit('process:complete');
        }
      }, 4000);

    } else {
      // Hide panel
      this.el.classList.add('hidden');
      
      // Stop animation
      this.progressBar.style.transition = 'none';
      this.progressBar.style.width = '0%';
      
      clearTimeout(this.timeoutId);
    }
  }
}

// Standard panel entry point — called once by main.js.
export function initProcessing() {
  new ProcessingPanel();
}
