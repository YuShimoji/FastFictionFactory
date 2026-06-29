# Adoption Candidate Ledger Dry-Run

Artifact: `fff-adoption-candidate-ledger-dry-run-001`

This readback records the current held downstream adoption candidate in a non-mutating ledger dry-run. It connects `fff-downstream-adoption-semantics-design-001` to the concrete candidate from `fff-held-claim-adoption-preflight-001` without adopting, canonizing, publishing, or writing any Profile / Claim / Timeline / Story Seed state.

## Candidate Row

- Source span id: `multi-x-object-brass-moth-key`
- Held claim id: `multi-claim-moth-key-label`
- Prior claim status: `hold`
- Semantic transition attempted: `hold -> adoption_candidate`
- Ledger status: `adoption_candidate_dry_run`
- Actual adoption status: `false`
- Canon status: `false`
- Future-only target classes: `profile`, `claim`, `timeline`

## Mutation Boundary

The dry-run must keep all mutation counts at zero:

- Profile mutation count: `0`
- Claim mutation count: `0`
- Timeline mutation count: `0`
- Story Seed mutation count: `0`
- Actually adopted claims: `0`
- Canonized claims: `0`
- Provider configured: `false`
- External call attempted: `false`
- Credentials touched: `false`

## Evidence Before Real Adoption

Real downstream adoption remains blocked until a later explicit mutation authorization provides human approval, target-class selection, source refs and original source-span readback, contradiction / malformed-span / downstream-gate / provider-boundary checks, and a rollback condition with owner.

## Validation

Run:

```powershell
node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run artifacts/downstream-adoption-semantics-design-result.json artifacts/adoption-candidate-ledger-dry-run-result.json
```

Expected readback:

- `artifact_id`: `fff-adoption-candidate-ledger-dry-run-001`
- `summary.candidates_inspected`: `1`
- `summary.ledger_dry_run_rows`: `1`
- `summary.eligible_semantic_candidates`: `1`
- all adoption, canon, Profile / Claim / Timeline / Story Seed mutation, provider, external call, and credential counts remain zero or false
