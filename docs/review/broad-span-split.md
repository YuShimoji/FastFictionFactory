# Broad Source-Span Split

Artifact: `fff-broad-span-split-001`

## Purpose

This slice resolves the two broad source-span rows found by `fff-source-span-quality-audit-001`. It keeps the work local, does not change model/API behavior, and does not promote any generated candidate into canon.

The machine-readable readback lives at `artifacts/broad-span-split-result.json`.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-source-span-quality-audit-001` |
| Axis | `broad_span_split` |
| Prior review count | `0` |
| Prior signal | The source-span quality audit classified the rows, but no user review was requested or recorded for span wording acceptance. |
| What changed | The two broad source-span rows now have deterministic split or keep decisions with source locators preserved. |
| Not asking | No general Review Hub review, no repeated source-span quality review, no model/API approval, no production approval, no canon decision. |
| Next non-redundant axis | One bounded weak-span repair or one missing fixture class after explicit need. |

No Review Card is emitted. Review Debt is recorded because the work can continue locally without user input.

## Broad-Span Decisions

| Row | Decision | Result |
| --- | --- | --- |
| `local-x-visual-observatory` | `split_into_narrower_spans` | Split the broad clause into `its bell was removed` for visual/profile evidence and `still rings at noon` for timeline context. The original source locator remains preserved, and the routing policy regression still blocks direct Claim targets for visual rows. |
| `minutes-x-placeholder-proof-bait` | `keep_with_reason` | Keep the full phrase `do not decide whether it is proof, bait, or a false record` as one held placeholder because splitting `proof`, `bait`, and `false record` would imply separate canon choices before a human-owned decision exists. |

The split is a review readback decision. It does not rewrite the deterministic adapter output in this slice.

## Readback Counts

The current result records:

- 2 broad source-span rows loaded.
- 1 row split into narrower spans.
- 0 rows shrunk in place.
- 1 row kept with explicit reason.
- 0 new hold-only outcomes.
- 2 source refs preserved.
- 0 failures.

## Regression Boundary

`fff-routing-policy-regression-hardening-001` remains the active route guard for this slice. The broad-span split readback checks that:

- The source-span quality audit still parses and passes.
- The two expected broad rows are present.
- The observatory row has narrower visual and timeline snippets.
- The proof/bait/false-record placeholder remains one held human-owned instruction.
- Source span locators are preserved.
- Routing policy regression still passes with 0 failures.
- The model/API boundary still records `externalCallAllowed: false`.

## Review Debt

| Debt | Current state | Next move |
| --- | --- | --- |
| Broad spans | The 2 broad rows are resolved by split/keep decisions in `artifacts/broad-span-split-result.json`. | Do not reopen unless adapter output or human review changes the row. |
| Weak spans | 6 valid spans remain too thin for ideal review usefulness. | Pick one weak span and widen or split it in a later bounded slice. |
| Missing fixture classes | Contradictory, malformed, multilingual, sparse, or provider-envelope memo shapes remain uncovered. | Add one fixture class at a time only when it has concrete decision value. |
| Human-owned alternatives | Proof/bait/false-record alternatives remain unresolved. | Keep held until a human author chooses to resolve that story decision. |

## Validation Contract

This slice is complete when:

- `artifacts/broad-span-split-result.json` parses and passes.
- `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json` passes.
- `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json` still passes.
- The active manifest validation command includes the broad-span split smoke.
- Current status and artifact inventory point to this artifact.
- MkDocs strict build and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-routing-policy-regression-hardening-001`, `fff-ambiguous-routing-resolution-001`, `fff-source-span-quality-audit-001`, `fff-review-memory-dedup-001`, `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated general review request, or final canon decision is added by this slice.
