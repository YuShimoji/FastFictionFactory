# Weak Source-Span Repair

Artifact: `fff-weak-span-repair-001`

## Purpose

This slice resolves the 6 weak source-span rows found by `fff-source-span-quality-audit-001`. It keeps the work local, does not ask for a general Review Hub review, does not change deterministic adapter extraction output, and does not start model/API work.

The machine-readable readback lives at `artifacts/weak-span-repair-result.json`.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-source-span-quality-audit-001` |
| Axis | `weak_span_repair` |
| Prior review count | `0` |
| Prior signal | The source-span quality audit classified the rows, but no user review was requested or recorded for source-span wording acceptance. |
| What changed | The 6 weak rows now have deterministic repair decisions that point to stronger same-fixture source context while preserving original locators. |
| What this review decides | No user review is needed; this readback decides whether current weak-span debt is repaired enough to move toward one missing fixture class later. |
| Not asking | No general Review Hub review, no repeated source-span quality review, no repeated broad-span review, no model/API approval, no production approval, no canon decision. |
| Next non-redundant axis | One missing fixture class only after a concrete coverage need is named. |

No Review Card is emitted. Review Debt is recorded because the work can continue locally without user input.

## Weak-Span Decisions

| Row | Prior weak span | Decision | Stronger readback span | Effect |
| --- | --- | --- | --- | --- |
| `local-x-place-north-bell` | `North Bell Station` | `repair_with_more_precise_source_ref` | `old observatory above North Bell Station still rings at noon` | Keeps the place visible while adding the noon event that explains Timeline usefulness. |
| `local-x-document-ledger` | `ledger of minutes` | `repair_with_more_precise_source_ref` | `council keeps a ledger of minutes in a locked cabinet` | Shows why the document routes to Claim evidence without changing the adapter output. |
| `minutes-x-place-glass-arcade` | `glass arcade` | `repair_with_more_precise_source_ref` | `At 9:17, apprentice Rowan Ise waits in the glass arcade` | Adds the waiting/time context that justifies Timeline review. |
| `edge-x-place-north-bell` | `North Bell Station` | `repair_with_more_precise_source_ref` | `old observatory above North Bell Station rings at noon` | Connects the place to the noon-repeat event without deciding its cause. |
| `edge-x-object-brass-moth-key` | `brass moth key` | `repair_with_more_precise_source_ref` | `Toma's last route is pinned under a brass moth key` | Adds route context while keeping brass moth truth and Toma fate held. |
| `edge-x-document-ledger-page` | `A ledger page` | `repair_with_more_precise_source_ref` | `ledger page lists borrowed minutes from abandoned lives` | Carries the claim-bearing source text that makes Claim review useful. |

The repairs are readback decisions. They do not rewrite deterministic adapter output in this slice.

## Readback Counts

The current result records:

- 6 weak source-span rows loaded.
- 6 rows repaired with more precise source refs.
- 0 rows shrunk in place.
- 0 rows kept only with reason.
- 0 rows held for human review.
- 6 original source locators preserved.
- 0 failures.

## Regression Boundary

`fff-routing-policy-regression-hardening-001` remains the route guard for this slice, and `fff-broad-span-split-001` remains closed. The weak-span repair readback checks that:

- The source-span quality audit still parses and passes.
- The 6 expected weak rows are present.
- Every proposed repair span exists in the same raw memo fixture as its original locator.
- Every repaired span is longer than the prior weak snippet.
- Original source span locators remain preserved.
- Routing policy regression still passes with 0 failures.
- Broad-span split still passes with 0 failures.
- The model/API boundary still records `externalCallAllowed: false`.
- Toma fate, brass moth truth, Council motive, and the brass moth key function remain human-owned.

## Review Debt

| Debt | Current state | Next move |
| --- | --- | --- |
| Weak spans | The 6 weak rows are resolved by stronger same-fixture source refs in `artifacts/weak-span-repair-result.json`. | Do not reopen unless adapter output or human review changes one of these rows. |
| Broad spans | The 2 broad rows remain resolved by `fff-broad-span-split-001`. | Do not reopen unless source output changes. |
| Routing policy | Routing regression remains the guard for Visual, Profile/Ghost, Claim, Timeline, Source Reference, and Human Review boundaries. | Add one fixture class only if the existing smoke exposes drift. |
| Missing fixture classes | Contradictory, malformed, multilingual, sparse, and provider-envelope memo shapes remain uncovered. | Add one class at a time after a concrete coverage need is named. |
| Human-owned decisions | Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved. | Keep held until a human author chooses to resolve that story decision. |

## Validation Contract

This slice is complete when:

- `artifacts/weak-span-repair-result.json` parses and passes.
- `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json` passes.
- `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json` still passes.
- `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json` still passes.
- The active manifest validation command includes the weak-span repair smoke.
- Current status, Review Hub, and artifact inventory point to this artifact.
- MkDocs strict build and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-broad-span-split-001`, `fff-routing-policy-regression-hardening-001`, `fff-ambiguous-routing-resolution-001`, `fff-source-span-quality-audit-001`, `fff-review-memory-dedup-001`, `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated general review request, routing-policy change, adapter rewrite, or final canon decision is added by this slice.
