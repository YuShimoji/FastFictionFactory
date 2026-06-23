# Malformed/Missing Source-Span Guard

Artifact: `fff-malformed-missing-span-guard-001`

## Purpose

This slice covers exactly one remaining fixture class after `fff-missing-fixture-class-probe-001`: missing or malformed source-span payloads. It keeps the work local, does not ask for a general Review Hub review, does not use a fixed form, and does not start model/API work.

The machine-readable readback lives at `artifacts/malformed-missing-span-guard-result.json`.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-missing-fixture-class-probe-001` |
| Axis | `malformed_missing_span_guard` |
| Prior review count | `0` |
| Prior signal | The sparse fixture probe completed without user review and left malformed/missing source-span payloads as a named remaining fixture class. |
| What changed | One negative extraction fixture now proves missing, malformed, or unusable source-span evidence is rejected before routed candidate adoption. |
| What this review decides | No user review is needed; this readback decides whether invalid source-span evidence stays out of Profile, Claim, and Timeline adoption surfaces. |
| Not asking | No general Review Hub review, no fixed-form review, no repeated sparse/weak/broad/routing review, no model/API approval, no provider credentials, no database or publishing change, no production sync, no AI video, no canon decision. |
| Next non-redundant axis | Choose a different remaining fixture class only after a new concrete coverage need is named. |

No Review Card or Operator Observation Card is emitted. Review Debt is recorded because the work can continue locally without user input.

## Why This Guard

| Candidate class | Why it was or was not chosen now | Current outcome |
| --- | --- | --- |
| Missing or malformed source-span payloads | Chosen because the prior fixture probe named it as a remaining class and it is a validator boundary, not a story judgment. | Covered by `malformed-missing-source-span.json` and `malformed-missing-span-guard-result.json`. |
| Contradictory memo claims | Would create canon/reality-status judgment pressure. | Remains a future fixture candidate. |
| Very broad source-span fixture shape | Broad-span debt already has a readback decision; a new fixture needs a separate concrete gap. | Remains a future fixture candidate. |
| Multilingual or translated memo text | Needs language/translation policy before it is useful. | Remains a future fixture candidate. |
| Model/API provider envelope output | Would touch provider boundary design and future integration shape. | Remains blocked until explicit model/API authorization. |

## Guard Behavior

| Behavior | Local meaning |
| --- | --- |
| `reject_as_invalid` | The extraction validator returns invalid for the fixture. |
| `hold_as_unreviewable` | All fixture elements remain `hold`; no provisional or adopt suggestion is allowed. |
| `mark_missing_source_ref` | A missing source-ref case remains explicit instead of being treated as sourced evidence. |
| `keep_out_of_claim_timeline_profile_adoption` | Even when the invalid elements name Profile, Claim, or Timeline destinations, they do not become accepted routed candidates. |

## Probe Output

| Evidence | Count | Why it matters |
| --- | --- | --- |
| Validator fixtures | 8 | The existing validator matrix now includes exactly one added malformed/missing source-span fixture. |
| Expected-invalid fixtures | 6 | The new fixture extends negative coverage without changing the two expected-valid fixtures. |
| Guard fixture elements | 3 | The fixture covers missing sourceSpan, malformed offset, empty text, and zero-width range in one bounded class. |
| Source-span validator errors | 5 | The validator now catches unusable source-span evidence at contract level. |
| Accepted routed candidates | 0 | Invalid span evidence does not enter Profile, Claim, or Timeline adoption surfaces. |
| Source-pack rows preserved | 48 | The positive adapter matrix and source-span review pack remain unchanged. |

## Regression Boundary

`fff-missing-fixture-class-probe-001`, `fff-weak-span-repair-001`, `fff-broad-span-split-001`, and `fff-routing-policy-regression-hardening-001` remain closed. This guard does not add a normal adapter fixture, does not change the positive source-span review pack, and does not reinterpret the existing 48 routed rows.

The malformed/missing span guard readback checks that:

- The prior sparse fixture probe, weak-span repair, broad-span split, and routing regression artifacts still parse and pass.
- The selected guard was named by existing fixture coverage debt.
- Exactly one negative fixture class was added.
- Missing sourceSpan, malformed offset, empty text, and zero-width range are rejected by the validator.
- Missing source refs are still marked as invalid evidence.
- Invalid elements remain held and unreviewable.
- Invalid elements do not become accepted Profile, Claim, or Timeline routed candidates.
- Source-pack and routing-regression counts remain 48 rows, 5 adapter payloads, and 60 adapter elements.
- The model/API boundary still records `externalCallAllowed: false`.

## Remaining Fixture Classes

The malformed/missing source-span class is no longer missing. The remaining candidates are:

- Contradictory memo claims.
- Very broad source-span fixture shape.
- Multilingual or translated memo text.
- Model/API provider envelope output.

## Validation Contract

This slice is complete when:

- `artifacts/malformed-missing-span-guard-result.json` parses and passes.
- `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json` passes.
- `node tools/fff-state.mjs smoke-malformed-missing-span-guard artifacts/extraction-validator-smoke-result.json artifacts/malformed-missing-span-guard-result.json` passes.
- `node tools/fff-extract-local.mjs --matrix artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json` passes.
- `node tools/fff-source-span-review-pack.mjs artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/source-span-routing-review-pack.json` passes.
- `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json` passes.
- `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json` passes.
- `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json` passes.
- Current status, Review Hub, manifest, and artifact inventory point to this artifact.
- MkDocs strict build, dashboard parse, JSON parse, and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-missing-fixture-class-probe-001`, `fff-weak-span-repair-001`, `fff-broad-span-split-001`, `fff-routing-policy-regression-hardening-001`, `fff-ambiguous-routing-resolution-001`, `fff-source-span-quality-audit-001`, `fff-review-memory-dedup-001`, `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated general review request, fixed-form review, or final canon decision is added by this slice.
