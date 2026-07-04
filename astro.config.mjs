import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// GitHub Pages デプロイ時は base を設定する必要があります
// username.github.io リポジトリの場合は base 不要
// それ以外の場合は base: '/リポジトリ名/' に変更してください
// 詳細は TODO.md を参照

export default defineConfig({
  site: 'https://web-studio-swing.com',
  integrations: [tailwind()],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
});
