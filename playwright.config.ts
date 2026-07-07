import { defineConfig, devices } from '@playwright/test';

// ビルド済みの dist を astro preview で配信し、その上でテストする。
const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  // 表示検証なので並列は控えめに（スクショの安定性優先）
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL,
  },
  // モバイル / タブレット / デスクトップの3幅で同じテストを回す。
  // 幅の追加・変更はここだけ直せばよい。
  projects: [
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: `pnpm run preview --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
