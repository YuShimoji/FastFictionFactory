# Remaining Fixture Coverage One Class

Artifact: `fff-remaining-fixture-coverage-one-class-001`

Current status: preserved auxiliary readback under the active `fff-contradictory-claim-guard-001` surface. This slice adds exactly one remaining positive adapter fixture class: multilingual memo text.

## Purpose

The provider envelope readiness gate is already complete and remains no-call evidence only. This slice does not move into provider adapter implementation. It adds one deterministic local fixture to prove that mixed-language author memo text can move through the adapter matrix, source-span pack, downstream gate, and existing guard chain without translation APIs, credentials, provider calls, or canon promotion.

The machine-readable readback lives at `artifacts/remaining-fixture-coverage-one-class-result.json`. The fixture memo is `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`; the generated output is `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`.

## Class Choice

| Candidate | Why it was not or was chosen | Current result |
| --- | --- | --- |
| Multilingual memo text | Chosen because the positive adapter fixture matrix was English-only, while mixed-language source spans can be tested locally without translation policy or provider behavior. | Covered by `multilingual-memo-notes.md` and the readback result. |
| Translated memo text | Not chosen because a useful translated fixture needs a policy for source-of-truth language, translation provenance, and whether the translation or original memo owns the span. | Remains a future candidate. |
| Very broad source-span shape | Not chosen because the current broad rows already have `fff-broad-span-split-001` split/keep readback; a new broad fixture should wait for a separate concrete gap. | Remains a future candidate. |

## Readback Counts

The current result records:

- 5 adapter fixture outputs, up from 4.
- 60 matrix elements, up from 48.
- 12 multilingual fixture elements.
- 4 multilingual source-span elements containing non-ASCII text.
- 0 source-span mismatches.
- 0 missing source refs.
- 0 unsafe visual routes.
- 0 non-held review defaults.
- 0 human-owned decision adopt suggestions.

The downstream auxiliary gate now reads 60 source-pack rows, reports 55 downstream Profile / Claim / Timeline review candidates, confirms all 55 are source-tracked, keeps 28 human-owned candidates held, and still reports 0 adopted downstream candidates.

## Boundary

This slice preserves `fff-contradictory-claim-guard-001`, `fff-provider-envelope-readiness-no-call-001`, `fff-downstream-source-span-adoption-gate-001`, `fff-malformed-missing-span-guard-001`, `fff-missing-fixture-class-probe-001`, `fff-weak-span-repair-001`, `fff-broad-span-split-001`, `fff-routing-policy-regression-hardening-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, freeform review intake, and human-owned canon boundaries.

No model/API call, provider choice, credential, endpoint, database persistence, publishing, production sync, AI video generation, translated-memo policy, broad fixture campaign, actual downstream adoption, or final canon decision is added by this slice.

## Validation Contract

This slice is complete when:

- `node tools/fff-extract-local.mjs --matrix artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json` passes.
- `node tools/fff-source-span-review-pack.mjs artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/source-span-routing-review-pack.json` passes.
- `node tools/fff-state.mjs smoke-remaining-fixture-coverage-one-class artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/remaining-fixture-coverage-one-class-result.json` passes.
- Existing routing, broad-span, weak-span, malformed/missing span, contradictory claim, downstream adoption, provider-envelope no-call, state, extraction, fixture, MkDocs, and whitespace checks remain passing.
