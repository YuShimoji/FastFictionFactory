# Project Context

## Current Axis

Fast Fiction Factory is a local-first fiction production workbench. The current artifact is `fff-extraction-validator-hardening-001`, served through the static local Visual Review Hub at `public/review/index.html`.

## Current Lane

Keep the MVP reviewable without production commitments. The current lane is Extraction Contract validator hardening: source refs, candidate routing, review-safe defaults, warnings, and human authority boundaries must be checked locally before any adapter or model/API extractor exists.

## Current Slice

The active slice is complete enough for local review:

- Review UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
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
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Local docs view: `mkdocs.yml`
- Project overview map: `docs/project-overview.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`

## Verification Snapshot

Last verified on 2026-06-19:

```powershell
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\sample-extraction-payload.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\extraction-negative-fixtures\valid-minimal.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\extraction-negative-fixtures\unknown-fields-preservation.json
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
node .\tools\fff-state.mjs smoke-extraction-fixtures .\artifacts\extraction-negative-fixtures .\artifacts\extraction-validator-smoke-result.json
node .\tools\fff-state.mjs summarize .\artifacts\current-project-state.json
```

Result summary:

- Both state JSON files validate with `schemaVersion: "fff.projectState.v1"`.
- The sample extraction payload validates as `schemaVersion: "fff.extractionContract.v1"`.
- The validator fixture matrix passes: 2 expected-valid fixtures, 5 expected-invalid fixtures, and 5 built-in mutation guards.
- The validator catches missing source refs, missing extraction identity fields, invalid element types, unsafe human-owned decision adoption, direct visual asset routing to Claim Ledger, auto-canon/default-review leaks, missing human authority boundaries, and missing high-risk warnings.
- Unknown top-level extraction fields are reported as preservation warnings for JSON review instead of being silently dropped.
- Current state contains 1 Extraction Contract run, 12 extraction elements, 11 Profile/Ghost records, 9 Claim Ledger claims, and 8 Timeline View entries.
- Extraction Contract summary covers all required element types, 6 high-canon-risk extraction elements, 3 human-owned unresolved dependencies, 5 warnings, and candidate routing into Profile/Ghost, Claim Ledger, and Timeline View.
- Profile/Ghost summary covers all required profile types, all required ghost node statuses, 7 high canon risk profiles, 7 dependency-bound profiles, and 11 profiles linked to both claims and timeline entries.
- Claim summary: 5 high canon risk claims, 5 claims with unresolved dependencies, 1 unverified reality status claim, and 4 hidden or spoiler-protected claims.
- Timeline summary reports all five timeline axes, 4 high canon risk entries, 4 dependency-bound entries, and 8 entries linked to claims.
- The active manifest validation command passes.

## Boundaries

Do not treat local review state as final canon. Do not add publishing, upload credentials, AI video generation, production sync, database persistence, or final decisions for Toma, the brass moth, or the Council unless explicitly requested.

## Restart Path

Open the review UI from the repo root:

```powershell
Invoke-Item .\public\review\index.html
```

Or use the dependency-free launcher:

```powershell
.\scripts\operator\open_review.ps1
```

Open the local Markdown docs view from the repo root:

```powershell
python -m pip install mkdocs-material
python -m mkdocs serve -a 127.0.0.1:8000
```

If port `8000` is already in use, use a neighboring local port such as `8001`.

Run the state adapter:

```powershell
node .\tools\fff-state.mjs summarize .\artifacts\current-project-state.json
node .\tools\fff-state.mjs smoke-extraction-fixtures .\artifacts\extraction-negative-fixtures .\artifacts\extraction-validator-smoke-result.json
```

First next move: build a local-only extraction adapter spike that emits the reviewed contract shape from deterministic input, then run that output through the validator before adding model/API behavior.

## Handoff Path

For another terminal, start with `docs/review/next-terminal-handoff.md` after pulling latest remote state. It preserves the active artifact, validation commands, human-owned boundaries, freeform review intake contract, and the next viable entrances without relying on previous chat context.
