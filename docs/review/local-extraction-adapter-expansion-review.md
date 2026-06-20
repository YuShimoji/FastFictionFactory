# Local Extraction Adapter Expansion Review

## What Was Implemented

`fff-local-extraction-adapter-expansion-001` expands the zero-dependency deterministic local extraction adapter at `tools/fff-extract-local.mjs`.

The existing single-output command still works:

```powershell
node .\tools\fff-extract-local.mjs .\artifacts\sample-raw-memo.md .\artifacts\local-extraction-adapter-output.json .\artifacts\local-extraction-adapter-smoke-result.json
```

The expansion adds matrix mode:

```powershell
node .\tools\fff-extract-local.mjs --matrix .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json
```

Matrix mode reads local fixture memos, selects a deterministic fixture profile, generates one Extraction Contract payload per fixture, validates each output, and records a source/routing audit.

## Adapter Fixtures

| Fixture | Output | Purpose |
| --- | --- | --- |
| `artifacts/extraction-adapter-fixtures/clockmaker-sample.md` | `artifacts/extraction-adapter-outputs/clockmaker-sample.json` | Preserves the original sample route while moving it into matrix coverage. |
| `artifacts/extraction-adapter-fixtures/council-minutes-edge.md` | `artifacts/extraction-adapter-outputs/council-minutes-edge.json` | Adds alternate person/place/organization phrasing, a document map, and a visual-asset route. |
| `artifacts/extraction-adapter-fixtures/observatory-ledger-edge.md` | `artifacts/extraction-adapter-outputs/observatory-ledger-edge.json` | Adds different paragraph order, repeated event wording, and source-span checks for evidence-like records. |

## Adapter Output

The expansion smoke at `artifacts/local-extraction-adapter-expansion-smoke-result.json` records:

- 3 fixture inputs.
- 3 generated Extraction Contract payloads.
- 36 extracted elements.
- Complete coverage for required element types: person, place, organization, event, object, concept, document, visual_asset, placeholder, source_reference, and unresolved_decision.
- 27 profile candidates.
- 20 claim candidates.
- 12 timeline candidates.
- 36 of 36 source spans matched source memo text.
- 0 missing source refs.
- 0 unsafe visual-asset routing cases.
- 0 non-held review defaults.
- 0 human-owned decision adopt suggestions.

## Guard Status

The smoke result records:

- No model/API call.
- Source refs are present on extracted elements.
- Review-safe defaults are present.
- Human authority boundaries name Toma fate, brass moth truth, and Council motive.
- Visual asset extraction is buffered through Profile/Ghost review.
- Freeform review remains allowed.
- Required element-type coverage is present across the fixture matrix.

## Preserved Product Truth

This slice preserves:

- Visual Review Hub as the single local review entry point.
- `fff-local-extraction-adapter-spike-001`.
- `fff-extraction-validator-hardening-001`.
- `fff-extraction-contract-001`.
- Claim Ledger.
- Timeline View.
- Profile/Ghost Flow.
- Local persistence.
- JSON import/export.
- Freeform review intake.
- Human-owned canon boundaries.

The adapter does not decide Toma fate, brass moth truth, or Council motive.

## Known Limitations

- Fixture selection is deterministic and intentionally keyed to local Clockmaker memos.
- The validator still requires the Clockmaker human-owned decision boundaries in every payload.
- Source spans are exact literal phrase matches, not semantic source maps.
- Candidate profile, claim, and timeline records are review examples, not durable database graph records.
- The adapter does not call a model/API and does not infer beyond the fixture rule map.

## Next Recommended Continuation

Review whether the expanded deterministic output has useful source spans and safe routing. The next slice can add more local source-span edge fixtures or prepare a model/API adapter behind the same `validate-extraction`, fixture-matrix, review-held default, and human-authority boundary checks.
