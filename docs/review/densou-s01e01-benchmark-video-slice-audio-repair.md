# Densou Episode 1 180-second Audio Repair

## Outcome

`fff-densou-s01e01-benchmark-video-slice-audio-repair-001` repairs the zero-audio dependency on the existing 180-second Episode 1 slice. It preserves the exact picture and source mapping, adds one synchronized Japanese narration stream, and remains `PARTIAL_PRODUCTION_SLICE` 180/720 with Episode completion=false.

Review surfaces:

- `artifacts/densou-s01e01-benchmark-video-slice-audio-repair-001/review.html`
- `artifacts/densou-s01e01-benchmark-video-slice-audio-repair-001/densou-s01e01-benchmark-video-slice-audio-repair.mp4`
- `artifacts/densou-s01e01-benchmark-video-slice-audio-repair-001/s-review-packet.json`
- `artifacts/densou-s01e01-benchmark-video-slice-audio-repair-001/s-review-packet.md`

## Exact identities

| Item | Identity |
| --- | --- |
| Revision artifact | `fff-densou-s01e01-benchmark-video-slice-audio-repair-001` |
| Revised MP4 | 8,385,679 bytes; SHA-256 `ad692cd068320db02db787a80bef8a0809a0bdcce0fddfad4c5543454cfda94e` |
| Parent artifact | `fff-densou-s01e01-benchmark-video-slice-001` |
| Original MP4 | 6,445,162 bytes; SHA-256 `0254d1946b1b3b6ac0e544ddbdcb8f097a451330f371b629d56a4ddc0c6cc9fc`; unchanged=true |
| H.264 essence | Original/revision exact match; SHA-256 `d4a7141f34347fecc90d5ba4949889e7c62cf2a7484647480986cf670967e843` |
| S packet | SHA-256 `9135101c2a4463c7778c27d1cc73d111dbcf8dec175afb684d8923e65e3f25ec` |
| Evidence manifest | 17 files; SHA-256 `00122e018b8006cae6b19d20dcbe536556fdc10d0105f0417a84d7298942c673` |
| Source | `fff-densou-series-source-256837a94afd521c` / `densou-256837a94afd521c` / SHA-256 `256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32` |
| Composite basis | `fff-densou-source-basis-b2cab3adb7c270d8` |

The selected primary remains labeled `Sample Raw Memo` and is not represented as a separately delivered original. Supporting structure and raster media remain derived and noncanon.

## Audio and subtitle implementation

- Engine: already-installed Windows `System.Speech` / SAPI; voice `Microsoft Haruka Desktop`, culture `ja-JP`, rate -1.
- Runtime correction: the Codex process lacked `windir`, so the generator sets process-local `windir` from existing `SystemRoot` for registry voice-path expansion. It does not modify registry, OS settings, or permissions.
- Effects: external calls 0, credentials 0, installs 0, uploads 0.
- Content: fifteen existing burned-caption units only. One neutral evidence narrator is used. Dialogue authored=0 and new canon claims=0.
- Pronunciation: eight declared substitutions expand `9:17`, `CASE_DIGEST`, quoted `分`, and quote glyphs for speech. Viewer-facing burned captions and companion ASS/SRT bytes are unchanged.
- Timing: every narration cue starts 0.35 seconds after its subtitle begins and ends with at least 2.44 seconds of remaining subtitle visibility. All cues fit at atempo 1.0; no pacing compression was needed.

## Technical evidence

| Check | Result |
| --- | --- |
| Container | MP4; H.264 1280×720 / 30 fps / 5400 frames; AAC 48 kHz stereo |
| Duration | 180.000 seconds |
| Full decode | A/V PASS; zero decode error lines |
| Picture | Original/revision H.264 essence exact; blackdetect events 0 |
| Audio level | Full-track mean `-22.2 dBFS`; maximum `-3.0 dBFS`; no clipping |
| Cue audibility | 15/15 cue windows pass; cue peaks range `-5.5` to `-3.0 dBFS` |
| Subtitle timing | 15/15 spoken cues wholly inside corresponding burned-caption windows |
| Silence | Fifteen gaps detected at `-45 dB / 1.0s`; each is an expected post-cue pause and all scheduled speech windows separately pass |
| Source coverage | Episode segments 8/8; claims 12/12; unsupported/hidden bridges 0/0 |
| Package evidence | Revision 17/17 exact; parent 11/11 exact; verifier 52/52 PASS |

The waveform shows fifteen discrete speech regions, and the inherited contact sheet shows the unchanged fifteen high-fidelity raster updates and burned captions. These are bounded non-public evidence for S when local video playback is unavailable. They do not replace listening review of pronunciation, pacing, and synchronization.

## S review contract

The packet asks the same S to review exactly seven axes:

1. Visual grammar with narration present.
2. Character and scene readability without unsupported causality.
3. Neutral narration pacing and the intentional absence of invented dialogue.
4. Burned subtitle readability and speech synchronization.
5. Pronunciation, synthetic voice character, levels, and silence gaps.
6. Source fidelity across allegation, theory, derived evidence, and unresolved facts.
7. Expandability without calling the Episode complete.

S returns `ACCEPT_REPAIR` or `REPAIR_REQUIRED` with cue IDs/timestamps. No 720-second extension, another Episode, or another source proceeds before `ACCEPT_REPAIR`.

## Residual card

- Purpose: clear the audio dependency on the bounded 180-second candidate.
- Effect: directly playable H.264/AAC revision plus exact S review evidence.
- Requirements: one human S pass on pronunciation, pacing, synchronization, visual readability, source fidelity, and expandability; retain all source/provenance/partial-completion boundaries.
- State: `AUDIO_REPAIRED_180S_CANDIDATE_READY_FOR_S_REVIEW`; technical gates pass; human gates pending.
- Owner: repository implementation for bytes and evidence; same S for immediate stage-gate; later authorized owners for final voice, rights, canon, production, and publication.
- Next move: S reviews the exact revision and returns `ACCEPT_REPAIR` or cue/timestamp-bound findings. The remaining 540 seconds remain parked.

## Reproduction

```powershell
node tools/fff-densou-episode-audio-repair.mjs validate-plan
node tools/fff-densou-episode-audio-repair.mjs build
node tools/fff-densou-episode-audio-repair.mjs verify
node --test tests/fff-densou-episode-audio-repair.test.mjs
```

Human creative acceptance, final voice selection, rights clearance, final canon, production approval, publication, upload, sharing, monetization, and release remain unapproved.
