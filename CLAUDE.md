# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive front-end **mockup** of the "BAKA Index" sugarcane remote-sensing app (a Google
Earth Engine app). It is a clickable prototype: the full UI and workflow are real, but **all data and
calculations are fake/hardcoded**. There is no backend, no real map, and no remote sensing. The UI is
in Thai. The app is single-screen — a full-viewport map with floating, collapsible panels on top.

## Running & checking

There is **no build step, no package.json, no test framework, and no linter.** It is plain HTML/CSS/JS.

- **Run:** the app uses ES modules (`<script type="module">`), so it MUST be served over HTTP —
  opening `index.html` via `file://` fails with a CORS error and a blank page.
  From the project root: `python -m http.server 8000` then open `http://localhost:8000`
  (or `npx serve .`, or VS Code Live Server).
- **Syntax-check JS:** `node --check js/<file>.js` (loops over files in bash). This is the only
  automated verification available — use it after edits since there are no tests.
- **Manual verification:** use the dev toolbar (bottom-center: `Home` / `All Hide` / `Processing` /
  `Processed`) to jump between states, and walk the flow: select plots → click **กลับไปที่แปลง** →
  Processing (~4s bar) → Processed.

## Architecture

The whole app is wired through a **central event bus + shared store** in `js/state.js`. Everything
else is decoupled panel modules that never talk to each other directly.

- `js/state.js` — defines `bus` (pub/sub `on`/`emit`), the `store` (current state, selected plots,
  active tool/function, dates, cloud, **map mode (persisted across processing)**, map layers, search
  history), `AppState` (`home`/`processing`/`processed`), and `setState()`. It also owns the state
  machine: the `process:start` → `process:complete` transitions and the store mutations for most events.
- `js/data.js` — a barrel that re-assembles `FAKE_DATA` from per-panel slices in `js/data/*.data.js`
  (split by owner so people don't collide editing data). Panels read from `FAKE_DATA`; they never
  compute anything. `js/data/plots.data.js` is shared by `rightSidebar` and `map/overlays`.
- `js/main.js` — entry point. Imports every panel, initializes them, wires the global toast renderer
  and the chart fullscreen modal, then calls `setState(AppState.HOME)`.
- `js/panels/*.js` — one floating panel each. `js/map/overlays.js` draws the SVG plot polygons +
  index heatmap. `js/devToolbar.js` is the dev-only state switcher.

### Panel module contract (follow this for any new/edited panel)

- A panel renders its own DOM into a single mount point (`<div id="panel-<name>">` in `index.html`)
  and reads data only from `js/data.js`.
- Panels communicate **only** through the `bus`. A panel never imports another panel, and never edits
  `index.html`, `state.js`, or another panel's file. If you need a new cross-panel signal, add the
  event to `state.js` rather than reaching into another module.
- Key events: `state:change`, `plot:toggle`, `tool:select`, `func:select`, `date:change`,
  `cloud:auto`, `process:start|cancel|complete`, `mapmode:change`, `maplayer:toggle`, `search:submit`,
  `toast`, `chart:expand`.

### One initialization pattern (standardized)

Every panel/module exports a single `init<Name>()` and does **no** work at import time.
`js/main.js` imports each and calls it once inside its `DOMContentLoaded` handler. To add a panel:
create its mount `<div>` in `index.html`, export an `init`, then add the import + call to `main.js`
(append-only). Never run rendering at module top level — that historically caused double-init bugs.

### State-driven visibility

`AppState` drives the UI via **progressive disclosure**: panels show/hide themselves by toggling
Tailwind's `hidden` class inside their own `state:change` listeners (results/legend/analysis appear
only in `processed`). Map polygons are additionally gated on the `processed` state, so plots can be
pre-selected in the sidebar while the Home map stays clean. Avoid setting inline `display` on panels
except in the dev toolbar's "All Hide" (which intentionally overrides, then restores `display:''`).

## Styling

Tailwind CSS via CDN (configured inline in `index.html`), Chart.js via CDN, Inter via Google Fonts.
Panels are styled mostly with inline Tailwind classes in their own JS. Custom CSS: `css/tokens.css`
(design tokens), `css/base.css` (shared resets/components + the per-panel `@import` list), and one
`css/panels/<name>.css` per panel. Green accent `#2d7a3a`, teal `#0ea5e9`.

## Multi-developer setup

The repo is structured for one owner per panel. Ownership and the protocol for the few shared files
(`main.js`, `state.js`, `index.html`, `data.js`, `base.css`) are documented in `CONTRIBUTING.md`, with
`.github/CODEOWNERS` mapping files to owners. When editing, stay within a panel's own
JS/data/CSS trio; cross-panel communication goes through the `bus` in `state.js`, never direct imports.

## Spec & references

The authoritative spec and design sources live in `reference_materials/`:
- `BUILD_PROMPT.md` — the full build specification (panels, behaviors, event contract, workflow).
- `Baka Index UX_UI Improvement Project.md`/`.pdf` — the UX/UI report; authoritative for **behavior**.
- `Designs/` and `Figma Excess/` — reference screenshots; authoritative for **layout, colors, and
  exact Thai labels**. Where this codebase's Thai strings look garbled, they are best-guess
  transcriptions — verify against these images (or a native speaker) rather than inventing text.
