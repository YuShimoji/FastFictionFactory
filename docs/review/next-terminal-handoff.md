# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

Latest handoff refresh: 2026-06-22. At refresh time, the active artifact is `fff-review-memory-dedup-001`; the preserved review procedure artifact is `fff-review-procedure-lock-001`; the preserved Review Hub IA artifact is `fff-review-hub-ia-mode-split-001`; the preserved source-span artifact is `fff-source-span-routing-review-pack-001`; the preserved model/API boundary artifact is `fff-model-api-boundary-spec-001`; the preserved adapter expansion artifact is `fff-local-extraction-adapter-expansion-001`; the preserved adapter artifact is `fff-local-extraction-adapter-spike-001`; the preserved validator artifact is `fff-extraction-validator-hardening-001`; and the preserved contract artifact is `fff-extraction-contract-001`.

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
docs/review/review-memory-dedup.md
docs/review/review-procedure.md
docs/review/review-hub-ia-mode-split.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
docs/review/source-span-routing-review-pack.md
docs/review/model-api-boundary-spec.md
docs/review/local-extraction-adapter-expansion-review.md
docs/review/extraction-validator-hardening-review.md
docs/idea-ledger.md
docs/decision-log.md
```

4. Open the active local review artifact:

```powershell
.\scripts\operator\open_review.ps1
```

or:

```sh
./scripts/operator/open_review.sh
```

5. Re-run local checks before changing behavior:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
uvx --from mkdocs-material mkdocs build --strict
git diff --check
```

If `uvx` is unavailable, use a real Python/MkDocs Material runtime instead of the default WindowsApps Python stub.

## Current Project State

- Active artifact: `fff-review-memory-dedup-001`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Active UI: `public/review/index.html`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Review memory / dedup smoke: `artifacts/review-memory-dedup-smoke-result.json`
- Review procedure: `docs/review/review-procedure.md`
- Manifest: `artifacts/artifact-manifest.json`
- Review procedure smoke: `artifacts/review-procedure-lock-smoke-result.json`
- Current screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Mode screenshots:
  - `artifacts/review-screens/story-review.png`
  - `artifacts/review-screens/source-audit.png`
  - `artifacts/review-screens/project-cockpit.png`
  - `artifacts/review-screens/artifacts-validation.png`

The active artifact adds review memory, Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card rules while keeping the review procedure lock, Review Hub four-mode split, source-span review pack, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and state validation intact.

## What Finished

- Kept `public/review/index.html` as the single local Visual Review Hub entry point.
- Updated the Review Hub active artifact id to `fff-review-memory-dedup-001`.
- Added `docs/review/review-memory-dedup.md`.
- Added `artifacts/review-memory-dedup-smoke-result.json`.
- Added manifest-level `review_memory` entries for `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, and `fff-source-span-routing-review-pack-001`.
- Documented Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card fields.
- Added `docs/review/review-procedure.md`.
- Added `artifacts/review-procedure-lock-smoke-result.json`.
- Added `scripts/operator/open_review.sh` while preserving `scripts/operator/open_review.ps1`.
- Added mode-specific screenshot paths and a four-mode contact sheet.
- Updated manifest, current status, artifact inventory, project context, overview docs, MkDocs nav, decision log, idea ledger, and this handoff.

## Preserved Boundaries

Do not add model/API extraction behavior, provider credentials, publishing, AI video generation, database persistence, production sync, upload credentials, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive

The local review state is not final canon. Claims, profiles, timeline entries, extraction elements, adapter confidence, validator results, and source-span pack summaries may guide review, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, accept natural freeform review text instead of fixed phrases.

Before emitting a Review Card, check the review memory. Do not ask the same target/evidence/axis again unless target, axis, evidence, decision value, or an explicit user request changed.

When review is useful but not required to continue, record it as Review Debt and keep moving through reversible scoped work. This slice intentionally does not require immediate user review.

## Next Useful Entrances

| Entrance | Why it helps | What becomes possible |
| --- | --- | --- |
| Verify: review memory | Confirms that prior signal, accepted scope, not-accepted scope, and next non-redundant axis are clear | Future Review Cards avoid repeated target/evidence/axis asks |
| Audit: source-span pack | Confirms whether spans and routing are useful, not merely valid | A freeform review can name concrete span/routing changes |
| Advance: one missing fixture class | Covers a new memo shape such as broad spans, contradictory notes, or sparse bullets | Future adapter/model work gets clearer regression coverage |
| Explore: model/API adapter boundary | Uses the same validator, review-held defaults, source refs, and human-owned boundaries | Model/API work can start later only after explicit authorization |

## Residual Work

### Review Procedure Quality

- Purpose: Decide whether the fixed procedure and screenshot map reduce future review friction.
- Effect: Makes review checkpoints portable across terminals and threads.
- Requirements: Must remain local-only, freeform-review friendly, and non-canon-producing.
- State: Ready for optional freeform review through `fff-review-procedure-lock-001`.
- Owner: Product implementer for access/procedure; human reviewer for usefulness.
- Next move: Adjust only the confusing procedure or screenshot path named by review.

### Source-Span And Routing Quality Review

- Purpose: Decide whether the fixture matrix catches the source and routing problems that matter before model/API work.
- Effect: Keeps future generated candidates reviewable and source-tracked.
- Requirements: Must stay local-only, zero external services, source-tracked, validator-gated, review-held by default, and non-canon-producing.
- State: Ready for freeform review through Source Audit mode and `fff-source-span-routing-review-pack-001`.
- Owner: Product/AI implementer for fixtures and validator shape; human author for final story authority.
- Next move: Revise only the span/routing issues or fixture classes identified by review.
