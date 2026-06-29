# Sandbox Adoption Rollback Rehearsal

Artifact: `fff-sandbox-adoption-rollback-rehearsal-001`

This readback rehearses rollback for the previously authorized sandbox fixture adoption of exactly one claim: `multi-claim-moth-key-label`. It proves the sandbox row still carries the expected rollback token and can be returned to the adoption-candidate dry-run status in readback. It is not production rollback, not production adoption, not canon, and not a provider or publishing path.

## Authorized Boundary

- Target claim id: `multi-claim-moth-key-label`
- Source span id: `multi-x-object-brass-moth-key`
- Prior sandbox fixture status: `sandbox_adopted_fixture`
- Rollback token: `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`
- Rollback scope: `sandbox fixture row only`
- Rollback transition: `sandbox_adopted_fixture -> adoption_candidate_dry_run`
- Post-rollback rehearsal status: `adoption_candidate_dry_run`
- Production rollback performed: `false`
- Production adoption status: `false`
- Canon status: `false`

## Production Boundary

The rehearsal must keep all production mutation counts at zero:

- Profile production mutation count: `0`
- Claim production mutation count: `0`
- Timeline production mutation count: `0`
- Story Seed production mutation count: `0`
- Affected production objects: `0`
- Provider configured: `false`
- External call attempted: `false`
- Credentials touched: `false`
- Publishing opened: `false`
- Production generation opened: `false`

## Evidence Before Future Production Adoption

Any future production adoption remains blocked until a later explicit mutation authorization provides human approval, target-class selection, source refs and original source-span readback, contradiction / malformed-span / downstream-gate / provider-boundary checks, and a rollback condition with owner.

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal artifacts/sandbox-adoption-mutation-one-claim-result.json artifacts/sandbox-adoption-rollback-rehearsal-result.json
```

Expected readback:

- `artifact_id`: `fff-sandbox-adoption-rollback-rehearsal-001`
- `summary.sandbox_adopted_rows_inspected`: `1`
- `summary.rollback_rehearsals_recorded`: `1`
- `summary.successful_rollback_rehearsal_rows`: `1`
- `summary.production_adopted_claims`: `0`
- `summary.canonized_claims`: `0`
- all production Profile / Claim / Timeline / Story Seed mutation, provider, external call, credential, publishing, and production generation counts remain zero or false
