# Densou Episode 1 Benchmark Video Slice

## Outcome

`fff-densou-s01e01-benchmark-video-slice-001` is a directly playable private Episode 1 development artifact. It is an honest 180-second vertical slice of the 720-second `densou-s01e01-bellless-tower` packet, not a padded claim that the full twelve-minute episode is picture-locked.

Primary review surfaces:

- `artifacts/densou-s01e01-benchmark-video-slice-001/review.html`
- `artifacts/densou-s01e01-benchmark-video-slice-001/densou-s01e01-benchmark-video-slice.mp4`
- `artifacts/densou-s01e01-benchmark-video-slice-001/densou-s01e01-benchmark-video-slice-contact-sheet.jpg`

## Exact identity

| Item | Identity |
| --- | --- |
| Artifact | `fff-densou-s01e01-benchmark-video-slice-001` |
| Episode | `densou-s01e01-bellless-tower` / 「鐘のない塔」 |
| Media | 6,445,162 bytes; SHA-256 `0254d1946b1b3b6ac0e544ddbdcb8f097a451330f371b629d56a4ddc0c6cc9fc` |
| Evidence manifest | SHA-256 `4e912630a236f8a342484b48055579cb2dbdd991635bb438604b2c44dc077794` |
| Source | `artifacts/sample-raw-memo.md`; 1080 bytes; SHA-256 `256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32` |
| Source revision | `densou-256837a94afd521c` |
| Source packet | `fff-densou-series-source-256837a94afd521c`; packet manifest 8/8 exact |
| Composite basis | `fff-densou-source-basis-b2cab3adb7c270d8` |
| Benchmark | `fff-benchmark-form-contract-case-digest-v1@1.0.0` |

The selected primary remains a repository file labeled `Sample Raw Memo`; it is not represented as a separately delivered original. The accepted source gate remains unlocked for this private work, while supporting material remains derived and noncanon.

## Product and source mapping

The slice uses fifteen continuous visual updates and fourteen existing accepted raster images. Each update names one Episode segment and only claims allowed by that segment. The package-level `segment-source-map.json` resolves all eight treatment segments and all twelve source claims; unsupported claims and hidden causal bridges are both zero.

The first anomaly appears at 0 seconds and the contradiction at 8 seconds. Investigator/stake cues appear by 30 seconds, clue chaining begins at 42 seconds, the evidence turn occurs at 90 seconds, and the unresolved close occupies 153–180 seconds. The maximum visual-update gap is 14 seconds.

## Media and benchmark evidence

| Check | Result |
| --- | --- |
| Container / video | MP4 / H.264, 1280×720, 30 fps, 5400 frames |
| Duration | 180.000 seconds |
| Decode | Full decode PASS; zero error lines |
| Black check | PASS; zero blackdetect events at 0.2-second threshold |
| Audio | Zero streams by intentional silent-picture policy; voice remains auxiliary and replaceable |
| Captions | Fifteen burned Japanese units; maximum 37 visible characters; deterministic ASS and SRT supplied |
| Evidence | Package manifest 11/11 exact; source packet manifest 8/8 exact |
| Benchmark | Ten machine-checkable dimensions pass; 70/70 machine-available points |
| Human gate | BF-11 first-pass audio-independent comprehension pending; no final acceptance score claimed |

The contact sheet was visually inspected for primary-raster use, readable captions/evidence labels, private watermarking, and obvious black/clipped frames. No such defect was observed. This does not replace timed human first-pass review of the MP4.

## Quantitative gap and next move

- Purpose: prove the accepted packet can become a benchmark-shaped playable Episode 1 product without adding source claims.
- Effect: 180/720 seconds are directly playable, or 25% duration coverage, across all eight segment identities.
- Requirements: preserve the exact source/packet/basis identities; add a source-span-bound twelve-minute shot and audio plan before expanding cadence; preserve intentional uncertainty and private/noncanon boundaries.
- State: `PRIVATE_PLAYABLE_BENCHMARK_VERTICAL_SLICE_READY_FOR_SUPERVISOR_REVIEW`; BF-11 human comprehension pending; 540 seconds remain.
- Owner: repository implementation owns reproducibility and evidence; the existing Supervisor owns the next technical disposition; later authorized creative/production owners own long-form planning, human acceptance, rights, canon, and production gates.
- Next move: review the exact MP4/HTML against BF-11 and the segment-source map. After technical acceptance, expand the remaining 540 seconds from the bound Episode packet; do not pad the three-minute cadence or reopen source selection.

## Reproduction

```powershell
node tools/fff-densou-episode-video.mjs validate-plan
node tools/fff-densou-episode-video.mjs build
node tools/fff-densou-episode-video.mjs verify
node --test tests/fff-densou-episode-video.test.mjs
```

The artifact is private development/previsualization only. Human creative acceptance, final canon, rights clearance, production approval, publication, upload, sharing, monetization, release, and voice/audio generation remain unapproved.
