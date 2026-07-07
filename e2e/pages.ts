import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// dist/ を走査してページ一覧を作る。ページを足しても再ビルドすれば自動で対象に入る。
const distDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');

export type Page = {
  name: string; // スクショのファイル名に使う（例: home, blog-web-site-open）
  route: string; // 配信URLのパス（例: /, /blog/）
};

// dist 以下の *.html を再帰的に集める
function walkHtml(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// meta refresh によるリダイレクト用スタブページか判定する
function isRedirect(html: string): boolean {
  return /http-equiv=["']refresh["']/i.test(html);
}

// dist の相対パスから配信ルートを作る
function toRoute(relFromDist: string): string {
  const posix = relFromDist.split(path.sep).join('/');
  if (posix === 'index.html') return '/';
  if (posix.endsWith('/index.html')) return '/' + posix.slice(0, -'index.html'.length);
  return '/' + posix; // 404.html など index 以外
}

// ルートからスクショ用の名前を作る（/ -> home, /blog/ -> blog）
function toName(route: string): string {
  const trimmed = route.replace(/^\/|\/$/g, '');
  return trimmed === '' ? 'home' : trimmed.replace(/\//g, '-');
}

// 表示検証の対象ページ（リダイレクトスタブと 404.html は除外）
export function getPages(): Page[] {
  const files = walkHtml(distDir).sort();
  const pages: Page[] = [];
  for (const file of files) {
    const rel = path.relative(distDir, file);
    if (path.basename(rel) === '404.html') continue; // 404 は専用テストで扱う
    const html = fs.readFileSync(file, 'utf-8');
    if (isRedirect(html)) continue;
    const route = toRoute(rel);
    pages.push({ name: toName(route), route });
  }
  return pages;
}

// 内部リンク切れチェック用。全ページ（リダイレクト含む）の a[href] を集める。
export function getAllHtmlFiles(): { file: string; route: string; html: string }[] {
  return walkHtml(distDir)
    .sort()
    .map((file) => ({
      file,
      route: toRoute(path.relative(distDir, file)),
      html: fs.readFileSync(file, 'utf-8'),
    }));
}

// 内部リンクの参照先が dist 内に存在するか確認する
export function resolveInternalLink(href: string): { target: string; exists: boolean } | null {
  // 外部・アンカー・mailto などは対象外
  if (/^(https?:)?\/\//i.test(href)) return null;
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(href)) return null;

  // クエリ・フラグメントを落とす
  let clean = href.split('#')[0].split('?')[0];
  if (clean === '') return null;
  if (!clean.startsWith('/')) return null; // 相対リンクはこのサイトでは使っていない前提

  let candidate: string;
  if (clean.endsWith('/')) {
    candidate = path.join(distDir, clean, 'index.html');
  } else if (path.extname(clean) !== '') {
    candidate = path.join(distDir, clean); // 画像やファイルへの直リンク
  } else {
    // 拡張子なし・末尾スラッシュなし → ディレクトリ扱いを試す
    const asDir = path.join(distDir, clean, 'index.html');
    const asHtml = path.join(distDir, clean + '.html');
    candidate = fs.existsSync(asDir) ? asDir : asHtml;
  }
  return { target: clean, exists: fs.existsSync(candidate) };
}
