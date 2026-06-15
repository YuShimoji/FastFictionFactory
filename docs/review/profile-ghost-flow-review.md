# Profile/Ghost Flow Review

## What Was Implemented

`fff-profile-ghost-flow-001` adds a local-first Profile/Ghost Flow to `public/review/index.html` while keeping the Visual Review Hub as the single local entry point.

The slice adds:

- Profile/Ghost section with grouping, search, type selector, and status filters.
- Profile cards for people, places, organizations, events, objects, concepts, documents, visual assets, and placeholders.
- Ghost node statuses for extracted candidates, provisional profiles, adopted profiles, held ghosts, rejected candidates, and nodes needing human decision.
- Links from profiles to Claim Ledger claims and Timeline View entries.
- Dependency labels for Toma fate, brass moth truth, and Council motive.
- Known-by, unknown-by, believed-by, misunderstood-by, owned-item, source, asset, canon-risk, and spoiler labels.
- A reversible `Promote ghost to provisional profile` control that updates local review state and the decision log without adopting final canon.
- Profile validation and summary support in `tools/fff-state.mjs`.

## Preserved Product Truth

The implementation does not decide whether Toma is alive, dead, erased, transformed, or deliberately unknown. It does not decide whether the brass moth is a spy, key, memory container, or something else. It does not decide whether the Council is villainous, desperate, divided, or misled.

Profile/Ghost records are review scaffolding. They make weak or uncertain graph nodes visible so the author can choose later without the tool silently turning extraction output into canon.

## Validation Notes

The current and sample state JSON now include 11 profiles:

- 2 people
- 1 place
- 1 organization
- 1 event
- 1 object
- 1 concept
- 1 document
- 1 visual asset
- 2 placeholders

The state adapter validates that all required profile types and all required ghost node statuses are present. The adapter summary also reports dependency-bound profiles, high-risk profiles, spoiler-protected profiles, and links to claims/timeline entries.

Browser smoke covered rendering, grouping, type filtering, ghost-only filtering, unresolved/high-risk/spoiler filters, reversible ghost promotion, decision log update, export/import roundtrip, invalid JSON safety, Claim Ledger continuity, and Timeline View continuity.

## Known Limitations

- Profile extraction is still deterministic mock data.
- Profile/Ghost links are local review IDs, not database graph edges.
- Asset references remain placeholders and carry no release rights.
- Ghost promotion is a local provisional review action, not final canon.
- No model/API behavior, remote sync, YouTube adapter, AI video generation, or durable database persistence was added.

## Next Recommended Slice

Define the extraction contract against the reviewed state shape. The useful next artifact is a local schema/adapter contract that states how generated candidates must carry source refs, unresolved dependencies, review-safe defaults, and human-owned authority boundaries before any model/API dependency is introduced.
