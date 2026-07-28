async function resolveFormId(input) {
  try {
    const res = await fetch(`/api/forms/${encodeURIComponent(input)}`);
    if (res.ok) {
      const form = await res.json();
      return form.id;
    }
  } catch {
    /* use input as-is */
  }
  return input;
}

function renderResponses(responses) {
  const container = document.getElementById('responses-container');

  if (responses.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-sm">回答がありません。</p>';
    return;
  }

  const table = document.createElement('div');
  table.className = 'space-y-4';

  responses.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'border border-gray-200 rounded-lg p-4 bg-gray-50';

    const meta = document.createElement('p');
    meta.className = 'text-xs text-gray-400 mb-2';
    meta.textContent = `ID: ${r.id} / ${new Date(r.submittedAt).toLocaleString('ja-JP')}`;

    card.appendChild(meta);

    Object.entries(r.answers).forEach(([key, value]) => {
      const row = document.createElement('div');
      row.className = 'mb-2';

      const label = document.createElement('p');
      label.className = 'text-xs font-medium text-gray-500';
      label.textContent = key;

      const val = document.createElement('div');
      val.className = 'answer-cell text-gray-800 mt-1';
      val.innerHTML = value;

      row.appendChild(label);
      row.appendChild(val);
      card.appendChild(row);
    });

    if (r.stamp) {
      const stamp = document.createElement('p');
      stamp.className = 'mt-2 text-sm font-bold text-purple-700';
      stamp.textContent = `スタンプ: ${r.stamp}`;
      card.appendChild(stamp);
    }

    table.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(table);
}

async function loadResponses() {
  const input = document.getElementById('form-id-input').value.trim();
  if (!input) {
    document.getElementById('form-info').textContent = 'form_id を入力してください。';
    return;
  }

  const formId = await resolveFormId(input);

  try {
    const formRes = await fetch(`/api/forms/${encodeURIComponent(input)}`);
    if (formRes.ok) {
      const form = await formRes.json();
      document.getElementById('form-info').textContent = `表示中: ${form.title}（内部ID: ${form.id}）`;
    }

    const res = await fetch(`/api/responses?form_id=${encodeURIComponent(formId)}`);
    const responses = await res.json();

    if (!res.ok) {
      document.getElementById('form-info').textContent = responses.error || '取得に失敗しました';
      return;
    }

    renderResponses(responses);
  } catch {
    document.getElementById('form-info').textContent = '通信エラーが発生しました';
  }
}

document.getElementById('load-btn').addEventListener('click', loadResponses);

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const formParam = params.get('form_id');

  if (formParam) {
    document.getElementById('form-id-input').value = formParam;
    loadResponses();
  } else {
    const configRes = await fetch('/api/config');
    const config = await configRes.json();
    const defaultId = config.mode === 'medium' ? 'event-survey' : '2';
    document.getElementById('form-id-input').value = defaultId;
    loadResponses();
  }
});
