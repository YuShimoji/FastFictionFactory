# Contradictory Claim Guard

Artifact: `fff-contradictory-claim-guard-001`

## Purpose

This slice covers exactly one remaining fixture class after `fff-malformed-missing-span-guard-001`: contradictory memo claims. It does not decide which claim is true. It records a local guard that detects explicitly contradictory claim candidates, keeps both sides held for human review, preserves source refs, and prevents auto-canon or direct Claim Ledger acceptance.

The machine-readable readback lives at `artifacts/contradictory-claim-guard-result.json`.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-malformed-missing-span-guard-001` |
| Axis | `contradictory_claim_guard` |
| Prior review count | `0` |
| Prior signal | The malformed/missing source-span guard completed without user review and left contradictory memo claims as a named remaining fixture class. |
| What changed | One Extraction Contract fixture now carries two source-backed, reciprocally linked contradictory claim candidates. |
| What this review decides | No user review is needed; this readback decides whether explicit contradictory claims are detected, held, source-traced, and kept out of auto-canon or direct adoption. |
| Not asking | No general Review Hub review, no fixed-form review, no repeated malformed/sparse/weak/broad/routing review, no model/API approval, no credentials, no database or publishing change, no production sync, no AI video, no final canon decision, and no decision about which contradictory claim is true. |
| Next non-redundant axis | Translated memo text, very broad source-span fixture shape, or provider adapter authorization only after a concrete coverage need or provider scope is named. |

No Review Card or Operator Observation Card is emitted. Review Debt is recorded because the work can continue locally without user input.

## Why This Guard

| Candidate class | Why it was or was not chosen now | Current outcome |
| --- | --- | --- |
| Contradictory memo claims | Chosen because it remained named after sparse notes and malformed/missing source-span coverage, and it can be tested locally without deciding truth. | Covered by `contradictory-claim-hold.json` and `contradictory-claim-guard-result.json`. |
| Very broad source-span fixture shape | Broad-span debt already has a readback decision; a new fixture needs a separate concrete gap. | Remains a future fixture candidate. |
| Multilingual or translated memo text | Needs language/translation policy before it is useful. | Remains a future fixture candidate. |
| Model/API provider envelope output | Would touch provider boundary design and future integration shape. | Remains blocked until explicit model/API authorization. |

## Guard Behavior

| Behavior | Local meaning |
| --- | --- |
| `conflict_detected` | Two claim candidates use reciprocal `contradictsClaimIds`. |
| `hold_for_human_review` | Both conflicting claims and their claim-routed source elements remain `hold`. |
| `keep_out_of_auto_canon` | The fixture keeps `autoCanonPromotion=false`, `autoChronologyPromotion=false`, and `worldTruthStatus=uncertain`. |
| `keep_out_of_direct_claim_acceptance` | No contradictory claim or claim-routed source element is `adopt` or `provisional`. |
| `preserve_source_refs` | Both conflicting claims keep source refs tied to the fixture memo. |

## Probe Output

| Evidence | Count | Why it matters |
| --- | --- | --- |
| Validator fixtures | 9 | The validator matrix now includes exactly one added contradictory-claim hold fixture. |
| Expected-valid fixtures | 3 | The contradictory fixture is valid because it detects and holds the conflict rather than leaking adoption. |
| Expected-invalid fixtures | 6 | Existing unsafe fixtures still fail for intended reasons. |
| Conflicting claims | 2 | The guard covers one reciprocal contradiction pair without generalizing into a contradiction-resolution system. |
| Reciprocal conflict pairs | 1 | The two claims point to each other through `contradictsClaimIds`. |
| Adopted/provisional conflicting claims | 0 | Neither side of the contradiction becomes canon or an accepted claim candidate. |
| Source-pack rows preserved | 60 | Positive adapter/source-span coverage remains consistent after multilingual expansion. |

## Regression Boundary

`fff-malformed-missing-span-guard-001`, `fff-missing-fixture-class-probe-001`, `fff-weak-span-repair-001`, `fff-broad-span-split-001`, and `fff-routing-policy-regression-hardening-001` remain closed. This guard does not add a normal adapter fixture itself and does not reinterpret the current 60 routed rows.

The contradictory claim guard readback checks that:

- The previous malformed guard, sparse fixture probe, weak-span repair, broad-span split, and routing regression artifacts still parse and pass.
- The selected class was named by existing fixture coverage debt.
- Exactly one contradictory-claim fixture class was added.
- Two claim candidates are explicitly linked through reciprocal `contradictsClaimIds`.
- Contradictory claims remain `hold` with `worldTruthStatus=uncertain`.
- Auto-canon and auto-chronology promotion remain disabled.
- Claim-routed source elements remain held and source-traced.
- Source-pack and routing-regression counts remain consistent after the multilingual fixture expansion: currently 60 source-pack rows, 6 adapter payloads, and 72 adapter elements.
- The model/API boundary still records `externalCallAllowed: false`.

## Remaining Fixture Classes

The contradictory memo claim class is no longer missing. The remaining candidates are:

- Very broad source-span fixture shape.
- Multilingual or translated memo text.
- Model/API provider envelope output.

## Validation Contract

This slice is complete when:

- `artifacts/contradictory-claim-guard-result.json` parses and passes.
- `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json` passes.
- `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json` passes.
- `node tools/fff-state.mjs smoke-malformed-missing-span-guard artifacts/extraction-validator-smoke-result.json artifacts/malformed-missing-span-guard-result.json` still passes.
- `node tools/fff-extract-local.mjs --matrix artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json` passes.
- `node tools/fff-source-span-review-pack.mjs artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/source-span-routing-review-pack.json` passes.
- `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json` passes.
- `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json` passes.
- `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json` passes.
- Current status, Review Hub, manifest, and artifact inventory point to this artifact.
- MkDocs strict build, HTML script syntax check, JSON parse, and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-malformed-missing-span-guard-001`, `fff-missing-fixture-class-probe-001`, `fff-weak-span-repair-001`, `fff-broad-span-split-001`, `fff-routing-policy-regression-hardening-001`, `fff-ambiguous-routing-resolution-001`, `fff-source-span-quality-audit-001`, `fff-review-memory-dedup-001`, `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated general review request, fixed-form review, contradiction truth decision, or final canon decision is added by this slice.
