# Ambiguous Routing Resolution

Artifact: `fff-ambiguous-routing-resolution-001`

## Purpose

This slice resolves the 7 ambiguous routing rows detected by `fff-source-span-quality-audit-001`. It does not ask for a general Review Hub review, does not start model/API work, and does not promote any generated candidate into canon.

The resolution turns audit findings into explicit route policy:

- Visual asset rows route through visual/profile review, with optional timeline context, and do not carry Claim Ledger target ids.
- Human-owned object rows route first to Profile/Ghost; Claim and Timeline stay secondary evidence surfaces.
- Unresolved decision rows route first to Human Review; Claim or Timeline can preserve context, but cannot become adoption surfaces.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-source-span-quality-audit-001` |
| Axis | `ambiguous_routing_resolution` |
| Prior review count | `0` |
| Prior signal | The quality audit found 7 ambiguous routing rows but did not record user acceptance of final routing policy. |
| What changed | The 7 rows now have primary destination rules, secondary route roles, hold reasons, and regression checks. |
| Not asking | No general Review Hub review, no repeat source-span quality review, no model/API approval, no production approval, no canon decision. |
| Next non-redundant axis | One missing fixture class or a validator hardening case for route policy drift. |

No Review Card is emitted by this slice. Review Debt is recorded because routing policy can be fixed locally without user input.

## Resolution Matrix

Machine-readable readback lives at `artifacts/ambiguous-routing-resolution-result.json`.

| Row | Primary resolution | Secondary routes | Guard condition |
| --- | --- | --- | --- |
| `local-x-object-brass-moth` | `route_to_profile_candidate` | Claim, Timeline, Human Review | Hold; keep `brass moth truth` unresolved; keep unresolved-decision route. |
| `local-x-visual-observatory` | `route_to_visual_asset` | Profile, Timeline | Hold; remove Claim target; keep visual route as review evidence, not release art. |
| `local-x-unresolved-council-motive` | `hold_for_human_decision` | Claim, Timeline | Hold; keep `Council motive` unresolved; keep human review source ref. |
| `minutes-x-object-brass-moth` | `route_to_profile_candidate` | Claim, Timeline, Human Review | Hold; keep `brass moth truth` unresolved; do not decide proof, bait, or false record. |
| `minutes-x-unresolved-council-motive` | `hold_for_human_decision` | Claim | Hold; keep `Council motive` unresolved; keep human review source ref. |
| `edge-x-object-brass-moth-key` | `route_to_profile_candidate` | Claim, Timeline, Human Review | Hold; keep `brass moth truth` unresolved; do not infer key function. |
| `edge-x-unresolved-toma-fate` | `hold_for_human_decision` | Timeline | Hold; keep `Toma fate` unresolved; keep human review source ref. |

## Adapter Rule Applied

The deterministic adapter now keeps `local-x-visual-observatory` out of direct Claim Ledger routing:

- `targetDestinations`: `profile`, `timeline`
- `targetClaimIds`: empty
- Review pack routes: `Profile`, `Timeline`, `Visual`

This aligns the sample visual row with the other visual rows:

- `minutes-x-visual-moth-warning`
- `edge-x-visual-bellless-tower`

## Regression Checks

The resolution artifact records these checks as passing:

| Check | Result |
| --- | --- |
| 7 ambiguous rows loaded | passed |
| All 7 rows resolved | passed |
| All visual assets avoid Claim target ids | passed |
| Unresolved-decision rows keep human review source refs and `hold` defaults | passed |
| Human-owned object rows keep Profile primary route and `hold` defaults | passed |
| Source-reference ambiguous rows classified | 0 present, passed |
| Reject/ignore ambiguous rows classified | 0 present, passed |
| Source-span review pack passed | passed |

## Route Policy

| Case | Policy | Why it matters |
| --- | --- | --- |
| Visual asset | Route to visual/profile review and optional timeline context; no Claim target ids. | Keeps visual evidence from becoming a claim by accident. |
| Human-owned object | Route first to Profile/Ghost; Claim and Timeline are secondary evidence while unresolved truth stays held. | Keeps brass moth meaning visible without deciding it. |
| Unresolved decision | Route first to Human Review; Claim or Timeline can preserve context only. | Keeps Toma fate and Council motive out of automated adoption. |
| Source reference | No ambiguous source-reference rows in this slice. | Source refs remain support evidence, not routed candidates. |
| Reject or ignore | No ambiguous rows are rejected or hidden. | Evidence remains visible for future review. |

## Review Debt

| Debt | Current state | Next move |
| --- | --- | --- |
| Fixture coverage | Current three fixtures cover ambiguous object, visual, and unresolved-decision routing, but not malformed route drift. | Add one negative or edge fixture if route drift appears again. |
| Validator hardening | The active manifest now checks resolution policy; `tools/fff-state.mjs` still keeps only broad extraction safety rules. | Add validator-level route policy only if a future adapter can violate these rules outside the current fixtures. |
| Claim/Timeline secondary roles | Claim and Timeline remain secondary evidence for 5 and 6 rows respectively. | Split a row only if review or a fixture shows the secondary route causes confusion. |

## Validation Contract

This slice is complete when:

- `artifacts/ambiguous-routing-resolution-result.json` parses and passes.
- The result contains exactly 7 resolved ambiguous rows.
- The local visual asset row has no Claim target.
- Adapter matrix and source-span review pack regenerate cleanly.
- The active manifest validation command passes.
- MkDocs strict build and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-source-span-quality-audit-001`, `fff-review-memory-dedup-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, `fff-local-extraction-adapter-expansion-001`, `fff-local-extraction-adapter-spike-001`, `fff-extraction-validator-hardening-001`, `fff-extraction-contract-001`, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated general review request, or final canon decision is added by this slice.
