# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

Latest handoff refresh: 2026-06-19T18:58:54+09:00. At refresh time, `git fetch origin --prune` completed, `HEAD...@{u}` reported `0 0`, and the active manifest validation command passed. The smoke evidence was regenerated at `artifacts/extraction-validator-smoke-result.json`.

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

Expected after this handoff is published: `master` is clean and synced with `origin/master`, with `HEAD...@{u}` reporting `0 0`. The latest product checkpoint should contain `fff-extraction-validator-hardening-001` with seven fixture files and the preserved `fff-extraction-contract-001` surface.

3. Read these files in this order:

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
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
node .\tools\fff-state.mjs validate-extraction .\artifacts\extraction-negative-fixtures\valid-minimal.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\extraction-negative-fixtures\unknown-fields-preservation.json
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
node .\tools\fff-state.mjs smoke-extraction-fixtures .\artifacts\extraction-negative-fixtures .\artifacts\extraction-validator-smoke-result.json
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
python -m mkdocs build --strict
git diff --check
```

If the default Windows `python` resolves to the WindowsApps stub, use a real Python install or the Codex bundled Python after installing `mkdocs-material` in that runtime.

## Current Project State

- Active artifact: `fff-extraction-validator-hardening-001`
- Preserved prior artifact: `fff-extraction-contract-001`
- Active UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current state JSON: `artifacts/current-project-state.json`
- Sample state JSON: `artifacts/sample-project-state.json`
- Sample extraction payload: `artifacts/sample-extraction-payload.json`
- Fixture directory: `artifacts/extraction-negative-fixtures/`
- Validator smoke result: `artifacts/extraction-validator-smoke-result.json`
- Latest product checkpoint before this handoff packet: `fff-extraction-validator-hardening-001`
- Current lane: local-first Extraction Contract validator hardening before any adapter or model/API extractor exists.

The active artifact extends the Visual Review Hub with validator status and fixture coverage while keeping the Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and state validation intact.

## What Finished

- Added standalone extraction validation commands to `tools/fff-state.mjs`.
- Added `validate-extraction`, `summarize-extraction`, `validate-extraction-fixtures`, and `smoke-extraction-fixtures`.
- Added seven fixtures:
  - `valid-minimal.json`
  - `missing-source-refs.json`
  - `overconfident-human-owned-decision.json`
  - `invalid-routing-visual-asset-to-claim.json`
  - `auto-canon-leak.json`
  - `missing-review-safe-defaults.json`
  - `unknown-fields-preservation.json`
- Added built-in mutation guards for missing `extractionRunId`, missing `schemaVersion`, invalid element type, missing `humanAuthorityBoundaries`, and missing high-risk warnings.
- Regenerated `artifacts/extraction-validator-smoke-result.json`.
- Updated `public/review/index.html` so the Visual Review Hub shows `fff-extraction-validator-hardening-001` while preserving `fff-extraction-contract-001`.
- Regenerated `artifacts/fff-current-review-screenshot.png` and `artifacts/fff-review-contact-sheet.png`.
- Updated `docs/review/current-status.md`, `docs/review/extraction-validator-hardening-review.md`, `docs/data-model.md`, `docs/project-context.md`, `docs/idea-ledger.md`, `docs/decision-log.md`, `artifacts/ARTIFACTS.md`, and `artifacts/artifact-manifest.json`.

## Verified Checks

- `git status --short --branch`: clean after push.
- `git rev-list --left-right --count "HEAD...@{u}"`: `0 0`.
- `node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json`: passed.
- `node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json`: passed.
- `node .\tools\fff-state.mjs validate-extraction .\artifacts\sample-extraction-payload.json`: passed.
- `node .\tools\fff-state.mjs validate-extraction .\artifacts\extraction-negative-fixtures\valid-minimal.json`: passed with an unknown-field preservation warning.
- `node .\tools\fff-state.mjs validate-extraction .\artifacts\extraction-negative-fixtures\unknown-fields-preservation.json`: passed with an unknown-field preservation warning.
- `node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures`: passed with 7/7 fixture expectations, 2 expected-valid fixtures, 5 expected-invalid fixtures, and 5 built-in guards.
- `node .\tools\fff-state.mjs smoke-extraction-fixtures .\artifacts\extraction-negative-fixtures .\artifacts\extraction-validator-smoke-result.json`: passed and regenerated the smoke artifact.
- Manifest validation command: passed.
- Browser smoke via localhost: active artifact, preserved Extraction Contract, validator fixture links, Claim Ledger, Timeline View, Profile/Ghost Flow, and freeform review text were visible; screenshot and contact sheet were regenerated through Chrome.
- Screenshot/contact sheet exist and are non-empty.
- `git diff --check`: passed.
- `python -m mkdocs build --strict`: passed with only the non-fatal Material for MkDocs future-compatibility notice and nav-info output for the new review doc.

## Preserved Boundaries

Do not add model/API extraction behavior, publishing, AI video generation, database persistence, production sync, upload credentials, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive

The local review state is not final canon. Claims, profiles, timeline entries, extraction elements, and validator results may guide review, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, do not ask the user to reply with fixed phrases such as `accept`, `reject`, or `small_adjustment`.

Use a Review Card that names the target artifact or section, gives up to three things to inspect, states that freeform review is allowed, gives examples of natural feedback, explains how the agent will interpret and continue, and gives a completion signal.

When review is useful but not required to continue, record it as Review Debt instead of stopping. Any user freeform review is the source of truth.

## Next Useful Entrances

| Entrance | Why it helps | What becomes possible |
|---|---|---|
| Advance: local-only extraction adapter spike | Emits the reviewed contract shape from deterministic input without external services | Later model/API work can target a stable schema instead of inventing contract fields midstream |
| Verify: run adapter output through validator | Confirms generated candidates are source-tracked and review-safe | Unsafe payloads fail before touching Claim Ledger, Timeline View, or Profile/Ghost Flow |
| Audit: expand negative fixtures | Covers additional adapter failure modes such as duplicate IDs, source span mismatch, or unsafe review status vocabulary | Cleaner future CI or pre-commit validation |
| Explore: durable local storage option | Reduces manual JSON import/export friction while staying local-first | A future file-backed or SQLite store can be planned without changing canon authority |

## Residual Work

### Local-Only Extraction Adapter Spike

- Purpose: Convert deterministic input into the reviewed Extraction Contract shape.
- Effect: Makes future generated candidate handling testable before any model/API dependency.
- Requirements: Must stay local-only, zero external services, source-tracked, validator-gated, review-held by default, and non-canon-producing.
- State: Not started.
- Owner: Product/AI implementer.
- Next move: Build the smallest deterministic adapter output, then run `validate-extraction` and `smoke-extraction-fixtures`.

### Fixture Coverage Expansion

- Purpose: Add more negative cases as adapter risks become concrete.
- Effect: Keeps unsafe payload shapes from becoming accidental UI or canon behavior.
- Requirements: Each new fixture must have an expected pass/fail result and must not finalize Toma fate, brass moth truth, or Council motive.
- State: Useful but not required before the first local adapter spike.
- Owner: Product implementer.
- Next move: Add only cases discovered by real adapter output or review feedback.

## Resume Prompt

Use this prompt in a new terminal if you want the next agent to continue directly:

```text
Continue in C:\Users\PLANNER007\FastFictionFactory. Pull with git pull --ff-only, then read AGENTS.md, docs/project-context.md, docs/review/current-status.md, docs/review/next-terminal-handoff.md, artifacts/artifact-manifest.json, docs/review/extraction-validator-hardening-review.md, docs/data-model.md, docs/idea-ledger.md, and docs/decision-log.md first. Preserve the local-first Visual Review Hub, fff-extraction-contract-001, Claim Ledger, Timeline View, Profile/Ghost Flow, freeform review intake, and human-owned canon boundaries. The active artifact is fff-extraction-validator-hardening-001. Do not add model/API behavior, publishing, AI video generation, database persistence, production sync, credentials, or final canon decisions unless explicitly requested. Start by running the state, extraction, fixture, manifest, MkDocs, and git diff checks from docs/review/next-terminal-handoff.md. The next product move is a local-only extraction adapter spike that emits the reviewed contract shape from deterministic input and passes the validator before any model/API work.
```
