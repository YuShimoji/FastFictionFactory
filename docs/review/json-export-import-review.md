# JSON Export Import Review

## Active Artifact

- Artifact id: `fff-mvp-export-import-001`
- Review UI: `public/review/index.html`
- Sample state: `artifacts/sample-project-state.json`
- Smoke result: `artifacts/export-import-smoke-result.json`
- Open command: `Invoke-Item .\public\review\index.html`

## What Was Implemented

- Added readable JSON export for the current local project state.
- Added pasted JSON import with schema validation and safe failure messages.
- Added a built-in sample state loader for smoke testing.
- Added visible unresolved creative decisions separate from accepted canon, provisional candidates, held candidates, rejected candidates, viewer-facing information, and production-only notes.
- Kept the implementation local-only with no external services, credentials, publishing, automated YouTube upload, or AI video generation.

## State Shape Summary

The portable state envelope uses `schemaVersion: "fff.projectState.v1"` and includes:

- `project`
- `work`
- `rawMemo`
- `extractedCandidates`
- `reviewStatuses`
- `reviewStatusBuckets`
- `unresolvedCreativeDecisions`
- `taskCards`
- `qaGateResults`
- `generatedOutlines`
- `decisionLog`
- `metadata`

Unknown imported top-level fields are preserved under `metadata.importedUnknownFields` on the next export.

## Import Export Behavior

- Export includes all currently visible review statuses and the decision log.
- Export writes formatted JSON into the preview box and starts a browser download named `fast-fiction-factory-project-state-v1.json` when supported.
- Import validates pasted JSON syntax and schema version before changing local state.
- Import restores memo, candidate collections, review statuses, unresolved decisions, task cards, QA gates, outlines, and decision log.
- Missing optional candidate collections fall back to deterministic local generation from the memo.

## Validation Behavior

- Invalid JSON shows a visible error and leaves current state unchanged.
- Wrong `schemaVersion` shows a visible error and leaves current state unchanged.
- Optional missing fields are filled from the current deterministic mock model.
- Unknown top-level fields are preserved in metadata rather than silently discarded.

## Known Limitations

- Export/import is browser-local and has no durable project database.
- Imported candidate records are trusted as local review data, not as verified canon.
- There is no file picker import; the MVP uses pasted JSON for reliable static-page operation.
- The download filename is stable, but browser download handling may vary.

## Next Recommended Slice

Add a small local persistence adapter that writes and reads project state from a repo-local JSON file through an explicit user action, while keeping external services, publishing, credentials, and canon promotion out of scope.
