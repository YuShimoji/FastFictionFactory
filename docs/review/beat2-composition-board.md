# Beat 2 Composition Board Review

## Outcome

`fff-beat2-composition-board-001` is a standalone, reference-only Composition Board for Beat 2 **真鍮の蛾** (`00:20–00:50`). It keeps the six licensed raster references from `fff-beat2-visual-treatment-pilot-001`, adds image-based crop/focus/depth/placement markup, and limits the experiment to the same three source shots.

## Access

Open:

```powershell
Invoke-Item .\artifacts\beat2-composition-board\beat2-composition-board.html
```

Read-only validation:

```powershell
node tools/fff-state.mjs validate-beat2-composition-board artifacts/beat2-composition-board-result.json
```

Intentional manifest/result regeneration:

```powershell
node tools/fff-state.mjs smoke-beat2-composition-board artifacts/beat2-composition-board-result.json
```

## Three-shot composition contract

| Shot | Window | Main composition | Supporting role | Differentiator |
| --- | --- | --- | --- | --- |
| `shot-b02-01` | `00:20–00:30` | Hands and tools fill roughly two thirds of frame; face/full body remain outside the crop | Warm work lamp, tool density, bench depth | Close working-height focus and a narrow pool of light |
| `shot-b02-02` | `00:30–00:40` | Letter occupies the left two thirds; the static moth sits at lower right | Wing contour and metal surface only | Locked near-overhead evidence pairing with no activation cue |
| `shot-b02-03` | `00:40–00:50` | Watch face exceeds the frame; moth wing and brass reflection form two separate layers | The same moth reference recurs as one shared ID; brass dial provides the rear reflection | Extreme close, two-stage focus, explicit `9:17` target / `9:15` reference distinction |

The moth image is intentionally reused across Shot 2 and Shot 3 as one recurring reference. It is stored once, carries one SHA256, and is not counted as a second distinct asset.

## H0 acceptance

H0 passes only when all of the following are true:

- exactly three shots and the preserved `00:20–00:50` order/timing;
- one main and one or two supporting images per shot;
- image-based `構図ラフ`, crop, two focal points, eye path, and foreground/midground/background labels per shot;
- six distinct local reference records with complete creator/source/license/dimension/retrieval/hash metadata;
- no hotlink, symbolic storyboard frame, selected asset flag, or rights-clearance claim;
- Light/Dark/Auto, Auto default, light print, no nested scroll, no horizontal overflow, equal-height shot columns, and main-image visual share above 50% at both required viewports;
- all 22 fail-closed probes pass;
- the Visual Treatment Pilot, Production Storyboard Brief, and Production Execution Pack remain byte-identical.

The machine result is `artifacts/beat2-composition-board-result.json`. H0 can prove integrity, structure, browser measurements, provenance, and closed boundaries. It cannot prove that a separate creator interprets the intended screen without explanation.

## H1 freeform review

Use only the standalone Composition Board. Do not show this review document, the canonical JSON, or the predecessor Pilot while the reviewer answers.

Ask the reviewer to explain in freeform language:

- what occupies foreground, midground, and background in each shot;
- where the eye lands first and where it moves next;
- which parts of the main/supporting references are being borrowed;
- why Shot 1, Shot 2, and Shot 3 are visibly different screens;
- why the moth remains static in Shot 2;
- why `9:17` is a display target while the visible watch reference is approximate;
- which four story/design questions remain undecided.

Pass requires at least two of three shots to be described more specifically than the predecessor Visual Treatment, with no invented moth activation, stopped-clock fact, Toma fate, or final Mira design. If two or more shots remain no easier to stage, record `COMPOSITION_SPECIFICITY_BLOCKER` and name the weak shots; do not start image generation.

## H1 independent transfer result — 2026-07-17 JST

The bounded independent review ran as route `SUPERVISOR->WORKER`, thread `fff-beat2-composition-transfer-h1-01`, lane `COMPOSITION_REVIEW`, slice `beat2-composition-transfer-review-v0`. The reviewer first used only the canonical standalone Board and existing Board screenshots/contact sheet, froze a blind interpretation of every production shot, and only then compared it with `beat2-composition-board.json`, `shot-composition-map.csv`, this review authority, and the predecessor `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html`.

The denominator is every intended Beat 2 production shot present in the canonical Board: `shot-b02-01`, `shot-b02-02`, and `shot-b02-03`. No favorable sampling was used.

At review time Git was on `master` at `ba9ad3ffcf5fe4698483f17bfcaa47af0136d488`, tracking `origin/master` with `0 0` parity. The only worktree change was the user-owned `docs/review/supervisor-current-report.md` update (`git hash-object` `6b8abf46f551bb59b49e6960e6adb2670a997f9c` before this handoff integration); it was not modified during the bounded read-only review.

| Shot | Blind creator reconstruction | Intended comparison | Legacy comparison | Blocking / optional | Result |
| --- | --- | --- | --- | --- | --- |
| `shot-b02-01` | Close, slow pan, working-height view. One implied person, Mira, appears as hands only; fingers/tweezers dominate about two thirds, with the part lower-right and face/body outside frame. Eye path is dark upper-left → fingers → tool tip. Fingers/tools, part/work surface, and dark bench form foreground/midground/background. | Principal subject, scale, crop, focal order, action, depth, and transition into the clue pairing all matched. No critical misread or material omission. | The Pilot supplied hands/tools/parts and `Close / Slow pan`, but not screen share, focal order, depth, crop discipline, or the supporting environment's subordinate role. | No blocker. Exact pan vector and tool shape remain optional. | `improved_and_executable=true`, high confidence |
| `shot-b02-02` | Close, locked, within about 5° of overhead. Zero people and two principal clue objects: memo on the left two thirds and static moth at lower-right one third, separated by a dark gap. Eye path is handwriting → fold → moth. Drawer-edge shadow, memo/moth, and dark wood form the three depth layers. | Left/right relationship, scale, angle, eye path, static action, depth, and moth continuity into Shot 3 matched. No critical misread. The blind wording did not quantify the gap as one finger, but this did not alter construction. | The Pilot said to place a large memo next to the moth, but left/right placement, proportions, overhead angle, gap, eye path, and depth remained assumptions. | No blocker. Exact memo copy, moth rotation, and drawer-edge thickness remain optional. | `improved_and_executable=true`, high confidence |
| `shot-b02-03` | Extreme close, controlled parallax, two-stage focus. Zero people and three visual layers: oversized clock face, partial moth wing at lower right, and rear brass reflection. Eye path is `9:17` → moth → reflection; the visible `9:15` reference is not mistaken for the production target. | Subject identity, out-of-frame scale, time target, layer order, focal sequence, and the Shot 2 moth recurrence matched. No critical misread or material omission. | The Pilot supplied the extreme watch view and brass reflection but did not give the moth its visual reference assignment, lower-right placement, three-layer relationship, or full focal sequence. | No blocker. Exact parallax direction and amplitude remain optional. | `improved_and_executable=true`, medium-high confidence |

The exact result is `3 / 3 = 1.0 (100%)`, above the `2/3` threshold. No repeated systemic composition ambiguity affects more than one third of the shots. Pan/parallax direction and amplitude remain free in two shots, but they are non-blocking motion styling choices because subject placement, focal order, depth, and continuity are already fixed.

Primary classification: `H1_COMPOSITION_TRANSFER_PASS`.

Verified evidence covers Git state at review time, canonical/comparator paths, the complete three-shot denominator, source files, and the calculated ratio. Observed evidence covers what the independent reviewer reconstructed from the Board. Easier production transfer is an inference; actual constructed frames, art polish, and final motion tuning remain unknown. A live browser session could not initialize in the review runtime, so the visual pass used the existing tracked viewport captures/contact sheet plus the canonical HTML; no new render or screenshot was produced.

The H1 review itself made no file changes, commits, pushes, or generated media. This repository update only preserves that completed review and its restart context. The only recommended successor is one bounded counterexample on a different Beat before any 19-shot expansion; it is not authorized or executed by this result.

## Boundaries

- `reference_only=true`
- `selected_for_production=false`
- `rights_cleared_claim=false`
- no production asset selection or rights clearance
- no provider/API, credentials, external generation, image/audio/video generation, render, upload, publication, or database persistence
- no 19-shot expansion
- no final canon decision

## Residual work

- Purpose: determine whether the three image-based composition strips transfer concrete staging intent to another creator.
- Effect: closes or falsifies the non-generated composition approach before any broader visual work.
- Requirements: standalone H1 review, preserved source bytes, and no closed-gate expansion.
- State: H0 implementation/evidence complete; H1 passed `3/3 = 1.0` as `H1_COMPOSITION_TRANSFER_PASS`; no Board repair is indicated.
- Owner: the independent reviewer owns the recorded H1 judgment; a human supervisor owns any authorization to open the different-Beat counterexample.
- Next move: preserve the Board as the accepted Beat 2 composition checkpoint. If separately authorized, run one bounded different-Beat counterexample before any 19-shot expansion.
