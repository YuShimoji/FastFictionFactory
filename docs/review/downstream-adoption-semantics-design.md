# Downstream Adoption Semantics Design

Artifact id: `fff-downstream-adoption-semantics-design-001`

This readback defines downstream adoption semantics for the held claim identified by `fff-held-claim-adoption-preflight-001`. It is design-only. It does not adopt the claim, canonize the claim, mutate Profile / Claim / Timeline / Story Seed state, call a provider, touch credentials, or open production work.

## Design Boundary

- Input readback: `artifacts/held-claim-adoption-preflight-result.json`
- Result: `artifacts/downstream-adoption-semantics-design-result.json`
- Candidate: `multi-claim-moth-key-label`
- Source span: `multi-x-object-brass-moth-key`
- Translated fixture row: `translated-min-row-moth-key-label`
- Smoke command: `node tools/fff-state.mjs smoke-downstream-adoption-semantics-design artifacts/held-claim-adoption-preflight-result.json artifacts/downstream-adoption-semantics-design-result.json`

## Status Semantics

| Status | Current slice meaning |
| --- | --- |
| `hold` | Current source review state. The claim remains reversible, human-owned, and not accepted. |
| `adoption_candidate` | Readback-only semantic label for a source-backed held claim that passed preflight. |
| `ready_for_human_adoption_review` | Future queue state only; not emitted or persisted now. |
| `human_accepted_downstream_adoption` | Future accepted status after explicit human approval; unreachable in this slice. |
| `rejected_for_adoption` | Future terminal non-adoption state; not emitted now. |
| `rolled_back_to_hold` | Future recovery state when adoption preconditions regress; not emitted now. |

The only current-slice transition is `hold -> adoption_candidate`, and it is a non-mutating semantic overlay. Every transition toward `ready_for_human_adoption_review`, `human_accepted_downstream_adoption`, `rejected_for_adoption`, or `rolled_back_to_hold` is defined for future work but blocked now.

## Accepted Status

`human_accepted_downstream_adoption` is defined as the future accepted status. It is not reachable in this slice. Future use requires explicit human approval for the candidate, target-class selection, source refs and original source-span readback, contradiction / malformed-span / downstream-gate / provider-boundary checks passing, and a rollback condition recorded before mutation.

## Rollback Conditions

- Source-span text or locator no longer matches the original author memo.
- Claim source refs stop proving `author_memo` trust.
- Claim `reviewStatus` changes away from `hold` before human acceptance.
- Translation/gloss leakage count becomes non-zero.
- Contradictory claim guard reports adopted/provisional conflict leakage.
- Downstream source-span adoption gate reports adopted Profile / Claim / Timeline candidates before authorization.
- Profile, Claim, Timeline, or Story Seed mutation is detected in a design-only slice.
- Provider configuration, external API call, endpoint, credential, or secret usage is detected.
- Human-owned unresolved dependencies are resolved by automation instead of the author.
- Future accepted-status record lacks target ids, source refs, rollback reason, or reviewer authority.

## Forbidden Mutation Boundaries

| Target | Current slice mutation |
| --- | --- |
| Profile | forbidden |
| Claim | forbidden |
| Timeline | forbidden |
| Story Seed | forbidden |

The candidate target ids are read-only evidence. This design does not write `multi-profile-brass-moth-key`, `multi-claim-moth-key-label`, `multi-timeline-moth-key-label`, project state, provider output, credentials, or production surfaces.

## Candidate Holding

`multi-claim-moth-key-label` remains held, source-backed, `not_adopted`, and `canon_status=false`. The unresolved dependencies remain human-owned: brass moth truth and Toma fate. The target classes `profile`, `claim`, and `timeline` are visible only as future adoption targets.

## Expected Readback

- preflight candidates inspected: `1`
- candidate semantics defined: `1`
- accepted status defined: `1`
- accepted status reachable now: `0`
- current-slice readback-only transitions: `1`
- mutation targets blocked: `4`
- actual profile / claim / timeline / story seed mutations: `0 / 0 / 0 / 0`
- actually adopted claims: `0`
- canonized claims: `0`
- provider configured / external call attempted / credentials touched: `false / false / false`

## What It Proves

The held preflight claim now has explicit adoption vocabulary, accepted-status semantics, rollback conditions, and mutation boundaries. This gives a future adoption implementation a clear contract without silently adopting the claim now.

## What It Does Not Prove

This design does not accept the claim, write canon, update Profile / Claim / Timeline / Story Seed state, choose the brass moth key function, resolve Toma fate, resolve brass moth truth, choose a provider, use credentials, call an external API, publish, sync production state, or prepare release output.
