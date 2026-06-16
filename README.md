# BAKA Index — Interactive Mockup

A fully interactive, front-end-only mockup of the BAKA Index sugarcane remote-sensing app.
All data and calculations are fake/hardcoded — this is a clickable prototype, not a real app.

## How to run

This app uses ES modules (`<script type="module">`), so it **must be served over HTTP** —
opening `index.html` directly via `file://` (double-clicking) will fail with a CORS error and a
blank page. Start a tiny local server from the project root, then open the printed URL:

**Python (any OS with Python 3):**
```
python -m http.server 8000
```
then open http://localhost:8000

**Node (if you have it):**
```
npx serve .
```

**VS Code:** install the "Live Server" extension, right-click `index.html` → "Open with Live Server".

## Using the mockup

- The full workflow: pick plots / set conditions in the left panel → click **กลับไปที่แปลง** to
  process → watch the progress bar → the results (map overlays, legend, right-sidebar charts,
  analysis panel) appear automatically.
- A **dev toolbar** at the bottom-center lets you jump straight to any state:
  `Home` / `All Hide` / `Processing` / `Processed` for quick demos.

## Project structure

```
index.html              app shell + panel mount points
assets/satellite.png    static map background (satellite/aerial image)
css/                    tokens.css (design tokens) + base.css (layout/components)
js/state.js             state machine + event bus + app store
js/data.js              all hardcoded fake data
js/main.js              entry point; wires panels, toasts, chart modal
js/panels/*.js          one file per floating panel
js/map/overlays.js      SVG plot polygons + index heatmap
js/devToolbar.js        dev-only state switcher
```
