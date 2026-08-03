# デンソウ長尺シリーズ Source Intake v1

## 現在状態

`DEPENDENCY_MISSING`。ユーザーは「デンソウ」の作者・権利者であり、Fast Fiction Factory内のprivate開発で原作・素材を全面的に改変してシリーズ／episode制作へ使用できます。ただし、正確な原文bytes、locator、revisionはまだ提供されていません。

この許諾から、原文の創作・補完、複数版の無断選択、外部provider、credentials、公開、release、production approval、third-party rights clearance、human acceptance、final canonを推論しません。

## 主成果物

- `artifacts/densou-series-intake/densou-authority-input.json`
- source／series／season／episode用のversioned JSON Schema 4点
- `tools/fff-densou-series-intake.mjs`
- `tests/fff-densou-series-intake.test.mjs`
- `artifacts/densou-series-intake/densou-series-intake.html`

## 原文到着時の経路

```powershell
node tools/fff-densou-series-intake.mjs status `
  --authority artifacts/densou-series-intake/densou-authority-input.json `
  --source 'C:\path\to\densou.txt'

node tools/fff-densou-series-intake.mjs init `
  --authority artifacts/densou-series-intake/densou-authority-input.json `
  --source 'C:\path\to\densou.txt' `
  --out 'C:\path\to\new-empty-densou-packet'

node tools/fff-densou-series-intake.mjs verify `
  --packet 'C:\path\to\new-empty-densou-packet'
```

`init`は原文を変更せずsnapshotへcopyし、exact locator、byte size、SHA-256、revision ID、authority receipt、whole-source span、series／season／episode stub、local readback、evidence manifestを生成します。Episode 1は`source_bound_adaptation_pending`から開始し、source spans、working title、adaptation、viewer artifactを空のまま保持します。

## 次slice

一つの正本原文が到着したら、上記経路でhash-bound packetを作成します。そのpacketだけをauthorityとしてsource spanを選び、第1話の長尺構成、script、caption、private local viewer artifactを別sliceで実装・検証します。
