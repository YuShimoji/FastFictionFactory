# Claim Ledger Review

## Active Artifact

- Artifact id: `fff-claim-ledger-001`
- Review UI: `public/review/index.html`
- Smoke result: `artifacts/claim-ledger-smoke-result.json`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`

## What Was Implemented

- Added a Claim Ledger section inside the existing Visual Review Hub page.
- Seeded conservative claim candidates from the sample memo.
- Added grouping by claim scope, world truth status, reality/reference status, canon risk, unresolved dependency, review status, and source.
- Added claim filters for all claims, unresolved dependencies, high canon risk, unverified reality status, hidden viewer disclosure, and review status.
- Added claim search, status counts, canon-risk labels, unresolved-dependency labels, viewer-disclosure labels, and spoiler-level labels.
- Reused the existing adopt, provisional, hold, and reject controls so claim decisions update the same decision log and export/import state.

## Claim Shape

Each claim supports `id`, `claimText`, `claimScope`, `worldTruthStatus`, `realityStatus`, `sourceRefs`, `subjectRefs`, `speakerOrNarratorRef`, `viewerDisclosureStatus`, `spoilerLevel`, `canonRisk`, `unresolvedDependencies`, `supportsClaimIds`, `contradictsClaimIds`, `reviewStatus`, and `notes`.

## Human-Owned Dependencies

The ledger keeps these as unresolved dependencies instead of canon:

- Toma fate
- brass moth truth
- Council motive

## Persistence Behavior

- Claim records export under `extractedCandidates.claims`.
- Claim review decisions export under `reviewStatuses`.
- Claim decisions survive import and current-state normalization.
- Older imported claim arrays are merged with the seeded Claim Ledger fields when practical.

## Known Limitations

- The ledger is deterministic mock data, not a real extraction engine.
- There is no canonical database.
- There is no multi-user backend or production sync.
- There is no YouTube publishing, automated upload, or AI video generation.
- Claim adoption is a local review state, not a final human canon decision.

## Next Recommended Slice

Build the Timeline view so story order, calendar time, historical references, and production order can be reviewed separately.
