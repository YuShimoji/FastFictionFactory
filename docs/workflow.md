# Fast Fiction Factory MVP Workflow

## Current Production Route

`docs/production-lanes.md` is the current production-lane owner and `artifacts/case-digest-production-state.json` is its computed CASE_DIGEST state. Work proceeds through reference model -> explicitly authored plot spine -> story presentation -> provisional assembly -> integrated review -> final/production gates. Replaceable voice, subtitle, and similar metadata use an independent working envelope; satisfying or replacing that envelope cannot create, reorder, accept, or reject plot beats and cannot own presentation choices.

Stage state comes from independent, versioned requirement vectors such as literal locators 23/23, literal locator-span audit 23/23, typed beat-reference roles 5/5, production-selected beats 0/5, effect records 0/5, or rights-cleared choices 0/11. Heterogeneous requirements are never summed into a scalar percentage. These vectors measure structural record coverage, not quality or creative progress. A phrase, current-question label, declared review axis, file, hash, test, or compatibility PASS is not progress or acceptance by itself. The prior three-minute content/process surface is parked historical presentation evidence, has `current_project_gate=false` and `current_human_action=false`, and cannot generate a current clear/fix review packet.

## Active Artifact

The first reviewable artifact is `public/review/index.html`. It is a static local workbench and does not call external services.

For an exact media review, the referenced media identity is part of the review target. If that file is absent or fails its expected hash, the review becomes a distinct deterministic missing-media challenge derived from the artifact ID and expected SHA-256 prefix. The workflow must not substitute another sample, show a nominal review action, or infer acceptance from a different file. A challenge may resume as review only after the exact expected identity is restored and reverified.

## Flow

1. Memo intake
   - The user enters or edits a raw story memo.
   - The memo is kept in browser local storage for prototype continuity.

2. Mock extraction
   - The prototype produces deterministic candidate output from the memo.
   - Extraction is intentionally provisional. It provides review surfaces, not canon.

3. Candidate review
   - Every candidate can be marked `adopt`, `provisional`, `hold`, or `reject`.
   - Decisions are logged locally in the visible decision log.

4. Task planning
   - Task cards explain classification, priority, recommended timing, creative utility, risk if ignored, risk if overdecided now, minimum decision, and provisional option.

5. Outline packaging
   - The workbench proposes 1-minute, 3-minute, 10-minute, and series outline candidates.
   - Scene, text cue, and asset readiness remain reviewable.

6. QA gate review
   - The QA panel separates story, canon, source, timeline, feasibility, typography, rights, and YouTube adapter risk.
   - Failed or warning gates are blockers for production release, not blockers for local review.

## Human Authority

Only a human author can promote candidates into durable canon. The workbench may suggest structure, tasks, and outlines, but it must not replace creative decisions with final canon.

Integration checks may verify versions, compatibility, checkpoints, coverage arithmetic, quarantine, and identity. They may not select creative content or promote evidence into acceptance.

## Residual Work Reporting

For any residual work, report:

- Purpose
- Effect
- Requirements
- State
- Owner
- Next move
