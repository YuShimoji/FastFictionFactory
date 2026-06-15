# Project Context

## Current Axis

Fast Fiction Factory is a local-first fiction production workbench. The current artifact is `fff-profile-ghost-flow-001`, served as a static local review UI at `public/review/index.html`.

## Current Lane

Keep the MVP reviewable without production commitments. The current lane is a Profile/Ghost Flow surface that links profile pages, ghost nodes, Claim Ledger claims, and Timeline View entries while preserving local persistence behavior.

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
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Local docs view: `mkdocs.yml`
- Project overview map: `docs/project-overview.md`

## Verification Snapshot

Last verified on 2026-06-15:

```powershell
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json
node .\tools\fff-state.mjs summarize .\artifacts\current-project-state.json
```

Result summary:

- Both state JSON files validate with `schemaVersion: "fff.projectState.v1"`.
- Current state contains 11 Profile/Ghost records, 9 Claim Ledger claims, and 8 Timeline View entries.
- Profile/Ghost summary covers all required profile types, all required ghost node statuses, 7 high canon risk profiles, 7 dependency-bound profiles, and 11 profiles linked to both claims and timeline entries.
- Claim summary: 5 high canon risk claims, 5 claims with unresolved dependencies, 1 unverified reality status claim, and 4 hidden or spoiler-protected claims.
- Timeline summary reports all five timeline axes, 4 high canon risk entries, 4 dependency-bound entries, and 8 entries linked to claims.
- The Profile/Ghost manifest validation command passes.

## Boundaries

Do not treat local review state as final canon. Do not add publishing, upload credentials, AI video generation, production sync, database persistence, or final decisions for Toma, the brass moth, or the Council unless explicitly requested.

## Restart Path

Open the review UI from the repo root:

```powershell
Invoke-Item .\public\review\index.html
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
```

First next move: define the real extraction contract without adding model/API behavior yet.
