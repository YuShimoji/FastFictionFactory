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
- State: H0 implementation/evidence complete; H1 human review not started.
- Owner: human supervisor or delegated creator for H1; product implementer for bounded repair if evidence identifies one.
- Next move: open the standalone HTML and record one freeform H1 judgment; either close the slice or repair only the weak shot(s).
