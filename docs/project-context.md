# Project Context

## Current Axis

Fast Fiction Factory is a local-first fiction production workbench. The current artifact is `fff-claim-ledger-001`, served as a static local review UI at `public/review/index.html`.

## Current Lane

Keep the MVP reviewable without production commitments. The current lane is a Claim Ledger review surface for source, truth status, reality/reference status, canon risk, unresolved dependencies, viewer disclosure, spoiler protection, grouping, filtering, and local review decisions.

## Current Slice

The active slice is complete enough for local review:

- Review UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- State adapter: `tools/fff-state.mjs`
- Current state: `artifacts/current-project-state.json`
- Sample state: `artifacts/sample-project-state.json`
- Claim Ledger smoke evidence: `artifacts/claim-ledger-smoke-result.json`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`

## Verification Snapshot

Last verified on 2026-06-15:

```powershell
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json
node .\tools\fff-state.mjs summarize .\artifacts\current-project-state.json
```

Result summary:

- Both state JSON files validate with `schemaVersion: "fff.projectState.v1"`.
- Current state contains 9 Claim Ledger claims.
- Claim summary: 5 high canon risk claims, 5 claims with unresolved dependencies, 1 unverified reality status claim, and 4 hidden or spoiler-protected claims.
- The Claim Ledger manifest validation command passes.

## Boundaries

Do not treat local review state as final canon. Do not add publishing, upload credentials, AI video generation, production sync, database persistence, or final decisions for Toma, the brass moth, or the Council unless explicitly requested.

## Restart Path

Open the review UI from the repo root:

```powershell
Invoke-Item .\public\review\index.html
```

Run the state adapter:

```powershell
node .\tools\fff-state.mjs summarize .\artifacts\current-project-state.json
```

First next move: add the Timeline view as a separate reviewable slice.
