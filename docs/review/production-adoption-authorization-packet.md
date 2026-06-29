# Production Adoption Authorization Packet

Artifact: `fff-production-adoption-authorization-packet-001`

This readback prepares a freeform user authorization packet for possible future production adoption of exactly one rollback-rehearsed claim: `multi-claim-moth-key-label`. It is a packet only. It is not production adoption, not production rollback, not canon, not Profile / Claim Ledger / Timeline / Story Seed mutation, and not a provider or publishing path.

## Target Readback

- Target claim id: `multi-claim-moth-key-label`
- Source span id: `multi-x-object-brass-moth-key`
- Current candidate status after rollback rehearsal: `adoption_candidate_dry_run`
- Sandbox adoption evidence: `fff-sandbox-adoption-mutation-one-claim-001`
- Rollback rehearsal evidence: `fff-sandbox-adoption-rollback-rehearsal-001`
- Source-backed status: `true`
- Rollback rehearsed: `true`
- Production adoption approved: `false`
- Canon approved: `false`

## Proposed Production Targets

| Target class | Proposed mutation behavior | Rollback owner |
| --- | --- | --- |
| Profile | Future-only update or create a Profile object entry that links the brass moth key label to the original source span without canonizing unresolved truth. | Author approves rollback; implementer removes the profile mutation and preserves the source evidence trail. |
| Claim Ledger | Future-only accept the source-backed claim into the production Claim Ledger while keeping canon approval separate and preserving source refs. | Author approves rollback; implementer returns the claim to held/adoption-candidate state with audit trail. |
| Timeline | Future-only add or update a Timeline entry if the user confirms a sequence/order implication for the moth key label. | Author approves rollback; implementer removes the timeline mutation and keeps source references readable. |
| Story Seed | Deferred future-only story-seed mutation; no current story-seed target is selected by the existing readbacks. | Author approves rollback; implementer removes the story-seed mutation and leaves Claim Ledger evidence intact. |

Recommended first production target class: `Claim Ledger`. It is the narrowest first production target because the source-backed object label is already represented as a held claim; Profile, Timeline, and Story Seed writes can remain downstream of explicit approval.

## Missing User Authorization

Production mutation remains blocked until freeform user authorization supplies:

- production adoption approval
- selected production target class
- mutation behavior acceptance
- production rollback owner
- production rollback descriptor
- canon decision
- unresolved dependency review for brass moth truth and Toma fate
- provider/API/credential/publishing scope confirmation

## Explicit Non-Approval Fields

- Production adoption approved: `false`
- Canon approved: `false`
- Provider approved: `false`
- Publishing approved: `false`
- External API approved: `false`

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-production-adoption-authorization-packet artifacts/sandbox-adoption-rollback-rehearsal-result.json artifacts/production-adoption-authorization-packet-result.json
```

Expected readback:

- `artifact_id`: `fff-production-adoption-authorization-packet-001`
- `summary.candidates_inspected`: `1`
- `summary.rollback_rehearsed_candidates`: `1`
- `summary.production_target_classes_proposed`: `4`
- `summary.production_mutations_performed`: `0`
- `summary.canonized_claims`: `0`
- `summary.user_authorization_required`: `true`
- provider, external call, credential, publishing, and production generation flags remain false
