# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

## Start Here

1. Pull the latest remote state:

```powershell
git pull --ff-only
```

2. Read these files in this order:

```text
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
docs/idea-ledger.md
docs/decision-log.md
```

3. Open the active local review artifact:

```powershell
.\scripts\operator\open_review.ps1
```

4. Re-run the state and artifact checks before changing behavior:

```powershell
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json
node .\tools\fff-state.mjs summarize .\artifacts\current-project-state.json
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
python -m mkdocs build --strict
git diff --check
```

## Current Project State

- Active artifact: `fff-extraction-contract-001`
- Active UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current state JSON: `artifacts/current-project-state.json`
- Sample state JSON: `artifacts/sample-project-state.json`
- Sample extraction payload: `artifacts/sample-extraction-payload.json`
- Latest product checkpoint before this handoff packet: `9a3da0f Add Extraction Contract review slice`
- Current lane: local-first Extraction Contract review before any model/API extractor exists.

The active artifact extends the Visual Review Hub with source refs, extracted elements, candidate routing links, unresolved dependencies, review-safe defaults, warnings, freeform review intake, and human authority boundary labels. It keeps Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, and state validation intact.

## Preserved Boundaries

Do not add model/API extraction behavior, publishing, AI video generation, database persistence, production sync, upload credentials, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive

The local review state is not final canon. Claims, profiles, timeline entries, and extraction elements may be reviewed, held, or promoted inside the workbench, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, do not ask the user to reply with fixed phrases such as `accept`, `reject`, or `small_adjustment`.

Use a Review Card that names the target artifact or section, gives up to three things to inspect, states that freeform review is allowed, gives examples of natural feedback, explains how the agent will interpret and continue, and gives a completion signal.

When review is useful but not required to continue, record it as Review Debt instead of stopping. Any user freeform review is the source of truth.

## What Is Already Verified

- State JSON validates for sample and current project state.
- Extraction Contract has 1 run and 12 extracted elements.
- Required extracted element types are present: person, place, organization, event, object, concept, document, visual_asset, placeholder, source_reference, unresolved_decision.
- Candidate routing exists into Profile/Ghost, Claim Ledger, and Timeline View.
- Browser smoke evidence confirms Extraction Contract rendering, grouping, filtering, search, decision log update, export/import preservation, invalid JSON safety, and continuity of Claim Ledger, Timeline View, and Profile/Ghost Flow.
- Freeform review intake smoke evidence is present.
- Screenshot and contact sheet are current visual proof artifacts.
- MkDocs strict build passed with only the upstream Material for MkDocs future-compatibility warning.

## Next Useful Entrances

| Entrance | Why it helps | What becomes possible |
|---|---|---|
| Advance: local-only extraction adapter spike | Turns the reviewed contract into a deterministic adapter output without external services | Later model/API work can target a stable schema instead of inventing contract fields midstream |
| Audit: review Extraction Contract confidence and routing | Finds overconfident canon-sensitive suggestions before automation expands them | Safer profile, claim, and timeline promotion rules |
| Verify: add negative fixtures to `tools/fff-state.mjs` | Proves missing fields, missing element types, and unsafe state shapes fail loudly | Cleaner future CI or pre-commit validation |
| Explore: durable local storage option | Reduces manual JSON import/export friction while staying local-first | A future file-backed or SQLite store can be planned without changing canon authority |

## Resume Prompt

Use this prompt in a new terminal if you want the next agent to continue directly:

```text
Continue in C:\Users\PLANNER007\FastFictionFactory. Read AGENTS.md, docs/project-context.md, docs/review/current-status.md, docs/review/next-terminal-handoff.md, artifacts/artifact-manifest.json, docs/idea-ledger.md, and docs/decision-log.md first. Preserve the local-first Visual Review Hub and human-owned canon boundaries. The active artifact is fff-extraction-contract-001. Do not add model/API behavior, publishing, AI video generation, database persistence, production sync, credentials, or final canon decisions unless explicitly requested. Start by validating the state and manifest, then either build the local-only extraction adapter spike or address freeform review feedback if present.
```
