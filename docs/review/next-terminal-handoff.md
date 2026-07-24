# Next Terminal Handoff

## Start here — synchronized development handoff (2026-07-24 JST)

`master` was fetched and is at `origin/master`. The verified restart tip is the current `HEAD = origin/master` (run `git log -1 --oneline --decorate` for its exact SHA), ahead/behind `0 / 0`; implementation parent `58049c9` (`Add resumable private preview pipeline`) contains the resumable private pipeline for a creator continuing on another terminal.

Synchronization began with machine-local `.serena/project.yml` and six handoff/report documents already modified. They were preserved without reset, stash, stage, or overwrite. The six documentation files were published on `origin/master`; `.serena/project.yml` remains terminal-local and excluded. Product artifacts, protected result JSON, tools, scripts, and public UI were not modified by this handoff refresh.

```powershell
git fetch --prune origin
git pull --ff-only origin master
git rev-list --left-right --count "HEAD...origin/master"
git status --short --branch --untracked-files=all
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw -Encoding UTF8 | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
node .\tools\fff-private-pipeline.mjs dry-run --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'
node .\tools\fff-private-pipeline.mjs build --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'
node .\tools\fff-private-pipeline.mjs verify --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'
.\scripts\operator\open_review.ps1 -Mode brief -PrintUri
Invoke-Item .\artifacts\private-previsualization-timeline\private-previsualization-timeline.html
```

Verified on 2026-07-24: the root read-only chain passed for five artifact validators, `node --test tests/fff-private-pipeline.test.mjs` passed 6/6, the four protected predecessor result SHA256 values stayed unchanged, strict MkDocs passed, and both `brief` and `blueprint` local routes resolved. No `npm install` is required because the repository has no root package manifest or lockfile.

The next supervising action is one exact review of `fff-private-previsualization-timeline-001`, or a resumable external-run build followed by `verify` when the private MP4 must be reconstructed. Return either `accept` with no artifact mutation, or `revise` with each material finding bound to a shot ID, cue ID, or timestamp. `owner_asset_plan_decision` remains an independent Product Owner gate. Asset selection, rights, voice/provider/credentials, generation, render, publication, persistence, production approval, release, and canon remain separately closed.

Read the opening 2026-07-24 sections first. Lower dated sections are preserved history.

## Start here — synchronized development handoff (2026-07-23 JST)

The latest remote state was fetched and fast-forward pulled. Before this documentation refresh, `HEAD` and `origin/master` were both `793b70e3418aebbd17fcbfd45c6d03d1d7840584` (`Consolidate supervisor handoff roadmap`), parity was `0 / 0`, and Git reported `Already up to date`. A pre-existing `.serena/project.yml` tool-configuration modification remains unstaged and untouched; it is not a product change and means the worktree is intentionally not described as clean. This exact remote commit is the restart base; the current handoff edits remain local until separately committed and pushed.

```powershell
git fetch --prune origin
git pull --ff-only origin master
git rev-list --left-right --count "HEAD...origin/master"
git status --short --branch --untracked-files=all
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw -Encoding UTF8 | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
.\scripts\operator\open_review.ps1 -Mode brief -PrintUri
Invoke-Item .\artifacts\private-previsualization-timeline\private-previsualization-timeline.html
```

The root read-only chain passed on Git `2.53.0.windows.1`, Node `v24.13.0`, npm `11.6.2`, uvx `0.10.7`, and FFmpeg/ffprobe `8.0.1`; the four protected result hashes did not change. Strict MkDocs build passed to an OS temporary directory. No root dependency installation is required. Twenty-three existing review pages absent from `mkdocs.yml` navigation are documentation discoverability debt only.

Read `docs/review/supervisor-current-report.md` immediately after validation. The next product action is one supervising-AI/creator experience review of `fff-private-previsualization-timeline-001`, with each material observation bound to a shot ID, cue ID, or timestamp. Preserve the artifact if no defect is found; authorize only one bounded canonical-lineage repair if a defect is found.

The parallel Product Owner action is still `owner_asset_plan_decision`: A accepts the default plan, B names exception requirement IDs, or C requests reconstruction. Do not infer this decision from preview acceptance. Media selection, rights clearance, acquisition/construction, provider/API/credentials, voice calibration, generation, render, upload/publication, database persistence, production approval, release acceptance, and final canon remain separately closed.

## Start here — synchronized development handoff (2026-07-22 JST)

The latest remote state was fetched and fast-forward pulled. Before this documentation refresh, `HEAD` and `origin/master` were both `48efb862cca5795bd8f1f8b24b05ff91815bbdbc`, parity was `0 / 0`, and the worktree was clean including untracked files. After publication, use current `origin/master` as the exact docs-successor restart authority rather than assuming that predecessor SHA.

```powershell
git fetch --prune origin
git pull --ff-only origin master
git rev-list --left-right --count "HEAD...origin/master"
git status --short --branch --untracked-files=all
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw -Encoding UTF8 | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
Invoke-Item .\artifacts\private-previsualization-timeline\private-previsualization-timeline.html
```

The manifest validation chain passed on Git `2.53.0.windows.1`, Node `v24.13.0`, npm `11.6.2`, uvx `0.10.7`, and FFmpeg/ffprobe `8.0.1`; strict MkDocs build also passed. No repository dependency installation is required. The existing MkDocs notice about review pages absent from `nav` is non-blocking documentation debt.

The only immediately executable product action is a supervising-AI/creator experience review of `fff-private-previsualization-timeline-001`. Record observations against an exact shot ID, subtitle cue ID, or timestamp. Preserve the artifact when no material defect is found; authorize only a bounded canonical-lineage repair when one is found. Separately, the Product Owner may answer `owner_asset_plan_decision` with A default, B exception requirement IDs, or C reconstruction. Do not select media, decide rights, configure a provider, generate assets, render, upload, persist state, approve production, release publicly, or decide canon from this handoff.

For the detailed verified/pending/owner-owned roadmap, read `docs/review/supervisor-current-report.md` first after the validator.

## Active re-entry: Private Previsualization Timeline (2026-07-21 JST)

Start at `fff-private-previsualization-timeline-001`. The repository now contains a playable, silent, local 180-second preview with exact 6-Beat / 19-shot chronology, 19 canonical frames, 14 corrected readiness thumbnails, a 19-shot contact sheet, and a 960×540 H.264 MP4. The integrated source remains immutable and production selection, rights clearance, voice, final render, and publication remain closed.

This restart packet was refreshed from clean synchronized `master` / `origin/master` at `81e9ad5929ba2e90fd7984583c7ae772ab5e93b2`. Product implementation checkpoint `e5ae7a11af3430c0a410948d8f5dc218de513b19` is immutable; after this docs-only publication, the current `origin/master` HEAD is the exact cross-terminal handoff authority.

```powershell
git fetch --prune origin
git pull --ff-only origin master
git rev-list --left-right --count "HEAD...origin/master"
git status --short --branch --untracked-files=all
node tools/fff-state.mjs validate-private-previsualization-timeline artifacts/private-previsualization-timeline-result.json
node tools/fff-state.mjs validate-asset-rights-readiness-packet artifacts/asset-rights-readiness-packet-result.json
node tools/fff-state.mjs validate-integrated-visual-production-package artifacts/integrated-visual-production-package-result.json
Invoke-Item .\artifacts\private-previsualization-timeline\private-previsualization-timeline.html
```

Read in order: `AGENTS.md`, `docs/project-context.md`, `docs/review/current-status.md`, this file, `docs/review/supervisor-current-report.md`, `docs/review/private-previsualization-timeline.md`, then the result JSON. The immediate action is an experience review naming exact shot/cue/time evidence. In parallel, the only material-strategy action is the separately human-owned `owner_asset_plan_decision` using A default / B exception requirement IDs / C reconstruction. Do not repeat source integration, re-download media, infer asset-plan acceptance from preview usefulness, or treat private proxies as selected production assets.

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

## 監修AI向け Asset / Rights Readiness Packet 引き継ぎ（2026-07-20 JST）

Active artifactは `fff-asset-rights-readiness-packet-001`、laneは `ASSET_RIGHTS_READINESS`、source fingerprintは `78438f153257b5559a06d1b2cc638aa152adf432c1d0a414febf83296e4eb5eb` です。Product Ownerのwhole-story reviewを `OWNER_WHOLE_STORY_COMPOSITION_PASS` として記録し、19 shots / 14 requirements / 28 references / 36 aliases / 42 assignmentsを一つの素材準備計画へcross-mapしました。

### Start here now

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/asset-rights-readiness-packet.md
artifacts/asset-rights-readiness-packet/README_ASSET_RIGHTS_READINESS.md
artifacts/asset-rights-readiness-packet/asset-rights-readiness.html
artifacts/asset-rights-readiness-packet-result.json
artifacts/artifact-manifest.json
```

```powershell
git fetch --prune origin
git pull --ff-only
git rev-list --left-right --count "HEAD...@{u}"
git status --short --branch --untracked-files=all
node tools/fff-state.mjs validate-asset-rights-readiness-packet artifacts/asset-rights-readiness-packet-result.json
Invoke-Item .\artifacts\asset-rights-readiness-packet\asset-rights-readiness.html
```

推奨計画は deterministic original 9 / replacement candidate 3 / Owner-may-consider local proxy 1 / reference-only future lane 1です。例外IDは `AR-PROP-02`、source readbackは20 confirmed / 8 unavailable、stored metadata gapは0です。unavailableはrights判断へ変換していません。次のtrue human gateは `owner_asset_plan_decision` で、A=default採用、B=例外requirement IDだけ指定、C=material strategy再構成の一つです。全14 requirementの個別回答や28 source pageの再reviewは求めません。

### Stopping edge

- Owner decisionsは全件 `unselected`、publication compatibilityは全件 `unreviewed`。
- source/predecessor raster copy 0、download 0、hotlink 0、production selection 0、rights claim 0。
- 13 protected directoriesと76 predecessor resultsはresult内のinventory/aggregateを正本として保持。
- Material construction、new source acquisition、voice calibration、offline assembly、render、publication、database、final story authorityは開始しない。
- OwnerがA/B/Cを返しても、constructionとvoiceは別contract、offline assemblyはさらにrender authorizationまで必要。

## 保存記録: 監修AI向け Integrated Visual Production Package 引き継ぎ（2026-07-19 JST）

Active artifact は `fff-integrated-visual-production-package-001`、lane は `VISUAL_INTEGRATION`、実装baseは `b2ef9e214799e973e63543fbdf7118542bd583bf` です。別packageで存在した6幕・19 shots・180秒の具体構図を、一つのstandalone whole-story objectへ統合しました。参照unionは28 SHA256 identities、36 aliases、42 assignmentsです。19 thumbnails、19 full shot strips、5 lineagesを持ち、source raster copyは0です。

### Start here now

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/integrated-visual-production-package.md
artifacts/integrated-visual-production-package/README_INTEGRATED_VISUAL_PACKAGE.md
artifacts/integrated-visual-production-package/integrated-visual-production-package.html
artifacts/integrated-visual-production-package-result.json
artifacts/artifact-manifest.json
```

```powershell
git fetch --prune origin
git pull --ff-only
git rev-list --left-right --count "HEAD...@{u}"
git status --short --branch --untracked-files=all
node tools/fff-state.mjs validate-integrated-visual-production-package artifacts/integrated-visual-production-package-result.json
Invoke-Item .\artifacts\integrated-visual-production-package\integrated-visual-production-package.html
```

次のhuman actionは、Product Ownerによるexact integrated artifact全体の `owner_whole_story_composition_review` です。per-Beat reviewは再開しません。この引き継ぎ時点ではwhole-story reviewを実施していません。Owner observationが来るまで、shot repair、candidate選択、asset selection、rights clearance、generation、render、publication、database、production approval、canonへ進めないでください。

## 保存記録: Composition Expansion Wave 2 引き継ぎ（2026-07-19 JST）

Active artifact は `fff-composition-expansion-wave2-001`、lane は `COMPOSITION_EXPANSION`、実装baseは `b3312a2a4a8d5993d7091de36af2ad291b766aa0` です。Beat 5/6の正確な7 source shotsを、4点の新規licensed local referencesと8点のidentity検証済みinherited references、16 assignments、7 composition classesで具体化しました。既存のWave 1、Beat 2、Beat 4と合わせ、別package上の具体化は19/19 shotsです。統合19-shot packageはまだ作成していません。

### Start here

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/composition-expansion-wave2.md
artifacts/composition-expansion-wave2/README_COMPOSITION_EXPANSION_WAVE2.md
artifacts/composition-expansion-wave2/composition-expansion-wave2.html
artifacts/composition-expansion-wave2-result.json
artifacts/artifact-manifest.json
```

```powershell
git fetch --prune origin
git pull --ff-only
git status --short --branch
node tools/fff-state.mjs validate-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json
node tools/fff-state.mjs validate-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json
node tools/fff-state.mjs validate-beat2-composition-board artifacts/beat2-composition-board-result.json
node tools/fff-state.mjs validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json
node tools/fff-state.mjs validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json
node tools/fff-state.mjs validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json
node tools/fff-state.mjs validate-production-execution-pack artifacts/production-execution-pack-result.json
```

### Policy and stopping edge

- Wave 2 human review: none; post-Wave-2 human gate: false.
- Next human review: `after_integrated_19_shot_visual_package` only.
- Finished: exactly Beats 5/6 and seven shots; four new + eight inherited references; sixteen assignments; candidate balance; continuity; browser/theme/focus/print evidence; 56 negative probes; predecessor immutability.
- Farthest safe successor: a separately authorized data-only integrated 19-shot visual package that reuses the exact existing composition identities.
- Stop: do not infer production selection, rights clearance, generation, render, publication, database, production approval, canon, or external reproducibility.

### Active residual work

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Integrated 19-shot review object | 全shotを一つのreview surfaceへ束ねる | deferred whole-story composition reviewを開く | 別承認、exact package/hash binding、source/predecessor不変、production/rights非含有 | proposed / data only / not created | product owner + supervisor | bounded integration contractを発行 |
| Whole-story human review | 統合後の一貫性を判定 | composition acceptanceまたは限定修正要求 | integrated artifact完成後のみ | blocked on integration by policy | product owner | 統合artifact単位で実施 |

## 保存記録: Composition Expansion Wave 1 引き継ぎ（2026-07-19 JST）

Active artifact は `fff-composition-expansion-wave1-001`、lane は `COMPOSITION_EXPANSION`、実装baseは `a2f61c72680b2a7d9220f4a2d8f05c2e79ac5189` です。Beat 1「鐘のない塔」とBeat 3「消された名前」の正確な6 source shotを、12点のライセンス明示済みローカル参照画像、12 assignments、6 unique mains、6 composition classesで具体化しました。既存のBeat 2/4と合わせ、Beats 1–4の12/19 shotsが具体化済みです。

### Start here

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/composition-expansion-wave1.md
artifacts/composition-expansion-wave1/README_COMPOSITION_EXPANSION_WAVE1.md
artifacts/composition-expansion-wave1/composition-expansion-wave1.html
artifacts/composition-expansion-wave1-result.json
artifacts/artifact-manifest.json
```

```powershell
git fetch --prune origin
git pull --ff-only
git status --short --branch
node tools/fff-state.mjs validate-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json
node tools/fff-state.mjs validate-beat2-composition-board artifacts/beat2-composition-board-result.json
node tools/fff-state.mjs validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json
```

### Owner Review policy

- Beat 4: `OWNER_REVIEW_PASS`
- User observation: 「大きな破綻はなさそう」
- Effect: composition expansion authorized
- Evidence boundary: owner directional acceptance; independent transfer proofではない
- Per-Beat external reviewer: required=false
- Per-Beat blind review: discontinued
- Wave 1 human review: none
- Next human review: complete integrated 19-shot visual packageの後だけ
- External reproducibility: not claimed
- Beat 4 repair: not required

### Stopping edge

- Finished: exactly Beats 1/3 and six shots, 12 provenance-bearing local references, six structural composition classes, Beat continuity, machine validation, browser/theme/focus/print evidence, and immutable predecessor evidence.
- Next owned gate: owner/supervisorが別途許可した場合のみ、残り7件のBeat 5/6 compositionをdata-only Wave 2として定義し、その後19-shot visual packageへ統合する。
- Stop: Wave 1直後の人手reviewを要求しない。Beat 5/6、19-shot統合、production selection、rights clearance、generation、render、publish、database、canonへ自動進行しない。
- Source protection: result内の10 predecessor directory inventory（file count・各file SHA256・aggregate SHA256）を正本とし、post-validationでも一致させる。

### Active residual work

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Wave 2 proposal | 残り7 shotsを具体化する安全な境界を定義 | 19/19統合前の欠落を閉じる | 別承認、Beat 5/6のみ、licensed local references、同じtruth/rights guards | proposed / not authorized | product owner + supervisor | 承認時だけexecution contractを発行 |
| Integrated 19-shot visual package | 全shotを一つの連続したreview面に統合 | 初めて全編の視覚的連続性を人が判断可能 | Wave 2完了、source immutability、重複/continuity audit | future / gated | future worker | Wave 2 acceptance後のみ実装 |
| Integrated human review | 全編の構図と連続性を人手判定 | 次のproduction candidate gateへの根拠を作る | exact integrated artifact/hash、review protocol、truth/rights separation | future / owner gate | human owner or supervising AI | 19-shot integration完成後だけ実施 |
| Production/rights work | 実制作候補と利用条件を確定 | reference-onlyからproduction candidateへ移す可能性 | explicit selection、rights review、provenance acceptance | closed | human owner / rights owner | integrated human acceptance後も別承認 |

## 監修AI向け Beat 2 H1 完了引き継ぎ（2026-07-17 JST）

現在の accepted product artifact は `fff-beat2-composition-board-001` です。製品実装 `6ef134b2af6c52e38cf674168686886d41f4c087 Add Beat 2 composition board` と predecessor `72df19b33fd77b047170046db1a99620d1455976 Add Beat 2 visual treatment pilot` は不変です。lane `COMPOSITION_REVIEW` の独立H1は完了し、thread `fff-beat2-composition-transfer-h1-01`、slice `beat2-composition-transfer-review-v0` で全3 production shotをレビューした結果、`3/3 = 1.0 (100%)`、classification `H1_COMPOSITION_TRANSFER_PASS` でした。handoff publication base は synced `master` の `ba9ad3ffcf5fe4698483f17bfcaa47af0136d488`、remote handoff branch は `codex/beat2-h1-handoff` です。

### Stopping Edge

- Finished: 3-shot standalone Composition Board、H0 green、独立H1 blind pass、authority/Pilot比較、3/3 improved-and-executable、H1 PASS、repo-local evidence preservation。
- Remains: H1の再実施やBoard repairではない。別承認がある場合だけ、異なるBeatを一つ使うbounded H2 counterexample。
- Intentionally untouched: Visual Treatment Pilot 13 files、Storyboard 7 files、Execution 9 files、other 16 shots、production selection、rights clearance、provider/API、generation、render、publication、database、canon。
- First checks: fetch remote、`codex/beat2-h1-handoff`へswitch、upstream parity/clean stateを確認、root read-only validationを実行、H1記録を読む。
- Stop rule: H2は自動開始しない。production selection、rights、generation、19-shot expansion、canonへ広げず、監修者の明示承認を待つ。

### Start Here

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
docs/review/supervisor-current-report.md
artifacts/artifact-manifest.json
docs/review/beat2-composition-board.md
artifacts/beat2-composition-board-result.json
artifacts/beat2-composition-board/README_COMPOSITION_BOARD.md
```

```powershell
git fetch --prune origin
git switch codex/beat2-h1-handoff
git pull --ff-only
git rev-list --left-right --count "HEAD...@{u}"
git status --short --branch

$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw -Encoding UTF8 | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
Select-String -Path .\docs\review\beat2-composition-board.md -Pattern "H1 independent transfer result" -Context 0,40
```

新規cloneでlocal branchがまだ無い場合は、`git switch --track origin/codex/beat2-h1-handoff` を使用します。PR merge後に`master`へ取り込まれている場合は、通常どおり`master`をpullし、Gitの最新remote stateを正本とします。

### Current Contract

| 対象 | 現在の状態 | 次の判断 |
| --- | --- | --- |
| Composition Board | `00:20–00:50`、3 shots、6 distinct local rasters、7 assignments、H1 `3/3 = 1.0` | accepted Beat 2 checkpointとして保持 |
| Shot 1 | handwork / working height / narrow light pool | intended一致、legacyよりcrop/focal/depth仮定が減少、blockerなし |
| Shot 2 | memo 2/3 + static moth 1/3 / near-overhead | intended一致、左右/比率/eye path/depthが明確、blockerなし |
| Shot 3 | extreme-close watch + moth wing + brass reflection | intended一致、moth continuity/三層/9:17が明確、blockerなし |
| Protected sources | Pilot 13 / Storyboard 7 / Execution 9 files byte-identical | sourceとしてのみ使用 |
| Production gates | selection/rights/generation/render/publication/database/canon closed | 別承認なしに開かない |

### Active Residual Work

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Beat 2 H1 composition transfer | 別制作者への構図伝達を実測 | Boardのtransfer qualityを根拠付きでclose | standalone Board blind pass、全3shot、authority/Pilot比較 | complete / PASS `3/3` | independent reviewer | 再実施しない。`docs/review/beat2-composition-board.md`を正本として保持 |
| Different-Beat counterexample | Beat 2固有のoverfitを反証 | 19-shot展開前にpatternの一般化可能性を確認 | 監修者の明示承認、異なるBeat一つ、同じblind protocol、source不変 | proposed / not authorized | human supervisor + future reviewer | 承認後のみ対象Beatを一つ選び、bounded H2として開始 |

## 保存された Beat 2 Visual Treatment Pilot 引き継ぎ（2026-07-14 JST）

保存された source artifact は `fff-beat2-visual-treatment-pilot-001`、lane は `VISUAL_TREATMENT_PILOT` です。実装は同期済み `master` の `4d4c98ca188556509965d6dc1ed429c7b2acdf82` から始まり、`72df19b33fd77b047170046db1a99620d1455976 Add Beat 2 visual treatment pilot` として `origin/master` へ公開済みです。H1 observation `A寄りのB` が現在の Composition Board slice の入力であり、Pilot package自体はbyte-identicalで保持します。

### Stopping Edge

- Finished: Beat 2 standalone package、six-reference provenance、two viewport/theme captures、print evidence、24/24 fail-closed probes、protected-source immutability、product commit/push。
- Remains: H1 freeform visual-treatment comprehension only; H0 cannot decide whether another creator actually understands the treatment.
- Intentionally untouched: Storyboard/Execution source bytes、other 16 shots、production asset selection、rights clearance、engine/voice、provider/API、generation、render、publication、database、canon。
- First checks: pull latest `master`, confirm `0 0` parity and clean status, run the root manifest's read-only validation, then open the standalone Beat 2 HTML.
- Unresolved design question: whether each primary/supporting pair makes shot dominance, material/light language, and held truth understandable without verbal explanation.

### Start Here

1. clean worktree で `git fetch --prune origin` と `git pull --ff-only origin master` を行う。
2. `git rev-list --left-right --count "HEAD...@{u}"` が `0 0`、`git status --short` が空であることを確認する。
3. 次をこの順に読む。

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
docs/review/supervisor-current-report.md
artifacts/artifact-manifest.json
docs/review/beat2-visual-treatment-pilot.md
artifacts/beat2-visual-treatment-pilot-result.json
artifacts/beat2-visual-treatment-pilot/README_VISUAL_TREATMENT.md
```

4. Visual Treatment Pilot を単体で開く。

```powershell
Invoke-Item .\artifacts\beat2-visual-treatment-pilot\beat2-visual-treatment.html
```

5. 通常の機械確認は read-only validator を使う。

```powershell
node tools/fff-state.mjs validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json
```

### Current Contract

| 対象 | 現在の状態 | 次の判断 |
| --- | --- | --- |
| Beat 2 page | 00:20–00:50、3 shots、6 local rasters、2 refs/shot、Light/Dark/Auto、印刷対応 | H1 freeform visual-treatment review |
| Shot treatment | 各shotに大きな主参照、小さな補助参照、画面/意図/尺/カメラ/成立条件 | 別制作者が優先度と構図を説明できるか |
| Provenance | 6/6にcreator/source/license/dimensions/hash、reference-only | license metadataをclearanceと誤認しないか |
| Held truth | moth function、Toma fate、9:17 meaning、final character designを未解決で保持 | 因果や正解を勝手に決めていないか |
| Protected sources | Storyboard Brief七ファイルとExecution Pack九ファイルをbyte保護 | planning/audit sourceとしてのみ使用 |
| Production gates | selection/rights/generation/render/publication/database/canonはclosed | 別承認なしに開かない |

H0 は green です。`artifacts/beat2-visual-treatment-pilot-result.json` が、24/24 negative probes、source immutability、6画像のprovenance/dimension/hash、900x1200 Dark、1280x900 Light、Auto、layout、print-style、manifest integrity の source of truth です。視覚伝達が改善したという判定だけは推測であり、H1 は未実施です。

次の正規作業は H1 だけです。レビュー者はこの HTML だけを見て、三つのショットで最初に見るもの、主参照と補助参照の役割、光と材質、成立条件、保留事項を自由文で説明します。失敗時の修正範囲は Beat 2 の reference choice / composition / wording だけです。full-story asset package、production selection、rights clearance、generation、render、release は自動では開きません。

## 保存された Production Storyboard Brief 引き継ぎ（2026-07-14 JST）

現在の active artifact は `fff-production-storyboard-brief-001`、lane は `PRODUCTION_STORYBOARD_BRIEF` です。同期済み `master` の `04c554c923ae8860fc39047fec515b6b16c195d0` を開始点に、受け入れ済み Production Execution Pack を一切変更せず、別の制作者が作品の前提・用語・六幕・19ショットの意図を一つのページから理解するための独立した七ファイル package を追加しました。最終公開 commit と parity は Git を正本とします。

### Start Here

1. `git fetch --prune origin` と `git pull --ff-only origin master` を clean worktree で行う。
2. `git rev-list --left-right --count "HEAD...@{u}"` が `0 0`、`git status --short` が空であることを確認する。
3. 次をこの順に読む。

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
docs/review/supervisor-current-report.md
artifacts/artifact-manifest.json
docs/review/production-storyboard-brief.md
artifacts/production-storyboard-brief-result.json
artifacts/production-storyboard-brief/README_STORYBOARD_BRIEF.md
```

4. Storyboard Brief を単体で開く。

```powershell
Invoke-Item .\artifacts\production-storyboard-brief\production-storyboard-brief.html
```

5. 通常の機械確認は read-only validator を使う。

```powershell
node tools/fff-state.mjs validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json
```

### Current Contract

| 対象 | 現在の状態 | 次の判断 |
| --- | --- | --- |
| Storyboard Brief | 6 overview sentences、25 glossary terms、6 beat groups、19 planning-only SVG frames、Light/Dark/Auto、印刷対応 | H1 freeform comprehension review |
| Shot semantics | 19/19 で `ねらい` / `成立させること` / `描かないこと` を同一ブロック化 | 代表ショットを人が正負に分けて説明できるか |
| Operational appendix | 14 one-line requirements、2 common / 7 reusable / 5 beat-specific、initially closed | H1 では開かなくても作品を理解できるか |
| Production Execution Pack | 九ファイルと source fingerprint を byte 保護 | operational/audit source としてのみ使用 |
| Production gates | asset/rights/engine/voice/provider/generation/render/publication/database/canon は closed | 別承認なしに開かない |

H0 は green です。`artifacts/production-storyboard-brief-result.json` が、18/18 negative probes、source immutability、glossary/shot/SVG/semantic audit、900x1200 Dark、1280x900 Light、Auto resolution、keyboard、print、manifest integrity の source of truth です。理解改善はまだ推測であり、H1 は未実施です。

次の正規作業は H1 だけです。レビュー者はこの HTML だけを見て、作品の前提、中心の未解決問い、六幕の進行、代表ショットの見えるもの・ねらい・成立条件・描かないこと、主要用語を自由文で説明します。pass 後も H2 の asset/rights candidates、synthetic voice calibration、実素材、生成、render、release は自動では開きません。

## 保存された制作実行パック同期報告（2026-07-13 JST）

最新の live sync、Windows checkout の hash portability 修復、完成度、不足、G0〜G11 の長期目標案は `docs/review/supervisor-current-report.md` を正本とする。この handoff の以下の記録は active artifact の詳細と履歴を保持する。

現在の active artifact は `fff-production-execution-pack-001`、lane は `PRODUCTION_EXECUTION_PACK` です。製品実装 `fc897afbb6b91a3b76766db98d86e2aedc448017 Add production execution pack` で、受け入れ済みの 180 秒 / 6 ビート / 19 ショット / 20 字幕 / 6 narration / 3 thumbnail directions を、別の制作者が一つの静的資料から準備できる九ファイル package へ移行済みです。Typography Balance、Operator Brief、Blueprint、Derivative、Revision、Handoff の package は source として byte 保護されています。

新しい overlay は narration を変更しません。B1/B3/B4/B6 は人の読み上げで 3–5 秒早く終わったという text-density proxy から `proxy_headroom_confirmed`、B2/B5 は値を補わず `existing_pass_unmeasured` です。意図する delivery は synthetic ですが、engine / voice / audio は未選択・未生成、engine calibration は pending、human articulation check は false です。14 件の asset requirements はすべて generic、`unselected`、`not_reviewed`、provenance required で、実素材や URL を指しません。

| まず確認するもの | 役割 | 判定の正本 |
| --- | --- | --- |
| `artifacts/production-execution-pack/production-execution-pack.html` | 日本語優先、単一文書スクロール、印刷可能な現在の引き渡し面 | 目視対象。first view に状態と 180 / 6 / 19 / 14 / synthetic pending を表示 |
| `docs/review/production-execution-pack.md` | package contract、timing provenance、asset reuse、閉じた gate | 次 terminal の理解用 |
| `artifacts/production-execution-pack-result.json` | package hash、20 probes、source immutability、900x1200 / 1280x900、print evidence | H0 の pass/failure source of truth |
| `artifacts/artifact-manifest.json` | active paths と read-only validation chain | 通常再開時の実行入口 |

H0 は green です。次の人作業は H1 execution-readiness review で、technical audit を開かず、準備物、再利用物、19 ショットの組立順、未選択の gate を説明できるかを自由文で確認します。H2 の local synthetic engine 選択・実時間較正、実素材、rights review、音声/画像/動画生成、provider/API、render、upload、publication、database、canon は未開始です。

## 以前の Operator Brief 同期記録（履歴）

この slice の開始時に、ローカルの作業基点をリモート既定ブランチの head
`89197c9 Add operator production brief` へ fast-forward し、
`master...origin/master = 0 0`、worktree clean を確認した。
それ以前に checkout されていた `codex/workflow-control-plane-reset` は
`origin/codex/workflow-control-plane-reset` と同期したまま別ブランチとして保持し、
`master` へは混ぜていない。本 slice は受理済み Operator Brief を human-facing source、
Content Production Blueprint を不変の technical source として継承する。
`175903e Refresh cross-terminal handoff` は、それ以前の同期履歴としてのみ保持する。

ローカル再検証では、manifest の read-only contract が active Typography Balance、
Operator Brief、Content Production Blueprint、保護された Editorial Derivative / Revision /
Handoff の6系統をすべて通過することを完了条件とする。
MkDocs strict build、`fff-state.mjs` / `fff-extract-local.mjs` /
`fff-source-span-review-pack.mjs` の構文確認、Blueprint launcher の print-only URI、
`git diff --check` も通過している。確認環境は Node.js `v22.19.0`、npm
`10.9.3`、Python `3.11.0`、uvx `0.10.0`。旧ブランチで生成されていた未追跡の
`build/mkdocs-site` は削除し、検証出力は一時ディレクトリへ分離した。

受理済み source lane は `OPERATOR_PRODUCTION_BRIEF`、source artifact は
`fff-operator-production-brief-001` である。既存の `mode=blueprint` は technical
Blueprint を backend / audit source として保持しながら、制作するもの、規模、六幕、
画面文法、完成条件を一つの document scroll で読める制作指示書になった。
6 beats / 180 seconds / 6 narration segments / 20 subtitle cues / 19 shots /
3 thumbnail directions と LOCKED / BOUNDED / FREE の制約は変えていない。

H1 Human Comprehension Review は judgment A で完了し、指摘された主タイトルの
responsive hierarchy だけを現在の checkpoint で補正した。次の非重複入口は任意の
Narration read-aloud（幕1・3・4・6）であり、Asset / Shot Brief は別承認を要する。
別 creator test、old workflow branch audit、Stale Shelf Excision は **Deferred** のままで
現在の launch choice ではない。source application、asset selection、rights clearance、
provider/API、generation、render、upload、publication、database、production approval、
final canon は引き続き閉じている。

Current implementation checkpoint: 2026-07-13 JST for
`fff-operator-production-brief-typography-balance-001`, started from synced base
HEAD `89197c9 Add operator production brief`. The final commit/push identity must
be taken from Git after publication. H1 comprehension passed judgment A; the one
requested repair was the visually oversized main story title. The active route
remains `public/review/index.html?mode=blueprint`, `fff-operator-production-brief-001`
remains its accepted human-facing source, and `fff-content-production-blueprint-001`
remains its protected machine/audit source. The repair changes only Blueprint-scoped
responsive typography and spacing. Visible content, structure, order, timing,
truth, rights, assets, all six Operator files, and every Handoff, Revision,
Derivative, and Production Blueprint package byte remain protected. The Brief is
local planning evidence only, not production approval, rights clearance, or canon.

The derivative preserves `fff-editorial-revision-roundtrip-001` at
`public/review/index.html?mode=revision` as its safe-patch source, preserves
`fff-bridge-editorial-handoff-pack-001` at
`public/review/index.html?mode=handoff` as its immutable source, preserves
`fff-bridge-storyboard-flow-001` at
`public/review/index.html?mode=bridge`, preserves `fff-review-workbench-component-contract-001` at
`public/review/index.html?mode=brief`, preserves
`fff-apply-decision-shell-guard-diet-001` as its source shell, preserves
`public/review/index.html?mode=layout-lab` as source evidence, and records the
new doc/result/package plus local visual evidence at
`docs/review/editorial-derivative-preview.md`,
`artifacts/editorial-derivative-preview-result.json`,
`artifacts/editorial-derivative/`, and
`artifacts/review-screens/editorial-derivative-preview.png` when capture is available.
It preserves the applied source checkpoint `fff-apply-decision-shell-guard-diet-001`,
the visual source checkpoint `fff-layout-lab-visual-audit-001`,
source layout research `fff-layout-research-decision-shell-001`, and also preserves
`fff-low-text-decision-console-001`,
`fff-guided-review-flow-workspace-001`,
`fff-bridge-refinement-overview-ribbon-001`,
`fff-home-cockpit-metric-linking-001`,
`fff-review-home-map-meters-001`,
`fff-draft-to-video-planning-bridge-001`,
`fff-review-brief-dark-mode-ux-001`,
`fff-one-story-draft-review-pack-001`,
`fff-designer-candidate-dashboard-001`, and
`fff-draft-review-pack-stabilization-001`;
`fff-route-lock-clean-state-readback-001` records that ClipPipeGen prompt residue
was removed from this repo, and
`fff-provider-envelope-readiness-no-call-001`,
`fff-provider-adapter-authorization-readiness-001`,
`fff-remaining-fixture-coverage-one-class-001`,
`fff-downstream-adoption-gate-scope-lock-001`,
`fff-translated-memo-fixture-audit-001`,
`fff-translation-provenance-source-span-readback-001`,
`fff-translation-policy-source-of-truth-boundary-001`,
`fff-translated-memo-fixture-minimum-001`,
`fff-held-claim-adoption-preflight-001`,
`fff-downstream-adoption-semantics-design-001`,
`fff-adoption-candidate-ledger-dry-run-001`,
`fff-sandbox-adoption-mutation-one-claim-001`,
`fff-sandbox-adoption-rollback-rehearsal-001`,
`fff-production-adoption-authorization-packet-001`,
`fff-production-claim-ledger-adoption-one-claim-001`,
`fff-production-claim-ledger-rollback-rehearsal-001`,
`fff-downstream-target-authorization-packet-001`,
`fff-profile-adoption-mutation-one-claim-001`, and
`fff-very-broad-source-span-shape-audit-001` are preserved auxiliary readbacks.
After pulling, run `git log -1 --oneline --decorate` for the exact remote head
that contains this Editorial Derivative Preview and the latest handoff refresh.

## Preserved Production Execution Entrance (Historical)

The current active artifact is `fff-production-execution-pack-001`. Open its standalone
HTML first; it is the portable handoff, while the accepted Operator Brief and
quantitative Blueprint are protected human/machine sources. `OPERATOR_FIRST` remains
closed as historical context, and the three safe wording changes remain a provisional
editorial baseline rather than canon.

The next reviewer should open:

```powershell
Invoke-Item .\artifacts\production-execution-pack\production-execution-pack.html
```

`public/review/index.html?mode=blueprint` remains the preserved source route and carries exactly one compact execution-pack link. Use `.\scripts\operator\open_review.ps1 -Mode blueprint -PrintUri` only to inspect that source URI. H1 now means execution-readiness of the new portable pack, not a repeat of the completed Operator Brief comprehension review. This handoff does not authorize timing/order changes, story truth, asset selection, rights clearance, engine or voice selection, provider/API work, generation, render, upload, publication, database persistence, or final canon.

| Viewport | Title hierarchy | Adjacent hierarchy | First-view result |
| --- | --- | --- | --- |
| 900x1200 | 40px; line-height 43.2px; 2 lines; 86.375px block; viewport ratio 0.07197916666666666 | body 17px; title/body 2.3529411764705883; metric 22px; section 26px | bottom 837.640625px; 5 completion conditions visible; overflow/nested/overlap/clipping/orphan = 0 |
| 1280x900 | 48px; line-height 51.84px; 2 lines; 103.65625px block; viewport ratio 0.11517361111111112 | body 17.28px; title/body 2.7777777777777777; metric 28px; section 33.92px | bottom 803.359375px; 5 completion conditions visible; overflow/nested/overlap/clipping/orphan = 0 |

## Previous Remote Publish Snapshot

- Branch: `master`
- Active artifact: `fff-production-execution-pack-001`; Typography Balance, Operator Brief, Blueprint, Derivative, Revision, and Handoff are preserved sources
- Published product implementation: `fc897afbb6b91a3b76766db98d86e2aedc448017 Add production execution pack`
- Product base: `97a3ec2b57934e35073562bee8475f324a880a0f Balance operator brief typography`
- Remote verification before this restart-context successor: local HEAD, tracking `origin/master`, and live remote `master` all resolved to `fc897afbb6b91a3b76766db98d86e2aedc448017`; worktree was clean and parity was `0 0`
- Handoff publication rule: the commit containing this refreshed context is expected to be a successor of `fc897af`; after pulling, use Git for the exact context-only HEAD while retaining `fc897af` as the product implementation checkpoint
- Validation contract: `artifacts/artifact-manifest.json` now runs read-only `validate-*` commands; `smoke-*` commands remain artifact-regeneration commands and should be used only when tracked result JSON is intentionally refreshed
- User-side review evidence now: `artifacts/production-execution-pack/production-execution-pack.html`, `docs/review/production-execution-pack.md`, `artifacts/production-execution-pack-result.json`, and 900x1200 / 1280x900 execution-pack screenshots
- Preserved prelude route: `public/review/index.html?mode=brief`
- Next human work: H1 execution-readiness review; H0 is validated, while H2 engine calibration, real asset selection, production, rights, and canon remain separately authorized, deferred, or closed
- Locked lanes: provider/API, credentials, AI video generation, production render, upload, rights-clearance claim, database persistence, and final canon

## Previous Execution-Pack Restart Procedure (Historical)

1. Pull the latest remote state:

```powershell
git fetch --prune origin
git pull --ff-only origin master
```

2. Confirm Git parity:

```powershell
git status --short --branch
git rev-list --left-right --count "HEAD...@{u}"
git log -5 --oneline --decorate
```

Expected after this handoff is published: `master` is synced with `origin/master`, with `HEAD...@{u}` reporting `0 0`. The pulled top commit may be this context-only successor; the implemented product checkpoint remains `fc897afbb6b91a3b76766db98d86e2aedc448017`. Local transport-residue files outside this product scope should not be treated as product work.

The 2026-07-13 Production Execution Pack slice preserves the accepted source chain
while adding one nine-file standalone handoff, one compact Blueprint link, one
result/readback, two viewport screenshots, print evidence, and synchronized durable
docs. It does not change source content, structure, package bytes, provider state,
credentials, generation, publishing, timing/order, truth, asset selection, rights
state, database persistence, production approval, or final canon.

3. Read these files in this order:

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
docs/review/production-execution-pack.md
artifacts/production-execution-pack-result.json
artifacts/production-execution-pack/README_PRODUCTION_EXECUTION.md
artifacts/production-execution-pack/production-execution-pack.json
artifacts/production-execution-pack/beat-run-sheet.csv
artifacts/production-execution-pack/shot-execution-sheet.csv
artifacts/production-execution-pack/asset-requirements.csv
artifacts/production-execution-pack/narration-timing-envelope.csv
artifacts/production-execution-pack/thumbnail-requirements.md
artifacts/production-execution-pack/production-execution-manifest.json
docs/review/operator-production-brief-typography-balance.md
artifacts/operator-production-brief-typography-balance-result.json
docs/review/operator-production-brief.md
artifacts/operator-production-brief-result.json
docs/review/content-production-blueprint.md
artifacts/content-production-blueprint-result.json
artifacts/production-blueprint/README_BLUEPRINT.md
artifacts/production-blueprint/production-blueprint.json
artifacts/production-blueprint/beat-specs.csv
artifacts/production-blueprint/shot-specs.csv
artifacts/production-blueprint/subtitle-metrics.csv
artifacts/production-blueprint/visual-system.md
artifacts/production-blueprint/acceptance-matrix.csv
artifacts/production-blueprint/blueprint-package-manifest.json
docs/review/editorial-derivative-preview.md
artifacts/editorial-derivative-preview-result.json
artifacts/editorial-derivative/README_DERIVATIVE.md
artifacts/editorial-derivative/narration-script.derived.md
artifacts/editorial-derivative/subtitle-cues.derived.csv
artifacts/editorial-derivative/shot-list.derived.csv
artifacts/editorial-derivative/editorial-handoff.derived.json
artifacts/editorial-derivative/applied-revision-patch.json
artifacts/editorial-derivative/derivative-provenance.json
artifacts/editorial-derivative/derivative-package-manifest.json
docs/review/editorial-revision-roundtrip.md
artifacts/editorial-revision-roundtrip-result.json
artifacts/editorial-revision/README_REVISION.md
artifacts/editorial-revision/revision-request-template.json
artifacts/editorial-revision/revision-request.example.json
artifacts/editorial-revision/revision-decision.example.json
artifacts/editorial-revision/revision-patch.example.json
artifacts/editorial-revision/revision-roundtrip-manifest.json
docs/review/bridge-editorial-handoff-pack.md
artifacts/bridge-editorial-handoff-pack-result.json
artifacts/editorial-handoff/README_DELIVERY.md
artifacts/editorial-handoff/narration-script.md
artifacts/editorial-handoff/subtitle-cues.csv
artifacts/editorial-handoff/shot-list.csv
artifacts/editorial-handoff/editorial-handoff.json
artifacts/editorial-handoff/package-manifest.json
docs/review/bridge-storyboard-flow.md
artifacts/bridge-storyboard-flow-result.json
artifacts/review-screens/bridge-storyboard-flow.png
docs/review/review-workbench-component-contract.md
artifacts/review-workbench-component-contract-result.json
artifacts/review-screens/brief-component-contract-workbench.png
docs/review/apply-decision-shell-guard-diet.md
artifacts/apply-decision-shell-guard-diet-result.json
artifacts/review-screens/brief-decision-shell-applied.png
docs/review/layout-lab-visual-audit.md
artifacts/layout-lab-visual-audit-result.json
artifacts/layout-lab-visual-audit-contact-sheet.png
artifacts/review-screens/layout-lab.png
artifacts/review-screens/layout-lab-decision-shell.png
artifacts/review-screens/brief-preserved.png
artifacts/review-screens/bridge-preserved.png
docs/review/layout-research-decision-shell.md
artifacts/layout-research-decision-shell-result.json
docs/review/low-text-decision-console.md
artifacts/low-text-decision-console-result.json
docs/review/guided-review-flow-workspace.md
artifacts/guided-review-flow-workspace-result.json
docs/review/bridge-refinement-overview-ribbon.md
artifacts/bridge-refinement-overview-ribbon-result.json
docs/review/home-cockpit-metric-linking.md
artifacts/home-cockpit-metric-linking-result.json
docs/review/review-home-map-meters.md
artifacts/review-home-map-meters-result.json
docs/review/review-brief-dark-mode-ux.md
artifacts/review-brief-dark-mode-ux-result.json
docs/review/draft-to-video-planning-bridge.md
artifacts/draft-to-video-planning-bridge-result.json
docs/review/one-story-draft-review-pack.md
artifacts/one-story-draft-review-pack-result.json
docs/review/designer-candidate-dashboard.md
artifacts/designer-candidate-dashboard-result.json
docs/review/draft-review-pack-stabilization.md
artifacts/draft-review-pack-stabilization-result.json
docs/review/route-lock-clean-state-readback.md
docs/review/contradictory-claim-guard.md
artifacts/contradictory-claim-guard-result.json
artifacts/extraction-negative-fixtures/contradictory-claim-hold.json
docs/review/downstream-source-span-adoption-gate.md
artifacts/downstream-source-span-adoption-gate-result.json
docs/review/provider-envelope-readiness-no-call.md
artifacts/provider-envelope-readiness-no-call.example.json
artifacts/provider-envelope-readiness-no-call-result.json
docs/review/provider-adapter-authorization-readiness.md
artifacts/provider-adapter-authorization-readiness-result.json
docs/review/remaining-fixture-coverage-one-class.md
artifacts/remaining-fixture-coverage-one-class-result.json
artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md
artifacts/extraction-adapter-outputs/multilingual-memo-notes.json
docs/review/translated-memo-fixture-audit.md
artifacts/translated-memo-fixture-audit-result.json
docs/review/translation-provenance-source-span-readback.md
artifacts/translation-provenance-source-span-readback-result.json
docs/review/translation-policy-source-of-truth-boundary.md
artifacts/translation-policy-source-of-truth-boundary-result.json
docs/review/translated-memo-fixture-minimum.md
artifacts/translated-memo-fixture-minimum.json
artifacts/translated-memo-fixture-minimum-result.json
docs/review/held-claim-adoption-preflight.md
artifacts/held-claim-adoption-preflight-result.json
docs/review/downstream-adoption-semantics-design.md
artifacts/downstream-adoption-semantics-design-result.json
docs/review/adoption-candidate-ledger-dry-run.md
artifacts/adoption-candidate-ledger-dry-run-result.json
docs/review/sandbox-adoption-mutation-one-claim.md
artifacts/sandbox-adoption-mutation-one-claim-result.json
docs/review/sandbox-adoption-rollback-rehearsal.md
artifacts/sandbox-adoption-rollback-rehearsal-result.json
docs/review/production-adoption-authorization-packet.md
artifacts/production-adoption-authorization-packet-result.json
docs/review/production-claim-ledger-adoption-one-claim.md
artifacts/production-claim-ledger-adoption-one-claim-result.json
docs/review/production-claim-ledger-rollback-rehearsal.md
artifacts/production-claim-ledger-rollback-rehearsal-result.json
docs/review/downstream-target-authorization-packet.md
artifacts/downstream-target-authorization-packet-result.json
docs/review/profile-adoption-mutation-one-claim.md
artifacts/profile-adoption-mutation-one-claim-result.json
docs/review/very-broad-source-span-shape-audit.md
artifacts/very-broad-source-span-shape-audit-result.json
docs/review/malformed-missing-span-guard.md
artifacts/malformed-missing-span-guard-result.json
docs/review/missing-fixture-class-probe.md
artifacts/missing-fixture-class-probe-result.json
docs/review/weak-span-repair.md
artifacts/weak-span-repair-result.json
docs/review/broad-span-split.md
artifacts/broad-span-split-result.json
docs/review/routing-policy-regression-hardening.md
artifacts/routing-policy-regression-hardening-result.json
docs/review/review-memory-dedup.md
docs/review/model-api-boundary-spec.md
docs/idea-ledger.md
docs/decision-log.md
```

4. Open the active standalone handoff:

```powershell
Invoke-Item .\artifacts\production-execution-pack\production-execution-pack.html
```

The operator launchers remain available when protected source or audit routes need inspection:

```powershell
.\scripts\operator\open_review.ps1 -Mode blueprint
```

No-query access still defaults to the preserved Review Brief route, now with the applied Decision Shell first. The protected quantitative source route is `public/review/index.html?mode=blueprint`, and its closed `Audit & Files` owns the single compact link to the active standalone pack. The focused manual-delivery source route is `public/review/index.html?mode=handoff`. The preserved research route is
`public/review/index.html?mode=layout-lab`; the operator path is
`public/review/index.html?mode=brief`, then
`public/review/index.html?mode=bridge`, then `public/review/index.html?mode=handoff`, then `public/review/index.html?mode=revision`, then `public/review/index.html?mode=derivative`, then `public/review/index.html?mode=blueprint`; the preserved compatibility and detail routes
are `public/review/index.html?mode=home`,
`public/review/index.html?mode=draft`, and
`public/review/index.html?mode=designer`.

5. Re-run local checks before changing behavior:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"
git diff --check
```

The manifest command is read-only. Use a named `smoke-*` command only when the
corresponding tracked result JSON is intentionally being regenerated. Use the
`uvx` form because the default Windows Python launcher may point at the
WindowsApps stub.

## Preserved Project State Before Storyboard Brief

- Active artifact: `fff-production-execution-pack-001`; Typography Balance / Operator / Blueprint / Derivative / Revision / Handoff are protected sources
- Active handoff: `artifacts/production-execution-pack/production-execution-pack.html`; `public/review/index.html?mode=blueprint` is the preserved source route with one compact link
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Production Execution Pack doc/result/screenshots: `docs/review/production-execution-pack.md`, `artifacts/production-execution-pack-result.json`, `artifacts/review-screens/production-execution-pack-900x1200.png`, `artifacts/review-screens/production-execution-pack-1280x900.png`
- Portable Production Execution Pack: `artifacts/production-execution-pack/README_PRODUCTION_EXECUTION.md`, `production-execution-pack.html`, `production-execution-pack.json`, `beat-run-sheet.csv`, `shot-execution-sheet.csv`, `asset-requirements.csv`, `narration-timing-envelope.csv`, `thumbnail-requirements.md`, `production-execution-manifest.json`
- Operator Brief Typography Balance doc/result/screenshots: `docs/review/operator-production-brief-typography-balance.md`, `artifacts/operator-production-brief-typography-balance-result.json`, `artifacts/review-screens/operator-production-brief-typography-balance-900x1200.png`, `artifacts/review-screens/operator-production-brief-typography-balance-1280x900.png`
- Preserved Operator Brief doc/result/package: `docs/review/operator-production-brief.md`, `artifacts/operator-production-brief-result.json`, `artifacts/operator-production-brief/`
- Content Production Blueprint doc/result/screenshot: `docs/review/content-production-blueprint.md`, `artifacts/content-production-blueprint-result.json`, `artifacts/review-screens/content-production-blueprint.png` (captured; 133623 bytes, SHA256 `2694f69af62466e5612e9021a6308c3bee8aca8aa133606a0c8c0a9f802afec9`)
- Portable Content Production Blueprint package: `artifacts/production-blueprint/README_BLUEPRINT.md`, `production-blueprint.json`, `beat-specs.csv`, `shot-specs.csv`, `subtitle-metrics.csv`, `visual-system.md`, `acceptance-matrix.csv`, `blueprint-package-manifest.json`
- Editorial Derivative Preview doc/result/screenshot: `docs/review/editorial-derivative-preview.md`, `artifacts/editorial-derivative-preview-result.json`, `artifacts/review-screens/editorial-derivative-preview.png`
- Portable Editorial Derivative package: `artifacts/editorial-derivative/README_DERIVATIVE.md`, `narration-script.derived.md`, `subtitle-cues.derived.csv`, `shot-list.derived.csv`, `editorial-handoff.derived.json`, `applied-revision-patch.json`, `derivative-provenance.json`, `derivative-package-manifest.json`
- Editorial Revision Roundtrip doc/result/screenshot: `docs/review/editorial-revision-roundtrip.md`, `artifacts/editorial-revision-roundtrip-result.json`, `artifacts/review-screens/editorial-revision-roundtrip.png`
- Portable Editorial Revision package: `artifacts/editorial-revision/README_REVISION.md`, `revision-request-template.json`, `revision-request.example.json`, `revision-decision.example.json`, `revision-patch.example.json`, `revision-roundtrip-manifest.json`
- Editorial Handoff Pack doc/result/screenshot target: `docs/review/bridge-editorial-handoff-pack.md`, `artifacts/bridge-editorial-handoff-pack-result.json`, `artifacts/review-screens/bridge-editorial-handoff-pack.png`
- Portable Editorial Handoff package: `artifacts/editorial-handoff/README_DELIVERY.md`, `artifacts/editorial-handoff/narration-script.md`, `artifacts/editorial-handoff/subtitle-cues.csv`, `artifacts/editorial-handoff/shot-list.csv`, `artifacts/editorial-handoff/editorial-handoff.json`, `artifacts/editorial-handoff/package-manifest.json`
- Bridge Storyboard Flow doc/result/screenshot: `docs/review/bridge-storyboard-flow.md`, `artifacts/bridge-storyboard-flow-result.json`, `artifacts/review-screens/bridge-storyboard-flow.png`
- Review Workbench Component Contract doc/result/screenshot: `docs/review/review-workbench-component-contract.md`, `artifacts/review-workbench-component-contract-result.json`, `artifacts/review-screens/brief-component-contract-workbench.png`
- Apply Decision Shell Guard Diet doc/result/screenshot: `docs/review/apply-decision-shell-guard-diet.md`, `artifacts/apply-decision-shell-guard-diet-result.json`, `artifacts/review-screens/brief-decision-shell-applied.png`
- Layout Lab Visual Audit doc/result/contact sheet: `docs/review/layout-lab-visual-audit.md`, `artifacts/layout-lab-visual-audit-result.json`, `artifacts/layout-lab-visual-audit-contact-sheet.png`
- Layout Lab Visual Audit screenshots: `artifacts/review-screens/layout-lab.png`, `artifacts/review-screens/layout-lab-decision-shell.png`, `artifacts/review-screens/brief-preserved.png`, `artifacts/review-screens/bridge-preserved.png`
- Layout Research Decision Shell doc/result: `docs/review/layout-research-decision-shell.md`, `artifacts/layout-research-decision-shell-result.json`
- Low-text Decision Console doc/result: `docs/review/low-text-decision-console.md`, `artifacts/low-text-decision-console-result.json`
- Guided Review Flow Workspace doc/result: `docs/review/guided-review-flow-workspace.md`, `artifacts/guided-review-flow-workspace-result.json`
- Bridge Refinement Overview Ribbon doc/result: `docs/review/bridge-refinement-overview-ribbon.md`, `artifacts/bridge-refinement-overview-ribbon-result.json`
- Home Cockpit Metric Linking doc/result: `docs/review/home-cockpit-metric-linking.md`, `artifacts/home-cockpit-metric-linking-result.json`
- Review Home Map Meters doc/result: `docs/review/review-home-map-meters.md`, `artifacts/review-home-map-meters-result.json`
- Draft-to-Video Planning Bridge doc/result: `docs/review/draft-to-video-planning-bridge.md`, `artifacts/draft-to-video-planning-bridge-result.json`
- Review Brief Dark Mode UX doc/result: `docs/review/review-brief-dark-mode-ux.md`, `artifacts/review-brief-dark-mode-ux-result.json`
- One-story Draft Review Pack doc/result: `docs/review/one-story-draft-review-pack.md`, `artifacts/one-story-draft-review-pack-result.json`
- Designer Candidate Dashboard doc/result: `docs/review/designer-candidate-dashboard.md`, `artifacts/designer-candidate-dashboard-result.json`
- Draft Review Pack Stabilization doc/result: `docs/review/draft-review-pack-stabilization.md`, `artifacts/draft-review-pack-stabilization-result.json`
- Contradictory claim guard doc/result/fixture: `docs/review/contradictory-claim-guard.md`, `artifacts/contradictory-claim-guard-result.json`, `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`
- Downstream source-span adoption gate doc/result: `docs/review/downstream-source-span-adoption-gate.md`, `artifacts/downstream-source-span-adoption-gate-result.json`
- Provider envelope readiness no-call doc/example/result: `docs/review/provider-envelope-readiness-no-call.md`, `artifacts/provider-envelope-readiness-no-call.example.json`, `artifacts/provider-envelope-readiness-no-call-result.json`
- Provider adapter authorization readiness doc/result: `docs/review/provider-adapter-authorization-readiness.md`, `artifacts/provider-adapter-authorization-readiness-result.json`
- Route-lock cleanup readback: `docs/review/route-lock-clean-state-readback.md`
- Remaining fixture coverage doc/result/fixture/output: `docs/review/remaining-fixture-coverage-one-class.md`, `artifacts/remaining-fixture-coverage-one-class-result.json`, `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Translated/multilingual fixture audit doc/result: `docs/review/translated-memo-fixture-audit.md`, `artifacts/translated-memo-fixture-audit-result.json`
- Translation provenance/source-span readback doc/result: `docs/review/translation-provenance-source-span-readback.md`, `artifacts/translation-provenance-source-span-readback-result.json`
- Translation policy source-of-truth boundary doc/result: `docs/review/translation-policy-source-of-truth-boundary.md`, `artifacts/translation-policy-source-of-truth-boundary-result.json`
- Minimal translated memo fixture doc/fixture/result: `docs/review/translated-memo-fixture-minimum.md`, `artifacts/translated-memo-fixture-minimum.json`, `artifacts/translated-memo-fixture-minimum-result.json`
- Held claim adoption preflight doc/result: `docs/review/held-claim-adoption-preflight.md`, `artifacts/held-claim-adoption-preflight-result.json`
- Downstream adoption semantics design doc/result: `docs/review/downstream-adoption-semantics-design.md`, `artifacts/downstream-adoption-semantics-design-result.json`
- Adoption candidate ledger dry-run doc/result: `docs/review/adoption-candidate-ledger-dry-run.md`, `artifacts/adoption-candidate-ledger-dry-run-result.json`
- Sandbox adoption mutation one-claim doc/result: `docs/review/sandbox-adoption-mutation-one-claim.md`, `artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Sandbox adoption rollback rehearsal doc/result: `docs/review/sandbox-adoption-rollback-rehearsal.md`, `artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Production adoption authorization packet doc/result: `docs/review/production-adoption-authorization-packet.md`, `artifacts/production-adoption-authorization-packet-result.json`
- Production Claim Ledger adoption one-claim doc/result: `docs/review/production-claim-ledger-adoption-one-claim.md`, `artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Production Claim Ledger rollback rehearsal doc/result: `docs/review/production-claim-ledger-rollback-rehearsal.md`, `artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Downstream target authorization packet doc/result: `docs/review/downstream-target-authorization-packet.md`, `artifacts/downstream-target-authorization-packet-result.json`
- Profile adoption mutation one-claim doc/result: `docs/review/profile-adoption-mutation-one-claim.md`, `artifacts/profile-adoption-mutation-one-claim-result.json`
- Very broad source-span shape audit doc/result: `docs/review/very-broad-source-span-shape-audit.md`, `artifacts/very-broad-source-span-shape-audit-result.json`
- Malformed/missing source-span guard doc/result/fixture: `docs/review/malformed-missing-span-guard.md`, `artifacts/malformed-missing-span-guard-result.json`, `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json`
- Validator fixtures and smoke: `artifacts/extraction-negative-fixtures/`, `artifacts/extraction-validator-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Local extraction adapter and outputs: `tools/fff-extract-local.mjs`, `artifacts/extraction-adapter-fixtures/`, `artifacts/extraction-adapter-outputs/`
- State adapter: `tools/fff-state.mjs`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`

The current artifact turns the protected six-beat source chain into a portable execution handoff without changing that chain. Its six run rows, 19 shot rows, 14 reusable generic requirements, narration timing envelope, print page, and transfer checklist are new overlay data. The six-file Operator package and quantitative Blueprint remain byte-protected alongside Derivative, Revision, immutable Handoff, Bridge Flow, Workbench, and layout source evidence. Provider/API, credentials, engine/voice/audio selection, real assets, AI video generation, production render, upload/publication, rights-clearance claims, database persistence, and final canon remain closed.

## What Had Finished Before Storyboard Brief

- `fff-production-execution-pack-001` defines one nine-file package, one standalone print-first reading surface, complete 6-beat / 19-shot coverage, 14 deduplicated generic requirements, and an honest synthetic timing overlay. Its read-only result is green and confirms final hashes, viewport/print evidence, 20 negative probes, and protected-source identity.
- B1/B3/B4/B6 are recorded as `proxy_headroom_confirmed` from 3–5 seconds of human-proxy slack; B2/B5 remain `existing_pass_unmeasured`. No narration, timing window, shot wording, engine, voice, audio, real asset, rights status, or canon is changed.
- `fff-operator-production-brief-typography-balance-001` records H1 judgment A and completes the one requested title-only responsive hierarchy repair. Primary text/HTML and protected package/history aggregates remain at their accepted fingerprints; `validate-operator-production-brief-typography-balance` is read-only and the matching `smoke-*` command may regenerate only its new result JSON.
- `fff-operator-production-brief-001` derives a six-file human-facing instruction package from the byte-protected quantitative Blueprint; `fff-content-production-blueprint-001` remains the unchanged eight-file technical source.
- The Blueprint constrains every beat, all 19 shots, and all 20 subtitle cues with controlled production vocabularies, numeric budgets, a provisional 1920x1080 / 16:9 / 30fps profile, explicit LOCKED / BOUNDED / FREE fields, and machine-readable Definition of Done and pass/warn/fail acceptance.
- `validate-content-production-blueprint` is strictly read-only. Only `smoke-content-production-blueprint` may regenerate the eight Blueprint files and `artifacts/content-production-blueprint-result.json`.
- `mode=derivative` keeps status and its concise three-change summary visible, but gives Before/After provenance to one collapsed Change History owner and package inventory/downloads to one collapsed Files / Export owner.

- `fff-editorial-derivative-preview-001` applies exactly three accepted `safe_local_edit` wording changes to a derived copy and generates eight portable files from one derived JSON model.
- Narration Markdown and derived JSON agree for `narration-b01`; subtitle CSV and JSON agree for `sub-b02-03`; shot CSV and JSON agree for `shot-b03-03`. All unaffected editorial content, IDs, beat order, timing, held truths, rights guards, and unselected assets match the source.
- Source and patch fingerprints, exact before/after provenance, a non-circular derived core fingerprint, seven-file manifest inventory, and `discard_derived_package` rollback make the preview auditable and reversible without canonical application.
- `validate-editorial-derivative-preview` is read-only. Only `smoke-editorial-derivative-preview` may regenerate the eight derivative files and its result.

- `fff-bridge-editorial-handoff-pack-001` adds a separate `public/review/index.html?mode=handoff` route, one compact Bridge action, 6 full provisional narration segments, 20 subtitle cues, 19 shot cues, 3 thumbnail directions, a generic sound brief, four truth guards, four rights guards, and a six-file portable package.
- `artifacts/editorial-handoff/package-manifest.json` hashes exactly the other five package files. `validate-bridge-editorial-handoff-pack` is read-only; only `smoke-bridge-editorial-handoff-pack` may regenerate the new package metadata and result.
- Every shot and thumbnail remains unselected. Toma fate, brass moth truth/function, Council motive, ending truth, provider/API, credentials, generation, render, upload, database persistence, rights clearance, and final canon remain closed.
- `fff-bridge-storyboard-flow-001` adds exactly six Japanese-first beats to the top of `public/review/index.html?mode=bridge`, with a compact rail, one active canvas, Previous / Next, Arrow-key plus Home / End navigation, and one return to Brief.
- Each beat exposes planning time, story purpose, narration, subtitle, visual intent, held-truth boundary, and rights/asset note. Timing is planning-only; Toma fate, brass moth truth/function, Council motive, and the ending remain unresolved.
- The old Bridge hero, Decision Console, Guided Flow, overview reference, refinement cards, and comprehensive grid remain preserved inside one default-collapsed supporting-evidence section.
- `docs/review/bridge-storyboard-flow.md`, `artifacts/bridge-storyboard-flow-result.json`, `node tools/fff-state.mjs validate-bridge-storyboard-flow ...`, and local screenshot evidence when available record the active readback. `validate-*` is read-only; only `smoke-*` intentionally regenerates the tracked result.

- `fff-apply-decision-shell-guard-diet-001` adds `docs/review/apply-decision-shell-guard-diet.md`, `artifacts/apply-decision-shell-guard-diet-result.json`, `artifacts/review-screens/brief-decision-shell-applied.png`, and `node tools/fff-state.mjs smoke-apply-decision-shell-guard-diet ...`.
- The default `brief` route now starts with the applied Split-pane Decision Shell: left step rail, center active decision, governed right dock, compact safety summary, and Evidence / Notes / Inspiration / Guard drawers.
- `decisionFlowModel` drives the route, candidate, channel, choices, steps, context, pins, notices, locks, and next action; `safetyGateRegistry` keeps true production gates compact at the top and detailed in the Guard drawer.
- Dock Governor caps visible pins at 4, notices at 3, locks at 4, and context at 4, with overflow moved to the Guard drawer. Non-gate local work is whitelisted, while provider/API, credentials, AI video, render, upload, database, rights clearance, and final canon remain closed.

- `fff-layout-lab-visual-audit-001` adds `docs/review/layout-lab-visual-audit.md`, `artifacts/layout-lab-visual-audit-result.json`, four local screenshots, one contact sheet, and `node tools/fff-state.mjs smoke-layout-lab-visual-audit ...`.
- The visual audit confirms `public/review/index.html?mode=layout-lab`, the Split-pane Decision Shell detail, preserved `brief`, and preserved `bridge` can be opened locally before deciding whether to apply the shell to `brief`.
- It preserves the source Layout Research Decision Shell, Low-text Decision Console, Guided Review Flow, Bridge refinement, Home Cockpit, draft, designer, stabilization, and contradictory-claim readbacks. Provider/API, credentials, AI video generation, production render, upload, rights-clearance claims, database persistence, and final canon remain closed.

- `fff-guided-review-flow-workspace-001` adds the first-visible Guided Review Flow to `public/review/index.html?mode=brief`, `docs/review/guided-review-flow-workspace.md`, `artifacts/guided-review-flow-workspace-result.json`, and `node tools/fff-state.mjs smoke-guided-review-flow-workspace ...`.
- The `brief` route now starts with one guided review sequence instead of a parallel card wall: six-step Decision Queue, one primary Bridge action, Pinned Tray, Operations Notice, Important Folders, and Inspiration Workspace.
- The `bridge` route now starts with a matching Bridge Guided Flow so the user reviews route confirmation, narration direction, subtitle rhythm, visual order, thumbnail direction, and held-truth policy in a stable order.
- Latest Overview, Bridge refinement, Home Cockpit shelves, old Brief material, selected candidate/channel IDs, Evidence Vault optionality, and dark mode remain preserved. Provider/API, credentials, AI video generation, production render, upload, rights-clearance claims, database persistence, and final canon remain closed.

- `fff-bridge-refinement-overview-ribbon-001` adds `public/review/index.html?mode=brief` latest overview behavior, `docs/review/bridge-refinement-overview-ribbon.md`, `artifacts/bridge-refinement-overview-ribbon-result.json`, and `node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon ...`.
- Home Cockpit now starts with a compact Latest Overview Report: latest state, latest change, read now, next decision, and locked lanes. The overview links directly to `public/review/index.html?mode=bridge`.
- The legacy Review Brief remains in the DOM as a folded detail shelf, preserving selected candidate `designer-content-moth-investigation-3m`, selected channel route `designer-channel-mystery-lore`, route contract copy, and review prompts without competing as a second first-read introduction.
- Draft-to-Video Bridge now includes non-final refinement cues: 5 narration candidates, 6 subtitle rhythm cues, 6 visual/shot ordering cues, 3 thumbnail directions, held-truth policy, and rights/asset boundary note.
- Source Audit / Project Cockpit / Artifacts remain optional Evidence Vault shelves, and provider/API, credential, publishing, AI video generation, production render, rights-clearance, and final canon boundaries remain closed.

- `fff-home-cockpit-metric-linking-001` adds `public/review/index.html?mode=brief`, keeps `public/review/index.html?mode=home` as an alias, adds `docs/review/home-cockpit-metric-linking.md`, `artifacts/home-cockpit-metric-linking-result.json`, and `node tools/fff-state.mjs smoke-home-cockpit-metric-linking ...`.
- No-query access now lands on Home Cockpit / Review Brief, and Bridge remains the primary production-hypothesis surface at `public/review/index.html?mode=bridge`.
- The Home Cockpit adds Operator Track / Workbench / Evidence Vault / Locked Lanes grouping, a three-step "what to read now" path, nine readiness meters, shelf cards, measured-vs-hypothesis semantics, Bridge access, and Evidence Vault open triggers.
- `fff-review-home-map-meters-001` remains preserved as the prior shelf-map readback and compatibility baseline.
- Provider/API, credential, publishing, AI video generation, production render, rights-clearance, and final canon boundaries remain closed.

- `fff-draft-to-video-planning-bridge-001` adds `public/review/index.html?mode=bridge`, `docs/review/draft-to-video-planning-bridge.md`, `artifacts/draft-to-video-planning-bridge-result.json`, and `node tools/fff-state.mjs smoke-draft-to-video-planning-bridge ...`.
- The preserved Review Brief states the route contract; Review Home now explains when to open Brief, Bridge, story shelves, and Evidence Vault shelves.
- The bridge preserves selected candidate `designer-content-moth-investigation-3m` and selected channel `designer-channel-mystery-lore`, includes 5 narration outline beats, 5 subtitle/text cues, 5 shot/visual cues, 1 thumbnail brief, 1 sound/mood cue, 5 rights/asset risks, 4 held truths, and 4 reviewer decisions.
- Dark contrast was tightened for selected candidate/channel cards, review brief cards, pills, badges, tags, links, muted text, and focus-visible states.
- Provider/API, credential, publishing, AI video generation, production render, rights-clearance, and final canon boundaries remain closed.

- `fff-contradictory-claim-guard-001` adds `node tools/fff-state.mjs smoke-contradictory-claim-guard ...`.
- The extraction fixture matrix now has 9 fixtures: 3 expected valid and 6 expected invalid.
- `contradictory-claim-hold.json` is expected valid and carries 2 held claim candidates with reciprocal `contradictsClaimIds`.
- `artifacts/contradictory-claim-guard-result.json` reports 2 conflicting claims checked, 1 reciprocal conflict pair, 2 held conflicting claims, 0 adopted/provisional conflicting claims, 0 direct accepted claim elements, 2 source-ref-preserved conflicting claims, and 0 failures.
- `fff-remaining-fixture-coverage-one-class-001` adds one multilingual memo text fixture. The adapter matrix now has 5 fixture outputs and 60 elements; the selected fixture has 12 elements, 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, and 0 non-held defaults.
- `fff-downstream-source-span-adoption-gate-001` is preserved as the auxiliary downstream-readiness gate: 55 downstream candidates remain source-tracked, 28 human-owned candidates remain held, and 0 Profile / Claim / Timeline candidates are adopted.
- `fff-provider-envelope-readiness-no-call-001` is preserved as the auxiliary provider-readiness gate: the no-call envelope carries a valid candidate Extraction Contract with 4 source-tracked elements, 2 held human-owned elements, 0 visual direct Claim routes, 0 adopted/provisional elements or claims, no provider configured, no endpoint, no external call attempted, and no credentials touched.
- `fff-provider-adapter-authorization-readiness-001` is preserved as the auxiliary authorization gate: it records that provider choice, credentials/secrets, endpoint, transport, external call permission, and persistence/publication remain unauthorized, while local no-call envelopes and validation gates are allowed.
- `fff-route-lock-clean-state-readback-001` records that four untracked
  ClipPipeGen-derived files under `docs/style_intent/` were deleted from this
  repo, `docs/style_intent/` was removed after it became empty, and tracked plus
  workspace searches returned no foreign-route hits after cleanup and before
  the route-lock evidence was added. Future hits should be confined to the
  route-lock evidence and cockpit summaries.
- `fff-malformed-missing-span-guard-001` remains closed after the fixture count expanded to 9; malformed/missing span cases still produce 0 accepted routed candidates.
- `fff-translated-memo-fixture-audit-001` audits existing multilingual fixture coverage without adding a translated fixture. It closes the previous full-manifest-regeneration unknown as `not_available` because no repo command is defined, records translated memo text as a policy-dependent gap, and preserves 0 source-span mismatches, 0 missing source refs, 0 unsafe routes, 0 downstream adopted candidates, no provider configured, no external call, and no credentials touched.
- `fff-translation-provenance-source-span-readback-001` records 3 selected multilingual source-span to held derived-claim relations plus 1 inline-gloss boundary row. All 4 checked source spans match the raw memo and source-pack rows, all 3 derived claims remain held and source-backed, that readback itself added no translated fixture, provider configured=false, external call=false, credentials=false, downstream adopted candidates=0, adopted/provisional conflicting claims=0, and direct accepted claim elements=0.
- `fff-translation-policy-source-of-truth-boundary-001` records the pre-fixture translation policy boundary: original multilingual author memo text is the source-of-truth surface, original sourceSpan locators own evidence, translated spans are derivative/provenance-bound, inline gloss cannot create unowned claims, derived claims remain held, and provider/API/credential work stays blocked.
- `fff-translated-memo-fixture-minimum-001` records the first translated memo fixture after that policy boundary. It checks 2 translated rows, 2 original span matches, 0 original span mismatches, 0 translation-to-claim leaks, 1 held linked claim, 0 auto-promotions, 0 inline gloss claim leaks, provider configured=false, external call=false, credentials=false, and downstream adopted candidates=0.
- `fff-held-claim-adoption-preflight-001` inspects `multi-claim-moth-key-label` from the translated fixture as a preflight-only downstream candidate. It records 1 held claim inspected, 1 source-backed claim, 1 eligible preflight candidate, 0 adopted claims, 0 canonized claims, 0 translation/gloss leaks, provider configured=false, external call=false, credentials=false, and downstream adopted candidates=0.
- `fff-downstream-adoption-semantics-design-001` defines the design-only adoption contract for `multi-claim-moth-key-label`. It records 1 preflight candidate, `hold -> adoption_candidate` as the only current readback-only transition, future `human_accepted_downstream_adoption` as unreachable now, 10 rollback conditions, 4 blocked mutation targets, 0 adopted claims, 0 canonized claims, provider configured=false, external call=false, credentials=false, and downstream adopted candidates=0.
- `fff-adoption-candidate-ledger-dry-run-001` records `multi-claim-moth-key-label` as a non-mutating `adoption_candidate_dry_run` row. It carries source span `multi-x-object-brass-moth-key`, prior claim status `hold`, rollback/rejection vocabulary, future-only Profile / Claim / Timeline targets, 0 adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed mutations, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-sandbox-adoption-mutation-one-claim-001` records one authorized sandbox fixture row for `multi-claim-moth-key-label`, transitioning `adoption_candidate_dry_run -> sandbox_adopted_fixture`. It records rollback token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, production adopted claims=0, canonized claims=0, Profile / Claim / Timeline / Story Seed production mutations=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-sandbox-adoption-rollback-rehearsal-001` rehearses rollback for that sandbox fixture row only. It verifies rollback token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, records `sandbox_adopted_fixture -> adoption_candidate_dry_run`, keeps production rollback performed=false, production adopted claims=0, canonized claims=0, Profile / Claim / Timeline / Story Seed production mutations=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-production-adoption-authorization-packet-001` prepares a freeform approval packet for possible future production adoption. It inspects 1 rollback-rehearsed candidate, proposes Profile / Claim Ledger / Timeline / Story Seed target classes, recommends Claim Ledger first, records missing user authorization fields, keeps production adoption approved=false, canon approved=false, provider approved=false, publishing approved=false, external API approved=false, and performs 0 production mutations.
- `fff-production-claim-ledger-adoption-one-claim-001` records the user-authorized production Claim Ledger adoption for exactly `multi-claim-moth-key-label`. It inspects 1 rollback-rehearsed candidate, records 1 Claim Ledger adoption row, moves `adoption_candidate_dry_run -> production_claim_ledger_adopted`, records rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, keeps Profile / Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-production-claim-ledger-rollback-rehearsal-001` records a readback-only rollback rehearsal for that existing production Claim Ledger row. It inspects 1 adopted Claim Ledger row, verifies rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, records rollback target status `adoption_candidate_dry_run`, keeps actual rollback operations=0, production Claim Ledger rows removed=0, production Claim Ledger rows retained=1, Profile / Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-downstream-target-authorization-packet-001` prepares the next downstream target authorization packet for that retained production Claim Ledger row. It confirms target status `production_claim_ledger_adopted`, rollback descriptor status `verified`, production Claim Ledger row retained=true, proposes Profile / Timeline / Story Seed / Canon decision target classes, recommends Profile as the only next target, keeps user authorization required=true, keeps downstream mutations=0, Profile / Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-profile-adoption-mutation-one-claim-001` records the user-authorized Profile-only production mutation for exactly that retained Claim Ledger row. It adds 1 non-canon Profile annotation row for `multi-profile-brass-moth-key`, records `claim_ledger_adopted -> profile_adopted_noncanon`, records rollback token `rollback-profile-adoption-moth-key-label-to-claim-ledger-only`, keeps Claim Ledger additional adoption count=0, Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-very-broad-source-span-shape-audit-001` audits the broad fixture candidate without adding another fixture. It confirms the current 2 broad rows are already resolved by the broad-span split/keep readback, leaves broad fixture work deferred until source output changes or coverage is the bottleneck, and preserves 0 source-span mismatches, 0 missing refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider configured, no external call, and no credentials touched.
- No Review Card, Operator Observation Card, repeated general Review Hub request, model/API call, credential, database persistence, publishing, production sync, AI video generation, Timeline mutation, Story Seed mutation, provider route, production rollback, additional-claim adoption, or final canon decision was added. The production adoption readbacks now consist of one Claim Ledger row and one Profile-only non-canon annotation for `multi-claim-moth-key-label`.

## Preserved Validation Readback

The current health entrance is the Production Execution Pack validator. It must rebuild the canonical nine-file candidate in memory, verify the actual package bytes and manifest, cover all 19 shot-to-asset references, audit the four proxy/two unmeasured timing rows, run exactly 20 fail-closed probes without artifact mutation, verify the standalone/Blueprint link and viewport/print evidence, and preserve the 34-file source aggregate. Treat `artifacts/production-execution-pack-result.json` as the source of truth; do not infer success from this prose.

- `node --check tools/fff-state.mjs`
- `node tools/fff-state.mjs validate-production-execution-pack artifacts/production-execution-pack-result.json`
- `node tools/fff-state.mjs validate-operator-production-brief-typography-balance artifacts/operator-production-brief-typography-balance-result.json`
- `node tools/fff-state.mjs validate-operator-production-brief artifacts/operator-production-brief-result.json`
- `node tools/fff-state.mjs validate-content-production-blueprint artifacts/content-production-blueprint-result.json`
- `node tools/fff-state.mjs smoke-production-execution-pack artifacts/production-execution-pack-result.json artifacts/production-execution-pack-result.json` is intentional package/result regeneration only and is not the normal restart check.
- The root manifest continues read-only through Derivative, Revision, and Handoff after the active/accepted source validators.
- Browser targets are exactly 900x1200 and 1280x900 with document-only vertical scrolling, no horizontal overflow, correct first-view counts/state, and a print media view that omits hashes/navigation utilities.

The active Blueprint validator regenerates nothing during normal health checks. It verifies exact source fingerprints, counts and timing, controlled vocabularies, quantitative metrics, Definition of Done coverage, acceptance status, utility ownership, launcher/route markers, protected package immutability, and 18 in-memory fail-closed probes from current files.

- `node tools/fff-state.mjs validate-content-production-blueprint artifacts/content-production-blueprint-result.json`
- `node tools/fff-state.mjs smoke-content-production-blueprint artifacts/content-production-blueprint-result.json artifacts/content-production-blueprint-result.json` is intentional regeneration only.

The active Editorial Derivative validator regenerates nothing during normal health checks. It derives the expected copy from immutable source JSON plus the accepted patch, verifies exact three-change application, cross-file Markdown/CSV/JSON consistency, provenance, package hashes, UI/access markers, preserved routes, and closed boundaries from current files.

- `node tools/fff-state.mjs validate-editorial-derivative-preview artifacts/editorial-derivative-preview-result.json`
- `node tools/fff-state.mjs validate-editorial-revision-roundtrip artifacts/editorial-revision-roundtrip-result.json`
- `node tools/fff-state.mjs validate-bridge-editorial-handoff-pack artifacts/bridge-editorial-handoff-pack-result.json`
- Normal manifest validation keeps source, Revision, derivative, and historical result artifacts byte-identical.
- Negative probes run in memory and fail closed without renaming or rewriting package files.
- The intentional derivative smoke generated exactly the eight package files plus `artifacts/editorial-derivative-preview-result.json`; it passed all 12 required in-memory negative probes with `artifact_mutation=false`, while all 12 protected Handoff/Revision files remained byte-identical.
- The generated package preserves 6 beats / 180 seconds / 6 narration segments / 20 subtitle cues / 19 shot cues / 3 thumbnail directions. Its non-circular five-core-file fingerprint is `94729bb099e0f99eb8ac1170b8a4b5e3694c9970df3149552f8efcd53fceda44`.
- The 900x1200 Derivative browser readback measured an 837 CSS-pixel root with no horizontal overflow, verified six beat tabs, three change tabs, eight static links, eight enabled Blob actions, 8/8 static SHA256 equality, derived JSON hash `15a695b7336ce55f520878cb9a26a35d47994fa176ef57ac55bf231a9cc0b51c`, Light/Dark/Auto, Arrow-key focus/selection with visible focus, one Revision action, zero Handoff additions, and zero console warnings/errors. Screenshot `artifacts/review-screens/editorial-derivative-preview.png` is an 885x1180 content capture from the viewport override, 130553 bytes, with SHA256 `ef79e99a42c879431f75aa9c265bbf37ff7bdf66062a9d58b6576128880b0599`.

The preserved Editorial Handoff validator derives the six-beat baseline, narration, CSV rows, timing, truth/rights guards, file inventory, byte sizes, SHA256 hashes, UI hierarchy, source preservation, and boundary flags from the current files. It does not trust an old result claim and does not write during validation.

- `node tools/fff-state.mjs validate-bridge-editorial-handoff-pack artifacts/bridge-editorial-handoff-pack-result.json`
- `node tools/fff-state.mjs validate-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json`
- `node tools/fff-state.mjs validate-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json`
- `node tools/fff-state.mjs validate-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json`
- Normal manifest validation keeps the new result, all six package files, and consumed source results byte-identical.
- The missing-package-file probe returns nonzero, preserves all remaining hashes, restores the file, and leaves the complete package hash-identical.
- 900x1200 browser readback passed for no horizontal overflow, Light/Dark, Arrow/Home/End, focus-visible, six package links, six beat tabs, hidden Bridge history, and zero console warnings/errors.

The preserved Bridge Storyboard Flow read-only validator validates `fff-bridge-storyboard-flow-001` while deriving its six-beat, interaction, first-surface, collapsed-evidence, theme, source-readback, and boundary checks from the current HTML, source artifacts, and review doc. The preserved Workbench validator remains in the manifest chain. The broader auxiliary provider/translation/adoption/rollback chain should run only when touching those underlying contracts.

The 2026-07-11 Bridge Storyboard checks pass locally. The remaining named `smoke-*` commands in the preserved list are intentional artifact-regeneration references for use only when those underlying contracts change; they are not the normal restart health check:

- The then-targeted manifest validation passed with nine result/readback hashes unchanged; the validate-output-path negative probe exited nonzero and created no file.
- `git fetch --prune origin`
- `git status --short --branch --untracked-files=all`
- `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0` on the synced `62f7d74` baseline before implementation.
- `node --check tools/fff-state.mjs`
- `node tools/fff-state.mjs validate-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json`
- `node tools/fff-state.mjs validate-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json`
- `node tools/fff-state.mjs validate-apply-decision-shell-guard-diet artifacts/apply-decision-shell-guard-diet-result.json`
- `node tools/fff-state.mjs validate-layout-lab-visual-audit artifacts/layout-lab-visual-audit-result.json`
- Static HTML marker check for applied Decision Shell, Dock Governor, Safety Gate Diet, non-gate whitelist, preserved `layout-lab`, preserved `bridge`, `decisionFlowModel`, `safetyGateRegistry`, and locked production/provider/canon boundary copy
- `Invoke-Expression $manifest.validation_command`
- `node tools/fff-state.mjs validate-extraction-fixtures artifacts/extraction-negative-fixtures`
- `node tools/fff-state.mjs validate-layout-research-decision-shell artifacts/layout-research-decision-shell-result.json`
- `node tools/fff-state.mjs validate-low-text-decision-console artifacts/low-text-decision-console-result.json`
- `node tools/fff-state.mjs smoke-guided-review-flow-workspace artifacts/guided-review-flow-workspace-result.json artifacts/guided-review-flow-workspace-result.json`
- `node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon artifacts/bridge-refinement-overview-ribbon-result.json artifacts/bridge-refinement-overview-ribbon-result.json`
- `node tools/fff-state.mjs smoke-home-cockpit-metric-linking artifacts/home-cockpit-metric-linking-result.json artifacts/home-cockpit-metric-linking-result.json`
- `node tools/fff-state.mjs validate-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json`
- `node tools/fff-state.mjs smoke-review-brief-dark-mode-ux artifacts/review-brief-dark-mode-ux-result.json artifacts/review-brief-dark-mode-ux-result.json`
- `node tools/fff-state.mjs smoke-one-story-draft-review-pack artifacts/one-story-draft-review-pack-result.json artifacts/one-story-draft-review-pack-result.json`
- `node tools/fff-state.mjs smoke-designer-candidate-dashboard artifacts/designer-candidate-dashboard-result.json artifacts/designer-candidate-dashboard-result.json`
- `node tools/fff-state.mjs validate-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json`
- `node --check tools/fff-extract-local.mjs`
- `node --check tools/fff-source-span-review-pack.mjs`
- `node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness artifacts/provider-envelope-readiness-no-call-result.json artifacts/provider-adapter-authorization-readiness-result.json`
- `node tools/fff-state.mjs smoke-translation-provenance-source-span-readback artifacts/extraction-adapter-outputs/multilingual-memo-notes.json artifacts/translation-provenance-source-span-readback-result.json`
- `node tools/fff-state.mjs smoke-translation-policy-source-of-truth-boundary artifacts/translation-provenance-source-span-readback-result.json artifacts/translation-policy-source-of-truth-boundary-result.json`
- `node tools/fff-state.mjs smoke-translated-memo-fixture-minimum artifacts/translated-memo-fixture-minimum.json artifacts/translated-memo-fixture-minimum-result.json`
- `node tools/fff-state.mjs smoke-held-claim-adoption-preflight artifacts/translated-memo-fixture-minimum-result.json artifacts/held-claim-adoption-preflight-result.json`
- `node tools/fff-state.mjs smoke-downstream-adoption-semantics-design artifacts/held-claim-adoption-preflight-result.json artifacts/downstream-adoption-semantics-design-result.json`
- `node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run artifacts/downstream-adoption-semantics-design-result.json artifacts/adoption-candidate-ledger-dry-run-result.json`
- `node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim artifacts/adoption-candidate-ledger-dry-run-result.json artifacts/sandbox-adoption-mutation-one-claim-result.json`
- `node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal artifacts/sandbox-adoption-mutation-one-claim-result.json artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- `node tools/fff-state.mjs smoke-production-adoption-authorization-packet artifacts/sandbox-adoption-rollback-rehearsal-result.json artifacts/production-adoption-authorization-packet-result.json`
- `node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim artifacts/production-adoption-authorization-packet-result.json artifacts/production-claim-ledger-adoption-one-claim-result.json`
- `node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal artifacts/production-claim-ledger-adoption-one-claim-result.json artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- `node tools/fff-state.mjs smoke-downstream-target-authorization-packet artifacts/production-claim-ledger-rollback-rehearsal-result.json artifacts/downstream-target-authorization-packet-result.json`
- `node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim artifacts/downstream-target-authorization-packet-result.json artifacts/profile-adoption-mutation-one-claim-result.json`
- HTML inline script syntax check for `public/review/index.html`
- `uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"`
- `git diff --check`
- Previous 2026-07-11 Workbench restart-readiness verification: all seven then-active read-only manifest validators passed; an expected missing-input failure returned nonzero; both success and failure paths left the seven tracked result JSON hashes unchanged; the inline HTML script compiled; strict MkDocs build passed through `uvx`; `git diff --check` passed; and parity was `0 0` before staging that handoff/validation-contract refresh.
- `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0` before staging.
- `git grep` and `rg` route-contamination searches returned no hits after
  cleanup and before the route-lock evidence was added. After this handoff,
  expected hits are limited to the route-lock evidence and summaries.

## Preserved Boundaries

Do not interpret generic asset requirements as selected or rights-cleared media, or human-proxy narration headroom as engine timing. Do not select a TTS engine, voice, provider, credential, URL, vendor, external asset, or catalog item; do not generate audio/image/video; and do not add model/API extraction behavior, database persistence, publishing, production sync, upload credentials, Timeline mutation, Story Seed mutation, additional Claim Ledger adoption, actual production rollback, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive
- which contradictory claim is true

The local review state is not final canon. Claims, profiles, timeline entries, extraction elements, adapter confidence, validator results, source-span pack summaries, and contradictory-claim links may guide review, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, accept natural freeform review text instead of fixed phrases.

Before emitting a Review Card, check the review memory. Do not ask the same target/evidence/axis again unless target, axis, evidence, decision value, or an explicit user request changed.

No general Review Hub, Workbench, or repeated Operator Brief comprehension review is needed. That review passed judgment A and the title hierarchy repair is complete. The active H1 question is now narrower: can another creator explain Beat 2's three-shot hierarchy, primary/supporting reference roles, material/light language, completion conditions, and held questions from the standalone treatment alone? The Storyboard Brief, Execution Pack, quantitative Blueprint, non-canonical Derivative, Revision, immutable Handoff package, and six-beat Bridge Flow remain the protected evidence chain.

## Preserved Entrance and Deferred Reference Paths

H1 Operator Brief comprehension is complete. The current entrance is H1 Beat 2 Visual Treatment review after H0 validator evidence; Production Execution readiness and the remaining rows are preserved reference paths or separately authorized later lanes, not competing next-step recommendations.

| Entrance | Why it helps | What becomes possible |
| --- | --- | --- |
| Review: Beat 2 Visual Treatment | Starts from `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html` after its result is green; asks the reviewer to explain three-shot dominance, reference roles, material/light, completion conditions, and held questions | Observed Beat 2 reference/composition/wording friction can be repaired without changing protected planning sources or widening to full-story assets |
| Preserved review: Production Execution readiness | Starts from `artifacts/production-execution-pack/production-execution-pack.html` after its result is green; asks the reviewer to explain preparation, reuse, assembly, and closed choices without audit files | Transfer friction remains reviewable later without opening real assets, rights, engine calibration, or media work |
| Verify: synthetic timing envelope | Compares four `proxy_headroom_confirmed` rows with B2/B5 `existing_pass_unmeasured` and confirms all engine/voice/audio selections remain false | H2 engine calibration can later replace proxy evidence without rewriting narration |
| Review: Editorial Derivative Preview | Starts from `public/review/index.html?mode=derivative` and the eight portable files in `artifacts/editorial-derivative/` | Human reviewer can inspect exactly three safe edits in full package context and discard the derivative without touching source |
| Review: Editorial Revision Roundtrip | Starts from `public/review/index.html?mode=revision` and the local package in `artifacts/editorial-revision/` | Human editorial changes can be classified, compared, decided, and exported as an unapplied safe-only patch without mutating the Handoff source |
| Use: Editorial Handoff Pack | Starts from `public/review/index.html?mode=handoff` and the six portable files in `artifacts/editorial-handoff/` | A writer, subtitle editor, or video editor can continue from one aligned 180-second package without reconstructing the plan or opening production gates |
| Review: Bridge Storyboard Flow | Starts from `public/review/index.html?mode=bridge` and compares it with `artifacts/review-screens/bridge-storyboard-flow.png`; `brief` and `layout-lab` remain preserved context only | Human reviewer can accept, revise, or return the six-beat order and approximate timing without reopening provider/API, production, rights, database, or final-canon lanes |
| Verify: Low-text Console then Bridge review | Starts from the preserved `brief` route, then checks the Draft-to-Video Bridge refinement | Human reviewer can accept, revise, or reject the route, narration, subtitle rhythm, visual order, thumbnail direction, and held-truth policy without reopening Source Audit / Project Cockpit / Artifacts by default |
| Advance: script/subtitle/shot refinement | Uses an accepted overview and Bridge route to narrow one narration path, subtitle rhythm, screen beats, and thumbnail comparison | One video package can become clearer while provider/API, video generation, upload, rights clearance, and final canon remain locked |
| Advance: provider adapter authorization | Uses the authorization readiness Decision Packet only after provider choice, credentials, endpoint, transport scope, external call permission, timeout, and retry policy are explicitly approved | A real adapter can be implemented without silently crossing the boundary |
| Verify: contradictory claim guard | Re-runs the held-conflict fixture and result after adapter edits | Future Claim Ledger acceptance paths can fail before they auto-promote conflicts |
| Advance: post-Profile adoption target | Uses the completed Profile adoption readback while keeping Timeline / Story Seed / Canon decision closed | A future implementation can target Timeline, Story Seed, Canon decision, or actual rollback only after separate explicit authorization |
| Verify: production Claim Ledger rollback rehearsal | Re-runs the retained-row rollback descriptor readback without mutation | A later actual rollback decision can start from known rollback evidence without implying row removal |
| Verify: sandbox rollback rehearsal | Re-runs the sandbox rollback token and transition readback before production adoption work | Future adoption work can start from a known reversible fixture row without implying production rollback |
| Verify: Claim Ledger adoption readback | Re-runs the one-claim production Claim Ledger row, before/after state, and rollback descriptor | Future work can distinguish the completed Claim Ledger adoption from still-blocked canon or non-Claim-Ledger targets |
| Advance: broader translated memo coverage | Uses the two-row minimum fixture as the regression baseline | More translated rows can be added without reopening provider work or replacing original source spans |
| Audit: translation provenance policy | Re-runs the source-span/claim and policy readbacks if fixture wording changes | Translation-derived claims can stay held and source-backed while the fixture is added |
| Audit: remaining fixture class | Adds translated or very broad fixture coverage only after policy or source-output evidence creates a concrete gap | Adapter/model regression coverage becomes less brittle without duplicate fixtures |
| Excise: weak source-span debt | Improves a concrete source-span class while preserving the broad-span and malformed-span guards | Review can focus on source usefulness instead of source validity |

## Residual Work

| Work | Purpose | Current state | Next move |
| --- | --- | --- | --- |
| Beat 2 Composition Board | Make the exact three-shot Beat 2 slice stageable through explicit image-based crop, focus, eye path, depth, placement, and reference-portion decisions | `fff-beat2-composition-board-001` is published at product checkpoint `6ef134b`; H0 is green and independent H1 passed `3/3 = 1.0` with no repair target | Preserve the accepted Board; if explicitly authorized, run one different-Beat counterexample before any 19-shot expansion |
| Beat 2 Visual Treatment Pilot | Give a separate creator one concrete, reference-led three-shot treatment without changing protected planning sources | `fff-beat2-visual-treatment-pilot-001` is published at product checkpoint `72df19b`; H0 is green for 3 shots, 6 references, 24/24 probes, both viewports, provenance, print style, and source immutability | Run H1 freeform visual-treatment review from the standalone page only; if it fails, repair only observed Beat 2 reference choice, composition hierarchy, or wording |
| Production Execution Pack | Give another creator one portable preparation and assembly contract | `fff-production-execution-pack-001` is H0 validated; nine files cover 6 beats, 19 shots, 14 generic requirements, and an engine-neutral timing overlay; the result is green | Run H1 execution-readiness review |
| Operator Brief Typography Balance | Preserve accepted comprehension while fixing the oversized title | `fff-operator-production-brief-typography-balance-001` is preserved; H1 passed A and both accepted viewports pass hierarchy, first-view, and immutability checks | Use as source context and launcher; reopen only for measured regression |
| Operator Production Brief | Make the validated Blueprint understandable to a non-specialist in one reading path | `fff-operator-production-brief-001` is preserved; four sections, normal document flow, visual diagrams, one-level shot detail, and closed Audit & Files preserve the technical source | Reopen only for measured regression or separately authorized content/structure work |
| Content Production Blueprint | Preserve the measurable machine/audit contract | `fff-content-production-blueprint-001` remains the protected eight-file source with unchanged counts, timing, vocabulary, truth, rights, and acceptance | Reopen only if the technical contract itself changes under separate authority |
| Editorial Derivative Preview | Materialize the accepted safe-only patch as a complete reversible package | `fff-editorial-derivative-preview-001` is preserved; eight files expose exactly three copy-only wording edits with provenance, integrity metadata, and discard rollback | Review locally only as preserved context; start a real Human Revision Pilot or canonical application only with separate input and authorization |
| Bridge Editorial Handoff Pack | Make the accepted six-beat implementation portable for manual editorial delivery | `fff-bridge-editorial-handoff-pack-001` is the preserved immutable source; the focused route and six-file package align narration, 20 subtitle cues, 19 shots, truth/rights guards, and integrity metadata | Use locally for manual refinement; keep timing changes explicit and provider, generation, asset selection, render, upload, rights, database, and canon closed |
| Bridge Storyboard Flow | Make the chosen three-minute story hypothesis readable as one ordered production-planning flow | `fff-bridge-storyboard-flow-001` is preserved as the exact source baseline; exactly six beats share one rail and active canvas, and prior Bridge detail remains collapsed supporting evidence | Reopen only when an explicit later decision changes order or timing; keep final narration, assets, rights, production, and canon closed |
| Review Workbench Component Contract | Keep the default review route feeling like one coordinated Workbench rather than movable cards | `fff-review-workbench-component-contract-001` is preserved; the human observation accepted the top Workbench and closed `OPERATOR_FIRST` | Reopen only if a later change materially regresses the Brief Workbench; lower-page density remains acceptable non-blocking debt |
| Apply Decision Shell Guard Diet | Keep the default review route decision-first without reopening production gates | `fff-apply-decision-shell-guard-diet-001` is preserved as the source shell; Decision Flow Model, Dock Governor, compact gate registry, and Guard drawer remain intact under the Workbench contract | Reopen only if the Workbench contract breaks the applied Shell behavior |
| Layout Lab Visual Audit | Preserve visual evidence for why the default review route changed | `fff-layout-lab-visual-audit-001` is source evidence; the contact sheet and four screenshots show `layout-lab`, Split-pane Decision Shell detail, preserved `brief`, and preserved `bridge` with all production/provider/canon gates closed | Reopen only if the applied Shell needs a layout revision |
| Layout Research Decision Shell | Decide whether the review UI should move beyond card-first layout before more content refinement | `fff-layout-research-decision-shell-001` is the preserved source; `layout-lab` compares Card-first, Briefing Inbox, Split-pane Decision Shell, and Storyboard Flow, recommends the split-pane Decision Shell, and keeps all production/provider/canon gates closed | Use this as the design source if the visual audit is revised or if the reviewer needs the route-level rationale |
| Guided Review Flow Workspace | Put one review sequence before overview and card shelves | `fff-guided-review-flow-workspace-001` is preserved below the low-text console and layout research readback; no-query access still keeps Decision Queue, one Bridge action, Pinned Tray, Operations Notice, Important Folders, Inspiration Workspace, Bridge Guided Flow, and closed production lanes | Use as supporting structure if the Decision Shell is accepted or if `brief` wording needs regression comparison |
| Bridge Refinement Overview Ribbon | Put latest status before comprehensive shelves and make Bridge judgement-ready | `fff-bridge-refinement-overview-ribbon-001` is preserved under the guided flow; the Latest Overview Report, folded legacy Brief, Bridge refinement cues, and closed production lanes remain visible | Human reviewer should use it as context after the Guided Flow, not as the first stop |
| Home Cockpit Metric Linking | Make folded shelves legible before Bridge review | `fff-home-cockpit-metric-linking-001` is preserved under the guided flow; no-query access still exposes Operator Track, Workbench, Evidence Vault, Locked Lanes, and nine readiness meters below the first sequence | Human reviewer should only open Evidence Vault shelves when auditing |
| Review Home Map Meters | Preserve prior shelf-map readback | `fff-review-home-map-meters-001` remains available through the `mode=home` alias and its result JSON | Use only for regression comparison if the Home Cockpit wording drifts |
| Contradictory claim handling | Prevent conflicting claims from entering canon automatically | Guarded by a valid fixture and smoke result; truth choice remains human-owned | Keep the guard required for any future Claim Ledger acceptance path |
| Downstream adoption readiness | Ensure Claim Ledger / Profile / Timeline / Story Seed / Canon decision choices stay source-tracked and unauthorized until selected | Readback gate passes with 0 adopted Profile / Timeline candidates; held claim preflight, semantics design, ledger dry-run, sandbox rollback, production authorization, Claim Ledger adoption, Claim Ledger rollback rehearsal, downstream target authorization, and Profile adoption now prove exactly 1 retained Claim Ledger production adoption row plus 1 Profile-only non-canon annotation with rollback descriptors and 0 actual rollback/canon/Timeline/Story Seed/provider effects | Keep further adoption, actual rollback, canon, provider/API, and additional-claim work blocked until explicitly requested |
| Provider envelope and authorization readiness | Fix future provider output shape and approval boundary before transport exists | No-call readback passes, and authorization readiness lists 6 blocked items plus 3 options; no provider, endpoint, credential, project-state mutation, or adopted canon output exists | Use as required preconditions, not as provider integration |
| Route lock / project hygiene | Keep Fast Fiction Factory separate from ClipPipeGen prompt residue | `fff-route-lock-clean-state-readback-001` records cleanup of untracked ClipPipeGen files and no tracked contamination | Start new terminals from this handoff and keep future `clip-ed10` / `ED-10` work out of this repo |
| Fixture coverage | Cover unrepresented memo shapes | 9 validator fixtures and 5 adapter fixture outputs now pass; multilingual memo text is covered; translated memo text now has a two-row minimum fixture plus provenance, source-of-truth policy, and held-claim preflight; very broad source-span shape is audited and deferred because current broad rows are already resolved | Add more translated rows or another fixture class only when it has concrete decision value and preserves the relevant boundary |
| Model/API adapter | Replace deterministic extraction with provider-backed extraction | Explicitly not started | Keep blocked until user authorizes provider, credential, endpoint, API transport scope, external call permission, timeout, and retry policy |
