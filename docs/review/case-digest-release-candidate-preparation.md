# CASE_DIGEST Release Candidate Preparation

## Finalized-run revalidation — 2026-07-31 JST

The implementation checkpoint is `47be1e577f883a200ec757d9f0255a36886ddf50`. The canonical external run subsequently reached manifest state `PASS_COMMITTED_LOCAL_ONLY`, but the dedicated suite still required the transient state `BUILDING`. The test contract now accepts the declared lifecycle states, verifies exact commit evidence for the finalized state, and permits only terminal-local `.serena/project.yml` at the tracked boundary.

Live revalidation passes: the dedicated finalized-run suite is 10/10; `FinalQc` returns `PASS_RELEASE_PREPARATION_AWAITING_VOICE`; JavaScript syntax, `git diff --check`, and strict MkDocs pass. The MkDocs build retains the existing non-blocking warning that 24 review pages are outside configured navigation.

This repair changes no product or media input/output. The original manifest's `pushed=false` remains build-time evidence. Git branch distribution, if performed, is a separate source-control event and does not imply a media rebuild, merge, PR, release, production approval, rights clearance, publication, or canon change.

## Outcome

`fff-case-digest-release-candidate-preparation-001` is a machine-complete private preparation bundle built from exact source commit `58b8cc437bb0f8e0f796490bdfd213e8b211834f`. It freezes the accepted picture, canonical 24-utterance English script, and bilingual caption timing while moving the rejected Zira voice out of the successor build path.

The current state is `PASS_RELEASE_PREPARATION_AWAITING_VOICE`. This is the intended successful outcome because no eligible installed file-output English male voice exists locally. The exact voice state is `natural_male_voice_input_required`; no provisional A/V was generated and no voice-only human review is requested.

## Delivered surfaces

- Tracked 18-file contract package: `artifacts/case-digest-release-candidate-preparation/`
- Tool: `tools/fff-case-digest-release-candidate-preparation.ps1`
- Targeted test: `tests/fff-case-digest-release-candidate-preparation.test.mjs`
- External run: `fff-case-digest-release-candidate-preparation-001`
- External picture lock, four caption sidecars, thumbnail, metadata, voice-intake templates, accepted-take directory, local review HTML, evidence, and verification files remain outside Git.

The local HTML is an operator/readback surface. It loads without a server or network, uses native non-autoplay video controls, adapts to 1440×1000 and 390×844 viewports, and explicitly carries `review_requested=false`.

## Machine evidence

- Picture lock: one H.264 video stream; 1280×720; 30 fps; 180 seconds; 5,400 frames; zero audio and subtitle streams.
- Visual preservation: decoded frame identity is equal for all 5,400 frames; accepted image changes and image-generation calls are zero.
- Captions: locked EN SRT/VTT and JA SRT/VTT hashes preserved; 24 cues in each.
- Voice intake: both input modes represented; one structural fixture passes machine validation without any naturalness claim.
- Negative probes: missing file, duplicate utterance, wrong transcript, clipping, music/SFX declaration, timing mismatch, unknown identity, and absent rights provenance all fail closed.
- Thumbnail: deterministic 1280×720 `archival_case_file_thumbnail_v1` derivative from accepted `shot-b03-01`.
- Release metadata: one title, one description, exactly five chapters, subtitles, credits, and private publication notes.
- Provenance: all 11 visual shots plus script, captions, thumbnail, voice placeholder, and font identity are present; every row declines a legal conclusion.
- Repository boundary: the tracked preparation package contains no MP4, WAV, JPG, or PNG outputs.

## Human and owner boundary

There is no standalone voice acceptance gate. Once a documented calm English male take passes machine intake and the deterministic builder produces the complete candidate, the next human review scope is the whole release candidate: picture, narration, captions, metadata, and thumbnail together.

Machine green does not select or approve the final voice, approve production, clear rights, approve publication, publish anything, or establish final canon.

## Residual work

| Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- |
| Supply the required English male take | Enables deterministic release-candidate A/V assembly | Explicit speaker identity; calm lower/mid delivery; exact transcript; PCM mono 48 kHz 16/24-bit; zero clipping; no music/SFX; documented provenance; clone authority if applicable | `natural_male_voice_input_required` | Voice provider/recording owner and rights owner | Populate `voice-input/accepted-take/`, run `ValidateVoiceTake`, then `BuildReleaseCandidate` |
| Judge naturalness in context | Determines whether the narration works with the full three-minute object | Machine-valid complete candidate; no voice-only comparison request | Pending; not requested in this preparation slice | Product Owner/editorial reviewer | Review the whole release candidate once and bind any finding to utterance/timestamp/surface |
| Production and rights authorization | Determines whether the candidate may become production material | Separate voice approval, asset/font/voice rights review, production authority | Closed | Named production and rights owners | Record explicit approvals or repairs; do not infer them from QC |
| Publication and canon decision | Determines external release and story authority | Production and rights gates complete; explicit publication and canon decisions | Closed | Publication owner and canon owner | No upload or public effect until separately authorized |
