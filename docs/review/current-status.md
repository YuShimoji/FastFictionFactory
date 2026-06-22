# Current Status Packet

## Active Artifact

- Artifact id: `fff-source-span-quality-audit-001`
- Preserved review memory artifact: `fff-review-memory-dedup-001`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter spike artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Review UI: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `.\scripts\operator\open_review.ps1`
- Repo-local shell launcher: `./scripts/operator/open_review.sh`
- Manifest: `artifacts/artifact-manifest.json`
- Source-span quality audit doc: `docs/review/source-span-quality-audit.md`
- Source-span quality audit result: `artifacts/source-span-quality-audit-result.json`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Review memory / dedup smoke: `artifacts/review-memory-dedup-smoke-result.json`
- Review procedure: `docs/review/review-procedure.md`
- Review procedure smoke: `artifacts/review-procedure-lock-smoke-result.json`
- Review Hub IA mode split doc: `docs/review/review-hub-ia-mode-split.md`
- Review Hub IA smoke: `artifacts/review-hub-ia-mode-split-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Source-span pack generator: `tools/fff-source-span-review-pack.mjs`
- Source-span pack review doc: `docs/review/source-span-routing-review-pack.md`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Model/API boundary envelope: `artifacts/model-api-boundary-envelope.example.json`
- Model/API boundary smoke: `artifacts/model-api-boundary-smoke-result.json`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Mode screenshots: `artifacts/review-screens/`
- Local docs view: `mkdocs.yml`

## What Exists Now

- Local static Visual Review Hub remains the single entry point.
- The Hub exposes Story Review, Source Audit, Project Cockpit, and Artifacts modes.
- The active Review Hub identity now points to `fff-source-span-quality-audit-001`.
- `docs/review/source-span-quality-audit.md` records the source-span usefulness and routing-quality audit for the existing 36-row review pack.
- `artifacts/source-span-quality-audit-result.json` classifies 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows.
- `docs/review/review-memory-dedup.md` defines review memory fields, Acceptance Ladder stages, Review Dedup Gate checks, and the Non-Redundant Review Card template.
- `artifacts/artifact-manifest.json` records `review_memory` for `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, and `fff-source-span-quality-audit-001`.
- `docs/review/review-procedure.md` defines what to open, what each screenshot represents, what each mode is for, when review is optional or required, what freeform review should cover, and which items are Review Debt.
- The Artifacts mode lists the procedure doc, smoke evidence, screenshot/contact-sheet paths, mode screenshot directory, manifest, and local launcher paths.
- `scripts/operator/open_review.ps1` remains the Windows launcher, and `scripts/operator/open_review.sh` adds a dependency-free sh launcher for Unix-like terminals.
- Source-span review remains reachable through Source Audit and `artifacts/source-span-routing-review-pack.json`.
- Source-span quality audit remains reachable through Source Audit, `docs/review/source-span-quality-audit.md`, and `artifacts/source-span-quality-audit-result.json`.
- The model/API boundary remains a no-call spec artifact with `externalCallAllowed: false`.
- Review input remains freeform.
- Future Review Cards must name target, axis, prior signal, what changed, what the review decides, what is not being asked, and completion signal before asking again.
- Local persistence, JSON import/export, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, and human-owned canon boundaries remain preserved.

## What Was Verified

- Git parity after fetch: `git rev-list --left-right --count HEAD...origin/master` reported `0 0` before this slice.
- Local working tree started clean on `master` at `a02c0f7 Add review memory dedup gate`.
- The existing Review Hub IA smoke evidence was present and passing before this slice.
- Existing screenshot and contact sheet files were present and non-empty before refresh.
- Project-local instructions and required context docs were read before changing review claims.

Final verification for this slice is tracked by:

- Manifest validation command in `artifacts/artifact-manifest.json`: passed.
- Source-span quality audit at `artifacts/source-span-quality-audit-result.json`: passed and parses.
- Source-span review pack at `artifacts/source-span-routing-review-pack.json`: passed after regeneration during validation.
- Review memory / dedup smoke at `artifacts/review-memory-dedup-smoke-result.json`: preserved.
- MkDocs strict build: passed.
- `git diff --check`: passed.

The active validation re-runs adapter output validation, current/sample state validation, sample extraction validation, extraction fixture validation, and source-span pack generation. No screenshot refresh was required for this audit slice.

## What Remains Missing

- Human freeform review of whether the procedure, screenshot map, and four modes reduce future review friction. This should not be asked again unless target, axis, evidence, or decision value changes.
- Human freeform review of source-span usefulness and routing quality remains optional and should be bounded to one concrete weak span, broad span, ambiguous route, or fixture class.
- More edge fixture classes if review finds gaps: contradictory memo claims, very broad source spans, malformed or missing spans, multilingual or translated memo text, sparse bullet-only notes, and model/API provider envelope output.
- Actual model/API extraction adapter behind the validator boundary.
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

Or use the repo-local launchers:

```powershell
.\scripts\operator\open_review.ps1
```

```sh
./scripts/operator/open_review.sh
```

Mode-specific local paths:

```text
public/review/index.html?mode=story
public/review/index.html?mode=source
public/review/index.html?mode=project
public/review/index.html?mode=artifacts
```

## Review Debt

| Target | Purpose | State | Next move |
| --- | --- | --- | --- |
| Review procedure | Confirm the access paths and screenshot map are clear enough across terminals | Prior diagnostic signal is enough to continue; do not repeat without changed evidence | Use `next_nonredundant_axis` from review memory |
| Source-span quality | Decide whether current spans and routing are useful, not just valid | Audit completed with 28 useful, 6 weak, 2 broad, 0 missing refs, 7 ambiguous routes, and 17 human-owned guarded rows | Pick one bounded weak span, broad span, ambiguous route, or missing fixture class |
| Missing fixture classes | Cover memo shapes not yet represented by deterministic fixtures | Held until review names a need | Add one fixture class at a time |
| Model/API adapter | Implement provider-backed extraction only behind existing gates | Not started | Keep blocked until explicit authorization and reviewed source-span gates |
| Durable database and publishing | Persist and release production work | Out of scope | Do not start until review workflow and release authority are accepted |

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate before adopting ending-sensitive profile or timeline entries.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep object/rule profiles held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, or keep motive-disclosure and stolen-time profiles held.

## Next Recommended Slice

Use review memory before asking for another review. The next non-redundant move is one bounded source-span quality improvement: widen or split one weak span, split one broad span, clarify one ambiguous route, or add one missing fixture class. Do not start model/API behavior, database persistence, publishing, AI video generation, production sync, credentials, or final canon decisions in the next slice unless explicitly requested.
