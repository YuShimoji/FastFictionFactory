# Designer Candidate Dashboard

## Purpose

`fff-designer-candidate-dashboard-001` adds a local Designer Dashboard to the Review Hub so one story can be reviewed as a production-planning candidate without external calls or final canon decisions.

The dashboard is for content strategy review: story runway, content candidates, draft spine beats, channel strategy proposals, and unresolved risks.

## What Was Implemented

- Added a `Designer Dashboard` mode to `public/review/index.html`.
- Added local data structures for content candidate cards, channel strategy proposals, draft spine beats, designer review risks, and readiness summary.
- Added export/import readback for `designerDashboard` while preserving existing project state compatibility.
- Added `artifacts/designer-candidate-dashboard-result.json`.
- Added `node tools/fff-state.mjs smoke-designer-candidate-dashboard ...`.

## How To Open

From the repo root:

```powershell
Invoke-Item .\public\review\index.html
```

Mode-specific route:

```text
public/review/index.html?mode=designer
```

## What To Review

- Whether the one-story runway is understandable from the raw memo cue and selected local candidate groups.
- Whether the three content candidates are useful for 1-minute, 3-minute, and 10-minute / series review.
- Whether the channel strategy proposals fit the current material without overcommitting the project.
- Whether the draft spine is sufficient for a later one-story draft review pack.
- Whether risk flags correctly keep canon, source, rights, production, and provider boundaries visible.

## Preserved Boundaries

- No external call.
- No provider configuration.
- No credential handling.
- No public upload.
- No AI video generation.
- No production render.
- No final canon decision.
- Toma fate, brass moth truth, and Council motive remain human-owned and held.
- Visual and thumbnail directions are text-only placeholders with rights still unknown.

## Validation Commands

```powershell
node --check .\tools\fff-state.mjs
node .\tools\fff-state.mjs smoke-designer-candidate-dashboard .\artifacts\designer-candidate-dashboard-result.json .\artifacts\designer-candidate-dashboard-result.json
node .\tools\fff-state.mjs smoke-contradictory-claim-guard .\artifacts\extraction-validator-smoke-result.json .\artifacts\contradictory-claim-guard-result.json
git diff --check
```

If docs dependencies are available:

```powershell
python -m mkdocs build --strict
```

## Known Limitations

- The dashboard uses local deterministic sample material only.
- It does not produce final prose.
- It does not decide channel positioning.
- It does not create release-ready thumbnails, visuals, video assets, or upload metadata.
- Broader one-story draft review remains a next slice.

## Next Recommended Slice

Build a one-story Draft Review Pack from this dashboard after the reviewer confirms which content candidate and channel strategy should drive the first draft pass.
