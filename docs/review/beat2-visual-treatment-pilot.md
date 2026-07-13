# Beat 2 Visual Treatment Pilot

## Outcome

`fff-beat2-visual-treatment-pilot-001` is a standalone, reference-only look-development page for **真鍮の蛾** (`00:20–00:50`). It replaces none of the accepted Storyboard Brief or Production Execution Pack: both source packages remain byte-identical. The pilot tests one bounded question—whether six real, locally stored raster references can communicate the three-shot visual treatment more concretely than planning-only diagrams.

Open `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html` or use the compact `Beat 2 ビジュアル参照` link in the accepted Blueprint utility area.

## Package Contract

- Exactly three sequential shot strips: `shot-b02-01`, `shot-b02-02`, `shot-b02-03`.
- Exactly two references per shot: one large primary and one smaller supporting image.
- Six distinct raster references, normalized locally to a maximum edge of 1600 px with EXIF removed.
- Primary reading order: 真鍮の蛾 → 人物・場所・手がかり → ビジュアル方針 → ショット構成 → 保留事項 → 出典.
- Every shot keeps `画面`, `意図`, `尺`, `カメラ`, and `成立条件` adjacent.
- Light / Dark / Auto are explicit; Auto is the default. Print CSS forces a light document.
- The 9:15 watch photo is an honest near-time reference only; the page states that the production display must be 9:17.

## Source and License Audit

| Shot | Role | Local reference | Creator | License | Source page |
| --- | --- | --- | --- | --- | --- |
| 01 | primary | `ref-b02-s01-precision-handwork.jpg` | giridibyaranjan | CC BY-SA 4.0 | [Watchmaking skills.jpg](https://commons.wikimedia.org/wiki/File:Watchmaking_skills.jpg) |
| 01 | supporting | `ref-b02-s01-watch-repair-workbench.jpg` | SerChevalerie | CC0 1.0 | [Traditional watch repairer at work in Goa.jpg](https://commons.wikimedia.org/wiki/File:Traditional_watch_repairer_at_work_in_Goa.jpg) |
| 02 | primary | `ref-b02-s02-aged-handwritten-letter.jpg` | Lainey Powell | CC BY 2.0 | [Old Letter.jpg](https://commons.wikimedia.org/wiki/File:Old_Letter.jpg) |
| 02 | supporting | `ref-b02-s02-metal-butterfly-brooch.jpg` | Jane023 | CC0 1.0 | [Butterfly brooch.jpg](https://commons.wikimedia.org/wiki/File:Butterfly_brooch.jpg) |
| 03 | primary | `ref-b02-s03-vintage-watch-0915.jpg` | Joe Haupt | CC BY-SA 2.0 | [Vintage Bulova watch](https://commons.wikimedia.org/wiki/File:Vintage_Bulova_Men%27s_Swiss-Made_Manual-Wind_Wrist_Watch_(8505636506).jpg) |
| 03 | supporting | `ref-b02-s03-brass-clock-dial.jpg` | Brooke Campbell / bcampbell | CC0 1.0 | [Antique clock dial](https://commons.wikimedia.org/wiki/File:Antique_clock_dial_(Unsplash).jpg) |

Full source URLs, original media URLs, original/local dimensions, retrieval date, SHA256, role, and boundary flags are in `reference-sources.csv`. All six entries are `reference_only=true`, `selected_for_production=false`, and `rights_cleared_claim=false`.

Rejected during visual inspection:

- Simon Willard tall clock: full furniture context dominated; unsuitable for a 9:17 extreme close-up.
- Caravelle watch at 9:15: corporate logo and promotional text dominated.
- Rhodes outdoor clock at 9:15: time face was too small and the modern seaside context competed with the story.

## Verification Evidence

- Read-only validator: `node tools/fff-state.mjs validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json`
- Result: `passed=true`, `failures=[]`, 3 shots, 6 references, 2 references per shot, 24/24 fail-closed probes.
- Source protection: Storyboard Brief seven-file aggregate `bb9d4fce3ed5ac328b49f0ac691e0ab9b6ca671d0318ef4e60522dca7a6fabb8`; Execution Pack nine-file aggregate `10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345`.
- 900x1200 Dark: 34 px one-line title, no horizontal overflow, minimum primary-image share about 68%.
- 1280x900 Light: 38 px one-line title, no horizontal overflow, minimum primary-image share about 68%.
- Auto resolves through the OS preference; print rules force light colors, static utility positioning, and shot break avoidance.
- Screens: `artifacts/review-screens/beat2-visual-treatment-900x1200-dark.png`, `artifacts/review-screens/beat2-visual-treatment-1280x900-light.png`.

## Boundaries

This artifact does not select production assets, claim rights clearance, generate images, change story content or timing, decide the moth's function, decide Toma's fate, interpret 9:17 beyond its recorded motif, finalize Mira's design, configure a provider, render, upload, publish, persist production state, or promote canon.

## Residual Work

- Purpose: Determine whether this one-beat visual treatment gives a separate creator enough concrete visual direction to explain and stage all three shots.
- Effect: A human answer can now distinguish primary versus supporting references, name the intended material/light language, and identify the held story questions without reading the operational packs.
- Requirements: Review this standalone page only; keep all six images reference-only; do not treat license metadata as a clearance decision; do not change source wording, IDs, ordering, or timing.
- State: H0 machine validation is green. H1 human visual-treatment comprehension has not started. H2 production selection and rights review remain closed.
- Owner: The product implementer owns deterministic files, provenance, validation, and accessibility evidence; a human supervisor or delegated creator owns H1; rights and production owners remain outside this lane.
- Next move: Run one H1 freeform review. If the visual treatment still fails, repair only evidenced composition, reference choice, or wording friction inside Beat 2; do not widen to the full 19-shot asset package.
