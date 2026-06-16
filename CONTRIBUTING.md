# Contributing — working in parallel

This mockup is organized so each person can own one part of the UI (a panel) and work without
stepping on anyone else. The rule of thumb: **do all your work inside your area's files, and talk to
other panels only through the event bus.** If you find yourself editing a shared file, read the
"Shared files" section first.

## Ownership map

Each panel is a self-contained module. The owner of an area edits only these files:

| Area              | JavaScript                     | Data                                  | CSS                              |
|-------------------|--------------------------------|---------------------------------------|----------------------------------|
| Left panel        | `js/panels/leftSidebar.js`     | `js/data/leftSidebar.data.js`         | `css/panels/leftSidebar.css`     |
| BAKA ID panel     | `js/panels/bakaId.js`          | —                                     | `css/panels/bakaId.css`          |
| Map mode toggle   | `js/panels/mapMode.js`         | —                                     | `css/panels/mapMode.css`         |
| Analysis results  | `js/panels/analysisResults.js` | `js/data/analysisResults.data.js`     | `css/panels/analysisResults.css` |
| Right panel       | `js/panels/rightSidebar.js`    | `js/data/plots.data.js` (shared*)     | `css/panels/rightSidebar.css`    |
| Legend            | `js/panels/legend.js`          | —                                     | `css/panels/legend.css`          |
| Processing        | `js/panels/processing.js`      | —                                     | `css/panels/processing.css`      |
| User manual       | `js/panels/userManual.js`      | `js/data/userManual.data.js`          | `css/panels/userManual.css`      |
| Map overlays      | `js/map/overlays.js`           | `js/data/overlays.data.js` + plots*   | `css/panels/overlays.css`        |

\* `js/data/plots.data.js` is shared by the Right panel and Map overlays — see "Shared files".

## How panels talk to each other

Panels never import each other. They communicate through the **event bus** in `js/state.js`:

```js
import { bus, store, AppState } from '../state.js';

bus.emit('plot:toggle', { id: 1, on: true });   // announce something
bus.on('state:change', ({ state }) => { ... });  // react to something
```

`store` holds shared session state (current app state, selected plots, dates, map mode, etc.).
Read from it on init to render the correct starting view; mutate it by emitting events (most store
updates live in `state.js`).

## The panel contract (follow this for every panel)

- Render your DOM into your mount point: `<div id="panel-<name>">` in `index.html`.
- Read your data from `js/data/<name>.data.js` (via the `FAKE_DATA` barrel, or import your slice).
- Export a single `init<Name>()` function. Do **not** run code at import time (no self-execution) —
  `js/main.js` calls your `init` once, after the DOM is ready.
- Show/hide yourself by reacting to `state:change` (toggle Tailwind's `hidden` class). Don't set
  inline `display` on other panels.

## Shared files — coordinate before editing

These are the only files multiple people might need. Keep changes **append-only** where possible and
mention it in your PR so others can rebase:

- **`js/main.js`** — wiring. Adding a panel = one import line + one `initX()` call (append to the list).
- **`js/state.js`** — the event-bus contract + store. You may **append** a new event/store field.
  Do **not** change an existing event's name or payload shape without telling its consumers — other
  panels depend on it. Keep the event table in this file accurate.
- **`index.html`** — panel mount points. Stable; only add a `<div id="panel-...">` for a new panel.
- **`js/data.js`** — the data barrel. Only touched when adding a brand-new data module.
- **`js/data/plots.data.js`** — shared by Right panel + overlays. Editing values inside a plot is
  low-risk; renaming keys affects both consumers, so coordinate.
- **`css/base.css`** — shared resets/components and the per-panel `@import` list. Your panel styles go
  in `css/panels/<name>.css`, not here.

## Workflow

- One branch per panel/task; keep PRs small and scoped to your area.
- Run locally over HTTP (ES modules don't work from `file://`) — see `README.md`:
  `python -m http.server 8000` then open http://localhost:8000.
- Sanity-check before pushing: `node --check js/<file>.js` catches most syntax errors (but not all —
  e.g. it missed an escaped-backtick once), so also serve the app and click through your panel.
