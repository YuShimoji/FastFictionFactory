# Writer Decision Workspace v1

`fff-writer-decision-workspace-v1-001` は、Writer Source Adaptation v0 が列挙した proposal と `AUTHOR_DECISION_REQUIRED` を、明示的な decision record から candidate-only successor へ反映するローカル層である。v0 Narrative IR と既存 Editorial Handoff consumer は変更しない。

## 境界と能力差

| v0 まで | v1 で追加した契約 | 依然として行わないこと |
|---|---|---|
| structured annotation JSON が source file を指す | 実 `.md` / `.txt` と小さな metadata sidecar を直接 intake | 任意小説の自動解釈 |
| proposal は分類のみ | accept / reject / defer / replace を耐久 record 化 | proposal の存在だけで acceptance を推定 |
| provisional IR は不変 | accepted writer-authorized text だけから versioned successor を生成 | predecessor IR の上書き |
| fragment は順序・因果欠落で停止 | fixture-author が明示した順序・橋・format から candidate Handoff を生成 | 無記名の因果・結末・canon 補完 |
| readback は source adaptation 全体 | source、proposal、decision、diff、Handoff を同一 workspace に表示 | HTML から decision を保存 |

## Raw Markdown intake

`ingest-markdown` は UTF-8 bytes を fatal decode し、`.md` または `.txt` 以外を拒否する。入力 JSON は source path、source ID、line-range metadata、format metadata だけを持ち、全文 prose を複製しない。

出力は次を固定する。

- raw UTF-8 byte size / SHA-256
- UTF-16 character range と UTF-8 byte range
- line number、line text SHA-256、newline kind
- metadata segment の character / byte / line range
- CRLF / CR / LF から LF への非意味的 mapping
- original text hash と normalized-newline text hash

newline mapping は記録だけであり、semantic normalization は常に false である。実 source bytes を再読し、すべての line/span を character slice と byte slice の両方から復元できなければ fail closed する。

## Writer Decision Record

decision record は proposal 単位で、actor、action、affected source spans、accepted text、provenance、candidate canon status、downstream impact、deterministic marker、rationale、reversibility を保持する。

適用条件は三つすべてが必要である。

1. `action` が `accept` または `replace`
2. `canon_status` が `accepted_for_candidate`
3. accepted text が `writer_authored_proposal` または `source_authorized_text` の exact Markdown span に一致

reject、defer、missing decision は表示に残るが適用しない。`FORBIDDEN_UNSUPPORTED_INFERENCE` は editorial wording では解除できず、fixture の Council guilt assertion は reject のまま successor に入らない。

## Impact と再構築範囲

| Impact | 許される処理 | v1 fixture evidence |
|---|---|---|
| L0 | narration/caption wording の局所置換 | opening wording を explicit replace |
| L1 | subject explanation を affected section だけ更新 | Council motive を undecided と明記 |
| L2 | relation/section を affected section だけ再構築 | ledger section の因果未確認説明 |
| L3 | format re-selection と full capacity evaluation | reorder proposal は defer され、評価だけ実行 |
| AUTHOR_DECISION_REQUIRED | auto-apply 不可 | brother outcome は defer |
| FORBIDDEN_UNSUPPORTED_INFERENCE | apply 不可 | Council guilt は reject |

## Successor identity と Handoff

successor IR は parent Narrative IR の ID、stable byte hash、applied/rejected/deferred decision IDs、すべての source lineage、before/after structural diff、candidate-only boundary を持つ。ID は self-reference を除いた successor content SHA-256 から導出し、predecessor を書き換えない。

Handoff は既存 `fff.editorialHandoffInput.v0` field-family を維持する。sections/beats、narration、captions、visual-intent placeholders、truth boundaries、continuity IDs を供給し、production、media、rights、provider、render、publication、final canon は false のままにする。

## Fragment completion demonstration

before state は order が `[null,null,null]`、missing causal links が 2、Handoff が null である。after state は fixture-author が専用 Markdown で明示した order、二つの bridge、current status、format decision の五 record だけを適用する。

これにより CASE_DIGEST candidate と downstream-compatible Handoff が生成されるが、証明されるのは mechanism だけである。fixture text は実プロジェクト canon でも文学的品質の証明でもなく、production-ready script でもない。

## CLI

生成 action はすべて `--output-dir` を要求する。

```text
ingest-markdown
apply-decisions
rebuild-format-selection
build-successor-ir
build-successor-handoff
build-decision-workspace
build-all
```

`validate-decision-record` だけが read-only action で、`--output-dir` を拒否し `writes_performed=0` を返す。
