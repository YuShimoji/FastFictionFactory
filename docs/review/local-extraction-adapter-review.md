# Local Extraction Adapter Review

## What Was Implemented

`fff-local-extraction-adapter-spike-001` adds a zero-dependency deterministic local extraction adapter at `tools/fff-extract-local.mjs`.

The adapter reads `artifacts/sample-raw-memo.md`, produces `artifacts/local-extraction-adapter-output.json`, and writes smoke evidence to `artifacts/local-extraction-adapter-smoke-result.json`.

The output is an Extraction Contract payload, not project-state persistence and not canon. It is intended to prove the local boundary:

```powershell
node .\tools\fff-extract-local.mjs .\artifacts\sample-raw-memo.md .\artifacts\local-extraction-adapter-output.json .\artifacts\local-extraction-adapter-smoke-result.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\local-extraction-adapter-output.json
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
```

## Adapter Output

The sample adapter output contains:

- 12 extracted elements.
- All required element types: person, place, organization, event, object, concept, document, visual_asset, placeholder, source_reference, and unresolved_decision.
- 9 profile candidates.
- 7 claim candidates.
- 5 timeline candidates.
- 3 human-owned unresolved dependencies: Toma fate, brass moth truth, and Council motive.
- Review-safe defaults with `defaultReviewStatus: "hold"`.
- `autoCanonPromotion: false` and `autoChronologyPromotion: false`.
- Freeform review as the human source of truth.

## Guard Status

The smoke result records:

- No model/API call.
- Source refs are present on extracted elements.
- Review-safe defaults are present.
- Human authority boundaries name Toma fate, brass moth truth, and Council motive.
- Visual asset extraction is buffered through Profile/Ghost review rather than routing directly to Claim Ledger alone.
- Freeform review remains allowed.

## Preserved Product Truth

This slice preserves:

- Visual Review Hub as the single local review entry point.
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

- Phrase detection is deterministic and intentionally narrow.
- Source spans are literal phrase matches in one sample memo, not a multi-draft source map.
- Candidate profile, claim, and timeline records are review examples, not durable database graph records.
- The adapter does not call a model/API and does not attempt semantic inference beyond the local rule map.

## Next Recommended Continuation

Review whether the deterministic output has useful source spans and safe routing. The next slice can either broaden deterministic source mapping or prepare a model/API adapter behind the same `validate-extraction` and fixture-matrix boundary.
