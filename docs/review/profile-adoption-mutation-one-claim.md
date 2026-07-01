# Profile Adoption Mutation One Claim

Artifact: `fff-profile-adoption-mutation-one-claim-001`

This readback records the user-authorized Profile-only production mutation for exactly one retained Claim Ledger claim: `multi-claim-moth-key-label`.

It is not a Timeline mutation, not a Story Seed mutation, not canonization, not a provider/API implementation, not credential work, not publishing, and not production generation. It does not adopt any additional claim.

## Authorization Readback

- Authorized path: `A`
- Target claim id: `multi-claim-moth-key-label`
- Source span id: `multi-x-object-brass-moth-key`
- Production target class: `Profile`
- Existing Profile reference: `profile-brass-moth`
- New Profile adoption target id: `multi-profile-brass-moth-key`
- Mutation scope: exactly one claim-derived Profile annotation / fact candidate
- Expected transition: `claim_ledger_adopted -> profile_adopted_noncanon`
- Rollback descriptor required: `true`
- Before/after readback required: `true`

## Before / After

| Field | Before | After |
| --- | --- | --- |
| Claim Ledger status | `production_claim_ledger_adopted` | `production_claim_ledger_adopted` |
| Profile adoption status | `not_profile_adopted` | `profile_adopted_noncanon` |
| Profile mutation count | `0` | `1` |
| Claim Ledger additional adoption count | `0` | `0` |
| Timeline mutation count | `0` | `0` |
| Story Seed mutation count | `0` | `0` |
| Canon status | `false` | `false` |

## Profile Mutation Row

- Row id: `profile-adoption-mutation-row-moth-key-label`
- Target Profile id: `multi-profile-brass-moth-key`
- Existing Profile reference id: `profile-brass-moth`
- Source span locator: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md#char=294-327`
- Behavior: add one non-canon Profile annotation linking the retained Claim Ledger row to the brass moth key profile surface while preserving unresolved truth.
- Fact candidate id: `profile-fact-moth-key-label`
- Fact candidate status: `profile_adopted_noncanon`

## Rollback Descriptor

- Rollback token: `rollback-profile-adoption-moth-key-label-to-claim-ledger-only`
- Rollback scope: Profile production annotation row only
- Rollback target status: `production_claim_ledger_adopted`
- Rollback owner: author approves rollback; implementer removes the Profile annotation row while preserving the Claim Ledger row and source evidence.

Rollback requires preserving the source span, preserving the production Claim Ledger row, keeping Timeline and Story Seed counts at zero, keeping canon false unless separately authorized, and keeping provider/API/credential/publishing/production generation routes closed.

## Boundary Summary

- Profile mutation rows: `1`
- Profile adopted non-canon claims: `1`
- Claim Ledger additional adoption count: `0`
- Timeline mutation count: `0`
- Story Seed mutation count: `0`
- Canonized claims: `0`
- Provider configured: `false`
- External call attempted: `false`
- Credentials touched: `false`
- Publishing opened: `false`
- Production generation opened: `false`

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim artifacts/downstream-target-authorization-packet-result.json artifacts/profile-adoption-mutation-one-claim-result.json
```

Expected readback:

- `artifact_id`: `fff-profile-adoption-mutation-one-claim-001`
- `summary.candidates_inspected`: `1`
- `summary.claim_ledger_adopted_rows_inspected`: `1`
- `summary.profile_mutation_rows`: `1`
- `summary.profile_adopted_noncanon_claims`: `1`
- `summary.profile_mutation_count`: `1`
- `summary.claim_ledger_additional_adoption_count`: `0`
- `summary.timeline_mutation_count`: `0`
- `summary.story_seed_mutation_count`: `0`
- `summary.canonized_claims`: `0`
- `summary.rollback_descriptors_present`: `1`
- provider, external call, credential, publishing, and production generation flags remain false
