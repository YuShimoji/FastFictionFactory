# Writer Decision Workspace v1 Review

> Integration note (2026-07-28): this candidate-only workspace is registered on `codex/fff-case-digest-writer-integration-v1` and is now part of the root read-only health chain. Integration does not turn fixture decisions into project canon or production authority.

## 実行範囲

開始時点は branch `codex/fff-writer-source-adaptation-v0-planner`、HEAD `11c30b264f8f257cc802ac218998479b805648e7`、parent `bcdf84e4d89f26bf41d288f8282d7ae50911cc1e`。worktree は clean、staged 0、untracked 0 で、v1 target path は未作成だった。

既存 control-plane、root manifest、current-status/handoff 正本、Editorial Handoff consumer、製品 package、画像、音声、動画、字幕、timing、rights、production、quarantine は変更していない。

## 生成結果

| 検証面 | 結果 | 意味 |
|---|---|---|
| CASE_DIGEST Markdown intake | 2803 UTF-8 bytes、46 lines、5 segments、reconstruction pass | source text を fixture JSON に埋めず actual bytes へ追跡 |
| Decision Records | proposal 6 + fragment 5、schema valid | acceptance は record と provenance が揃う場合だけ成立 |
| Proposal application | applied 3、deferred 2、rejected 1、missing decision 2 | silent application 0 |
| Impact scope | L0 replace、L1 section、L2 section-local、L3 re-selection evaluation | 適用範囲を impact level に固定 |
| Successor IR | parent-bound の新 identity、exact diff 4、candidate-only | predecessor を保存したまま候補を version 化 |
| Fragment | before incomplete / links 2 / Handoff none → after complete / links 0 / CASE_DIGEST | fixture-author text だけで mechanism を実証 |
| Handoff | existing v0 input schema pass、consumer compatibility true | downstream consumer を変更せず field-family を維持 |

successor IR は `narrative-ir-writer-proposal-successor-8e4f2b633a40`。parent は `narrative-ir-writer-proposal-roundtrip` である。accepted CASE_DIGEST は前後とも `CASE_DIGEST`、five-section semantics は不変、unsupported factual claim count は 0。

## Proposal ごとの扱い

| Proposal | Impact | Decision | 適用結果 |
|---|---|---|---|
| opening wording | L0 | replace | writer-authored exact text を narration/caption へ適用 |
| Council motive undecided | L1 | accept | section 4 のみ更新 |
| ledger relation explanation | L2 | accept | section 3 のみ更新 |
| evidence/allegation reorder | L3 | defer | format re-selection と capacity 評価だけ実行 |
| brother survival outcome | AUTHOR_DECISION_REQUIRED | defer | unapplied のまま表示 |
| Council guilt | FORBIDDEN_UNSUPPORTED_INFERENCE | reject | successor への混入なし |
| moth clarification / repeated clue removal | L1 | missing decision | unapplied のまま表示 |

## Determinism と runtime

- `node --test tests/fff-writer-decision-workspace.test.mjs`: 15/15 pass
- `build-all` の二回生成 core SHA-256: `b63db2617989697fb4da3e403a888d3ed0a9163ca5d0a133625bc2a6c4adc70b`
- committed generated files と二つの temporary run は byte-identical
- schema 4 件は parse/sample validation pass。各 schema は required field 欠落 sample を reject
- 1360×900: runtime ready、二列 source/diff layout、horizontal overflow なし
- 390×844: runtime ready、一列 source/diff layout、horizontal overflow なし
- console error 0、warning 0、外部 resource request 0
- form 0、editable controls 0、readback filter 外 button 0

HTML の五つの button は decision action ではなく、既存 result 行を絞り込む readback filter である。

## 保護同一性

| Group | Files | preflight Git tree-listing SHA-256 |
|---|---:|---|
| Writer Source Adaptation v0 | 24 | `be93f125593ef7180ca8ebb94818327255dc743139264f0b19a4adcf3a0c0d5b` |
| accepted CASE_DIGEST | 12 | `03800253c0621348e6f25e85cd83e9dfa68e5aaf3f75637d9d7d874369ceb4ab` |
| Editorial downstream | 28 | `3e5a830f618cf328195ac3d320ca0bd9de50507e09293a5e542f6a267c82e141` |
| Narrative–Visual Binding | 1 | `720b0bc4d9c85ad6d4fa021e600cf2bf812280f68b4a3966221679d2d0ec5d69` |

predecessor commit からこれら protected paths への diff は 0。network、provider、model、credential、image/audio/video/media generation、render、publication、public effect はすべて 0。

## 残る author decisions

CASE_DIGEST の鐘の音源、兄の所在、台帳の出所と真正性、Council の関与・責任・動機、真鍮の蛾の機能は引き続き author-owned である。moth clarification と repeated clue removal には decision record がなく、reorder と brother outcome は defer、Council guilt は reject されている。

次に進む場合も、実 source 用の writer/editor/product-owner decision record を別 authority で作る必要がある。この fixture result は arbitrary novel adaptation、文学的品質、自動 canon completion、production-ready script、media/rights/release/publication readiness を示さない。
