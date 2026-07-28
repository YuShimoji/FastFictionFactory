# CASE_DIGEST English verbatim bilingual candidate

`fff-case-digest-english-verbatim-bilingual-001` is a private successor candidate
derived from exact commit `fd6c8e0fb25d6a72f9ca992da5ae032d807bb257`. It changes the
information channel, not the accepted visual treatment: one canonical English text
now drives offline narration and every English caption surface, while Japanese is a
one-to-one debug translation and never the audience default.

## Capability and outcome

| Contract | Result |
| --- | --- |
| Story structure | 5 sections / 11 shots / 180 seconds / 5,400 frames |
| English authority | 24 utterances / 291 words / 1 canonical field `spoken_text_en` |
| Factual audit | 0 unsupported facts; established facts, allegations, and unknowns remain separated |
| Spoken-caption lock | 0 mismatches, 0 audio-only units, 0 caption-only units, 0 independent editorial units during speech |
| Bilingual alignment | 24 English / 24 Japanese / 0 ID mismatches / 100% Japanese debug coverage |
| Timing | first narration 0.650 s; maximum internal gap 4.214 s; final tail 0.700 s; 0 overlaps |
| Caption layout | English maximum 2 lines; Japanese debug maximum 2 lines; 0 orphan, name split, number-phrase split, or kinsoku violations |
| Preserved visual | all 5,400 decoded frame hashes identical to the accepted source; 0 image changes; 0 generated images; 0 transition resets; 0 raw-source flashes |

The English original script and its fact bindings are recorded in
`artifacts/case-digest-english-verbatim-bilingual/english-script.md`,
`utterance-authority.json`, and `source-fact-audit.json`. The reusable lock is
defined in `docs/production/SPOKEN_CAPTION_LOCK_GUIDELINE.md`.

## Voice candidate

The local file-output inventory found six installed System.Speech voices and one
eligible English voice. `Microsoft Zira Desktop` (`en-US`, female, adult) was used at
rate `0` and volume `92` because it was the sole eligible installed English voice,
produced stable local WAV files, retained clear consonants, and fit the measured
section timing. This is a technical candidate selection only:
`final_voice_selected=false` and `production_voice_approved=false`.

Narration WAV:

- PCM signed 16-bit little-endian, mono, 48 kHz
- 180.000 seconds / 8,640,000 samples / 17,280,078 bytes
- SHA256 `053d994a4b4ec1ac9167f2e4c2572565cbbe96e538292e5a8a1f4e859822e502`
- maximum absolute sample `19966`; clipping count `0`

## External run

All binary media and runtime evidence remain outside Git under external run
`fff-case-digest-english-verbatim-bilingual-001`.

| Output | Contract | SHA256 |
| --- | --- | --- |
| `clean/case-digest-english-clean.mp4` | 1280x720, H.264, AAC mono 48 kHz, English and Japanese soft subtitle tracks | `5dabf0d31a93f7e56c9ed30cbc8718e453817a770759ae74ee50c37eb0f69b4c` |
| `audience/case-digest-english-burned.mp4` | 1280x720, H.264, AAC mono 48 kHz, English burned, Japanese absent | `f0bea3f35e0e3bce31ba5f465861d045ca21d0065f2080b31782f24b1e7991ca` |
| `debug/case-digest-english-japanese-debug.mp4` | 1280x720, H.264, AAC mono 48 kHz, English and Japanese burned with visible DEBUG marker | `00c29b139c0113db79b79a7f917489112fa41a89f8d414ebf57464c3e507cb3f` |
| `review/case-digest-english-verbatim.html` | local review page, English default, visible Japanese debug toggle | `afdefd82fd6e555c6dfb370643fbe2795a6ff330f8005a8d5b8cd41052b0d203` |

Caption sidecars:

- English SRT: `cff97f83682274208660164c9e350f95da498aca5846ce405742dcf13510b12f`
- English WebVTT: `3aef62e878aa55215d3a5b28073f89c991846a29bf558990f5ed54436c0e4d78`
- Japanese SRT: `1ef558516eea3e2e1dbb08cf581be2b49a3455b906a2c68868d4d7efe1cbdd0a`
- Japanese WebVTT: `0c22fd2f2853fe440b3dbf8c3a0d59a5a17f2e1f2083cee8b675b8a975083ba5`

## Verification

The focused Node suite passed all 8 tests. It checks the canonical utterance contract,
verbatim SRT/WebVTT reconstruction, English/Japanese ID alignment, factual bindings,
layout rules, media probes, exact decoded-frame preservation, browser behavior, and
fail-closed handling for divergent caption text.

The local browser pass covered `1440x1000` and `390x844`. Both had zero horizontal
overflow, native video controls, no autoplay, and 24 English cues. English was visible
by default; Japanese was absent until the debug toggle was enabled; the toggle
preserved English and exposed the Japanese layer plus DEBUG marker. External requests,
console errors, and page errors were all zero.

The media transition check decoded all 5,400 frames. Source and output frame-MD5
summaries were both
`9927da064e20e5c72c8b95fa1f7220a1c8434395342f392601b5deb866d49b27`.

No network request, credential access, package install, cloud TTS, image generation,
Japanese audio generation, music/SFX generation, upload, push, or public effect
occurred.

## Rejected-format record and preservation boundary

Rejection `FFF-Q-DIVERGENT-SPOKEN-CAPTION-2026-07-29` remains active. It rejects
divergent narration/caption semantics, caption-only exposition, multiple simultaneous
non-diegetic explanations, and Japanese as the audience-facing default. It preserves
the prior candidate as historical evidence, accepted raster imagery, accepted effects
and grade, shot order and timing, and terminal-frame transition behavior.

The repository active/default artifact and the existing raster successor identity are
unchanged. This candidate is private, default-off, unpushed, unpublished, not
rights-cleared, not production-approved, not a final voice selection, and not final
canon.

## Residual gates

| Purpose | Effect if approved | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- |
| English editorial review | accepts or rejects wording, delivery, and comprehension as a whole | review the clean/audience render and exact English script; keep evidential limits intact | pending | Product Owner | perform one bounded private review against this exact run and commit |
| Voice decision | may replace the technical Zira candidate with a production voice | explicit voice/engine authorization, license review, new WAV/media hashes, and rerun of every timing/lock gate | closed | Product Owner | select, reject, or request a separately identified voice candidate |
| Rights and production approval | permits downstream production use | explicit rights evidence and production sign-off for the already accepted visual sources plus audio use | closed | Product Owner | record an artifact-bound decision; do not infer it from technical PASS |
| Publication or release | would create external/public effect | approved production artifact, rights clearance, release target, upload authority, and final review | closed | Product Owner | no action until every prerequisite is explicitly opened |
