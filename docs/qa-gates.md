# Fast Fiction Factory QA Gates

## Current-basis closure gate — 2026-08-25

For the current production path, QA first verifies `fff-current-basis-review-burden-001` and the root manifest's accepted default/successor identities. Matching hashes and validators close technical identity only. The accepted preview and asset-plan decisions close their exact human axes only. Neither class of evidence authorizes production assets, rights, voice/provider, render, release, or canon.

Fail closed when the exact artifact hash drifts, accepted-authority readback changes, the successor is treated as the default, root manifest exposes accept/revise or `owner_asset_plan_decision` as current pending, a stale question is reopened in the current handoff, a ClipPipeGen-specific decision-card contract is imported, or Board/DB mutation is claimed as a prerequisite. A passing route must skip both closed decisions and resolve `production_input_contract_authorization` as the next stage. The focused command is `node tools/fff-current-basis-review-burden.mjs`.

The D3 Cockpit gate additionally requires `node tools/fff-d3-cockpit.mjs`, focused regression tests, and rendered browser evidence that the exact MP4 opens and its playback time advances before the D3 control unlocks. After entry, the visible state must be `OWNER_SCOPE_REQUIRED`; preview accept/revise and asset-plan A/B/C must not exist as form inputs.

These gates are visible in the MVP workbench. They are local review checks, not production approval.

## Story Nucleus

- Purpose: Confirm that the premise, central pressure, and emotional turn are visible.
- Pass: The nucleus can be stated in one sentence.
- Warn: The memo has tone or world detail but no central pressure.
- Block: No work identity can be inferred.

## Canon Consistency

- Purpose: Keep adopted facts from contradicting each other.
- Pass: Adopted candidates do not conflict.
- Warn: Provisional or held candidates may conflict.
- Block: Adopted candidates directly conflict.

## Truth And Source Status

- Purpose: Separate author memo assertions from inferred or external claims.
- Pass: Each claim has a source reference and truth status.
- Warn: Important claims are inferred.
- Block: External claims are treated as verified without source review.

## Timeline Separation

- Purpose: Separate story order, calendar time, historical context, and production order.
- Pass: Events declare a sequence scope.
- Warn: Some events are position-only.
- Block: Calendar claims are mixed with story sequence without labels.

## Production Feasibility

- Purpose: Identify whether an outline can be produced with current assets and decisions.
- Pass: Scenes have modest asset needs and clear text cues.
- Warn: Scenes depend on unresolved character or setting decisions.
- Block: The outline requires unavailable media or production commitments.

## Subtitle And Typography Readiness

- Purpose: Keep text cues short enough for reviewable video packaging.
- Pass: Cues are short and marked ready.
- Warn: Cues need wrapping checks.
- Block: Cues are too long or rely on unchosen typography.

## Asset And Rights Risk

- Purpose: Prevent placeholder assets from becoming implied release assets.
- Pass: Assets are owned, licensed, or not needed.
- Warn: Placeholder or unknown rights are visible.
- Block: Unknown-rights assets are required for release.

## YouTube Adapter Risk

- Purpose: Keep future YouTube packaging separate from this MVP.
- Pass: No upload, credentials, or publishing adapter is active.
- Warn: Outline needs future metadata decisions.
- Block: The system attempts upload, credential use, or public release.
