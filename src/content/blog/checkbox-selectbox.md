---
title: "チェックボックス IN セレクトボックスなUIの実装方法"
date: 2021-10-20
category: "プログラミング"
thumbnail: "/images/blog-default.jpg"
excerpt: "セレクトボックスの中にチェックボックスを配置するUIの実装方法を解説します。"
---

セレクトボックス（`<select>`要素）の中にチェックボックスを配置するようなUIを実装する方法を紹介します。

## そもそも何がしたいのか

通常のセレクトボックスは1つしか選択できませんが、複数選択できるドロップダウンUIを作りたいことがあります。

```html
<!-- こんな感じのUI -->
<div class="custom-select">
  <button class="select-trigger">選択してください ▼</button>
  <div class="select-dropdown">
    <label><input type="checkbox" value="1"> 選択肢1</label>
    <label><input type="checkbox" value="2"> 選択肢2</label>
    <label><input type="checkbox" value="3"> 選択肢3</label>
  </div>
</div>
```

## CSS でスタイリング

```css
.custom-select {
  position: relative;
  display: inline-block;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  display: none;
  z-index: 100;
}

.custom-select.is-open .select-dropdown {
  display: block;
}
```

## JavaScript で開閉制御

```javascript
const selectWrapper = document.querySelector('.custom-select');
const trigger = selectWrapper.querySelector('.select-trigger');

trigger.addEventListener('click', () => {
  selectWrapper.classList.toggle('is-open');
});

// クリック外で閉じる
document.addEventListener('click', (e) => {
  if (!selectWrapper.contains(e.target)) {
    selectWrapper.classList.remove('is-open');
  }
});
```

## まとめ

ネイティブの `<select>` 要素をカスタマイズするのは難しいので、divとcheckboxを組み合わせてセレクトボックス風のUIを自作するのが良い方法です。アクセシビリティにも気をつけてARIA属性を追加することをお勧めします。
