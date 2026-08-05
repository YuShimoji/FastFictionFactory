# English Documentary Narration Guideline

## Purpose

Use this guideline for private CASE_DIGEST narration when an accurate script has
become audit-like, repetitive, or difficult to follow by listening alone.

## Audio-first structure

The narration must let a listener reconstruct seven elements without the image:

1. the incident;
2. the investigator;
3. the investigator's personal connection;
4. the clue chain;
5. the ledger;
6. why the council is relevant;
7. what remains unresolved.

Coverage is a machine-auditable script property, not a claim that human
comprehension or editorial acceptance has passed.

## Evidential phrasing

- State the observed or reported fact once in direct language.
- Attach the necessary limit at the point where the audience might otherwise
  infer guilt, authenticity, motive, mechanism, resolution, or a causal bridge.
- Prefer an open question or bounded summary over a sequence of repetitive
  `no`, `not`, `unconfirmed`, `unverified`, or `unproven` formulations.
- Do not weaken a boundary merely to improve flow.
- Do not introduce a hidden bridge between evidence items.
- Close on the current case status, not a forced choice or invented resolution.

## Canonical text lock

One field, `spoken_text_en`, owns:

- replaceable voice-slot TTS input;
- English SRT and WebVTT;
- English audience burn-in;
- English in the bilingual debug burn-in;
- English captions in the local HTML.

Only layout line breaks and surrounding whitespace may differ. Japanese is a
one-to-one debug translation, never audience audio or audience burn-in.

## Voice-pending contract

When no eligible local English male file-output voice is installed:

- record `voice_pending_natural_male`;
- do not use a rejected voice as a placeholder;
- preserve the complete per-utterance and full-programme replacement contract;
- keep the picture, sidecars, captioned review outputs, and HTML reviewable;
- keep human naturalness, final voice, production, rights, publication, and
  canon decisions false.

A later take must preserve exact transcript identity, fit the declared slots,
use mono 48 kHz PCM, contain no clipping or music/SFX, and carry speaker and
rights provenance. Machine validity is not naturalness approval.
