# Beat 4 Composition Counterexample

`評議会の影`（01:20–01:45）だけを対象に、Beat 2 で成立した構図判断が別の画面課題でも通用するかを確かめる H0 構図反例です。全編19ショットへの展開、素材選定、権利処理完了、最終モーション、レンダー、正史判断は行いません。

## 収録内容

- `beat4-composition-counterexample.html`: 3ショットを横断して確認する単一HTML
- `beat4-composition-counterexample.json`: 正規のショット、構図、出典、境界データ
- `reference-sources.csv`: 6点のローカル参照画像と取得・ライセンス情報
- `shot-composition-map.csv`: crop、配置、焦点、視線、層、連続性の表
- `H1_TRANSFER_REVIEW.md`: 人間または監修AIが記入する未実施レビュー票
- `beat4-composition-counterexample-contact-sheet.jpg`: 6点の参照画像一覧
- `composition-assets/`: EXIFを除去し、長辺1600px以下へ正規化したローカル参照画像
- `manifest.json`: パッケージ内ファイルのSHA-256

## 3つの構図クラス

| Shot | 時間 | 構図クラス | 成立条件 | 禁止する読み |
| --- | --- | --- | --- | --- |
| `shot-b04-01` | 01:20–01:28 | anonymous institutional depth | 半透明の仕切り、顔を読めない複数の影、奥行きの3層がある | 実在人物の特定、有罪、悪役化 |
| `shot-b04-02` | 01:28–01:36 | equal-weight abstract comparison | 左右50/50、同じ22px、同一色・コントラスト、勝者記号なし | どちらかの仮説を事実・優勢とする |
| `shot-b04-03` | 01:36–01:45 | environment-plus-document tension | 閉じた環境と台帳の影を別層で残す | 動機、責任、台帳の真正を確定する |

## 開き方

`beat4-composition-counterexample.html` をローカルブラウザで開きます。既定は `Auto` で、`Light` / `Dark` を明示切替できます。印刷時はLightへ固定されます。画像はすべて同梱ローカルファイルで、外部ホットリンクはありません。

## 検証

```powershell
node tools/fff-state.mjs validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json
```

上記は読み取り専用です。派生ファイルを再構築する必要がある場合だけ、次を使います。

```powershell
node tools/fff-state.mjs smoke-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json
```

Smoke が書き換えられるのは、Beat 4 パッケージの `manifest.json`、ルートの結果JSON、contact sheetなどの Beat 4 派生物だけです。参照元4パッケージは変更しません。

## 出典と権利境界

各素材の作者、source page、original media、取得URL、ライセンス、ライセンスURL、取得日、元・取得・ローカル寸法、ローカルSHA-256は `reference-sources.csv` と正規JSONに記録しています。素材は構図参照専用であり、`selected_for_production=false`、`rights_cleared_claim=false` です。公開・制作採用の判断には別途、人間による出典・権利確認が必要です。

## H1への受け渡し

H1は未実施です。`H1_TRANSFER_REVIEW.md` の Phase A ではHTMLだけを見て各ショットを自由記述し、その後だけ Phase B で正規JSON等と比較して分類してください。Critical semantic misread が1件でもあれば合格にせず、自動展開もしません。レビュー票は意図的に未記入で、H0から結果を先取りしません。
