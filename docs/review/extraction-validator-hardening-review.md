# Extraction Validator Hardening Review

## What Was Hardened

`fff-extraction-validator-hardening-001` adds local negative fixture coverage and stricter zero-dependency validation to `tools/fff-state.mjs`. The goal is to catch unsafe Extraction Contract payloads before any local adapter spike, model/API integration, database persistence, publishing path, AI video generation, or final canon decision exists.

The validator now supports:

- `validate-extraction <payload.json>`
- `summarize-extraction <payload.json>`
- `validate-extraction-fixtures <fixture-directory>`

Existing project-state commands remain:

- `validate <state.json>`
- `summarize <state.json>`
- `normalize <state.json> [output.json]`

## Fixture List

| Fixture | Expected behavior | Purpose |
| --- | --- | --- |
| `artifacts/extraction-negative-fixtures/valid-minimal.json` | Passes with an unknown-field preservation warning | Proves a minimal safe payload can pass without dropping unrecognized adapter data. |
| `artifacts/extraction-negative-fixtures/missing-source-refs.json` | Fails | Prevents extracted elements from entering review without source refs. |
| `artifacts/extraction-negative-fixtures/overconfident-human-owned-decision.json` | Fails | Prevents Toma fate or other human-owned decisions from being suggested as adopted canon. |
| `artifacts/extraction-negative-fixtures/invalid-routing-visual-asset-to-claim.json` | Fails | Prevents visual assets from routing directly to Claim Ledger without profile/asset-side review. |
| `artifacts/extraction-negative-fixtures/auto-canon-leak.json` | Fails | Catches automatic canon promotion, unsafe default adoption, automatic chronology promotion, and missing unknown-source handling. |

The fixture matrix also mutates the valid fixture internally to prove missing `extractionRunId`, missing `schemaVersion`, invalid `elementType`, missing `humanAuthorityBoundaries`, and high-canon-risk payloads without warnings are rejected.

## Expected Pass/Fail Behavior

The fixture matrix passes only when:

- The valid minimal fixture validates.
- Each invalid fixture fails for its intended reason.
- Missing `extractionRunId` fails.
- Missing `schemaVersion` fails.
- Invalid `elementType` fails.
- Missing `humanAuthorityBoundaries` fails.
- High-canon-risk payloads without warnings fail.
- Unknown top-level fields are reported as preservation warnings, not silently dropped.
- Missing review-safe defaults are reported as errors.

Current smoke evidence:

```powershell
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
```

Result artifact:

```text
artifacts/extraction-validator-smoke-result.json
```

## Human-Owned Canon Protection

The validator rejects extraction candidates that try to turn human-owned unresolved decisions into adopted canon. This specifically protects:

- Toma fate.
- Brass moth truth.
- Council motive.

High-canon-risk candidates must remain warning-backed and review-held. Freeform human review remains the source of truth; generated confidence does not become final story authority.

## Preserved Behavior

This slice preserves:

- Visual Review Hub as the single local review entry point.
- `fff-extraction-contract-001`.
- Claim Ledger.
- Timeline View.
- Profile/Ghost Flow.
- Local persistence.
- JSON import/export.
- Freeform review intake.
- Existing project-state validation and summary commands.

## Out Of Scope

This slice does not add:

- Model/API extraction behavior.
- External services.
- Credentials or secrets.
- Database persistence.
- Production sync.
- Publishing or YouTube upload.
- AI video generation.
- Final canon decisions for Toma, the brass moth, or the Council.

## Next Recommended Continuation

Use `fff-extraction-validator-hardening-001` as the gate for the next local-only extraction adapter spike. The adapter should emit the reviewed Extraction Contract shape from deterministic input, then pass:

```powershell
node .\tools\fff-state.mjs validate-extraction <adapter-output.json>
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
```

Any adapter output that lacks source refs, tries to auto-promote canon, routes visual assets directly into Claim Ledger, or resolves human-owned decisions should stay rejected before it can affect Claim Ledger, Timeline View, or Profile/Ghost Flow.
