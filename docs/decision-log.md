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
