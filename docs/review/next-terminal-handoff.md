# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

Latest handoff refresh: 2026-06-23T10:00:19+09:00. At refresh time, the active artifact is `fff-broad-span-split-001`, and local/remote `master` were clean and synced at `e3a1dd0 Resolve broad source spans`.

## Start Here

1. Pull the latest remote state:

```powershell
git pull --ff-only
```

2. Confirm Git parity:

```powershell
git status --short --branch
git rev-list --left-right --count "HEAD...@{u}"
git log -5 --oneline --decorate
```

Expected after this handoff is published: `master` is clean and synced with `origin/master`, with `HEAD...@{u}` reporting `0 0`.

3. Read these files in this order:

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
docs/review/broad-span-split.md
artifacts/broad-span-split-result.json
docs/review/routing-policy-regression-hardening.md
artifacts/routing-policy-regression-hardening-result.json
docs/review/ambiguous-routing-resolution.md
artifacts/ambiguous-routing-resolution-result.json
docs/review/source-span-quality-audit.md
artifacts/source-span-quality-audit-result.json
docs/review/review-memory-dedup.md
docs/review/review-procedure.md
docs/review/review-hub-ia-mode-split.md
docs/review/source-span-routing-review-pack.md
docs/review/model-api-boundary-spec.md
docs/idea-ledger.md
docs/decision-log.md
```

4. Open the active local review artifact:

```powershell
.\scripts\operator\open_review.ps1
```

or:

```sh
./scripts/operator/open_review.sh
```

5. Re-run local checks before changing behavior:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
python -m mkdocs build --strict
git diff --check
```

If `python -m mkdocs build --strict` is unavailable, use a real Python/MkDocs Material runtime instead of the default WindowsApps Python stub.

## Current Project State

- Active artifact: `fff-broad-span-split-001`
- Active UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Broad source-span split doc: `docs/review/broad-span-split.md`
- Broad source-span split result: `artifacts/broad-span-split-result.json`
- Routing policy regression doc: `docs/review/routing-policy-regression-hardening.md`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Ambiguous routing resolution doc: `docs/review/ambiguous-routing-resolution.md`
- Ambiguous routing resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Source-span quality audit doc: `docs/review/source-span-quality-audit.md`
- Source-span quality audit result: `artifacts/source-span-quality-audit-result.json`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Review procedure: `docs/review/review-procedure.md`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Source-span pack generator: `tools/fff-source-span-review-pack.mjs`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`

The current artifact resolves the two broad rows found by `fff-source-span-quality-audit-001` without changing adapter output. `local-x-visual-observatory` is split into narrower visual/profile and timeline evidence snippets, while `minutes-x-placeholder-proof-bait` is kept as one held placeholder because splitting its alternatives would imply canon choices. It keeps Review Hub as the single entry point and preserves routing policy regression, Review Memory, the source-span review pack, model/API boundary, adapter artifacts, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

## What Finished

- `fff-source-span-quality-audit-001` classified all 36 source-span review-pack rows.
- The quality audit recorded 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows.
- `fff-ambiguous-routing-resolution-001` resolved all 7 ambiguous rows.
- Resolution counts: 3 Profile-primary rows, 1 Visual-primary row, 3 Human Review holds, 5 Claim secondary-evidence rows, and 6 Timeline secondary-evidence rows.
- `local-x-visual-observatory` no longer routes directly to Claim Ledger and keeps `targetClaimIds: []`.
- All visual asset rows now avoid direct Claim targets in deterministic adapter outputs.
- `fff-routing-policy-regression-hardening-001` adds `node tools/fff-state.mjs smoke-routing-policy ...`.
- The routing regression result checks 7 resolved rows, 36 source-pack rows, 4 adapter payloads, 48 adapter elements, 1 visual resolution row, 3 unresolved-decision rows, 3 source-reference pack rows, and 4 source-reference adapter rows with 0 failures.
- `fff-broad-span-split-001` adds `node tools/fff-state.mjs smoke-broad-span-split ...`.
- The broad-span split result checks 2 broad rows, splits `local-x-visual-observatory` into `its bell was removed` and `still rings at noon`, keeps `minutes-x-placeholder-proof-bait` with an explicit human-owned reason, preserves 2 source refs, and reports 0 failures.
- Review Dedup Gate was checked with axis `broad_span_split`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub review request.
- No model/API behavior, credentials, database persistence, publishing adapter, production sync, AI video generation, or final canon decision was added.

## Validation Readback

The active manifest validation command passed for the latest slice. It parsed the broad-span split, regression, and resolution JSON, regenerated adapter smoke/matrix outputs, regenerated the source-span review pack, validated adapter outputs, validated current/sample state, validated the sample extraction payload, ran extraction fixture validation, checked Review Hub text, confirmed `externalCallAllowed: false`, confirmed the local visual row no longer appears as Claim-routed in the source-span pack, ran the broad-span split smoke command, and ran the reusable routing policy regression smoke command.

Additional checks already passed during the latest slice:

- `uvx --with mkdocs-material mkdocs build --strict`
- `git diff --check`
- `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0` before the handoff refresh began.
- `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json`
- Final post-push readback on 2026-06-23T10:00:19+09:00: `git status --short --branch` reported `## master...origin/master`; `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0`; HEAD and `origin/master` both pointed at `e3a1dd0 Resolve broad source spans`.

## Preserved Boundaries

Do not add model/API extraction behavior, provider credentials, database persistence, publishing, production sync, upload credentials, AI video generation, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive

The local review state is not final canon. Claims, profiles, timeline entries, extraction elements, adapter confidence, validator results, and source-span pack summaries may guide review, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, accept natural freeform review text instead of fixed phrases.

Before emitting a Review Card, check the review memory. Do not ask the same target/evidence/axis again unless target, axis, evidence, decision value, or an explicit user request changed.

No general Review Hub review is needed for the current state. Future review should be bounded to one concrete target such as a weak span or missing fixture class; do not reopen broad-span debt unless source output changes.

## Next Useful Entrances

| Entrance | Why it helps | What becomes possible |
| --- | --- | --- |
| Advance: one missing fixture class | Covers a memo shape not represented by the current three fixtures | Future adapter/model work gets clearer regression coverage |
| Verify: route-policy regression smoke | Re-runs the named routing policy validator after adapter changes | Future deterministic or model-backed outputs can be rejected earlier |
| Audit: weak source spans | Improves the remaining source-span quality debt without reopening all routing or broad-span decisions | A future review can focus on one concrete weak-span fix |
| Explore: model/API adapter boundary | Uses the existing no-call boundary and validation contract | Provider-backed extraction can start later only after explicit authorization |

## Residual Work

| Work | Purpose | Current state | Next move |
| --- | --- | --- | --- |
| Source-span quality | Make source evidence useful, not only valid | 7 ambiguous routes resolved; 2 broad spans resolved by split/keep readback; weak span debt remains | Pick one weak span and adjust only that row/class |
| Fixture coverage | Cover unrepresented memo shapes | Current three fixtures cover object, visual, unresolved-decision routing | Add one missing fixture class at a time |
| Validator hardening | Prevent future route drift | Named routing policy regression smoke now checks current route policy | Add one missing fixture class only if drift returns |
| Model/API adapter | Replace deterministic extraction with provider-backed extraction | Explicitly not started | Keep blocked until user authorizes provider/credential/API scope |
