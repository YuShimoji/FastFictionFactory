# Provider Adapter Authorization Readiness

Artifact: `fff-provider-adapter-authorization-readiness-001`

Current status: preserved auxiliary readback under the active `fff-contradictory-claim-guard-001` surface. This slice does not implement a provider adapter, provider authorization flow, credential storage, endpoint setup, transport, external call, database persistence, publishing, production sync, AI video generation, downstream adoption, or canon promotion.

The machine-readable readback lives at `artifacts/provider-adapter-authorization-readiness-result.json`.

## Purpose

The existing `fff-provider-envelope-readiness-no-call-001` proves that a provider-shaped envelope can stay local, no-call, no-credential, and source-tracked. This slice records the next boundary: what must be explicitly authorized before a real provider adapter can start.

## Current Boundary

| Area | Current state | Effect |
| --- | --- | --- |
| Provider choice | Unauthorized | No provider or model is selected in this slice. |
| Credentials and secrets | Unauthorized | No credential name, token, secret, OAuth, or auth header is created, requested, stored, or printed. |
| Endpoint | Unauthorized | No provider endpoint is configured. |
| Transport | Unauthorized | No network client, retry loop, timeout transport, or provider adapter implementation is added. |
| External call permission | Unauthorized | Existing provider envelope remains no-call. |
| Persistence or publication | Unauthorized | No database, publishing, production sync, upload, or AI video path is added. |

Allowed now:

- Local deterministic adapter fixtures.
- Existing no-call provider envelope readback.
- Local mock or sample provider-shaped payloads only.
- Extraction Contract validation.
- Source/routing/hold checks.
- Downstream gate readback with 0 adopted candidates.
- Contradictory and malformed source-span guards.

## Future Authorization Triggers

A real provider adapter can begin only after all of these are explicit:

- Provider and model choice.
- Credential storage and secret-handling approval.
- Endpoint and transport behavior.
- External call permission.
- Timeout and retry policy for real transport.
- Confirmation that all local validation gates remain passing before importing provider output.

## Decision Packet

| Option | State | Effect | Requirement |
| --- | --- | --- | --- |
| Stay local deterministic only | Available now | Continue with fixtures and local validation only. | None. |
| No-call mock provider envelope | Already available | Exercise provider-shaped payload checks without provider access. | No credentials, endpoint, or external call. |
| Real provider adapter later | Blocked | Implement actual provider-backed extraction. | Explicit provider, credential, endpoint, transport, external-call, timeout, and retry authorization. |

Recommendation: stay local deterministic until explicit provider authorization is given. If provider work is requested later, accept freeform authorization text and keep the schema owned by the agent rather than asking for a fixed form.

## Review Memory Readback

| Item | Result |
| --- | --- |
| Target | `fff-provider-envelope-readiness-no-call-001` |
| Axis | `provider_adapter_authorization_readiness` |
| Prior review count | `0` |
| What changed | A separate authorization readiness readback now states which provider/API actions remain unauthorized before real adapter work. |
| What this review decides | No user decision is needed now; it separates no-call readiness from future provider execution authorization. |
| Not asking | No provider choice, credential value, endpoint setup, transport implementation, external call approval, DB persistence, publishing, production sync, AI video, downstream adoption, canon promotion, or contradictory-claim truth decision. |
| Next non-redundant axis | Real provider adapter implementation only after explicit provider, credential, endpoint, transport, and external-call authorization. |

No Review Card or Operator Observation Card is emitted. User-side work remains none.

## Validation Contract

This slice is complete when:

- `node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness artifacts/provider-envelope-readiness-no-call-result.json artifacts/provider-adapter-authorization-readiness-result.json` passes.
- The existing no-call provider envelope remains passing with `providerConfigured=false`, `externalCallAttempted=false`, and `credentialsTouched=false`.
- Downstream source-span adoption remains a readback with 0 adopted Profile / Claim / Timeline candidates.
- Contradictory claims remain held.
- Malformed/missing source-span cases still produce 0 accepted routed candidates.
- Routing, translated audit, very broad audit, and source-pack readbacks remain passing.

## Readiness Separation

| Readiness | State |
| --- | --- |
| Slice completion | Complete when the readiness JSON passes. |
| Provider readiness | Authorization boundary is ready; real provider work remains blocked. |
| Production readiness | Low / not accepted. |
| Canon readiness | Not accepted for human-owned truth decisions. |

