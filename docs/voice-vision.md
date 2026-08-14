# FastFictionFactory voice vision

This file is the single project-level owner for voice and narration routing. Artifact receipts keep exact historical evidence, but they do not create a second roadmap or reopen an old review.

Voice and narration now sit in `A_REPLACEABLE_ASSETS_AND_METADATA` under `docs/production-lanes.md`. A working voice supplies a duration/cue envelope only. Replacing it or uniformly retiming the whole video inside that envelope cannot rewrite the story reference, authored plot spine, prose/style, imagery, shots, transitions, or edit authority.

## The three boundaries

| Boundary | What it is for | Current state | What can advance it |
| --- | --- | --- | --- |
| Original Japanese narration | Give a source-bound Japanese episode or short a reviewable spoken timing layer | The exact NON_DENSOU CASE_DIGEST Ichiro media is accepted for development timing use; its perceptual gate is closed | Use the accepted bytes unchanged for content and production-process review; do not create another timing-voice candidate |
| Final Japanese voice | Select the voice identity viewers should recognize and retain | Human-owned and unselected. VOICEVOX 青山龍星 is a named option, not a decision | Explicit voice-owner approval after a clean comparison and applicable terms/credit review |
| YouTube localization | Add translated audio after an original-language work and publication route exist | Optional and inactive | A later publication/localization decision. It is never used as the original Japanese narrator |

YouTube Help describes automatic dubbing as generated translated tracks, currently lists Japanese-source dubbing to English, and says automatic dubs cannot be edited. It therefore remains downstream localization: <https://support.google.com/youtube/answer/15569972?hl=ja-JP>. The official 青山龍星 product page is retained only as evidence for a possible later final-voice review: <https://voicevox.hiroshiba.jp/product/aoyama_ryusei/>.

## One sequence, one live gate

1. **Clean low-cost male timing voice.** Use a locally available, file-output Japanese male voice without network, credentials, installation, purchase, playback, upload, or publication. The output must remain provisional, preserve its source picture and subtitles, pass the objective signal gate, and then receive one human perceptual verdict.
2. **Human-approved familiar Japanese final voice.** Only after the timing candidate has shown the intended delivery should the voice owner compare an explicitly approved familiar route. Selection, character terms, credit, and production use are separate decisions. A timing voice does not become final by surviving technical checks.
3. **Optional YouTube localization.** Consider automatic dubbing only after original Japanese narration, production, publication, and localization ownership are resolved. Its translated tracks do not supply or repair the original Japanese narration.

At any moment the project may have at most one human voice gate. As of 2026-08-13, `fff-private-raster-case-digest-ichiro-successor-20260813-001` at SHA-256 `1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10` has verdict `ACCEPT_DEVELOPMENT_TIMING_VOICE`; the development timing-voice perceptual gate is closed and there is no active voice candidate or voice review packet. The old NON_DENSOU CASE_DIGEST content/process surface is parked presentation evidence rather than the current project gate. Nemo calibration, English documentary voice work, Densou audio repair, and old task packets are evidence or independent lanes, not parallel review requests.

## Noise and listening contract

Every processed cue and the corresponding muxed AAC region must satisfy all of these machine checks:

- zero clipped decoded samples and peak below 0 dBFS;
- absolute decoded DC offset no greater than `0.005`;
- zero adjacent-sample jumps greater than `0.75` on normalized float PCM;
- active-frame 8–20 kHz energy ratio no greater than `0.10`.

These limits catch clipping, sustained DC bias, hard discontinuities, and disproportionate high-band energy. They do not certify that a voice sounds natural. A human report of buzzing, crackling, tremor, unfamiliar character, bad gaps, poor comprehension, pronunciation, or intonation fails the experience gate even when hash, decode, and all numeric checks pass.

The exact Haruka candidate `cea496c12c7485a47a992877dc2544bff4be9cd6a1a7c7192574adb7215f0c12` is therefore rejected. A first-cue reconstruction found DC offset already present in raw SAPI output (`0.019016929`), larger after the old trim/fade/limiter path (`0.026281221`), and essentially retained in the candidate AAC region (`0.026707612`). There was no clipping or extreme sample discontinuity, so the earliest observed divergence is the raw synthesizer output; the old processing failed to remove and slightly amplified that bias. The user's audible `ビリビリ` finding remains the decisive evidence.

## Closure and supersession

- A verdict binds to artifact ID and media SHA-256. It cannot be transferred to another file with a similar name.
- `REJECT` closes that artifact's review action immediately. Later decode, hash, or validator success cannot reopen it.
- Rejected bytes and their original package stay immutable evidence. A successor is always written to a new directory and receives a new artifact ID and hash.
- A successor becomes the active review gate only when its exact receipt exists, its package verifies, and the previous action is explicitly closed. There is no placeholder or phantom successor review.
- Only the active artifact may have an acceptance packet. Older packets and duplicated task wording are historical and must not be relayed again.
- `ACCEPT` for a timing candidate closes only provisional voice character, gaps, comprehension, pronunciation, intonation, and audible-noise review for that exact hash. It does not select the final voice or open rights, production, canon, Densou, upload, or publication.
- The current acceptance is recorded at `artifacts/nondensou-voice-convergence-20260813-001/development-timing-voice-acceptance.json`. It supersedes the active Ichiro audio-review action without superseding or deleting its package. No new timing-voice probe, candidate, packet, or human gate is permitted unless a later explicit decision reopens that boundary.
- Final voice selection requires an explicit human decision naming the voice identity and scope. YouTube localization requires a later independent publication/localization decision.

## Current implementation boundary

The accepted development timing route is Windows OneCore `Microsoft Ichiro`, male, `ja-JP`, selected through `Windows.Media.SpeechSynthesis` and written to WAV without playback. A 60 Hz high-pass precedes the existing fade/limiter path to remove the source DC bias. This remains a speed/cost timing model only; acceptance does not make it familiar, final, production-approved, or rights-cleared.

VOICEVOX Nemo 0.24.0/style 10000 remains useful historical evidence because an earlier owner observation described it as calmer and easier to hear. Its external engine and retained media roots are absent from this machine, so that route is not executable now and is not an active review. VOICEVOX/青山龍星 was not found in the scoped installed-program roots and is not installed or downloaded by this work.

The evidence owner for the current transition is `artifacts/nondensou-voice-convergence-20260813-001/`. Densou source and all Densou audio artifacts remain outside this NON_DENSOU lane.
