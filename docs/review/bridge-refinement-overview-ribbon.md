# Bridge Refinement Overview Ribbon

`fff-bridge-refinement-overview-ribbon-001` adds a lightweight current-status layer to the Home Cockpit and refines the Draft-to-Video Bridge for the next human review. It does not rebuild the Review Hub information architecture and does not start production.

## Purpose

The reviewer already has Home Cockpit, Bridge, Draft Review Pack, Designer Dashboard, and Evidence Vault shelves. The problem is not missing data; it is that the first screen still risks showing many valid things in parallel. This slice puts a compact Latest Overview Report near the top of `public/review/index.html?mode=brief` so the reviewer can see current state, latest change, read-now path, next decision, and locked lanes before scanning shelves or meters.

## User Review Trigger

The user noted that the organization is better, but when they want the latest information they need an overview report first, not only comprehensive lists. The user also said not to over-invest right now. This slice treats that as a small product adjustment: one overview ribbon plus a narrow Bridge refinement, not a new dashboard.

## Why This Is Lightweight

| Choice | Reason | Boundary |
| --- | --- | --- |
| Add a compact ribbon | It answers the "what changed / what do I read now" question in 5 items | It does not become a second manifest or full project report |
| Demote the old Review Brief | It removes competing introductions under `brief` mode | Candidate/channel IDs and review prompts remain preserved in a folded shelf |
| Refine Bridge in place | It advances the actual next review target | It remains non-final and pre-production only |
| Keep Evidence Vault optional | It preserves audit depth without forcing it into the first read | Source Audit / Project Cockpit / Artifacts are not required reading |

## Overview Ribbon Semantics

The Latest Overview Report has five compact items:

- 最新状態: Home Cockpit and Draft-to-Video Bridge are the current operator surfaces.
- 直近の変更: shelves and meters are linked; Bridge is now refined for the next review.
- 今読む場所: read the overview first, then the Draft-to-Video Bridge.
- 次に判断すること: route, narration, subtitle, visual, thumbnail, and held truths.
- まだ開かない作業: provider/API, AI video, render, upload, final canon, and rights clearance remain locked.

The ribbon includes one obvious Bridge action through `data-overview-bridge-link="true"`.

## Bridge Refinement Details

The Bridge now includes a compact pre-production refinement section:

| Area | Added review cue | Still not done |
| --- | --- | --- |
| Narration | 5 non-final candidate segments with pause, emphasis, and withholding notes | No final narration or final script |
| Subtitle rhythm | 6 short/hold/reveal/warning/closing timing cues | No final subtitle file or typography lock |
| Visual ordering | 6 shot-order cues with placeholder / rights_unknown language | No generated image, asset selection, or production render |
| Thumbnail | 3 alternatives: brass moth object hook, bellless tower paradox, ledger / erased names | No final thumbnail and no image generation |
| Held truths | Toma fate, brass moth truth/function, and Council motive stay unresolved | No final canon decision |
| Rights/assets | Explicit no-generated-image, no-final-asset, no-rights-clearance boundary | No rights clearance claim |

## What The Reviewer Should Read Now

Open `public/review/index.html?mode=brief`, read the Latest Overview Report, then click through to `public/review/index.html?mode=bridge`. The expected response can be freeform: accept, revise, or reject the route, narration rhythm, subtitle style, visual order, thumbnail direction, and held-truth policy.

## Evidence-Only Surfaces

`Source Audit`, `Project Cockpit`, and `Artifacts` remain Evidence Vault shelves. They are still available, but the current review does not require opening all of them. Use them only if the Bridge raises a source, boundary, artifact, or audit concern.

## Preserved Boundaries

This slice keeps these lanes closed:

- provider/API setup
- credential handling
- AI video generation
- production render
- YouTube upload or public publishing
- final canon decisions
- rights clearance claims
- final video script, final thumbnail, final image, or final asset production

## Validation Commands

Run from the repo root:

```powershell
node --check .\tools\fff-state.mjs
node .\tools\fff-state.mjs smoke-bridge-refinement-overview-ribbon .\artifacts\bridge-refinement-overview-ribbon-result.json .\artifacts\bridge-refinement-overview-ribbon-result.json
node .\tools\fff-state.mjs smoke-home-cockpit-metric-linking .\artifacts\home-cockpit-metric-linking-result.json .\artifacts\home-cockpit-metric-linking-result.json
node .\tools\fff-state.mjs smoke-draft-to-video-planning-bridge .\artifacts\draft-to-video-planning-bridge-result.json .\artifacts\draft-to-video-planning-bridge-result.json
node .\tools\fff-state.mjs smoke-review-brief-dark-mode-ux .\artifacts\review-brief-dark-mode-ux-result.json .\artifacts\review-brief-dark-mode-ux-result.json
node .\tools\fff-state.mjs smoke-one-story-draft-review-pack .\artifacts\one-story-draft-review-pack-result.json .\artifacts\one-story-draft-review-pack-result.json
node .\tools\fff-state.mjs smoke-designer-candidate-dashboard .\artifacts\designer-candidate-dashboard-result.json .\artifacts\designer-candidate-dashboard-result.json
node .\tools\fff-state.mjs smoke-contradictory-claim-guard .\artifacts\extraction-validator-smoke-result.json .\artifacts\contradictory-claim-guard-result.json
```

Docs build:

```powershell
uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"
```

## Known Limitations

- Static checks prove the UI markers and content are present; no browser screenshot is required for this slice.
- The old Review Brief is still in the DOM for preservation and validator compatibility, but it is visually demoted behind a folded shelf.
- The Bridge refinement is candidate planning language only. A later slice may choose a narrower narration, subtitle, shot, or thumbnail direction.

## Next Possible Slice

If the human review accepts the route, the next non-production slice can be `fff-bridge-review-refinement-001`: one video package with narration detail, subtitle rhythm, screen beats, and thumbnail comparison. If review pushes back, revise only the relevant Bridge section before any provider/API, AI video, render, upload, rights, or final-canon work.
