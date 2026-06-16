import { bus, store, AppState } from '../state.js';

export function initLegend() {
    const container = document.getElementById('panel-legend');
    if (!container) return;

    // Render the static structure of the legend
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-4 w-32 border border-gray-100">
            <h3 class="text-sm font-semibold text-gray-800 mb-4 text-center">มาตรวัดค่าดัชนี</h3>
            <div class="flex items-center justify-center h-48 py-2">
                <div class="w-4 h-full rounded-full bg-gradient-to-t from-red-500 via-yellow-400 to-green-500 mr-3"></div>
                <div class="flex flex-col justify-between h-full text-xs font-medium text-gray-600">
                    <span>0.7</span>
                    <span>0.6</span>
                    <span>0.5</span>
                    <span>0.4</span>
                    <span>0.3</span>
                    <span>0.2</span>
                    <span>0.1</span>
                    <span>0.0</span>
                </div>
            </div>
        </div>
    `;

    // Update visibility based on the application state
    const updateVisibility = () => {
        if (store.currentState === AppState.PROCESSED) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    };

    // Initial check
    updateVisibility();

    // Listen for state changes from the global event bus
    bus.on('state:change', () => {
        updateVisibility();
    });
}
