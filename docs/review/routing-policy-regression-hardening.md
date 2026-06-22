# Routing Policy Regression Hardening

Artifact: `fff-routing-policy-regression-hardening-001`

## Purpose

This slice hardens the routing policy resolved by `fff-ambiguous-routing-resolution-001` so future deterministic adapter changes cannot silently reintroduce the same ambiguous routing class. It does not ask for a general Review Hub review, does not start model/API behavior, and does not promote generated candidates into canon.

The machine-readable readback lives at `artifacts/routing-policy-regression-hardening-result.json`.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-ambiguous-routing-resolution-001` |
| Axis | `routing_policy_regression_hardening` |
| Prior review count | `0` |
| Prior signal | The routing-resolution slice recorded policy and checks but did not ask for user acceptance of final routing policy. |
| What changed | The resolved policy is now rechecked against the resolution artifact, source-span pack, and current adapter outputs. |
| Not asking | No general Review Hub review, no repeated ambiguous-routing review, no model/API approval, no production approval, no canon decision. |
| Next non-redundant axis | One missing fixture class if regression hardening later exposes drift. |

No Review Card is emitted. Review Debt is recorded because this is a machine/readback stabilization pass.

## Policy Checks

| Check | Policy | Current result |
| --- | --- | --- |
| `visual_direct_claim_guard` | Visual evidence must not create direct Claim targets. | Passed across resolution rows, source pack rows, and adapter outputs. |
| `human_review_hold_guard` | Unresolved or human-owned decision rows must route through Human Review and remain `hold`. | Passed for 3 unresolved-decision rows and current adapter outputs. |
| `claim_secondary_evidence_rule` | Claim usage stays secondary evidence unless a later safe policy explicitly changes it. | Passed for 5 secondary Claim evidence rows; no resolved row has Claim as primary. |
| `timeline_secondary_evidence_rule` | Timeline usage stays secondary evidence unless a later safe policy explicitly changes it. | Passed for 6 secondary Timeline evidence rows; no resolved row has Timeline as primary. |
| `source_reference_preservation` | Source reference rows remain source references, not claims. | Passed for source pack and adapter source-reference rows. |
| `unsafe_unclear_hold_rule` | Unsafe or unclear routing remains held, not adopted. | Passed with `non_held_review_defaults: 0` and `human_owned_decision_adopt_suggestions: 0`. |
| `adapter_drift_readback` | Resolved row ids must stay visible in source pack and adapter outputs. | Passed for all 7 resolved rows. |

## Regression Command

```powershell
node .\tools\fff-state.mjs smoke-routing-policy .\artifacts\ambiguous-routing-resolution-result.json .\artifacts\routing-policy-regression-hardening-result.json
```

The command checks:

- `artifacts/ambiguous-routing-resolution-result.json`
- `artifacts/source-span-routing-review-pack.json`
- `artifacts/local-extraction-adapter-output.json`
- `artifacts/extraction-adapter-outputs/*.json`
- manifest review memory for the prior routing-resolution artifact

## Readback Counts

The current result checks 7 resolved routing rows, 36 source-pack rows, 4 adapter payloads, and 48 adapter elements with 0 failures.

The active policy remains:

- Visual rows route to visual/profile review and optional timeline context, not direct Claim targets.
- Human-owned object rows route first to Profile/Ghost and remain held.
- Unresolved decisions route first to Human Review and remain held.
- Claim and Timeline routes in resolved rows are secondary evidence.
- Source references remain source references.
- Unsafe or unclear routing is held, not adopted.

## Review Debt

| Debt | Current state | Next move |
| --- | --- | --- |
| Missing fixture class | Regression hardening now catches drift in the current fixtures, but it does not add contradictory, malformed, multilingual, sparse, or provider-envelope fixtures. | Add one fixture class only if route drift or review evidence names a concrete missing shape. |
| Validator scope | `smoke-routing-policy` is a targeted readback command, not a broad schema migration. | Promote only the stable parts into general extraction validation if future adapters can violate them outside current fixtures. |
| Human routing judgment | Machine checks protect policy drift but do not mean human acceptance of final routing policy. | Ask for freeform review only if target, evidence, axis, or decision value changes. |

## Validation Contract

This slice is complete when:

- `artifacts/routing-policy-regression-hardening-result.json` parses and passes.
- `tools/fff-state.mjs smoke-routing-policy` passes.
- The active manifest validation command includes the routing regression smoke.
- Current status and artifact inventory point to this artifact.
- MkDocs strict build and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-ambiguous-routing-resolution-001`, `fff-source-span-quality-audit-001`, `fff-review-memory-dedup-001`, `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated general review request, or final canon decision is added by this slice.
