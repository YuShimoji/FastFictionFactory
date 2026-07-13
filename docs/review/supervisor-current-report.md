# 監修 AI 向け現状報告と長期目標案

更新日: 2026-07-14 JST

## 結論

Fast Fiction Factory の active artifact は `fff-beat2-visual-treatment-pilot-001`、active lane は `VISUAL_TREATMENT_PILOT` です。受け入れ済み Storyboard Brief と Production Execution Pack を改変せず、Beat 2「真鍮の蛾」だけを、六点の実ライセンス・ローカル raster reference と三つの shot strip で具体化する standalone Visual Treatment Pilot を追加しました。

H0 の機械検証は green です。十三ファイル package、3 shots / 6 references / 2 references per shot、24/24 fail-closed probes、全画像のprovenance/dimension/hash、Light/Dark/Auto、900x1200 / 1280x900、desktop primary share約68%、print-style、Storyboard七ファイルとExecution九ファイルのsource immutability が検証済みです。視覚伝達が改善したという判定だけは推測であり、次の正規 gate は H1 freeform visual-treatment review です。

この checkpoint は、asset、rights、engine、voice、provider/API、credentials、external call、art/audio/video generation、render、upload、publication、database、production approval、final canon を承認しません。以下の長期目標は依存関係を先まで見えるようにする提案であり、閉じた gate を自動的に開きません。

## 同期と開発可能性

| 項目 | 確認済みの状態 |
| --- | --- |
| Repository | `C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory` |
| Branch | `master` |
| 同期済み開始点 | `4d4c98ca188556509965d6dc1ed429c7b2acdf82` |
| 開始時 parity | `HEAD...origin/master = 0 0`、index/worktree clean |
| 公開 state | この slice の最終 commit / push / parity は Git を正本とし、chat や固定記述から推測しない |
| Runtime | Node.js `v24.13.0`、npm `11.6.2`、uvx `0.10.7` |
| Active entry | `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html` |
| Read-only health | `node tools/fff-state.mjs validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json` |
| Root health | `artifacts/artifact-manifest.json` の `validation_command` |
| Durable authority | `docs/project-context.md` → `docs/review/current-status.md` → 本報告 → Beat 2 pilot review/result |

Windows checkout の LF policy は `.gitattributes` で維持されています。今回の新規 Markdown / CSV / JSON / HTML も LF を固定し、raw-byte SHA256 と OS の改行設定が衝突しないようにしています。

## 状態遷移

### Before

- purpose と completion が離れ、shot を横断して読む必要があった
- negative truth guard が肯定的な completion と同じ見え方だった
- 真鍮の蛾などの固有語を、その場の文脈なしで理解する必要があった
- reusable asset ledger が story flow と視覚的に競合した
- visual storyboard がなく、governance data が作品の構想より強く見えた
- title が大きく、Light only だった

### After

- premise と central unresolved question を first view に表示
- 六文 overview と 25語 glossary だけで core context を取得可能
- 六幕・19枚の planning frame を 3/3/3/3/4/3 で連続して読める
- `ねらい`、`成立させること`、`描かないこと` を全19shotで隣接
- positive action を主、negative guard を従として視覚分離
- 14 requirements を initially closed の operational appendix へ移動
- restrained responsive title と Light/Dark/Auto、light print を提供
- Production Execution Pack は byte-identical の operational/audit source として保持

## 現在の成果物

### Beat 2 Visual Treatment Pilot

- `artifacts/beat2-visual-treatment-pilot/README_VISUAL_TREATMENT.md`
- `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html`
- `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.json`
- `artifacts/beat2-visual-treatment-pilot/reference-sources.csv`
- `artifacts/beat2-visual-treatment-pilot/shot-reference-map.csv`
- `artifacts/beat2-visual-treatment-pilot/references/`（6 images）
- `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment-contact-sheet.jpg`
- `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment-manifest.json`

Review authority:

- `docs/review/beat2-visual-treatment-pilot.md`
- `artifacts/beat2-visual-treatment-pilot-result.json`
- `artifacts/review-screens/beat2-visual-treatment-900x1200-dark.png`
- `artifacts/review-screens/beat2-visual-treatment-1280x900-light.png`

Access:

```powershell
Invoke-Item .\artifacts\beat2-visual-treatment-pilot\beat2-visual-treatment.html
```

`public/review/index.html?mode=blueprint` の utility に compact な `Beat 2 ビジュアル参照` link を一つ追加しました。新しい application mode はありません。

### Production Storyboard Brief

- `artifacts/production-storyboard-brief/README_STORYBOARD_BRIEF.md`
- `artifacts/production-storyboard-brief/production-storyboard-brief.html`
- `artifacts/production-storyboard-brief/production-storyboard-brief.json`
- `artifacts/production-storyboard-brief/storyboard-shot-map.csv`
- `artifacts/production-storyboard-brief/story-glossary.csv`
- `artifacts/production-storyboard-brief/asset-operations-summary.csv`
- `artifacts/production-storyboard-brief/production-storyboard-brief-manifest.json`

Review authority:

- `docs/review/production-storyboard-brief.md`
- `artifacts/production-storyboard-brief-result.json`
- `artifacts/review-screens/production-storyboard-brief-900x1200-dark.png`
- `artifacts/review-screens/production-storyboard-brief-1280x900-light.png`

Access:

```powershell
Invoke-Item .\artifacts\production-storyboard-brief\production-storyboard-brief.html
```

`public/review/index.html?mode=blueprint` には compact な `絵コンテ版を開く` link を一つだけ追加しました。新しい application mode はありません。

### Canonical model coverage

- 180 seconds / 6 beats / 19 shots
- 20 subtitle cues と 6 narration segments を source から明示継承
- 14 generic requirements、すべて `unselected` / `not_reviewed` / provenance required
- `voice_mode=synthetic` を継承
- `engine_selected=false`、`voice_selected=false`、`audio_generated=false`
- `engine_calibration_pending=true`、`actual_engine_timing_measured=false`
- 25 glossary terms、unresolved reference 0
- 19 positive conditions / 19 negative guards / 19 SVGs

## 機械検証と視覚証拠

| Evidence | 結果 |
| --- | --- |
| Package identity | exact 7 files、manifest size/hash integrity pass |
| Source identity | Execution Pack 9-file aggregate `10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345` unchanged |
| Story grouping | 6 beats、19 shots、3/3/3/3/4/3 |
| Glossary | 25 entries、all primary references resolved |
| Shot semantics | 19 positive / 19 negative、source `done_when` を再構成可能 |
| Storyboard | 19 inline SVG、16:9、focal label、motion notation、final art false |
| Operational appendix | owner 1、primary asset table 0、14 one-line rows、48px、initially closed |
| Themes | Light / Dark / Auto、Auto default、system light/dark resolution、preference persistence |
| 900x1200 Dark | title 36px / 2 lines、horizontal overflow false、nested scroll 0、contrast minimum 10.26 |
| 1280x900 Light | title 40px / 2 lines、horizontal overflow false、nested scroll 0、contrast minimum 6.38 |
| Keyboard | theme aria state、appendix Enter / Space toggle pass |
| Print | controls hidden、light background、no horizontal overflow、frames visible |
| Negative probes | 18/18 fail closed、artifact mutation 0 |
| Predecessors | Execution Pack、Typography、Operator、Blueprint、Derivative、Revision、Handoff remain valid |

画面の改善は verified structure と browser measurement に基づきます。ただし「人が説明できる」は H1 でのみ確定します。

## Source immutability

| Source evidence | SHA256 |
| --- | --- |
| Production Execution package fingerprint | `a19cf81f3322c17a49c597731372ea653f7fd3881cea84d1ddb8e2df3b7143ca` |
| Source HTML | `f892d2935d42b62150a58f18da3ed29394435a4e4c2579f4d6321f1ce637338c` |
| Source JSON | `24237829ad4d886b79397eb1626ca3efb7a92a8b0f29923ff092f5679d037ceb` |
| Source manifest | `f3a6bccef8809d8060c7a809522c09a546617b82179d2d5f97fe7e3fe20a60f7` |
| Nine-file aggregate | `10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345` |

Source wording、narration、subtitle、timing、order、IDs、truth、rights、asset state、canon state は変更していません。Storyboard model は source narration と synthetic planning state をコピーして継承を検証しますが、primary page では operational data を story flow より前へ出しません。

## 完成度の見立て

これは承認率ではなく、残作業の規模を比べる planning estimate です。

- Beat 2 Visual Treatment Pilot slice: `[█████████░] 95%`
  - H0、package、provenance、browser、print-style、source protection、publication準備は完了
  - 残る product gate は H1 human visual-treatment comprehension
- Preserved Production Storyboard Brief slice: `[██████████] 100%` for source preservation
  - 七ファイル package と過去 evidence は変更なし
  - 現在の human gate は Beat 2 pilot が所有
- Human transfer path: `[█████████░] 90%`
  - operational source と visual brief の役割分離は完了
  - 外部 creator による実説明は未実施
- Local-first review / handoff MVP: `[████████░░] 82%`
  - source review、revision、blueprint、handoff、execution、storyboard が連結
  - real provider、durable database、production execution は未実装
- End-to-end publishable fiction factory: `[███░░░░░░░] 30%`
  - production planning contract はある
  - calibrated voice、cleared media、assembly、release approval、publishing loop は未開始

## 現在不足しているもの

| 不足 | State | Effect |
| --- | --- | --- |
| H1 Storyboard comprehension | 未実施 | visual brief が説明なしで本当に伝わるか未確定 |
| External creator trial | 未実施 | project knowledge を持たない制作者の preparation cost は未計測 |
| Asset candidates / provenance | 14/14 unselected | frame を実素材へ割り当てられない |
| Rights review | 14/14 not_reviewed、source shots not_cleared | production-ready / release-ready を名乗れない |
| Synthetic engine calibration | 未開始 | proxy timing はあるが pronunciation / pause / prosody / actual duration は不明 |
| Offline assembly | 未開始 | 180秒 timeline の編集・字幕・render cost が未実測 |
| Canon-sensitive decisions | human-owned unresolved | ending-sensitive production choiceを確定できない |
| Real provider extraction | no-call boundaries only | memo-to-candidate generationはlocal deterministic範囲 |
| Durable database | 未開始 | migration / backup / multi-session stateがない |
| Publishing and release controls | closed | upload、release approval、rollback運用がない |

## Goal Horizon

各目標は Purpose / Effect / Requirements / State / Owner / Next move を明示します。

### G0 — H1 Storyboard Comprehension Review

- Purpose: project外の人が standalone page だけから作品とshot logicを説明できるか確認する。
- Effect: governanceの正しさではなく、実際のtransfer comprehensionを判定できる。
- Requirements: page以外を見ず、premise、central question、six beats、代表shot、core terms、positive/negative boundaryを自由文で説明する。
- State: ready; H0 green、H1 not started。
- Owner: human supervisor または delegated creator。
- Next move: pass / bounded revision notesを記録する。

### G1 — Evidence-Bounded Comprehension Repair

- Purpose: H1で観測された実際の摩擦だけを修正する。
- Effect: scopeを広げずtransfer qualityを閉じられる。
- Requirements: wording、grouping、glossary definition、low-fidelity diagram clarity、theme/accessibilityの範囲に限定し、source wording/truthを変えない。
- State: conditional; H1で具体的な問題が出た場合のみ。
- Owner: product implementer。
- Next move: passならskip、failなら一回のnarrow repair後にH1再実施。

### G2 — Asset and Rights Readiness Sandbox

- Purpose: 14 generic requirementsをprovenance付き候補へ変える方法を検証する。
- Effect: selectedとrights-clearedを混同せず、19shotの具体準備へ進める。
- Requirements: separate authorization、source URL/creator/license/acquisition/use/attribution記録、rejection/replacement path、no production claim。
- State: closed; 14/14 unselected / not_reviewed。
- Owner: producer / asset curator / rights reviewer。
- Next move: H1 pass後、1 requirementだけをsandbox intakeする。

### G3 — Local Synthetic Voice Calibration

- Purpose: text-density proxyを一つの実engine/voiceの測定へ置き換える。
- Effect: pronunciation、pause、prosody、B1–B6 durationとheadroomが分かる。
- Requirements: explicit engine/voice authorization、unchanged narration、local-only execution、non-release audio labeling。
- State: closed; engine/voice/audio unselected、calibration pending。
- Owner: voice implementer + human listener。
- Next move: engineを一つに限定したcalibration packetを先に設計する。

### G4 — Offline Assembly Rehearsal

- Purpose: publishせず、voice、subtitle、19 shotsを180秒timelineへ一度組む。
- Effect: edit cost、timing conflict、missing media、readability、render reproducibilityを実測できる。
- Requirements: G2/G3 evidence、local render authorization、watermark/non-release label、deterministic render manifest。
- State: not started。
- Owner: production implementer + human editor。
- Next move: low-resolution local-only candidateをacceptance targetにする。

### G5 — First Production-Ready Local Candidate

- Purpose: story、editorial、voice、asset、rights evidence、render recipeを一つのreviewable candidateへ束ねる。
- Effect: planning completeからreproducible pre-release candidateへ進む。
- Requirements: G0–G4 pass、unresolved canonの明示、production approvalとrelease approvalの分離、rollback/provenance manifest。
- State: not started。
- Owner: human product owner + production implementer。
- Next move: candidate acceptance matrixを先に定義する。

### G6 — Human Canon and Story-Truth Gate

- Purpose: Toma fate、brass moth truth/function、Council motive、ending choiceをhuman authorityで扱う。
- Effect:制作仮説とcanonを混同せず、必要な場面だけ最終化できる。
- Requirements: explicit human decision、before/after evidence、affected artifacts、rollback、no silent promotion。
- State: unresolved and held。
- Owner: human author / canon owner。
- Next move: G5 candidateが要求する最小decisionだけをdecision packet化する。

### G7 — Guarded Provider-Backed Extraction

- Purpose: deterministic local extractionをsource-tracked provider outputで補完する。
- Effect: candidate throughputを上げながらhuman authorityとfail-closed guardsを維持する。
- Requirements: provider/model/endpoint/credential/transport/timeout/retry/external-call authorization、record/replay fixture、existing validator/source-span gates。
- State: interface and no-call readiness exist; live adapter not started。
- Owner: product owner + AI implementer + security owner。
- Next move: credentialを触らないadapter interfaceとreplay testを先行する。

### G8 — Durable Project State

- Purpose: browser storageとmanual JSONを越えてversioned project stateを保持する。
- Effect: backup、migration、recovery、multi-session auditが可能になる。
- Requirements: file-backed / SQLite / browser expansionの選定、schema version、migration、backup/export、concurrent-write rule、no silent canon。
- State: not started。
- Owner: product implementer。
- Next move: provider/publishingと分離したlocal SQLite spikeを行う。

### G9 — Reproducible Production Orchestration

- Purpose: extraction、review、revision、asset intake、voice、renderをresumable job graphにする。
- Effect: partial rerun、failure recovery、artifact provenance、cost/time observationが可能になる。
- Requirements: G5/G7/G8 stable contracts、idempotency、cache、job state、human checkpoints。
- State: not started。
- Owner: pipeline implementer + product owner。
- Next move:一作品・no-publish限定のorchestration planを定義する。

### G10 — Publishing Staging and Release Gate

- Purpose: upload操作と公開判断をproduction pipelineから分離する。
- Effect: metadata preview、private/unlisted staging、release approval、rollbackが監査可能になる。
- Requirements: credential isolation、rights clearance、canon/production approval、platform policy、dry-run、human release decision。
- State: explicitly closed。
- Owner: human release owner + publishing implementer。
- Next move: API callなしのpublication envelopeを先に作る。

### G11 — First Human-Approved Release

- Purpose:一作品をstory authority、rights、production、publicationの全gateを通して公開する。
- Effect: Fast Fiction Factoryのend-to-end valueと実運用costを検証する。
- Requirements: G5/G6/G9/G10、final human approvals、release evidence、rollback/retention plan。
- State: not started。
- Owner: human author / product owner / release operator。
- Next move: release前acceptance reportとapproval owner一覧を生成する。

### G12 — Multi-Project / Series Learning Loop

- Purpose:一作品の結果を複数作品・seriesへ安全に拡張する。
- Effect: style reuse、series canon、asset reuse、review latency、production cost、release qualityを横断改善できる。
- Requirements: project isolation、series canon hierarchy、credential separation、metrics taxonomy、override、retention/privacy policy。
- State: long-term horizon。
- Owner: product owner + platform/editorial/production leads。
- Next move: G11後の実測bottleneckだけをKPI化し、先回りしたplatform化を避ける。

## 推奨クリティカルパス

`G0 H1 → (必要時のみ G1) → [G2 asset/rights + G3 voice] → G4 offline assembly → G5 local candidate → G6 minimum canon decisions → G9 orchestration → G10 release gate → G11 first release → G12 scale`

G7 provider extraction と G8 durable state は、G0後にproduction laneと分離して進められます。現作品のG4/G5をproviderやdatabase待ちにする必要はありません。

## 監修 AI に求める次の判断

1. 直近を G0 H1 Storyboard comprehension review に限定するか。
2. H1 pass後、G2 asset/rights sandbox と G3 voice calibration のどちらを先行または並行許可するか。
3. G6 の human-owned truth は G5 が必要とする最小範囲まで held にするか。
4. G7/G8 を production lane と分離した platform lane として進めるか。

推奨は、まず H1 を standalone Storyboard Brief だけで実施することです。passなら成果物を閉じ、次に G2 と G3 を別承認の小さな sandbox として準備します。これが、source contractを壊さず最短でoffline assemblyへ進む経路です。
