# Timeline View Review

## Active Artifact

- Artifact id: `fff-timeline-view-001`
- Review UI: `public/review/index.html`
- Smoke result: `artifacts/timeline-smoke-result.json`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`

## What Was Implemented

- Added a Timeline View section inside the existing Visual Review Hub page.
- Added five-axis timeline separation: story order, calendar time, viewer disclosure order, production order, and historical/reference order.
- Seeded conservative timeline entries from the existing memo, Claim Ledger claims, and unresolved creative decisions.
- Added grouping by timeline axis, review status, viewer disclosure status, unresolved dependency, canon risk, linked claim, and calendar precision.
- Added filters for all entries, unresolved dependencies, hidden viewer disclosure, spoiler protection, high canon risk, adopted, provisional, held, and rejected entries.
- Added timeline search, status counts, unresolved-dependency labels, viewer-disclosure labels, spoiler labels, canon-risk labels, and linked claim references.
- Reused the existing adopt, provisional, hold, and reject controls so timeline decisions update the same decision log and exported state.

## Timeline Shape

Each timeline entry supports `id`, `title`, `summary`, `timelineAxis`, `storyOrder`, `calendarTime`, `calendarPrecision`, `viewerDisclosureOrder`, `viewerDisclosureStatus`, `productionOrder`, `historicalReferenceTime`, `linkedClaimIds`, `linkedProfileIds`, `linkedWorkIds`, `unresolvedDependencies`, `spoilerLevel`, `canonRisk`, `reviewStatus`, `sourceRefs`, and `notes`.

## Human-Owned Dependencies

The timeline keeps these as unresolved dependencies instead of canon:

- Toma fate
- brass moth truth
- Council motive

## Persistence Behavior

- Timeline records export under `extractedCandidates.timelineCandidates`.
- Timeline review decisions export under `reviewStatuses`.
- Timeline decisions survive import and current-state normalization.
- Older imported timeline arrays are merged with the seeded Timeline View fields when practical.

## Claim Ledger Linkage

- Timeline entries carry `linkedClaimIds`.
- Claim-linked grouping shows sequence records by supporting or dependent claim.
- Timeline entries do not overwrite Claim Ledger truth status, canon risk, or human-owned dependencies.

## Known Limitations

- The timeline is deterministic mock data, not a real extraction engine.
- There is no complete canonical chronology.
- There is no canonical database.
- There is no multi-user backend or production sync.
- There is no YouTube publishing, automated upload, or AI video generation.
- Timeline adoption is a local review state, not a final human canon decision.

## Next Recommended Slice

Build the Profile page and ghost node flow so characters, objects, unresolved entities, Claim Ledger claims, and Timeline entries can be inspected together without finalizing human-owned story truth.
