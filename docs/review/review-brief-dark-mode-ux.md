# Review Brief Dark Mode UX

## Artifact

- Artifact id: `fff-review-brief-dark-mode-ux-001`
- Review UI: `public/review/index.html`
- Primary route: `public/review/index.html?mode=brief`
- Readback result: `artifacts/review-brief-dark-mode-ux-result.json`
- Validator: `node tools/fff-state.mjs smoke-review-brief-dark-mode-ux artifacts/review-brief-dark-mode-ux-result.json artifacts/review-brief-dark-mode-ux-result.json`
- Source artifacts preserved: `fff-designer-candidate-dashboard-001`, `fff-one-story-draft-review-pack-001`, `fff-draft-review-pack-stabilization-001`

## Purpose

Make the local review UI easier to enter from a human review perspective. The first screen now answers what to review, which candidate is currently selected, which channel route is selected, and what decisions are still human-owned before exposing the detailed source, project, and artifact panels.

## What Changed

- Added `Review Brief` as the default mode when no query string is present.
- Added first-screen cards for the immediate review target, selected candidate, selected channel, and next human decisions.
- Made the selected candidate id `designer-content-moth-investigation-3m` and selected channel route `designer-channel-mystery-lore` visible and searchable.
- Added Japanese-first review labels for the brief, including the selected candidate and channel route.
- Demoted `Source Audit`, `Project Cockpit`, and `Artifacts` into advanced mode tabs so they remain available without becoming the first impression.
- Added Light / Dark / Auto theme controls with local preference storage.
- Replaced light-only surface colors with theme variables and `color-scheme: light dark`.

## Preserved Work

- Designer Dashboard remains available at `public/review/index.html?mode=designer`.
- One-story Draft Review Pack remains available at `public/review/index.html?mode=draft`.
- Draft Review Pack Stabilization remains the prior access/readback checkpoint.
- No draft-to-video bridge, provider/API call, credentials, public upload, AI video generation, publishing path, production render, or final canon decision was added.

## Validation

Run from the repository root:

```powershell
node --check .\tools\fff-state.mjs
node .\tools\fff-state.mjs smoke-review-brief-dark-mode-ux .\artifacts\review-brief-dark-mode-ux-result.json .\artifacts\review-brief-dark-mode-ux-result.json
node .\tools\fff-state.mjs smoke-one-story-draft-review-pack .\artifacts\one-story-draft-review-pack-result.json .\artifacts\one-story-draft-review-pack-result.json
node .\tools\fff-state.mjs smoke-designer-candidate-dashboard .\artifacts\designer-candidate-dashboard-result.json .\artifacts\designer-candidate-dashboard-result.json
```

The review-brief smoke checks the HTML markers, selected candidate, selected channel route, Japanese summary markers, default brief mode, advanced tab demotion, theme controls, dark/light color-scheme support, reduced hardcoded light surfaces, preserved source readbacks, and local-only boundaries.

## Review Debt

- Human reviewer still needs to decide whether to keep or replace the provisional candidate.
- Human reviewer still needs to decide whether to keep or switch the selected channel route.
- Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved and human-owned.
- Browser screenshot capture was not attempted in this slice; static readback and HTML markers are the durable access evidence.

## Next Move

Use `public/review/index.html?mode=brief` as the entry point for the next review. Only after the candidate/channel route and unresolved-truth policy are reviewed should a later slice consider draft-to-video planning, and that later slice still needs separate explicit authorization.
