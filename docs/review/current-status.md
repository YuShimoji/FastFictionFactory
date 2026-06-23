# Current Status Packet

## Active Artifact

- Artifact id: `fff-weak-span-repair-001`
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
- Weak-span repair doc: `docs/review/weak-span-repair.md`
- Weak-span repair result: `artifacts/weak-span-repair-result.json`
- Broad source-span split doc: `docs/review/broad-span-split.md`
- Broad source-span split result: `artifacts/broad-span-split-result.json`
- Routing policy regression doc: `docs/review/routing-policy-regression-hardening.md`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Ambiguous routing resolution doc: `docs/review/ambiguous-routing-resolution.md`
- Ambiguous routing resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Source-span quality audit doc: `docs/review/source-span-quality-audit.md`
- Source-span quality audit result: `artifacts/source-span-quality-audit-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Source-span pack generator: `tools/fff-source-span-review-pack.mjs`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Review memory / dedup smoke: `artifacts/review-memory-dedup-smoke-result.json`
- Review procedure: `docs/review/review-procedure.md`
- Review procedure smoke: `artifacts/review-procedure-lock-smoke-result.json`
- Review Hub IA mode split doc: `docs/review/review-hub-ia-mode-split.md`
- Review Hub IA smoke: `artifacts/review-hub-ia-mode-split-smoke-result.json`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Model/API boundary envelope: `artifacts/model-api-boundary-envelope.example.json`
- Model/API boundary smoke: `artifacts/model-api-boundary-smoke-result.json`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- State adapter: `tools/fff-state.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Current state: `artifacts/current-project-state.json`
- Sample state: `artifacts/sample-project-state.json`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Mode screenshots: `artifacts/review-screens/`
- Local docs view: `mkdocs.yml`

## What Exists Now

- Local static Visual Review Hub remains the single entry point.
- The Hub exposes Story Review, Source Audit, Project Cockpit, and Artifacts modes.
- The active Review Hub identity now points to `fff-weak-span-repair-001`.
- `docs/review/weak-span-repair.md` records the 6 weak-span repair decisions from `fff-source-span-quality-audit-001`.
- `artifacts/weak-span-repair-result.json` records 6 weak rows loaded, 6 repaired with stronger same-fixture source refs, 0 shrink-only decisions, 0 keep-only decisions, 0 new human holds, 6 original locators preserved, and 0 failures.
- The repaired weak spans are readback decisions only. The deterministic adapter output is not rewritten in this slice.
- `docs/review/broad-span-split.md` and `artifacts/broad-span-split-result.json` remain preserved: 2 broad rows loaded, 1 split into narrower spans, 1 kept with explicit reason, and 0 failures.
- `docs/review/routing-policy-regression-hardening.md` and `artifacts/routing-policy-regression-hardening-result.json` remain preserved: 7 resolved rows, 36 source-pack rows, 4 adapter payloads, 48 adapter elements, and 0 failures.
- `docs/review/ambiguous-routing-resolution.md` and `artifacts/ambiguous-routing-resolution-result.json` remain preserved: 7 ambiguous rows resolved into 3 Profile-primary routes, 1 Visual-primary route, and 3 Human Review holds.
- `docs/review/source-span-quality-audit.md` and `artifacts/source-span-quality-audit-result.json` remain preserved: 28 useful spans, 6 weak spans, 2 broad spans, 0 missing refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows.
- Review Memory / Dedup remains in place. The weak-span repair uses axis `weak_span_repair`, prior review count `0`, no Review Card, and no repeated general Review Hub request.
- Source refs, held defaults, source-span review pack evidence, model/API boundary spec, local adapter artifacts, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries remain preserved.
- Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved human-owned decisions.

## What Was Verified

- Git parity after fetch before this slice: `git rev-list --left-right --count HEAD...origin/master` reported `0 0`.
- Local working tree started clean on `master` at `db87dcf Refresh broad span validation evidence`.
- Project-local instructions and required context docs were read before changing review claims.
- `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json` passed and regenerated the weak-span result.
- `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json` remains part of the active validation contract.
- `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json` remains part of the active validation contract.
- The active manifest validation command passed for `fff-weak-span-repair-001`; it re-ran adapter smoke, adapter matrix generation, source-span review pack generation, state/extraction validation, weak-span repair readback, broad-span split readback, and routing policy regression readback.
- MkDocs strict build, HTML script syntax check, and `git diff --check` passed.

## Weak-Span Repair Snapshot

| Row | Previous thin evidence | Repair | Why it helps |
| --- | --- | --- | --- |
| `local-x-place-north-bell` | `North Bell Station` | `old observatory above North Bell Station still rings at noon` | Adds the event that explains Timeline usefulness. |
| `local-x-document-ledger` | `ledger of minutes` | `council keeps a ledger of minutes in a locked cabinet` | Adds document action and claim context. |
| `minutes-x-place-glass-arcade` | `glass arcade` | `At 9:17, apprentice Rowan Ise waits in the glass arcade` | Adds time and waiting context for Timeline review. |
| `edge-x-place-north-bell` | `North Bell Station` | `old observatory above North Bell Station rings at noon` | Connects the place to the noon-repeat event. |
| `edge-x-object-brass-moth-key` | `brass moth key` | `Toma's last route is pinned under a brass moth key` | Adds route context while preserving human-owned brass moth and Toma decisions. |
| `edge-x-document-ledger-page` | `A ledger page` | `ledger page lists borrowed minutes from abandoned lives` | Adds the claim-bearing evidence needed for Claim review. |

## What Remains Missing

- Human freeform review of whether the procedure, screenshot map, and four modes reduce future review friction. This should not be asked again unless target, axis, evidence, or decision value changes.
- Human freeform review of final source-span wording remains optional. Current weak and broad span readbacks are sufficient to continue reversible local work.
- More edge fixture classes if review or validator evidence names a concrete need: contradictory memo claims, very broad source spans, malformed or missing spans, multilingual or translated memo text, sparse bullet-only notes, and provider-envelope output.
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
| Weak source spans | Make valid but thin source evidence useful without rewriting adapter output | 6 weak rows repaired with stronger same-fixture source refs; 6 locators preserved; 0 failures | Do not reopen unless adapter output or human review changes one row |
| Broad source spans | Keep mixed evidence from hiding separate review roles | Resolved by `fff-broad-span-split-001`: one split, one kept with reason | Do not reopen unless source output changes |
| Routing policy | Keep Visual, Profile/Ghost, Claim, Timeline, Source Reference, and Human Review destinations distinct | Regression smoke preserves 0 failures across current fixtures and adapter outputs | Add one missing fixture class only if route drift or review evidence names a concrete missing shape |
| Missing fixture classes | Cover memo shapes not yet represented by deterministic fixtures | Held until review or validation names a need | Add one fixture class at a time |
| Model/API adapter | Implement provider-backed extraction only behind existing gates | Not started | Keep blocked until explicit authorization and reviewed source-span gates |
| Durable database and publishing | Persist and release production work | Out of scope | Do not start until review workflow and release authority are accepted |

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate before adopting ending-sensitive profile or timeline entries.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep object/rule profiles held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, or keep motive-disclosure and stolen-time profiles held.

## Next Recommended Slice

Use review memory before asking for another review. The next non-redundant move is one missing fixture class only after a concrete coverage need is named. Do not reopen weak-span, broad-span, or ambiguous-routing debt unless source output changes or a focused review signal identifies a specific row. Do not start model/API behavior, database persistence, publishing, AI video generation, production sync, credentials, or final canon decisions unless explicitly requested.
