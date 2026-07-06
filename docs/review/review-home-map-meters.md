# Review Home Map Meters

## Purpose

`fff-review-home-map-meters-001` turns the Review Hub first screen into a Review Home Map. The goal is to answer what to read now, what not to read now, what each folded shelf is for, and which shelf should be opened only for audit.

The slice keeps the work local-only. It does not add provider/API behavior, AI video generation, rendering, uploading, rights clearance, or final canon decisions.

## User Review That Triggered It

The user confirmed the screen felt more polished and dark mode worked, but said the organization still felt like everything had been shoved into a closet. The requested change was to link folded information back to the home screen and represent the shelves as meters or status indicators.

## Design Rationale

The previous Review Brief demoted Source Audit, Project Cockpit, and Artifacts, but it did not explain why those shelves existed or when to open them. The new home screen makes the demotion explicit:

- Primary operator route: `Review Home` then `Draft-to-Video Bridge`.
- Story shelves: `Draft Review Pack` and `Designer Dashboard` only when the bridge needs source context.
- Evidence Vault: `Source Audit`, `Project Cockpit`, and `Artifacts` only when auditing evidence, history, or validation files.

## What Changed From Folded Tabs To Home Map

- Added `public/review/index.html?mode=home` as the no-query default.
- Kept `public/review/index.html?mode=brief` as a preserved prelude route.
- Replaced the flat tab-first impression with grouped navigation: Primary operator route, Story shelves, and Evidence only.
- Added seven shelf cards with route, purpose, status, meter, meter mode, open trigger, do-not-open condition, and next action.
- Added a three-step "what to read now" path: Review Home, Draft-to-Video Bridge, then freeform response on route / narration / subtitle / visual / thumbnail / held truths.
- Kept Bridge reachable in one click from the first screen.

## Meter Semantics

Measured meters use local counts and readbacks only:

- Bridge Package uses bridge card and planning-package counts.
- Draft Detail uses draft beat, visual cue, subtitle/text cue, and risk-card counts.
- Candidate Coverage uses content candidate, channel proposal, draft spine, and held-decision counts.
- Source Evidence Health uses source-pack rows and zero mismatch/missing/unsafe route counts.
- Risk & Gate State uses locked production gate counts.
- Readback Inventory uses preserved docs, JSON artifacts, manifest, and validation log coverage.

Hypothesis meters are UX-readability estimates only. They do not imply project completion, production readiness, rights clearance, or canon acceptance. `Review Route Clarity 4/5` is a hypothesis meter because only the human reviewer can confirm whether the new map feels organized rather than closet-like.

## Access Routes

```text
public/review/index.html
public/review/index.html?mode=home
public/review/index.html?mode=brief
public/review/index.html?mode=bridge
public/review/index.html?mode=draft
public/review/index.html?mode=designer
public/review/index.html?mode=source
public/review/index.html?mode=project
public/review/index.html?mode=artifacts
```

## Preserved Boundaries

- `fff-review-brief-dark-mode-ux-001` remains available.
- `fff-draft-to-video-planning-bridge-001` remains available and unchanged as the production-hypothesis surface.
- `fff-one-story-draft-review-pack-001` and `fff-designer-candidate-dashboard-001` remain source shelves.
- `fff-draft-review-pack-stabilization-001` remains the access/readback durability checkpoint.
- `fff-contradictory-claim-guard-001` remains preserved.

Still closed:

- provider/API calls
- credentials
- AI video generation
- production render
- YouTube upload
- final canon
- rights-cleared claims

## Validation Commands

Run from the repository root:

```powershell
node --check .\tools\fff-state.mjs
node .\tools\fff-state.mjs smoke-review-home-map-meters .\artifacts\review-home-map-meters-result.json .\artifacts\review-home-map-meters-result.json
node .\tools\fff-state.mjs smoke-draft-to-video-planning-bridge .\artifacts\draft-to-video-planning-bridge-result.json .\artifacts\draft-to-video-planning-bridge-result.json
node .\tools\fff-state.mjs smoke-review-brief-dark-mode-ux .\artifacts\review-brief-dark-mode-ux-result.json .\artifacts\review-brief-dark-mode-ux-result.json
node .\tools\fff-state.mjs validate-one-story-draft-review-pack .\artifacts\one-story-draft-review-pack-result.json
node .\tools\fff-state.mjs validate-designer-candidate-dashboard .\artifacts\designer-candidate-dashboard-result.json
node .\tools\fff-state.mjs validate-contradictory-claim-guard .\artifacts\contradictory-claim-guard-result.json
```

Static access checks should confirm that `mode=home` is the default, seven shelf cards exist, seven meters exist, measured and hypothesis labels are present, Bridge is linked, Evidence Vault shelves have open triggers, and Light / Dark / Auto controls remain available.

## Known Limitations

- The meter values are deliberately compact and local; they are not global product progress.
- The user-burden/clarity meter remains a hypothesis until the reviewer confirms the new first screen feels organized.
- No browser screenshot is required for acceptance if static checks and smoke readback pass.
- The Bridge content itself was not materially expanded in this slice.

## Next Possible Slice

If the Home Map is accepted, the next non-production slice is a Bridge refinement pass: one narration detail pass, subtitle rhythm, screen beats, and thumbnail candidates. Provider/API, AI video generation, upload, render, final canon, and rights clearance still require separate explicit authorization.
