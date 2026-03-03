/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // Tailwindのデフォルトブレイクポイントを上書き（WordPressのブレイクポイントに合わせる）
    screens: {
      sm: { max: '767px' },   // スマホ (max-width: 767px)
      md: { max: '1024px' },  // タブレット (max-width: 1024px)
      lg: { max: '1280px' },  // 小さいPC (max-width: 1280px)
    },
    extend: {
      colors: {
        // WordPress テーマ newPortfolio のカラーパレット
        base: '#f4f3ec',    // クリーム色（背景・ベース）
        brown: '#59483b',   // ブラウン（ヘッダー・フッター・ボタン）
        green: '#16a34a',   // グリーン（リンク・アクセント）
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'ヒラギノ角ゴ ProN', 'Hiragino Kaku Gothic ProN', 'メイリオ', 'Meiryo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
