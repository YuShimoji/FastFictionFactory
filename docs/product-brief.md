# Fast Fiction Factory MVP Skeleton Product Brief

## Purpose

Fast Fiction Factory is a local-first fiction production workbench. The first MVP skeleton takes a raw story memo and turns it into reviewable structured candidates that a human author can adopt, keep provisional, hold, or reject.

## Active Review Artifact

- Artifact id: `fff-mvp-skeleton-001`
- Reviewable output: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Supporting manifest: `artifacts/artifact-manifest.json`

## MVP User Path

1. Paste or edit a raw story memo.
2. Generate mocked extraction output locally.
3. Review extracted elements, profile candidates, claim candidates, timeline candidates, task cards, and video outline candidates.
4. Mark every candidate as `adopt`, `provisional`, `hold`, or `reject`.
5. Review QA gates before any downstream production work.

## In Scope

- Local memo intake.
- Deterministic mock extraction for review skeleton purposes.
- Structured candidate groups for people, places, organizations, events, objects, concepts, timelines, placeholders, historical references, fictional elements, undecided items, ambiguity, contradiction candidates, and foreshadowing candidates.
- Review controls for candidate status.
- Task cards that explain purpose, timing, creative utility, and risk.
- Outline candidates for 1-minute, 3-minute, 10-minute, and series formats.
- QA panel for story, canon, source, timeline, feasibility, subtitle, rights, and YouTube adapter risk.

## Out Of Scope

- External publishing.
- Production credentials.
- Paid services.
- Destructive migrations.
- Automated YouTube upload.
- Full AI video generation.
- Any final canon decision without explicit human adoption.

## Review Standard

The skeleton is reviewable when the artifact opens locally, shows the sample memo, generates all required candidate categories, allows all required review states, and makes unresolved authority visible instead of silently finalizing canon.
