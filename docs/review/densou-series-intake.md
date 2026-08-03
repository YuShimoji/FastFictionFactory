# デンソウ長尺シリーズ Source Intake v1

## 現在状態

`CONTINUE`。旧`DEPENDENCY_MISSING`は、既存repository素材を制作入力として選択してよいという現在のユーザーoverrideで解放されました。Primaryは`artifacts/sample-raw-memo.md`、SHA-256は`256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32`、revisionは`densou-256837a94afd521c`です。

Primaryはファイル自身が「Sample Raw Memo」と表示する既存repository fixtureであり、別送されたデンソウ原典全文とは表現しません。story spine、CASE_DIGEST、draft review packは派生supporting evidenceです。この許諾から、外部provider、credentials、公開、release、production approval、third-party rights clearance、human acceptance、final canonを推論しません。

## 主成果物

- `artifacts/densou-series-intake/densou-authority-input.json`
- source／series／season／episode用のversioned JSON Schema 4点
- `tools/fff-densou-series-intake.mjs`
- `tests/fff-densou-series-intake.test.mjs`
- `artifacts/densou-series-intake/densou-series-intake.html`

## 選定済みbasisの再現経路

```powershell
node tools/fff-densou-series-intake.mjs status `
  --authority artifacts/densou-series-intake/densou-authority-input.json `
  --source artifacts/sample-raw-memo.md

node tools/fff-densou-series-intake.mjs init `
  --authority artifacts/densou-series-intake/densou-authority-input.json `
  --source artifacts/sample-raw-memo.md `
  --out 'C:\path\to\new-empty-densou-packet'

node tools/fff-densou-series-intake.mjs verify `
  --packet 'C:\path\to\new-empty-densou-packet'
```

`init`は選定済みprimaryを変更せずsnapshotへcopyし、exact locator、byte size、SHA-256、revision ID、authority receipt、whole-source span、series／season／episode stub、local readback、evidence manifestを生成します。Episode 1 quick-winは別のdeterministic toolでこのidentityを引き継ぎます。

## 現在のsuccessor

`fff-densou-series-episode-quickwin-001`が、12分・8セグメントのEpisode 1 review treatment、Season 1の6 investigation slots、source fact boundary、offline HTML、evidence manifestを提供します。入口は`artifacts/densou-series-episode-quickwin-001/densou-episode-001-review.html`です。
