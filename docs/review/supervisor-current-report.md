# 監修 AI 向け現状報告と長期目標案

更新日: 2026-07-19 JST

## Composition Expansion Wave 2 追補

Active product artifact は `fff-composition-expansion-wave2-001` です。Beat 5/6の7 source shotsを、4点の新規licensed local references、8点のexact-identity inherited references、16 assignments、7 distinct composition classesで具体化しました。Wave 1、Beat 2 Board、Beat 4 Counterexampleと合わせ、別package上では19/19 shotsが具体化済みです。

この状態は統合完成ではありません。統合19-shot visual packageは未作成で、Wave 2 human reviewはnone、直後のhuman gateもfalseです。次の人手reviewは `after_integrated_19_shot_visual_package` のみです。制作採用、rights clearance、generation、render readiness、production approval、external reproducibility、canonは引き続き閉じています。

次の最遠安全目標は、別承認されたdata-only successorとして、既存4 packageのexact composition identityを一つの19-shot review objectに統合することです。その後に限り、product ownerがwhole-story composition coherenceをreviewします。production/rights laneはさらに別の権限とasset-by-asset reviewを要します。

## Wave 1 完了時点の保存記録

この保存セクションは Wave 1 完了時点を記録します。当時の product artifact は `fff-composition-expansion-wave1-001` でした。Beat 1「鐘のない塔」3 shots と Beat 3「消された名前」3 shotsを、12点のライセンス明示済みローカル参照画像で構図レベルまで具体化し、Beat 2 Composition BoardとBeat 4 Counterexampleを合わせてBeats 1–4の12/19 source shotsを具体化していました。現在のactive truthは冒頭のWave 2追補です。

本Waveはreference-only H0です。制作採用、権利処理完了、画像生成、完成画、render readiness、production approval、外部再現性、canonを示しません。Beat 5/6と最終19-shot統合は実施していません。次の人手reviewはWave 1直後ではなく、19-shot visual package統合後だけです。

## ライブ同期と開発可能性

| 項目 | 確認結果 |
| --- | --- |
| Repository | `C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory` |
| Branch | `master` |
| Remote | `origin` → `https://github.com/YuShimoji/FastFictionFactory.git` |
| Worker base | `a2f61c72680b2a7d9220f4a2d8f05c2e79ac5189` |
| Start parity | `HEAD = origin/master = base`, `HEAD...origin/master = 0 0` |
| Start worktree | clean index / clean tracked worktree / no untracked product files |
| Runtime | Node.js `v24.13.0`, npm `11.6.2`, uvx `0.10.7` |
| Dependency posture | root install不要。validatorはrepository-local Node、browser evidenceはCodex同梱Playwright、docsは`uvx --with mkdocs-material` |
| Primary access | `artifacts/composition-expansion-wave1/composition-expansion-wave1.html` |
| Authority order | `AGENTS.md` → `docs/project-context.md` → `docs/review/current-status.md` → 本報告 → Wave 1 review doc/result → preserved source packages |

開始時に `git fetch --prune origin`、branch/HEAD/origin/upstream/parity/statusを確認し、remote advanceも未報告worktree changeもありませんでした。製品commit/push後の正確なHEAD、remote equality、parity、clean stateはWorkerの最終AGENT_REPORTを正本とします。

## Intended State Transition

| Before | Transition | After |
| --- | --- | --- |
| Beat 2とBeat 4の6 shotsが具体化済み | Beat 1/3の6 shotsに実画像ベースのcrop/focus/depth/continuityを追加 | Beats 1–4の12/19 shotsが具体化済み |
| Beat 4の別reviewが次gateという旧forward policy | Owner Review結果をcurrent authorityへ反映 | per-Beat reviewer/blind reviewを終了、次reviewを19-shot統合後へ移動 |
| Active artifact `fff-beat4-composition-counterexample-001` | predecessorをbyte-preservedのままsuccessor登録 | Active artifact `fff-composition-expansion-wave1-001` |
| Beat 1/3はplanning framesとsource rowsのみ | 12 local licensed rasters、12 assignments、6 distinct classes | standalone composition review surfaceとmachine evidenceを獲得 |

## Owner Review policy

- Beat 4 review: `OWNER_REVIEW_PASS`
- User observation: 「大きな破綻はなさそう」
- Disposition: composition expansion authorized
- Evidence boundary: product-owner directional acceptanceであり、independent transfer proofではない
- Per-Beat external review required: false
- Per-Beat blind review: discontinued
- Wave 1 human review: none
- Next human review: complete integrated 19-shot visual packageの後
- External reproducibility: not yet claimed
- Beat 4 repair: not required

Historical evidenceの旧review用語は書き換えていません。current authorityとforward planだけを新policyへ更新しています。

## Wave 1 deliverable

### Scope

- Beat 1 `00:00–00:20`: `shot-b01-01`, `shot-b01-02`, `shot-b01-03`
- Beat 3 `00:50–01:20`: `shot-b03-01`, `shot-b03-02`, `shot-b03-03`
- Exact total: 2 Beats / 6 shots / 50 seconds
- References: 12 distinct local JPEGs / 12 assignments / one unique main and one support per shot
- Composition classes: 6 distinct

### Primary package

- `artifacts/composition-expansion-wave1/README_COMPOSITION_EXPANSION_WAVE1.md`
- `artifacts/composition-expansion-wave1/composition-expansion-wave1.html`
- `artifacts/composition-expansion-wave1/composition-expansion-wave1.json`
- `artifacts/composition-expansion-wave1/reference-sources.csv`
- `artifacts/composition-expansion-wave1/shot-composition-map.csv`
- `artifacts/composition-expansion-wave1/composition-expansion-wave1-manifest.json`
- `artifacts/composition-expansion-wave1/composition-expansion-wave1-contact-sheet.jpg`
- `artifacts/composition-expansion-wave1/composition-assets/` の正規化JPEG 12点

### Evidence

- `docs/review/composition-expansion-wave1.md`
- `artifacts/composition-expansion-wave1-result.json`
- `artifacts/review-screens/composition-expansion-wave1-900x1200-dark.png`
- `artifacts/review-screens/composition-expansion-wave1-1280x900-light.png`

## Six-shot composition audit

| Shot | Composition class | Main visual purpose | Truth-safe stop |
| --- | --- | --- | --- |
| b01-01 | station/tower establishing depth | 駅の奥行きから遠景の空枠へ視線を上げる | 鐘、機械、人物を原因として示さない |
| b01-02 | empty mount architectural detail | 木組み・接合部の不在をcloseで確認する | 撤去理由やwinter curfewを証明しない |
| b01-03 | unresolved frame/noon hold | 空枠と正午標を固定保持して問いを残す | 魔法・機械・人物の答えを置かない |
| b03-01 | anonymous ledger opening insert | 匿名の手と開かれる本で調査対象を置く | 所有者、真正性、有罪を確定しない |
| b03-02 | fictional ledger relation graphic | blank bookとぼかしたcolumn geometryから架空挿入を制作 | 実在台帳、実在名、証拠文書として見せない |
| b03-03 | staged record-fade metaphor | 紙とインクの段階的減衰を比喩として示す | literal erasure、人物消失、超自然的主体を証明しない |

Beat 1 continuityは location → absence → unresolved noon hold、Beat 3 continuityは ledger encountered → relationship inspected → absence visualized です。Shot 2 structured graphicとShot 3 dissolve metaphorを同じtemplateへ畳まず、Wave 1の各main compositionも一意です。

## Reference and license audit

12 referencesすべてにreference ID、creator、source page、original media URL、license name/URL、retrieval date、original/normalized dimensions、local path、SHA256、used shot、role、boundary flagsがあります。許可classはCC0、CC BY、CC BY-SA、author-dedicated public domainだけです。original useful longest edgeは900px以上、normalized longest edgeは1600px以下、aspect ratio維持、upscaleなし、metadata除去済みです。

検索結果screenshot、hotlink、曖昧license、watermark、account gate、actual personal recordのfictional evidence化、identifiable wrongdoer、低解像度upscaleを使用していません。実鐘を写すtower、機構やweightを写すtower、RGB filterの擬似ink、AI生成old paper、実project ledger、鐘が見えるexterior belfryは棄却しました。

## Validation and evidence

Targeted V3 pathは次を対象にします。

1. modified/new Node tool syntax
2. Wave 1 normal read-only validator
3. preserved Beat 2 Board validator
4. preserved Beat 4 Counterexample validator
5. preserved Visual Treatment validator
6. preserved Storyboard validator
7. preserved Execution validator
8. ten predecessor pre/post directory hashes
9. provenance/license/duplicate/near-duplicate audit
10. six composition classes and two Beat continuity chains
11. 40 fail-closed non-mutating negative probes
12. root manifest registration and read-only chain
13. proof that normal validation changes no tracked artifact
14. HTML inline-script compilation
15. 900x1200 Dark and 1280x900 Light browser captures
16. Auto default, explicit Light/Dark, visible keyboard focus
17. document-only vertical scroll, no horizontal overflow, no nested scroll
18. print-forced light, theme controls hidden, shot break avoidance
19. strict MkDocs build
20. diff/staged-path/push/parity checks

Full historical suiteは実行しません。通常validatorはread-onlyです。Smokeが書けるのは新Wave 1 manifest/resultだけで、取得済みreference bytesは書き換えません。

## Source immutability

Wave 1 model/resultは、次の10 directoryについてfile-level inventoryとaggregate SHA256を保持します。

- `artifacts/beat2-composition-board` — 13 files
- `artifacts/beat2-visual-treatment-pilot` — 13 files
- `artifacts/beat4-composition-counterexample` — 14 files
- `artifacts/production-storyboard-brief` — 7 files
- `artifacts/production-execution-pack` — 9 files
- `artifacts/operator-production-brief` — 6 files
- `artifacts/production-blueprint` — 8 files
- `artifacts/editorial-derivative` — 8 files
- `artifacts/editorial-revision` — 6 files
- `artifacts/editorial-handoff` — 6 files

Wave 1 validationはmodelに固定した期待値とlive directory bytesを比較します。historical result artifacts、`public/review/index.html`、既存route、predecessor packagesは変更しません。

## Closed boundaries

- `local_only=true`
- `reference_only=true`
- `selected_for_production=false`
- `rights_cleared_claim=false`
- `image_generation=false`
- `production_approved=false`
- `render_ready=false`
- `content_changed=false`
- `timing_changed=false`
- `final_canon_decision=false`
- `full_story_expansion=false`
- `beats_5_6_touched=false`
- `external_reproducibility_claimed=false`

## 最遠安全目標

### G0 — Wave 1 publication and parity

Wave 1 package、result、current authorityを一つの指定product commitで`origin/master`へ公開し、remote equality、parity `0 0`、clean worktreeを確認する。これは本Workerの最終postconditionです。

### G1 — Wave 2 execution contract approval

残り7 source shots（Beats 5/6）だけを対象とするexecution contractをowner/supervisorが承認する。必要条件はexact source rows、licensed local raster policy、distinct composition classes、continuity plan、immutable predecessor contract、truth/rights/canon closed flagsです。未承認の間はdata-only proposalに留めます。

### G2 — Wave 2 H0 implementation

G1承認後、Beats 5/6をreal local raster referencesで具体化し、9–14等のreference数は新contractでshot数に比例して再定義します。Wave 1やpredecessorを変更せず、同じread-only/negative/browser/print evidenceを作ります。人手reviewはまだ行いません。

### G3 — Integrated 19-shot visual package

Wave 1、Beat 2、Beat 4、Wave 2のconcrete compositionを一つの19-shot reading flowへ統合します。重複template、主画像重複、Beat間eye path、visual density、color/material continuity、subtitle allowance、truth boundaryを全編で監査します。この統合物は制作採用ではありません。

### G4 — Integrated human review

exact integrated artifact/hashを固定し、人間ownerまたは監修AIが全19 shotsを一度だけreviewします。判定対象はcomposition intelligibility、Beat内/Beat間continuity、material difference、critical semantic misread、blocking questionsです。rights、production、release acceptanceと混同しません。

### G5 — Production candidate and rights gate

G4 acceptance後も別権限で、各shotのproduction candidate選定、license attribution/compatibility、人物/施設risk、derivative obligations、replacement needsを判断します。reference acceptanceはrights clearanceを意味しません。

### G6 — Asset construction proof

選定と権利gateが通ったshotだけで、local deterministic compositingまたは別途承認されたgeneration workflowを実施し、actual construction effort、motion feasibility、subtitle-safe areas、render costを測ります。provider/API、credentials、external callは明示承認なしに開始しません。

### G7 — Render/release readiness

engine/voice/audio、final motion、render profile、quality control、upload/publication、database/canon、release acceptanceはそれぞれ独立gateにします。G0–G6のpassだけで自動的に開きません。

## Active residual work

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Wave 2 proposal | 残り7 shotsの次sliceを安全に定義 | 19/19へ向かう欠落を可視化 | exact scope、source authority、reference budget、closed boundaries | data only / not authorized | supervisor + product owner | G0後にproposalをreview |
| Wave 2 implementation | Beats 5/6を構図具体化 | 19-shot integrationの入力を完成 | G1 explicit authorization | blocked by authority, not technical failure | future worker | 許可後だけ開始 |
| 19-shot integration | 全編continuityを一つのartifactへ集約 | integrated human reviewが可能 | Wave 2 H0 accepted | future | future worker | G2後に実装 |
| Integrated human review | 全編のtransfer/intelligibilityを判定 | production候補gateの根拠 | exact artifact/hash、review protocol | owner gate | human owner / supervising AI | G3後だけ実施 |
| Production selection and rights | 実制作に使うassetを決める | reference-only境界を越える可能性 | explicit selection and rights authority | closed | human owner / rights owner | G4後も別承認 |
| Generation/render/release | 完成媒体を作り公開する | product delivery | provider/credential/render/release authorization | closed | production and release owners | 前gateが通っても自動開始しない |

## 監修AIへの判断依頼

現時点で新たな人手reviewや修正判断は不要です。まずWave 1のpublished Git stateとmachine evidenceを受領してください。その後、G1のWave 2 execution contractを発行するか、data-only proposalを先に精査するかを決めてください。Beat 5/6実装、19-shot統合、production/rights/generation/render/releaseへは、対応するowner authorityなしに進めないでください。
