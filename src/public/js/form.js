let currentForm = null;
let currentMode = 'easy';

function getFormParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('form');
}

function sanitizeMedium(input) {
  return String(input)
    .replace(/<script>/gi, '')
    .replace(/<\/script>/gi, '');
}

function processAnswers(answers) {
  if (currentMode !== 'medium') return answers;
  return Object.fromEntries(
    Object.entries(answers).map(([k, v]) => [k, sanitizeMedium(v)])
  );
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

  try {
    const configRes = await fetch('/api/config');
    const config = await configRes.json();
    currentMode = config.mode;

    if (formParam) {
      const res = await fetch(`/api/forms/${encodeURIComponent(formParam)}`);
      if (!res.ok) throw new Error('not found');
      currentForm = await res.json();
    } else {
      const defaultId = config.mode === 'medium' ? 'event-survey' : '2';
      const formRes = await fetch(`/api/forms/${defaultId}`);
      currentForm = await formRes.json();
    }

    document.getElementById('form-title').textContent = currentForm.title;
    renderQuestions(currentForm);
  } catch {
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

  saveLocalResponse({
    id: crypto.randomUUID(),
    formId: currentForm.id,
    answers: processAnswers(answers),
    submittedAt: new Date().toISOString(),
  });

  document.getElementById('status-msg').textContent = '投稿を受け付けました';
  submitBtn.disabled = false;
});

loadForm();
