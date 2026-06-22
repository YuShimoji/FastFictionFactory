# Project Context

## Current Axis

Fast Fiction Factory is a local-first fiction production workbench. The current artifact is `fff-ambiguous-routing-resolution-001`, served through the static local Visual Review Hub at `public/review/index.html`.

## Current Lane

Keep the MVP reviewable without production commitments. The current lane is review-memory-aware source-span governance: story review, source audit, project cockpit, artifact governance, screenshot evidence, local access paths, non-redundant review requests, and routing policy must remain easy to distinguish before freeform review drives adapter changes or any model/API extractor exists.

## Current Slice

The active slice is complete enough for local review:

- Review UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Ambiguous routing resolution doc: `docs/review/ambiguous-routing-resolution.md`
- Ambiguous routing resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Source-span quality audit doc: `docs/review/source-span-quality-audit.md`
- Source-span quality audit result: `artifacts/source-span-quality-audit-result.json`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Review memory / dedup smoke: `artifacts/review-memory-dedup-smoke-result.json`
- Review procedure: `docs/review/review-procedure.md`
- Review procedure smoke: `artifacts/review-procedure-lock-smoke-result.json`
- Review Hub IA smoke: `artifacts/review-hub-ia-mode-split-smoke-result.json`
- Review Hub IA review doc: `docs/review/review-hub-ia-mode-split.md`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Source-span pack generator: `tools/fff-source-span-review-pack.mjs`
- Source-span pack review doc: `docs/review/source-span-routing-review-pack.md`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Model/API boundary envelope: `artifacts/model-api-boundary-envelope.example.json`
- Model/API boundary smoke evidence: `artifacts/model-api-boundary-smoke-result.json`
- State adapter: `tools/fff-state.mjs`
- Current state: `artifacts/current-project-state.json`
- Sample state: `artifacts/sample-project-state.json`
- Claim Ledger smoke evidence: `artifacts/claim-ledger-smoke-result.json`
- Timeline smoke evidence: `artifacts/timeline-smoke-result.json`
- v1.3 compliance smoke evidence: `artifacts/v1-3-compliance-smoke-result.json`
- Checkpoint readback evidence: `artifacts/checkpoint-readback-result.json`
- Profile/Ghost smoke evidence: `artifacts/profile-ghost-smoke-result.json`
- Extraction payload: `artifacts/sample-extraction-payload.json`
- Extraction Contract smoke evidence: `artifacts/extraction-contract-smoke-result.json`
- Extraction validator fixture directory: `artifacts/extraction-negative-fixtures/`
- Extraction validator smoke evidence: `artifacts/extraction-validator-smoke-result.json`
- Extraction validator review doc: `docs/review/extraction-validator-hardening-review.md`
- Freeform review intake smoke evidence: `artifacts/freeform-review-intake-smoke-result.json`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke evidence: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Mode screenshots: `artifacts/review-screens/`
- Shell launcher: `scripts/operator/open_review.sh`
- Local docs view: `mkdocs.yml`
- Project overview map: `docs/project-overview.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`

## Verification Snapshot

Last verified on 2026-06-22:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\sample-extraction-payload.json
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
node .\tools\fff-extract-local.mjs .\artifacts\sample-raw-memo.md .\artifacts\local-extraction-adapter-output.json .\artifacts\local-extraction-adapter-smoke-result.json
node .\tools\fff-extract-local.mjs --matrix .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json
node .\tools\fff-source-span-review-pack.mjs .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\source-span-routing-review-pack.json
```

Result summary:

- Active manifest validation passes for `fff-ambiguous-routing-resolution-001`.
- Ambiguous routing resolution parses and passes with 7 resolved rows: 3 Profile-primary routes, 1 Visual-primary route, and 3 Human Review holds.
- Review Dedup Gate is recorded with axis `ambiguous_routing_resolution`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub request.
- All visual asset rows avoid direct Claim routing and keep `targetClaimIds: []`.
- Source-span quality audit classifies 36 existing review-pack rows: 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows.
- Both state JSON files validate with `schemaVersion: "fff.projectState.v1"`.
- The sample extraction payload validates as `schemaVersion: "fff.extractionContract.v1"`.
- The validator fixture matrix passes: 2 expected-valid fixtures, 5 expected-invalid fixtures, and built-in mutation guards.
- Current state contains 1 Extraction Contract run, 12 extraction elements, 11 Profile/Ghost records, 9 Claim Ledger claims, and 8 Timeline View entries.
- Local adapter expansion generated 3 fixture outputs with 36 total extracted elements, complete required element-type coverage, 27 profile candidates, 20 claim candidates, 12 timeline candidates, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual-asset routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions.
- Source-span review pack generated from those three outputs and records 17 human-owned guarded elements plus Review Debt categories for weak spans, over-broad spans, vague extraction, previously ambiguous routing, confident defaults, and missing fixture classes.
- Review Hub IA mode split adds Story Review, Source Audit, Project Cockpit, and Artifacts modes with Japanese-facing display labels, non-sticky Raw Story Memo behavior, and collapsed source-span fixture details by default.
- Review Procedure Lock adds fixed local open commands, identity/access split, screenshot/contact-sheet map, mode-specific screenshot evidence paths, optional-vs-required review boundaries, freeform review guidance, and Review Debt without asking for immediate user review.
- Review Memory Dedup adds manifest-level review memory, Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card rules so future review requests do not repeat the same target, evidence, and axis.
- Model/API boundary spec remains preserved as a spec-only, no-external-call boundary for future provider work.
- Extraction Contract summary covers all required element types, 6 high-canon-risk extraction elements, 3 human-owned unresolved dependencies, 5 warnings, and candidate routing into Profile/Ghost, Claim Ledger, and Timeline View.
- Profile/Ghost summary covers all required profile types, all required ghost node statuses, 7 high canon risk profiles, 7 dependency-bound profiles, and 11 profiles linked to both claims and timeline entries.
- Claim summary: 5 high canon risk claims, 5 claims with unresolved dependencies, 1 unverified reality status claim, and 4 hidden or spoiler-protected claims.
- Timeline summary reports all five timeline axes, 4 high canon risk entries, 4 dependency-bound entries, and 8 entries linked to claims.
- The active manifest validation command, MkDocs strict build, and git diff whitespace checks passed for the latest slice.

## Boundaries

Do not treat local review state as final canon. Do not add model/API behavior, provider credentials, publishing, upload credentials, AI video generation, production sync, database persistence, or final decisions for Toma, the brass moth, or the Council unless explicitly requested.

## Restart Path

Open the review UI from the repo root:

```powershell
Invoke-Item .\public\review\index.html
```

Or use the dependency-free launchers:

```powershell
.\scripts\operator\open_review.ps1
```

```sh
./scripts/operator/open_review.sh
```

Open the local Markdown docs view from the repo root:

```powershell
python -m pip install mkdocs-material
python -m mkdocs serve -a 127.0.0.1:8000
```

If port `8000` is already in use, use a neighboring local port such as `8001`.

Run the state, adapter, and pack checks:

```powershell
node .\tools\fff-state.mjs summarize .\artifacts\current-project-state.json
node .\tools\fff-state.mjs smoke-extraction-fixtures .\artifacts\extraction-negative-fixtures .\artifacts\extraction-validator-smoke-result.json
node .\tools\fff-source-span-review-pack.mjs .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\source-span-routing-review-pack.json
```

First next move: apply the Review Dedup Gate before asking for review. The next non-redundant move is one bounded fixture or validator improvement: widen or split one weak span, split one broad span, add one missing fixture class, or harden route-policy validation if drift appears again.

## Handoff Path

For another terminal, start with `docs/review/next-terminal-handoff.md` after pulling latest remote state. It preserves the active artifact, validation commands, human-owned boundaries, freeform review intake contract, and the next viable entrances without relying on previous chat context.

Latest handoff refresh: 2026-06-22. At refresh time, the active artifact is `fff-ambiguous-routing-resolution-001` at commit `641ac48` before this handoff refresh; no model/API call, provider credential, database persistence, publishing adapter, production sync, AI video generation, repeated review requirement, or final canon decision existed.
