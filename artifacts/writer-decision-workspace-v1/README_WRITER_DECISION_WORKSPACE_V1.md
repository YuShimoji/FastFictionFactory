# Writer Decision Workspace v1

`fff-writer-decision-workspace-v1-001` は、Writer Source Adaptation v0 の provisional Narrative IR を上書きせず、実ファイル intake と明示的な Writer Decision Record から candidate-only successor を作るローカル evidence package です。

## できること

- UTF-8 `.md` / `.txt` を source path と小さな metadata sidecar から読み込む
- raw bytes、UTF-16 character range、UTF-8 byte range、line range、newline mapping を再現する
- proposal ごとに accept / reject / defer / replace を明示する
- `accept|replace`、`accepted_for_candidate`、writer-authorized provenance の三条件が揃った変更だけを適用する
- predecessor IR を保存したまま、新しい identity、完全な lineage、before/after diff を持つ successor IR を生成する
- existing Editorial Handoff field-family と互換な candidate input を生成する

## 境界

fixture-author の決定文は mechanism test のための明示入力であり、実プロジェクトの canon、文学的品質、production-ready script を成立させません。provider、media、rights、render、publication、production、final canon はすべて false のままです。

HTML は readback 専用です。決定を保存する editor ではなく、source、proposal provenance、decision result、successor diff、Handoff summary を確認するためのローカル表示面です。

## CLI

```text
node tools/fff-writer-decision-workspace.mjs ingest-markdown --source <source.md|source.txt> --metadata <metadata.json> --output-dir <dir>
node tools/fff-writer-decision-workspace.mjs validate-decision-record --input <decision-record-set.json>
node tools/fff-writer-decision-workspace.mjs apply-decisions --fixture-set <fixture-set.json> --output-dir <dir>
node tools/fff-writer-decision-workspace.mjs rebuild-format-selection --fixture-set <fixture-set.json> --output-dir <dir>
node tools/fff-writer-decision-workspace.mjs build-successor-ir --fixture-set <fixture-set.json> --output-dir <dir>
node tools/fff-writer-decision-workspace.mjs build-successor-handoff --fixture-set <fixture-set.json> --output-dir <dir>
node tools/fff-writer-decision-workspace.mjs build-decision-workspace --fixture-set <fixture-set.json> --output-dir <dir>
node tools/fff-writer-decision-workspace.mjs build-all --fixture-set <fixture-set.json> --output-dir <dir>
```

`validate-decision-record` は read-only で output option を拒否します。その他の generation action は明示的な `--output-dir` が必須です。
