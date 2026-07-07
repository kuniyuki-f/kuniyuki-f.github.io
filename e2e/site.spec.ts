import { test, expect, type Page as PwPage } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPages, getAllHtmlFiles, resolveInternalLink } from './pages';

const screenshotDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'screenshots');
fs.mkdirSync(screenshotDir, { recursive: true });

const pages = getPages();

// Google Analytics や Material Icons など外部リソース由来のノイズは無視し、
// サイト自身（localhost）のエラーだけを拾う。
const EXTERNAL_NOISE = /googletagmanager|google-analytics|gstatic|googleapis|gtag|doubleclick|fonts\.google/i;

function watchConsole(page: PwPage): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const where = msg.location()?.url ?? '';
    const text = msg.text();
    if (EXTERNAL_NOISE.test(where) || EXTERNAL_NOISE.test(text)) return;
    errors.push(`${text} @ ${where}`);
  });
  page.on('pageerror', (err) => {
    if (EXTERNAL_NOISE.test(err.message)) return;
    errors.push(`pageerror: ${err.message}`);
  });
  return errors;
}

test.describe('全ページ × 3ビューポートの表示検証', () => {
  for (const p of pages) {
    test(`${p.name}`, async ({ page }, testInfo) => {
      const viewport = testInfo.project.name;
      const consoleErrors = watchConsole(page);

      // 1. 正常に描画される（HTTPステータス）
      const res = await page.goto(encodeURI(p.route), { waitUntil: 'load' });
      expect(res, 'レスポンスが取得できること').toBeTruthy();
      expect(res!.status(), `${p.route} が正常ステータスで返ること`).toBeLessThan(400);

      // 主要ランドマーク（header / footer は共通レイアウト、本文は main/article/section のいずれか）
      await expect(page.locator('header').first()).toBeAttached();
      await expect(page.locator('footer').first()).toBeAttached();
      const mainCount = await page.locator('main, article, section').count();
      expect(mainCount, '本文ランドマークが存在すること').toBeGreaterThan(0);

      // 6. フルページスクリーンショットを保存（後続の検証が失敗しても目視できるよう先に撮る）
      await page.screenshot({
        path: path.join(screenshotDir, `${p.name}-${viewport}.png`),
        fullPage: true,
      });

      // 2. 横スクロールが発生していない
      const overflow = await page.evaluate(() => {
        const el = document.scrollingElement || document.documentElement;
        return el.scrollWidth - el.clientWidth;
      });
      expect(overflow, `横スクロールが無いこと（超過px）[${viewport}]`).toBeLessThanOrEqual(1);

      // 4. 画像の読み込み失敗がない（読み込み完了済みで naturalWidth===0 のものを検出）
      const brokenImages = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.currentSrc || img.src)
      );
      expect(brokenImages, '読み込みに失敗した画像が無いこと').toEqual([]);

      // 3. コンソールエラーが出ていない（サイト自身のもののみ）
      expect(consoleErrors, 'サイト由来のコンソールエラーが無いこと').toEqual([]);
    });
  }
});

// 7. モバイル幅でハンバーガーメニューを開くと項目が見えること
test('モバイル: ハンバーガーメニューの開閉', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'モバイル幅のみ対象');
  await page.goto('/');

  const hamburger = page.locator('#hamburger-btn');
  const drawer = page.locator('#drawer');
  await expect(hamburger).toBeVisible();

  // 開く前はドロワー内リンクは見えない
  const firstLink = drawer.locator('a').first();
  await expect(firstLink).toBeHidden();

  await hamburger.click();
  await expect(firstLink).toBeVisible();
  await expect(drawer.locator('a')).toHaveCount(4);
});

// 5. 内部リンク切れチェック（dist を静的に走査）。ビューポート非依存なので1回だけ実行。
test('内部リンク切れが無いこと', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'リンク検査は1回だけ実行');

  const broken: string[] = [];
  const hrefRe = /<a\b[^>]*\bhref=["']([^"']+)["']/gi;
  for (const { route, html } of getAllHtmlFiles()) {
    for (const m of html.matchAll(hrefRe)) {
      const resolved = resolveInternalLink(m[1]);
      if (resolved && !resolved.exists) {
        broken.push(`${route} -> ${m[1]}`);
      }
    }
  }
  expect(broken, `内部リンク切れ:\n${broken.join('\n')}`).toEqual([]);
});

// 404ページが 404 ステータスで本文とともに返ること
test('404ページの表示', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', '1回だけ実行');
  const res = await page.goto('/this-page-does-not-exist-xyz/', { waitUntil: 'load' });
  expect(res!.status()).toBe(404);
  await expect(page.locator('header').first()).toBeAttached();
  await expect(page.locator('footer').first()).toBeAttached();
});
