# One-story Draft Review Pack

## Purpose

`fff-one-story-draft-review-pack-001` turns the Designer Candidate Dashboard into one local, reviewable story/video draft packet.

The pack is intentionally provisional. It chooses one default candidate from the Designer Dashboard so review can continue without waiting for a human selection, but the selection remains marked `provisional_default`.

## What Was Implemented

- Added a `Draft Review Pack` mode to `public/review/index.html`.
- Preserved the existing `Designer Dashboard` mode and made it reachable through the mode switcher.
- Selected `designer-content-moth-investigation-3m` as the provisional default candidate.
- Added draft beats, a non-final opening sample, narration excerpt, visual direction cues, subtitle/on-screen text cues, channel route, unresolved human-owned questions, risk cards, and reviewer decisions.
- Added `artifacts/one-story-draft-review-pack-result.json`.
- Added `node tools/fff-state.mjs smoke-one-story-draft-review-pack ...`.

## How To Open

From the repo root:

```powershell
Invoke-Item .\public\review\index.html
```

Mode-specific route:

```text
public/review/index.html?mode=draft
```

## What To Review

- Whether `designer-content-moth-investigation-3m` should remain the first draft route or be replaced by another dashboard candidate.
- Whether the mystery-lore channel route fits the first draft pass.
- Whether the five-beat spine is enough for a later production package.
- Whether the sample opening and narration excerpt are useful as non-final style material.
- Whether visual and subtitle cues are clear enough without implying release-ready assets.
- Whether Toma fate, brass moth function, and Council motive should stay held or receive provisional routes.

## Preserved Boundaries

- No external call.
- No provider configuration.
- No credential handling.
- No public upload.
- No AI video generation.
- No production render.
- No final prose.
- No final canon decision.
- Toma fate, brass moth truth/function, and Council motive remain human-owned.
- Visual, thumbnail, and subtitle directions are text-only review cues with rights still unknown.

## Validation Commands

```powershell
node --check .\tools\fff-state.mjs
node .\tools\fff-state.mjs smoke-one-story-draft-review-pack .\artifacts\one-story-draft-review-pack-result.json .\artifacts\one-story-draft-review-pack-result.json
node .\tools\fff-state.mjs smoke-designer-candidate-dashboard .\artifacts\designer-candidate-dashboard-result.json .\artifacts\designer-candidate-dashboard-result.json
node .\tools\fff-state.mjs validate-contradictory-claim-guard .\artifacts\extraction-validator-smoke-result.json
git diff --check
```

If docs dependencies are available:

```powershell
python -m mkdocs build --strict
```

## Known Limitations

- The selected candidate is a provisional default, not a human choice.
- The sample opening and narration are review excerpts, not final prose.
- The pack does not create video, thumbnails, release assets, upload metadata, or provider output.
- Browser screenshot evidence was not required for the data smoke; static UI checks can verify the mode and renderer.

## Next Recommended Slice

After review, the next non-redundant slice is a draft-to-video planning bridge that packages the approved draft route into narration, subtitle, thumbnail, shot, and rights-review components without creating video or calling a provider.
