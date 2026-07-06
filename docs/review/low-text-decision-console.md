# Low-text Decision Console

Artifact: `fff-low-text-decision-console-001`

## Purpose

This slice responds to the operator feedback that the guided review surface still felt like lecture notes. It makes the first `brief` view a low-text decision console before the Guided Flow, Latest Overview, and card-heavy Home Cockpit details.

Primary route:

- `public/review/index.html?mode=brief`
- next route: `public/review/index.html?mode=bridge`

## What Was Implemented

- Added `data-decision-console="low-text-decision-console"` as the first review decision surface inside `mode=brief`.
- Reduced the top visible task to one question: `この路線で進める？`.
- Added five answer buttons: `進める`, `語り口を直す`, `字幕を直す`, `サムネを直す`, `保留真実を直す`.
- Added one primary action: `Bridgeで確認`.
- Added a compact context dock with candidate, channel, pre-production, no-generation, no-publication, and non-final canon chips.
- Added a six-step rail for `路線`, `語り`, `字幕`, `画面`, `サムネ`, and `保留真実`, with exactly one current step.
- Added a closed detail drawer and a closed notes shelf for the longer inherited material.
- Marked legacy Guided Flow, Latest Overview, and Home Cockpit blocks with `data-card-wall-suppressed="true"` while preserving their markers.
- Added `data-bridge-decision-console="true"` at the top of Bridge before the detailed Bridge cards.

## Text Budget

The top console is intentionally short:

- main question: 34 Japanese characters or fewer
- answer labels: 18 Japanese characters or fewer
- helper line: 42 Japanese characters or fewer
- no top-console paragraph over 70 characters
- no more than five visible sentences
- no repeated `今回` / `this time` phrasing in the top console

## Preserved Review Truth

The slice preserves these readbacks instead of replacing them:

- `fff-guided-review-flow-workspace-001`
- `fff-bridge-refinement-overview-ribbon-001`
- `fff-home-cockpit-metric-linking-001`
- `fff-draft-to-video-planning-bridge-001`
- `fff-review-brief-dark-mode-ux-001`
- `fff-one-story-draft-review-pack-001`
- `fff-designer-candidate-dashboard-001`
- `fff-draft-review-pack-stabilization-001`
- `fff-contradictory-claim-guard-001`

Selected candidate `designer-content-moth-investigation-3m` and selected channel route `designer-channel-mystery-lore` remain visible and searchable.

## Boundaries

This is a local review UX refinement only. It does not add or authorize:

- provider/API setup
- credentials
- AI video generation
- production render
- upload or publishing
- rights clearance
- final canon
- database persistence
- script, subtitle, thumbnail, video, or release asset generation

Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved and human-owned.

## Readback

Machine readback is stored at:

```text
artifacts/low-text-decision-console-result.json
```

Smoke command:

```powershell
node tools/fff-state.mjs smoke-low-text-decision-console artifacts/low-text-decision-console-result.json artifacts/low-text-decision-console-result.json
```

The validator checks first placement, active question, choice count and labels, one primary action, context dock, step rail, closed detail drawer, closed notes shelf, card-wall suppression, Bridge decision console, text budget, preserved content, dark mode, selected IDs, and closed gates.

## Next Recommended Slice

If the user accepts this low-text console, the next narrow slice is `fff-bridge-review-refinement-001`: make one story package easier to review by tightening speech rhythm, subtitle line division, shot order, and thumbnail comparison without opening provider/API, generation, publishing, rights, or final-canon lanes.
