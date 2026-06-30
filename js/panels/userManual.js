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
      <div class="bg-white shadow-md border border-gray-200 overflow-hidden pointer-events-auto">
        <div class="px-2 py-1.5 bg-white flex justify-between items-center">
          <span class="text-xs font-bold text-gray-800">คู่มือการใช้งาน</span>
          <button id="btn-expand-manual" class="text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200 bg-white">ขยาย</button>
        </div>
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
        <div class="px-2 py-1.5 bg-white border-b border-gray-200 flex justify-between items-center">
          <span class="text-xs font-bold text-gray-800">คู่มือการใช้งาน</span>
          <button id="btn-collapse-manual" class="text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200 bg-white">ย่อ</button>
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
