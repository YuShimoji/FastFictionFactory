# Production Claim Ledger Adoption One Claim

Artifact: `fff-production-claim-ledger-adoption-one-claim-001`

This readback records the user-authorized production adoption of exactly one claim into the Claim Ledger: `multi-claim-moth-key-label`. It uses the Claim Ledger target recommended by `fff-production-adoption-authorization-packet-001` and preserves the sandbox rollback evidence from `fff-sandbox-adoption-rollback-rehearsal-001`.

This is a Claim Ledger adoption only. It is not canonization, not Profile mutation, not Timeline mutation, not Story Seed mutation, not provider adapter work, not an external API call, not credential work, not publishing, and not production generation.

## Authorized Boundary

- Target claim id: `multi-claim-moth-key-label`
- Source span id: `multi-x-object-brass-moth-key`
- Production target class: `Claim Ledger`
- Adoption scope: exactly one claim
- Prior status: `adoption_candidate_dry_run`
- Transition: `adoption_candidate_dry_run -> production_claim_ledger_adopted`
- Production Claim Ledger adoption row count: `1`
- Canon status: `false`

## Before / After

| Field | Before | After |
| --- | --- | --- |
| Claim Ledger status | `adoption_candidate_dry_run` | `production_claim_ledger_adopted` |
| Production Claim Ledger adopted | `false` | `true` |
| Canon status | `false` | `false` |
| Profile mutation count | `0` | `0` |
| Timeline mutation count | `0` | `0` |
| Story Seed mutation count | `0` | `0` |
| Provider/API/Credential | `false` | `false` |

## Rollback Descriptor

Rollback token:

```text
rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run
```

Rollback scope is the Claim Ledger production adoption row only. Rolling back returns the Claim Ledger adoption row to `adoption_candidate_dry_run` while preserving the source span id, held claim id, and audit history. Profile, Timeline, Story Seed, and canon state remain untouched by this rollback descriptor.

## Future Gates

Any future Profile, Timeline, Story Seed, or canon adoption remains blocked until separate explicit user approval names the target, mutation behavior, rollback owner, rollback descriptor, source evidence, and unresolved dependency handling.

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim artifacts/production-adoption-authorization-packet-result.json artifacts/production-claim-ledger-adoption-one-claim-result.json
```

Expected readback:

- `artifact_id`: `fff-production-claim-ledger-adoption-one-claim-001`
- `summary.candidates_inspected`: `1`
- `summary.claim_ledger_adoption_rows`: `1`
- `summary.production_claim_ledger_adopted_claims`: `1`
- `summary.profile_mutation_count`: `0`
- `summary.timeline_mutation_count`: `0`
- `summary.story_seed_mutation_count`: `0`
- `summary.canonized_claims`: `0`
- provider, external call, credential, publishing, and production generation flags remain false
