# Fast Fiction Factory MVP Workflow

## Active Artifact

The first reviewable artifact is `public/review/index.html`. It is a static local workbench and does not call external services.

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

## Residual Work Reporting

For any residual work, report:

- Purpose
- Effect
- Requirements
- State
- Owner
- Next move
