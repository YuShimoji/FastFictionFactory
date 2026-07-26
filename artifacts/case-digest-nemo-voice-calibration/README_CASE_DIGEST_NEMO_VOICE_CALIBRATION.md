# CASE_DIGEST Nemo Voice Calibration

This package records a private, local VOICEVOX Nemo calibration for the accepted
`fff-private-raster-case-digest-001` artifact. The only reopened dimension is
Japanese synthetic narration voice and delivery.

## Immutable source

- Execution base: `2e96bd380d47869024587eeb19b3f054064390af`
- Source package fingerprint: `0f701e7cfa106dee19cf6e378eec1082920cd7f119f37be0f09696ac8020fbf2`
- Source MP4 SHA256: `0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1`
- Source runtime: 180.000 seconds, 5400 frames, 30 fps, 960x540 H.264
- Source subtitles: one Japanese stream with eleven cues
- Source narration: five sections with windows 0–24, 24–65, 65–97,
  97–136, and 136–180 seconds

The source text, visible captions, subtitle wording and wrapping, eleven-shot
sequence, Raster identities, and terminal-frame transition continuity are not
changed by this package.

## Local regeneration

The tracked PowerShell tool writes audio, queries, the muxed MP4, review HTML,
and its local run manifest only to a caller-provided repository-external run
root. It requires an already extracted and running Nemo engine on
`http://127.0.0.1`.

```powershell
pwsh -File .\tools\fff-case-digest-nemo-voice-calibration.ps1 `
  -EngineBaseUri http://127.0.0.1:50121 `
  -RunRoot <repository-external-run-root> `
  -SourceMp4 .\artifacts\private-raster-case-digest\private-raster-case-digest.mp4 `
  -PlanPath .\artifacts\case-digest-nemo-voice-calibration\voice-calibration-plan.json `
  -PronunciationMapPath .\artifacts\case-digest-nemo-voice-calibration\tts-pronunciation-map.json
```

The tool refuses non-loopback engine URIs and refuses to overwrite existing
candidate or recommended outputs.

## Review boundary

The calibration recommendation is objective and provisional. It is based on
section fit, zero clipping, stable synthesis, pronunciation-map compatibility,
and aggregate timing deviation. It is not perceptual acceptance.

`final_voice_selected`, `production_voice_approved`, `production_approved`,
`rights_cleared_claim`, `product_release`, `public_release`, and `final_canon`
remain false. No `.vvpp`, ZIP, extracted model, binary, WAV, AAC, or
audio-inclusive MP4 is tracked.
