# Build Prompt — BAKA Index Sugarcane App (Interactive Mockup)

## What you are building

An **interactive, clickable web mockup** of the "BAKA Index" sugarcane remote-sensing app
(reference: https://baka.users.earthengine.app/view/sugarcane).

The mockup must **look and behave like the real app**, but **all data and calculations are fake/hardcoded**.
There is no backend, no Google Earth Engine, no real satellite processing. The goal is a fully
interactive prototype where every button, panel, toggle, and workflow step does something
believable — so a viewer can click through the entire user journey and understand how the real app works.

The app is a **single-screen** app: a full-viewport map with many floating, hidable panels on top.

---

## Reference materials (in the project root — READ THESE FIRST)

Two authoritative sources live in the project root. Study both before building:

1. **The UX/UI report** — `Baka Index UX_UI Improvement Project.md` (and `.pdf`). This is the
   authoritative source for **how the app behaves and why** (the intended interactions, workflow,
   and feature logic of the new design). The "Design behaviors" section below distills it, but read
   the report itself for full context. It is in Thai.
2. **The reference images** — the `Designs/` and `Figma Excess/` folders. These are the authoritative
   source for **layout, colors, exact Thai labels, button order, and styling.**

The UI is in Thai; the Thai strings written inline in this document were transcribed from screenshots
and some are inexact. **Where this document disagrees with an image, follow the image; where it
disagrees with the report on behavior, follow the report.** Copy Thai text from the images/report
precisely — do not translate or paraphrase it.

### `Designs/` — the 5 target screen states (build these states exactly)
- `Designs/Home.png` — **Home** state: full layout, all main panels open over the map.
- `Designs/All Hide.png` — **All Hide** state: every panel hidden, only header + map + plot polygons.
- `Designs/Processing.png` — **Processing** state: progress card on the map center.
- `Designs/Processed.png` — **Processed** state: right sidebar with charts, legend, analysis panel.
- `Designs/Processed scroll down.png` — Processed state scrolled down (left Section 3 + manual visible).

### `Figma Excess/` — component close-ups (use for exact labels, button order, styling)
- `Figma Excess/baka version.png` — **clearest close-up of the LEFT SIDEBAR, fully expanded.**
  Authoritative for Section 1/2/3 labels and all buttons. Use this over the inline Panel 1 text.
- `Figma Excess/baka version-1.png` — left sidebar collapsed to the session block ("ขยาย").
- `Figma Excess/Selection.png` — BAKA ID panel expanded (search field + recent rows).
- `Figma Excess/Selection-1.png` — BAKA ID panel collapsed (header + "ขยาย").
- `Figma Excess/Map Mode.png` — map-mode toggle tabs + checkboxes close-up.
- `Figma Excess/Graph Information.png` — right-sidebar plot cards close-up (stats + charts layout).
- `Figma Excess/manual.png` — user manual expanded (left nav + content area).
- `Figma Excess/Frame 67.png` — user manual content close-up.
- `Figma Excess/Header 3.png` — user manual collapsed header ("คู่มือการใช้งาน [ขยาย]").
- `Figma Excess/slide bar.png` — scrollbar styling reference.
- `Figma Excess/Frame 58.png`, `Frame 59.png` — full processed-state composition references.
- `Figma Excess/Home.png`, `Home-1.png` — full home-state composition references.
- `Figma Excess/Processing.png`, `Processed.png`, `Processed scroll down.png` — duplicate state refs.

> If any Thai label still looks garbled after checking the images, flag it rather than guessing —
> it can be corrected later by a native speaker.

---

## Design behaviors (distilled from the UX/UI report — these define the interactions)

The new design's guiding idea is a **3-panel layout** (tools left · map center · results right) built on
**progressive disclosure**: do not show everything at once — reveal each panel/menu when the workflow
reaches the step that needs it. Implement these behaviors (fake the data, but make the behavior real):

1. **Progressive disclosure (auto-show panels).** At Home, show only what's needed to start
   (left tools + map + search). Results panels, legend, and analysis appear automatically when the
   user reaches the relevant step (after processing). Each panel can still be manually collapsed/expanded.
2. **Smart Cloud Cover with manual override.** The cloud-cover field ("เมฆปกคลุมท้องฟ้า") is auto-filled
   with a default value ("ค่ามาตรฐาน") derived from the chosen date/season, but the user can edit it.
   Faking it: when a date is chosen, set the field to a plausible preset (e.g. 20/38/65/85%); allow typing.
3. **Smart Date Defaults (bidirectional).** If the user sets the start date first, auto-fill the end date
   to +1 year. If they set the end date first, auto-fill the start date to −1 year. When the user finishes
   drawing/selecting a plot, default end = "today" and start = −1 year. All values remain user-editable.
4. **Satellite map-mode memory.** Once the user picks a map mode (e.g. ภาพถ่ายดาวเทียม), it persists —
   do NOT reset to the default map mode after processing.
5. **Separation of system tools from analysis tools.** Keep navigation/system buttons (collapse menu,
   "กลับไปที่แปลง") visually grouped apart from the data-analysis functions.
6. **Function grouping (task-oriented).** Analysis functions are grouped into categories:
   **ข้อมูล** (data, e.g. วิเคราะห์) · **ปัญหา** (problems, e.g. แต่งหน้าอ้อย) · **ผลผลิต** (yield, e.g. ผลผลิตอ้อย).
7. **Dynamic descriptions.** When the user selects a processing/analysis function, show a short
   contextual description of what it does. A full manual ("คู่มือการใช้งาน") is always accessible (Panel 8).
8. **Multi-plot selection via checkboxes** with numbered labels (1, 2, 3) shown on the map; users can
   process several plots at once and compare results side by side in the right panel.
9. **Search history retention.** Remember BAKA ID / recent searches within the session so the user can
   switch plots without retyping (Panel 2). Include a placeholder showing the correct BAKA ID format.
10. **1-Click Auto-Bounding.** With the auto-draw tool active, a single click on the map drops a
    pre-made plot polygon (fake the "auto edge detection" — just show a ready polygon at the click area).
11. **Processing indicator everywhere.** Any processing action shows the "กำลังประมวลผล" status bar and
    disables its trigger button until done, to prevent duplicate clicks.

**Canonical new-design workflow (6 steps) — the clickthrough should follow this order:**
1. **Locate** — search by BAKA ID / coordinates, or draw/select plots (multi-select checkboxes + numbered labels).
2. **Set conditions** — date range + cloud filter, grouped together, with smart auto-defaults (#2, #3).
3. **Choose analysis type** — pick from grouped categories ข้อมูล / ปัญหา / ผลผลิต (#6), with a dynamic description (#7).
4. **Process** — "กำลังประมวลผล" + progress bar (#11).
5. **Results** — map shows the BAKA Index color layer; Legend explains the ranges; right panel shows
   pie chart + histogram + trend graph; layers can be toggled.
6. **Use results** — export as **.PNG / .SVG / .CSV**; compare multiple plots.

---

## Tech stack (hard requirements)

- **HTML + vanilla JavaScript only.** No React/Vue/Svelte, no build step, no bundler, no TypeScript.
- **Component-style file layout** (see below) — NOT one monolithic file.
- **Tailwind CSS via CDN** for styling.
- **Chart.js via CDN** for all charts.
- **Google Fonts** (Inter or Google Sans) via CDN.
- Each JavaScript "component" is a plain ES module or an IIFE that renders itself into a mount point
  and communicates with other components only through a shared **event bus**.
- Runs by opening `index.html` directly in a browser (use ES modules with `type="module"`,
  or plain script tags — your choice, but it must work from `file://` or a simple static server).
- No real map API. The map is a static satellite image background with SVG polygon overlays.

---

## File structure (component style — required)

```
/index.html                  shell: header, map background, panel mount points, script/style includes
/assets/satellite.jpg        a satellite/aerial farm image for the map background (placeholder ok)
/css/tokens.css              design tokens: color vars, spacing, shadows, radii, fonts
/css/base.css                layout, header, map, shared panel/card styles, toast, scrollbars
/js/state.js                 the state machine (Home/Processing/Processed) + shared event bus + app store
/js/data.js                  ALL fake data: chart arrays, plot stats, metrics, dates, search results, manual text
/js/panels/leftSidebar.js
/js/panels/bakaId.js
/js/panels/mapMode.js
/js/panels/analysisResults.js
/js/panels/rightSidebar.js
/js/panels/legend.js
/js/panels/processing.js
/js/panels/userManual.js
/js/map/overlays.js          SVG plot polygons + index heatmap overlay
/js/devToolbar.js            dev-only state switcher
/js/main.js                  imports everything, mounts panels, starts app at Home state
```

**Component contract (every panel module must follow this):**
- Renders its own DOM into a single mount point `<div id="panel-<name>">` in `index.html`.
- Reads its fake data from `data.js`.
- Communicates with the rest of the app ONLY through the event bus in `state.js`.
  Never imports another panel's file. Never edits `index.html`, `state.js`, or another panel.
- Owns its own styling: either a scoped block in `base.css` marked `/* === <panel> === */`
  or its own `/css/panels/<name>.css`.

---

## Event bus contract (define in state.js, all panels depend on it)

`state.js` exposes a tiny pub/sub bus and a global app store. Define at least these events:

| Event                | Payload                          | Emitted by        | Consumed by                          |
|----------------------|----------------------------------|-------------------|--------------------------------------|
| `state:change`       | `{ state }` (home/processing/processed) | state.js   | all panels (show/hide themselves)    |
| `plot:toggle`        | `{ id: 1\|2\|3, on }`            | leftSidebar       | overlays, rightSidebar               |
| `tool:select`        | `{ tool }` (วาด/วาดอัตโนมัติ/ย้อนจุด/ขยับ/ลบ)| leftSidebar | overlays (auto-draw drops a polygon) |
| `func:select`        | `{ key, group, desc }` (analysis fn)| leftSidebar    | leftSidebar (shows dynamic description)|
| `date:change`        | `{ which: start\|end, value }`   | leftSidebar       | leftSidebar (smart-fills the other date)|
| `cloud:auto`         | `{ value }`                      | leftSidebar       | leftSidebar (fills cloud field, editable)|
| `process:start`      | `{}` (from [กลับไปที่แปลง])       | leftSidebar       | state.js, processing                 |
| `process:cancel`     | `{}`                             | processing/left   | state.js                             |
| `process:complete`   | `{}`                             | processing        | state.js                             |
| `mapmode:change`     | `{ mode }` (แผนที่/ภาพถ่ายดาวเทียม)| mapMode         | overlays; persisted in store (memory)|
| `maplayer:toggle`    | `{ layer, on }` (ที่ราดฉัน/ป้ายชื่อ)| mapMode        | overlays                             |
| `search:submit`      | `{ query }`                      | bakaId            | bakaId (adds + retains fake result)  |
| `toast`              | `{ message, ms }`                | any               | a global toast renderer (in base/main)|
| `chart:expand`       | `{ chartId }`                    | rightSidebar      | a modal renderer                     |

If a panel needs an event that isn't listed, it must report that back rather than inventing one;
the integrator adds it to `state.js`.

The app store (in `state.js`) holds: current state, selected plots, active drawing tool,
selected analysis function, date range, cloud value, **map mode (persisted — see behavior #4)**,
active map layers, and session search history. Panels read from the store on init to render the
correct initial view, and the store **persists map mode across processing** (do not reset it).

---

## Layout overview

Full-viewport single page. A satellite image fills the entire background (the "map").
A fixed header sits on top. All panels float over the map as overlays (like Google Maps UI).

---

## HEADER (`index.html` + base.css) — fixed, full width, ~48px, white

- **Left:** colorful "BAKA Index" wordmark (B = dark green, A = lime, K = orange, A = red,
  "Index" = gray), small gray subtitle "with SuCose", then a green pill button "ข้อย".
- **Center:** a Google-Maps-style search bar, placeholder "Search places", with a search icon.
  (Visual only — clicking focuses it but does nothing.)
- **Right:** small gray text "⭐ Google Earth Engine Apps".

---

## PANELS

All panels collapse via a **"ย่อ"** button to a small tab/strip on the screen edge, and re-expand
via an **"ขยาย"** button on that strip. All open/close transitions are 200ms ease.

### PANEL 1 — Left Sidebar (`leftSidebar.js`) — ~240px, top-left below header
**Authoritative reference: `Figma Excess/baka version.png` — match its labels and button order exactly.**
- **Session block:** "SugarCane@2025.12.30" in teal text + the description
  "ค่าดัชนีบ่งบอกการเจริญเติบโตอ้อยโรงงานรายแปลง เพาะปลูก ตามระยะเวลาที่กำหนด". Has a ย่อ button that
  collapses the whole sidebar to just this block (see `baka version-1.png`).
- **Date pickers (Smart Date Defaults):** "วันที่ : [04-Jan-2020]" and "ถึงวันที่ : [04-Jan-2020]"
  (two fields with calendar icons). Clicking a field opens a small fake dropdown of 3–4 preset dates.
  **Bidirectional auto-fill:** picking the start date sets end = start +1 year; picking the end date
  sets start = end −1 year; finishing a plot draw sets end = today, start = −1 year. All editable.
  Emits `date:change`.
- **Cloud row (Smart Cloud Cover):** "เมฆปกคลุมท้องฟ้า :" + a [ค่ามาตรฐาน] field/dropdown. When a date is
  chosen the value auto-fills to a plausible preset (e.g. 20/38/65/85%) via `cloud:auto`, but the user
  can still edit it.
- **Section 1 — "1.วาดเส้นขอบเขตพื้นที่แปลง" (drawing tools):**
  - Five tools (per the report): **วาด** (draw) | **วาดอัตโนมัติ** (auto-draw / 1-click bounding) |
    **ย้อนจุด** (undo point) | **ขยับ** (move) | **ลบ** (delete). Selecting a tool highlights it and
    emits `tool:select`. With **วาดอัตโนมัติ** active, a single click on the map drops a ready-made
    plot polygon (fake auto edge-detection — see behavior #10). Other tools are visual-only with
    active/hover styling. (If `baka version.png` labels differ slightly, follow the report's 5 names.)
    Has its own ย่อ collapse button.
- **Section 2 — "2.เลือกแปลง":**
  - 2×2 checkbox grid: ☑ แปลง 1 ☐ แปลง 3 / ☐ แปลง 2 ☐ เลือกทั้งหมด.
    Toggling แปลง 1/2/3 emits `plot:toggle` (shows/hides that polygon + its number label on the map AND
    that plot's card in the right sidebar). "เลือกทั้งหมด" checks/unchecks all three plots. Own ย่อ button.
- **Section 3 — "3.ประมวลผล" (task-oriented function grouping + dynamic descriptions):**
  - Two system buttons (kept visually separate from analysis tools): **[กลับไปที่แปลง]** (emits
    `process:start`; if already Processed, first show a confirm dialog "ล้างผลเดิมและเริ่มใหม่?" with
    [ยืนยัน]/[ยกเลิก]) and **[ยกเลิก]** (emits `process:cancel`).
  - Sub-heading "ฟังก์ชันที่ใช้บ่อย" then frequent-function buttons:
    [บาก้าอินเด็กซ์] (active = red outline) | [รายวัน] | [เปรียบเทียบ] | [วิเคราะห์] | [แต่งหน้าอ้อย] | [ผลผลิตอ้อย].
  - Three labeled category groups — **ข้อมูล** (e.g. [วิเคราะห์]) · **ปัญหา** (e.g. [แต่งหน้าอ้อย]) ·
    **ผลผลิต** (e.g. [ผลผลิตอ้อย]). Selecting any analysis function emits `func:select` and shows a short
    **dynamic description** of that function in a small text area below the buttons (text from `data.js`).
- During Processing, all inputs in this panel are disabled (opacity-50, not-allowed).

### PANEL 2 — BAKA ID (`bakaId.js`) — floating, center-left, ~300px
- Header "BAKA ID" + ย่อ button.
- Search input with a **placeholder showing the correct BAKA ID format** (e.g. "@BAKA ID หรือค้นหาสถานที่")
  and a 🔍 button. On Enter/click: clear input, show a 1s spinner, then prepend a fake result row
  "ผลลัพธ์: <query>". Emits `search:submit`.
- **Search history retention:** retain searched IDs in the session list (start with "ค้นหาล่าสุด #1",
  "ค้นหาล่าสุด #2"; new searches are added) so the user can switch plots by clicking a past result
  without retyping. Clicking a row highlights it and shows "เลือกแล้ว" beside it for 1s.

### PANEL 3 — Map Mode (`mapMode.js`) — floating, top-center of map
- Pill tabs [แผนที่] [ภาพถ่ายดาวเทียม] (toggle active, emit `mapmode:change`).
  **Map-mode memory:** the chosen mode is stored and persists across processing — it must NOT reset
  to the default after `process:start`/`process:complete` (behavior #4).
- Checkboxes ☐ ที่ราดฉัน ☐ ป้ายชื่อ → emit `maplayer:toggle`.
  ที่ราดฉัน toggles a fake translucent blue marker on the map; ป้ายชื่อ toggles the plot number labels.

### PANEL 4 — Analysis Results (`analysisResults.js`) — floating, top-center, ~500px (Processed only)
- Header tabs [หนังสือ] [ค่าดาวเทียมเทียม] + ย่อ.
  - **หนังสือ:** a dropdown "ประเภทส่งออก ▼" with export formats **.PNG / .SVG / .CSV** (per the report).
    Selecting one emits a `toast` "กำลังส่งออก <type>..." for 2s.
  - **ค่าดาวเทียมเทียม:** a scrollable table of fake metrics (from data.js):
    วันที่ใช้ = 2025-01-03 · ข้อมูลรวม = 28 ภาพ · ค่ากลับผล (สองผลแรก) = 0.52 ·
    ค่ากลับผล (ผลล่าสุด) = 0.47 · ค่ากลับผล (จากผลแรก-ผลสุดท้าย) = 0.44 · อ้อยสด = 73.4% ·
    ข้อมูลดาว = Sentinel-2.

### PANEL 5 — Right Sidebar (`rightSidebar.js`) — ~320px, top-right (Processed only)
- Top tabs [หนังสือ] [ค่าดาวเทียมเทียม] (switch content, visual only).
- Checkboxes ☐ ค้าพล ☐ ค้าพยิ่ง (visual only).
- Scrollable list of plot cards. **A card appears only if its plot checkbox in Section 2 is on**
  (listen to `plot:toggle`).
  - **แปลง 1:** header "แปลง 1" + per-card [ย่อ]; stats "พื้นที่: 3.92 ไร่ (อ้อย : 3.89 ไร่)" /
    "ภาพถ่ายดาวเทียม : 28 (เมฆปกคลุม : 38%)"; then
    - Chart.js **bar** "Compare histograms by BAKA Index" — two datasets (red 2025-01-03,
      green 2025-12-29), x = index 0.1–0.9, y = frequency 0–4.
    - Chart.js **line** "BAKA Index: Sugarcane Growth" — green line + orange dashed threshold ~0.35,
      x = Apr–Oct 2025, y = 0–1.
    - Each chart has a ⤢ expand icon → emits `chart:expand` → opens the chart in a fullscreen modal.
  - **แปลง 2:** same header/stats (different numbers); Chart.js **doughnut**
    "Compare proportions by BAKA Index" (red 73.4% / green 26.6%) + a bar histogram.
  - **แปลง 3:** collapsed by default (header + [ขยาย]); expands to the same structure with other data.

### PANEL 6 — Legend (`legend.js`) — bottom-left (visible once plots are on the map)
- Title "มาตรวัดค่าดัชนี"; a vertical CSS gradient bar red→yellow→green with tick labels
  0.0, 0.1, 0.2 … 0.7.

### PANEL 7 — Processing Status (`processing.js`) — center of map (Processing state only)
- White rounded card: "กำลังประมวลผล..." + an animated green progress bar that fills 0→100% over
  ~4s, then emits `process:complete`. A [ยกเลิก] button emits `process:cancel`.

### PANEL 8 — User Manual (`userManual.js`) — bottom-right
- Collapsed by default: a bar "คู่มือการใช้งาน [ขยาย]".
- Expanded (~420px): left nav (คำถามที่พบบ่อย / บาค้าอินเด็กซ์ / การวาดเส้นขอบพื้นที่ / การเลือกแปลง /
  การประมวลผล / ค่าต่างๆในกราฟ) — clicking an item highlights it (green/teal) and swaps the right
  content area (text from data.js). A "ย่อ" button collapses it back.

---

## MAP OVERLAYS (`overlays.js`)

- Three numbered plot polygons as SVG over the satellite image:
  Plot 1 bottom-left, Plot 2 center, Plot 3 top-right — green fill with a number label.
- Polygons appear after processing; each is shown/hidden via `plot:toggle`.
- In Processed state, overlay a translucent red→yellow→green heatmap (CSS/SVG gradient is fine)
  on each polygon to mimic the BAKA index.
- Respond to `maplayer:toggle` (ป้ายชื่อ toggles number labels; ที่ราดฉัน toggles the blue marker).

---

## STATE MACHINE & WORKFLOW (`state.js`)

Three states drive panel visibility. The guiding principle is **progressive disclosure** — show only
what each step needs, and auto-reveal panels as the user advances (do not dump everything at once):

- **Home:** Left Sidebar (open), BAKA ID (open), Map Mode, User Manual (collapsed) visible.
  No right sidebar, no legend, no analysis panel, no polygons.
- **Processing:** same as Home but inputs disabled and the Processing Status card shown center-map.
- **Processed:** polygons + heatmap on map, Legend, Right Sidebar (with plot cards),
  Analysis Results panel all **auto-appear**; Left Sidebar re-enabled. Map mode is preserved (#4).

**Full journey (mirrors the report's 6-step new-design workflow):**
1. Start at **Home**. (Locate) User searches a BAKA ID or selects/draws plots — Section 2 checkboxes
   show numbered polygons; วาดอัตโนมัติ + map click drops a polygon.
2. (Set conditions) User sets the date range and cloud value — smart defaults auto-fill (#2, #3).
3. (Choose analysis) User selects an analysis function from the ข้อมูล / ปัญหา / ผลผลิต groups; a
   dynamic description appears (#6, #7).
4. (Process) User clicks **[กลับไปที่แปลง]** → `process:start` → **Processing** (inputs disabled,
   progress card ~4s, button locked against double-click) → `process:complete` → **Processed**.
5. (Results) Polygons + heatmap, Legend, Right Sidebar charts, and Analysis Results panel auto-appear.
6. (Use) User exports (.PNG/.SVG/.CSV → toast) and compares plots.
- **[ยกเลิก]** during processing → `process:cancel` → back to **Home**.
- **[กลับไปที่แปลง]** while in Processed → confirm dialog "ล้างผลเดิมและเริ่มใหม่?"
   → ยืนยัน restarts the flow; ยกเลิก closes the dialog.

**Dev toolbar (`devToolbar.js`):** a small fixed bottom-center semi-transparent bar with buttons
[Home] [All Hide] [Processing] [Processed] to jump straight to any state for demos.
("All Hide" hides every panel, leaving only the header and the full map.)

---

## FAKE DATA RULES (`data.js`)

- All numbers (areas, image counts, cloud %, index values) are hardcoded constants.
- All chart datasets are static arrays — no computation anywhere.
- Date pickers offer 3–4 preset options; no real calendar. Smart date/cloud "auto-fill" just picks a
  hardcoded value (end = start +1yr / start = end −1yr; cloud = a preset like 38%) — no real computation.
- 1-Click Auto-Bounding drops a pre-defined polygon shape from `data.js` — no real edge detection.
- Dynamic function descriptions and the manual text are hardcoded strings in `data.js`.
- Search returns a fake result after a 1s delay and is kept in the session history list (in-memory only).
- Export selections show a toast, then nothing.
- The progress bar is a CSS/JS animation on a timer, not tied to any real work.

---

## VISUAL STYLE (`tokens.css` + `base.css`)

- White panels, subtle drop shadow; card radius 8–12px.
- Green accent `#2d7a3a` for active states; teal/cyan `#0ea5e9` for secondary accents.
- Disabled = opacity-50 + cursor-not-allowed; hover = slight background darken.
- 200ms ease transitions on panel open/close and state changes.
- Thin styled gray scrollbars. Toasts appear bottom-center and fade after 2s.
- Overall feel: Google Maps UI overlays floating on a satellite map.

---

## BUILD STRATEGY — USE SUBAGENTS

Build in phases. Use subagents to parallelize the independent work, but respect dependencies:
the foundation must exist before panels, and **no two subagents may write the same file at once.**
The component-per-file layout above is what makes parallel work safe.

### Phase 1 — Foundation (do yourself; everything depends on it)
Build `index.html` (shell + all panel mount points), `css/tokens.css`, `css/base.css`,
`js/state.js` (state machine + event bus + store), `js/data.js` (all fake data), the satellite
background, and `js/main.js` wiring. **Finalize and document the event bus contract** (event names +
payloads) — panels depend on it. Verify the page loads with empty mount points before continuing.

### Phase 2 — Panels (fan out: ~9 subagents in PARALLEL)
Launch one subagent per file: the 8 panels + `js/map/overlays.js`. Give each subagent:
its panel spec section above, the event-bus contract, the `data.js` keys it reads, and its mount
point id. Each subagent writes ONLY its own `js/panels/<name>.js` (plus a scoped style block) and
**must not** touch `index.html`, `state.js`, `data.js`, or another panel's file. If a subagent needs
a missing event, it reports back instead of inventing one.

### Phase 3 — Integration & wiring (do yourself)
Wire all modules into `main.js`/`index.html` in the right order. Run the full journey end-to-end
(Home → toggle plots → กลับไปที่แปลง → Processing → Processed → reset). Fix any event mismatches.
Add the dev toolbar.

### Phase 4 — Polish (fan out: 2–3 subagents on non-overlapping concerns)
- Subagent A: chart styling + the chart-expand modal (chart code only).
- Subagent B: transitions, hover states, toasts, scrollbar styling (CSS only).
- Subagent C: responsive layout + accessibility (focus states, aria labels).

### Subagent rules
- Each subagent returns a short summary of what it built and which events it emits/listens to.
- Never run two subagents that write the same file simultaneously.
- Keep each subagent strictly within its file boundary.

---

## ACCEPTANCE CRITERIA (the build is done when…)

1. Opening `index.html` shows the Home state: satellite map, header, left sidebar, BAKA ID panel,
   map-mode toggle, collapsed user manual. (Progressive disclosure: results/legend/analysis are hidden.)
2. Every panel can collapse (ย่อ) and re-expand (ขยาย).
3. Toggling แปลง 1/2/3 shows/hides both the map polygon (with number label) and the right-sidebar card.
4. Smart defaults work: picking a start date auto-fills end = +1yr (and vice-versa); choosing a date
   auto-fills the cloud value; both remain editable.
5. Selecting a drawing tool highlights it; with วาดอัตโนมัติ active, clicking the map drops a polygon.
6. Selecting an analysis function (ข้อมูล/ปัญหา/ผลผลิต) shows its dynamic description text.
7. Clicking [กลับไปที่แปลง] runs Processing (animated bar ~4s, button locked) then auto-advances to
   Processed, where polygons+heatmap, legend, right-sidebar Chart.js charts, and the analysis panel
   all auto-appear. Map mode is preserved across processing.
8. Chart ⤢ opens a fullscreen modal; export offers .PNG/.SVG/.CSV and shows a toast; search adds a
   fake result after 1s and keeps it in the session history.
9. Re-running from Processed shows the "ล้างผลเดิมและเริ่มใหม่?" confirm dialog.
10. The dev toolbar jumps between Home / All Hide / Processing / Processed.
11. No console errors. No real network/data calls. Files follow the component structure above.
