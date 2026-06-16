import { bus, store, AppState } from '../state.js';
import { FAKE_DATA } from '../data.js';

class MapOverlays {
  constructor() {
    this.svg = document.getElementById('map-overlays');
    if (!this.svg) return;

    if (!this.svg.hasAttribute('viewBox')) {
        this.svg.setAttribute('viewBox', '0 0 100 100');
    }
    
    // Ensure the SVG covers its container
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';
    this.svg.style.position = 'absolute';
    this.svg.style.top = '0';
    this.svg.style.left = '0';
    this.svg.style.zIndex = '10';
    
    this.polygons = {};
    this.labels = {};

    this.renderInitialPolygons();
    this.setupListeners();
  }

  renderInitialPolygons() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.id = 'heatmap-gradient';
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '0%');
    linearGradient.setAttribute('x2', '100%');
    linearGradient.setAttribute('y2', '100%');
    
    linearGradient.innerHTML = `
      <stop offset="0%" stop-color="rgba(239, 68, 68, 0.7)"/>
      <stop offset="50%" stop-color="rgba(234, 179, 8, 0.7)"/>
      <stop offset="100%" stop-color="rgba(34, 197, 94, 0.7)"/>
    `;
    defs.appendChild(linearGradient);
    this.svg.appendChild(defs);

    this.plotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.plotGroup);

    this.autoGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.autoGroup);

    this.blueMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.blueMarker.setAttribute('cx', '50');
    this.blueMarker.setAttribute('cy', '50');
    this.blueMarker.setAttribute('r', '2');
    this.blueMarker.setAttribute('fill', '#3b82f6');
    this.blueMarker.setAttribute('stroke', '#ffffff');
    this.blueMarker.setAttribute('stroke-width', '0.5');
    this.blueMarker.style.display = store.mapLayers && store.mapLayers['ที่ราดฉัน'] ? 'block' : 'none';
    this.svg.appendChild(this.blueMarker);

    Object.entries(FAKE_DATA.polygons).forEach(([id, points]) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', points);
      polygon.setAttribute('fill', 'rgba(34, 197, 94, 0.4)');
      polygon.setAttribute('stroke', '#22c55e');
      polygon.setAttribute('stroke-width', '0.5');
      // Plots only render once processed (Home map stays clean even if plots are pre-selected).
      polygon.style.display = (store.currentState === AppState.PROCESSED && store.selectedPlots && store.selectedPlots[id]) ? 'block' : 'none';

      const pts = points.split(' ').map(p => p.split(',').map(Number));
      const cx = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
      const cy = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', cx);
      label.setAttribute('y', cy);
      label.setAttribute('fill', 'white');
      label.setAttribute('font-size', '3');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.style.pointerEvents = 'none';
      label.textContent = id;
      label.style.display = store.mapLayers && store.mapLayers['ป้ายชื่อ'] ? 'block' : 'none';

      g.appendChild(polygon);
      g.appendChild(label);
      this.plotGroup.appendChild(g);

      this.polygons[id] = polygon;
      this.labels[id] = label;
    });
  }

  setupListeners() {
    bus.on('plot:toggle', ({ id, on }) => {
      if (this.polygons[id]) {
        // Reflect the toggle on the map only while results are shown.
        this.polygons[id].style.display = (store.currentState === AppState.PROCESSED && on) ? 'block' : 'none';
      }
    });

    bus.on('maplayer:toggle', ({ layer, on }) => {
      if (layer === 'ป้ายชื่อ') {
        Object.values(this.labels).forEach(label => {
          label.style.display = on ? 'block' : 'none';
        });
      }
      if (layer === 'ที่ราดฉัน' && this.blueMarker) {
        this.blueMarker.style.display = on ? 'block' : 'none';
      }
    });

    bus.on('state:change', ({ state }) => {
      Object.entries(this.polygons).forEach(([id, poly]) => {
        const show = state === AppState.PROCESSED && store.selectedPlots[id];
        poly.style.display = show ? 'block' : 'none';
        if (show) {
          poly.setAttribute('fill', 'url(#heatmap-gradient)');
          poly.setAttribute('stroke', '#ffffff');
        } else {
          poly.setAttribute('fill', 'rgba(34, 197, 94, 0.4)');
          poly.setAttribute('stroke', '#22c55e');
        }
      });
    });

    this.svg.addEventListener('click', (e) => {
      if (store.activeTool === 'วาดอัตโนมัติ') {
        const rect = this.svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const pts = FAKE_DATA.autoPolygonShape.split(' ').map(p => p.split(',').map(Number));
        const cx = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
        const cy = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
        
        const dx = x - cx;
        const dy = y - cy;
        
        const shiftedPoints = pts.map(p => `${(p[0] + dx).toFixed(2)},${(p[1] + dy).toFixed(2)}`).join(' ');
        
        const newPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        newPoly.setAttribute('points', shiftedPoints);
        newPoly.setAttribute('fill', 'rgba(34, 197, 94, 0.4)');
        newPoly.setAttribute('stroke', '#22c55e');
        newPoly.setAttribute('stroke-width', '0.5');
        
        this.autoGroup.appendChild(newPoly);
      }
    });
  }
}

let mapOverlaysInstance = null;
export function initMapOverlays() {
  // Idempotent: only ever create one instance (main.js is the sole initializer).
  if (mapOverlaysInstance) return mapOverlaysInstance;
  if (document.getElementById('map-overlays')) {
    mapOverlaysInstance = new MapOverlays();
  }
  return mapOverlaysInstance;
}
