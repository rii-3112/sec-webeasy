function stampsKey(mode) {
  return `secpro_stamps_${mode}`;
}

function getCollectedMap(mode) {
  try {
    const parsed = JSON.parse(localStorage.getItem(stampsKey(mode)) || '{}');
    if (Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function getCollectedCount(mode) {
  return Object.keys(getCollectedMap(mode)).length;
}

function saveStamp(mode, challengeId, stamp) {
  const map = getCollectedMap(mode);
  map[challengeId] = stamp;
  localStorage.setItem(stampsKey(mode), JSON.stringify(map));
  return map;
}

function showCardFeedback(challengeId, message, type) {
  const el = document.querySelector(`.stamp-feedback[data-challenge-id="${challengeId}"]`);
  if (!el) return;

  el.classList.remove('hidden', 'text-green-600', 'text-red-500', 'text-yellow-600');

  if (type === 'success') {
    el.classList.add('text-green-600');
  } else if (type === 'error') {
    el.classList.add('text-red-500');
  } else {
    el.classList.add('text-yellow-600');
  }

  el.textContent = message;
}

function updateProgress(mode) {
  const count = getCollectedCount(mode);
  document.getElementById('progress-text').textContent = `${count}/3 達成`;

  if (count >= 3) {
    document.getElementById('all-clear').classList.remove('hidden');
  } else {
    document.getElementById('all-clear').classList.add('hidden');
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderCollectedList(mode) {
  const ul = document.getElementById('collected-stamps');
  const collected = getCollectedMap(mode);
  const stamps = Object.values(collected);

  ul.innerHTML = stamps.length === 0
    ? '<li class="text-gray-400">まだ取得していません</li>'
    : stamps.map((s) => `<li class="flex items-center gap-2"><span class="text-green-600">✓</span> ${escapeHtml(s)}</li>`).join('');
}

function renderStampSection(c) {
  if (c.collectedStamp) {
    return `
      <p class="mt-4 pt-4 border-t border-gray-100 text-sm font-bold text-green-600 flex items-center gap-2">
        <span aria-hidden="true">✓</span>
        取得済み: ${escapeHtml(c.collectedStamp)}
      </p>
    `;
  }

  return `
    <div class="mt-4 pt-4 border-t border-gray-100">
      <label class="block text-sm text-gray-600 mb-2" for="stamp-input-${c.id}">取得したスタンプを入力</label>
      <div class="flex gap-2">
        <input
          type="text"
          id="stamp-input-${c.id}"
          data-challenge-id="${c.id}"
          placeholder="〇〇-OK!! 形式で入力"
          class="stamp-input flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        >
        <button
          type="button"
          data-challenge-id="${c.id}"
          class="stamp-verify-btn bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
        >
          確認
        </button>
      </div>
      <p class="stamp-feedback hidden mt-2 text-sm font-bold" data-challenge-id="${c.id}"></p>
    </div>
  `;
}

function renderChallenges(challenges, collectedMap) {
  const container = document.getElementById('challenges-list');

  container.innerHTML = challenges.map((c, index) => {
    const collectedStamp = collectedMap[c.id];

    return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" data-challenge-card="${c.id}">
      <div class="h-1 ${collectedStamp ? 'bg-green-500' : 'bg-purple-500'}"></div>
      <div class="p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs text-purple-600 font-bold mb-1">CHALLENGE ${index + 1}</p>
            <h2 class="text-lg font-medium text-gray-800">${escapeHtml(c.title)}</h2>
            <p class="text-sm text-gray-600 mt-2">${escapeHtml(c.mission)}</p>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          ${c.hints.map((hint, i) => `
            <details class="group border border-gray-100 rounded-lg">
              <summary class="px-4 py-2 cursor-pointer text-sm text-purple-700 hover:bg-purple-50 rounded-lg">
                ヒント ${i + 1} を見る
              </summary>
              <p class="px-4 pb-3 text-sm text-gray-600">${escapeHtml(hint)}</p>
            </details>
          `).join('')}
        </div>

        ${renderStampSection({ ...c, collectedStamp })}
      </div>
    </div>
  `;
  }).join('');
}

async function verifyStamp(stamp) {
  const res = await fetch('/api/stamps/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stamp }),
  });

  if (!res.ok) {
    throw new Error('verify failed');
  }

  return res.json();
}

async function submitStamp(mode, challengeId, stamp) {
  const result = await verifyStamp(stamp);

  if (!result.correct) {
    showCardFeedback(challengeId, 'スタンプ名が違うみたい…', 'error');
    return;
  }

  if (result.challengeId !== challengeId) {
    showCardFeedback(challengeId, 'このチャレンジのスタンプではないみたい…', 'error');
    return;
  }

  const collected = getCollectedMap(mode);
  if (collected[challengeId]) {
    showCardFeedback(challengeId, 'このチャレンジは取得済みです', 'warn');
    return;
  }

  saveStamp(mode, challengeId, stamp);
  showCardFeedback(challengeId, '正解！！', 'success');

  const challengesRes = await fetch('/api/challenges');
  const data = await challengesRes.json();
  renderChallenges(data.challenges, getCollectedMap(mode));
  renderCollectedList(mode);
  updateProgress(mode);
}

function bindStampHandlers(mode) {
  const container = document.getElementById('challenges-list');

  container.addEventListener('click', async (e) => {
    const btn = e.target.closest('.stamp-verify-btn');
    if (!btn) return;

    const challengeId = btn.dataset.challengeId;
    const input = container.querySelector(`.stamp-input[data-challenge-id="${challengeId}"]`);
    const stamp = input?.value.trim();
    if (!stamp) return;

    btn.disabled = true;

    try {
      await submitStamp(mode, challengeId, stamp);
    } catch {
      showCardFeedback(challengeId, '通信エラーが発生しました', 'error');
    }

    btn.disabled = false;
  });

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;

    const input = e.target.closest('.stamp-input');
    if (!input) return;

    e.preventDefault();
    const challengeId = input.dataset.challengeId;
    const btn = container.querySelector(`.stamp-verify-btn[data-challenge-id="${challengeId}"]`);
    btn?.click();
  });
}

async function init() {
  const configRes = await fetch('/api/config');
  const config = await configRes.json();
  const mode = config.mode;

  const challengesRes = await fetch('/api/challenges');
  const data = await challengesRes.json();
  const collectedMap = getCollectedMap(mode);

  renderChallenges(data.challenges, collectedMap);
  renderCollectedList(mode);
  updateProgress(mode);
  bindStampHandlers(mode);
}

init();
