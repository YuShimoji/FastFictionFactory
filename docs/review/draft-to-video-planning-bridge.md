# Draft-to-Video Planning Bridge

## Purpose

`fff-draft-to-video-planning-bridge-001` is the local pre-production bridge from the Review Brief to a possible video package. It does not generate video, configure a provider, render production output, upload to YouTube, clear rights, or decide final canon.

Japanese-first operator route:

1. Read `public/review/index.html?mode=brief`.
2. Then read `public/review/index.html?mode=bridge`.
3. Use `Source Audit`, `Project Cockpit`, and `Artifacts` only as optional Evidence Vault shelves.

## Selected Route

- Selected candidate: `designer-content-moth-investigation-3m`
- Selected channel route: `designer-channel-mystery-lore`
- Source review brief artifact: `fff-review-brief-dark-mode-ux-001`
- Source draft pack: `fff-one-story-draft-review-pack-001`
- Source designer dashboard: `fff-designer-candidate-dashboard-001`

The bridge keeps the selected 3-minute mystery-lore route provisional. It is a production hypothesis for review, not final narration or asset direction.

## What Was Added

- `public/review/index.html?mode=bridge`
- A Review Brief route contract near the top of the brief:
  - Operator Track: Review Brief + Draft-to-Video Bridge are required reading.
  - Evidence Vault: Source Audit / Project Cockpit / Artifacts are optional evidence shelves.
  - Not Active: provider/API, AI video, YouTube upload, production render, final canon, and rights clearance.
- A bridge package with:
  - Route summary.
  - Narration outline, explicitly non-final.
  - Subtitle/on-screen text cues.
  - Shot/visual cues.
  - Thumbnail brief.
  - Sound/music/mood cue.
  - Rights/asset risks.
  - Held truths.
  - Production non-goals.
  - Reviewer decisions.
- Dark-mode contrast hotfixes for selected candidate/channel cards, review brief cards, pills, badges, tags, links, muted text, and focus-visible states.

## Readback Result

`artifacts/draft-to-video-planning-bridge-result.json` records:

- `schemaVersion=fff.draftToVideoPlanningBridge.v1`
- `artifact_id=fff-draft-to-video-planning-bridge-001`
- `bridge_visible=true`
- `operator_track_visible=true`
- `evidence_vault_demoted=true`
- `dark_contrast_hotfix_applied=true`
- `narration_outline_count=5`
- `subtitle_cue_count=5`
- `visual_cue_count=5`
- `thumbnail_brief_count=1`
- `sound_mood_cue_count=1`
- `rights_risk_count=5`
- `held_truth_count=4`
- `reviewer_decision_count=4`
- `passed=true`

## Boundary Claims

The bridge keeps these closed:

- `local_only=true`
- `external_call=false`
- `provider_configured=false`
- `credentials_touched=false`
- `public_upload=false`
- `ai_video_generation=false`
- `production_render=false`
- `final_canon_decision=false`
- `rights_cleared_claim=false`

No provider/API endpoint, credential, AI video tool, render pipeline, upload flow, rights state, or canon promotion was added.

## Validation

Run from repo root:

```powershell
node --check .\tools\fff-state.mjs
node .\tools\fff-state.mjs smoke-draft-to-video-planning-bridge .\artifacts\draft-to-video-planning-bridge-result.json .\artifacts\draft-to-video-planning-bridge-result.json
node .\tools\fff-state.mjs smoke-review-brief-dark-mode-ux .\artifacts\review-brief-dark-mode-ux-result.json .\artifacts\review-brief-dark-mode-ux-result.json
node .\tools\fff-state.mjs validate-one-story-draft-review-pack .\artifacts\one-story-draft-review-pack-result.json
node .\tools\fff-state.mjs validate-designer-candidate-dashboard .\artifacts\designer-candidate-dashboard-result.json
node .\tools\fff-state.mjs validate-contradictory-claim-guard .\artifacts\contradictory-claim-guard-result.json
```

Docs build:

```powershell
uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"
```

## Known Limitations

- The narration is only an outline.
- Thumbnail, sound, visual, and subtitle cues are briefs only.
- No visual asset or audio source is selected or rights-cleared.
- No browser screenshot is required for acceptance if static HTML and validator checks pass.
- The selected route remains reviewable and reversible.

## Next Move

Human reviewer should decide whether to accept, revise, or reject:

- The selected candidate/channel route.
- The narration outline shape.
- The subtitle/on-screen text cue style.
- The shot/visual cue direction.
- The thumbnail brief.
- The rights/asset risk posture.
- The held-truth policy.

Only after that review should any narrower follow-up package be considered. Provider/API work, AI video generation, production render, upload, final canon, and rights clearance still require separate explicit authorization.
