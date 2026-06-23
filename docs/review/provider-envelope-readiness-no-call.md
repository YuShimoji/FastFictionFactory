# Provider Envelope Readiness No-Call Gate

Artifact: `fff-provider-envelope-readiness-no-call-001`

Current status: preserved auxiliary readback under the active `fff-contradictory-claim-guard-001` surface. This gate defines the envelope a future provider adapter must satisfy before any real provider call, credential flow, provider endpoint, durable persistence, production sync, publishing adapter, AI video generation, or final canon decision exists.

## Purpose

The prior `fff-model-api-boundary-spec-001` recorded the model/API boundary at specification level. This slice makes the next step concrete without crossing that boundary: a local JSON envelope can declare provider/run metadata, carry candidate Extraction Contract output, and bind itself to the existing validator and guard chain while still proving that no provider has been configured or called.

The machine-readable fixture is `artifacts/provider-envelope-readiness-no-call.example.json`. The readback result is `artifacts/provider-envelope-readiness-no-call-result.json`.

## What The Envelope Must Carry

| Area | Required shape | Current no-call readback |
| --- | --- | --- |
| Provider/run metadata | A local run id, unconfigured provider/model slots, transport status, and explicit no-call flags. | `providerConfigured=false`, `providerName=null`, `modelName=null`, `externalCallAttempted=false`, `credentialsTouched=false`, `endpoint=null`. |
| Credential boundary | No credential names, values, storage, tokens, authorization headers, provider endpoint, or hidden secret material. | The smoke checks credential-like fields and finds none. |
| Extraction output | Candidate output is nested as `extractionOutput.candidateExtractionContract` and must validate as `fff.extractionContract.v1`. | The fixture validates locally and remains `outputIsProjectState=false`, `directStateMutationAllowed=false`, and `adoptedCanonOutputCreated=false`. |
| Source-span readiness | Every carried element must keep source refs and usable source spans before downstream consideration. | 4 carried elements are source-tracked and held. |
| Existing guards | Malformed/missing span, contradictory claim, downstream adoption, source-pack, and validator evidence stay referenced and passing. | All referenced guard result paths remain bound and pass. |
| Human authority | Toma fate, brass moth truth, and Council motive remain held and freeform human review stays the source of truth. | Human-owned elements remain held; no final canon output exists. |

## Validation Contract

This slice is complete when:

- `node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call artifacts/provider-envelope-readiness-no-call.example.json artifacts/provider-envelope-readiness-no-call-result.json` passes.
- `node tools/fff-state.mjs validate-extraction` can validate the candidate contract carried inside the envelope through the provider-envelope smoke.
- The existing malformed/missing source-span guard, contradictory claim guard, downstream source-span adoption gate, source-span review pack, validator matrix, and model/API boundary remain passing and referenced.
- The active Review Hub identity remains `fff-contradictory-claim-guard-001`; this provider envelope is readiness evidence, not provider integration.
- Review Hub, manifest, current status, and artifact inventory show that this is no-call, no-credential, no-provider, no-production, no-final-canon readiness only.

## Review Memory Readback

No Review Card or Operator Observation Card is emitted. User-side work is none because the gate only proves local shape and boundary preservation. A future review becomes useful only if the next step asks to choose a provider, approve credentials, implement transport, or judge a story truth.

This readback is not asking for:

- provider choice
- credentials
- model/API call approval
- database persistence
- publishing or production sync
- AI video generation
- final decisions for Toma fate, brass moth truth, Council motive, or contradictory claim truth

## Boundaries

This artifact preserves `fff-contradictory-claim-guard-001`, `fff-downstream-source-span-adoption-gate-001`, `fff-malformed-missing-span-guard-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, `fff-local-extraction-adapter-expansion-001`, `fff-extraction-validator-hardening-001`, `fff-extraction-contract-001`, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API provider call, credential setup, provider endpoint, database persistence, publishing, production sync, AI video generation, downstream adoption implementation, adopted canon output, or final story truth decision is added by this slice.
