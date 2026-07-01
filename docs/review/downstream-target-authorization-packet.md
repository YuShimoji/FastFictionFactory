# Downstream Target Authorization Packet

Artifact: `fff-downstream-target-authorization-packet-001`

This readback prepares the next downstream target choice after `multi-claim-moth-key-label` was adopted into the production Claim Ledger and its rollback descriptor was rehearsed non-destructively.

It is an authorization packet only. It does not mutate Profile, Timeline, Story Seed, or Canon decision state, does not perform rollback, does not canonize the claim, and does not open provider/API, credential, publishing, or production generation routes.

## Target Readback

- Target claim id: `multi-claim-moth-key-label`
- Source span id: `multi-x-object-brass-moth-key`
- Current status: `production_claim_ledger_adopted`
- Rollback descriptor status: `verified`
- Production Claim Ledger row retained: `true`
- Actual rollback performed: `false`
- Canon status: `false`

## Candidate Downstream Targets

| Target class | Recommended next | Mutation behavior | Rollback descriptor needed |
| --- | --- | --- | --- |
| Profile | `true` | Future-only Profile object update/create that links the brass moth key label to the source span without canonizing unresolved truth. | `rollback-downstream-target-moth-key-label-profile-to-claim-ledger-only` |
| Timeline | `false` | Future-only Timeline entry only after explicit sequence/order approval. | `rollback-downstream-target-moth-key-label-timeline-to-claim-ledger-only` |
| Story Seed | `false` | Deferred story-seed mutation; no Story Seed target is selected by the current readbacks. | `rollback-downstream-target-moth-key-label-story-seed-to-claim-ledger-only` |
| Canon decision | `false` | Human-only canon decision after unresolved dependencies are handled. | `rollback-downstream-target-moth-key-label-canon-decision-to-non-canon` |

Recommended next downstream target class: `Profile`. It is narrower than Timeline, Story Seed, or Canon decision work because it can link the retained Claim Ledger row to an object profile without deciding story truth.

## Missing User Authorization

Downstream mutation remains blocked until freeform user authorization supplies:

- selected downstream target class
- mutation behavior approval
- rollback owner approval
- rollback descriptor approval
- before/after readback requirement
- unresolved dependency handling for brass moth truth and Toma fate
- canon decision boundary
- provider/API/credential/publishing scope confirmation
- confirmation that no additional claim is included

## Explicit Non-Approval Fields

- Profile mutation approved: `false`
- Timeline mutation approved: `false`
- Story Seed mutation approved: `false`
- Canon decision approved: `false`
- Canon approved: `false`
- Provider approved: `false`
- Publishing approved: `false`
- External API approved: `false`
- Production generation approved: `false`

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-downstream-target-authorization-packet artifacts/production-claim-ledger-rollback-rehearsal-result.json artifacts/downstream-target-authorization-packet-result.json
```

Expected readback:

- `artifact_id`: `fff-downstream-target-authorization-packet-001`
- `summary.candidates_inspected`: `1`
- `summary.claim_ledger_adopted_rows_inspected`: `1`
- `summary.rollback_descriptors_verified`: `1`
- `summary.production_claim_ledger_rows_retained`: `1`
- `summary.downstream_target_classes_proposed`: `4`
- `summary.recommended_next_target_classes`: `1`
- `summary.downstream_mutations_performed`: `0`
- `summary.profile_mutation_count`: `0`
- `summary.timeline_mutation_count`: `0`
- `summary.story_seed_mutation_count`: `0`
- `summary.canonized_claims`: `0`
- `summary.user_authorization_required`: `true`
- provider, external call, credential, publishing, and production generation flags remain false
