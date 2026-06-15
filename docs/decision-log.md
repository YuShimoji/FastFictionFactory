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
