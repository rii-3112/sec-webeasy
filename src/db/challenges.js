const CHALLENGES = {
  easy: [
    {
      id: 'idor',
      title: 'チャレンジ1: 秘密のアンケート回答',
      mission: '内部向けアンケートの回答データを API から取り出してみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '管理画面', href: '/admin.html?form_id=2' },
      ],
      hints: [
        '回答一覧 API の URL パラメータに注目してみよう',
        'form_id の数字を 1 や 2 に変えて GET リクエストを送ってみよう',
        'GET /api/responses?form_id=1 を DevTools や curl で試してみよう',
      ],
    },
    {
      id: 'xss',
      title: 'チャレンジ2: 管理者画面でスクリプト実行',
      mission: '回答一覧に自分の回答が表示された瞬間、alert が出るようにしてみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '回答画面', href: '/?form=2' },
        { label: '管理画面', href: '/admin.html?form_id=2' },
      ],
      hints: [
        '公開フォーム（イベント満足度）の自由記述欄が怪しい…',
        'HTML タグがそのまま表示されるか、管理者画面（/admin.html）を確認しよう',
        '<script> タグと alert() を組み合わせた文字列を送ってみよう',
      ],
    },
    {
      id: 'create',
      title: 'チャレンジ3: 無認可フォーム作成',
      mission: 'ログインなしで API から新しいフォームを作ってみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: 'フォーム作成画面', href: '/create.html' },
      ],
      hints: [
        '作成画面はあるが、API に認証は必要かな？',
        'Network タブで POST /api/forms のリクエストを観察してみよう',
        'Console から fetch で POST /api/forms を試してみよう',
      ],
    },
  ],
  medium: [
    {
      id: 'idor',
      title: 'チャレンジ1: 秘密のアンケート回答',
      mission: '推測困難な ID の内部アンケート回答を API から取り出してみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '回答画面', href: '/' },
        { label: '管理画面', href: '/admin.html?form_id=event-survey' },
      ],
      hints: [
        'フォーム一覧 API のレスポンスを Network タブで詳しく見てみよう',
        '画面には出ていない JSON フィールドに内部 ID が含まれているかも',
        'GET /api/forms の _internal.form_id を使い、/api/responses?form_id=... を叩こう',
      ],
    },
    {
      id: 'xss',
      title: 'チャレンジ2: サニタイズの突破',
      mission: '<script> が弾かれても、管理画面で alert が出るようにしてみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '回答画面', href: '/?form=event-survey' },
        { label: '管理画面', href: '/admin.html?form_id=event-survey' },
      ],
      hints: [
        '普通の <script> が効かないなら、フィルタの抜け穴を探そう',
        'イベントハンドラ（onerror など）を使う img タグを試してみよう',
        '<img src=x onerror="alert(\'...\')"> のようなペイロードを自由記述に送ろう',
      ],
    },
    {
      id: 'create',
      title: 'チャレンジ3: 無認可フォーム作成',
      mission: 'ログインなしで API から新しいフォームを作ってみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: 'フォーム作成画面', href: '/create.html' },
      ],
      hints: [
        '画面から作成できるが、API 直叩きもできるはず',
        'Network タブで POST /api/forms のレスポンス JSON を確認してみよう',
        'Console から fetch で POST /api/forms を試してみよう',
      ],
    },
  ],
};

function getChallenges(mode) {
  return CHALLENGES[mode] || CHALLENGES.easy;
}

module.exports = { getChallenges, CHALLENGES };
