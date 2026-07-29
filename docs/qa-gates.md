# Fast Fiction Factory QA Gates

These gates are visible in the MVP workbench. They are local review checks, not production approval.

## CASE_DIGEST Release Candidate Preparation

- Pass preparation when the exact source/run bindings hold; the picture lock is 180-second 1280×720 30 fps video-only with 5,400 decoded frames identical to source; all four captions preserve exact hashes and 24 cues; thumbnail, metadata, provenance, review, and tracked boundaries pass; and voice state is explicit.
- Pass voice intake only when one supported mode has complete unique coverage, exact transcripts, explicit non-Zira identity, calm male lower/mid direction, mono 48 kHz 16/24-bit PCM, zero clipped samples, no music/SFX declaration, fixed timing compliance, documented private-candidate authority, and clone authority when applicable.
- Block voice intake on:
  - missing file;
  - duplicate utterance or file binding;
  - wrong transcript;
  - clipping;
  - music or SFX;
  - timing mismatch;
  - unknown speaker identity;
  - absent or unknown rights provenance.
- A machine-valid voice take does not mean natural. A machine-valid full candidate does not select or approve the voice, approve production, clear rights, approve publication, or establish canon.
- Human naturalness review is permitted only for the whole release candidate; a standalone voice-only review request is a gate failure.
- Current preparation result: `PASS_RELEASE_PREPARATION_AWAITING_VOICE` with `voice_input_state=natural_male_voice_input_required`.

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
