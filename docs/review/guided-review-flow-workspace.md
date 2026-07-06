# Guided Review Flow Workspace

Artifact: `fff-guided-review-flow-workspace-001`

## Purpose

This slice turns the active `brief` route into a guided operator workspace. The goal is to make the user read one clear review path first instead of seeing the Home Cockpit, Brief, Bridge, draft, evidence, and artifact shelves as equal-weight panels.

The active route remains local and static:

- Primary review entry: `public/review/index.html?mode=brief`
- Next review route: `public/review/index.html?mode=bridge`
- Compatibility alias: `public/review/index.html?mode=home`

## What Was Implemented

- Added a first visible Guided Review Flow section before the Latest Overview Report and before the card-heavy Home Cockpit shelves.
- Added one primary action into Bridge review: start the Bridge order review from `public/review/index.html?mode=brief`.
- Added a six-step Decision Queue:
  - route confirmation
  - narration direction
  - subtitle rhythm
  - visual order
  - thumbnail direction
  - held-truth policy
- Added a Pinned Tray for the selected candidate, selected channel route, active artifact, source overview artifact, and unresolved story truths.
- Added an Operations Notice that keeps `Source Audit`, `Project Cockpit`, and `Artifacts` as optional audit shelves.
- Added Important Folders with purpose, open trigger, do-not-open condition, and next action for current work, materials, evidence, inspiration, and locked lanes.
- Added an Inspiration Workspace with local-only pre-production prompts for narration, subtitles, visual order, thumbnails, and held-truth review.
- Added a Bridge Guided Flow at the top of `mode=bridge` so Bridge review follows the same decision order.
- Marked legacy card-grid cockpit shelves as demoted detail content while preserving their DOM markers for existing smokes.

## Preserved Review Truth

The slice preserves:

- `fff-bridge-refinement-overview-ribbon-001`
- `fff-home-cockpit-metric-linking-001`
- `fff-draft-to-video-planning-bridge-001`
- `fff-review-brief-dark-mode-ux-001`
- `fff-one-story-draft-review-pack-001`
- `fff-designer-candidate-dashboard-001`
- `fff-draft-review-pack-stabilization-001`
- `fff-contradictory-claim-guard-001`

Selected candidate `designer-content-moth-investigation-3m` and selected channel route `designer-channel-mystery-lore` remain visible. The Latest Overview Report remains present. The old Brief/Home Cockpit material remains available as demoted detail, not deleted.

## Boundaries

This is a review-flow and workspace slice only. It does not add or authorize:

- provider/API setup
- credentials
- AI video generation
- production render
- upload
- rights-clearance claim
- final canon decision
- durable database persistence

Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved and human-owned.

## Readback

Machine readback is stored at:

```text
artifacts/guided-review-flow-workspace-result.json
```

The smoke command is:

```powershell
node tools/fff-state.mjs smoke-guided-review-flow-workspace artifacts/guided-review-flow-workspace-result.json artifacts/guided-review-flow-workspace-result.json
```

The validator checks that the guided flow appears before the latest overview and legacy cards, that only one primary action is present, that the decision queue has six steps and one current step, that the Pinned Tray / Operations Notice / Important Folders / Inspiration Workspace are visible, that Bridge has a matching guided sequence, and that the closed production gates remain closed.

## Review Debt

| Target | Current state | Next move |
| --- | --- | --- |
| Guided Review Flow | Active first-read workspace on `mode=brief`; old cockpit shelves are preserved below it | Human reviewer should read the guided flow, then open Bridge and comment on the six decision steps |
| Bridge Guided Flow | Active at the top of `mode=bridge`; it does not replace Bridge content | Use it to decide which part to refine first: narration, subtitle rhythm, visual order, thumbnail direction, or held-truth policy |
| Inspiration Workspace | Local prompt board only | Use only for review phrasing and comparison ideas; do not treat prompts as generated assets or final copy |

## Next Recommended Slice

If the user accepts this review flow, the next narrow slice is `fff-bridge-review-refinement-001`: improve one story package's speech rhythm, subtitle line division, shot order, and thumbnail comparison while preserving all provider/API, generation, rights, publishing, and canon locks.
