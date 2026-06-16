// Barrel for all fake data. Each panel owns its own slice under js/data/<panel>.data.js —
// edit those, not this file. This file only re-assembles them into the FAKE_DATA shape that
// panels already consume. You should only need to touch it when adding a brand-new data module
// (one append-only import + one key), so it stays low-conflict.

import { presets, functionDescriptions } from './data/leftSidebar.data.js';
import { manual } from './data/userManual.data.js';
import { analysisMetrics } from './data/analysisResults.data.js';
import { plots } from './data/plots.data.js';
import { polygons, autoPolygonShape } from './data/overlays.data.js';

export const FAKE_DATA = {
  presets,
  functionDescriptions,
  manual,
  analysisMetrics,
  plots,
  polygons,
  autoPolygonShape
};
