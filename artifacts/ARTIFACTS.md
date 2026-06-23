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
- State: Preserved by `fff-source-span-routing-review-pack-001`.
- Next action: Use the source-span routing review pack before revising fixture spans/routing or placing any model/API adapter behind the same validator boundary.

## fff-model-api-boundary-spec-001

- Title: Fast Fiction Factory Model/API Boundary Specification
- Purpose: Define a local-first boundary for future model/API extraction output before any external provider call, credential setup, adapter implementation, database persistence, publishing adapter, AI video generation, production sync, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved local adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Boundary spec doc: `docs/review/model-api-boundary-spec.md`
- Boundary envelope example: `artifacts/model-api-boundary-envelope.example.json`
- Boundary smoke result: `artifacts/model-api-boundary-smoke-result.json`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: parse `artifacts/model-api-boundary-envelope.example.json`, parse `artifacts/model-api-boundary-smoke-result.json`, run current/sample state validation, validate sample and generated Extraction Contract payloads, run validator fixture matrix, run deterministic adapter matrix, and check Review Hub text plus screenshot/contact-sheet existence.
- Validation result: boundary envelope parsed; boundary smoke passed; no model/API call, credentials, provider endpoint, direct state mutation, database persistence, publishing, production sync, AI video generation, or final canon decision added; adapter expansion and validator gates remained passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-source-span-routing-review-pack-001`.
- Next action: Use the source-span routing review pack before choosing a no-network mock provider or explicitly configured provider adapter behind the same validation gates.

## fff-source-span-routing-review-pack-001

- Title: Fast Fiction Factory Source-Span Routing Review Pack
- Purpose: Turn the existing three adapter fixture outputs into a compact human supervision pack for source spans, source refs, routing targets, held defaults, confidence/default status, human-owned guards, risk flags, review notes, and review debt before freeform review or model/API behavior.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Pack artifact: `artifacts/source-span-routing-review-pack.json`
- Pack generator: `tools/fff-source-span-review-pack.mjs`
- Review doc: `docs/review/source-span-routing-review-pack.md`
- Dirty-work triage result: `artifacts/source-span-routing-triage-result.json`
- Dirty-work triage doc: `docs/review/source-span-routing-triage.md`
- Preserved adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-source-span-review-pack.mjs artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/source-span-routing-review-pack.json`
- Validation result: source-span review pack generated from three fixture outputs; pack records 36 extracted elements, 27 profile candidates, 20 claim candidates, 12 timeline candidates, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing cases, 0 non-held review defaults, 0 human-owned decision adopt suggestions, 17 human-owned guarded elements, and Review Debt categories for weak spans, over-broad spans, vague extraction, ambiguous routing, confident defaults, and missing fixture classes.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Review the pack in the Visual Review Hub or `artifacts/source-span-routing-review-pack.json`, then decide whether to revise deterministic spans/routing or add new edge fixtures before model/API adapter work.

## fff-source-span-routing-triage-001

- Title: Fast Fiction Factory Source-Span Routing Dirty-Work Triage
- Purpose: Classify every dirty or untracked source-span routing file after `fff-model-api-boundary-spec-001` and decide whether a separate source-span checkpoint is safe.
- Triage result: `artifacts/source-span-routing-triage-result.json`
- Triage doc: `docs/review/source-span-routing-triage.md`
- Related active artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Validation result: all dirty/untracked files classified as `source_span_routing_intentional`; model boundary residue, generated temp, unrelated dirty work, and unknown-needs-decision buckets are empty; manifest validation, MkDocs strict, Playwright browser smoke, and git diff whitespace checks passed.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Use the source-span review pack for human freeform review, then revise only concrete span/routing issues or fixture classes identified by review.

## fff-review-hub-ia-mode-split-001

- Title: Fast Fiction Factory Review Hub IA Mode Split
- Purpose: Split the local Review Hub into Story Review, Source Audit, Project Cockpit, and Artifacts modes; add Japanese-facing display labels; remove awkward sticky Raw Story Memo behavior; and reduce first-load vertical overload while preserving source-span and model/API boundary evidence.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Review doc: `docs/review/review-hub-ia-mode-split.md`
- Smoke result: `artifacts/review-hub-ia-mode-split-smoke-result.json`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: run the active manifest validation command, Review Hub static smoke, MkDocs strict build, and `git diff --check`.
- Validation result: manifest validation command passed; Review Hub IA static smoke passed; Story Review, Source Audit, Project Cockpit, and Artifacts labels are visible with Japanese display labels; Raw Story Memo sticky positioning was removed; source-span fixture details are collapsed by default; source-span pack remains reachable and passed with 0 guard failures; model/API boundary text remains present with `externalCallAllowed: false`; state, extraction payload, and extraction fixture validation passed.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Review whether the four modes, Japanese labels, collapsed source audit details, and non-sticky Raw Story Memo panel reduce daily review friction while keeping source-span evidence reachable.

## fff-review-procedure-lock-001

- Title: Fast Fiction Factory Review Procedure Lock
- Purpose: Lock the local review procedure, screenshot/contact-sheet evidence map, mode-specific screenshot paths, optional-vs-required review boundary, freeform review intake guidance, and identity/access split before model/API implementation work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review procedure: `docs/review/review-procedure.md`
- Smoke result: `artifacts/review-procedure-lock-smoke-result.json`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Mode screenshots:
  - `artifacts/review-screens/story-review.png`
  - `artifacts/review-screens/source-audit.png`
  - `artifacts/review-screens/project-cockpit.png`
  - `artifacts/review-screens/artifacts-validation.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: run the active manifest validation command, Review Hub procedure static smoke, screenshot non-empty checks, MkDocs strict build, and `git diff --check`.
- Validation result: passed 2026-06-22T13:26:45+09:00; manifest validation command passed; Review Procedure Lock smoke passed; screenshot, contact sheet, and four mode screenshots were refreshed and non-empty; MkDocs strict build passed; `git diff --check` passed. Bundled Playwright Chromium was unavailable, so screenshot refresh used the local Microsoft Edge channel without downloading browsers.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Use optional freeform review to decide whether the fixed procedure, screenshot map, and access paths reduce future review friction; then make only one narrow procedure, IA, fixture, span, or routing change if review identifies a concrete gap.

## fff-review-memory-dedup-001

- Title: Fast Fiction Factory Review Memory Dedup
- Purpose: Add v1.14-style review memory, Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card conventions so future review requests do not repeat the same target, evidence, and axis.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Smoke result: `artifacts/review-memory-dedup-smoke-result.json`
- Manifest review memory source of truth: `artifacts/artifact-manifest.json`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Manifest review memory entries:
  - `fff-review-procedure-lock-001`
  - `fff-review-hub-ia-mode-split-001`
  - `fff-source-span-routing-review-pack-001`
- Validation command: run the active manifest validation command, Review Memory Dedup smoke/readback, Review Hub static smoke, MkDocs strict build, and `git diff --check`.
- Validation result: passed 2026-06-22T13:45:00+09:00; manifest validation command passed; `review_memory` contains required fields for `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, and `fff-source-span-routing-review-pack-001`; Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card template are present; Review Hub static smoke text is present; source-span pack and extraction validators remained passing; MkDocs strict build passed; `git diff --check` passed.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Use the Review Dedup Gate before asking for review. The next non-redundant axis is source-span usefulness and routing quality only when target, evidence, axis, or decision value changes enough to justify asking.

## fff-source-span-quality-audit-001

- Title: Fast Fiction Factory Source-Span Quality Audit
- Purpose: Classify source-span usefulness and routing quality across the existing 36-row source-span review pack without asking for a repeated general Review Hub review or starting model/API work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/source-span-quality-audit.md`
- Audit result: `artifacts/source-span-quality-audit-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Manifest: `artifacts/artifact-manifest.json`
- Preserved review memory artifact: `fff-review-memory-dedup-001`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Classification counts: 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows.
- Review Dedup result: review memory checked, axis set to `source_span_quality`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub request emitted.
- Validation command: run the active manifest validation command, parse `artifacts/source-span-quality-audit-result.json`, regenerate the source-span review pack, validate adapter outputs, validate current/sample state, validate sample extraction payload, run extraction fixture validation, run MkDocs strict build, and run `git diff --check`.
- Validation result: passed; active manifest validation parsed the audit JSON, confirmed 36 classified rows, regenerated the source-span review pack, validated adapter outputs, validated current/sample state, validated the sample extraction payload, ran extraction fixture validation, and preserved no model/API behavior.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Choose one bounded weak-span, broad-span, ambiguous-routing, or missing-fixture improvement before any model/API adapter work.

## fff-ambiguous-routing-resolution-001

- Title: Fast Fiction Factory Ambiguous Routing Resolution
- Purpose: Resolve the seven ambiguous routing rows from `fff-source-span-quality-audit-001` into explicit primary destinations, secondary evidence roles, held defaults, and regression checks without asking for a repeated general review or starting model/API work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/ambiguous-routing-resolution.md`
- Resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Preserved source-span quality audit artifact: `fff-source-span-quality-audit-001`
- Preserved review memory artifact: `fff-review-memory-dedup-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Updated deterministic adapter: `tools/fff-extract-local.mjs`
- Updated adapter output: `artifacts/local-extraction-adapter-output.json`
- Updated adapter matrix outputs: `artifacts/extraction-adapter-outputs/`
- Updated adapter smoke evidence: `artifacts/local-extraction-adapter-smoke-result.json`, `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Updated source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Resolution counts: 7 ambiguous rows resolved; 3 primary Profile routes, 1 primary Visual route, 3 Human Review holds, 5 Claim secondary evidence rows, and 6 Timeline secondary evidence rows.
- Adapter rule applied: `local-x-visual-observatory` no longer routes to Claim Ledger target ids; all visual asset rows keep `targetClaimIds: []`.
- Review Dedup result: review memory checked, axis set to `ambiguous_routing_resolution`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub request emitted.
- Validation command: run the active manifest validation command, parse the resolution result, regenerate adapter matrix and source-span pack, validate adapter outputs and state files, run extraction fixture validation, run MkDocs strict build, and run `git diff --check`.
- Validation result: passed 2026-06-22T15:49:25+09:00; active manifest validation parsed the resolution JSON, confirmed all 7 ambiguous rows resolved, regenerated adapter smoke/matrix output and source-span review pack, verified every visual asset keeps `targetClaimIds: []` and avoids direct Claim routing, validated adapter outputs/current state/sample state/sample extraction/extraction fixtures, preserved model/API boundary text, passed MkDocs strict build, and passed `git diff --check`.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Add one missing fixture class or validator-hardening case only if route policy drift appears again.

## fff-routing-policy-regression-hardening-001

- Title: Fast Fiction Factory Routing Policy Regression Hardening
- Purpose: Promote the ambiguous-routing policy into a reusable validator smoke command so future adapter changes cannot silently drift across Visual, Profile/Ghost, Claim, Timeline, Source Reference, and Human Review boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/routing-policy-regression-hardening.md`
- Regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Routing policy validator: `tools/fff-state.mjs`
- Source resolution artifact: `fff-ambiguous-routing-resolution-001`
- Source resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter matrix outputs: `artifacts/extraction-adapter-outputs/`
- Validation command: `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json`
- Validation result: passed 2026-06-23T03:38:23+09:00; manifest validation command passed; routing policy regression smoke parsed `fff-routing-policy-regression-hardening-001`, checked 7 resolved rows, 36 source-pack rows, 4 adapter payloads, 48 adapter elements, and 0 failures; visual direct-Claim guard, human-review hold guard, Claim secondary-evidence rule, Timeline secondary-evidence rule, source_reference preservation, unsafe/unclear hold rule, and adapter drift readback passed; MkDocs strict build and `git diff --check` passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Add one missing fixture class only if route-policy hardening later exposes drift.

## fff-broad-span-split-001

- Title: Fast Fiction Factory Broad Source-Span Split
- Purpose: Resolve the two broad source-span rows from `fff-source-span-quality-audit-001` by recording one narrower split and one explicit keep reason while preserving routing regression, source refs, review memory, model/API boundaries, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/broad-span-split.md`
- Split result: `artifacts/broad-span-split-result.json`
- Broad-span validator: `tools/fff-state.mjs`
- Source audit artifact: `fff-source-span-quality-audit-001`
- Source audit result: `artifacts/source-span-quality-audit-result.json`
- Routing policy regression artifact: `fff-routing-policy-regression-hardening-001`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validation command: `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json`
- Validation result: passed 2026-06-23T11:05:58+09:00; manifest validation command passed after remote fast-forward; broad-span split parsed `fff-source-span-quality-audit-001`, loaded 2 broad rows, split `local-x-visual-observatory` into narrower visual/profile and timeline snippets, kept `minutes-x-placeholder-proof-bait` with an explicit human-owned reason, preserved both source locators, preserved routing regression and model/API boundary evidence, adapter/source-span smoke remained passing, MkDocs strict build passed, and `git diff --check` passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Pick one weak span repair or one missing fixture class only after explicit need; do not reopen broad-span debt unless source output changes.

## fff-weak-span-repair-001

- Title: Fast Fiction Factory Weak Source-Span Repair
- Purpose: Resolve the six weak source-span rows from `fff-source-span-quality-audit-001` by recording stronger same-fixture source refs while preserving original locators, broad-span split results, routing policy regression, review memory, model/API boundaries, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/weak-span-repair.md`
- Repair result: `artifacts/weak-span-repair-result.json`
- Weak-span validator: `tools/fff-state.mjs`
- Source audit artifact: `fff-source-span-quality-audit-001`
- Source audit result: `artifacts/source-span-quality-audit-result.json`
- Broad-span split artifact: `fff-broad-span-split-001`
- Broad-span split result: `artifacts/broad-span-split-result.json`
- Routing policy regression artifact: `fff-routing-policy-regression-hardening-001`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validation command: `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json`
- Validation result: passed 2026-06-23T13:10:13+09:00; manifest validation command passed; weak-span repair smoke parsed `fff-source-span-quality-audit-001`, loaded 6 weak rows, repaired all 6 with stronger same-fixture source refs, preserved 6 original locators, preserved broad-span split and routing regression evidence, adapter/source-span smoke remained passing, MkDocs strict build passed, HTML script syntax check passed, and `git diff --check` passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Add one missing fixture class only after a concrete coverage need is named; do not reopen weak-span, broad-span, or ambiguous-routing debt unless source output changes.
