# Current Status Packet

## Active Artifact

- Artifact id: `fff-model-api-boundary-spec-001`
- Preserved local adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter spike artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Review UI: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `.\scripts\operator\open_review.ps1`
- Manifest: `artifacts/artifact-manifest.json`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Model/API boundary envelope: `artifacts/model-api-boundary-envelope.example.json`
- Model/API boundary smoke: `artifacts/model-api-boundary-smoke-result.json`
- Sample raw memo: `artifacts/sample-raw-memo.md`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- Adapter expansion smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`

## What Exists Now

- Local static review UI with Visual Review Hub as the single entry point.
- v1.3 operating contract section covering autonomous loop, reviewable artifacts, repo-relative paths, visual evidence, and human-owned decision boundaries.
- Raw memo intake with deterministic mock extraction.
- Local file save/load controls where browser support allows.
- Download/upload/pasted JSON fallback controls.
- Candidate review controls for `adopt`, `provisional`, `hold`, and `reject`.
- Claim Ledger with grouping, filters, search, source/truth/reality status, canon risk, unresolved dependencies, viewer disclosure, spoiler level, and decision log updates.
- Timeline View with five-axis separation for story order, calendar time, viewer disclosure order, production order, and historical/reference order.
- Profile/Ghost Flow with type selector, ghost node grouping, profile cards, linked Claim Ledger and Timeline references, unresolved dependencies, canon/spoiler/source labels, local review controls, and a reversible ghost-to-provisional-profile action.
- Extraction Contract with run identity, source refs, extracted elements, candidate routing links, unresolved dependencies, review-safe defaults, warnings, human authority boundary labels, grouping, filters, search, and local review controls.
- Extraction Validator Hardening with local fixture coverage for valid minimal payloads, missing source refs, overconfident human-owned decisions, invalid visual-asset routing, auto-canon leaks, missing review-safe defaults, unknown-field preservation, missing extraction identity fields, invalid element types, missing human authority boundaries, and high-risk warnings.
- Freeform Review Intake contract documented for user review without fixed response phrases.
- Repo-local zero-dependency state adapter at `tools/fff-state.mjs`.
- Sample and current state JSON at `artifacts/sample-project-state.json` and `artifacts/current-project-state.json`.
- Deterministic local extraction adapter at `tools/fff-extract-local.mjs`.
- Adapter expansion fixtures:
  - `artifacts/extraction-adapter-fixtures/clockmaker-sample.md`
  - `artifacts/extraction-adapter-fixtures/council-minutes-edge.md`
  - `artifacts/extraction-adapter-fixtures/observatory-ledger-edge.md`
- Adapter expansion outputs:
  - `artifacts/extraction-adapter-outputs/clockmaker-sample.json`
  - `artifacts/extraction-adapter-outputs/council-minutes-edge.json`
  - `artifacts/extraction-adapter-outputs/observatory-ledger-edge.json`
- Local adapter expansion smoke evidence at `artifacts/local-extraction-adapter-expansion-smoke-result.json`.
- Model/API boundary spec at `docs/review/model-api-boundary-spec.md`.
- Model/API boundary envelope example at `artifacts/model-api-boundary-envelope.example.json`.
- Model/API boundary smoke evidence at `artifacts/model-api-boundary-smoke-result.json`.
- Freeform review intake smoke evidence at `artifacts/freeform-review-intake-smoke-result.json`.
- Screenshot and contact sheet at `artifacts/fff-current-review-screenshot.png` and `artifacts/fff-review-contact-sheet.png`.
- MkDocs Material local docs view at `mkdocs.yml`.

## What Was Verified

- The artifact manifest now references `fff-model-api-boundary-spec-001` while preserving `fff-local-extraction-adapter-expansion-001`, `fff-local-extraction-adapter-spike-001`, `fff-extraction-validator-hardening-001`, and `fff-extraction-contract-001`.
- `artifacts/model-api-boundary-envelope.example.json` parses as JSON and declares `schemaVersion: "fff.modelApiBoundaryEnvelope.v1"`.
- The boundary envelope records `externalCallAllowed: false`, no provider endpoint, no secret names, no direct state mutation, and no credentials required for this spec slice.
- The boundary output target is `fff.extractionContract.v1`, not project state.
- The boundary validation gates require `validate-extraction`, the validator fixture matrix, the deterministic adapter expansion matrix, source refs, source spans, review-safe defaults, human-owned decision guards, visual-asset routing guards, and freeform review authority.
- The boundary smoke reports `passed: true` with no model/API call, no credentials, failure-mode coverage, retry/timeout policy coverage, fallback coverage, and preserved adapter/validator/contract artifacts.
- The single adapter command still regenerates `artifacts/local-extraction-adapter-output.json` from `artifacts/sample-raw-memo.md`.
- Matrix mode still generates three fixture outputs from `artifacts/extraction-adapter-fixtures/` into `artifacts/extraction-adapter-outputs/`.
- Each fixture output validates as `fff.extractionContract.v1`.
- The adapter expansion smoke still reports 3 fixture inputs, 3 outputs, 36 extracted elements, complete required element-type coverage, 27 profile candidates, 20 claim candidates, and 12 timeline candidates.
- The source/routing audit still reports 36 of 36 source spans matched their raw memo text, 0 missing source refs, 0 unsafe visual-asset routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions.
- The extraction validator fixture matrix still passes with 7 fixtures and 0 mismatches.
- Toma fate, brass moth truth, and Council motive remain human-owned unresolved decisions.

## What Remains Missing

- Actual model/API extraction adapter behind the boundary spec.
- Provider choice, credential flow, timeout value, and retry count for a future integration.
- Durable project database.
- YouTube publishing, automated upload, and AI video generation.
- Complete world chronology.
- Final canon decisions for Toma, the brass moth, or the Council.

## How To Open The Review UI

From the repo root, run:

```powershell
Invoke-Item .\public\review\index.html
```

Or use the repo-local launcher:

```powershell
.\scripts\operator\open_review.ps1
```

Primary review path:

```text
public/review/index.html
```

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate before adopting ending-sensitive profile or timeline entries.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep object/rule profiles held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, or keep motive-disclosure and stolen-time profiles held.

## Next Recommended Slice

Review `docs/review/model-api-boundary-spec.md` and `artifacts/model-api-boundary-envelope.example.json`. Then choose whether the next implementation should be a no-network mock provider that emits the same envelope/payload shape or an explicitly configured provider adapter behind `tools/fff-state.mjs validate-extraction`, the validator fixture matrix, the adapter expansion matrix, source-span checks, review-held defaults, and human-owned decision guards.

## Resume From Another Terminal

From a fresh terminal, run `git pull --ff-only`, read `AGENTS.md`, `docs/project-context.md`, `docs/review/current-status.md`, `docs/workflow.md`, `docs/qa-gates.md`, `docs/decision-log.md`, `docs/idea-ledger.md`, and `artifacts/artifact-manifest.json`, then open the review UI with `.\scripts\operator\open_review.ps1` and run the manifest validation command before changing behavior.
