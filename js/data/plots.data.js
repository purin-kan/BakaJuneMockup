// SHARED fake data: per-plot stats and chart datasets.
// Consumed by BOTH rightSidebar (charts/stats) and map/overlays (it reads selected plot ids).
// Because this is shared, coordinate before changing the shape of a plot entry. Adding/adjusting
// values inside an existing plot is low-risk; renaming keys affects rightSidebar.

export const plots = {
  1: {
    stats: 'พื้นที่: 3.92 ไร่ (อ้อย : 3.89 ไร่) \nภาพถ่ายดาวเทียม : 28 (เมฆปกคลุม : 38%)',
    histogramData: {
      labels: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'],
      dataset1: [0, 1, 0, 2, 4, 3, 1, 0, 0],
      dataset2: [0, 0, 1, 3, 2, 4, 2, 0, 0]
    },
    lineData: {
      labels: ['Apr 2025', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec 2025'],
      values: [0.2, 0.3, 0.45, 0.5, 0.48, 0.55, 0.6, 0.58, 0.5],
      threshold: 0.35
    }
  },
  2: {
    stats: 'พื้นที่: 5.12 ไร่ (อ้อย : 5.00 ไร่) \nภาพถ่ายดาวเทียม : 28 (เมฆปกคลุม : 38%)',
    doughnutData: {
      labels: ['อ้อยสด', 'อื่นๆ'],
      values: [73.4, 26.6]
    },
    histogramData: {
      labels: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'],
      dataset1: [1, 2, 1, 3, 2, 1, 0, 0, 0],
      dataset2: [0, 1, 2, 4, 3, 2, 1, 0, 0]
    }
  },
  3: {
    stats: 'พื้นที่: 2.50 ไร่ (อ้อย : 2.40 ไร่) \nภาพถ่ายดาวเทียม : 28 (เมฆปกคลุม : 38%)',
    histogramData: {
      labels: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'],
      dataset1: [0, 0, 2, 3, 1, 1, 0, 0, 0],
      dataset2: [0, 0, 1, 2, 4, 3, 0, 0, 0]
    },
    lineData: {
      labels: ['Apr 2025', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec 2025'],
      values: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.65, 0.6],
      threshold: 0.35
    }
  }
};
