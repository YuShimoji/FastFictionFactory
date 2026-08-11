# デンソウ長尺シリーズ Source Intake v1

## 現在状態

`DURABLE_BINDING_READY`。actual Densouはこのwork orderでは要求もbindingもしていません。`artifacts/sample-raw-memo.md`、SHA-256 `256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32`と全派生lineageはwrong-source evidenceとしてquarantine済みです。

Tracked authority inputは`legacy_fixture_template_non_authoritative`へ降格され、`source_binding.authoritative=false`です。唯一のactive authorityはignored local vaultのversioned binding recordです。外部pathは`bind-source`だけが一度受け取り、portable recordsには保存しません。

## 主成果物

- `artifacts/densou-series-intake/densou-authority-input.json`
- source／series／season／episode用のversioned JSON Schema 4点
- `tools/fff-densou-series-intake.mjs`
- `tests/fff-densou-series-intake.test.mjs`
- `artifacts/densou-series-intake/densou-series-intake.html`
- `artifacts/densou-durable-source-binding/binding-contract.json`
- `tools/fff-densou-durable-source-binding.mjs`
- `tests/fff-densou-durable-source-binding.test.mjs`
- `artifacts/densou-durable-source-binding-synthetic-e2e-001`

## future actual sourceの一回限り経路

```powershell
node tools/fff-densou-durable-source-binding.mjs bind-source `
  --path 'C:\path\to\one-time-authoritative-actual-densou-source.md' `
  --revision '<explicit-revision>' `
  --canon-label '<explicit-canon-label>' `
  --provenance-assertion '<explicit-provenance>' `
  --rights-assertion '<explicit-rights-assertion>'
```

一回のcommandがstrict UTF-8 byte copy、original/canonical hash、binding record、verify、ingest packet、noncanon first materialを完了します。中断後は返された`binding_id`で`resume`し、元pathを再入力しません。`status/init/verify/materialize`も同じresolverだけを使います。

## 現在のsuccessor

Synthetic noncanon proofはbinding `densou-binding-f17e7e10ed3d38ebb035`からsource-bound ingest packetとepisode/voice seedをmaterializeしました。これはarchitecture proofであり、actual Densou successorではありません。旧quick-win、12分Episode、180秒video、audio repair、残り540秒はquarantined historical evidenceのままです。
