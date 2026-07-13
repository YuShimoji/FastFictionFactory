# Operator Production Brief Typography Balance

`fff-operator-production-brief-typography-balance-001` は、受理済みの Operator Production Brief の本文・構造・package を変えず、`public/review/index.html?mode=blueprint` の最初の一画面だけを読みやすい文字階層へ整えた視覚修正です。人の理解判定 A は閉じたままにし、主タイトルの過剰な占有を抑え、要約、状態、制作規模、中心の問い、五つの完成条件へ自然に視線が流れるようにしました。

## 変えたものと保ったもの

Blueprint route に限定した CSS custom properties で、タイトル、本文、指標、指標ラベル、質問、節見出し、badge、microcopy の役割を一つの responsive type system にしました。タイトルは手動改行を入れず `clamp()` と自然な日本語改行で二行に収め、低い画面向けの旧 56px 上書きも同じ変数へ統合しています。印刷タイトルは 34px とし、Focus Shell、Audit & Files、footer などの utility chrome は従来どおり印刷しません。

可視文言、数字、順序、ID、四つの主要 section、六幕、19 shot、20 subtitle cue、五つの完成条件、Visual Grammar、Audit & Files、Light/Dark/Auto、focus、document-only scroll は変更していません。Handoff、Revision、Derivative、Production Blueprint、Operator Brief の計34ファイルも変更していません。

## 実測した文字階層

| viewport | 主タイトル | 行数 / block | 本文 | title/body | 指標 / label | 節見出し | first-view下端 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 900×1200 | 40px / 43.2px line-height | 2行 / 86.375px（7.198%） | 17px | 2.3529 | 22px / 11px | 26px | 837.640625px |
| 1280×900 | 48px / 51.84px line-height | 2行 / 103.65625px（11.517%） | 17.28px | 2.7778 | 28px / 11px | 33.92px | 803.359375px |

両方で要約、三つの状態表示、四つの規模指標、中心の問い、体験文、五つの完成条件、朗読助言まで初期 viewport に残りました。horizontal overflow、nested scroll owner、key block overlap、text clipping、孤立した一文字行はいずれも0です。

修正前は 900×1200 がタイトル63px・3行・200.296875px・first-view下端1080.375px、1280×900 が56px・2行・118.71875px・下端809.0625pxでした。内容を削らず、タイトルと周辺余白を比例して抑えることで、受理済みの first-view contract に余裕を戻しています。

## 内容とpackageの不変性

静的な primary-flow 可視文言は `8dd887dcfbb6d68cddb7ae00d46a94878b90ba73f6390f05f1247b6e849c60e8`、primary HTML は `0c977a8ab17857e151218ea72f6700d34cbf49311c38b496247a027b373e93d1` のままです。browserで正規化した全 root 可視文言は `8c61321ad73f991a0e113936790d5c1eec7a245c383b56dc220e92bd63d42379`、六幕すべての detail は `ccd25c3a452a7ed45f54f830c2deb041c26e556fd50f9290ac2272a41b0273ab` で修正前後が一致しました。

Operator model は `25d4cb98e988bc5faffee6f3f422103aa410806e057079153d3b434799e268e6`、Operator manifest は `05ca4f255018b3a67abfba558cfbd265e8206af3c99ee383b0c3adb5893d2d40` です。34 protected files の path / byte / SHA256 aggregate は `396736ea631f1964edd317b922ce985cbe6cde80240d98801eaab96d464d7b95`、既存67 result JSON の aggregate は `372a0088c16af8cd4c11748c568932e558911ec89e03cfc9df31480a9106183b` のままです。

## 検証とfail-closed probes

通常検証は読み取り専用です。

```powershell
node tools/fff-state.mjs validate-operator-production-brief-typography-balance artifacts/operator-production-brief-typography-balance-result.json
```

結果JSONだけを意図的に再生成する場合に限り、次を使います。

```powershell
node tools/fff-state.mjs smoke-operator-production-brief-typography-balance artifacts/operator-production-brief-typography-balance-result.json artifacts/operator-production-brief-typography-balance-result.json
```

validator は viewport bounds、比率の再計算、五条件の可視性、overflow / scroll / overlap / clipping / orphan、print、source fingerprints、34 package hashes、67 historical results、manifest screenshot hashes、既存 Operator / Blueprint validators を確認します。タイトル最大超過、最小未満、高さ超過、四行化、本文17px未満、titleとsection同率、metric競合、完成条件欠落、horizontal overflow、nested scroll、global counters、raw key、visible text変更、package hash変更、print title過大、manifest hash不一致の16 probeはすべてin-memoryで拒否し、artifactを書き換えません。

## Visual evidence

- `artifacts/review-screens/operator-production-brief-typography-balance-900x1200.png`
- `artifacts/review-screens/operator-production-brief-typography-balance-1280x900.png`

print media のbrowser実測はタイトル34px、line-height 37.4px、白背景で、Focus Shell、Audit & Files、footer は非表示です。

## 閉じた境界と次の入口

content、timing、order、truth、assets、rights、provider、credentials、generation、render、upload / publication、database、final canon は変更または承認していません。H1 Narration Read-Aloud は幕1・3・4・6の助言として残し、このsliceでは実行していません。H2 Asset / Shot Brief、asset選定、rights clearance、productionはいずれも別の明示承認が必要です。
