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
      id: 'bypass',
      title: 'チャレンジ3: 投稿制限の突破',
      mission: '「1回まで」の制限を突破して、2回目以降も投稿してみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '回答画面', href: '/?form=2' },
      ],
      hints: [
        'ブラウザの制限はフロントエンドだけかもしれない。API を直接叩いてみよう',
        'curl や DevTools の Console から POST /api/responses を試してみよう',
        '同じ formId で2回 POST すると、レスポンス JSON に何か追加されるかも…',
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
      id: 'bypass',
      title: 'チャレンジ3: IP 制限の突破',
      mission: '1 IP 1回の制限を突破して、2回目も投稿してみよう。そこからスタンプを探してみよう！！',
      steps: [],
      links: [
        { label: '回答画面', href: '/?form=event-survey' },
      ],
      hints: [
        'サーバー側にも制限がある。同じ IP から2回目は 429 エラーになるはず',
        'リクエストヘッダーに IP 情報を載せられるか調べてみよう',
        'X-Forwarded-For ヘッダーに別の IP を指定して POST してみよう',
      ],
    },
  ],
};

function getChallenges(mode) {
  return CHALLENGES[mode] || CHALLENGES.easy;
}

module.exports = { getChallenges, CHALLENGES };
