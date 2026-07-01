# Idea Ledger

## Residual Work

### Timeline View

- Purpose: Separate story order, calendar time, historical references, and production order.
- Effect: Makes sequence claims reviewable before outline or video packaging decisions.
- Requirements: Keep it local-only, use existing review states, and avoid database or publishing work.
- State: Implemented in `fff-timeline-view-001`.
- Owner: Product implementer, with human author review for canon-sensitive sequence decisions.
- Next move: Keep Timeline entries linked into Profile/Ghost and future extraction-contract checks.

### Profile Page And Ghost Node Flow

- Purpose: Make characters, objects, and uncertain entities easier to inspect across claims and timelines.
- Effect: Improves review ergonomics for unresolved identity, fate, and source relationships.
- Requirements: Must not finalize Toma fate, brass moth truth, or Council motive.
- State: Implemented in `fff-profile-ghost-flow-001`.
- Owner: Product implementer for UI; human author for final story authority.
- Next move: Use profile/ghost records as source-tracked extraction contract fixtures before adding any model/API behavior.

### Real Extraction Engine

- Purpose: Replace deterministic mock extraction with an actual extraction workflow.
- Effect: Turns raw memo intake into generated candidates instead of static seed data.
- Requirements: Needs source tracking, schema validation, review controls, and clear generated-vs-human authority boundaries.
- State: Extraction Contract implemented in `fff-extraction-contract-001`; validator hardening implemented in `fff-extraction-validator-hardening-001`; deterministic local adapter spike implemented in `fff-local-extraction-adapter-spike-001`; deterministic adapter expansion implemented in `fff-local-extraction-adapter-expansion-001`; source-span routing review pack implemented in `fff-source-span-routing-review-pack-001`; source-span quality audit implemented in `fff-source-span-quality-audit-001`; ambiguous routing resolution implemented in `fff-ambiguous-routing-resolution-001`; routing policy regression hardening implemented in `fff-routing-policy-regression-hardening-001`; broad source-span split implemented in `fff-broad-span-split-001`; weak-span repair implemented in `fff-weak-span-repair-001`; sparse bullet fixture probe implemented in `fff-missing-fixture-class-probe-001`; multilingual memo fixture coverage implemented in `fff-remaining-fixture-coverage-one-class-001`; translated memo fixture audit implemented in `fff-translated-memo-fixture-audit-001`; translation provenance/source-span readback implemented in `fff-translation-provenance-source-span-readback-001`; translation policy source-of-truth boundary implemented in `fff-translation-policy-source-of-truth-boundary-001`; minimal translated memo fixture implemented in `fff-translated-memo-fixture-minimum-001`; held claim adoption preflight implemented in `fff-held-claim-adoption-preflight-001`; downstream adoption semantics design implemented in `fff-downstream-adoption-semantics-design-001`; adoption candidate ledger dry-run implemented in `fff-adoption-candidate-ledger-dry-run-001`; sandbox adoption mutation one-claim implemented in `fff-sandbox-adoption-mutation-one-claim-001`; sandbox adoption rollback rehearsal implemented in `fff-sandbox-adoption-rollback-rehearsal-001`; production adoption authorization packet implemented in `fff-production-adoption-authorization-packet-001`; production Claim Ledger adoption one-claim implemented in `fff-production-claim-ledger-adoption-one-claim-001`; production Claim Ledger rollback rehearsal implemented in `fff-production-claim-ledger-rollback-rehearsal-001`; downstream target authorization packet implemented in `fff-downstream-target-authorization-packet-001`; Profile adoption mutation one-claim implemented in `fff-profile-adoption-mutation-one-claim-001`; very broad source-span shape audit implemented in `fff-very-broad-source-span-shape-audit-001`; malformed/missing source-span guard implemented in `fff-malformed-missing-span-guard-001`; downstream source-span adoption gate implemented in `fff-downstream-source-span-adoption-gate-001`; downstream adoption gate scope lock implemented in `fff-downstream-adoption-gate-scope-lock-001`; contradictory claim guard implemented in `fff-contradictory-claim-guard-001`; provider-envelope readiness no-call implemented in `fff-provider-envelope-readiness-no-call-001`; Review Hub IA mode split implemented in `fff-review-hub-ia-mode-split-001`; Review Procedure Lock implemented in `fff-review-procedure-lock-001`; Review Memory Dedup implemented in `fff-review-memory-dedup-001`; model/API extraction adapter not started.
- Owner: Product/AI implementer.
- Next move: Keep the contradictory claim guard, downstream source-span adoption gate, downstream scope lock, provider-envelope readiness no-call gate, multilingual fixture readback, translated memo audit, translation provenance/source-span readback, translation policy source-of-truth boundary, minimal translated memo fixture, held claim adoption preflight, downstream adoption semantics design, adoption candidate ledger dry-run, sandbox adoption mutation one-claim, sandbox adoption rollback rehearsal, production adoption authorization packet, production Claim Ledger adoption one-claim, production Claim Ledger rollback rehearsal, downstream target authorization packet, Profile adoption mutation one-claim, and very broad source-span shape audit passing before any future provider-backed adapter or further downstream adoption. Move only to Timeline / Story Seed / canon adoption, actual production rollback for `multi-claim-moth-key-label`, or additional claim adoption after separate explicit freeform authorization for target class, mutation behavior, rollback owner, rollback descriptor, and unresolved dependency handling; broader translated memo coverage when it adds meaningful rows beyond the two-row minimum; explicit provider adapter implementation after authorization for provider choice, credentials, endpoint, and transport behavior; or broad-shape fixture work only after adapter/source output changes create a concrete coverage gap. Keep any model/API adapter behind `node .\tools\fff-state.mjs validate-extraction`, the fixture matrix, the adapter expansion smoke guards, `node .\tools\fff-state.mjs smoke-routing-policy`, `node .\tools\fff-state.mjs smoke-malformed-missing-span-guard`, `node .\tools\fff-state.mjs smoke-downstream-source-span-adoption-gate`, `node .\tools\fff-state.mjs smoke-contradictory-claim-guard`, `node .\tools\fff-state.mjs smoke-provider-envelope-readiness-no-call`, `node .\tools\fff-state.mjs smoke-remaining-fixture-coverage-one-class`, `node .\tools\fff-state.mjs smoke-translated-memo-fixture-audit`, `node .\tools\fff-state.mjs smoke-translation-provenance-source-span-readback`, `node .\tools\fff-state.mjs smoke-translation-policy-source-of-truth-boundary`, `node .\tools\fff-state.mjs smoke-translated-memo-fixture-minimum`, `node .\tools\fff-state.mjs smoke-held-claim-adoption-preflight`, `node .\tools\fff-state.mjs smoke-downstream-adoption-semantics-design`, `node .\tools\fff-state.mjs smoke-adoption-candidate-ledger-dry-run`, `node .\tools\fff-state.mjs smoke-sandbox-adoption-mutation-one-claim`, `node .\tools\fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal`, `node .\tools\fff-state.mjs smoke-production-adoption-authorization-packet`, `node .\tools\fff-state.mjs smoke-production-claim-ledger-adoption-one-claim`, `node .\tools\fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal`, `node .\tools\fff-state.mjs smoke-downstream-target-authorization-packet`, `node .\tools\fff-state.mjs smoke-profile-adoption-mutation-one-claim`, `node .\tools\fff-state.mjs smoke-very-broad-source-span-shape-audit`, and explicit user authorization.

### Extraction Validator Hardening

- Purpose: Prevent unsafe extraction payloads from entering review surfaces before adapter work.
- Effect: Catches missing source refs, missing extraction identity fields, invalid element types, unsafe human-owned decision adoption, direct visual-asset-to-claim routing, auto-canon leaks, missing review-safe defaults, missing human authority boundaries, and missing high-risk warnings.
- Requirements: Keep validation zero-dependency, local-first, fixture-backed, and non-canon-producing.
- State: Implemented in `fff-extraction-validator-hardening-001` with fixtures under `artifacts/extraction-negative-fixtures/` and smoke evidence at `artifacts/extraction-validator-smoke-result.json`.
- Owner: Product/AI implementer for validator and adapter shape; human author for final story authority.
- Next move: Keep the validator fixture matrix as a required gate for adapter expansion and any future model/API adapter.

### Freeform Review Intake

- Purpose: Let user review arrive as natural feedback instead of fixed accept/reject phrases.
- Effect: Keeps human review expressive while still allowing the agent to continue reversible scoped work when interpretation confidence is medium or high.
- Requirements: Use Review Cards when review is required, record Review Debt when review is useful but non-blocking, and treat freeform user review as source of truth.
- State: Documented in `docs/review/freeform-review-intake.md` and reflected in `fff-extraction-contract-001`.
- Owner: Agent for parsing and reversible updates; human reviewer for review truth.
- Next move: Exercise the intake rule against extraction contract review feedback before building model/API behavior.

### Durable Project Database

- Purpose: Persist projects beyond local browser state and JSON files.
- Effect: Enables multi-session project continuity without manual import/export.
- Requirements: Needs schema decisions, migration policy, backup/export path, and no silent canon promotion.
- State: Not started.
- Owner: Product implementer.
- Next move: Decide whether the first durable store is file-backed, SQLite, or browser storage expansion.

### Publishing And Video Generation

- Purpose: Eventually package reviewed fiction outputs for YouTube or AI-video workflows.
- Effect: Connects reviewed outlines to production surfaces.
- Requirements: Requires final rights review, credential isolation, production approval gates, and explicit human release decisions.
- State: Out of scope for the current MVP.
- Owner: Human product owner plus production implementer.
- Next move: Do not start until review workflow and source/canon gates are accepted.
