# 監修 AI 向け現状報告と長期目標案

更新日: 2026-07-17 JST

## 結論

Fast Fiction Factory は、ローカル優先の fiction production workbench として、原稿候補の抽出・人間レビュー・編集差分・制作設計・制作引き渡しを、source / truth / rights / canon の境界を保ちながら一作品分つなげた状態です。現在の accepted product artifact は `fff-beat2-composition-board-001` です。lane `COMPOSITION_REVIEW` の独立H1は完了し、次のimplementation laneはまだ開いていません。

Beat 2「真鍮の蛾」`00:20–00:50` の三つの source shot を、雰囲気参照から実際のcrop / focal order / depth / placement判断へ一段具体化し、プロジェクト外の制作者へ転送できるかという直近目的は達成しました。thread `fff-beat2-composition-transfer-h1-01` で全3shotをblindに復元し、authorityとPilotを後から比較した結果、3件すべてが `improved_and_executable`、比率 `3/3 = 1.0 (100%)`、primary classification `H1_COMPOSITION_TRANSFER_PASS` です。

H0 の機械検証は green です。13-file package、3 shots、6 distinct references / 7 assignments、1 main + 1–2 supporting per shot、22/22 fail-closed probes、6/6 provenance / dimensions / SHA256、Light / Dark / Auto、900x1200 Dark、1280x900 Light、equal-height columns、main-image share 84%以上、print contract、three-package source immutability を検証します。

H1で検証したのは構図仕様の転送可能性であり、完成画の品質や実制作済みであることではありません。critical misread、blocking question、systemic composition ambiguity、修正対象shotはありません。唯一推奨する次のgateは、別のvisual problemを持つBeat一つで行うbounded counterexampleですが、これは未承認・未実施です。production asset selection、rights clearance、full-story expansion、engine / voice、provider/API、credentials、external calls、art/audio/video generation、render、upload、publication、database persistence、production approval、final canon は引き続き closed です。

## ライブ同期と開発可能性

| 項目 | 2026-07-17 JST の確認結果 |
| --- | --- |
| Repository | `C:\Users\PLANNER007\FastFictionFactory` |
| Branch | `codex/beat2-h1-handoff`（base: `master`） |
| Remote | `origin` → `https://github.com/YuShimoji/FastFictionFactory.git` |
| Handoff base HEAD | `ba9ad3ffcf5fe4698483f17bfcaa47af0136d488` `Record Composition Board restart handoff`; published successorはremote branch上のGit commitを正本とする |
| Active product checkpoint | `6ef134b2af6c52e38cf674168686886d41f4c087` `Add Beat 2 composition board` |
| Predecessor checkpoint | `72df19b33fd77b047170046db1a99620d1455976` `Add Beat 2 visual treatment pilot` |
| Sync operation | `git fetch --prune origin` と `git pull --ff-only origin master` を実行し、`Already up to date` を確認後、handoff branchを作成 |
| Base parity | branch作成前の `master...origin/master = 0 0` |
| Worktree ownership | 開始時の唯一の差分だった本報告のWindows実測更新を保持。H1結果と引き継ぎ文書だけを統合し、product artifact bytesは変更しない |
| Runtime | Node.js `v22.19.0`、npm `10.9.3`、uvx `0.10.0` |
| Dependency posture | root `package.json` / install step は不要。Node tools は repository-local、MkDocs は `uvx --with mkdocs-material` で隔離実行 |
| Active entry | `artifacts/beat2-composition-board/beat2-composition-board.html` |
| Current authority | `docs/project-context.md` → `docs/review/current-status.md` → 本報告 → `docs/review/beat2-composition-board.md` H1 result → machine result |

`README.md` と `docs/spec-index.json` は存在しません。repo-local instruction に従い stale reference として扱い、開発 blocker にはしていません。実際の入口は `AGENTS.md`、上記 authority chain、`artifacts/artifact-manifest.json` です。

### 今回通過した検証

| Gate | Result |
| --- | --- |
| Root manifest read-only validation | exit 0。Composition → Visual Treatment → Storyboard → Execution → Typography → Operator → Blueprint → Derivative → Revision → Handoff の順で実行 |
| Beat 2 Composition validator | `passed=true`、`failures=[]`、22/22 probes を完了条件とする |
| H1 independent transfer | 全3 production shot、`3/3 = 1.0`、`H1_COMPOSITION_TRANSFER_PASS`。Board repairなし |
| Tool syntax | pass。root manifest 内で `fff-state.mjs`、Beat 2 Visual Treatment generator、Storyboard generator を確認 |
| MkDocs | `uvx --with mkdocs-material mkdocs build --strict` exit 0。build output は `%TEMP%\fff-mkdocs-build-h1-handoff` へ隔離 |
| Launcher | `open_review.ps1 -Mode blueprint -PrintUri` exit 0。`file:///C:/Users/PLANNER007/FastFictionFactory/public/review/index.html?mode=blueprint` を返却 |
| Patch hygiene | `git diff --check` pass |
| Read-only property | root validation はhandoff docs/manifestの意図した差分以外を追加せず、tracked / untracked product artifact change なし |

MkDocs は nav 未掲載の review pages を INFO として列挙しますが、strict build 自体は exit 0 です。Material for MkDocs が将来の MkDocs 2.0 非互換警告を表示していますが、現行 build の failure ではありません。

## 現在の authority と成果物

### Active: Beat 2 Composition Board

- Artifact: `fff-beat2-composition-board-001`
- Lane: `COMPOSITION_BOARD`
- Standalone page: `artifacts/beat2-composition-board/beat2-composition-board.html`
- Canonical model: `artifacts/beat2-composition-board/beat2-composition-board.json`
- Provenance: `reference-sources.csv`
- Shot mapping: `shot-composition-map.csv`
- Local references: `composition-assets/` の six JPEGs、7 shot assignments
- Contact sheet: `beat2-composition-board-contact-sheet.jpg`
- Integrity: `beat2-composition-board-manifest.json`
- Human review authority: `docs/review/beat2-composition-board.md`
- H0 authority: `artifacts/beat2-composition-board-result.json`
- Screenshots: 900x1200 Dark と 1280x900 Light の二点

### Preserved: Beat 2 Visual Treatment Pilot

- Artifact: `fff-beat2-visual-treatment-pilot-001`
- Lane: `VISUAL_TREATMENT_PILOT`
- Standalone page: `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html`
- Canonical model: `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.json`
- Provenance: `reference-sources.csv`
- Shot mapping: `shot-reference-map.csv`
- Local references: `references/` の six JPEGs
- Contact sheet: `beat2-visual-treatment-contact-sheet.jpg`
- Integrity: `beat2-visual-treatment-manifest.json`
- Human review authority: `docs/review/beat2-visual-treatment-pilot.md`
- H0 authority: `artifacts/beat2-visual-treatment-pilot-result.json`
- Screenshots: 900x1200 Dark と 1280x900 Light の二点

Blueprint route には compact な `Beat 2 ビジュアル参照` link が一つだけあります。pilot は permanent application mode ではありません。

### Protected planning and execution sources

| Source | Role | Current state |
| --- | --- | --- |
| `fff-production-storyboard-brief-001` | Complete 6-beat / 19-shot planning authority | 7 source files byte-identical。H1全体再レビューは現在の入口ではない |
| `fff-production-execution-pack-001` | Operational / audit authority | 9 files、180s、19 shots、20 subtitles、6 narration、14 requirements を保持 |
| `fff-operator-production-brief-typography-balance-001` | Accepted human-facing production brief | H1 judgment A 済み。title-only hierarchy repair complete |
| `fff-content-production-blueprint-001` | Quantitative machine/audit source | 1920x1080 / 16:9 / 30fps provisional profile、LOCKED / BOUNDED / FREE を保持 |
| `fff-editorial-derivative-preview-001` | Three accepted wording changesのreversible copy | source not applied、derived copy only |
| Revision / Handoff / Bridge chain | Manual editorial transfer and source history | immutable baselineとして保持 |

Production Execution Pack の四つの `proxy_headroom_confirmed` は人間の読み上げによる text-density proxy です。synthetic engine timing の実測ではありません。B2/B5 は `existing_pass_unmeasured` のままです。

## Active H0 evidence

| Evidence | Current readback |
| --- | --- |
| Package | 13 files、12 manifest payloads、fingerprintは `artifacts/beat2-composition-board-result.json` を正本とする |
| Story window | Beat 2 / `00:20–00:50` / exactly 3 sequential shots |
| Reference structure | 6 distinct local rasters、7 assignments、main 3 / supporting 4 |
| Provenance | creator、source page、media URL、license name/URL、dimensions、retrieval date、local SHA256 |
| Rights honesty | 6/6 `reference_only=true`、`selected_for_production=false`、`rights_cleared_claim=false` |
| Image hygiene | hotlink 0、distinct-image duplicate hash 0、remote image 0。蛾1枚はsame IDでShot 2/3に反復 |
| Layout | desktop main-image minimum share `0.8426923433837724`、equal-height max delta 0px、horizontal overflow false、nested scroll 0 |
| 900x1200 Dark | title 37.8px / 1 line、screenshot SHA256 `00f9c488ed1850cd8160fd1622c43977e459a350ca4b0e2219cb3d55c69c6d2b` |
| 1280x900 Light | title 44px / 1 line、screenshot SHA256 `e223965b3a4a9820d3fb13aabd7ae1e767800dcc9b868821b51e7b1331fe2e50` |
| Theme | Auto default、explicit Light/Dark、system resolution evidenceあり |
| Print | light forced、utilities static、shot break avoidance。pagination successはclaimしない |
| Negative probes | 22/22 pass and fail closed |
| Source protection | Visual Treatment 13 / Storyboard 7 / Execution 9 files unchanged |
| Result | `passed=true`、`failures=[]`、warnings 0 |

H0 が証明するのは package integrity、provenance、layout、source protection、closed boundaries です。H0 は、reference choice が創作的に適切か、三つのshotが説明なしで伝わるか、別制作者が再現できるかを証明しません。

## Acceptance ladder

| Level | Meaning | Current state | Authority |
| --- | --- | --- | --- |
| H0 | Deterministic package / integrity / layout / boundary checks | pass | repository validators and result JSON |
| H1 | Human transfer comprehension | not started | independent human supervisor or delegated creator |
| H2 | Production choice: assets, rights, voice, engine | closed | explicit owners and separate authorization |
| H3 | Offline assembly / production candidate | not started | production implementer + human editor |
| H4 | Release approval / publication | closed | human product, rights, canon, and release owners |

## 完成度の見立て

これは承認率ではなく、残作業量と dependency depth の planning estimate です。

- Beat 2 Composition Board: `[█████████░] 95%`
  - H0、13-file package、provenance、browser、print、22 probes、three-package source protection は完了
  - 残る正規 gate は H1 human composition-transfer comprehension
- Beat 2 Visual Treatment Pilot: `[██████████] 100%` as preserved predecessor
  - package bytes と validation authority を変更せず Composition Board の source として保持
- Visual-treatment pattern for all 19 shots: `[██░░░░░░░░] 20%`
  - 3/19 shots だけが実referenceで具体化済み
  - Beat 2 固有の成功を全体 template の成功とはまだ見なせない
- Local-first review / editorial / planning MVP: `[████████░░] 82%`
  - extraction guards、review、revision、handoff、blueprint、execution、storyboard が接続済み
  - real provider、durable state、production assembly は未実装
- First reproducible offline candidate: `[████░░░░░░] 40%`
  - 180-second plan とpackage contractはある
  - selected/cleared media、calibrated voice、assembly recipe、render evidence がない
- End-to-end publishable fiction factory: `[███░░░░░░░] 30%`
  - releaseに必要なplanning evidenceはある
  - rights、canon、production approval、publishing controls、operational feedback loop は未開始

## 最大の delivery gap

最大のgapは、機械検証の不足ではなく「一つの成功した planning/reference slice を、再現可能な全作品 production system へ変換する途中」であることです。

1. Beat 2 page の human transfer quality が未判定。
2. concrete visual treatment は 3/19 shots に限定。
3. reference は production selection / rights clearance ではない。
4. synthetic narration は engine-neutral proxy のみ。
5. 180秒 offline assembly と reproducible render がない。
6. final truth / canon / release authority は人間に保持されたまま。
7. provider-backed extraction、durable state、job orchestration、publishing adapter は別laneで未実装。

## Residual Work

各行は Purpose / Effect / Requirements / State / Owner / Next move を保持します。

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Beat 2 H1 review | 別制作者への構図伝達を実測 | Boardをacceptまたはevidence-bounded repairへ進める | standalone Board only、freeform explanation、no audit coaching | ready / not started | human supervisor or delegated creator | 各shotのcrop、focal order、eye path、depth、placement、borrowed portions、三画面の差を説明 |
| Beat 2 repair | H1で観測された構図摩擦だけを除去 | protected sourcesを壊さずtransfer qualityを閉じる | 2/3以上が改善しなければ`COMPOSITION_SPECIFICITY_BLOCKER`、それ以外は弱いshotのみ | conditional | product implementer | blockerなら停止、非blockerなら一回のnarrow repairと再レビュー |
| Pattern generalization | Beat 2固有のdesignを汎用contractと誤認しない | full-story expansion前にtemplateのtransferabilityを検証 | 異質なbeatを一つ選び、同じacceptance contractで比較 | not started | visual direction owner + implementer | H1 pass後にsecond-beat falsification pilotを決定 |
| Full 19-shot treatment | 全体のvisual treatmentを一貫化 | offline assembly前のshot-level directionが揃う | pattern pass、all references remain reference-only、source timing immutable | 3/19 shots concrete | visual director + asset curator | pattern承認後にbeat単位でexpand |
| Asset / rights intake | generic requirementsをproduction candidatesへ変える | shotへreal mediaを割り当て可能 | separate H2 authorization、provenance、license/use review、replacement path | 14/14 unselected / not_reviewed | producer + rights reviewer | one requirement sandboxから開始 |
| Synthetic voice calibration | proxy timingをengine evidenceへ置換 | pronunciation / pause / prosody / actual durationを計測 | one authorized local engine/voice、unchanged narration、non-release label | not started | voice implementer + human listener | calibration packetを先に定義 |
| Offline assembly | 180秒timelineを一度組む | missing assets、timing conflict、subtitle readability、render costを実測 | selected sandbox media、voice evidence、local render authorization、watermark | not started | production implementer + editor | low-resolution no-publish rehearsal |
| Canon decisions | 最小限のstory truthを人間が確定 | ending-sensitive production choiceが可能 | explicit packet、affected artifacts、rollback、no silent promotion | Toma / moth / Council / ending held | human author | offline candidateが要求する最小decisionだけを提示 |
| Provider adapter | deterministic extractionをreal providerで補完 | candidate throughputとcoverageを向上 | provider/model/endpoint/credentials/transport/timeout/retry/external-call approval | no-call boundary only | product owner + AI/security implementers | record/replay interfaceをcredentialsなしで先行設計 |
| Durable state | browser/local JSONをversioned storageへ移行 | recovery、migration、backup、multi-session audit | storage choice、schema version、migration、backup、no silent canon | not started | product implementer | isolated SQLite/file-backed spikeを比較 |
| Production orchestration | workflowをresumable job graph化 | partial rerun、cache、failure recovery、provenance | stable assembly/provider/state contracts、idempotency、human checkpoints | not started | pipeline implementer | one-project no-publish graphを定義 |
| Release controls | productionと公開判断を分離 | dry-run、metadata preview、approval、rollbackが監査可能 | rights/canon/production approval、credential isolation、platform policy | explicitly closed | release owner + publishing implementer | no-call publication envelopeを設計 |

## Goal Horizon

### G0 — Beat 2 Human Composition-Transfer Review

- Purpose: Boardだけで三つのshotのcrop、focal order、depth、placement、referenceの借用範囲が伝わるか確認する。
- Effect: 現在唯一のblocking product uncertaintyを解消する。
- Requirements: project docsや口頭補足を見せず、自由文で説明してもらう。
- State: complete; H0 green、H1 `3/3 = 1.0`、`H1_COMPOSITION_TRANSFER_PASS`。
- Owner: independent reviewerが判定を記録済み。human supervisorはsuccessor authorizationを所有。
- Next move: H1を再実施せず、`docs/review/beat2-composition-board.md`のevidence matrixを正本として保持。

### G1 — Close the Composition Board with Evidence-Bounded Repair

- Purpose: H1結果をdurable acceptanceへ変換する。
- Effect: Composition Boardを終わらせ、無限のvisual micro-tuningを防ぐ。
- Requirements: passならno-op closeout、非blocker failなら観測された弱いshotだけを一回修正、blockerならAI generationを開かず停止。
- State: complete as no-op closeout; weak shot 0、Board repair 0。
- Owner: product implementer + H1 reviewer。
- Next move: Boardをaccepted Beat 2 checkpointとして保持し、根拠なしのmicro-tuningを行わない。

### G2 — Second-Beat Falsification Pilot

- Purpose: Beat 2向けpatternが別のvisual problemでも成立するか反証テストする。
- Effect: 19shot全展開前にoverfitを検出できる。
- Requirements: contrastの強い一beatだけ、同じprovenance/role/layout/H1 contract、source不変。
- State: recommended from H1 pass; not authorized or started。
- Owner: visual direction owner + product implementer。
- Next move: H1 pass後、最も異質なbeatを一つ選ぶ。

### G3 — Full 19-Shot Visual Treatment Contract

- Purpose: complete storyboardをconcrete reference-led directionへ変える。
- Effect: 別制作者が全180秒を一貫したvisual systemとして準備できる。
- Requirements: G0–G2、beat-level batching、reference-only honesty、held truth、rights非承認。
- State: 3/19 shotsのみ具体化。
- Owner: visual director + implementer + asset curator。
- Next move: template acceptance matrixとper-beat stopping ruleを定義。

### G4 — Asset and Rights Readiness Sandbox

- Purpose: referenceとproduction candidateの間を安全につなぐ。
- Effect: selectedとrights-clearedを混同せずreal media intakeを検証できる。
- Requirements: separate H2 authorization、creator/source/license/use/attribution記録、reject/replace/rollback。
- State: closed; 14/14 requirements unselected / not_reviewed。
- Owner: producer / asset curator / rights reviewer。
- Next move: one requirementだけをsandbox intake。

### G5 — Local Synthetic Voice Calibration

- Purpose: engine-neutral text-density proxyを実engine measurementへ置換する。
- Effect: pronunciation、pause、prosody、B1–B6 duration/headroomが分かる。
- Requirements: one engine/voice authorization、unchanged narration、local-only、non-release audio。
- State: closed; engine/voice/audio unselected。
- Owner: voice implementer + human listener。
- Next move: one-engine calibration packetとpass/fail thresholdsを定義。

### G6 — Offline 180-Second Assembly Rehearsal

- Purpose: publishせずvoice、subtitles、19 shotsを一度組む。
- Effect: timeline conflict、edit cost、missing media、subtitle readability、render reproducibilityを実測する。
- Requirements: G3–G5 evidence、local render authorization、watermark、deterministic manifest。
- State: not started。
- Owner: production implementer + human editor。
- Next move: low-resolution no-publish candidateをacceptance targetにする。

### G7 — First Production-Ready Local Candidate

- Purpose: story、editorial、visual、voice、rights evidence、render recipeを一候補へ束ねる。
- Effect: planning completeからreproducible pre-release candidateへ進む。
- Requirements: G0–G6、production approvalとrelease approvalの分離、rollback/provenance manifest。
- State: not started。
- Owner: human product owner + production implementer。
- Next move: candidate acceptance matrixを実装前に確定。

### G8 — Minimum Human Canon Gate

- Purpose: candidateが本当に必要とするstory truthだけを人間が決める。
- Effect: 制作仮説とcanonを混同せず、不要なpremature decisionを避ける。
- Requirements: explicit decision、before/after evidence、affected artifacts、rollback、no silent promotion。
- State: Toma fate、brass moth truth/function、Council motive、ending truth held。
- Owner: human author / canon owner。
- Next move: G7が要求する最小decision packetだけを作る。

### G9 — Guarded Provider-Backed Extraction

- Purpose: local deterministic extractionをsource-tracked provider outputで補完する。
- Effect: candidate throughputを上げながらhuman authorityとfail-closed guardを維持する。
- Requirements: provider/model/endpoint/credential/transport/timeout/retry/external-call authorization、record/replay fixtures、existing source-span/conflict gates。
- State: interfaces and no-call readiness exist; live adapter not started。
- Owner: product owner + AI implementer + security owner。
- Next move: credentialsを触らないadapter interfaceとreplay contractを先行。

### G10 — Durable Versioned Project State

- Purpose: browser storageとmanual JSONを越えてproject stateを保持する。
- Effect: backup、migration、recovery、multi-session auditが可能になる。
- Requirements: file-backed / SQLite / browser expansionの比較、schema version、migration、backup/export、write concurrency、no silent canon。
- State: not started。
- Owner: product implementer。
- Next move: provider/publishingと分離したlocal storage spike。

### G11 — Reproducible Production Orchestration

- Purpose: extraction、review、revision、asset intake、voice、renderをresumable job graphにする。
- Effect: partial rerun、failure recovery、cache、artifact provenance、cost/time observationが可能になる。
- Requirements: G7/G9/G10 stable contracts、idempotency、job state、human checkpoints。
- State: not started。
- Owner: pipeline implementer + product owner。
- Next move: one project / no publish / one render candidate限定のgraphを定義。

### G12 — Publishing Staging and Release Gate

- Purpose: upload操作と公開判断をproduction pipelineから分離する。
- Effect: metadata preview、private/unlisted staging、release approval、rollbackを監査可能にする。
- Requirements: credential isolation、rights clearance、canon/production approval、platform policy、dry-run、human release decision。
- State: explicitly closed。
- Owner: human release owner + publishing implementer。
- Next move: API callなしのpublication envelopeを先に作る。

### G13 — First Human-Approved Release

- Purpose: 一作品をstory authority、rights、production、publicationの全gateを通して公開する。
- Effect: Fast Fiction Factoryのend-to-end valueと実運用costを検証する。
- Requirements: G7/G8/G11/G12、final approvals、release evidence、rollback/retention plan。
- State: not started。
- Owner: human author / product owner / release operator。
- Next move: release前acceptance reportとapproval owner一覧を生成。

### G14 — Multi-Project / Series Learning Loop

- Purpose: 一作品の結果を複数作品・seriesへ安全に拡張する。
- Effect: style reuse、series canon、asset reuse、review latency、production cost、release qualityを継続改善できる。
- Requirements: project isolation、series canon hierarchy、credential separation、metrics taxonomy、override、retention/privacy policy。
- State: long-term horizon。
- Owner: product owner + platform/editorial/production leads。
- Next move: G13後の実測bottleneckだけをKPI化し、先回りしたplatform化を避ける。

## 推奨クリティカルパス

`G0 Beat 2 H1 → G1 pilot close → G2 second-beat falsification → G3 full 19-shot treatment → [G4 asset/rights + G5 voice] → G6 offline assembly → G7 local candidate → G8 minimum canon → G11 orchestration → G12 release gate → G13 first release → G14 learning loop`

G9 provider extraction と G10 durable state は platform lane として G1 後に並行設計できます。ただし、現作品の G2–G7 を provider や database 待ちにする必要はありません。反対に、provider/db の存在をproduction readinessやcanon acceptanceの証拠にしてはいけません。

## 監修 AI に求める判断

1. 完了した G0 Beat 2 H1を再実施せず、`3/3`のevidence recordを保持すること。
2. full 19-shot expansionへ直行せず、G2 second-beat falsificationを一回だけ承認するか判断すること。推奨は承認する。
3. G2 pass後、G3全体展開とG4 one-requirement rights sandboxの順序を承認すること。
4. G5 voice calibrationをG4と並行するか、visual package完了後にするか判断すること。
5. G8 human-owned truthをG7候補が要求する最小範囲までheldに保つこと。
6. G9/G10をproduction laneから分離し、credential、provider、databaseがcurrent deliveryを乗っ取らないようにすること。

推奨は、完了したBeat 2 H1をcloseし、次に一つの対照的なBeatだけでpatternを反証テストする経路です。これにより、Beat 2固有の成功を19shot全体へ早まって一般化せず、source contractとrights/canon boundariesを保ったまま、offline assemblyへ最短距離で進めます。

## Restart commands

```powershell
git fetch --prune origin
git switch codex/beat2-h1-handoff
git pull --ff-only
git rev-list --left-right --count "HEAD...@{u}"
git status --short --branch

$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw -Encoding UTF8 | ConvertFrom-Json
Invoke-Expression $manifest.validation_command

uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"
.\scripts\operator\open_review.ps1 -Mode blueprint -PrintUri
Select-String -Path .\docs\review\beat2-composition-board.md -Pattern "H1 independent transfer result" -Context 0,40
```

H1 completed record は `docs/review/beat2-composition-board.md`、live H0 result は `artifacts/beat2-composition-board-result.json` を正本とします。Visual Treatment Pilot は immutable predecessor です。通常のhealth checkでは `smoke-*` regenerationを使わず、root manifestのread-only validationを使います。新規cloneでlocal branchがない場合は `git switch --track origin/codex/beat2-h1-handoff` を使います。
