# 監修 AI 向け現状報告と長期目標案

更新日: 2026-07-13 JST

## 結論

Fast Fiction Factory は、ローカル完結のレビュー用プロトタイプから、別の制作者へ制作準備を引き渡せる段階まで進んでいます。現在の active artifact は `fff-production-execution-pack-001`、active lane は `PRODUCTION_EXECUTION_PACK` です。受理済みの 180 秒 / 6 ビート / 19 ショット / 20 字幕 / 6 ナレーション / 3 サムネイル方向を、14 件の再利用可能な generic asset requirements と synthetic narration timing envelope に接続した九ファイル package が存在します。

H0 の機械検証は、Windows checkout の改行差を恒久的に防ぐ `.gitattributes` 修正後の現環境で green です。次の正規ゲートは H1 Human Execution-Readiness Review です。H1 では technical audit を開かず、別の制作者が準備物、再利用物、19 ショットの組立順、未選択の判断を説明できるかを自由文で確認します。

この報告は、engine / voice / asset / rights / provider / credential / generation / render / upload / publication / database / final canon の承認ではありません。以下の長期目標は順序と依存関係の提案であり、閉じた gate を自動的に開きません。

## 同期と開発可能性

| 項目 | 現在の確認結果 |
| --- | --- |
| Repository | `C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory` |
| Branch | `master` |
| 取り込み済み remote base | `79160c3 Record production execution handoff` |
| Remote parity | 取り込み直後の `HEAD...origin/master` は `0 0`。この報告と改行固定を含む successor は Git の最新 HEAD を正本とする |
| Product implementation checkpoint | `fc897afbb6b91a3b76766db98d86e2aedc448017 Add production execution pack` |
| Runtime | Node.js `v24.13.0`; npm `11.6.2`; uvx `0.10.7` |
| 通常 health check | `artifacts/artifact-manifest.json` の `validation_command`; read-only `validate-*` chain |
| Review entry | `artifacts/production-execution-pack/production-execution-pack.html` |
| Current authority | `docs/project-context.md`、`docs/review/current-status.md`、本報告、`artifacts/production-execution-pack-result.json` |

### 同期時に検出し、修復した開発阻害要因

リモートを fast-forward した直後、Windows の global `core.autocrlf=true` により、Git blob では LF の top-level result JSON と review HTML が worktree では CRLF になっていました。製品内容の差ではありませんが、raw-byte SHA256 を契約にする Production Execution Pack validator はこれを source fingerprint mismatch として正しく拒否しました。

- 114 件の JSON / HTML / MJS を比較し、53 件の worktree-byte mismatch を確認
- 53 件はすべて CRLF を LF に戻すだけで Git blob と一致
- `.gitattributes` に `* text=auto eol=lf` を追加し、OS をまたいでも hash-sensitive text が LF になるよう固定
- LF 適用後、Production Execution Pack、Typography Balance、Operator Brief、Blueprint、Derivative、Revision、Handoff の read-only chain が pass
- package や source の内容、timing、truth、rights、canon、UI behavior は変更していない

この修復の目的は、Windows checkout でも「tracked file は clean なのに raw-byte validator だけ失敗する」状態を再発させないことです。

## 現在あるもの

1. `artifacts/production-execution-pack/`
   - 九ファイルの standalone handoff
   - 6 beats / 180 seconds / 19 shots / 20 subtitles / 6 narration segments / 3 thumbnail directions
   - 14 deduplicated generic asset requirements; 19/19 shots が requirement を参照
   - B1/B3/B4/B6 は `proxy_headroom_confirmed`; B2/B5 は `existing_pass_unmeasured`
   - `voice_mode=synthetic` だが engine / voice / audio は未選択・未生成

2. 保護された制作指示 source chain
   - Operator Brief Typography Balance
   - Operator Production Brief
   - Content Production Blueprint
   - Editorial Derivative Preview
   - Editorial Revision Roundtrip
   - Bridge Editorial Handoff Pack
   - Bridge Storyboard Flow

3. ローカル review / governance foundation
   - Review Workbench、Brief、Bridge、Handoff、Revision、Derivative、Blueprint の各 route
   - source-span、contradictory claim、translation provenance、downstream adoption、rollback の fail-closed readbacks
   - Claim Ledger に 1 件、Profile に non-canon annotation 1 件だけを明示的な過去承認の下で保持
   - Toma fate、brass moth truth、Council motive、contradictory claim truth は human-owned のまま

4. 再現可能なローカル toolchain
   - zero-dependency Node.js validation / adapter tools
   - `uvx --with mkdocs-material` による strict docs build
   - dependency-free local review launcher

## 完成度の見立て

この割合は承認判定ではなく、残作業の規模を比較するための planning estimate です。

- Active Production Execution Pack slice: `[█████████░] 90%`
  - deterministic package、integrity、browser/print evidence、negative probes は完了
  - 残る正規 gate は H1 transfer-comprehension
- Local-first review and handoff MVP: `[████████░░] 80%`
  - memo review、candidate governance、editorial roundtrip、production planning、portable handoff は存在
  - real provider extraction、durable database、production execution は未実装
- End-to-end publishable fiction factory: `[███░░░░░░░] 30%`
  - production-ready source contract はあるが、engine calibration、cleared media、render、release approval、publishing loop が未開始

## 現在不足しているもの

| 不足 | 現在の state | 影響 |
| --- | --- | --- |
| H1 execution-readiness | 未実施 | package が別制作者へ説明なしで伝わるか未確定 |
| Synthetic engine calibration | 未開始 | human proxy はあるが実音声の pronunciation / pause / prosody / duration は不明 |
| B2/B5 timing evidence | `existing_pass_unmeasured` | 数値を捏造せず保留中。H2 で全 beat を実測する必要がある |
| Asset selection and provenance | 14/14 `unselected` | 19 shots を実素材で組めない |
| Rights review | 14/14 `not_reviewed`; protected source shots `not_cleared` | release candidate を名乗れない |
| Audio / image / video generation and render | 未開始 | offline playable production が存在しない |
| Model/API extraction adapter | 未開始 | memo からの生成は deterministic local adapter の範囲 |
| Durable project database | 未開始 | browser/local JSON を越える migration / backup / multi-session state がない |
| Publishing adapter and release gate | 未開始 | upload、public release、post-release rollback がない |
| Final canon decisions | human-owned unresolved | ending-sensitive Timeline / Story Seed / Canon を確定できない |

## 推奨する目標列

### G0 — Checkout portability を固定する

- Purpose: Windows / Linux のどちらでも raw-byte integrity validation を同じ結果にする。
- Effect: clean checkout 直後に manifest health check が再現可能になる。
- Requirements: LF policy を維持し、hash-sensitive text を editor の OS 設定へ依存させない。
- State: 本報告を含む successor で実装。現 checkout の read-only chain は pass。
- Owner: Product implementer / repository maintainer。
- Next move: commit 後の clean checkout でも manifest と `git diff --check` を再確認する。

### G1 — H1 Human Execution-Readiness Review を閉じる

- Purpose: technical audit を開かず、別制作者が package を実行可能な順序で説明できるか確認する。
- Effect: instruction ambiguity と transfer friction を production 開始前に修正できる。
- Requirements: standalone HTML だけを起点に、6 beats、19 shots、14 requirements、再利用、閉じた選択を自由文で説明する。
- State: 次の正規 gate。H0 は green。
- Owner: Human reviewer; agent は観察を構造化して記録する。
- Next move: H1 を実施し、pass なら current slice を閉じる。fail なら wording / grouping のみを狭く修正する。

### G2 — H2 Local Synthetic Voice Calibration

- Purpose: proxy timing を一つの実 engine / voice の実測へ置き換える。
- Effect: 6 beats 全体の pronunciation、pause、prosody、duration と headroom が分かる。
- Requirements: engine / voice の明示承認、local-only 実行、unchanged narration baseline、B1–B6 の同一条件測定、生成 audio の non-release 表示。
- State: 未開始、別承認が必要。
- Owner: Voice/audio implementer + human listener。
- Next move: 一つの local engine に限定した calibration packet を先に設計し、生成・採用・公開を分離する。

### G3 — Asset and Rights Readiness Pack

- Purpose: 14 generic requirements を、provenance と権利状態が追跡できる候補へ変える。
- Effect: 19 shots を具体素材へ割り当てても release readiness を誤認しなくなる。
- Requirements: source URL / creator / license / acquisition date / permitted use / modification / attribution / expiry を記録し、`selected` と `rights_cleared` を別 gate にする。
- State: 14/14 unselected、14/14 rights not reviewed。
- Owner: Producer / asset curator / rights owner。
- Next move: まず 1 requirement を sandbox intake し、provenance schema と rejection / replacement path を検証する。

### G4 — Offline Assembly Rehearsal

- Purpose: publish せず、音声・字幕・19 shots を 180 秒 timeline に一度組み上げる。
- Effect: timing、readability、missing assets、edit cost、render reproducibility を実測できる。
- Requirements: G2 の calibrated timing、G3 の使用可能素材、local render authorization、watermark/non-release labeling、deterministic render manifest。
- State: 未開始。
- Owner: Production implementer + human editor。
- Next move: low-resolution local-only render を acceptance target にし、upload / public release は明示的に除外する。

### G5 — First Production-Ready Local Candidate

- Purpose: story source、editorial package、voice、assets、rights evidence、render recipe を一つの reviewable candidate に束ねる。
- Effect: 「計画が揃った」から「公開前の完成候補が再現できる」へ進む。
- Requirements: G1–G4 pass、canon-sensitive unresolved items の明示、release checklist、rollback and provenance manifest。
- State: 未開始。
- Owner: Human product owner + production implementer。
- Next move: candidate definition と acceptance matrix を作り、production approval と public release approval を別判定にする。

### G6 — Guarded Provider-Backed Extraction

- Purpose: deterministic mock extraction を、source-tracked provider output で補完する。
- Effect: raw memo から candidate を増やせるが、human authority と fail-closed guards を維持できる。
- Requirements: provider / model / endpoint / credential storage / transport / timeout / retry / external call permission の個別承認、既存 validator・source-span・contradictory-claim gates の pass。
- State: boundary / envelope / no-call readiness は存在。real adapter は未開始。
- Owner: Product owner + AI implementer + security owner。
- Next move: credentials を触らない adapter interface と record/replay fixture を先に作り、live call を最後の gate にする。

### G7 — Durable Project State

- Purpose: browser storage と手動 JSON を越えて、複数 session の project state を安全に保持する。
- Effect: versioned project、backup、migration、recovery、audit が可能になる。
- Requirements: file-backed / SQLite / browser expansion の選定、schema version、migration policy、backup/export、no silent canon promotion、concurrent-write rule。
- State: 未開始。
- Owner: Product implementer。
- Next move: provider / publishing と独立した local SQLite spike を行い、export/import parity と rollback を検証する。

### G8 — Reproducible Production Orchestration

- Purpose: extraction、review、editorial revision、asset intake、voice、render を一つの resumable job graph にする。
- Effect: 一話の再実行、部分再生成、failure recovery、provenance が自動化できる。
- Requirements: G5–G7 の stable contracts、idempotent steps、artifact cache、job state、cost/time telemetry、human approval checkpoints。
- State: 未開始。
- Owner: Pipeline implementer + product owner。
- Next move: production candidate 一件だけを対象に、no-publish orchestration plan と stop conditions を定義する。

### G9 — Publishing Staging and Release Gate

- Purpose: upload 操作と公開判断を production pipeline から分離して安全に扱う。
- Effect: metadata preview、private/unlisted staging、release approval、rollback が監査可能になる。
- Requirements: credential isolation、rights clearance、final canon / production approval、platform policy、dry-run、human release decision、post-release incident path。
- State: 未開始、現在は明示的に closed。
- Owner: Human release owner + publishing implementer。
- Next move: API call なしの publication envelope と dry-run manifest を設計し、credential work はその後に別承認する。

### G10 — First Human-Approved Release

- Purpose: 一つの作品を、story authority・rights・production・publication の全 gate を通して公開する。
- Effect: Fast Fiction Factory の end-to-end value と真の運用コストを実証できる。
- Requirements: G5、G8、G9、最終 human approvals、release evidence、rollback/retention plan。
- State: 未開始。
- Owner: Human author / product owner / release operator。
- Next move: 公開前に acceptance report を生成し、各 approval owner の明示的な署名相当を揃える。

### G11 — Multi-Project / Series Scale and Learning Loop

- Purpose: 一話の成功を複数作品・シリーズ運用へ拡張し、品質と作業時間を継続改善する。
- Effect: reusable style packs、series canon、asset reuse、review latency、production cost、release quality を横断管理できる。
- Requirements: project isolation、series canon hierarchy、tenant/credential separation、metrics taxonomy、human override、retention/privacy policy。
- State: 長期構想。
- Owner: Product owner + platform implementer + editorial/production leads。
- Next move: 最初の human-approved release 後に、実測 bottleneck だけを KPI 化し、先回りした大規模 platform 化を避ける。

## 推奨クリティカルパス

`G0 portability → G1 H1 review → (G2 voice calibration + G3 asset/rights) → G4 offline assembly → G5 production-ready local candidate → G8 orchestration → G9 release gate → G10 first release → G11 scale`

G6 provider extraction と G7 durable state は、G1 後に独立した platform lane として進められます。ただし、現作品の first local production candidate を provider / database 実装待ちにする必要はありません。

## 監修 AI に求める次の判断

1. 直近は G1 H1 review を優先し、current slice を閉じるか。
2. H1 pass 後、G2 voice calibration と G3 asset/rights のどちらを先行または並行するか。
3. G6 provider extraction / G7 durable state を制作 lane と分離した platform lane として許可するか。
4. Toma fate、brass moth truth、Council motive は引き続き held とし、production candidate でも unresolved boundary として扱うか。

推奨は、まず G1 を完了し、その後 G2 と G3 を狭い sandbox で並行準備することです。これが、既存の受理済み content contract を壊さず、最短で G4 offline assembly へ到達する経路です。
