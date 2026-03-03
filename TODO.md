# TODO - GitHub リポジトリ作成・デプロイ手順

Astroサイトを GitHub Pages で公開するための手順書です。
**必ずこの順番通りに作業してください。**

---

## ステップ 1: GitHub リポジトリを作成する

1. [GitHub](https://github.com) にログインする
2. 右上の「+」ボタン → 「New repository」をクリック
3. 以下を設定する：
   - **Repository name**: `swing-portfolio`（お好みの名前でOK）
   - **Description**: WEB制作 Swing ポートフォリオサイト（任意）
   - **Public** にチェック（GitHub Pages は無料プランで Public が必要）
   - 「Initialize this repository with a README」は **チェックしない**
4. 「Create repository」をクリック

---

## ステップ 2: astro.config.mjs の base を設定する

> **重要**: リポジトリ名によって設定が変わります！

### パターン A: `ユーザー名.github.io` という名前のリポジトリの場合

`base` の設定は **不要** です。`astro.config.mjs` はそのままでOKです。

### パターン B: `swing-portfolio` など別の名前のリポジトリの場合

`astro-site/astro.config.mjs` を以下のように変更してください：

```js
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://あなたのGitHubユーザー名.github.io',
  base: '/swing-portfolio',  // ← リポジトリ名に変更
});
```

---

## ステップ 3: ローカルで git を初期化してプッシュする

ターミナルを開いて、以下のコマンドを順番に実行してください：

```bash
# docker-wordpress ディレクトリに移動
cd /Users/kuniyuki/Project/docker-wordpress

# git を初期化
git init

# 最初のコミット
git add .
git commit -m "first commit"

# メインブランチ名を main に設定
git branch -M main

# GitHub リポジトリをリモートに追加
# ↓ ここの URL は作成したリポジトリの URL に変更してください
git remote add origin https://github.com/あなたのユーザー名/swing-portfolio.git

# GitHubにプッシュ
git push -u origin main
```

---

## ステップ 4: GitHub Pages の設定を行う

1. GitHubの作成したリポジトリを開く
2. 「Settings」タブをクリック
3. 左サイドバーの「Pages」をクリック
4. 「Build and deployment」の「Source」を **「GitHub Actions」** に変更する
5. 保存する

---

## ステップ 5: 自動デプロイを確認する

1. リポジトリの「Actions」タブをクリック
2. 「Deploy to GitHub Pages」ワークフローが実行されているか確認する
3. 緑のチェックマーク ✅ が付いたら成功！
4. 「Pages」設定画面のURLにアクセスして確認する

---

## ステップ 6: ローカルで動作確認する方法

```bash
cd /Users/kuniyuki/Project/docker-wordpress/astro-site

# 開発サーバーを起動（http://localhost:4321 でアクセスできる）
npm run dev

# ビルドテスト（エラーがないか確認）
npm run build

# ビルド後のプレビュー
npm run preview
```

---

## トラブルシューティング

### ビルドが失敗する場合
- Actions タブでエラーログを確認する
- `npm run build` をローカルで実行してエラーを確認する

### ページが真っ白になる場合
- `astro.config.mjs` の `base` 設定を確認する
- リポジトリ名と `base` の設定が一致しているか確認する

### 画像が表示されない場合
- `base` を設定した場合、画像パスが `/base/images/xxx.jpg` になる
- 画像パスは `import.meta.env.BASE_URL` を使うと確実

---

## 今後の更新手順

ブログ記事や実績を追加・更新したら：

```bash
# 変更をコミット
git add .
git commit -m "記事追加: 記事タイトル"

# GitHubにプッシュ（自動でデプロイが始まる）
git push
```

---

*このファイルは作業が完了したら削除しても構いません。*
