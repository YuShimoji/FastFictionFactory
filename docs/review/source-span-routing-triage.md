# Source-Span Routing Triage

Artifact: `fff-source-span-routing-triage-001`

Slice: `fff-source-span-routing-triage-001`

Date: 2026-06-20

## Triage Question

Dirty work appeared after `fff-model-api-boundary-spec-001` was completed and pushed. This triage determines whether the dirty files are one coherent source-span routing checkpoint, model-boundary residue, generated temp, unrelated dirty work, or unknown work needing a human decision.

## Classification Summary

| Category | Count | Decision |
| --- | ---: | --- |
| `source_span_routing_intentional` | 18 | Safe to validate and checkpoint if gates pass. |
| `model_boundary_residue` | 0 | No replacement residue remains; model/API boundary references are preserved. |
| `generated_temp` | 0 | No disposable untracked temp files found. |
| `unrelated_dirty_work` | 0 | No off-lane dirty files found. |
| `unknown_needs_decision` | 0 | No files require supervisor decision before checkpoint. |

## File Classification

| File | Classification | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `artifacts/ARTIFACTS.md` | `source_span_routing_intentional` | Register the source-span pack and preserve prior artifacts. | Adds artifact inventory entries and model/API boundary preservation notes. | Must not imply production approval or provider integration. | Ready for validation. | Agent. | Keep with checkpoint if validation passes. |
| `artifacts/artifact-manifest.json` | `source_span_routing_intentional` | Make the source-span pack the active review artifact. | Points validation/readback to the source-span pack while preserving the model/API boundary artifact id. | Manifest command must pass before checkpoint. | Validation result updated after gates passed. | Agent. | Keep with checkpoint. |
| `artifacts/local-extraction-adapter-expansion-smoke-result.json` | `source_span_routing_intentional` | Preserve adapter matrix smoke readback used by the source-span pack. | Only generated validator stdout timestamp changed during local readback; semantic metrics remain 3 fixtures, 36 elements, 0 guard failures. | Must not introduce metric drift. | Requires final diff check after validation. | Agent. | Include only if final validation leaves it as deterministic readback evidence. |
| `artifacts/source-span-routing-review-pack.json` | `source_span_routing_intentional` | Provide full machine-readable source-span and routing readback. | Adds 36-row fixture audit with source refs, spans, routes, held defaults, human-owned guards, and review debt. | Must pass pack guard checks and avoid model/API calls. | Ready for validation. | Agent. | Keep with checkpoint if validation passes. |
| `artifacts/source-span-routing-triage-result.json` | `source_span_routing_intentional` | Provide machine-readable dirty-work triage evidence. | Records classification counts, file reasons, preservation checks, metric note, and validation state. | Must parse as JSON and match the triage doc. | Created by this triage. | Agent. | Update after gates pass. |
| `docs/data-model.md` | `source_span_routing_intentional` | Document the review pack shape. | Adds `SourceSpanRoutingReviewPack` while retaining the `Model/API Boundary Envelope` section. | Must preserve `fff-model-api-boundary-spec-001`. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/decision-log.md` | `source_span_routing_intentional` | Record the source-span supervision decision. | Explains why the pack exists before freeform review or model/API work. | Must not create a production or canon decision. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/idea-ledger.md` | `source_span_routing_intentional` | Update residual extraction-engine work. | Moves next step to source-span freeform review before model/API adapter work. | Must keep residual work purpose, effect, requirements, state, owner, and next move explicit. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/project-context.md` | `source_span_routing_intentional` | Update repo restart context. | Makes source-span pack current while listing preserved model/API boundary evidence. | Must stay local-first and avoid production claims. | Ready for checkpoint. | Agent. | Keep with checkpoint. |
| `docs/project-overview.md` | `source_span_routing_intentional` | Add overview navigation and next-turn guidance. | Adds source-span pack row and moves next turn to review response. | Must keep model/API adapter not started. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/review/current-status.md` | `source_span_routing_intentional` | Update current review packet. | Makes source-span pack active and preserves model/API boundary spec, envelope, and smoke evidence. | Must not imply human review acceptance. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/review/local-extraction-adapter-expansion-review.md` | `source_span_routing_intentional` | Point prior adapter expansion review to the new review pack. | Narrows continuation to source-span/routing review. | Must preserve previous adapter expansion artifact. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/review/next-terminal-handoff.md` | `source_span_routing_intentional` | Keep restartable handoff current. | Adds source-span pack commands and preserves model/API boundary artifact in resume context. | Must not widen into model/API implementation. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/review/source-span-routing-review-pack.md` | `source_span_routing_intentional` | Provide human-readable review guide for the pack. | Documents inputs, metrics, review debt, command, boundaries, and next continuation. | Must state that candidates remain review-held and non-canon. | Ready for validation. | Agent. | Keep with checkpoint. |
| `docs/review/source-span-routing-triage.md` | `source_span_routing_intentional` | Record this dirty-work triage. | Classifies all dirty/untracked files and the checkpoint gate. | Must stay audit-only. | Created by this triage. | Agent. | Keep with checkpoint. |
| `mkdocs.yml` | `source_span_routing_intentional` | Add source-span pack to local docs navigation. | Makes the review doc visible in MkDocs. | Must pass strict docs build. | Ready for validation. | Agent. | Keep with checkpoint. |
| `public/review/index.html` | `source_span_routing_intentional` | Expose the source-span pack in the Visual Review Hub. | Adds representative fixture tables and active artifact text while preserving model/API boundary metadata. | Must remain local static UI with no external calls. | Static Review Hub smoke passed; in-app Browser connection was unavailable before navigation. | Agent. | Keep with checkpoint. |
| `tools/fff-source-span-review-pack.mjs` | `source_span_routing_intentional` | Generate and validate the source-span review pack. | Reads existing fixture outputs, validates them, audits spans/routes/defaults/guards, and writes the pack. | Must be local-only and zero-provider. | Ready for validation. | Agent. | Keep with checkpoint if pack validation passes. |

## Acceptance Gate

Checkpoint is allowed only if:

- Git upstream remains at parity before commit.
- Manifest validation passes.
- Source-span pack passes with 3 fixtures, 36 elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing, 0 non-held defaults, and 0 human-owned decision adopt suggestions.
- Model/API boundary references remain present in manifest, Review Hub metadata, docs, artifact inventory, and current status.
- MkDocs strict build passes.
- Review Hub smoke confirms the source-span pack and preserved model/API boundary text are visible. In-app Browser smoke is acceptable to skip when unavailable; static HTML smoke must pass in that case.
- `git diff --check` passes.

## Validation Result

- Manifest validation: passed.
- Adapter matrix: passed.
- Every adapter output validated as `fff.extractionContract.v1`; only `adapterTrace` preservation warnings were emitted.
- Source-span pack: passed with 3 fixtures, 36 elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing, 0 non-held defaults, and 0 human-owned decision adopt suggestions.
- Review Hub smoke: static HTML smoke passed for active artifact text, preserved model/API boundary text, 3 fixture tables, and Review Debt text. In-app Browser smoke could not run because the browser runtime connection failed before navigation.
- MkDocs strict build: passed with the existing Material/MkDocs warning and nav-info output.
- `git diff --check`: passed.

## Residual Work

Purpose: Human review of source-span usefulness and routing quality.

Effect: A future slice can revise only concrete weak spans, vague extractions, ambiguous routes, or missing fixture classes found by review.

Requirements: Local-only, source-tracked, validator-gated, review-held by default, no model/API call, no credentials, no database persistence, no publishing, and no final Toma/brass/Council decision.

State: Ready for freeform review after checkpoint validation.

Owner: Human reviewer for review truth; agent for narrow fixture/span/routing changes after review.

Next move: Review `public/review/index.html` or `artifacts/source-span-routing-review-pack.json`, then choose one concrete refinement or defer adapter changes.
