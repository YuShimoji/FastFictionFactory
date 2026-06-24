# Very Broad Source-Span Shape Audit

Artifact: `fff-very-broad-source-span-shape-audit-001`

Current status: auxiliary audit readback under the active `fff-contradictory-claim-guard-001` surface. This slice does not add a new adapter fixture.

## Purpose

This audit checks whether the remaining very broad source-span shape candidate needs a new fixture after the translated / multilingual memo audit. The current answer is no: the two broad rows that exist in the current source-span quality audit are already resolved by `fff-broad-span-split-001`, and the source-pack chain still reports 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held defaults, and 0 downstream adopted candidates.

The machine-readable readback lives at `artifacts/very-broad-source-span-shape-audit-result.json`.

## Work Judgment

| Candidate | Evidence checked | Decision |
| --- | --- | --- |
| Add a very broad source-span fixture now | Source pack still lists `very broad source spans` as a fixture-class gap, but current broad rows are already split/kept with source locators preserved. | Deferred; no fixture added in this slice. |
| Reopen broad-span split | `local-x-visual-observatory` is split into narrower visual/timeline evidence, and `minutes-x-placeholder-proof-bait` is kept with an explicit human-owned reason. | Not reopened. |
| Move to provider adapter | Provider envelope is still no-call/no-credential evidence only. | Blocked until explicit provider, credential, endpoint, and transport authorization. |

## Readback Counts

The current result records:

- 5 adapter fixture outputs and 60 source-pack rows preserved.
- 2 current broad source-span rows loaded.
- 2 broad rows resolved by the existing split/keep readback.
- 0 very broad fixture files added.
- 0 source-span mismatches.
- 0 missing source refs.
- 0 unsafe visual routes.
- 0 non-held review defaults.
- 0 human-owned decision adopt suggestions.
- 0 downstream Profile / Claim / Timeline candidates adopted.
- No provider configured, no external call attempted, and no credentials touched.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-translated-memo-fixture-audit-001` |
| Axis | `very_broad_source_span_shape_audit` |
| Prior review count | `0` |
| What changed | The remaining broad-shape candidate was audited after translated memo work without adding another fixture class. |
| What this decides | No user review is needed; a broad fixture waits until source output changes or a concrete coverage bottleneck appears. |
| Not asking | No general Review Hub review, fixed-form review, broad-span re-review, provider approval, model/API approval, credential work, downstream adoption, or canon decision. |
| Next non-redundant axis | Provider adapter implementation only after explicit authorization, or a new broad/translated fixture only after concrete policy or source-output evidence changes. |

No Review Card or Operator Observation Card is emitted.

## Validation Contract

This slice is complete when:

- `node tools/fff-state.mjs smoke-very-broad-source-span-shape-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/very-broad-source-span-shape-audit-result.json` passes.
- Existing translated memo audit, broad-span split, routing regression, malformed/missing span guard, contradictory claim guard, downstream adoption gate, and provider-envelope no-call readbacks remain passing.
- The active manifest validation command includes the very broad source-span shape audit smoke.
- MkDocs strict build and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-translated-memo-fixture-audit-001`, `fff-broad-span-split-001`, `fff-source-span-quality-audit-001`, `fff-routing-policy-regression-hardening-001`, `fff-downstream-source-span-adoption-gate-001`, `fff-provider-envelope-readiness-no-call-001`, `fff-contradictory-claim-guard-001`, `fff-malformed-missing-span-guard-001`, `fff-remaining-fixture-coverage-one-class-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, freeform review intake, and human-owned canon boundaries.

No broad fixture, translated fixture, model/API call, provider choice, credential, endpoint, database persistence, publishing, production sync, AI video generation, downstream adoption implementation, repeated general review request, or final canon decision is added by this slice.
