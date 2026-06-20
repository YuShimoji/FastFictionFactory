# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

Latest handoff refresh: 2026-06-20T00:00:00+09:00. At refresh time, the active artifact is `fff-source-span-routing-review-pack-001`; the preserved model/API boundary artifact is `fff-model-api-boundary-spec-001`; the preserved adapter expansion artifact is `fff-local-extraction-adapter-expansion-001`; the preserved adapter artifact is `fff-local-extraction-adapter-spike-001`; the preserved validator artifact is `fff-extraction-validator-hardening-001`; and the preserved contract artifact is `fff-extraction-contract-001`.

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
docs/review/source-span-routing-review-pack.md
docs/review/model-api-boundary-spec.md
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
node .\tools\fff-source-span-review-pack.mjs .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\source-span-routing-review-pack.json
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
uvx --from mkdocs-material mkdocs build --strict
git diff --check
```

If `uvx` is unavailable, use a real Python/MkDocs Material runtime instead of the default WindowsApps Python stub.

## Current Project State

- Active artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Active UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Source-span pack generator: `tools/fff-source-span-review-pack.mjs`
- Source-span pack review doc: `docs/review/source-span-routing-review-pack.md`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Model/API boundary envelope: `artifacts/model-api-boundary-envelope.example.json`
- Model/API boundary smoke: `artifacts/model-api-boundary-smoke-result.json`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixture directory: `artifacts/extraction-negative-fixtures/`
- Validator smoke result: `artifacts/extraction-validator-smoke-result.json`
- Current lane: source-span and routing supervision for existing local deterministic adapter outputs before freeform review drives adapter changes.

The active artifact extends the Visual Review Hub with a compact review pack while keeping the Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and state validation intact.

## What Finished

- Preserved `fff-model-api-boundary-spec-001` as the prior no-external-call provider boundary artifact.
- Added `tools/fff-source-span-review-pack.mjs`.
- Generated `artifacts/source-span-routing-review-pack.json`.
- Added a Source-Span Routing Review Pack section to `public/review/index.html`.
- Added representative fixture tables for `clockmaker-sample`, `council-minutes-edge`, and `observatory-ledger-edge`.
- Recorded Review Debt categories for weak spans, over-broad spans, vague extraction, ambiguous routing, confident defaults, and missing fixture classes.
- Updated manifest, current status packet, review doc, data model notes, artifact inventory, project context, MkDocs nav, idea ledger, decision log, and this handoff.

## Verified Checks

- Source-span pack generation passed for the existing three fixture outputs.
- Matrix adapter smoke still passed with 3 fixture inputs, 3 outputs, 36 extracted elements, complete required element-type coverage, 27 profile candidates, 20 claim candidates, and 12 timeline candidates.
- Source/routing audit passed with 36/36 source spans matched, 0 missing source refs, 0 unsafe visual-asset routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions.
- Source-span pack records 17 human-owned guarded elements.
- Validator fixture matrix remained passing with 7/7 fixture expectations.
- Manifest validation, MkDocs strict, Playwright browser smoke, and git diff whitespace checks passed during triage.

## Preserved Boundaries

Do not add model/API extraction behavior, publishing, AI video generation, database persistence, production sync, upload credentials, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive

The local review state is not final canon. Claims, profiles, timeline entries, extraction elements, adapter confidence, validator results, and source-span pack summaries may guide review, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, do not ask the user to reply with fixed phrases such as `accept`, `reject`, or `small_adjustment`.

Use a Review Card that names the target artifact or section, gives up to three things to inspect, states that freeform review is allowed, gives examples of natural feedback, explains how the agent will interpret and continue, and gives a completion signal.

When review is useful but not required to continue, record it as Review Debt instead of stopping. Any user freeform review is the source of truth.

## Next Useful Entrances

| Entrance | Why it helps | What becomes possible |
|---|---|---|
| Review: source-span pack | Confirms whether spans and routing are useful, not merely valid | A freeform review can name concrete span/routing changes |
| Refine: targeted fixture output | Fixes a specific weak span, vague extraction, or ambiguous route | The deterministic adapter matrix becomes stronger without widening scope |
| Expand: one missing fixture class | Covers a new memo shape such as broad spans, contradictory notes, or sparse bullets | Future adapter/model work gets clearer regression coverage |
| Design: model/API adapter boundary | Uses the same validator, review-held defaults, source refs, and human-owned boundaries | Model/API work can start later without changing canon or persistence authority |

## Residual Work

### Source-Span And Routing Quality Review

- Purpose: Decide whether the fixture matrix catches the source and routing problems that matter before model/API work.
- Effect: Keeps future generated candidates reviewable and source-tracked.
- Requirements: Must stay local-only, zero external services, source-tracked, validator-gated, review-held by default, and non-canon-producing.
- State: Ready for freeform review through `fff-source-span-routing-review-pack-001`.
- Owner: Product/AI implementer for fixtures and validator shape; human author for final story authority.
- Next move: Revise only the span/routing issues or fixture classes identified by review.

### Model/API Adapter Boundary

- Purpose: Prepare a future extractor behind the reviewed local contract.
- Effect: Allows model/API output to be validated before it touches Profile/Ghost Flow, Claim Ledger, or Timeline View.
- Requirements: No credentials or external calls until explicitly authorized; must preserve `validate-extraction`, fixture matrix, review-held defaults, source refs, freeform review, and human-owned decisions.
- State: Not started in the active slice.
- Owner: Product/AI implementer.
- Next move: Draft a boundary spec or local mock only after source-span review no longer needs deterministic fixture changes.

## Resume Prompt

Use this prompt in a new terminal if you want the next agent to continue directly:

```text
Continue in C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory. Pull with git pull --ff-only, then read AGENTS.md, docs/project-context.md, docs/review/current-status.md, docs/review/next-terminal-handoff.md, artifacts/artifact-manifest.json, docs/review/source-span-routing-review-pack.md, docs/review/model-api-boundary-spec.md, docs/review/local-extraction-adapter-expansion-review.md, docs/review/local-extraction-adapter-review.md, docs/review/extraction-validator-hardening-review.md, docs/data-model.md, docs/idea-ledger.md, and docs/decision-log.md first. Preserve the local-first Visual Review Hub, fff-model-api-boundary-spec-001, fff-local-extraction-adapter-expansion-001, fff-local-extraction-adapter-spike-001, fff-extraction-contract-001, fff-extraction-validator-hardening-001, Claim Ledger, Timeline View, Profile/Ghost Flow, freeform review intake, and human-owned canon boundaries. The active artifact is fff-source-span-routing-review-pack-001. Do not add model/API behavior, publishing, AI video generation, database persistence, production sync, credentials, or final canon decisions unless explicitly requested. Start by running the state, adapter, source-span pack, fixture, manifest, MkDocs, and git diff checks from docs/review/next-terminal-handoff.md. The next product move is freeform review of source-span/routing quality, then only targeted fixture/span/routing changes if review identifies a concrete gap.
```
