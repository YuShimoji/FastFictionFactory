# Review Ergonomics Review

## Active Artifact

- Artifact id: `fff-local-persistence-ergonomics-001`
- Review UI: `public/review/index.html`
- Smoke result: `artifacts/review-ergonomics-smoke-result.json`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`

## What Was Implemented

- Added candidate status filters for all, unresolved, adopted, provisional, held, and rejected items.
- Added a candidate search box.
- Added collapse all candidate groups and expand all candidate groups controls.
- Added decision log jump links.
- Kept visible status counts in the hub and candidate review surface.
- Kept unresolved creative decisions visible as separate human-owned review items.

## Review Flow

1. Open `public/review/index.html`.
2. Use the top Visual Review Hub to confirm the active artifact and current status.
3. Use status filters to narrow candidate cards before reviewing.
4. Use search to find a person, object, claim, timeline cue, or unresolved decision.
5. Collapse all candidate groups when scanning only hub status, QA gates, or decision log.
6. Expand all candidate groups before a full candidate pass.

## Product Truth Preserved

- Filters change visibility only; they do not change review status.
- Collapse/expand changes only page presentation.
- Adopt/provisional/hold/reject remains a review state, not a final canon engine.
- Toma fate, brass moth truth, and Council motive remain unresolved human-owned decisions.

## Validation

- Browser smoke confirmed the active artifact id and Visual Review Hub remain visible.
- Save/load and fallback controls remain visible.
- Status filters reduce visible candidate items and update the filter summary.
- Search reduces visible candidate items and update the filter summary.
- Collapse and expand controls affect candidate groups without removing data.
- Status counts remain internally consistent after review changes and import.

## Known Limitations

- There is no category dropdown yet.
- There is no dedicated Claim Ledger yet.
- There is no timeline visualization yet.
- The UI still uses deterministic mock extraction data.

## Next Recommended Slice

Build the Claim Ledger as the next reviewable screen, using the same local state envelope and review statuses.
