# Route Lock Clean State Readback

Artifact id: `fff-route-lock-clean-state-readback-001`

Date: 2026-06-29 JST

## Purpose

This readback records the cleanup that returned the workspace to the Fast
Fiction Factory route after ClipPipeGen prompt residue appeared as untracked
files under this repo.

## What Was Cleaned

The following files were present in `FastFictionFactory` as untracked local
residue and were deleted:

- `docs/style_intent/subtitle-owner-decision-card-gate-sanity.json`
- `docs/style_intent/subtitle-owner-decision-card-gate-sanity.md`
- `docs/style_intent/subtitle-owner-review-decision-card-freeform.json`
- `docs/style_intent/subtitle-owner-review-decision-card-freeform.md`

The empty residue-only directory `docs/style_intent/` was also removed.

## Why This Was Residue

The deleted files contained ClipPipeGen identifiers such as
`schema_id=clippipegen...` and `artifact_id=clip-ed10...`. They were not
tracked by Git and did not match the active Fast Fiction Factory artifact line.

## Current Route Lock

- Repo root: Fast Fiction Factory repository root; local checkout path may vary.
- Branch: `master`
- Active artifact: `fff-contradictory-claim-guard-001`
- Route-lock readback: `fff-route-lock-clean-state-readback-001`
- Review UI: `public/review/index.html`
- Current status: `docs/review/current-status.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`

## Verification

The route cleanup verified:

- `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0`
  before the handoff-doc refresh.
- `git grep -n -I -e "ClipPipeGen" -e "clippipegen" -e "clip-ed10" -e "ED-10" -e "subtitle-owner" -- .`
  returned no tracked hits after cleanup.
- `rg -n "ClipPipeGen|clippipegen|clip-ed10|ED-10|subtitle-owner" --glob "!node_modules/**" --glob "!.git/**"`
  returned no workspace hits after cleanup.
- After this readback was added, those terms are expected to appear only in
  this route-lock evidence file and its linked cockpit summaries. Treat any
  future hits outside the route-lock evidence context as new contamination.
- `git diff --check` passed.
- The manifest validation command passed once during cleanup verification. It
  refreshed generated smoke outputs, and those validation-side timestamp/result
  churn files were restored because they were not part of the route cleanup.
- A final lightweight syntax check passed for:
  - `node --check tools\fff-state.mjs`
  - `node --check tools\fff-extract-local.mjs`
  - `node --check tools\fff-source-span-review-pack.mjs`

## Not Touched

This cleanup did not modify ClipPipeGen, continue any ED-10 task, add model/API
behavior, configure a provider, touch credentials, create database persistence,
add publishing/upload behavior, add AI video generation, run production sync,
or decide final canon.

## Next Valid Axis

Continue from Fast Fiction Factory only. The next valid axis remains provider
adapter implementation only after explicit authorization for provider choice,
credentials, endpoint, transport behavior, external call permission, timeout,
and retry policy. Alternative FFF-local work can address translation
provenance/source-span ownership policy or broad source-span fixture coverage
only if new evidence makes those concrete bottlenecks.
