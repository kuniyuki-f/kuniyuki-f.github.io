---
title: "チェックボックス IN セレクトボックスなUIの実装方法"
date: 2021-10-20
category: "プログラミング"
tags: ["jQuery"]
thumbnail: "/images/blog-default.jpg"
excerpt: "セレクトボックスの中にチェックボックスを配置するUIの実装方法を解説します。"
---

ホームページを制作する中で、デザインカンプに「セレクトボックスの中にチェックボックスが入っている」UIが含まれていたことはないでしょうか。

しかし、HTMLの仕様上、select要素の中にinput要素を使うことはできません。チェックボックスはinput要素で実装するため、HTMLだけではこのUIを作ることは不可能です。

筆者はこの課題に直面し、jQueryを使って解決しました。その実装方法をここに記録します。

## 結論：jQueryのslideToggleを使う

実装方法だけ知りたい方のために、まずソースコードのプレビューを掲載します。

**jQueryのslideToggleを使います。** このメソッドはスライドアニメーションで要素の表示/非表示を切り替えます。

CodePenでデモを公開しています：[Checkbox in Selectbox by jQuery](https://codepen.io/c501306014/pen/RwgmPPG)

### デフォルトを非表示にした上でdisplay:flexにしたい場合

`display: flex`でデフォルト非表示にしたい場合は、CSSとjQueryを以下のように修正します：

```css
/* チェックボックスの表示切替ボタン */
.checkbox-toggle {
  max-width: 362px;
  padding: 1em;
  text-align: center;
  cursor: pointer;
  background-color: skyblue;
}

/* チェックボックス */
.checkboxes {
  display: none;
  flex-direction: column;
  width: 360px;
  padding: 1em;
  border: 1px solid skyblue;
}
```

```javascript
jQuery(function(){
  jQuery('.checkbox-toggle').on('click', function(){
    jQuery('.checkboxes').slideToggle();
    jQuery('.checkboxes').css('display', 'flex');
  });
});
```

このコードをそのままCodePenにコピペすれば動作確認できます。

## ソースコードの解説

### HTML

form要素の中から抜粋（headでjQueryを読み込んでください）：

```html
<form>
  <!--   チェックボックスの表示切替ボタン   -->
  <div class="checkbox-toggle">
    ここをクリックまたはタップで開閉します
  </div>
  <!--   チェックボックス   -->
  <div class="checkboxes">
    選択してください
    <label>
      <input type="checkbox">
      <span>checkbox1</span>
    </label>
    <label>
      <input type="checkbox">
      <span>checkbox2</span>
    </label>
  </div>
</form>
```

jQueryで操作するのは以下の2つのdiv要素です。

- **checkbox-toggle**：チェックボックスの表示/非表示を切り替えるトグルボタン
- **checkboxes**：チェックボックスを格納するコンテナ

コンテナの中にはlabel要素が2つ入っており、それぞれにチェックボックス（input要素）が含まれています。

### CSS

特に難しいことはありません。色やボーダーでシンプルにスタイリングしています。

```css
/* チェックボックスの表示切替ボタン */
.checkbox-toggle {
  max-width: 362px;
  padding: 1em;
  text-align: center;
  cursor: pointer;
  background-color: skyblue;
}

/* チェックボックス */
.checkboxes {
  display: flex;
  flex-direction: column;
  width: 360px;
  padding: 1em;
  border: 1px solid skyblue;
}
```

### JavaScript

コメントを除けばたった5行です。WordPressとの互換性のため、`$`ではなく`jQuery`を使用しています。

```javascript
jQuery(function(){
  // チェックボックスの表示切替ボタンのクリックイベントを検知
  jQuery('.checkbox-toggle').on('click', function(){
    // チェックボックスの表示をslideToggleで切り替える
    jQuery('.checkboxes').slideToggle();
  });
});
```

**コードの解説：**
- **1行目：** HTMLの読み込みが完了したら処理を実行
- **3行目：** チェックボックス表示切替ボタン（class: checkbox-toggle）がクリックされたら処理を実行
- **5行目：** チェックボックスコンテナ（class: checkboxes）の表示をアニメーション付きで切り替える

## まとめ

jQueryの`slideToggle`メソッドを使えば、セレクトボックスの中にチェックボックスがあるようなUIを簡単に実装できます。厳密にはセレクトボックスではありませんが、デザイン上の動作を再現できます。

`slideToggle`はアコーディオンメニューなど類似のUIパターンにも活用できます。誤りやコーディングについての質問があれば、[お問い合わせフォーム](/contact/)または[Twitter](https://twitter.com/swing_web)までご連絡ください。
