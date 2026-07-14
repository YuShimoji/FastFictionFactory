# Beat 2 Composition Board

Standalone composition board for **真鍮の蛾** (`00:20–00:50`). Open `beat2-composition-board.html`.

## Composition contract

- Exactly three Beat 2 shots in the preserved order and timing.
- One main image and one or two supporting images per shot.
- Image-based crop, focus, eye-path, depth, and placement overlays; no generic storyboard frame.
- Six normalized local reference images copied byte-for-byte from the preserved Visual Treatment Pilot.
- The moth reference is shared by Shot 2 and Shot 3 as one recurring reference, not counted as a distinct duplicate.

## Boundaries

- Every image remains reference-only and unselected.
- License provenance is recorded; no rights-clearance claim is made.
- No image generation, render, upload, persistence, or final story decision.
- The Visual Treatment Pilot, Production Storyboard Brief, and Production Execution Pack remain byte-identical.

## Checks

Read-only:

`node tools/fff-state.mjs validate-beat2-composition-board artifacts/beat2-composition-board-result.json`

Intentional manifest/result regeneration:

`node tools/fff-state.mjs smoke-beat2-composition-board artifacts/beat2-composition-board-result.json`
