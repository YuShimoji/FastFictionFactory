# CASE_DIGEST English editorial naturalness successor

`fff-case-digest-english-editorial-naturalness-001` is a private, default-off
successor to `fff-case-digest-english-verbatim-bilingual-001`. It starts from exact
source HEAD `2a2cb5ddc3ca7cdcbf9934a75023325d4bdbf155`, contains product checkpoint
`dbd3ec00d7f31ba84bebb032f78057780215c338`, and preserves visual-treatment parent
`fd6c8e0fb25d6a72f9ca992da5ae032d807bb257`.

The capability change is editorial only: all 24 English utterances now read as calm,
idiomatic documentary narration on first listen. The 24 IDs, owning shots, five
sections, eleven shots, 180-second programme, evidence boundaries, English-default
picture, and Japanese-debug structure remain stable.

## Editorial outcome

| Contract | Result |
| --- | --- |
| English script | 24 utterances / 313 words / maximum 21 words |
| Required repairs | `cd-en-003`, `012`, `015`, `017`, and `019`–`021` materially rewritten |
| Full audit | 24/24 predecessor utterances reviewed and materially rewritten |
| Naturalness | 0 fragments / 0 translated-syntax findings / 0 legal-report phrases / 0 abstract `causal action` constructions |
| Redundancy | 0 adjacent redundant caveats / 0 final-section ledger duplication |
| Repeated legal terms | `reported=1`; `established=0`; `confirmed=0`; `unverified=0`; `available material=0` |
| Facts | unsupported facts 0 / hidden causal bridges 0 / unauthorized canon 0 |
| Evidence promotion | allegations promoted 0 / unknowns promoted 0 |
| Bilingual | 24 English / 24 Japanese debug / ID mismatches 0 / Japanese audio 0 |

Material examples:

- `cd-en-003`: “The empty frame can be verified, but no bell or other
  sound-making device has been found.”
- `cd-en-012`: “The pages show that structure, but they do not show the ledger
  causing anything.”
- `cd-en-015`: “The accusation raises suspicion, but it does not prove that the
  council was involved.”
- `cd-en-017`: “The evidence leaves the council's possible role and motive
  equally unclear.”
- `cd-en-019`–`021` now summarize the known record, clue trail, and unresolved
  ledger meaning without repeating the earlier minutes/names explanation.

The final section states the known record, keeps three unresolved link groups
visible, and closes with “For now, the tower remains under investigation.” It does
not introduce a choice, solution, promise, or new canon.

## Voice, timing, and caption lock

The same local `System.Speech` voice is used: `Microsoft Zira Desktop`, `en-US`,
rate `0`, volume `92`. It remains a private technical voice candidate:
`final_voice_selected=false` and `production_voice_approved=false`.

| Check | Result |
| --- | --- |
| Narration WAV | PCM s16le / mono / 48 kHz / exactly 180.000 s / clipping 0 |
| First narration | 0.650 s |
| Maximum internal gap | 4.452 s |
| Final tail | 0.701 s |
| Narration/caption overlap | 0 / 0 |
| Caption onset | within 30 ms of recorded audible onset |
| Caption tail | 200 ms after utterance audio |
| Spoken-caption identity | mismatches 0 / audio-only units 0 / caption-only units 0 |
| Japanese debug | 24/24, secondary only, absent from audience picture |

Caption sidecars:

- English SRT `0c0be8ede8faf4b2baaedc2b852fa9b0fbea151a35bcb8bd6e1f99c5724ac2e0`
- English WebVTT `05dc4dde708b576f778a2dfa0f766edf9b45ddc8d86ee56822ab9636e86c8cbc`
- Japanese debug SRT `01bb9501f3ddb1a54108014fcf4115413bf71aae6ea5e055f3afe320f737496d`
- Japanese debug WebVTT `e0dcdc17ad367f433d7ac620b88d391629044c87c9d2e8c1ab61697883f6ee80`

Narration WAV SHA256:
`21f900b997db909bbe85556d9ddf4c1b9d2642b586b3e249a0eaeacd6ba96c0a`.

## External run and visual preservation

All runtime media and screenshots remain outside Git under
`D:\AI-Runs\FastFictionFactory\fff-case-digest-english-editorial-naturalness-001`.

| Output | Contract | SHA256 |
| --- | --- | --- |
| `clean/case-digest-english-clean.mp4` | 1280x720 / 30 fps / 5400 frames / English and Japanese soft subtitles | `94383a3067d769831fe9fd4e71846283867623f77a5799b570eca1dda034831f` |
| `audience/case-digest-english-burned.mp4` | 1280x720 / 30 fps / English burned / Japanese absent | `181820cb28af66526569691bb575eec5c637adb3bff6fd25b15545940d976de7` |
| `debug/case-digest-english-japanese-debug.mp4` | 1280x720 / 30 fps / English primary / Japanese secondary / visible DEBUG | `e68dac0ebc9211f071b5e47d56c6031a839f458fb5923b740f7b73449334aa44` |
| `review/case-digest-english-editorial-naturalness.html` | local/no-server/no-network / native controls / English default / debug toggle | `786f296b3c128ba712b700856e92eec6c3d05dcf97926a3697cb571beb5df817` |

All 5,400 decoded clean-master frames match the predecessor. Source and successor
frame-MD5 summaries both hash to
`9927da064e20e5c72c8b95fa1f7220a1c8434395342f392601b5deb866d49b27`.
Image changes, image generation, transition resets, and raw-source flashes are all
zero.

The standalone review passed at `1440x1000` and `390x844`: no horizontal overflow,
no autoplay, native controls and scrubber present, 24 exact English cues, Japanese
hidden by default, Japanese visible only with explicit DEBUG state, and zero external
requests, console errors, or page errors.

## Verification and effects

PowerShell parsing and Node syntax pass. The focused suite passes 8/8 and covers
revised fact/naturalness audits, predecessor/shot stability, SRT/VTT parsing,
spoken-caption identity, EN/JA alignment, timing, WAV/MP4 contracts, full-frame
identity, review runtime, and tracked text-only boundaries.

Network requests, credential touches, installs, tracked media, image generation,
Japanese audio generation, music/SFX, uploads, and public effects are all zero. No
push, merge, PR, tag, release, deployment, upload, or publication is part of this
candidate.

## Residual gates

| Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- |
| English editorial acceptance | accepts or rejects this wording and delivery as the review object | exact 313-word script, audience render, and artifact-bound findings | pending | Product Owner/editorial reviewer | review once; bind any material finding to utterance, shot, section, or timestamp |
| Final voice selection | may replace the private Zira technical voice | separately authorized engine/voice, rights, resynthesis, timing, caption, and media validation | closed | Voice/Product Owner | do not infer from this technical PASS |
| Production and rights | may permit production use of accepted visuals and audio | explicit rights evidence and production sign-off | closed | Production and rights owners | record a separate artifact-bound decision |
| Publication/release | would create external effect | production approval, rights clearance, release target, upload authority, and final review | closed | Publication/release owner | no action until every prerequisite is explicitly opened |
| Final canon | would promote story interpretation beyond current evidence | explicit author decision | closed | Story owner | preserve reported, alleged, and unknown states |
