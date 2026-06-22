# Decision Log

## 2026-06-15

- Decision: Keep Fast Fiction Factory local-first for the current MVP.
  - Reason: The current artifact is a review workbench, not a production pipeline.
  - Effect: Static HTML, JSON state files, and local smoke evidence are the source of review truth.

- Decision: Treat Claim Ledger adoption as local review state, not final human canon.
  - Reason: Toma fate, brass moth truth, and Council motive remain human-owned unresolved decisions.
  - Effect: Claims can be grouped, filtered, and marked, but canon authority stays outside the prototype.

- Decision: Align exported state JSON with `fff-claim-ledger-001`.
  - Reason: The UI and docs had advanced to the Claim Ledger slice while exported JSON still contained the older 3-claim shape.
  - Effect: `artifacts/sample-project-state.json` and `artifacts/current-project-state.json` now carry 9 Claim Ledger claims and pass `tools/fff-state.mjs validate`.

- Decision: Preserve a thin repo-local agent entry point.
  - Reason: Future work should read the repo context without turning `AGENTS.md` into a status document.
  - Effect: `AGENTS.md` points to current docs and keeps project instructions separate from history.

- Decision: Add a local Markdown docs view for audit and browser-assisted translation checks.
  - Reason: Project context was spread across multiple Markdown files, and another terminal needed a single restartable map without rewriting source specifications.
  - Effect: `mkdocs.yml`, `docs/index.md`, `docs/project-overview.md`, `docs/local-view/`, and `tools/generate-doc-nav.mjs` provide a local tree view, original-source wrappers, a project overview map, screenshot locations, and a turn-count-based development plan.

## 2026-06-18

- Decision: Treat Extraction Contract validator hardening as the active artifact before adapter work.
  - Reason: A future adapter needs a local pass/fail gate before generated candidates can affect Profile/Ghost Flow, Claim Ledger, or Timeline View.
  - Effect: `fff-extraction-validator-hardening-001` adds standalone extraction validation commands, negative fixtures, fixture matrix smoke evidence, updated Visual Review Hub evidence, and active manifest/status handoff context.

- Decision: Keep validator failures review-safe rather than canon-producing.
  - Reason: Missing source refs, overconfident human-owned decisions, direct visual-asset-to-claim routing, and auto-canon defaults are adapter risks, not story truths.
  - Effect: Toma fate, brass moth truth, and Council motive remain unresolved human-owned decisions; generated confidence and fixture coverage do not imply final canon.

## 2026-06-20

- Decision: Expand the local deterministic adapter through a fixture matrix before model/API extraction work.
  - Reason: The single-sample adapter proved the contract path, but source-span usefulness, routing safety, and review-held defaults need multi-memo regression coverage before generated candidates can safely grow.
  - Effect: `fff-local-extraction-adapter-expansion-001` adds local fixture memos, per-fixture adapter outputs, aggregate source/routing smoke evidence, and Review Hub/manifest/status updates while preserving no model/API behavior and no final canon decisions for Toma fate, brass moth truth, or Council motive.

- Decision: Keep model/API extraction behind a spec-only boundary before provider implementation.
  - Reason: Future provider output needs an envelope, validation gates, failure policy, fallback behavior, and forbidden-action list before any external call or credential flow is allowed.
  - Effect: `fff-model-api-boundary-spec-001` records the boundary doc, envelope example, and smoke result while preserving no model/API call, no credentials, no database persistence, no publishing, and no final canon decisions.

- Decision: Add a source-span routing review pack before freeform review and before model/API adapter work.
  - Reason: Reviewing the three fixture outputs as a span/routing supervision pack is more efficient than asking for unstructured review against raw JSON and smoke output.
  - Effect: `fff-source-span-routing-review-pack-001` adds a generated pack artifact, Review Hub section, review doc, manifest/status/handoff updates, and Review Debt categories while preserving `fff-model-api-boundary-spec-001`, held defaults, source refs, human-owned decision guards, and no model/API behavior.

## 2026-06-22

- Decision: Split the Review Hub into review modes before continuing adapter work.
  - Reason: Freeform UI review found the one-page hub too vertically long, English-first, conceptually layered between story review and project governance, and awkward because the Raw Story Memo panel used sticky behavior.
  - Effect: `fff-review-hub-ia-mode-split-001` adds Story Review, Source Audit, Project Cockpit, and Artifacts modes, Japanese-facing display labels, non-sticky Raw Story Memo behavior, collapsed source audit details, updated visual evidence, and smoke evidence while preserving `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, freeform review, and human-owned canon boundaries.

- Decision: Lock the review procedure before model/API implementation.
  - Reason: Future review checkpoints need stable identity, access, screenshot, contact-sheet, mode-purpose, optional-review, required-review, and Review Debt guidance that does not depend on prior chat context.
  - Effect: `fff-review-procedure-lock-001` adds `docs/review/review-procedure.md`, updates the Review Hub Artifacts mode, refreshes manifest/status/artifact inventory access paths, adds a shell launcher, expects mode-specific screenshots, and keeps model/API calls, credentials, database persistence, publishing, production sync, AI video generation, and final canon decisions out of scope.

- Decision: Add review memory and a dedup gate before asking for more review.
  - Reason: Positive diagnostic signals should not be re-requested as the same target/evidence/axis, and they should not silently expand into production acceptance, source-span quality acceptance, model/API approval, or canon approval.
  - Effect: `fff-review-memory-dedup-001` adds `docs/review/review-memory-dedup.md`, manifest-level `review_memory`, Acceptance Ladder, Review Dedup Gate, Non-Redundant Review Card requirements, and smoke evidence while preserving freeform review and no model/API behavior.

- Decision: Audit source-span usefulness and routing quality before revising adapter or model/API behavior.
  - Reason: The source-span routing review pack was valid, but validity alone did not show whether spans were useful, overly broad, weak, missing source refs, ambiguously routed, or safely held around human-owned decisions.
  - Effect: `fff-source-span-quality-audit-001` classifies all 36 review-pack rows, records 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows without asking for a repeated general Review Hub review.

- Decision: Resolve ambiguous source-span routing into explicit primary routes and held defaults.
  - Reason: The 7 ambiguous routing rows needed a local route policy before any further fixture, validator, or future model/API adapter work could safely use the pack.
  - Effect: `fff-ambiguous-routing-resolution-001` resolves the 7 rows into 3 Profile-primary routes, 1 Visual-primary route, and 3 Human Review holds; Claim and Timeline remain secondary evidence where needed, `local-x-visual-observatory` no longer carries Claim target ids, and no model/API behavior or final canon decision is added.
