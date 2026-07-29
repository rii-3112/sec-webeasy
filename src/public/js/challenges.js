function stampsKey(mode) {
  return `secpro_stamps_${mode}`;
}

function getCollectedStamps(mode) {
  try {
    return JSON.parse(localStorage.getItem(stampsKey(mode)) || '[]');
  } catch {
    return [];
  }
}

function saveStamp(mode, stamp) {
  const list = getCollectedStamps(mode);
  if (!list.includes(stamp)) {
    list.push(stamp);
    localStorage.setItem(stampsKey(mode), JSON.stringify(list));
  }
  return list;
}

function showFeedback(message, type) {
  const el = document.getElementById('verify-feedback');
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
  const count = getCollectedStamps(mode).length;
  document.getElementById('progress-text').textContent = `${count}/3 達成`;

  if (count >= 3) {
    document.getElementById('all-clear').classList.remove('hidden');
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
  const collected = getCollectedStamps(mode);

  ul.innerHTML = collected.length === 0
    ? '<li class="text-gray-400">まだ取得していません</li>'
    : collected.map((s) => `<li class="flex items-center gap-2"><span class="text-green-600">✓</span> ${s}</li>`).join('');
}

function renderChallenges(challenges) {
  const container = document.getElementById('challenges-list');

  container.innerHTML = challenges.map((c, index) => `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="h-1 bg-purple-500"></div>
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
      </div>
    </div>
  `).join('');
}

async function verifyStamp(mode, stamp) {
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

async function init() {
  const configRes = await fetch('/api/config');
  const config = await configRes.json();
  const mode = config.mode;

  const challengesRes = await fetch('/api/challenges');
  const data = await challengesRes.json();

  renderChallenges(data.challenges);
  renderCollectedList(mode);
  updateProgress(mode);

  document.getElementById('register-stamp-btn').addEventListener('click', async () => {
    const input = document.getElementById('stamp-input');
    const stamp = input.value.trim();
    if (!stamp) return;

    const btn = document.getElementById('register-stamp-btn');
    btn.disabled = true;

    try {
      const result = await verifyStamp(mode, stamp);

      if (!result.correct) {
        showFeedback('スタンプ名が違うみたい…', 'error');
        btn.disabled = false;
        return;
      }

      const already = getCollectedStamps(mode).includes(stamp);
      if (already) {
        showFeedback('このスタンプは取得済みです', 'warn');
      } else {
        saveStamp(mode, stamp);
        showFeedback('正解！！', 'success');
        input.value = '';
        renderCollectedList(mode);
        updateProgress(mode);
      }
    } catch {
      showFeedback('通信エラーが発生しました', 'error');
    }

    btn.disabled = false;
  });

  document.getElementById('stamp-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('register-stamp-btn').click();
    }
  });
}

init();
