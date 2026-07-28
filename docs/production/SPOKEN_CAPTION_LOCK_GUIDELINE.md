# Spoken-caption lock guideline

## Rule

For every narrated utterance, `spoken_text_en` is the sole English audience authority.
The text sent to offline TTS, the English SRT and WebVTT cues, the burned English
subtitle, and the local HTML English caption must reconstruct that exact string after
layout line breaks and leading or trailing whitespace are removed.

## Allowed differences

- Phrase-based layout line breaks.
- Leading and trailing whitespace normalization.
- Engine controls such as voice, rate, volume, output format, and placement that do
  not alter `spoken_text_en`.

## Forbidden differences

- Hidden TTS wording.
- Shortened, summarized, or paraphrased subtitles.
- Subtitle-only exposition.
- Narration-only exposition.
- Independent editorial prose displayed during speech.
- Missing or reordered spoken words.

## Bilingual boundary

English is the original and audience-default language. Each English utterance has one
Japanese debug translation with the same utterance ID and evidential limit. Japanese
is never synthesized and is absent from the audience-default picture. It may appear
only in sidecars, the bilingual debug render, or the review page after the visible
debug toggle is enabled.

## Required evidence

The candidate must record zero for:

- `spoken_caption_text_mismatch_count`
- `audio_only_semantic_unit_count`
- `caption_only_semantic_unit_count`
- `non_verbatim_editorial_text_during_speech_count`

It must also record exact cue counts, one-to-one English/Japanese ID alignment,
utterance audio hashes, audible and caption timing, phrase-wrap evidence, and the
identity hashes of every subtitle surface.

## Authority boundary

Passing this lock proves text identity for a private technical candidate. It does not
approve the production voice, rights, publication, release, or final canon.
