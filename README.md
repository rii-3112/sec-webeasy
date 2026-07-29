# SecPro Workshop — Google フォーム風アンケート

セキュリティ学習ワークショップ用の Web アプリです。**意図的な脆弱性**が含まれています。教育目的以外では使用しないでください。

## 起動方法（ローカル）

```bash
npm install
npm run dev:all
```

| 環境 | URL | 説明 |
|------|-----|------|
| 初級 (Easy) | http://localhost:3001 | 典型的な脆弱性がそのまま残っている |
| 中級 (Medium) | http://localhost:3002 | 一見対策されているが迂回可能 |

個別起動:

```bash
npm run dev:easy    # :3001
npm run dev:medium  # :3002
```

## Vercel へのデプロイ

Easy / Medium は **別プロジェクト × 2** でデプロイします（同じリポジトリを使い回し可）。

### 1. Vercel CLI（初回）

```bash
npm i -g vercel
vercel login
```

### 2. 初級 (Easy) プロジェクト

```bash
vercel
# プロジェクト名例: secpro-easy
```

Vercel ダッシュボード → プロジェクト → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `MODE` | `easy` |

Production に redeploy。

### 3. 中級 (Medium) プロジェクト

同じリポジトリから **新規プロジェクト** を作成:

```bash
vercel --name secpro-medium
```

環境変数:

| Name | Value |
|------|-------|
| `MODE` | `medium` |

### 4. 受講者に渡す URL

| 環境 | URL 例 |
|------|--------|
| Easy | `https://secpro-easy.vercel.app` |
| Medium | `https://secpro-medium.vercel.app` |

### 注意（Serverless）

- データは **インメモリ** のため、コールドスタート時に回答などがリセットされることがあります
- 各ブラウザには `workshop_session` Cookie が付与され、**自分が送った回答・作成したフォームだけ**が表示されます（Vercel 上でもローカルと同様に個人単位で演習できます）
- IDOR 用の **シードデータ**（秘密フォームの回答など）は全員共通のままです
- XSS 演習（POST → 管理者画面）は **同じブラウザで続けて操作** すれば問題なく動作します
- 本番ワークショップ前に両 URL で動作確認してください

## 画面

| 画面 | URL |
|------|-----|
| 回答 | `/` |
| フォーム作成 | `/create.html` |
| 回答一覧（管理者） | `/admin.html` |
| 演習シート（Web版） | `/challenges.html` |

## 演習ドキュメント

| ファイル | 配布対象 | 内容 |
|---------|---------|------|
| [**問題.md**](問題.md) | 受講者 | 6 チャレンジの問題・スタンプチェックリスト |
| [**解答.md**](解答.md) | 講師のみ | 完全解法・curl 例・防御策・タイムテーブル |

## 演習の進め方

1. [`問題.md`](問題.md) または演習シート（`/challenges.html`）を開く
2. 初級（Easy）→ 中級（Medium）の順に 3 チャレンジずつ取り組む
3. 成功すると **`〇〇-OK!!`** 形式のスタンプが表示される
4. 演習シートでスタンプを入力 → **正解！！** と表示されたら取得完了
5. 各環境 3 スタンプ、合計 **6 スタンプ**
