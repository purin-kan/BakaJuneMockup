import { FAKE_DATA } from '../data.js';
import { bus, store, AppState } from '../state.js';

let isExpanded = false;
let selectedTopicId = FAKE_DATA.manual.topics[0].id;
let isMounted = false;

function render() {
  const container = document.getElementById('panel-userManual');
  if (!container) return;

  if (!isExpanded) {
    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur shadow-lg rounded border border-gray-200 px-3 py-2 cursor-pointer hover:bg-white transition flex items-center gap-2 pointer-events-auto" id="btn-expand-manual">
        <svg class="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <span class="text-sm font-medium text-gray-700">คู่มือการใช้งาน</span>
        <span class="text-xs text-brand-teal font-semibold hover:text-brand-dark transition">[ขยาย]</span>
      </div>
    `;

    document.getElementById('btn-expand-manual').addEventListener('click', () => {
      isExpanded = true;
      render();
    });
  } else {
    const selectedTopic = FAKE_DATA.manual.topics.find(t => t.id === selectedTopicId) || FAKE_DATA.manual.topics[0];

    const navHtml = FAKE_DATA.manual.topics.map(topic => {
      const isSelected = topic.id === selectedTopicId;
      return `
        <button class="w-full text-left px-3 py-2 text-xs transition-colors ${isSelected ? 'bg-brand-light border-l-2 border-brand-teal text-brand-teal font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'}" data-topic-id="${topic.id}">
          ${topic.title}
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur shadow-2xl rounded-lg border border-gray-200 flex flex-col w-[420px] overflow-hidden pointer-events-auto">
        <div class="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span class="text-sm font-bold text-gray-800">คู่มือการใช้งาน</span>
          </div>
          <button id="btn-collapse-manual" class="text-xs text-brand-teal font-semibold hover:text-brand-dark transition">
            [ย่อ]
          </button>
        </div>
        <div class="flex h-[280px]">
          <div class="w-1/3 border-r border-gray-100 overflow-y-auto bg-white py-1">
            ${navHtml}
          </div>
          <div class="w-2/3 p-4 overflow-y-auto bg-gray-50/50">
            <h4 class="text-sm font-bold text-gray-800 mb-2">${selectedTopic.title}</h4>
            <p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">${selectedTopic.content}</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-collapse-manual').addEventListener('click', () => {
      isExpanded = false;
      render();
    });

    const topicBtns = container.querySelectorAll('[data-topic-id]');
    topicBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedTopicId = e.currentTarget.dataset.topicId;
        render();
      });
    });
  }
}

export function initUserManual() {
  if (isMounted) return;
  isMounted = true;
  
  // Initial render
  render();

  // Contract: Listen to state:change (always visible)
  bus.on('state:change', () => {
    render();
  });
}
