# Model/API Boundary Specification

`fff-model-api-boundary-spec-001` defines the review-safe boundary for any future model/API extraction adapter. This is a specification and readback slice only: it does not add model/API calls, credentials, provider configuration, database persistence, publishing behavior, production sync, AI video generation, or final canon decisions.

## Scope

- Keep `fff-local-extraction-adapter-expansion-001` as the preserved local fixture proof.
- Keep `fff-local-extraction-adapter-spike-001`, `fff-extraction-validator-hardening-001`, and `fff-extraction-contract-001` as required gates.
- Define the envelope a future provider-facing adapter must satisfy before its output can be validated as `fff.extractionContract.v1`.
- Surface timeout, retry, failure, and fallback policy for local review.
- Preserve Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

## Input Boundary

A future model/API adapter may receive only local, reviewer-visible extraction input:

- Raw memo text or selected local fixture text.
- Declared `SourceRef` records and source locators.
- A local run id, generator label, and extraction mode.
- Review-safe configuration that restates the required validator gates.

It must not receive credentials in exported artifacts, hidden project state, release assets, database records, publishing targets, or production-only secrets. It must not mutate `artifacts/current-project-state.json`, browser UI state, Profile/Ghost Flow, Claim Ledger, Timeline View, or any durable storage directly.

## Output Boundary

A future provider response is not project state. It is only an untrusted candidate that must be transformed into an `ExtractionContract` payload with:

- `schemaVersion: "fff.extractionContract.v1"`.
- Source refs and source spans for every extracted element.
- Review-safe defaults with `defaultReviewStatus: "hold"`.
- `autoCanonPromotion: false` and `autoChronologyPromotion: false`.
- Human authority boundaries for Toma fate, brass moth truth, Council motive, and any other story-sensitive decision.
- Freeform review allowed as the human source of truth.
- Warnings and unresolved dependencies preserved for review.

The validated Extraction Contract can then be shown in local review. It still cannot adopt canon, write a database, publish, sync production, or finalize human-owned story decisions.

## Boundary Envelope

The example boundary envelope is `artifacts/model-api-boundary-envelope.example.json`. It describes provider-call status, allowed inputs, output contract, validation gates, failure modes, fallback behavior, and forbidden actions.

The envelope is intentionally not an extraction payload. It is a local review artifact that states what must be true before any future model/API adapter output can be trusted enough to enter the existing validator.

## Required Validation Gates

Before any future provider output can reach review surfaces:

1. Parse the provider response as JSON without recovery by hidden semantic inference.
2. Convert provider output into `fff.extractionContract.v1`.
3. Run `node .\tools\fff-state.mjs validate-extraction <payload>`.
4. Run `node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures`.
5. Keep the deterministic local adapter matrix passing through `node .\tools\fff-extract-local.mjs --matrix .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json`.
6. Confirm source refs resolve and source spans match local memo text.
7. Confirm visual assets route through Profile/Ghost or Timeline review before any claim-level story assertion.
8. Confirm all suggested review statuses default to `hold` for high-risk or human-owned decisions.
9. Confirm no candidate attempts to decide Toma fate, brass moth truth, or Council motive.
10. Confirm freeform review remains the human authority.

## Timeout And Retry Policy

- A future transport timeout must produce a review-held failure artifact, not a partial Extraction Contract.
- Automatic retries may only repeat the same local input for transient transport failures.
- A retry must not rewrite the memo, widen the source set, change human-owned decisions, or silently switch providers.
- A bounded retry count must be visible in the future smoke artifact.
- After retries are exhausted, the local fallback is manual/freeform review with no candidate adoption.

## Failure Modes

| Failure mode | Effect | Required fallback |
| --- | --- | --- |
| `auth_missing` | Provider cannot be called. | Stop before external call and keep local review/manual intake. |
| `external_call_blocked` | Slice or environment forbids provider access. | Record no-call status and keep deterministic fixtures as the gate. |
| `timeout` | Provider did not return in the allowed window. | Write failure readback, do not emit candidates. |
| `rate_limit` | Provider rejected request volume. | Stop or bounded retry with identical input; no provider switching by default. |
| `invalid_json` | Provider output cannot parse. | Preserve raw failure text only in a non-canon diagnostic artifact. |
| `schema_mismatch` | Output cannot become `fff.extractionContract.v1`. | Block review-surface import. |
| `source_ref_missing` | Candidate cannot point to declared source refs. | Block candidate until source is repaired. |
| `source_span_mismatch` | Candidate span does not match local text. | Block or hold with warning; never auto-adopt. |
| `unsafe_routing` | Candidate routes visual assets or story truth directly to the wrong surface. | Block until Profile/Ghost, Claim Ledger, or Timeline routing is corrected. |
| `human_owned_decision_attempt` | Candidate tries to decide protected story truth. | Block and report as human-owned boundary violation. |
| `overconfident_defaults` | Candidate suggests adopt/provisional where hold is required. | Block until review-safe defaults are restored. |

## Forbidden Actions

A future model/API adapter must not:

- Store or print secrets in artifacts, docs, exported JSON, screenshots, or browser state.
- Make external calls from this spec slice.
- Update project state directly.
- Bypass `validate-extraction` or the validator fixture matrix.
- Promote candidates to canon or chronology automatically.
- Finalize Toma fate, brass moth truth, or Council motive.
- Treat proof availability as release approval.
- Publish, upload, generate video, sync production, or write a durable database.

## Review Card

- Purpose: Define the model/API boundary before integration work.
- Effect: Future provider output must pass through the existing Extraction Contract validator and fixture matrix before local review.
- Requirements: JSON parse, boundary envelope parse, extraction payload validation, fixture matrix, source-span/source-ref audit, review-safe defaults, human-owned decision guards, and freeform review authority.
- State: Spec-only artifact ready for local review; no model/API adapter exists.
- Owner: Human author for story truth and future provider/credential decisions.
- Next move: Review the boundary envelope and decide whether the next implementation should be a no-network mock provider or an explicitly configured provider adapter behind the same gates.
