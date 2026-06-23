# Current Status Packet

## Active Artifact

- Artifact id: `fff-missing-fixture-class-probe-001`
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
- Missing fixture probe doc: `docs/review/missing-fixture-class-probe.md`
- Missing fixture probe result: `artifacts/missing-fixture-class-probe-result.json`
- New sparse fixture memo: `artifacts/extraction-adapter-fixtures/sparse-bullet-notes.md`
- New sparse fixture output: `artifacts/extraction-adapter-outputs/sparse-bullet-notes.json`
- Weak-span repair doc/result: `docs/review/weak-span-repair.md`, `artifacts/weak-span-repair-result.json`
- Broad-span split doc/result: `docs/review/broad-span-split.md`, `artifacts/broad-span-split-result.json`
- Routing policy regression doc/result: `docs/review/routing-policy-regression-hardening.md`, `artifacts/routing-policy-regression-hardening-result.json`
- Ambiguous routing resolution doc/result: `docs/review/ambiguous-routing-resolution.md`, `artifacts/ambiguous-routing-resolution-result.json`
- Source-span quality audit doc/result: `docs/review/source-span-quality-audit.md`, `artifacts/source-span-quality-audit-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Source-span pack generator: `tools/fff-source-span-review-pack.mjs`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- State adapter: `tools/fff-state.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Model/API boundary smoke: `artifacts/model-api-boundary-smoke-result.json`
- Validator fixtures/smoke: `artifacts/extraction-negative-fixtures/`, `artifacts/extraction-validator-smoke-result.json`
- Current/sample state: `artifacts/current-project-state.json`, `artifacts/sample-project-state.json`
- Local docs view: `mkdocs.yml`

## What Exists Now

- The active Review Hub identity is now `fff-missing-fixture-class-probe-001`.
- The cleanup sequence through `fff-weak-span-repair-001` remains closed: 6 weak rows repaired, 6 original locators preserved, and 0 failures.
- A single missing fixture class was selected: sparse bullet-only notes. The concrete reason is that existing artifacts named sparse notes as uncovered, while the prior fixture set was paragraph-style.
- `artifacts/extraction-adapter-fixtures/sparse-bullet-notes.md` adds one bullet-only memo without model/API, provider envelope, multilingual policy, database work, production sync, or canon resolution.
- `artifacts/extraction-adapter-outputs/sparse-bullet-notes.json` contains 12 held extraction elements with 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held defaults, and 0 human-owned adopt suggestions.
- The adapter matrix now contains 4 fixture outputs and 48 extracted elements. Required element-type coverage remains complete.
- The source-span review pack now reads 4 fixtures, 48 elements, 36 profile candidates, 27 claim candidates, 16 timeline candidates, 22 human-owned guarded elements, and 0 automated guard failures.
- Routing regression now checks 7 resolved policy rows against 48 source-pack rows, 5 adapter payloads, and 60 adapter elements with 0 failures.
- Review Memory / Dedup remains in place. The probe uses axis `missing_fixture_class_probe`, prior review count `0`, no Review Card, no Operator Observation Card, and no repeated general Review Hub request.
- Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved human-owned decisions.

## What Was Verified

- Git parity after fetch before this slice: `git rev-list --left-right --count HEAD...origin/master` reported `0 0`.
- Local working tree started clean on `master` at `ed07086 Repair weak source spans`.
- Project-local instructions and required context docs were read before changing review claims.
- `node tools/fff-extract-local.mjs artifacts/sample-raw-memo.md artifacts/local-extraction-adapter-output.json artifacts/local-extraction-adapter-smoke-result.json` passed.
- `node tools/fff-extract-local.mjs --matrix artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json` passed.
- `node tools/fff-source-span-review-pack.mjs artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/source-span-routing-review-pack.json` passed.
- `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json` passed.
- `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json` passed.
- `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json` passed.
- `node tools/fff-state.mjs smoke-missing-fixture-class-probe artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/missing-fixture-class-probe-result.json` passed.

## Probe Snapshot

| Work | Purpose | Effect | Current state |
| --- | --- | --- | --- |
| Sparse fixture memo | Cover a named missing memo shape without asking for human review | Adds terse bullet-only source text to the deterministic matrix | `sparse-bullet-notes.md` exists with 11 bullet lines |
| Sparse adapter output | Prove the extractor can read the new shape without source/routing drift | Adds 12 held extraction elements and complete element-type coverage | 0 span mismatches, 0 missing refs, 0 unsafe visual routes |
| Selector update | Avoid paragraph sample fallback when fixture text reuses common phrases | Path match now wins before shared phrase match | Matrix selects `sparse-bullet-notes` correctly |
| Source-pack readback | Keep fixture coverage evidence aligned with generated output | Source pack now reads 4 fixtures and removes sparse notes from remaining gaps | 48 source-pack rows, 0 failures |
| Probe smoke | Record Review Memory and human-burden hygiene for this axis | Confirms no Review Card, no fixed form, and no repeated general review | `missing-fixture-class-probe-result.json` passed |

## What Remains Missing

- Human freeform review of final source-span wording remains optional. Current weak, broad, routing, and sparse fixture readbacks are sufficient to continue reversible local work.
- Remaining fixture classes are now contradictory memo claims, very broad source-span fixture shape, malformed or missing source span payloads, multilingual or translated memo text, and model/API provider envelope output.
- Actual model/API extraction adapter behind the validator boundary.
- Provider choice, credential flow, timeout value, and retry count for a future integration.
- Durable project database.
- YouTube publishing, automated upload, and AI video generation.
- Complete world chronology.
- Final canon decisions for Toma, the brass moth, or the Council.

## Review Debt

| Target | Purpose | State | Next move |
| --- | --- | --- | --- |
| Sparse bullet fixture | Cover one named missing memo shape | Covered by `fff-missing-fixture-class-probe-001`; 12 held elements, 0 failures | Do not reopen unless the fixture or selector changes |
| Weak source spans | Make valid but thin source evidence useful | 6 weak rows repaired with stronger same-fixture source refs | Do not reopen unless adapter output or human review changes one row |
| Broad source spans | Keep mixed evidence from hiding separate review roles | One split and one kept with reason remain preserved | Do not reopen unless source output changes |
| Routing policy | Keep Visual, Profile/Ghost, Claim, Timeline, Source Reference, and Human Review distinct | Regression smoke passes across 5 adapter payloads and 60 adapter elements | Add one fixture class only if route drift or review evidence names a concrete missing shape |
| Remaining fixture classes | Cover memo/output shapes not yet represented | 5 candidate classes remain after sparse notes coverage | Add one class at a time only when it has concrete decision value |
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

Use review memory before asking for another review. The next non-redundant move is not another sparse-note review; choose a different remaining fixture class only after a concrete coverage need is named, or verify the active manifest and Review Hub handoff if the next terminal needs a clean restart. Do not start model/API behavior, database persistence, publishing, AI video generation, production sync, credentials, or final canon decisions unless explicitly requested.
