# Production Storyboard Brief

## Identity

- Artifact: fff-production-storyboard-brief-001
- Lane: PRODUCTION_STORYBOARD_BRIEF
- Status: provisional human-understanding surface; local planning only
- Source: preserved fff-production-execution-pack-001
- Route: artifacts/production-storyboard-brief/production-storyboard-brief.html
- Source grouping: 3 / 3 / 3 / 3 / 4 / 3

The source Production Execution Pack remains byte-identical. This successor reorganizes its exact six-beat, 180-second, 19-shot plan into a standalone storyboard-first reading surface. The canonical JSON also carries all 20 subtitle-cue counts, all 6 source narration segments, and the unchanged synthetic voice-planning object so omission cannot masquerade as preservation. It does not add a review-app mode and does not approve artwork, assets, rights, an engine or voice, audio, render, publication, database persistence, or canon.

## Human outcome

A separate creator should be able to explain, from this page alone:

1. the bellless-tower premise and central unresolved choice;
2. the six-sentence progression across all six beats;
3. all 25 core glossary terms with uncertainty preserved;
4. the visual focus, purpose, positive success condition, negative guard, duration, text allowance, and one-line asset summary for each of 19 frames;
5. why every SVG is a planning frame rather than final art;
6. which 14 operational asset requirements are common, reusable, or beat-specific.

The title target is 36px at 900x1200 and 40px at 1280x900, with no more than two lines. Theme controls are Light / Dark / Auto, with Auto as the clean-context default.

## Package inventory

The seven-file package is:

- README_STORYBOARD_BRIEF.md
- production-storyboard-brief.html
- production-storyboard-brief.json
- storyboard-shot-map.csv
- story-glossary.csv
- asset-operations-summary.csv
- production-storyboard-brief-manifest.json

The primary HTML contains no asset inventory table and no raw source hashes. The 14-row operational material is owned by one native details appendix, initially closed, with explicit open/close labels and a 48px whole-summary target.

## Shot semantic rule

Every source done_when has the exact form:

    「focal target」へ最初に視線が集まり、 + source truth boundary

The Storyboard Brief retains source_done_when in JSON and mechanically separates it into:

- ねらい: source plain_language_purpose_ja
- 成立させること: the focal target receives first attention
- 描かないこと: the unchanged source truth_boundary

No story fact or canon choice is introduced by this grammatical split.

## Source immutability

The validator requires all nine source-package files to remain unchanged. The principal source evidence is:

- package fingerprint: a19cf81f3322c17a49c597731372ea653f7fd3881cea84d1ddb8e2df3b7143ca
- source HTML SHA256: f892d2935d42b62150a58f18da3ed29394435a4e4c2579f4d6321f1ce637338c
- source JSON SHA256: 24237829ad4d886b79397eb1626ca3efb7a92a8b0f29923ff092f5679d037ceb
- source manifest SHA256: f3a6bccef8809d8060c7a809522c09a546617b82179d2d5f97fe7e3fe20a60f7
- nine-file aggregate: 10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345

The Storyboard model records `subtitle_count=20` and `narration_segment_count=6` at the top level. Every beat preserves its source narration object, subtitle count, and shot count. `voice_mode=synthetic` remains planning intent only; `engine_selected=false`, `voice_selected=false`, `audio_generated=false`, `engine_calibration_pending=true`, and `actual_engine_timing_measured=false` remain unchanged and validator-enforced.

## Validation

Read-only:

    node tools/fff-state.mjs validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json

Intentional regeneration of only the seven package files and result:

    node tools/fff-state.mjs smoke-production-storyboard-brief artifacts/production-storyboard-brief-result.json

The fail-closed probes cover source mismatch, glossary omission/reference failure, missing/duplicate shots, missing SVG, mixed success/guard fields, primary asset tables, open appendix defaults, hit areas below 44px, oversized titles, missing themes, dark contrast failure, nested scroll, selected assets, rights claims, source-derived content mutation, and manifest mismatch.

The final root sequence is read-only and runs Storyboard, Execution Pack, Typography, Operator, Blueprint, Derivative, Revision, and Handoff validators in that order.

## Operational residuals

### H1 storyboard-understanding review

- Purpose: confirm that a separate creator can explain premise, terms, sequence, frame intent, and completion boundaries from the standalone page.
- Effect: converts machine-valid storyboard coverage into a real human-readability decision.
- Requirements: open the HTML, inspect both theme screenshots, and sample all six beats plus positive/negative conditions.
- State: ready after browser evidence and strict validation are green.
- Owner: human supervisor or delegated creator.
- Next move: record pass or bounded revision notes without selecting assets or canon.

### Asset sourcing and rights review

- Purpose: turn 14 generic requirements into candidate production inputs.
- Effect: would make later assembly possible without changing story truth.
- Requirements: separate sourcing authority, provenance capture, and rights review.
- State: closed; all requirements remain unselected / not_reviewed / provenance required.
- Owner: human production and rights reviewers.
- Next move: only after H1 passes, open a separately authorized sourcing slice.

### Synthetic narration calibration

- Purpose: measure actual engine timing instead of treating text-density proxies as TTS evidence.
- Effect: would establish voice timing envelopes for production.
- Requirements: explicit engine and voice selection authority plus calibration approval.
- State: closed; engine, voice, and audio are unselected or ungenerated.
- Owner: human production supervisor.
- Next move: do not start from this Storyboard Brief; authorize a distinct calibration slice.

### Render, publication, database, and canon

- Purpose: downstream production and release decisions.
- Effect: would move beyond local provisional planning.
- Requirements: explicit human approvals, cleared assets and rights, accepted render, and canon decision.
- State: closed and out of scope.
- Owner: human supervisor.
- Next move: none until all earlier gates are explicitly passed.
