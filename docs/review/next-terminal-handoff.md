# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

Latest handoff refresh: 2026-06-20T00:00:00+09:00. At refresh time, the active artifact is `fff-local-extraction-adapter-expansion-001`; the preserved adapter artifact is `fff-local-extraction-adapter-spike-001`; the preserved validator artifact is `fff-extraction-validator-hardening-001`; and the preserved contract artifact is `fff-extraction-contract-001`.

## Start Here

1. Pull the latest remote state:

```powershell
git pull --ff-only
```

2. Confirm Git parity:

```powershell
git status --short --branch
git rev-list --left-right --count "HEAD...@{u}"
git log -5 --oneline --decorate
```

Expected after this handoff is published: `master` is clean and synced with `origin/master`, with `HEAD...@{u}` reporting `0 0`.

3. Read these files in this order:

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
docs/review/local-extraction-adapter-expansion-review.md
docs/review/local-extraction-adapter-review.md
docs/review/extraction-validator-hardening-review.md
docs/data-model.md
docs/idea-ledger.md
docs/decision-log.md
```

4. Open the active local review artifact:

```powershell
.\scripts\operator\open_review.ps1
```

5. Re-run the local checks before changing behavior:

```powershell
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\sample-extraction-payload.json
node .\tools\fff-extract-local.mjs .\artifacts\sample-raw-memo.md .\artifacts\local-extraction-adapter-output.json .\artifacts\local-extraction-adapter-smoke-result.json
node .\tools\fff-extract-local.mjs --matrix .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
python -m mkdocs build --strict
git diff --check
```

If the default Windows `python` resolves to the WindowsApps stub, use a real Python install or the Codex bundled Python after installing `mkdocs-material` in that runtime.

## Current Project State

- Active artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Active UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixture directory: `artifacts/extraction-negative-fixtures/`
- Validator smoke result: `artifacts/extraction-validator-smoke-result.json`
- Current lane: local-first deterministic extraction adapter expansion before any model/API extractor exists.

The active artifact extends the Visual Review Hub with adapter expansion status while keeping the Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and state validation intact.

## What Finished

- Kept the single adapter command working for `artifacts/sample-raw-memo.md`.
- Added `--matrix` mode to `tools/fff-extract-local.mjs`.
- Added three raw memo fixtures under `artifacts/extraction-adapter-fixtures/`.
- Generated three fixture outputs under `artifacts/extraction-adapter-outputs/`.
- Added `artifacts/local-extraction-adapter-expansion-smoke-result.json`.
- Added source-span, source-ref, visual-routing, review-default, and human-owned decision audits to adapter smoke.
- Updated the Review Hub, manifest, current status packet, adapter expansion review doc, data model notes, artifact inventory, project context, overview map, idea ledger, and decision log.

## Verified Checks

- Single adapter smoke passed for `artifacts/sample-raw-memo.md`.
- Matrix adapter smoke passed with 3 fixture inputs, 3 outputs, 36 extracted elements, complete required element-type coverage, 27 profile candidates, 20 claim candidates, and 12 timeline candidates.
- Source/routing audit passed with 36/36 source spans matched, 0 missing source refs, 0 unsafe visual-asset routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions.
- Validator fixture matrix remained passing with 7/7 fixture expectations.
- Final validation should be rerun from the active manifest before the next behavior change.

## Preserved Boundaries

Do not add model/API extraction behavior, publishing, AI video generation, database persistence, production sync, upload credentials, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive

The local review state is not final canon. Claims, profiles, timeline entries, extraction elements, adapter confidence, and validator results may guide review, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, do not ask the user to reply with fixed phrases such as `accept`, `reject`, or `small_adjustment`.

Use a Review Card that names the target artifact or section, gives up to three things to inspect, states that freeform review is allowed, gives examples of natural feedback, explains how the agent will interpret and continue, and gives a completion signal.

When review is useful but not required to continue, record it as Review Debt instead of stopping. Any user freeform review is the source of truth.

## Next Useful Entrances

| Entrance | Why it helps | What becomes possible |
|---|---|---|
| Audit: source-span and routing quality | Confirms the deterministic fixture matrix is useful, not merely valid | More realistic extraction behavior can be designed without weakening review safety |
| Expand: add more adapter fixtures | Covers new memo shapes such as missing phrases, duplicate names, or ambiguous source spans | Future CI or pre-commit checks get cleaner regression coverage |
| Design: model/API adapter boundary | Uses the same validator, review-held defaults, source refs, and human-owned boundaries | Model/API work can start without changing canon or persistence authority |
| Explore: durable local storage option | Reduces manual JSON import/export friction while staying local-first | A future file-backed or SQLite store can be planned without changing canon authority |

## Residual Work

### Adapter Source-Span And Routing Quality

- Purpose: Decide whether the fixture matrix catches the source and routing problems that matter before model/API work.
- Effect: Keeps future generated candidates reviewable and source-tracked.
- Requirements: Must stay local-only, zero external services, source-tracked, validator-gated, review-held by default, and non-canon-producing.
- State: Useful next review step after `fff-local-extraction-adapter-expansion-001`.
- Owner: Product/AI implementer for fixtures and validator shape; human author for final story authority.
- Next move: Add only edge fixtures discovered by real adapter output or review feedback.

### Model/API Adapter Boundary

- Purpose: Prepare a future extractor behind the reviewed local contract.
- Effect: Allows model/API output to be validated before it touches Profile/Ghost Flow, Claim Ledger, or Timeline View.
- Requirements: No credentials or external calls until explicitly authorized; must preserve `validate-extraction`, fixture matrix, review-held defaults, source refs, freeform review, and human-owned decisions.
- State: Not started.
- Owner: Product/AI implementer.
- Next move: Draft a boundary spec or local mock that produces the same payload shape without calling a model/API.

## Resume Prompt

Use this prompt in a new terminal if you want the next agent to continue directly:

```text
Continue in C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory. Pull with git pull --ff-only, then read AGENTS.md, docs/project-context.md, docs/review/current-status.md, docs/review/next-terminal-handoff.md, artifacts/artifact-manifest.json, docs/review/local-extraction-adapter-expansion-review.md, docs/review/local-extraction-adapter-review.md, docs/review/extraction-validator-hardening-review.md, docs/data-model.md, docs/idea-ledger.md, and docs/decision-log.md first. Preserve the local-first Visual Review Hub, fff-local-extraction-adapter-spike-001, fff-extraction-contract-001, fff-extraction-validator-hardening-001, Claim Ledger, Timeline View, Profile/Ghost Flow, freeform review intake, and human-owned canon boundaries. The active artifact is fff-local-extraction-adapter-expansion-001. Do not add model/API behavior, publishing, AI video generation, database persistence, production sync, credentials, or final canon decisions unless explicitly requested. Start by running the state, adapter, fixture, manifest, MkDocs, and git diff checks from docs/review/next-terminal-handoff.md. The next product move is source-span/routing quality review or a model/API adapter boundary behind the same validator.
```
