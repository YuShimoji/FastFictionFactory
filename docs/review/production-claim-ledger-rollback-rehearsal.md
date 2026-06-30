# Production Claim Ledger Rollback Rehearsal

Artifact: `fff-production-claim-ledger-rollback-rehearsal-001`

This readback rehearses the rollback descriptor for the existing production Claim Ledger adoption row for exactly one claim: `multi-claim-moth-key-label`.

It is readback-only and non-destructive. It does not perform rollback, does not remove the Claim Ledger row, does not mutate Profile, Timeline, or Story Seed state, does not canonize the claim, and does not open provider/API, credential, publishing, or production generation routes.

## Rehearsal Boundary

- Target claim id: `multi-claim-moth-key-label`
- Source span id: `multi-x-object-brass-moth-key`
- Production target class: `Claim Ledger`
- Current Claim Ledger status: `production_claim_ledger_adopted`
- Rollback token: `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`
- Rollback target status: `adoption_candidate_dry_run`
- Rehearsal operation: `readback_only_non_destructive`
- Actual rollback performed: `false`
- Production Claim Ledger row retained: `true`
- Canon status: `false`

## Before / After Rehearsal

| Field | Before rehearsal | After rehearsal |
| --- | --- | --- |
| Claim Ledger status | `production_claim_ledger_adopted` | `production_claim_ledger_adopted` |
| Production Claim Ledger row retained | `true` | `true` |
| Actual rollback performed | `false` | `false` |
| Production Claim Ledger rows removed | `0` | `0` |
| Profile mutation count | `0` | `0` |
| Timeline mutation count | `0` | `0` |
| Story Seed mutation count | `0` | `0` |
| Canonized claims | `0` | `0` |
| Provider/API/Credential | `false` | `false` |

## Evidence Before A Real Rollback

Any actual production Claim Ledger rollback remains blocked until a later explicit user authorization names the real rollback target, rollback owner, mutation behavior, post-rollback readback, source evidence preservation, and boundary checks. The production adoption row stays present after this rehearsal.

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal artifacts/production-claim-ledger-adoption-one-claim-result.json artifacts/production-claim-ledger-rollback-rehearsal-result.json
```

Expected readback:

- `artifact_id`: `fff-production-claim-ledger-rollback-rehearsal-001`
- `summary.claim_ledger_adopted_rows_inspected`: `1`
- `summary.rollback_descriptors_inspected`: `1`
- `summary.rollback_rehearsals_recorded`: `1`
- `summary.actual_rollback_operations`: `0`
- `summary.production_claim_ledger_rows_removed`: `0`
- `summary.production_claim_ledger_rows_retained`: `1`
- `summary.profile_mutation_count`: `0`
- `summary.timeline_mutation_count`: `0`
- `summary.story_seed_mutation_count`: `0`
- `summary.canonized_claims`: `0`
- provider, external call, credential, publishing, and production generation flags remain false
