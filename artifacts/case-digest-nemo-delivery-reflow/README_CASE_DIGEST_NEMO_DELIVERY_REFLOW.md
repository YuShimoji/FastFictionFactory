# CASE_DIGEST Nemo Delivery Reflow

This package records a private style-10000 narration candidate for the accepted
`fff-private-raster-case-digest-001` video. The exact five-section source is
split into 22 sentence or meaning-clause utterances and placed across all eleven
accepted shot windows.

## Fixed source boundary

- Start commit: `63fb60c505952377455536d9dd84cb164d3b3a0c`
- Source commit: `2e96bd380d47869024587eeb19b3f054064390af`
- Source package fingerprint:
  `0f701e7cfa106dee19cf6e378eec1082920cd7f119f37be0f09696ac8020fbf2`
- Source MP4 SHA256:
  `0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1`
- Source duration: 180.000 seconds / 5400 frames / 30 fps
- Source subtitles: one unchanged Japanese stream with eleven cues

The source script, visible captions, subtitle text, images, shot order and
timing, camera motion, and transitions are immutable inputs.

## Synthesis and placement

Every main event uses Nemo style `10000` with `speedScale=1`,
`pitchScale=0`, `intonationScale=1`, and `volumeScale=1`. Silence is repaired
through shot-aligned event placement. Speech is not slowed or time-stretched to
fill the timeline.

`narration-utterance-map.csv` uses zero-based, end-exclusive source-character
spans. Concatenating the rows within each section reproduces that section's
accepted source text exactly. `真鍮の蛾` remains visible and is read only in the
TTS layer as `しんちゅうでできた、ガ`.

## Local build

The tool requires the already extracted Nemo engine running on loopback. All
audio, queries, diagnostics, the muxed MP4, screenshots, and review HTML are
written below a caller-supplied repository-external run root.

```powershell
pwsh -File .\tools\fff-case-digest-nemo-delivery-reflow.ps1 `
  -Mode Build `
  -EngineBaseUri http://127.0.0.1:50121 `
  -EngineExecutable <nemo-engine-run.exe> `
  -CalibrationRunRoot <attempt-3-run-root> `
  -RunRoot <new-repository-external-run-root> `
  -SourceMp4 .\artifacts\private-raster-case-digest\private-raster-case-digest.mp4 `
  -SourcePackagePath .\artifacts\private-raster-case-digest\private-raster-case-digest.json `
  -PackageRoot .\artifacts\case-digest-nemo-delivery-reflow
```

`-Mode Validate` is read-only and verifies the completed external run against
the tracked result and mapping files.

## Exact completed result

- Utterances: 22 across all eleven shots
- Maximum / median internal gap: 5.000 / 4.926 seconds
- Section head gaps: 0.250, 0.250, 0.426, 0.250, 0.250 seconds
- Section tail gaps: 3.398, 4.500, 4.500, 4.500, 5.500 seconds
- Narration: 180.000 seconds, 48 kHz mono, -19.15 LUFS, -1.20 dBTP,
  clipping 0, SHA256
  `e3db719f4f5aed766ca18b7c77af35f64693cf4a479298325f3f8fa017bd266c`
- MP4: 180.000 seconds, 5400 frames, audio 1, subtitle 1 / cues 11,
  SHA256
  `cd245bec74df93bb8af98db966cb6835bc0ef9c504bf0a24e5cb692ee858ac4c`
- Video and subtitle stream hashes: source/output match
- Review HTML: desktop 1440×1000 and narrow 390×844 runtime pass
- External request / credential / payment / install counts: 0 / 0 / 0 / 0
- Tracked audio or binary count: 0

## Decision boundary

The Product Owner preferred style 10000 for the next candidate and rejected the
current style-10007/style-10001 delivery for this candidate. That observation
does not reject every future use of either style.

Synthesis success is not perceptual acceptance.
`final_voice_selected=false`, `production_voice_approved=false`,
`rights_cleared_claim=false`, `public_release=false`, and
`final_canon=false` remain in force.
