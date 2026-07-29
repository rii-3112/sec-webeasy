let currentForm = null;

function getFormParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('form');
}

function renderQuestions(form) {
  const container = document.getElementById('survey-form');
  container.innerHTML = '';

  form.questions.forEach((q) => {
    const wrap = document.createElement('div');
    wrap.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6';

    const label = document.createElement('label');
    label.className = 'block text-base text-gray-800 mb-3';
    label.htmlFor = q.id;
    label.innerHTML = `${q.label}${q.required ? ' <span class="text-red-500">*</span>' : ''}`;

    let input;
    if (q.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 4;
      input.className = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-500 resize-y';
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-500';
    }

    input.id = q.id;
    input.name = q.id;
    input.dataset.required = q.required ? 'true' : 'false';

    wrap.appendChild(label);
    wrap.appendChild(input);
    container.appendChild(wrap);
  });
}

async function loadForm() {
  const formParam = getFormParam();
  let url = '/api/forms';

  if (formParam) {
    url = `/api/forms/${encodeURIComponent(formParam)}`;
  }

  try {
    if (formParam) {
      const res = await fetch(url);
      if (!res.ok) throw new Error('not found');
      currentForm = await res.json();
    } else {
      const res = await fetch('/api/config');
      const config = await res.json();
      const defaultId = config.mode === 'medium' ? 'event-survey' : '2';
      const formRes = await fetch(`/api/forms/${defaultId}`);
      currentForm = await formRes.json();
    }

    document.getElementById('form-title').textContent = currentForm.title;
    renderQuestions(currentForm);
  } catch (err) {
    document.getElementById('form-title').textContent = 'フォームが見つかりません';
    document.getElementById('status-msg').textContent = 'URL の form パラメータを確認してください。';
  }
}

document.getElementById('survey-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentForm) return;

  const answers = {};
  let valid = true;

  currentForm.questions.forEach((q) => {
    const el = document.getElementById(q.id);
    const value = el ? el.value : '';
    answers[q.id] = value;

    if (q.required && !value.trim()) {
      valid = false;
      el.classList.add('border-red-500');
    } else if (el) {
      el.classList.remove('border-red-500');
    }
  });

  if (!valid) {
    document.getElementById('status-msg').textContent = '必須項目を入力してください。';
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId: currentForm.id, answers }),
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById('status-msg').textContent = data.error || '送信に失敗しました';
      submitBtn.disabled = false;
      return;
    }

    document.getElementById('status-msg').textContent = data.message || '送信しました。ありがとうございました！';
    submitBtn.disabled = false;
  } catch {
    document.getElementById('status-msg').textContent = '通信エラーが発生しました';
    submitBtn.disabled = false;
  }
});

loadForm();
