# Writer Source Adaptation v0 review

## 判定

`fff-writer-source-adaptation-v0-001` は、現在の受理済み CASE_DIGEST を source-bound な IR と Editorial Handoff input へ変換し、同時に不適合な linear-lore、順序不明の fragments、canon 未承認の writer proposal を止めるローカル上流面として acceptance を満たしている。

この判定はこの package と fixture に限る。current default artifact、既存 product package、quarantine、production/rights/canon の状態は変更していない。

## 4 fixture の結果

| Fixture | 判定 | 容量・構造の主要値 | 下流へ進める状態 |
| --- | --- | --- | --- |
| accepted CASE_DIGEST | `CASE_DIGEST` を選択 | 180秒、515文字、5節、2 named entities / unexplained 0、2 primary events、missing causal links 4、density 3 | 5 narration、11 caption、11 visual placeholder。`fff.editorialHandoff.v1` field-family 互換 `true` |
| quarantined linear-lore | `AUTHOR_DECISION_REQUIRED`; `SHORT_DRAMA` は `REJECTED` | 180秒、631文字、6 Beats、5 names / unexplained 3、enacted action 0、causal step 0、missing causal links 6、exposition 14、density 8.953 | 安全な format を選ばず Handoff は生成しない |
| fragment bundle | `AUTHOR_DECISION_REQUIRED` | 94文字、3 fragments、reveal order はすべて `null`、causal edge 0、missing edge 2、density 2.183 | 5 author decisions を残し Handoff は生成しない |
| writer proposal roundtrip | base の `CASE_DIGEST` を維持、proposal overall は `FORBIDDEN_UNSUPPORTED_INFERENCE` | base と同じ515文字。8 changes、12 author decisions | base Handoff は互換のまま。proposal は `not_applied`、canon auto-accept は `false` |

CASE_DIGEST の missing causal links は「事件をドラマとして完結させた」という意味ではない。CASE_DIGEST contract は観測、報告、証拠限界、現状を保つため安全に通る一方、同じ素材を SHORT_DRAMA と見なすには enacted causality が足りない。この差を format selector が明示している。

## 出典と authority の監査

全 source packet について、source file の UTF-8 byte size / SHA-256、source-span ID、UTF-16 character range、UTF-8 byte range、exact text、exact-text SHA-256 を実ファイルから再現した。historical linear-lore の narration と Beat title はそれぞれ既存の `narration-clarity-v1.md` と `story-spine-clarity-v1.md` に結び、意味のある Beat 名を adapter-generated label として扱っていない。

Narrative IR の story statement、narration、caption、evidence status、entity、first introduction、section label は source span へ解決する。非物語の placeholder と missing-edge marker だけが `adapter_generated_non_factual` で、writer-authored proposal text は専用 span と `writer_authored_proposal` origin を持つ。4 fixture とも material lineage は complete、unsupported factual claim は 0 だった。

Story Authority Ledger は指定された11 classes を保持し、各 entry に source span、normalized/original wording、source status、certainty、proposal mutability、human ownership、canon status、downstream consumers がある。reported claim、allegation、unresolved、forbidden inference を established fact へ昇格していない。

## proposal と下流 contract

proposal fixture は add / remove / replace / reorder / clarify / mark undecided / attach writer-authored text を含む。分類は `L0 wording only`、`L1 subject explanation`、`L2 relation or section impact`、`L3 format or structure impact`、`AUTHOR_DECISION_REQUIRED`、`FORBIDDEN_UNSUPPORTED_INFERENCE` をすべて実例で覆う。既存 revision wording と新規 writer-authored wording は origin を分離し、8件すべて `auto_accept=false` とした。兄の生存案は author decision、評議会の guilt 断定は forbidden として未適用である。

downstream audit は actual Editorial Handoff、Revision、Derivative、Production Blueprint、accepted CASE_DIGEST を path / schema version / SHA-256 で読んだ。map に保存したのは upstream compatibility に必要な field だけであり、downstream 全体を複製・再設計していない。CASE_DIGEST Handoff では section/beat、timing、narration、caption、visual placeholder、truth boundary、closed flags の必須 map に欠落がない。

## 実行した検証

| 検証 | 結果 |
| --- | --- |
| Node syntax | `node --check tools/fff-writer-source-adaptation.mjs` pass |
| built-in tests | 16 tests / 16 pass、fail・skip・todo は 0 |
| schemas | 6/6 parse・generated sample validate。各 schema は `schema_version` 欠落 sample を reject |
| CLI | `validate-source` は writes 0。7 generation commands は各 explicit output directory にだけ1 structured fileを生成 |
| determinism | CASE_DIGEST を別々の temp directory へ2回生成し byte hash 一致。記録 hash は両方 `74416b81fe16235815631d9f1d3f863d1d89b9a8d6d090190b85d0137371de3a` |
| fixture-set regeneration | committed structured JSON と temporary regeneration の hash が全件一致 |
| readback structure | inline script 0、external resource reference 0、HTML SHA-256 `9c02b4849fc01451ecbfd5d9efd6262b12ad42970277c2177d1608a569eb90ad` |
| wide runtime | Chromium 1440×1000、main 1160px、document horizontal overflow `false`、7 section headings visible、console error/warning 0 |
| narrow runtime | Chromium 390×844、main/document 375px、horizontal overflow `false`、1-column split 343px、15px body text、7 section headings visible、console error/warning 0。wide tables は各 section 内の scroll region に収容 |
| browser requests | temporary 127.0.0.1 document GET のみ。外部 request、script、asset、font request は 0 |
| protected immutability | exact base から accepted CASE_DIGEST、両 quarantine、Editorial Handoff / Revision / Derivative / Blueprint に diff 0 |
| external effects | network/provider/credential/model/image/audio/video/render/publication/public count はすべて 0 |

最初の narrow runtime では grid の min-content 幅により document が658pxへ広がる defect を検出した。`.split` の columns と children に zero-minimum sizing を設定して再生成し、390px viewport の document overflow を解消した。

## 残る範囲

v0 は明示的に注釈された repository-local envelope を必要とし、任意の小説、一般的な screenplay、文学的品質、production-ready script には拡張されていない。容量値は current 180-second CASE_DIGEST と quarantined counterexample から得た local evidence であり、普遍的 threshold ではない。また accepted SHORT_DRAMA fixture がないため、ドラマ形式の positive calibration はまだ行えない。
