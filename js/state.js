export const AppState = {
  HOME: 'home',
  PROCESSING: 'processing',
  PROCESSED: 'processed'
};

class EventBus {
  constructor() {
    this.listeners = {};
  }
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  emit(event, payload = {}) {
    console.log(`[EventBus] ${event}`, payload);
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }
}

export const bus = new EventBus();

export const store = {
  currentState: AppState.HOME,
  selectedPlots: { 1: true, 2: true, 3: true },
  activeTool: null,
  activeFunction: null,
  dateRange: { start: '', end: '' },
  cloudCover: '',
  mapMode: 'แผนที่', // memory persisted across processing
  mapLayers: { 'ที่ราดฉัน': false, 'ป้ายชื่อ': false },
  searchHistory: ['ค้นหาล่าสุด #1', 'ค้นหาล่าสุด #2']
};

export function setState(newState) {
  store.currentState = newState;
  bus.emit('state:change', { state: newState });
}

// State Machine transitions
bus.on('process:start', () => {
  if (store.currentState === AppState.PROCESSED) {
    if (!confirm('ล้างผลเดิมและเริ่มใหม่?')) {
      return;
    }
  }
  setState(AppState.PROCESSING);
});

bus.on('process:cancel', () => {
  setState(AppState.HOME);
});

bus.on('process:complete', () => {
  setState(AppState.PROCESSED);
});

// Update store based on events
bus.on('plot:toggle', ({ id, on }) => {
  store.selectedPlots[id] = on;
});

bus.on('tool:select', ({ tool }) => {
  store.activeTool = tool;
});

bus.on('func:select', ({ key, group, desc }) => {
  store.activeFunction = { key, group, desc };
});

bus.on('date:change', ({ which, value }) => {
  store.dateRange[which] = value;
});

bus.on('cloud:auto', ({ value }) => {
  store.cloudCover = value;
});

bus.on('mapmode:change', ({ mode }) => {
  store.mapMode = mode;
});

bus.on('maplayer:toggle', ({ layer, on }) => {
  store.mapLayers[layer] = on;
});

bus.on('search:submit', ({ query }) => {
  // Mock adding to history
  store.searchHistory.unshift(`ผลลัพธ์: ${query}`);
});
