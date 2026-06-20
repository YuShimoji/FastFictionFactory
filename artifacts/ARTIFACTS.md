# Artifacts

## fff-mvp-skeleton-001

- Title: Fast Fiction Factory MVP Skeleton Review Workbench
- Purpose: Local review of memo intake, structured candidates, review states, task cards, outlines, and QA gates.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Screenshot: `artifacts/fff-mvp-skeleton-review.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-mvp-export-import-001

- Title: Fast Fiction Factory JSON Export Import Review Workbench
- Purpose: Portable local review of memo, candidates, review statuses, unresolved creative decisions, QA gates, generated outlines, and decision log.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Sample state: `artifacts/sample-project-state.json`
- Smoke result: `artifacts/export-import-smoke-result.json`
- Review doc: `docs/review/json-export-import-review.md`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-visual-review-hub-001

- Title: Fast Fiction Factory Visual Review Hub
- Purpose: One local review entry point for current MVP status, artifact inventory, local inspection steps, export/import testing, unresolved creative decisions, QA gates, missing features, and next slice.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current status: `docs/review/current-status.md`
- Review doc: `docs/review/visual-review-hub-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Smoke result: `artifacts/visual-review-smoke-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-local-persistence-ergonomics-001

- Title: Fast Fiction Factory Local Persistence And Review Ergonomics Workbench
- Purpose: Extend the Visual Review Hub with explicit local file save/load, JSON fallback import/export, repo-local state validation commands, candidate status filters, search, collapse/expand controls, updated state artifacts, smoke evidence, and refreshed visual review images.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- File persistence smoke result: `artifacts/file-persistence-smoke-result.json`
- Review ergonomics smoke result: `artifacts/review-ergonomics-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Persistence review doc: `docs/review/file-persistence-review.md`
- Ergonomics review doc: `docs/review/review-ergonomics-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-claim-ledger-001

- Title: Fast Fiction Factory Claim Ledger Workbench
- Purpose: Extend the Visual Review Hub with a reviewable Claim Ledger for source, truth status, reality/reference status, canon risk, unresolved dependencies, viewer disclosure, spoiler protection, and claim review decisions.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Claim Ledger smoke result: `artifacts/claim-ledger-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Claim Ledger review doc: `docs/review/claim-ledger-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-local-docs-view-001

- Title: Fast Fiction Factory Local Markdown Docs View
- Purpose: Provide a local MkDocs Material tree view for reading, auditing, browser-assisted translation checks, project overview, screenshot locations, and turn-count-based development planning without translating or rewriting source specifications.
- Repo relative path: `mkdocs.yml`
- Entry page: `docs/index.md`
- Project overview map: `docs/project-overview.md`
- External Markdown wrappers: `docs/local-view/`
- Nav candidate generator: `tools/generate-doc-nav.mjs`
- Open command: `python -m mkdocs serve -a 127.0.0.1:8000`
- Alternate open command when port 8000 is busy: `python -m mkdocs serve -a 127.0.0.1:8001`
- Review status: `ready_for_local_review`

## fff-timeline-view-001

- Title: Fast Fiction Factory Timeline View Workbench
- Purpose: Extend the Visual Review Hub with v1.3 operating contract visibility and a reviewable multi-axis Timeline View for story order, calendar time, viewer disclosure order, production order, historical/reference order, Claim Ledger linkage, unresolved dependencies, spoiler protection, and timeline review decisions.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Timeline smoke result: `artifacts/timeline-smoke-result.json`
- v1.3 compliance smoke result: `artifacts/v1-3-compliance-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Timeline review doc: `docs/review/timeline-view-review.md`
- v1.3 compliance review doc: `docs/review/v1-3-compliance-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-profile-ghost-flow-001

- Title: Fast Fiction Factory Profile/Ghost Flow Workbench
- Purpose: Extend the Visual Review Hub with profile pages and ghost node flow for people, places, organizations, events, objects, concepts, documents, visual assets, and placeholders while preserving Claim Ledger, Timeline View, local persistence, import/export, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Checkpoint readback: `artifacts/checkpoint-readback-result.json`
- Profile/Ghost smoke result: `artifacts/profile-ghost-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Profile/Ghost review doc: `docs/review/profile-ghost-flow-review.md`
- Checkpoint readback doc: `docs/review/checkpoint-readback.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-extraction-contract-001

- Title: Fast Fiction Factory Extraction Contract Workbench
- Purpose: Extend the Visual Review Hub with a local-first extraction contract for source refs, extracted elements, profile/claim/timeline candidate routing, unresolved dependencies, review-safe defaults, warnings, freeform review intake, and human authority boundaries before any model/API extractor exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Current state: `artifacts/current-project-state.json`
- Sample state: `artifacts/sample-project-state.json`
- Sample extraction payload: `artifacts/sample-extraction-payload.json`
- State adapter: `tools/fff-state.mjs`
- Extraction Contract smoke result: `artifacts/extraction-contract-smoke-result.json`
- Freeform review intake smoke result: `artifacts/freeform-review-intake-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Extraction Contract review doc: `docs/review/extraction-contract-review.md`
- Freeform Review Intake doc: `docs/review/freeform-review-intake.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`
- Review input mode: `freeform`

## fff-extraction-validator-hardening-001

- Title: Fast Fiction Factory Extraction Validator Hardening
- Purpose: Harden the local Extraction Contract with seven valid/invalid fixture payloads, built-in guard checks, and stricter zero-dependency validation before any adapter, model/API behavior, database persistence, publishing adapter, AI video generation, production sync, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved contract artifact: `fff-extraction-contract-001`
- Fixture directory: `artifacts/extraction-negative-fixtures/`
- Fixture files: `valid-minimal.json`, `missing-source-refs.json`, `overconfident-human-owned-decision.json`, `invalid-routing-visual-asset-to-claim.json`, `auto-canon-leak.json`, `missing-review-safe-defaults.json`, `unknown-fields-preservation.json`
- Validator smoke result: `artifacts/extraction-validator-smoke-result.json`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/extraction-validator-hardening-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json`
- Validation result: expected-valid fixtures passed, expected-invalid fixtures failed for intended reasons, built-in guard checks passed for missing identity fields, invalid element type, missing human authority boundaries, and missing high-risk warnings; unknown-field preservation warnings were reported.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Preserve this validator matrix as the gate for adapter expansion and any future model/API adapter.

## fff-local-extraction-adapter-spike-001

- Title: Fast Fiction Factory Local Extraction Adapter Spike
- Purpose: Convert a sample raw memo into a local Extraction Contract payload with deterministic zero-dependency rules, then validate the payload through the existing Extraction Contract validator and fixture matrix before any model/API extraction behavior exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Sample raw memo: `artifacts/sample-raw-memo.md`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter smoke result: `artifacts/local-extraction-adapter-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/local-extraction-adapter-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-extract-local.mjs artifacts/sample-raw-memo.md artifacts/local-extraction-adapter-output.json artifacts/local-extraction-adapter-smoke-result.json`
- Validation result: deterministic adapter output validated as `fff.extractionContract.v1`; output contains 12 extracted elements covering all required element types, 9 profile candidates, 7 claim candidates, 5 timeline candidates, 3 unresolved human-owned dependencies, review-safe defaults, and source refs; fixture matrix remained passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-local-extraction-adapter-expansion-001`.
- Next action: Use the expansion artifact for current adapter review.

## fff-local-extraction-adapter-expansion-001

- Title: Fast Fiction Factory Local Extraction Adapter Expansion
- Purpose: Expand deterministic local raw memo extraction across multiple fixtures, generate one Extraction Contract payload per fixture, validate every output, and audit source spans, source refs, review-safe defaults, visual-asset routing, freeform review, and human-owned decision guards before any model/API extraction behavior exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Sample raw memo: `artifacts/sample-raw-memo.md`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter smoke result: `artifacts/local-extraction-adapter-smoke-result.json`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/local-extraction-adapter-expansion-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-extract-local.mjs --matrix artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validation result: deterministic adapter output validated as `fff.extractionContract.v1` for three fixture memos; output matrix contains 36 extracted elements, complete required element-type coverage, 27 profile candidates, 20 claim candidates, 12 timeline candidates, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual-asset routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions; fixture matrix remained passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Review adapter output quality and source-span usefulness before adding more deterministic edge fixtures or placing a model/API adapter behind the same validator boundary.
