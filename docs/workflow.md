# Fast Fiction Factory MVP Workflow

## CASE_DIGEST Release Candidate Preparation Lane

1. Bind to exact source commit `58b8cc437bb0f8e0f796490bdfd213e8b211834f` and finalized source run `fff-case-digest-english-editorial-naturalness-001`.
2. Re-mux only the accepted video stream into a video-only picture lock; byte-copy the four caption sidecars; derive the private thumbnail only from accepted raster `shot-b03-01`.
3. Inventory installed local file-output voices. Zira is quarantined for this successor. If no eligible English male voice exists, record `natural_male_voice_input_required` and continue without provisional A/V.
4. Accept a future voice through `per_utterance_wav_v1` or `full_programme_wav_v1`. Fail closed on identity, direction, transcript, coverage, PCM, clipping, speech-only, timing, provenance, or clone-authority failure.
5. Build clean, audience, and debug A/V only from the fixed picture/captions and a machine-valid non-fixture voice take.
6. Run final QC for media, frame identity, caption tracks and burns, voice, thumbnail, metadata, provenance, offline review, and tracked boundaries.
7. Request no voice-only review. The sole human voice judgment is the complete release candidate.
8. Keep voice selection, production voice approval, production approval, rights clearance, publication approval, and final canon as independent explicit gates.

Canonical contract and commands: `docs/production/CASE_DIGEST_RELEASE_CANDIDATE_PREPARATION.md`.

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
