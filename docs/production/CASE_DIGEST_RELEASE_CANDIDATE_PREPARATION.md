# CASE_DIGEST Release Candidate Preparation

## Fixed input identity

- Source commit: `58b8cc437bb0f8e0f796490bdfd213e8b211834f`
- Source run: `fff-case-digest-english-editorial-naturalness-001`
- Source clean MP4 SHA256: `94383a3067d769831fe9fd4e71846283867623f77a5799b570eca1dda034831f`
- Contract: 5 sections, 11 shots, 24 English utterances, 313 words, 180 seconds, 30 fps, and 5,400 frames.
- English and Japanese SRT/WebVTT sidecars are byte-locked to the source run. The script, captions, accepted visuals, shot ownership, and timing are not reopened by this preparation slice.

## Audience voice direction and quarantine

Quarantine `FFF-Q-MECHANICAL-ENGLISH-TTS-CASE-DIGEST-20260730` rejects the current Microsoft Zira audience voice only for this CASE_DIGEST successor lineage. It is not a universal rejection of female voices, and historical Zira outputs remain retained as evidence.

The required successor direction is a natural English male voice with calm delivery and a lower or mid register. The validator must reject Zira, unknown speaker identity, unauthorized voice cloning, added or omitted words, music or SFX, unknown or absent rights provenance, clipping, wrong PCM shape, missing or duplicate coverage, and timing-window violations.

The current local inventory contains no eligible English male System.Speech voice. Therefore:

- `voice_input_state=natural_male_voice_input_required`
- no provisional release-candidate A/V is generated;
- naturalness remains a human judgment;
- no standalone voice-only review may be requested;
- the next human voice judgment may occur only in a whole release candidate.

## Voice take input modes

### `per_utterance_wav_v1`

- `voice-take.json` must contain exactly 24 unique entries.
- Every file must be named `utterances/<utterance_id>.wav`.
- Each manifest transcript must equal its locked English utterance.
- Every take must be mono integer PCM WAV at 48 kHz, 16- or 24-bit, with zero clipped samples.
- Each file must fit its fixed utterance timing window in `utterance-delivery-map.csv`.

### `full_programme_wav_v1`

- The file must be `programme.wav`, exactly 180 seconds.
- The normalized full transcript and its SHA256 must equal the canonical 24-utterance transcript.
- The manifest must carry 24 ordered, non-overlapping alignment rows with exact utterance IDs and transcripts.
- The same identity, voice direction, PCM, clipping, speech-only, provenance, and clone-authority checks apply.

Machine validation does not approve naturalness, the production voice, production use, rights, publication, or canon.

## Picture, captions, thumbnail, and metadata

- `picture/case-digest-picture-lock.mp4` is a video-only re-mux of the accepted source video stream: 1280×720, 30 fps, 180 seconds, 5,400 frames, no audio, no subtitle streams, and no burned captions.
- Decoded-frame identity must match the source clean MP4 for all 5,400 frames.
- The four locked caption sidecars remain external-run files.
- `thumbnail/case-digest-thumbnail.jpg` is a deterministic 1280×720 derivative of accepted raster `shot-b03-01`, using the signature `archival_case_file_thumbnail_v1` and the phrase `THE TOWER FILE`. It introduces no new imagery, fake evidence, or guilt claim.
- Release metadata includes one title, one restrained description, exactly five chapters, subtitle declarations, credits, and an explicit private/not-approved publication note.
- The provenance matrix records all 11 visual shots, script, captions, thumbnail, voice placeholder, and font identity. Its compatibility values are tracking states, not legal conclusions.

## Commands

```powershell
pwsh -NoProfile -File tools/fff-case-digest-release-candidate-preparation.ps1 `
  -Mode ValidateVoiceTake `
  -VoiceTakeRoot <voice-take-directory>

pwsh -NoProfile -File tools/fff-case-digest-release-candidate-preparation.ps1 `
  -Mode BuildReleaseCandidate `
  -RunRoot <release-preparation-run> `
  -VoiceTakeRoot <accepted-voice-take-directory>

pwsh -NoProfile -File tools/fff-case-digest-release-candidate-preparation.ps1 `
  -Mode FinalQc `
  -RunRoot <release-preparation-run>
```

`BuildReleaseCandidate` rejects technical fixtures. A passing accepted take produces a clean A/V with English and Japanese sidecars, an English burned audience render, and an English/Japanese debug render. All remain private and unapproved until separately judged.

## Gate boundary

Preparation completeness does not imply:

- `final_voice_selected`
- `production_voice_approved`
- `production_approved`
- `rights_cleared`
- `publication_approved`
- `final_canon`

All six remain false. No push, PR, merge, release, deployment, upload, public exposure, network call, credential use, provider installation, music/SFX generation, or image generation is authorized by this contract.
