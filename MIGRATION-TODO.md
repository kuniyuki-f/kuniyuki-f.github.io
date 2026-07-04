# WordPress → Astro 移行 タスク管理

> 最終更新: 2026-07-05

## Phase 1: 簡単な修正 ✅
- [x] 1-1. 404ページ作成
- [x] 1-2. OGPメタタグ追加（Layout.astro）
- [x] 1-3. お問い合わせフォームのフィールド修正（貴社名・電話番号追加、件名削除）
- [x] 1-4. Works「非公開案件」注釈追加

## Phase 2: コンテンツ完全一致 ✅
- [x] 2-1. ブログ記事の内容検証・補完（4記事） — WordPress元記事の完全版に差し替え
- [x] 2-2. プライバシーポリシーの不足セクション追加 — 「著作権について」「リンクについて」追加
- [x] 2-3. ホームページServiceセクション詳細確認 — 説明文をWP版に合わせて修正

## Phase 3: 機能追加 ✅
- [x] 3-1. カテゴリアーカイブページ作成 — /category/日記/, /category/プログラミング/ 生成済み
- [x] 3-2. コードブロックのシンタックスハイライト — Shiki (one-dark-pro) 設定済み
- [x] 3-3. 目次（Table of Contents）自動生成 — TableOfContents.astro コンポーネント作成
- [x] 3-4. ブログ記事の「最終更新日」表示 — updatedDateスキーマ追加、公開日と異なる場合のみ表示

## Phase 4: SEO・仕上げ ✅
- [x] 4-1. JSON-LD構造化データ — WebSite + Person スキーマ追加
- [x] 4-2. 旧URLからのリダイレクト設定 — /ap-r6sp-diary/, /review-2021/ 対応済み
- [ ] 4-3. フォームバックエンド実装（後日）— デプロイ後に決定

## Phase 5: 機械的比較に基づく差異修正 ✅
- [x] 5-1. サイト名称を「WEB工房 Swing」に統一（全ファイル）
- [x] 5-2. titleタグの区切り文字を「 - 」に変更（WP版と統一）
- [x] 5-3. Worksページ見出しを「Works」に修正、導入テキスト・注意書き追加
- [x] 5-4. Works説明文をWP版原文に修正
- [x] 5-5. ホームページtitleを「トップページ」に修正
- [x] 5-6. ProfileページのtitleをWP版「自己紹介」に修正
- [x] 5-7. Serviceセクション説明文をWP版に近づけ

## Phase 6: 目視比較によるバグ修正 ✅
- [x] 6-1. ブログ記事の文字色バグ修正 — `text-base` がTailwindカスタムカラー `#f4f3ec` と衝突していた。`text-[1rem]` に置換（global.css `.prose-content pre` と blog/[slug].astro `.single__content`）

## Phase 7: 旧URLリダイレクト・meta description（2026-07-05）✅
- [x] 7-1. 日本語スラッグ等の旧URLリダイレクト — `src/pages/[...oldPath].astro` で一括生成
  - 旧URL一覧は本番サイトの sitemap.xml から取得（ローカルWP/Docker不要だった）
  - 対応した旧URL: /webサイトを公開しました/, /チェックボックスinセレクトボックスなuiの実装方/, /work/（一覧+詳細3件 → /works/）, /category/diary/・/category/programming/（→ 日本語カテゴリページ）, /tag/jquery/（→ /blog/）
  - 日本語をファイル名にせず getStaticPaths のパラメータで生成（macOSのNFD正規化による文字化け対策）。dist出力がNFCであること、URLエンコード形が旧URLと一致することを検証済み
- [x] 7-2. meta descriptionの比較・調整 — 本番WP版と全ページ比較
  - WP版に統一: トップ / ブログ一覧 / お問い合わせ（内容が大きく違っていたため）
  - リライト版を維持: works・profile・privacy・ブログ4記事。WP版はAll in One SEOの本文自動抜粋で、privacy「…名前やメール」のように文の途中で切れているものが多く、リライト版の方が質が良いと判断

## 残タスク
- [ ] フォームバックエンド実装（Formspree / Googleフォーム / 自前サーバー）— デプロイ後に決定
- [ ] GitHub Pagesへのデプロイ — ユーザーのGO待ち（リモートリポジトリ作成・pushも保留中）
- [ ] 目視比較の最終確認（レスポンシブ含む）— ユーザー自身の目視確認を推奨

## 注意点（次回作業時に知っておくべきこと）
- **`text-base` の罠**: Tailwindの `text-base`（通常はfont-size: 1rem）がカスタムカラー `base: '#f4f3ec'` と衝突して `color: #f4f3ec` になる。フォントサイズを指定したい場合は `text-[1rem]` を使うこと
- **site URL**: `astro.config.mjs` に `site: 'https://web-studio-swing.com'` を設定済み。SNS共有ボタンのURLに反映される
- **ローカル起動方法**: Astro → `npm run dev`（ポート4321）/ WP → `docker compose up -d`（ポート8081）

## 技術スタック
- Astro 5.0.0 + Tailwind CSS 3.4.0
- Content Collections（blog: 4記事, works: 3件）
- Shiki (one-dark-pro) でシンタックスハイライト
- デプロイ: GitHub Pages（GitHub Actions設定済み）
- サイト正式名称: **WEB工房 Swing**

## 元サイト
- https://web-studio-swing.com/
- WordPress + カスタムテーマ (newPortfolio)

## ファイル構成（主要ファイル）
```
astro-site/
├── astro.config.mjs          # site URL, Shiki設定
├── tailwind.config.mjs        # カスタムカラー(base/brown/green), ブレイクポイント
├── src/
│   ├── layouts/Layout.astro   # 共通レイアウト（OGP, JSON-LD, GA）
│   ├── components/
│   │   ├── Header.astro       # ヘッダー（PC:アイコンナビ, SP:ハンバーガー）
│   │   ├── Footer.astro       # フッター
│   │   ├── BlogCard.astro     # ブログカードコンポーネント
│   │   ├── WorkCard.astro     # 実績カードコンポーネント
│   │   ├── ScrollToTop.astro  # ページトップボタン
│   │   └── TableOfContents.astro  # 目次コンポーネント
│   ├── pages/
│   │   ├── index.astro        # ホーム
│   │   ├── 404.astro          # 404ページ
│   │   ├── ap-r6sp-diary.astro    # 旧URLリダイレクト
│   │   ├── review-2021.astro      # 旧URLリダイレクト
│   │   ├── works/index.astro
│   │   ├── profile/index.astro
│   │   ├── blog/index.astro
│   │   ├── blog/[slug].astro     # ブログ記事（目次・SNS共有・更新日）
│   │   ├── contact/index.astro
│   │   ├── privacy/index.astro
│   │   └── category/[category].astro  # カテゴリアーカイブ
│   ├── content/
│   │   ├── config.ts          # スキーマ定義（blog: title,date,updatedDate,category,tags,thumbnail,excerpt）
│   │   ├── blog/              # 4記事のMarkdown
│   │   └── works/             # 3件のMarkdown
│   └── styles/global.css      # グローバルスタイル（prose-content等）
└── MIGRATION-TODO.md          # ← この進捗管理ファイル
```
