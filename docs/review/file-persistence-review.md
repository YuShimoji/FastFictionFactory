# File Persistence Review

## Active Artifact

- Artifact id: `fff-local-persistence-ergonomics-001`
- Review UI: `public/review/index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Smoke result: `artifacts/file-persistence-smoke-result.json`

## What Was Implemented

- Added explicit Save state to local file and Load state from local file controls.
- Added Download JSON fallback and Upload JSON fallback controls.
- Kept pasted JSON import for invalid JSON and schema checks.
- Added browser support messaging for direct file access.
- Added `tools/fff-state.mjs` with `validate`, `summarize`, and `normalize` commands.
- Added normalized current state at `artifacts/current-project-state.json`.

## How Save And Load Work

- Direct save/load uses the browser File System Access API where available.
- Unsupported browsers fall back to explicit JSON download/upload.
- The UI never silently overwrites a file; direct save asks the browser to show a save picker.
- Invalid JSON shows an error and leaves the current state unchanged.
- Unknown imported top-level fields are preserved under `metadata.importedUnknownFields` on the next export.

## Repo-Local Commands

```powershell
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs summarize .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs normalize .\artifacts\sample-project-state.json .\artifacts\current-project-state.json
```

## Known Browser Limits

- Direct file save/load is browser-dependent.
- Static file pages and local preview pages cannot write repo files automatically.
- Download location remains controlled by the browser.
- File picker prompts are user-mediated and cannot be bypassed by this MVP.

## Product Truth Preserved

- No database persistence was added.
- No remote sync or production sync was added.
- No YouTube publishing or automated upload was added.
- No AI video generation was added.
- Unresolved story choices remain human-owned and are not promoted to canon.

## Validation

- Sample and current state JSON parse and validate.
- Node adapter validates, summarizes, and normalizes project state.
- Browser fallback export/import round trip restores review statuses, unresolved decisions, and decision log.
- Invalid JSON is safe.
- Unknown fields are preserved where practical.

## Next Recommended Slice

Build the Claim Ledger view so extracted claim candidates can be reviewed by source, truth status, and canon risk without finalizing human-owned story truth.
