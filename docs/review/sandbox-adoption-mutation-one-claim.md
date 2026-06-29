# Sandbox Adoption Mutation One Claim

Artifact: `fff-sandbox-adoption-mutation-one-claim-001`

This readback records the user-authorized sandbox / fixture adoption of exactly one claim: `multi-claim-moth-key-label`. It is a fixture-only mutation record, not production adoption, not canon, and not a provider or publishing path.

## Authorized Boundary

- Target claim id: `multi-claim-moth-key-label`
- Source span id: `multi-x-object-brass-moth-key`
- Prior ledger status: `adoption_candidate_dry_run`
- Sandbox transition: `adoption_candidate_dry_run -> sandbox_adopted_fixture`
- Sandbox fixture status: `sandbox_adopted_fixture`
- Sandbox mutation count: `1`
- Production adoption status: `false`
- Canon status: `false`

## Production Boundary

The sandbox row must keep all production mutation counts at zero:

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

## Rollback Readback

Rollback token:

```text
rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run
```

Rollback scope is the sandbox fixture row only. Rolling back returns the sandbox row to `adoption_candidate_dry_run` while preserving the source span id, held claim id, and audit trail.

## Evidence Before Future Production Adoption

Any future production adoption remains blocked until a later explicit mutation authorization provides human approval, target-class selection, source refs and original source-span readback, contradiction / malformed-span / downstream-gate / provider-boundary checks, and a rollback condition with owner.

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim artifacts/adoption-candidate-ledger-dry-run-result.json artifacts/sandbox-adoption-mutation-one-claim-result.json
```

Expected readback:

- `artifact_id`: `fff-sandbox-adoption-mutation-one-claim-001`
- `summary.candidates_inspected`: `1`
- `summary.sandbox_fixture_adoption_rows`: `1`
- `summary.production_adopted_claims`: `0`
- `summary.canonized_claims`: `0`
- all production Profile / Claim / Timeline / Story Seed mutation, provider, external call, credential, publishing, and production generation counts remain zero or false
