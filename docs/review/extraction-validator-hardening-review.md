# Extraction Validator Hardening Review

## What Was Implemented

`fff-extraction-validator-hardening-001` adds local negative fixtures and stricter validator behavior around the existing `fff-extraction-contract-001` surface.

The slice adds:

- `validate-extraction` command support in `tools/fff-state.mjs` for standalone extraction contract payloads.
- `smoke-extraction-fixtures` command support that writes a pass/fail fixture matrix to `artifacts/extraction-validator-smoke-result.json`.
- A fixture set under `artifacts/extraction-negative-fixtures/` covering valid minimal payloads, missing source refs, overconfident human-owned decisions, unsafe direct visual-asset-to-claim routing, auto-canon leaks, missing review-safe defaults, and unknown-field preservation.
- Visual Review Hub status text and artifact rows that keep the Hub as the single local review entry point.

## Preserved Product Truth

The hardening does not add model/API extraction behavior, database persistence, production sync, publishing, upload, or AI video generation.

The existing contract remains the reviewed candidate surface. Toma fate, brass moth truth, and Council motive remain human-owned unresolved decisions. The validator may reject unsafe payloads that try to finalize those decisions, but it does not choose story truth.

## Fixture Matrix

| Fixture | Expected | Why It Matters |
| --- | --- | --- |
| `valid-minimal.json` | pass | Confirms a small local payload can satisfy required contract shape and element type coverage. |
| `unknown-fields-preservation.json` | pass | Confirms future adapter-specific fields can survive review without being silently applied as canon. |
| `missing-source-refs.json` | fail | Blocks candidates that cannot trace back to declared source refs. |
| `overconfident-human-owned-decision.json` | fail | Blocks extraction from adopting human-owned decisions such as Toma fate. |
| `invalid-routing-visual-asset-to-claim.json` | fail | Blocks direct visual asset claim routing unless a profile or timeline review buffer exists. |
| `auto-canon-leak.json` | fail | Blocks defaults that would silently promote candidates into canon or chronology. |
| `missing-review-safe-defaults.json` | fail | Blocks payloads that lack review-safe defaults. |

## Validation Notes

The smoke result records 7 of 7 matched fixture expectations: 2 expected-valid payloads passed and 5 expected-invalid payloads failed.

The validator now checks extraction schema version, declared source refs, required element types, confidence range, review statuses, source spans, review-safe defaults, decision-log-safe metadata, human authority boundaries, and routing safety.

## Known Limitations

- The invalid fixtures are compact single-risk payloads, so some also fail required element type coverage in addition to their intended error.
- Unknown fields are accepted for preservation, but this slice does not implement a new UI panel for inspecting every unknown adapter field.
- The validator hardens local contract shape only; it is not an extraction adapter and does not perform source-map reconciliation across multiple drafts.

## Next Recommended Slice

Build a local-only extraction adapter spike that emits the reviewed contract shape from deterministic input, then run `validate-extraction` and `smoke-extraction-fixtures` before exposing adapter output in the Review Hub.
