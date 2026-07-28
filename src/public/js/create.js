let questionCount = 0;

function addQuestionField() {
  questionCount += 1;
  const id = `q${questionCount}`;

  const wrap = document.createElement('div');
  wrap.className = 'border border-gray-200 rounded-lg p-4 space-y-3';
  wrap.dataset.questionId = id;

  wrap.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="text-sm font-medium text-gray-600">設問 ${questionCount}</span>
      <button type="button" class="remove-q text-red-500 text-xs hover:underline">削除</button>
    </div>
    <input type="text" class="q-label w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="質問文" required>
    <div class="flex gap-4 items-center text-sm">
      <label class="flex items-center gap-1">
        <input type="checkbox" class="q-required" checked>
        必須
      </label>
      <select class="q-type border border-gray-300 rounded px-2 py-1">
        <option value="text">短文</option>
        <option value="textarea">自由記述</option>
      </select>
    </div>
  `;

  wrap.querySelector('.remove-q').addEventListener('click', () => wrap.remove());
  document.getElementById('questions-list').appendChild(wrap);
}

document.getElementById('add-question-btn').addEventListener('click', addQuestionField);

document.getElementById('create-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('form-title-input').value.trim();
  const questionEls = document.querySelectorAll('#questions-list > div');

  if (!title || questionEls.length === 0) {
    alert('タイトルと設問を入力してください');
    return;
  }

  const questions = Array.from(questionEls).map((el, i) => ({
    id: el.dataset.questionId || `q${i + 1}`,
    label: el.querySelector('.q-label').value.trim(),
    required: el.querySelector('.q-required').checked,
    type: el.querySelector('.q-type').value,
  }));

  try {
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || '作成に失敗しました');
      return;
    }

    const result = document.getElementById('result');
    result.classList.remove('hidden');
    result.innerHTML = `
      フォームを作成しました！<br>
      <a href="/?form=${data.publicId}" class="underline font-medium">回答ページを開く</a>
      ｜
      <a href="/admin.html?form_id=${data.publicId}" class="underline font-medium">回答一覧を見る</a>
    `;
  } catch {
    alert('通信エラーが発生しました');
  }
});

addQuestionField();
