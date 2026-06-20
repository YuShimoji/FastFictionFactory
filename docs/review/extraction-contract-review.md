# Extraction Contract Review

## What Was Implemented

`fff-extraction-contract-001` extends the Visual Review Hub with a local Extraction Contract section. The contract is a reviewable adapter target for future generated candidates; it does not call a model/API and does not replace human canon authority.

The slice adds:

- Extraction run identity, source refs, generator label, extraction mode, confidence policy, warnings, review-safe defaults, and human authority boundaries.
- Required extraction element types: person, place, organization, event, object, concept, document, visual_asset, placeholder, source_reference, and unresolved_decision.
- Candidate routing links from extraction elements into Profile/Ghost Flow, Claim Ledger, Timeline View, source refs, and unresolved decision slots.
- Grouping by element type, suggested review status, unresolved dependency, canon risk, spoiler level, source ref, and target destination.
- Filters for unresolved, high-risk, placeholder, source-reference, profile-routed, claim-routed, timeline-routed, held, and rejected extraction candidates.
- Review controls that write to the existing local decision log.
- State JSON support through `extractionContracts` and the repo-local state validator summary.

## Preserved Product Truth

The contract keeps Toma fate, brass moth truth, and Council motive as human-owned unresolved dependencies. It can identify candidates that touch those decisions, but it must hold or route them for review instead of deciding story truth.

The implementation also keeps these boundaries visible:

- No model/API extraction behavior.
- No database persistence.
- No automated publishing, YouTube upload, or AI video generation.
- No automatic canon promotion.
- No fixed chronology promotion from timeline candidates.
- No release-ready visual assets.

## Validation Notes

The contract fixture contains 12 extraction elements and covers all required element types. The payload links to the current 11 Profile/Ghost candidates, 9 Claim Ledger claims, and 8 Timeline View entries.

The state adapter reports extraction contract summary fields: extraction run count, extracted element count, counts by element type, profile candidate count, claim candidate count, timeline candidate count, unresolved dependency count, high canon risk count, and warnings count.

Browser smoke should confirm:

- Visual Review Hub remains the single local entry point.
- Extraction Contract renders above Profile/Ghost Flow.
- Contract grouping, filtering, and search change the visible candidate set.
- A status change on an extraction candidate updates the decision log.
- Export/import preserves `extractionContracts`.
- Invalid JSON does not corrupt current state.
- Claim Ledger, Timeline View, and Profile/Ghost Flow still render.

## Known Limitations

- The contract is a deterministic local fixture, not a real extractor.
- Confidence values are illustrative review metadata.
- Source spans are local memo offsets and do not yet support multi-draft source maps.
- Profile, claim, and timeline links are local review IDs, not durable database graph edges.
- Freeform human review is documented as the intake contract, but user review interpretation remains agent-side until a later operator dashboard exists.

## Next Recommended Slice

Continue adapter work behind this same contract shape. Keep output schema-validated, source-tracked, review-held by default, and blocked from model/API or canon promotion until the local validator and fixture-matrix boundary pass.
