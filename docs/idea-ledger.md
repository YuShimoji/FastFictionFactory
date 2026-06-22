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
- State: Extraction Contract implemented in `fff-extraction-contract-001`; validator hardening implemented in `fff-extraction-validator-hardening-001`; deterministic local adapter spike implemented in `fff-local-extraction-adapter-spike-001`; deterministic adapter expansion implemented in `fff-local-extraction-adapter-expansion-001`; source-span routing review pack implemented in `fff-source-span-routing-review-pack-001`; Review Hub IA mode split implemented in `fff-review-hub-ia-mode-split-001`; Review Procedure Lock implemented in `fff-review-procedure-lock-001`; Review Memory Dedup implemented in `fff-review-memory-dedup-001`; model/API extraction adapter not started.
- Owner: Product/AI implementer.
- Next move: Apply the Review Dedup Gate before asking for more review. Move only to a non-redundant axis such as source-span usefulness/routing quality with changed evidence or decision value, then revise deterministic spans/routing, add one missing fixture class, or design a model/API adapter behind `node .\tools\fff-state.mjs validate-extraction`, the fixture matrix, and the adapter expansion smoke guards before adding any model/API behavior.

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
