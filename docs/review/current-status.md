# Current Status Packet

## Active Artifact

- Artifact id: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Review UI: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `.\scripts\operator\open_review.ps1`
- Manifest: `artifacts/artifact-manifest.json`
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
- Checkpoint readback evidence for authority, Git, tooling, and active artifacts.
- Smoke evidence for export/import, file persistence, review ergonomics, Claim Ledger, Timeline View, v1.3 compliance, and Profile/Ghost Flow.
- Extraction Contract payload and smoke evidence at `artifacts/sample-extraction-payload.json` and `artifacts/extraction-contract-smoke-result.json`.
- Extraction Contract validator fixtures covering valid minimal payload, missing source refs, overconfident human-owned decisions, unsafe direct visual-to-claim routing, auto-canon leaks, missing review-safe defaults, and unknown-field preservation.
- Extraction validator smoke evidence at `artifacts/extraction-validator-smoke-result.json`.
- Freeform review intake smoke evidence at `artifacts/freeform-review-intake-smoke-result.json`.
- Screenshot and contact sheet at `artifacts/fff-current-review-screenshot.png` and `artifacts/fff-review-contact-sheet.png`.
- MkDocs Material local docs view at `mkdocs.yml`.

## What Was Verified

- Latest handoff context is stored in `docs/review/next-terminal-handoff.md` so a new terminal can resume from project files after `git pull --ff-only`.
- The artifact manifest parses and references `fff-extraction-validator-hardening-001` while preserving `fff-extraction-contract-001` as the reviewed contract surface.
- The sample and current state JSON files parse with `schemaVersion: "fff.projectState.v1"`.
- The state adapter validates both state JSON files.
- The state adapter validates `artifacts/sample-extraction-payload.json` as an Extraction Contract payload.
- `node tools/fff-state.mjs validate-extraction-fixtures artifacts/extraction-negative-fixtures` passes the expected-valid and expected-invalid fixture matrix.
- The validator catches empty or unknown `sourceRefIds`, missing `extractionRunId`, missing `schemaVersion`, invalid element types, unsafe `adopt` suggestions for human-owned decisions, direct visual asset routing to Claim Ledger without profile-side routing, auto-canon/default-review leaks, missing `humanAuthorityBoundaries`, and missing warnings when canon risk is high.
- The valid fixture reports unknown-field preservation as a warning rather than dropping or failing preserved data.
- The state adapter summary reports Claim Ledger, Timeline, and Profile/Ghost summaries.
- The state adapter summary reports Extraction Contract run, element, candidate, dependency, high-risk, and warning counts.
- Current state contains 1 Extraction Contract run and 12 extraction elements covering person, place, organization, event, object, concept, document, visual_asset, placeholder, source_reference, and unresolved_decision.
- Current state contains 11 Profile/Ghost records, 9 Claim Ledger claims, and 8 Timeline View entries.
- Profile/Ghost records cover required profile types: person, place, organization, event, object, concept, document, visual_asset, and placeholder.
- Profile/Ghost records cover required ghost node statuses: extracted_candidate, provisional_profile, adopted_profile, held_ghost, rejected_candidate, and needs_human_decision.
- Profile/Ghost records keep Toma fate, brass moth truth, and Council motive as unresolved human-owned dependencies.
- Browser smoke confirmed Profile/Ghost rendering, grouping, type selector, ghost filters, unresolved/high-risk/spoiler filters, ghost promotion to provisional profile, decision log update, export/import persistence, invalid JSON safety, and Claim Ledger/Timeline continuity.
- Browser smoke confirmed Extraction Contract rendering, grouping, filtering, search, decision log update, export/import preservation, invalid JSON safety, and Claim Ledger/Timeline/Profile continuity.
- Extraction validator smoke confirmed 7 of 7 fixture expectations: 2 valid payloads pass and 5 invalid payloads fail for the intended risk class.
- Screenshot and contact sheet were regenerated from the current Visual Review Hub with validator hardening visible and the Extraction Contract preserved.
- `git diff --check` passed.
- `python -m mkdocs build --strict` passed.

## What Remains Missing

- Model/API extraction adapter.
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

State persistence review path:

```text
1. Use Save state to local file if the browser supports direct file save.
2. Use Load state from local file if the browser supports direct file load.
3. Use Download JSON fallback and Upload JSON fallback when direct file access is unsupported.
4. Use Import pasted JSON to test invalid JSON handling or unknown-field preservation.
```

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate before adopting ending-sensitive profile or timeline entries.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep object/rule profiles held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, or keep motive-disclosure and stolen-time profiles held.

## Next Recommended Slice

Build a local-only extraction adapter spike that emits the reviewed contract shape from deterministic input and runs through `tools/fff-state.mjs validate-extraction` plus the fixture smoke before its output is shown in the Review Hub. Keep it source-tracked and schema-validated before adding any model/API dependency, database persistence, publishing adapter, AI video generation, or final canon decision.

## Resume From Another Terminal

From a fresh terminal, run `git pull --ff-only`, read `docs/review/next-terminal-handoff.md`, open the review UI with `.\scripts\operator\open_review.ps1`, and run the manifest validation command before changing behavior.
