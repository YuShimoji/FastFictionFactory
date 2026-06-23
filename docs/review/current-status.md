# Current Status Packet

## Active Artifact

- Artifact id: `fff-malformed-missing-span-guard-001`
- Preserved missing fixture probe artifact: `fff-missing-fixture-class-probe-001`
- Preserved weak-span repair artifact: `fff-weak-span-repair-001`
- Preserved broad-span split artifact: `fff-broad-span-split-001`
- Preserved routing policy regression artifact: `fff-routing-policy-regression-hardening-001`
- Preserved ambiguous routing resolution artifact: `fff-ambiguous-routing-resolution-001`
- Preserved source-span quality audit artifact: `fff-source-span-quality-audit-001`
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
- Malformed/missing source-span guard doc: `docs/review/malformed-missing-span-guard.md`
- Malformed/missing source-span guard result: `artifacts/malformed-missing-span-guard-result.json`
- New negative fixture: `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json`
- Updated validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Missing fixture probe doc/result: `docs/review/missing-fixture-class-probe.md`, `artifacts/missing-fixture-class-probe-result.json`
- Sparse fixture memo/output: `artifacts/extraction-adapter-fixtures/sparse-bullet-notes.md`, `artifacts/extraction-adapter-outputs/sparse-bullet-notes.json`
- Weak-span repair doc/result: `docs/review/weak-span-repair.md`, `artifacts/weak-span-repair-result.json`
- Broad-span split doc/result: `docs/review/broad-span-split.md`, `artifacts/broad-span-split-result.json`
- Routing policy regression doc/result: `docs/review/routing-policy-regression-hardening.md`, `artifacts/routing-policy-regression-hardening-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- State adapter: `tools/fff-state.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Model/API boundary smoke: `artifacts/model-api-boundary-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- Current/sample state: `artifacts/current-project-state.json`, `artifacts/sample-project-state.json`
- Local docs view: `mkdocs.yml`

## What Exists Now

- The active Review Hub identity is now `fff-malformed-missing-span-guard-001`.
- The sparse bullet-only fixture probe remains closed: 4 positive fixture outputs, 48 source-pack rows, 5 adapter payloads, 60 adapter elements, and 0 failures.
- A single remaining fixture class was selected: missing or malformed source-span payloads. The concrete reason is that existing artifacts named this as remaining debt, and it can be tested as a local negative validator fixture without model/API behavior.
- `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json` adds one invalid contract fixture with 3 held elements: one missing sourceSpan plus missing sourceRefIds, one malformed offset, and one empty/zero-width span.
- `tools/fff-state.mjs` now rejects extraction elements whose `sourceSpan` is missing, not an object, has non-string or empty text, has non-integer/non-negative offsets, or has `end <= start`.
- `artifacts/extraction-validator-smoke-result.json` now covers 8 fixtures: 2 expected-valid, 6 expected-invalid, 0 mismatches, and 5 built-in guard cases.
- `artifacts/malformed-missing-span-guard-result.json` records `reject_as_invalid`, `hold_as_unreviewable`, `mark_missing_source_ref`, and `keep_out_of_claim_timeline_profile_adoption` as passed.
- The positive source-span pack remains unchanged at 4 fixtures and 48 rows. This guard does not add a normal adapter fixture and does not reopen sparse notes, weak-span repair, broad-span split, or routing policy regression.
- Review Memory / Dedup remains in place. The guard uses axis `malformed_missing_span_guard`, prior review count `0`, no Review Card, no Operator Observation Card, and no repeated general Review Hub request.
- Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved human-owned decisions.

## What Was Verified

- Git parity after fetch before this slice: `git rev-list --left-right --count HEAD...origin/master` reported `0 0`.
- Local working tree started clean on `master` at `b483e1c Probe sparse bullet fixture coverage`.
- Project-local instructions and required context docs were read before changing review claims.
- `node --check tools/fff-state.mjs` passed after the validator update.
- `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json` passed.
- `node tools/fff-state.mjs smoke-malformed-missing-span-guard artifacts/extraction-validator-smoke-result.json artifacts/malformed-missing-span-guard-result.json` passed.

## Probe Snapshot

| Work | Purpose | Effect | Current state |
| --- | --- | --- | --- |
| Source-span validator guard | Reject unusable source-span evidence before routed candidates can be accepted | Adds contract-level checks for missing object, empty text, invalid offsets, and zero/negative ranges | `tools/fff-state.mjs` rejects the new negative fixture |
| Negative fixture | Cover one named remaining fixture class without expanding positive adapter output | Exercises missing sourceSpan, malformed start, empty text, zero-width range, and missing sourceRefIds | `malformed-missing-source-span.json` is expected-invalid |
| Guard readback | Prove invalid evidence stays out of adoption surfaces | Records reject/hold/mark/keep-out behavior in one machine-readable result | `malformed-missing-span-guard-result.json` passed |
| Positive pack preservation | Avoid reopening already-closed source-span work | Keeps 48 source-pack rows, 5 adapter payloads, and 60 adapter elements unchanged | Existing pack and routing counts preserved |
| Human-burden hygiene | Avoid repeated review asks | Confirms no Review Card, no fixed form, no Operator Observation Card | Freeform review remains optional |

## What Remains Missing

- Human freeform review of final source-span wording remains optional. Current weak, broad, routing, sparse fixture, and malformed-span guard readbacks are sufficient to continue reversible local work.
- Remaining fixture classes are contradictory memo claims, very broad source-span fixture shape, multilingual or translated memo text, and model/API provider envelope output.
- Actual model/API extraction adapter behind the validator boundary.
- Provider choice, credential flow, timeout value, and retry count for a future integration.
- Durable project database.
- YouTube publishing, automated upload, and AI video generation.
- Complete world chronology.
- Final canon decisions for Toma, the brass moth, or the Council.

## Review Debt

| Target | Purpose | State | Next move |
| --- | --- | --- | --- |
| Malformed/missing source-span payloads | Prevent invalid source evidence from entering routed adoption surfaces | Covered by `fff-malformed-missing-span-guard-001`; 3 invalid elements rejected, 0 accepted routed candidates | Do not reopen unless the validator contract or fixture output changes |
| Sparse bullet fixture | Cover one named missing memo shape | Covered by `fff-missing-fixture-class-probe-001`; 12 held elements, 0 failures | Do not reopen unless the fixture or selector changes |
| Weak source spans | Make valid but thin source evidence useful | 6 weak rows repaired with stronger same-fixture source refs | Do not reopen unless adapter output or human review changes one row |
| Broad source spans | Keep mixed evidence from hiding separate review roles | One split and one kept with reason remain preserved | Do not reopen unless source output changes |
| Routing policy | Keep Visual, Profile/Ghost, Claim, Timeline, Source Reference, and Human Review distinct | Regression smoke passes across 5 adapter payloads and 60 adapter elements | Add one fixture class only if route drift or review evidence names a concrete missing shape |
| Remaining fixture classes | Cover memo/output shapes not yet represented | 4 candidate classes remain after malformed/missing span coverage | Add one class at a time only when it has concrete decision value |
| Model/API adapter | Implement provider-backed extraction only behind existing gates | Not started | Keep blocked until explicit authorization and reviewed source-span gates |

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

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate before adopting ending-sensitive profile or timeline entries.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep object/rule profiles held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, or keep motive-disclosure and stolen-time profiles held.

## Next Recommended Slice

Use review memory before asking for another review. The next non-redundant move is not another sparse-note or malformed-span review; choose a different remaining fixture class only after a concrete coverage need is named, or verify the active manifest and Review Hub handoff if the next terminal needs a clean restart. Do not start model/API behavior, database persistence, publishing, AI video generation, production sync, credentials, or final canon decisions unless explicitly requested.
