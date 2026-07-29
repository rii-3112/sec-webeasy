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
      title: 'チャレンジ3: 隠れた管理機能',
      mission: 'このサービスに、ログインなしで使えてしまう「管理者向けフォーム作成機能」がないか探してみよう。見つけたらスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '回答画面', href: '/' },
        { label: '管理画面', href: '/admin.html?form_id=2' },
      ],
      hints: [
        'ヘッダーに載っていない .html ページがあるかも？',
        'admin.html があるなら、似た URL を試してみよう',
        '見つけた画面の Network タブで、どんな API が呼ばれるか見てみよう',
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
      title: 'チャレンジ3: 隠れた管理機能',
      mission: 'このサービスに、ログインなしで使えてしまう「管理者向け機能」がないか探してみよう。見つけたらスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '回答画面', href: '/' },
        { label: '管理画面', href: '/admin.html?form_id=event-survey' },
      ],
      hints: [
        'ヘッダーに載っていない .html ページがあるかも？',
        'admin.html があるなら、似た URL を試してみよう',
        'フォームを作成したあと、もう一度 API で詳細を取得してみよう',
      ],
    },
  ],
};

function getChallenges(mode) {
  return CHALLENGES[mode] || CHALLENGES.easy;
}

module.exports = { getChallenges, CHALLENGES };
