# Artifacts

## fff-resumable-private-pipeline-001

- Title: Fast Fiction Factory Resumable Private Pipeline
- Purpose: Reconstruct the accepted nineteen-frame / 180-second silent private candidate through one stable external-run CLI without manually rebuilding the one-off preview implementation.
- Consumer: solo creator resuming on another terminal
- Entrypoint: `tools/fff-private-pipeline.mjs`
- Commands: `dry-run`, `build`, `status`, `resume`, `verify`
- Contract/result: `artifacts/resumable-private-pipeline/pipeline-contract.json`, `artifacts/resumable-private-pipeline-result.json`
- Review doc: `docs/review/resumable-private-pipeline.md`
- Run contract: external versioned directory with manifest, seven stage receipts, source fingerprints, toolchain versions, executed commands, run-local frames/timeline, silent MP4, media verification, and atomic final receipt
- Resume contract: reuse the longest valid receipt prefix; restart the first missing/stale stage; refuse resume after canonical input identity changes
- Byte identity rule: record actual MP4 SHA256 and FFmpeg version; require exact frame/timeline identity and media properties rather than cross-version MP4 byte identity
- Read-only validation: `node tools/fff-state.mjs validate-resumable-private-pipeline artifacts/resumable-private-pipeline-result.json`
- Boundaries: no story rewrite, material polish, sourcing, voice, generation, asset selection, rights clearance, production approval, publication, persistence, or canon decision

## fff-private-previsualization-timeline-001

- Title: Fast Fiction Factory Private Previsualization Timeline
- Purpose: Make the accepted 180-second / six-Beat / nineteen-shot composition playable, scrubbable, and visually concrete while deriving all shot and readiness thumbnails from one canonical frame system.
- Primary file: `artifacts/private-previsualization-timeline/private-previsualization-timeline.html`
- Package: canonical JSON, HTML player, 19 frames, 14 requirement derivatives, two CSV maps, contact sheet, silent MP4, deterministic build script, and integrity manifest
- Review doc/result: `docs/review/private-previsualization-timeline.md`, `artifacts/private-previsualization-timeline-result.json`
- Visual evidence: `artifacts/review-screens/private-previsualization-timeline-1440x1000-desktop.png`, `artifacts/review-screens/private-previsualization-timeline-390x844-narrow.png`, `artifacts/private-previsualization-timeline/private-previsualization-contact-sheet.jpg`
- Playback contract: exact 00:00–03:00 / 6 Beats / 19 shots / 0 gaps / 0 overlaps; play/pause/scrub/shot/Beat/keyboard/reduced-motion behavior; proportional picture/narration/subtitle/camera/transition lanes
- Thumbnail contract: 19 unique canonical frames / 14 unique readiness derivatives / 0 accidental duplicates; intentional motif returns labeled
- MP4: 960×540 H.264 / 30 fps / silent / 180.000 seconds / SHA256 `78c1b45498c25b873a757e04816257c42d31d4a53fd0c9905b50ae37a6022978`
- Source/rights contract: 28 source image hashes unchanged; 21 explicit-evidence proxy references rendered; both ambiguous-evidence identities excluded; production selection and rights-cleared claims remain zero
- Read-only validation: `node tools/fff-state.mjs validate-private-previsualization-timeline artifacts/private-previsualization-timeline-result.json`
- State: H0 green. Next gate is supervising-AI/creator experience review; production, rights, voice, final render, and publication stay closed.

## fff-asset-rights-readiness-packet-001

- Title: Fast Fiction Factory Asset / Rights Readiness Packet
- Purpose: Convert the Product Owner-accepted 19-shot composition into one requirement-level material plan while separating creative fit, stored provenance, live source readback, license evidence, future suitability, risk, and Owner decision.
- Primary file: `artifacts/asset-rights-readiness-packet/asset-rights-readiness.html`
- Package directory: `artifacts/asset-rights-readiness-packet/` (9 files; no raster)
- Review doc/result: `docs/review/asset-rights-readiness-packet.md`, `artifacts/asset-rights-readiness-packet-result.json`
- Visual evidence: `artifacts/review-screens/asset-rights-readiness-packet-900x1200-dark.png`, `artifacts/review-screens/asset-rights-readiness-packet-1280x900-light.png`
- Scope: 19 shots / 14 requirements / 28 canonical references / 36 aliases / 42 assignments / 7 asset classes.
- Recommended plan: 9 deterministic originals / 3 replacement candidates / 1 Owner-may-consider local proxy / 1 reference-only future lane; exception `AR-PROP-02`.
- Evidence: 28 complete stored metadata records; 20 confirmed / 8 unavailable bounded source readbacks; unavailable is not a rights conclusion.
- Read-only validation: `node tools/fff-state.mjs validate-asset-rights-readiness-packet artifacts/asset-rights-readiness-packet-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-asset-rights-readiness-packet artifacts/asset-rights-readiness-packet-result.json`; no live source checks or screenshot capture.
- State: H0 green; Owner material decisions unselected; production selection, rights decision, construction, generation, render, publication, database, and final story authority remain closed.

## fff-integrated-visual-production-package-001

- Title: Fast Fiction Factory Integrated Visual Production Package
- Purpose: Integrate the exact accepted composition identity for all six Beats and nineteen source shots into one local whole-story reference object without changing or copying predecessor source rasters.
- Primary file: `artifacts/integrated-visual-production-package/integrated-visual-production-package.html`
- Package directory: `artifacts/integrated-visual-production-package/` (README, standalone HTML, canonical JSON, four CSV exports, nineteen-cell contact sheet, and integrity manifest)
- Review doc/result: `docs/review/integrated-visual-production-package.md`, `artifacts/integrated-visual-production-package-result.json`
- Visual evidence: `artifacts/review-screens/integrated-visual-production-package-900x1200-dark.png`, `artifacts/review-screens/integrated-visual-production-package-1280x900-light.png`, `artifacts/integrated-visual-production-package/integrated-visual-production-package-contact-sheet.jpg`
- Sequence contract: exactly 6 Beats / 19 shots / 180 seconds / grouping `3 / 3 / 3 / 3 / 4 / 3`; exact source timing, ownership, main/support visuals, composition fields, and truth boundaries.
- Reference contract: 28 unique SHA256 identities / 36 aliases / 42 assignments / 0 missing / 0 mismatch / 0 copied predecessor rasters / 0 selected assets / 0 rights-clearance claims.
- Continuity contract: five exact lineages for bellless tower, brass moth, Council, ledger, and time, with no new story conclusion.
- Human policy: Product Owner formal reviewer; integration review none; next review `owner_whole_story_composition_review`; per-Beat review discontinued; no human review performed in this slice.
- Read-only validation: `node tools/fff-state.mjs validate-integrated-visual-production-package artifacts/integrated-visual-production-package-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-integrated-visual-production-package artifacts/integrated-visual-production-package-result.json` writes integration-owned text/HTML/CSV/JSON/manifest/result only and preserves the existing contact sheet unless it is absent.
- State: Local/reference-only H0. Production selection, rights clearance, provider/API, generation, engine/voice, render, upload/publication, database, production approval, final canon, and external reproducibility remain closed.

## fff-composition-expansion-wave2-001

- Title: Fast Fiction Factory Composition Expansion Wave 2
- Purpose: Make the exact Beat 5 and Beat 6 source shots concrete with licensed local raster references while preserving source story, timing, truth, rights, selection, and canon states.
- Primary file: `artifacts/composition-expansion-wave2/composition-expansion-wave2.html`
- Package directory: `artifacts/composition-expansion-wave2/` (README, standalone HTML, canonical JSON, two CSV inventories, four normalized new JPEG references, contact sheet, and integrity manifest)
- Review doc/result: `docs/review/composition-expansion-wave2.md`, `artifacts/composition-expansion-wave2-result.json`
- Visual evidence: `artifacts/review-screens/composition-expansion-wave2-900x1200-dark.png`, `artifacts/review-screens/composition-expansion-wave2-1280x900-light.png`, `artifacts/composition-expansion-wave2/composition-expansion-wave2-contact-sheet.jpg`
- Composition contract: exactly Beats 5/6 / seven source shots / 75 seconds / seven distinct composition classes / 2–3 images per shot / sixteen total assignments.
- Reference contract: four newly acquired licensed local rasters plus eight inherited exact-identity references; twelve total references; full provenance/dimension/hash/borrowing-boundary metadata; all reference-only, unselected, not rights-cleared, and not AI-generated.
- Owner policy: Wave 2 human review none; no post-Wave-2 human gate; per-Beat blind review discontinued; next human review is `after_integrated_19_shot_visual_package`.
- Read-only validation: `node tools/fff-state.mjs validate-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json` writes only the Wave 2 manifest and result; acquired JPEGs and predecessor files remain immutable.
- State: Preserved local/reference-only H0 source beneath `fff-integrated-visual-production-package-001`. Production selection, rights clearance, generation, render, publication, database, production approval, canon, and external reproducibility remain closed.

## fff-composition-expansion-wave1-001

- Title: Fast Fiction Factory Composition Expansion Wave 1
- Purpose: Make the exact Beat 1 and Beat 3 source shots concrete with licensed local raster references while preserving source story, timing, truth, rights, selection, and canon states.
- Primary file: `artifacts/composition-expansion-wave1/composition-expansion-wave1.html`
- Package directory: `artifacts/composition-expansion-wave1/` (19 files including manifest, twelve normalized local JPEG references, and contact sheet)
- Source artifacts: Beat 2 Board, Beat 4 Counterexample, Visual Treatment, Storyboard, Execution, Operator Brief, Blueprint, Derivative, Revision, and Handoff packages remain byte-identical.
- Review doc/result: `docs/review/composition-expansion-wave1.md`, `artifacts/composition-expansion-wave1-result.json`
- Visual evidence: `artifacts/review-screens/composition-expansion-wave1-900x1200-dark.png`, `artifacts/review-screens/composition-expansion-wave1-1280x900-light.png`, `artifacts/composition-expansion-wave1/composition-expansion-wave1-contact-sheet.jpg`
- Composition contract: exactly Beats 1 and 3 / six source shots / 50 seconds / six distinct composition classes / one unique main plus one support per shot / twelve total assignments.
- Reference contract: 12 distinct local rasters with complete creator, source page, original media, license, retrieval date, original/normalized dimensions, path, SHA256, and use metadata; all reference-only, unselected, not rights-cleared, and not AI-generated.
- Owner policy: Beat 4 is `OWNER_REVIEW_PASS` with observation「大きな破綻はなさそう」; expansion is authorized, per-Beat blind review is discontinued, Wave 1 has no human gate, and the next human review follows complete 19-shot integration.
- Read-only validation: `node tools/fff-state.mjs validate-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json` writes only the new manifest and result; it does not rewrite acquired JPEGs.
- State: Local/reference-only H0. Beats 1–4 now have 12/19 concrete compositions. Beats 5/6, final integration, production selection, rights clearance, generation, render, publication, database, production approval, canon, and external reproducibility remain closed.

## fff-beat4-composition-counterexample-001

- Title: Fast Fiction Factory Beat 4 Composition Counterexample
- Purpose: Test Beat 2 composition-transfer evidence against the exact three-shot Beat 4 slice without claiming full-story generalization.
- Primary file: `artifacts/beat4-composition-counterexample/beat4-composition-counterexample.html`
- Package directory: `artifacts/beat4-composition-counterexample/` (14 files including manifest, six local JPEG references, contact sheet, and unfilled H1 guide)
- Source artifacts: `fff-beat2-composition-board-001`, `fff-beat2-visual-treatment-pilot-001`, `fff-production-storyboard-brief-001`, `fff-production-execution-pack-001` (byte-protected)
- Review doc/result: `docs/review/beat4-composition-counterexample.md`, `artifacts/beat4-composition-counterexample-result.json`
- Visual evidence: `artifacts/review-screens/beat4-composition-counterexample-900x1200-dark.png`, `artifacts/review-screens/beat4-composition-counterexample-1280x900-light.png`, `artifacts/beat4-composition-counterexample/beat4-composition-counterexample-contact-sheet.jpg`
- Composition contract: exactly 3 shots / 25 seconds / three distinct classes; Shot 2 is 50/50 with equal 22px headings, Shot 1 identifies no official and implies no guilt, Shot 3 resolves no motive or responsibility.
- Reference contract: 6 distinct local rasters / 7 assignments with full creator/source/media/license/dimension/hash metadata; all reference-only, unselected, and without a rights-clearance claim.
- Read-only validation: `node tools/fff-state.mjs validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json`
- State: H0 package implemented; H1 guide unperformed/unfilled. Full-story expansion, selection, rights, generation, render, publication, database, approval, and canon remain closed.

## fff-beat2-composition-board-001

- Title: Fast Fiction Factory Beat 2 Composition Board
- Purpose: Move the exact three-shot Beat 2 slice from atmosphere references to concrete, image-based crop/focus/depth/placement decisions without opening generation or production gates.
- Primary file: `artifacts/beat2-composition-board/beat2-composition-board.html`
- Package directory: `artifacts/beat2-composition-board/` (13 files including six normalized image copies and one contact sheet)
- Source artifacts: `fff-beat2-visual-treatment-pilot-001`, `fff-production-storyboard-brief-001`, `fff-production-execution-pack-001` (all byte-identical)
- Review doc/result: `docs/review/beat2-composition-board.md`, `artifacts/beat2-composition-board-result.json`
- Visual evidence: `artifacts/review-screens/beat2-composition-board-900x1200-dark.png`, `artifacts/review-screens/beat2-composition-board-1280x900-light.png`, `artifacts/beat2-composition-board/beat2-composition-board-contact-sheet.jpg`
- Composition contract: exactly 3 shots; one main and one or two supporting images per shot; crop frame, two focal points, eye path, foreground/midground/background, and five required execution fields per shot.
- Reference contract: 6 distinct locally stored licensed rasters / 7 shot assignments. The moth reference recurs across Shot 2/3 under one ID and is not counted as a new distinct asset.
- Read-only validation: `node tools/fff-state.mjs validate-beat2-composition-board artifacts/beat2-composition-board-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-beat2-composition-board artifacts/beat2-composition-board-result.json` regenerates the package manifest and result after validating the fixed board and binary copies.
- State: H0 green only with 22/22 fail-closed probes, two measured viewports, main-image visual share above 50%, equal-height columns, no nested/horizontal overflow, light print evidence, complete provenance, and source immutability. H1 composition transfer review is next; 19-shot expansion, selection, rights, generation, render, publication, database, and canon remain closed.

## fff-beat2-visual-treatment-pilot-001

- Title: Fast Fiction Factory Beat 2 Visual Treatment Pilot
- Purpose: Test whether six real licensed local raster references make the exact three-shot Beat 2 visual treatment concrete enough for a separate creator without changing accepted planning or execution sources.
- Primary file: `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html`
- Package directory: `artifacts/beat2-visual-treatment-pilot/` (13 files including six references and one contact sheet)
- Source artifacts: `fff-production-storyboard-brief-001`, `fff-production-execution-pack-001`, `fff-editorial-derivative-preview-001`
- Review doc/result: `docs/review/beat2-visual-treatment-pilot.md`, `artifacts/beat2-visual-treatment-pilot-result.json`
- Visual evidence: `artifacts/review-screens/beat2-visual-treatment-900x1200-dark.png`, `artifacts/review-screens/beat2-visual-treatment-1280x900-light.png`, `artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment-contact-sheet.jpg`
- Reference contract: exactly 3 shots, 6 local licensed rasters, 2 references per shot; full creator/source/license/dimension/hash provenance; all reference-only, unselected, and without a rights-clearance claim.
- Read-only validation: `node tools/fff-state.mjs validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json`
- State: H0 validated with 24/24 fail-closed probes, exact source preservation, two browser viewports, Auto/theme/layout evidence, print-style evidence, and manifest integrity. H1 human visual-treatment review is next; production selection and rights clearance remain closed.

## fff-production-execution-pack-001

- Title: Fast Fiction Factory Production Execution Pack
- Purpose: Put the accepted 180-second / six-beat / 19-shot contract, generic reusable asset requirements, and engine-neutral synthetic-narration timing state into one portable handoff for another creator.
- Primary file: `artifacts/production-execution-pack/production-execution-pack.html` (standalone, print-friendly, document-only scrolling)
- Package directory: `artifacts/production-execution-pack/`
- Package files: `README_PRODUCTION_EXECUTION.md`, `production-execution-pack.html`, `production-execution-pack.json`, `beat-run-sheet.csv`, `shot-execution-sheet.csv`, `asset-requirements.csv`, `narration-timing-envelope.csv`, `thumbnail-requirements.md`, `production-execution-manifest.json`
- Review doc/result: `docs/review/production-execution-pack.md`, `artifacts/production-execution-pack-result.json`
- Published product commit: `fc897afbb6b91a3b76766db98d86e2aedc448017 Add production execution pack`; pushed to `origin/master` with clean parity `0 0` before the successor restart-context commit
- Cross-terminal restart: pull `origin/master`, read `docs/review/next-terminal-handoff.md`, run the root manifest's read-only validation command, then open the standalone primary file
- Visual evidence: `artifacts/review-screens/production-execution-pack-900x1200.png`, `artifacts/review-screens/production-execution-pack-1280x900.png`; both measured viewports have no horizontal overflow, no nested scroll owner, and a complete first-view contract. Exact measurements and hashes are authoritative in the result and root manifest.
- Source chain: `fff-operator-production-brief-typography-balance-001`, `fff-operator-production-brief-001`, `fff-content-production-blueprint-001`, `fff-editorial-derivative-preview-001`, `fff-editorial-revision-roundtrip-001`, `fff-bridge-editorial-handoff-pack-001` (all preserved below).
- Execution contract: exactly 180 seconds / 6 beats / 19 shots / 20 subtitle cues / 6 narration segments / 3 thumbnail directions; 14 deduplicated generic asset requirements; every shot references at least one requirement.
- Narration timing: intended `voice_mode=synthetic`; B1, B3, B4, and B6 are `proxy_headroom_confirmed` with 3–5 seconds of observed human-proxy slack and derived ranges 15–17, 25–27, 20–22, and 20–22 seconds; B2 and B5 remain `existing_pass_unmeasured`.
- Closed choices: `engine_selected=false`, `voice_selected=false`, `audio_generated=false`, `human_articulation_check_required=false`, and `engine_calibration_pending=true`; generic requirements remain `unselected` / `not_reviewed` with provenance required, while protected source-shot rights remain `not_cleared`.
- Read-only validation: `node tools/fff-state.mjs validate-production-execution-pack artifacts/production-execution-pack-result.json`
- Intentional regeneration only: `node tools/fff-state.mjs smoke-production-execution-pack artifacts/production-execution-pack-result.json artifacts/production-execution-pack-result.json`; it may write only the nine new package files and its result.
- State: H0 validated. The read-only result is green with 20/20 fail-closed probes, 34 protected package files and 68 historical results unchanged, both required viewports measured, and print utilities hidden. H1 is now a human execution-readiness review; actual engine calibration, real asset sourcing, rights review, media production, provider/API, render, upload, publication, database, and canon remain gated.

## fff-operator-production-brief-typography-balance-001

- Title: Fast Fiction Factory Operator Production Brief Typography Balance
- Purpose: Preserve the accepted Operator Brief while reducing the oversized main story title and rebalancing the responsive first-view hierarchy without changing wording, structure, package content, or production boundaries.
- Source artifact: `fff-operator-production-brief-001` (preserved below)
- Primary route: `public/review/index.html?mode=blueprint`
- Human observation: H1 comprehension passed judgment A; the only requested repair was the visually oversized main story title.
- Review doc/result: `docs/review/operator-production-brief-typography-balance.md`, `artifacts/operator-production-brief-typography-balance-result.json`
- Visual evidence: `artifacts/review-screens/operator-production-brief-typography-balance-900x1200.png`, `artifacts/review-screens/operator-production-brief-typography-balance-1280x900.png`
- Responsive evidence: at 900x1200 the title is 40px / 43.2px line-height, 2 lines, 86.375px high, viewport ratio 0.07197916666666666, body 17px, title/body 2.3529411764705883, metric 22px, section heading 26px, and first-view bottom 837.640625px; at 1280x900 it is 48px / 51.84px, 2 lines, 103.65625px high, viewport ratio 0.11517361111111112, body 17.28px, title/body 2.7777777777777777, metric 28px, section heading 33.92px, and first-view bottom 803.359375px.
- First-view integrity: all five completion conditions remain visible at both viewports; horizontal overflow, nested scroll owners, overlap, clipping, and orphan single-character lines are all 0.
- Content/package integrity: primary visible-text SHA256 `8dd887dcfbb6d68cddb7ae00d46a94878b90ba73f6390f05f1247b6e849c60e8`; primary HTML SHA256 `0c977a8ab17857e151218ea72f6700d34cbf49311c38b496247a027b373e93d1`; protected-package aggregate SHA256 `396736ea631f1964edd317b922ce985cbe6cde80240d98801eaab96d464d7b95`; historical-result aggregate SHA256 `372a0088c16af8cd4c11748c568932e558911ec89e03cfc9df31480a9106183b`.
- Read-only validation: `node tools/fff-state.mjs validate-operator-production-brief-typography-balance artifacts/operator-production-brief-typography-balance-result.json`
- Intentional result regeneration only: `node tools/fff-state.mjs smoke-operator-production-brief-typography-balance artifacts/operator-production-brief-typography-balance-result.json artifacts/operator-production-brief-typography-balance-result.json`
- State: Typography-only repair complete from base HEAD `89197c9` and preserved as a source for `fff-production-execution-pack-001`. The later pack records the four human readings as proxy headroom and adds generic execution requirements without selecting assets or opening production, rights, provider, generation, render, upload, publication, database, canon, content, order, or source-package boundaries.

## fff-operator-production-brief-001

- Title: Fast Fiction Factory Operator Production Brief
- Purpose: Translate the protected quantitative Blueprint into a plain-language, single-scroll production instruction for a non-specialist.
- Primary route: `public/review/index.html?mode=blueprint` (reused; no new mode)
- Source artifact/package: `fff-content-production-blueprint-001`, `artifacts/production-blueprint/` (all eight files byte-protected)
- Human package: `artifacts/operator-production-brief/` with `README_OPERATOR_BRIEF.md`, `operator-production-brief.json`, `beat-story-map.csv`, `visual-grammar-guide.md`, `operator-completion-checklist.md`, `operator-brief-manifest.json`
- Review doc/result: `docs/review/operator-production-brief.md`, `artifacts/operator-production-brief-result.json`
- Visual evidence: `artifacts/review-screens/operator-production-brief-900x1200.png`, `artifacts/review-screens/operator-production-brief-1280x900.png`
- Information architecture: compact Blueprint-only Focus Shell; exactly four primary sections; one browser document scroll; six-beat continuous spine; one expanded beat; five shot-scale and six camera-motion explanations with 11 inline SVG diagrams; 19 human-readable shot summaries; five observable completion conditions; one closed Audit & Files.
- Read-only validation: `node tools/fff-state.mjs validate-operator-production-brief artifacts/operator-production-brief-result.json`
- Intentional regeneration: `node tools/fff-state.mjs smoke-operator-production-brief artifacts/operator-production-brief-result.json artifacts/operator-production-brief-result.json`
- State: Preserved human-facing source for Typography Balance and `fff-production-execution-pack-001`. H1 comprehension passed judgment A; the later execution overlay closes the four density warnings as human-proxy headroom and maps generic asset needs, while real asset selection, rights, provider, generation, render, upload, publication, database, final canon, and old workflow branch work remain deferred or closed.

## fff-content-production-blueprint-001

- Title: Fast Fiction Factory Content Production Blueprint
- Purpose: Convert the accepted three-wording derivative baseline into a quantitative, operator-readable planning contract without mutating its source or opening generation, production, rights, or canon gates.
- Review UI: `public/review/index.html`
- Primary route: `public/review/index.html?mode=blueprint`
- Source routes: `public/review/index.html?mode=derivative`, `public/review/index.html?mode=revision`, `public/review/index.html?mode=handoff`, `public/review/index.html?mode=bridge`, `public/review/index.html?mode=brief`
- Package directory: `artifacts/production-blueprint/`
- Package files: `README_BLUEPRINT.md`, `production-blueprint.json`, `beat-specs.csv`, `shot-specs.csv`, `subtitle-metrics.csv`, `visual-system.md`, `acceptance-matrix.csv`, `blueprint-package-manifest.json`
- Review doc: `docs/review/content-production-blueprint.md`
- Readback result: `artifacts/content-production-blueprint-result.json`
- Visual evidence target: `artifacts/review-screens/content-production-blueprint.png`
- Source artifact: `fff-editorial-derivative-preview-001`
- Source fingerprints: derivative core `94729bb099e0f99eb8ac1170b8a4b5e3694c9970df3149552f8efcd53fceda44`, `editorial-handoff.derived.json=15a695b7336ce55f520878cb9a26a35d47994fa176ef57ac55bf231a9cc0b51c`, accepted patch `ded0174232dabf9d78d645836e24455152bd418eff2e49b6f4f2509066478885`
- Planning profile: `1920x1080`, `16:9`, `30fps`, `status=provisional_review_profile`, `render_authorized=false`, `vertical_export_authorized=false`
- Structural contract: exactly 6 beats / 180 seconds / 6 narration segments / 20 subtitle cues / 19 shots / 3 thumbnail directions; all LOCKED fields preserved, all BOUNDED fields controlled and measurable, and FREE fields limited to non-semantic micro-detail.
- Utility ownership: one collapsed Change History owner, one collapsed Files / Export owner, and no primary duplicate Before/After diff; the utility anchor may move no more than 8 CSS pixels across all six beats at the tested approximately 900x1200 viewport.
- Launchers: `.\scripts\operator\open_review.ps1 -Mode blueprint`, `./scripts/operator/open_review.sh --mode blueprint`; print-only checks use `-PrintUri` / `--print-uri`.
- State validator: `tools/fff-state.mjs`
- Read-only validation: `node tools/fff-state.mjs validate-content-production-blueprint artifacts/content-production-blueprint-result.json`
- Intentional package/result regeneration: `node tools/fff-state.mjs smoke-content-production-blueprint artifacts/content-production-blueprint-result.json artifacts/content-production-blueprint-result.json`
- Write boundary: validation writes nothing; smoke may write only the eight Blueprint package files and `artifacts/content-production-blueprint-result.json`. Handoff, Revision, Derivative, and historical result artifacts remain protected.
- State: Local quantitative planning surface only. The three wording changes are a provisional working baseline; the Blueprint is not canonical, production-approved, rights-cleared, asset-selected, rendered, uploaded, published, or persisted to a database.

## fff-editorial-derivative-preview-001

- Title: Fast Fiction Factory Editorial Derivative Preview
- Purpose: Apply exactly three accepted safe wording changes to a complete derived copy while preserving the source Handoff and Revision packages byte-for-byte.
- Review UI: `public/review/index.html`
- Primary route: `public/review/index.html?mode=derivative`
- Source routes: `public/review/index.html?mode=revision`, `public/review/index.html?mode=handoff`
- Return route: `public/review/index.html?mode=brief`
- Package directory: `artifacts/editorial-derivative/`
- Package files: `README_DERIVATIVE.md`, `narration-script.derived.md`, `subtitle-cues.derived.csv`, `shot-list.derived.csv`, `editorial-handoff.derived.json`, `applied-revision-patch.json`, `derivative-provenance.json`, `derivative-package-manifest.json`
- Review doc: `docs/review/editorial-derivative-preview.md`
- Readback result: `artifacts/editorial-derivative-preview-result.json`
- Visual evidence target: `artifacts/review-screens/editorial-derivative-preview.png`
- Source artifact: `fff-bridge-editorial-handoff-pack-001`
- Source fingerprints: `editorial-handoff.json=c818d81a0d87796a8d61e7d16ff0448a9feb5422b6ee3e0d2989cebd907b3080`, `package-manifest.json=ffad571ed4abeb46e7d2b5f61f33f3fa4703173b3f8da2318e5d1c7248772971`
- Patch: `revision-patch-example-001`, SHA256 `ded0174232dabf9d78d645836e24455152bd418eff2e49b6f4f2509066478885`
- Derived contract: `status=derived_revision_preview`, `canonical=false`, `source_apply_status=not_applied`, `derived_apply_status=applied_to_derived_copy`, `application_scope=derived_copy_only`, `rollback_action=discard_derived_package`
- Exact authored deltas: `narration-b01.text`, `sub-b02-03.text_ja`, `shot-b03-03.visual_direction`; narration character metadata recalculates from 93 to 94 and total from 777 to 778.
- Counts preserved: 6 beats / 180 seconds / 6 narration segments / 20 subtitle cues / 19 shot cues / 3 thumbnail directions.
- Launchers: `.\scripts\operator\open_review.ps1 -Mode derivative`, `./scripts/operator/open_review.sh --mode derivative`; print-only checks use `-PrintUri` / `--print-uri`.
- State validator: `tools/fff-state.mjs`
- Read-only validation: `node tools/fff-state.mjs validate-editorial-derivative-preview artifacts/editorial-derivative-preview-result.json`
- Intentional package/result regeneration: `node tools/fff-state.mjs smoke-editorial-derivative-preview artifacts/editorial-derivative-preview-result.json artifacts/editorial-derivative-preview-result.json`
- State: Local derived preview only. It is not canonical, approved, rights-cleared, production-ready, or applied to the source; discard the derivative package to roll back.

## fff-editorial-revision-roundtrip-001

- Title: Fast Fiction Factory Editorial Revision Roundtrip
- Purpose: Return structured editorial feedback through a guarded request, before/after diff, decision, and unapplied safe-only patch without mutating the source Handoff package.
- Review UI: `public/review/index.html`
- Primary route: `public/review/index.html?mode=revision`
- Source route: `public/review/index.html?mode=handoff`
- Preserved routes: `public/review/index.html?mode=bridge`, `public/review/index.html?mode=brief`
- Package directory: `artifacts/editorial-revision/`
- Package files: `README_REVISION.md`, `revision-request-template.json`, `revision-request.example.json`, `revision-decision.example.json`, `revision-patch.example.json`, `revision-roundtrip-manifest.json`
- Review doc: `docs/review/editorial-revision-roundtrip.md`
- Readback result: `artifacts/editorial-revision-roundtrip-result.json`
- Visual evidence: `artifacts/review-screens/editorial-revision-roundtrip.png` (885x1180 content capture from a 900x1200 viewport override, 155441 bytes, SHA256 `19C109123FA811B64DF7D6F417AD2ADF9B338491252ACD554191E307F90C82F9`)
- Source artifact: `fff-bridge-editorial-handoff-pack-001`
- Source fingerprints: `editorial-handoff.json=c818d81a0d87796a8d61e7d16ff0448a9feb5422b6ee3e0d2989cebd907b3080`, `package-manifest.json=ffad571ed4abeb46e7d2b5f61f33f3fa4703173b3f8da2318e5d1c7248772971`
- Deterministic contract: 6 changes / guard `3 safe, 1 human, 2 blocked` / decisions `3 accept, 1 hold, 2 reject` / patch 3 safe changes / `apply_status=not_applied`
- Launchers: `.\scripts\operator\open_review.ps1 -Mode revision`, `./scripts/operator/open_review.sh --mode revision`; print-only checks use `-PrintUri` / `--print-uri`
- State validator: `tools/fff-state.mjs`
- Read-only validation: `node tools/fff-state.mjs validate-editorial-revision-roundtrip artifacts/editorial-revision-roundtrip-result.json`
- Intentional manifest/result regeneration: `node tools/fff-state.mjs smoke-editorial-revision-roundtrip artifacts/editorial-revision-roundtrip-result.json artifacts/editorial-revision-roundtrip-result.json`
- Review status: `ready_for_local_revision_review`
- State: Active local roundtrip. The source package remains immutable; timing/order, truth/canon, asset/rights, provider/API, credentials, generation, render, upload, publication, and database boundaries remain closed.

## fff-bridge-editorial-handoff-pack-001

- Title: Fast Fiction Factory Bridge Editorial Handoff Pack
- Purpose: Convert the six-beat Bridge Storyboard Flow into a local manual-delivery package with aligned provisional narration, subtitle timing, shot timing, truth/rights guards, and portable integrity metadata.
- Review UI: `public/review/index.html`
- Primary route: `public/review/index.html?mode=handoff`
- Source route: `public/review/index.html?mode=bridge`
- Return route: `public/review/index.html?mode=brief`
- Package directory: `artifacts/editorial-handoff/`
- Package files: `README_DELIVERY.md`, `narration-script.md`, `subtitle-cues.csv`, `shot-list.csv`, `editorial-handoff.json`, `package-manifest.json`
- Review doc: `docs/review/bridge-editorial-handoff-pack.md`
- Readback result: `artifacts/bridge-editorial-handoff-pack-result.json`
- Visual evidence: `artifacts/review-screens/bridge-editorial-handoff-pack.png` (900x1200, 141616 bytes, SHA256 `CB72EB10A02EB0E4E6BE21D19B7A0D515D3C92756915C5F5446ACE6387ECE7E2`)
- Source artifact: `fff-bridge-storyboard-flow-001`
- Preserved artifacts: `fff-review-workbench-component-contract-001`, `fff-draft-to-video-planning-bridge-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-contradictory-claim-guard-001`
- Candidate/channel: `designer-content-moth-investigation-3m` / `designer-channel-mystery-lore`
- Editorial contract: exactly 6 beats / 180 seconds / 6 narration segments / 20 subtitle cues / 19 shot cues / 3 thumbnail directions / all shots `asset_status=unselected`
- State validator: `tools/fff-state.mjs`
- Read-only validation command: `node tools/fff-state.mjs validate-bridge-editorial-handoff-pack artifacts/bridge-editorial-handoff-pack-result.json`
- Intentional metadata/result regeneration: `node tools/fff-state.mjs smoke-bridge-editorial-handoff-pack artifacts/bridge-editorial-handoff-pack-result.json artifacts/bridge-editorial-handoff-pack-result.json`
- Review status: `ready_for_local_manual_delivery`
- State: Preserved immutable source package for `fff-editorial-revision-roundtrip-001`. All prose remains `provisional_editorial_draft`; Toma fate, brass moth truth/function, Council motive, and ending truth remain unresolved; provider/API, credentials, generation, render, upload, database, rights clearance, and final canon remain closed.

## fff-bridge-storyboard-flow-001

- Title: Fast Fiction Factory Bridge Storyboard Flow
- Purpose: Put one six-beat Japanese-first Storyboard Flow first on the local Bridge route so narration, subtitle, visual intent, held truth, and rights notes can be reviewed beat by beat without opening production or canon gates.
- Repo relative path: `public/review/index.html`
- Primary route: `public/review/index.html?mode=bridge`
- Return route: `public/review/index.html?mode=brief`
- Review doc: `docs/review/bridge-storyboard-flow.md`
- Readback result: `artifacts/bridge-storyboard-flow-result.json`
- Visual evidence: `artifacts/review-screens/bridge-storyboard-flow.png` (900x1200, 185233 bytes, SHA256 `64626FD09CE077AEFBE9D0A42212197247CE464CEC9925E2D337BF1C481614AC`)
- Preserved source artifact: `fff-review-workbench-component-contract-001`
- Preserved Bridge artifacts: `fff-draft-to-video-planning-bridge-001`, `fff-bridge-refinement-overview-ribbon-001`
- Story sources: `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Read-only validation command: `node tools/fff-state.mjs validate-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json`
- Intentional regeneration command: `node tools/fff-state.mjs smoke-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json artifacts/bridge-storyboard-flow-result.json`
- Operator observation: accepted; `OPERATOR_FIRST` closed; `BRIDGE_STORYBOARD_FLOW` selected because the Workbench was accepted while the lower page remained long and dense.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active local planning checkpoint. Exactly six beats are shown through a compact rail and one active canvas; former Bridge decision/refinement/detail surfaces remain preserved in collapsed supporting evidence. Provider/API, credentials, AI video, render, upload, database persistence, rights clearance, and final canon remain closed.

## fff-review-workbench-component-contract-001

- Title: Fast Fiction Factory Review Workbench Component Contract
- Purpose: Convert the default `brief` first screen from a card-like applied shell into a role-contracted Review Workbench with single framing owner, compact route navigation, bounded Context Dock, duplication budget, and component complement rule.
- Repo relative path: `public/review/index.html`
- Primary default route: `public/review/index.html?mode=brief`
- Preserved Layout Lab route: `public/review/index.html?mode=layout-lab`
- Preserved Bridge route: `public/review/index.html?mode=bridge`
- Review doc: `docs/review/review-workbench-component-contract.md`
- Readback result: `artifacts/review-workbench-component-contract-result.json`
- Screenshot evidence: `artifacts/review-screens/brief-component-contract-workbench.png`
- Source artifact: `fff-apply-decision-shell-guard-diet-001`
- Preserved artifacts: `fff-layout-lab-visual-audit-001`, `fff-layout-research-decision-shell-001`, `fff-low-text-decision-console-001`, `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Read-only validation command: `node tools/fff-state.mjs validate-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json`
- Artifact-regeneration command: `node tools/fff-state.mjs smoke-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json artifacts/review-workbench-component-contract-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active local review package. The `brief` route now starts with a Workbench Canvas: process rail only, active decision only, Context Dock only, and Evidence / Notes / Inspiration / Guard drawers below. The first-screen duplication budget passes with candidate ID 1, channel ID 1, provider/API outside Guard 0, final canon outside Guard 0, and competing global heading count 0. Provider/API, credentials, upload, AI video generation, production render, database persistence, final canon, and rights-clearance claims remain closed.

## fff-apply-decision-shell-guard-diet-001

- Title: Fast Fiction Factory Apply Decision Shell Guard Diet
- Purpose: Apply the split-pane Decision Shell to the default `brief` route while keeping Bridge, Layout Lab evidence, Guided Flow, and production boundaries preserved.
- Repo relative path: `public/review/index.html`
- Primary default route: `public/review/index.html?mode=brief`
- Preserved Layout Lab route: `public/review/index.html?mode=layout-lab`
- Preserved Bridge route: `public/review/index.html?mode=bridge`
- Review doc: `docs/review/apply-decision-shell-guard-diet.md`
- Readback result: `artifacts/apply-decision-shell-guard-diet-result.json`
- Screenshot evidence: `artifacts/review-screens/brief-decision-shell-applied.png`
- Source artifact: `fff-layout-lab-visual-audit-001`
- Preserved artifacts: `fff-layout-research-decision-shell-001`, `fff-low-text-decision-console-001`, `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-apply-decision-shell-guard-diet artifacts/apply-decision-shell-guard-diet-result.json artifacts/apply-decision-shell-guard-diet-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active local review package. The `brief` route now starts with the applied Decision Shell, renders choices/steps/context/pins/notices/locks/next action from `decisionFlowModel`, caps visible dock rows with overflow in the Guard drawer, keeps true production gates compact through `safetyGateRegistry`, and leaves provider/API, credentials, upload, AI video generation, production render, final canon, database persistence, and rights-clearance claims closed.

## fff-layout-lab-visual-audit-001

- Title: Fast Fiction Factory Layout Lab Visual Audit
- Purpose: Package local browser screenshot evidence for the Layout Research Lab before applying the split-pane Decision Shell to `brief`.
- Repo relative path: `public/review/index.html`
- Direct research route: `public/review/index.html?mode=layout-lab`
- Preserved default route: `public/review/index.html?mode=brief`
- Preserved Bridge route: `public/review/index.html?mode=bridge`
- Review doc: `docs/review/layout-lab-visual-audit.md`
- Readback result: `artifacts/layout-lab-visual-audit-result.json`
- Screenshot evidence: `artifacts/review-screens/layout-lab.png`, `artifacts/review-screens/layout-lab-decision-shell.png`, `artifacts/review-screens/brief-preserved.png`, `artifacts/review-screens/bridge-preserved.png`
- Contact sheet: `artifacts/layout-lab-visual-audit-contact-sheet.png`
- Source artifact: `fff-layout-research-decision-shell-001`
- Preserved artifacts: `fff-low-text-decision-console-001`, `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-layout-lab-visual-audit artifacts/layout-lab-visual-audit-result.json artifacts/layout-lab-visual-audit-result.json`
- Review status: `ready_for_visual_review`
- Review input mode: `freeform`
- State: Active local visual audit package. Playwright opened `layout-lab`, `brief`, and `bridge` through the local Microsoft Edge channel, captured four screenshots plus a contact sheet, and keeps the Decision Shell as a research recommendation only. Provider/API, credentials, upload, AI video generation, production render, final canon, database persistence, and rights-clearance claims remain closed.

## fff-layout-research-decision-shell-001

- Title: Fast Fiction Factory Layout Research Decision Shell
- Purpose: Compare layout families and add a local Layout Research Lab before applying another UI refinement to `brief`.
- Repo relative path: `public/review/index.html`
- Direct research route: `public/review/index.html?mode=layout-lab`
- Preserved default route: `public/review/index.html?mode=brief`
- Preserved Bridge route: `public/review/index.html?mode=bridge`
- Review doc: `docs/review/layout-research-decision-shell.md`
- Readback result: `artifacts/layout-research-decision-shell-result.json`
- Source artifact: `fff-low-text-decision-console-001`
- Preserved artifacts: `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-layout-research-decision-shell artifacts/layout-research-decision-shell-result.json artifacts/layout-research-decision-shell-result.json`
- Review status: `ready_for_local_wireframe_review`
- Review input mode: `freeform`
- State: Active local layout research checkpoint. The Lab shows Card-first/current baseline, Briefing Inbox, Split-pane Decision Shell, and Storyboard Flow wireframes, recommends the split-pane Decision Shell, includes a heuristic score matrix, and renders the Decision Shell choice slot from `decisionFlowModel`. Provider/API, credentials, upload, AI video generation, production render, final canon, database persistence, and rights-clearance claims remain closed.

## fff-low-text-decision-console-001

- Title: Fast Fiction Factory Low-text Decision Console
- Purpose: Make `public/review/index.html?mode=brief` start with one low-text route decision instead of lecture-note style guidance, while preserving Guided Flow, Latest Overview, Bridge refinement, Home Cockpit shelves, Evidence Vault optionality, dark mode, selected candidate/channel IDs, and closed production gates.
- Repo relative path: `public/review/index.html`
- Primary default route: `public/review/index.html?mode=brief`
- Compatibility alias route: `public/review/index.html?mode=home`
- Primary Bridge route: `public/review/index.html?mode=bridge`
- Review doc: `docs/review/low-text-decision-console.md`
- Readback result: `artifacts/low-text-decision-console-result.json`
- Source artifacts: `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-low-text-decision-console artifacts/low-text-decision-console-result.json artifacts/low-text-decision-console-result.json`
- Review status: `ready_for_user_visual_review`
- Review input mode: `freeform`
- State: Active local review checkpoint; the first screen now starts with `この路線で進める？`, five short choices, one Bridge action, context chips, a six-step rail, closed detail/notes shelves, and a matching Bridge Decision Console. Provider/API, credentials, AI video generation, render, upload, final canon, database persistence, and rights-clearance claims remain closed.

## fff-guided-review-flow-workspace-001

- Title: Fast Fiction Factory Guided Review Flow Workspace
- Purpose: Make `public/review/index.html?mode=brief` start with a guided operator review flow, not a parallel card wall, while preserving the Latest Overview Report, Bridge refinement, Home Cockpit shelves, Evidence Vault optionality, dark mode, selected candidate/channel IDs, and closed production gates.
- Repo relative path: `public/review/index.html`
- Primary default route: `public/review/index.html?mode=brief`
- Compatibility alias route: `public/review/index.html?mode=home`
- Primary Bridge route: `public/review/index.html?mode=bridge`
- Review doc: `docs/review/guided-review-flow-workspace.md`
- Readback result: `artifacts/guided-review-flow-workspace-result.json`
- Source artifacts: `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-guided-review-flow-workspace artifacts/guided-review-flow-workspace-result.json artifacts/guided-review-flow-workspace-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved local review checkpoint beneath the Low-text Decision Console; it still provides Guided Review Flow, a six-step Decision Queue, one primary Bridge action, Pinned Tray, Operations Notice, Important Folders, and an Inspiration Workspace. The Bridge route keeps a matching guided sequence. Provider/API, credentials, AI video generation, render, upload, final canon, database persistence, and rights-clearance claims remain closed.

## fff-bridge-refinement-overview-ribbon-001

- Title: Fast Fiction Factory Bridge Refinement Overview Ribbon
- Purpose: Add a compact Latest Overview Report to the Home Cockpit, demote duplicate legacy Review Brief material, and refine the Draft-to-Video Bridge for the next human pre-production review.
- Repo relative path: `public/review/index.html`
- Primary default route: `public/review/index.html?mode=brief`
- Compatibility alias route: `public/review/index.html?mode=home`
- Primary Bridge route: `public/review/index.html?mode=bridge`
- Review doc: `docs/review/bridge-refinement-overview-ribbon.md`
- Readback result: `artifacts/bridge-refinement-overview-ribbon-result.json`
- Source artifacts: `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon artifacts/bridge-refinement-overview-ribbon-result.json artifacts/bridge-refinement-overview-ribbon-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active local review checkpoint; the first screen now has a 5-item latest overview, one Bridge action, a folded legacy Review Brief shelf, and Bridge refinement cues for narration, subtitle rhythm, visual order, thumbnail alternatives, held truths, and rights/asset boundaries. Provider/API, credentials, AI video generation, render, upload, final canon, and rights-clearance claims remain closed.

## fff-home-cockpit-metric-linking-001

- Title: Fast Fiction Factory Home Cockpit Metric Linking
- Purpose: Promote the default Review Brief route into a Home Cockpit that links Operator Track, Workbench, Evidence Vault, Locked Lanes, and actionable readiness meters before human Bridge review.
- Repo relative path: `public/review/index.html`
- Primary default route: `public/review/index.html?mode=brief`
- Compatibility alias route: `public/review/index.html?mode=home`
- Primary review route: `public/review/index.html?mode=bridge`
- Workbench routes: `public/review/index.html?mode=draft`, `public/review/index.html?mode=designer`, `public/review/index.html?mode=story`
- Evidence Vault routes: `public/review/index.html?mode=source`, `public/review/index.html?mode=project`, `public/review/index.html?mode=artifacts`
- Review doc: `docs/review/home-cockpit-metric-linking.md`
- Readback result: `artifacts/home-cockpit-metric-linking-result.json`
- Source artifacts: `fff-review-home-map-meters-001`, `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-draft-review-pack-stabilization-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-home-cockpit-metric-linking artifacts/home-cockpit-metric-linking-result.json artifacts/home-cockpit-metric-linking-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active local review checkpoint; no-query access now lands on the Home Cockpit through `brief`, `home` remains an alias, nine readiness meters link to concrete actions, and provider/API, credentials, AI video generation, render, upload, final canon, and rights-clearance claims remain closed.

## fff-review-home-map-meters-001

- Title: Fast Fiction Factory Review Home Map and Meters
- Purpose: Replace the folded-closet first impression with a Review Home Map that links each major shelf to purpose, status, meter, open trigger, and next action while preserving the Bridge and all production boundaries.
- Repo relative path: `public/review/index.html`
- Default mode route: `public/review/index.html?mode=home`
- Preserved prelude route: `public/review/index.html?mode=brief`
- Primary review route: `public/review/index.html?mode=bridge`
- Evidence Vault routes: `public/review/index.html?mode=source`, `public/review/index.html?mode=project`, `public/review/index.html?mode=artifacts`
- Review doc: `docs/review/review-home-map-meters.md`
- Readback result: `artifacts/review-home-map-meters-result.json`
- Source artifacts: `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-draft-review-pack-stabilization-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-review-home-map-meters artifacts/review-home-map-meters-result.json artifacts/review-home-map-meters-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved shelf-map checkpoint; `mode=home` now aliases to the active Home Cockpit, while the seven shelf cards and meter semantics remain regression evidence. Provider/API, credentials, AI video generation, render, upload, final canon, and rights-clearance claims remain closed.

## fff-draft-to-video-planning-bridge-001

- Title: Fast Fiction Factory Draft-to-Video Planning Bridge
- Purpose: Add a local pre-production bridge from Review Brief to a selected video-planning hypothesis without adding provider/API calls, credentials, publishing, AI video generation, production render, rights-clearance claims, or final-canon behavior.
- Repo relative path: `public/review/index.html`
- Primary mode route: `public/review/index.html?mode=bridge`
- Required prelude route: `public/review/index.html?mode=brief`
- Preserved mode routes: `public/review/index.html?mode=draft`, `public/review/index.html?mode=designer`
- Review doc: `docs/review/draft-to-video-planning-bridge.md`
- Readback result: `artifacts/draft-to-video-planning-bridge-result.json`
- Source artifacts: `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-draft-review-pack-stabilization-001`, `fff-contradictory-claim-guard-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json artifacts/draft-to-video-planning-bridge-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active planning checkpoint; selected candidate `designer-content-moth-investigation-3m` and selected channel `designer-channel-mystery-lore` are preserved, the Review Brief route contract is visible, Evidence Vault tabs are optional, narration is outline-only, rights/assets remain uncleared, and all production/provider/publishing/canon boundaries remain closed.

## fff-review-brief-dark-mode-ux-001

- Title: Fast Fiction Factory Review Brief and Dark Mode UX
- Purpose: Compress the first local review screen, make the selected candidate/channel route easier to find, add Japanese-first review labels, and add light/dark/auto theme compatibility without adding draft-to-video, provider/API, publishing, video generation, or final-canon behavior.
- Repo relative path: `public/review/index.html`
- Primary mode route: `public/review/index.html?mode=brief`
- Preserved mode routes: `public/review/index.html?mode=draft`, `public/review/index.html?mode=designer`
- Review doc: `docs/review/review-brief-dark-mode-ux.md`
- Readback result: `artifacts/review-brief-dark-mode-ux-result.json`
- Source artifacts: `fff-designer-candidate-dashboard-001`, `fff-one-story-draft-review-pack-001`, `fff-draft-review-pack-stabilization-001`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-review-brief-dark-mode-ux artifacts/review-brief-dark-mode-ux-result.json artifacts/review-brief-dark-mode-ux-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved operator prelude now folded into the active Home Cockpit; no-query access defaults to `public/review/index.html?mode=brief`, while `public/review/index.html?mode=home` remains an alias. Selected candidate `designer-content-moth-investigation-3m` and selected channel `designer-channel-mystery-lore` are visible, the route contract points to `public/review/index.html?mode=bridge`, advanced source/project/artifact panels remain available as Evidence Vault shelves, Light / Dark / Auto theme controls are present, and the prior Designer Dashboard / Draft Review Pack / Stabilization readbacks remain preserved.

## fff-draft-review-pack-stabilization-001

- Title: Fast Fiction Factory Draft Review Pack Stabilization
- Purpose: Stabilize the already-implemented Designer Dashboard and One-story Draft Review Pack with durable static access/readback evidence and git-ready product state, without adding provider/API/video/publishing/final-canon behavior.
- Repo relative path: `public/review/index.html`
- Mode routes: `public/review/index.html?mode=designer`, `public/review/index.html?mode=draft`
- Review doc: `docs/review/draft-review-pack-stabilization.md`
- Readback result: `artifacts/draft-review-pack-stabilization-result.json`
- Source artifacts: `fff-designer-candidate-dashboard-001`, `fff-one-story-draft-review-pack-001`
- Access state: `verified_present`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Stabilization checkpoint only; preserves Designer Dashboard, Draft Review Pack, and `fff-contradictory-claim-guard-001`; browser file URL capture was blocked by browser URL policy, so static access/readback evidence is the durable visual/access proof.

## fff-one-story-draft-review-pack-001

- Title: Fast Fiction Factory One-story Draft Review Pack
- Purpose: Add a local one-story draft review surface for one provisional story/video candidate, including source cue, logline, channel route, draft beats, non-final opening/narration, visual cues, subtitle/on-screen text cues, human-owned questions, risk cards, and reviewer decisions without external calls, provider setup, public upload, AI video generation, production render, or final canon decisions.
- Repo relative path: `public/review/index.html`
- Mode route: `public/review/index.html?mode=draft`
- Source dashboard: `fff-designer-candidate-dashboard-001`
- Review doc: `docs/review/one-story-draft-review-pack.md`
- Readback result: `artifacts/one-story-draft-review-pack-result.json`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-one-story-draft-review-pack artifacts/one-story-draft-review-pack-result.json artifacts/one-story-draft-review-pack-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active review surface; selection is `provisional_default`, preserves `fff-designer-candidate-dashboard-001` and `fff-contradictory-claim-guard-001`, no provider/API/credential/publishing/production/canon boundary is opened.

## fff-designer-candidate-dashboard-001

- Title: Fast Fiction Factory Designer Candidate Dashboard
- Purpose: Add a local Designer Dashboard for one-story content candidates, channel strategy proposals, draft spine beats, and review risks without external calls, provider setup, public upload, AI video generation, production render, or final canon decisions.
- Repo relative path: `public/review/index.html`
- Mode route: `public/review/index.html?mode=designer`
- Review doc: `docs/review/designer-candidate-dashboard.md`
- Readback result: `artifacts/designer-candidate-dashboard-result.json`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-designer-candidate-dashboard artifacts/designer-candidate-dashboard-result.json artifacts/designer-candidate-dashboard-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active review surface; preserves `fff-contradictory-claim-guard-001`, no provider/API/credential/publishing/production/canon boundary is opened.

## fff-route-lock-clean-state-readback-001

- Title: Fast Fiction Factory Route Lock Clean State Readback
- Purpose: Record the 2026-06-29 cleanup that removed untracked ClipPipeGen-derived prompt residue from this repo and verified no tracked Fast Fiction Factory contamination.
- Repo relative path: `docs/review/route-lock-clean-state-readback.md`
- Current status: `docs/review/current-status.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`
- Review status: `route_clean`

## fff-translation-provenance-source-span-readback-001

- Title: Fast Fiction Factory Translation Provenance Source-Span Readback
- Purpose: Record selected multilingual source-span to held derived-claim provenance before any translated fixture, translation policy, provider/API behavior, downstream adoption, or canon decision exists.
- Repo relative path: `docs/review/translation-provenance-source-span-readback.md`
- Readback result: `artifacts/translation-provenance-source-span-readback-result.json`
- Source fixture: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Validation command: `node tools/fff-state.mjs smoke-translation-provenance-source-span-readback artifacts/extraction-adapter-outputs/multilingual-memo-notes.json artifacts/translation-provenance-source-span-readback-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no translated fixture or provider/API boundary is added.

## fff-translation-policy-source-of-truth-boundary-001

- Title: Fast Fiction Factory Translation Policy Source-of-Truth Boundary
- Purpose: Define source-of-truth language, original span ownership, derivative translation ownership, inline gloss boundary, claim promotion rule, contradiction expectation, translated fixture allowance, and provider-adapter block before translated fixture or provider work.
- Repo relative path: `docs/review/translation-policy-source-of-truth-boundary.md`
- Readback result: `artifacts/translation-policy-source-of-truth-boundary-result.json`
- Input readback: `artifacts/translation-provenance-source-span-readback-result.json`
- Validation command: `node tools/fff-state.mjs smoke-translation-policy-source-of-truth-boundary artifacts/translation-provenance-source-span-readback-result.json artifacts/translation-policy-source-of-truth-boundary-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary boundary under `fff-contradictory-claim-guard-001`; no translated fixture, provider/API call, credential, downstream adoption, or canon promotion is added.

## fff-translated-memo-fixture-minimum-001

- Title: Fast Fiction Factory Minimal Translated Memo Fixture
- Purpose: Add the smallest translated memo fixture that follows the source-of-truth boundary: original multilingual memo spans remain evidence owners, translated rows are derivative/provenance-bound, one linked derived claim stays held, and the inline gloss row creates no claim.
- Repo relative path: `docs/review/translated-memo-fixture-minimum.md`
- Fixture: `artifacts/translated-memo-fixture-minimum.json`
- Readback result: `artifacts/translated-memo-fixture-minimum-result.json`
- Source fixture: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Validation command: `node tools/fff-state.mjs smoke-translated-memo-fixture-minimum artifacts/translated-memo-fixture-minimum.json artifacts/translated-memo-fixture-minimum-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary fixture under `fff-contradictory-claim-guard-001`; 2 translated rows, 0 original span mismatches, 0 translation-to-claim leaks, 1 held linked claim, 0 auto-promotions, 0 inline gloss claim leaks, and no provider/API call, credential, downstream adoption, or canon promotion.

## fff-held-claim-adoption-preflight-001

- Title: Fast Fiction Factory Held Claim Adoption Preflight
- Purpose: Inspect the held linked claim from the minimal translated memo fixture as a source-backed preflight candidate before any downstream Profile / Claim / Timeline adoption behavior, canon promotion, provider/API call, credential, or production route exists.
- Repo relative path: `docs/review/held-claim-adoption-preflight.md`
- Readback result: `artifacts/held-claim-adoption-preflight-result.json`
- Input readback: `artifacts/translated-memo-fixture-minimum-result.json`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Validation command: `node tools/fff-state.mjs smoke-held-claim-adoption-preflight artifacts/translated-memo-fixture-minimum-result.json artifacts/held-claim-adoption-preflight-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary preflight under `fff-contradictory-claim-guard-001`; 1 held claim inspected, 1 source-backed claim, 1 preflight-only eligible candidate, 0 adopted claims, 0 canonized claims, 0 translation/gloss leaks, and no provider/API call, credential, downstream adoption, or canon promotion.

## fff-downstream-adoption-semantics-design-001

- Title: Fast Fiction Factory Downstream Adoption Semantics Design
- Purpose: Define status transitions, accepted-status meaning, rollback conditions, mutation-forbidden boundaries, and candidate holding rules for the held preflight claim without implementing adoption.
- Repo relative path: `docs/review/downstream-adoption-semantics-design.md`
- Readback result: `artifacts/downstream-adoption-semantics-design-result.json`
- Input readback: `artifacts/held-claim-adoption-preflight-result.json`
- Validation command: `node tools/fff-state.mjs smoke-downstream-adoption-semantics-design artifacts/held-claim-adoption-preflight-result.json artifacts/downstream-adoption-semantics-design-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary design under `fff-contradictory-claim-guard-001`; 1 preflight candidate has design-only semantics, accepted status is defined but unreachable now, 10 rollback conditions are documented, 4 mutation targets are blocked, and no Profile / Claim / Timeline / Story Seed mutation, provider/API call, credential, adoption, or canon promotion is added.

## fff-adoption-candidate-ledger-dry-run-001

- Title: Fast Fiction Factory Adoption Candidate Ledger Dry-Run
- Purpose: Record the held preflight claim as a non-mutating adoption-candidate ledger dry-run row before any real downstream adoption, canonization, or Profile / Claim / Timeline / Story Seed mutation exists.
- Repo relative path: `docs/review/adoption-candidate-ledger-dry-run.md`
- Readback result: `artifacts/adoption-candidate-ledger-dry-run-result.json`
- Input readback: `artifacts/downstream-adoption-semantics-design-result.json`
- Validation command: `node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run artifacts/downstream-adoption-semantics-design-result.json artifacts/adoption-candidate-ledger-dry-run-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary dry-run under `fff-contradictory-claim-guard-001`; 1 source-backed held candidate is recorded as `adoption_candidate_dry_run`, with 0 adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed mutations, and no provider/API call, credential, publishing, or production generation.

## fff-sandbox-adoption-mutation-one-claim-001

- Title: Fast Fiction Factory Sandbox Adoption Mutation One Claim
- Purpose: Record the user-authorized sandbox / fixture adoption of exactly `multi-claim-moth-key-label` without production adoption, canonization, provider/API work, publishing, or production generation.
- Repo relative path: `docs/review/sandbox-adoption-mutation-one-claim.md`
- Readback result: `artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Input readback: `artifacts/adoption-candidate-ledger-dry-run-result.json`
- Validation command: `node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim artifacts/adoption-candidate-ledger-dry-run-result.json artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary sandbox fixture mutation under `fff-contradictory-claim-guard-001`; 1 sandbox row moves from `adoption_candidate_dry_run` to `sandbox_adopted_fixture`, rollback token is recorded, and production adopted claims, canonized claims, Profile / Claim / Timeline / Story Seed production mutations, provider/API calls, credentials, publishing, and production generation remain zero or false.

## fff-sandbox-adoption-rollback-rehearsal-001

- Title: Fast Fiction Factory Sandbox Adoption Rollback Rehearsal
- Purpose: Rehearse rollback of the previously sandbox-adopted fixture row for exactly `multi-claim-moth-key-label` without production rollback, production adoption, canonization, provider/API work, publishing, or production generation.
- Repo relative path: `docs/review/sandbox-adoption-rollback-rehearsal.md`
- Readback result: `artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Input readback: `artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Validation command: `node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal artifacts/sandbox-adoption-mutation-one-claim-result.json artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary sandbox rollback rehearsal under `fff-contradictory-claim-guard-001`; 1 sandbox-adopted row is inspected, the expected rollback token is verified, 1 rehearsal row records `sandbox_adopted_fixture -> adoption_candidate_dry_run`, and production adopted claims, canonized claims, Profile / Claim / Timeline / Story Seed production mutations, provider/API calls, credentials, publishing, and production generation remain zero or false.

## fff-production-adoption-authorization-packet-001

- Title: Fast Fiction Factory Production Adoption Authorization Packet
- Purpose: Prepare a freeform authorization packet for possible future production adoption of exactly `multi-claim-moth-key-label` without approving or performing production adoption, production rollback, canonization, provider/API work, publishing, or production generation.
- Repo relative path: `docs/review/production-adoption-authorization-packet.md`
- Readback result: `artifacts/production-adoption-authorization-packet-result.json`
- Input readback: `artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Validation command: `node tools/fff-state.mjs smoke-production-adoption-authorization-packet artifacts/sandbox-adoption-rollback-rehearsal-result.json artifacts/production-adoption-authorization-packet-result.json`
- Review status: `ready_for_user_authorization`
- Review input mode: `freeform`
- State: Preserved auxiliary authorization packet under `fff-contradictory-claim-guard-001`; 1 rollback-rehearsed candidate is presented, Profile / Claim Ledger / Timeline / Story Seed target classes are proposed, Claim Ledger is recommended as the first target, user authorization remains required, production mutations remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-production-claim-ledger-adoption-one-claim-001

- Title: Fast Fiction Factory Production Claim Ledger Adoption One Claim
- Purpose: Record the user-authorized production adoption of exactly `multi-claim-moth-key-label` into the Claim Ledger while keeping canon, Profile, Timeline, Story Seed, provider/API, credential, publishing, and production generation boundaries closed.
- Repo relative path: `docs/review/production-claim-ledger-adoption-one-claim.md`
- Readback result: `artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Input readback: `artifacts/production-adoption-authorization-packet-result.json`
- Validation command: `node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim artifacts/production-adoption-authorization-packet-result.json artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary Claim Ledger adoption readback under `fff-contradictory-claim-guard-001`; 1 Claim Ledger production adoption row is recorded, `multi-claim-moth-key-label` moves from `adoption_candidate_dry_run` to `production_claim_ledger_adopted`, rollback descriptor is recorded, Profile / Timeline / Story Seed mutations remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-production-claim-ledger-rollback-rehearsal-001

- Title: Fast Fiction Factory Production Claim Ledger Rollback Rehearsal
- Purpose: Rehearse the rollback descriptor for the existing production Claim Ledger adoption row for exactly `multi-claim-moth-key-label` without performing rollback or removing the row.
- Repo relative path: `docs/review/production-claim-ledger-rollback-rehearsal.md`
- Readback result: `artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Input readback: `artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Validation command: `node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal artifacts/production-claim-ledger-adoption-one-claim-result.json artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary rollback rehearsal under `fff-contradictory-claim-guard-001`; 1 production Claim Ledger adoption row is inspected, the expected rollback descriptor is verified, 1 non-destructive rehearsal row is recorded, actual rollback operations remain 0, the production Claim Ledger row remains retained, Profile / Timeline / Story Seed mutations remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-downstream-target-authorization-packet-001

- Title: Fast Fiction Factory Downstream Target Authorization Packet
- Purpose: Prepare the next downstream target-class authorization choice after production Claim Ledger adoption and rollback rehearsal for exactly `multi-claim-moth-key-label`, without mutating Profile, Timeline, Story Seed, Canon decision, provider, credential, publishing, or production generation surfaces.
- Repo relative path: `docs/review/downstream-target-authorization-packet.md`
- Readback result: `artifacts/downstream-target-authorization-packet-result.json`
- Input readback: `artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Validation command: `node tools/fff-state.mjs smoke-downstream-target-authorization-packet artifacts/production-claim-ledger-rollback-rehearsal-result.json artifacts/downstream-target-authorization-packet-result.json`
- Review status: `ready_for_user_authorization`
- Review input mode: `freeform`
- State: Preserved auxiliary downstream target authorization packet under `fff-contradictory-claim-guard-001`; 1 retained production Claim Ledger row is inspected, 4 downstream target classes are proposed, Profile is the only recommended next target, user authorization remains required, downstream mutations remain 0, Profile / Timeline / Story Seed mutation counts remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-profile-adoption-mutation-one-claim-001

- Title: Fast Fiction Factory Profile Adoption Mutation One Claim
- Purpose: Record the user-authorized Profile-only production mutation for exactly `multi-claim-moth-key-label` as one non-canon Profile annotation while preserving the retained Claim Ledger row and all non-Profile boundaries.
- Repo relative path: `docs/review/profile-adoption-mutation-one-claim.md`
- Readback result: `artifacts/profile-adoption-mutation-one-claim-result.json`
- Input readback: `artifacts/downstream-target-authorization-packet-result.json`
- Validation command: `node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim artifacts/downstream-target-authorization-packet-result.json artifacts/profile-adoption-mutation-one-claim-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary Profile adoption readback under `fff-contradictory-claim-guard-001`; 1 Profile mutation row records `claim_ledger_adopted -> profile_adopted_noncanon`, rollback descriptor is recorded, Claim Ledger additional adoption count remains 0, Timeline / Story Seed mutation counts remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-mvp-skeleton-001

- Title: Fast Fiction Factory MVP Skeleton Review Workbench
- Purpose: Local review of memo intake, structured candidates, review states, task cards, outlines, and QA gates.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Screenshot: `artifacts/fff-mvp-skeleton-review.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-mvp-export-import-001

- Title: Fast Fiction Factory JSON Export Import Review Workbench
- Purpose: Portable local review of memo, candidates, review statuses, unresolved creative decisions, QA gates, generated outlines, and decision log.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Sample state: `artifacts/sample-project-state.json`
- Smoke result: `artifacts/export-import-smoke-result.json`
- Review doc: `docs/review/json-export-import-review.md`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-visual-review-hub-001

- Title: Fast Fiction Factory Visual Review Hub
- Purpose: One local review entry point for current MVP status, artifact inventory, local inspection steps, export/import testing, unresolved creative decisions, QA gates, missing features, and next slice.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current status: `docs/review/current-status.md`
- Review doc: `docs/review/visual-review-hub-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Smoke result: `artifacts/visual-review-smoke-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-local-persistence-ergonomics-001

- Title: Fast Fiction Factory Local Persistence And Review Ergonomics Workbench
- Purpose: Extend the Visual Review Hub with explicit local file save/load, JSON fallback import/export, repo-local state validation commands, candidate status filters, search, collapse/expand controls, updated state artifacts, smoke evidence, and refreshed visual review images.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- File persistence smoke result: `artifacts/file-persistence-smoke-result.json`
- Review ergonomics smoke result: `artifacts/review-ergonomics-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Persistence review doc: `docs/review/file-persistence-review.md`
- Ergonomics review doc: `docs/review/review-ergonomics-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-claim-ledger-001

- Title: Fast Fiction Factory Claim Ledger Workbench
- Purpose: Extend the Visual Review Hub with a reviewable Claim Ledger for source, truth status, reality/reference status, canon risk, unresolved dependencies, viewer disclosure, spoiler protection, and claim review decisions.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Claim Ledger smoke result: `artifacts/claim-ledger-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Claim Ledger review doc: `docs/review/claim-ledger-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-local-docs-view-001

- Title: Fast Fiction Factory Local Markdown Docs View
- Purpose: Provide a local MkDocs Material tree view for reading, auditing, browser-assisted translation checks, project overview, screenshot locations, and turn-count-based development planning without translating or rewriting source specifications.
- Repo relative path: `mkdocs.yml`
- Entry page: `docs/index.md`
- Project overview map: `docs/project-overview.md`
- External Markdown wrappers: `docs/local-view/`
- Nav candidate generator: `tools/generate-doc-nav.mjs`
- Open command: `python -m mkdocs serve -a 127.0.0.1:8000`
- Alternate open command when port 8000 is busy: `python -m mkdocs serve -a 127.0.0.1:8001`
- Review status: `ready_for_local_review`

## fff-timeline-view-001

- Title: Fast Fiction Factory Timeline View Workbench
- Purpose: Extend the Visual Review Hub with v1.3 operating contract visibility and a reviewable multi-axis Timeline View for story order, calendar time, viewer disclosure order, production order, historical/reference order, Claim Ledger linkage, unresolved dependencies, spoiler protection, and timeline review decisions.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Timeline smoke result: `artifacts/timeline-smoke-result.json`
- v1.3 compliance smoke result: `artifacts/v1-3-compliance-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Timeline review doc: `docs/review/timeline-view-review.md`
- v1.3 compliance review doc: `docs/review/v1-3-compliance-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-profile-ghost-flow-001

- Title: Fast Fiction Factory Profile/Ghost Flow Workbench
- Purpose: Extend the Visual Review Hub with profile pages and ghost node flow for people, places, organizations, events, objects, concepts, documents, visual assets, and placeholders while preserving Claim Ledger, Timeline View, local persistence, import/export, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Checkpoint readback: `artifacts/checkpoint-readback-result.json`
- Profile/Ghost smoke result: `artifacts/profile-ghost-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Profile/Ghost review doc: `docs/review/profile-ghost-flow-review.md`
- Checkpoint readback doc: `docs/review/checkpoint-readback.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-extraction-contract-001

- Title: Fast Fiction Factory Extraction Contract Workbench
- Purpose: Extend the Visual Review Hub with a local-first extraction contract for source refs, extracted elements, profile/claim/timeline candidate routing, unresolved dependencies, review-safe defaults, warnings, freeform review intake, and human authority boundaries before any model/API extractor exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Current state: `artifacts/current-project-state.json`
- Sample state: `artifacts/sample-project-state.json`
- Sample extraction payload: `artifacts/sample-extraction-payload.json`
- State adapter: `tools/fff-state.mjs`
- Extraction Contract smoke result: `artifacts/extraction-contract-smoke-result.json`
- Freeform review intake smoke result: `artifacts/freeform-review-intake-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Extraction Contract review doc: `docs/review/extraction-contract-review.md`
- Freeform Review Intake doc: `docs/review/freeform-review-intake.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`
- Review input mode: `freeform`

## fff-extraction-validator-hardening-001

- Title: Fast Fiction Factory Extraction Validator Hardening
- Purpose: Harden the local Extraction Contract with seven valid/invalid fixture payloads, built-in guard checks, and stricter zero-dependency validation before any adapter, model/API behavior, database persistence, publishing adapter, AI video generation, production sync, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved contract artifact: `fff-extraction-contract-001`
- Fixture directory: `artifacts/extraction-negative-fixtures/`
- Fixture files: `valid-minimal.json`, `missing-source-refs.json`, `overconfident-human-owned-decision.json`, `invalid-routing-visual-asset-to-claim.json`, `auto-canon-leak.json`, `missing-review-safe-defaults.json`, `unknown-fields-preservation.json`
- Validator smoke result: `artifacts/extraction-validator-smoke-result.json`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/extraction-validator-hardening-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json`
- Validation result: expected-valid fixtures passed, expected-invalid fixtures failed for intended reasons, including the malformed/missing source-span guard fixture and the contradictory-claim hold fixture; built-in guard checks passed for missing identity fields, invalid element type, missing human authority boundaries, and missing high-risk warnings; unknown-field preservation warnings were reported. Current validator matrix contains 9 fixtures: 3 expected valid and 6 expected invalid.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Preserve this validator matrix as the gate for adapter expansion and any future model/API adapter.

## fff-local-extraction-adapter-spike-001

- Title: Fast Fiction Factory Local Extraction Adapter Spike
- Purpose: Convert a sample raw memo into a local Extraction Contract payload with deterministic zero-dependency rules, then validate the payload through the existing Extraction Contract validator and fixture matrix before any model/API extraction behavior exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Sample raw memo: `artifacts/sample-raw-memo.md`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter smoke result: `artifacts/local-extraction-adapter-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/local-extraction-adapter-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-extract-local.mjs artifacts/sample-raw-memo.md artifacts/local-extraction-adapter-output.json artifacts/local-extraction-adapter-smoke-result.json`
- Validation result: deterministic adapter output validated as `fff.extractionContract.v1`; output contains 12 extracted elements covering all required element types, 9 profile candidates, 7 claim candidates, 5 timeline candidates, 3 unresolved human-owned dependencies, review-safe defaults, and source refs; fixture matrix remained passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-local-extraction-adapter-expansion-001`.
- Next action: Use the expansion artifact for current adapter review.

## fff-local-extraction-adapter-expansion-001

- Title: Fast Fiction Factory Local Extraction Adapter Expansion
- Purpose: Expand deterministic local raw memo extraction across multiple fixtures, generate one Extraction Contract payload per fixture, validate every output, and audit source spans, source refs, review-safe defaults, visual-asset routing, freeform review, and human-owned decision guards before any model/API extraction behavior exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Sample raw memo: `artifacts/sample-raw-memo.md`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter smoke result: `artifacts/local-extraction-adapter-smoke-result.json`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/local-extraction-adapter-expansion-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-extract-local.mjs --matrix artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validation result: deterministic adapter output now validates as `fff.extractionContract.v1` for five fixture memos after `fff-remaining-fixture-coverage-one-class-001`; output matrix contains 60 extracted elements, complete required element-type coverage, 44 profile candidates, 34 claim candidates, 20 timeline candidates, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual-asset routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions; fixture matrix remains passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-source-span-routing-review-pack-001`.
- Next action: Use the source-span routing review pack before revising fixture spans/routing or placing any model/API adapter behind the same validator boundary.

## fff-model-api-boundary-spec-001

- Title: Fast Fiction Factory Model/API Boundary Specification
- Purpose: Define a local-first boundary for future model/API extraction output before any external provider call, credential setup, adapter implementation, database persistence, publishing adapter, AI video generation, production sync, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved local adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Boundary spec doc: `docs/review/model-api-boundary-spec.md`
- Boundary envelope example: `artifacts/model-api-boundary-envelope.example.json`
- Boundary smoke result: `artifacts/model-api-boundary-smoke-result.json`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: parse `artifacts/model-api-boundary-envelope.example.json`, parse `artifacts/model-api-boundary-smoke-result.json`, run current/sample state validation, validate sample and generated Extraction Contract payloads, run validator fixture matrix, run deterministic adapter matrix, and check Review Hub text plus screenshot/contact-sheet existence.
- Validation result: boundary envelope parsed; boundary smoke passed; no model/API call, credentials, provider endpoint, direct state mutation, database persistence, publishing, production sync, AI video generation, or final canon decision added; adapter expansion and validator gates remained passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-source-span-routing-review-pack-001`.
- Next action: Use the source-span routing review pack before choosing a no-network mock provider or explicitly configured provider adapter behind the same validation gates.

## fff-source-span-routing-review-pack-001

- Title: Fast Fiction Factory Source-Span Routing Review Pack
- Purpose: Turn the deterministic adapter fixture outputs into a compact human supervision pack for source spans, source refs, routing targets, held defaults, confidence/default status, human-owned guards, risk flags, review notes, and review debt before freeform review or model/API behavior.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Pack artifact: `artifacts/source-span-routing-review-pack.json`
- Pack generator: `tools/fff-source-span-review-pack.mjs`
- Review doc: `docs/review/source-span-routing-review-pack.md`
- Dirty-work triage result: `artifacts/source-span-routing-triage-result.json`
- Dirty-work triage doc: `docs/review/source-span-routing-triage.md`
- Preserved adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-source-span-review-pack.mjs artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/source-span-routing-review-pack.json`
- Validation result: source-span review pack generated from five fixture outputs after `fff-remaining-fixture-coverage-one-class-001`; pack records 60 extracted elements, 44 profile candidates, 34 claim candidates, 20 timeline candidates, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing cases, 0 non-held review defaults, 0 human-owned decision adopt suggestions, 28 human-owned guarded elements, and remaining fixture-class gaps excluding sparse bullet-only notes and multilingual memo text.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Review the pack in the Visual Review Hub or `artifacts/source-span-routing-review-pack.json`, then decide whether to revise deterministic spans/routing or add new edge fixtures before model/API adapter work.

## fff-source-span-routing-triage-001

- Title: Fast Fiction Factory Source-Span Routing Dirty-Work Triage
- Purpose: Classify every dirty or untracked source-span routing file after `fff-model-api-boundary-spec-001` and decide whether a separate source-span checkpoint is safe.
- Triage result: `artifacts/source-span-routing-triage-result.json`
- Triage doc: `docs/review/source-span-routing-triage.md`
- Related active artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Validation result: all dirty/untracked files classified as `source_span_routing_intentional`; model boundary residue, generated temp, unrelated dirty work, and unknown-needs-decision buckets are empty; manifest validation, MkDocs strict, Playwright browser smoke, and git diff whitespace checks passed.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Use the source-span review pack for human freeform review, then revise only concrete span/routing issues or fixture classes identified by review.

## fff-review-hub-ia-mode-split-001

- Title: Fast Fiction Factory Review Hub IA Mode Split
- Purpose: Split the local Review Hub into Story Review, Source Audit, Project Cockpit, and Artifacts modes; add Japanese-facing display labels; remove awkward sticky Raw Story Memo behavior; and reduce first-load vertical overload while preserving source-span and model/API boundary evidence.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Review doc: `docs/review/review-hub-ia-mode-split.md`
- Smoke result: `artifacts/review-hub-ia-mode-split-smoke-result.json`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: run the active manifest validation command, Review Hub static smoke, MkDocs strict build, and `git diff --check`.
- Validation result: manifest validation command passed; Review Hub IA static smoke passed; Story Review, Source Audit, Project Cockpit, and Artifacts labels are visible with Japanese display labels; Raw Story Memo sticky positioning was removed; source-span fixture details are collapsed by default; source-span pack remains reachable and passed with 0 guard failures; model/API boundary text remains present with `externalCallAllowed: false`; state, extraction payload, and extraction fixture validation passed.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Review whether the four modes, Japanese labels, collapsed source audit details, and non-sticky Raw Story Memo panel reduce daily review friction while keeping source-span evidence reachable.

## fff-review-procedure-lock-001

- Title: Fast Fiction Factory Review Procedure Lock
- Purpose: Lock the local review procedure, screenshot/contact-sheet evidence map, mode-specific screenshot paths, optional-vs-required review boundary, freeform review intake guidance, and identity/access split before model/API implementation work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review procedure: `docs/review/review-procedure.md`
- Smoke result: `artifacts/review-procedure-lock-smoke-result.json`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Mode screenshots:
  - `artifacts/review-screens/story-review.png`
  - `artifacts/review-screens/source-audit.png`
  - `artifacts/review-screens/project-cockpit.png`
  - `artifacts/review-screens/artifacts-validation.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: run the active manifest validation command, Review Hub procedure static smoke, screenshot non-empty checks, MkDocs strict build, and `git diff --check`.
- Validation result: passed 2026-06-22T13:26:45+09:00; manifest validation command passed; Review Procedure Lock smoke passed; screenshot, contact sheet, and four mode screenshots were refreshed and non-empty; MkDocs strict build passed; `git diff --check` passed. Bundled Playwright Chromium was unavailable, so screenshot refresh used the local Microsoft Edge channel without downloading browsers.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Use optional freeform review to decide whether the fixed procedure, screenshot map, and access paths reduce future review friction; then make only one narrow procedure, IA, fixture, span, or routing change if review identifies a concrete gap.

## fff-review-memory-dedup-001

- Title: Fast Fiction Factory Review Memory Dedup
- Purpose: Add v1.14-style review memory, Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card conventions so future review requests do not repeat the same target, evidence, and axis.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Smoke result: `artifacts/review-memory-dedup-smoke-result.json`
- Manifest review memory source of truth: `artifacts/artifact-manifest.json`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Manifest review memory entries:
  - `fff-review-procedure-lock-001`
  - `fff-review-hub-ia-mode-split-001`
  - `fff-source-span-routing-review-pack-001`
- Validation command: run the active manifest validation command, Review Memory Dedup smoke/readback, Review Hub static smoke, MkDocs strict build, and `git diff --check`.
- Validation result: passed 2026-06-22T13:45:00+09:00; manifest validation command passed; `review_memory` contains required fields for `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, and `fff-source-span-routing-review-pack-001`; Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card template are present; Review Hub static smoke text is present; source-span pack and extraction validators remained passing; MkDocs strict build passed; `git diff --check` passed.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Use the Review Dedup Gate before asking for review. The next non-redundant axis is source-span usefulness and routing quality only when target, evidence, axis, or decision value changes enough to justify asking.

## fff-source-span-quality-audit-001

- Title: Fast Fiction Factory Source-Span Quality Audit
- Purpose: Classify source-span usefulness and routing quality across the existing 36-row source-span review pack without asking for a repeated general Review Hub review or starting model/API work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/source-span-quality-audit.md`
- Audit result: `artifacts/source-span-quality-audit-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Manifest: `artifacts/artifact-manifest.json`
- Preserved review memory artifact: `fff-review-memory-dedup-001`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Classification counts: 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows.
- Review Dedup result: review memory checked, axis set to `source_span_quality`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub request emitted.
- Validation command: run the active manifest validation command, parse `artifacts/source-span-quality-audit-result.json`, regenerate the source-span review pack, validate adapter outputs, validate current/sample state, validate sample extraction payload, run extraction fixture validation, run MkDocs strict build, and run `git diff --check`.
- Validation result: passed; active manifest validation parsed the audit JSON, confirmed 36 classified rows, regenerated the source-span review pack, validated adapter outputs, validated current/sample state, validated the sample extraction payload, ran extraction fixture validation, and preserved no model/API behavior.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Choose one bounded weak-span, broad-span, ambiguous-routing, or missing-fixture improvement before any model/API adapter work.

## fff-ambiguous-routing-resolution-001

- Title: Fast Fiction Factory Ambiguous Routing Resolution
- Purpose: Resolve the seven ambiguous routing rows from `fff-source-span-quality-audit-001` into explicit primary destinations, secondary evidence roles, held defaults, and regression checks without asking for a repeated general review or starting model/API work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/ambiguous-routing-resolution.md`
- Resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Preserved source-span quality audit artifact: `fff-source-span-quality-audit-001`
- Preserved review memory artifact: `fff-review-memory-dedup-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Updated deterministic adapter: `tools/fff-extract-local.mjs`
- Updated adapter output: `artifacts/local-extraction-adapter-output.json`
- Updated adapter matrix outputs: `artifacts/extraction-adapter-outputs/`
- Updated adapter smoke evidence: `artifacts/local-extraction-adapter-smoke-result.json`, `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Updated source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Resolution counts: 7 ambiguous rows resolved; 3 primary Profile routes, 1 primary Visual route, 3 Human Review holds, 5 Claim secondary evidence rows, and 6 Timeline secondary evidence rows.
- Adapter rule applied: `local-x-visual-observatory` no longer routes to Claim Ledger target ids; all visual asset rows keep `targetClaimIds: []`.
- Review Dedup result: review memory checked, axis set to `ambiguous_routing_resolution`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub request emitted.
- Validation command: run the active manifest validation command, parse the resolution result, regenerate adapter matrix and source-span pack, validate adapter outputs and state files, run extraction fixture validation, run MkDocs strict build, and run `git diff --check`.
- Validation result: passed 2026-06-22T15:49:25+09:00; active manifest validation parsed the resolution JSON, confirmed all 7 ambiguous rows resolved, regenerated adapter smoke/matrix output and source-span review pack, verified every visual asset keeps `targetClaimIds: []` and avoids direct Claim routing, validated adapter outputs/current state/sample state/sample extraction/extraction fixtures, preserved model/API boundary text, passed MkDocs strict build, and passed `git diff --check`.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Add one missing fixture class or validator-hardening case only if route policy drift appears again.

## fff-routing-policy-regression-hardening-001

- Title: Fast Fiction Factory Routing Policy Regression Hardening
- Purpose: Promote the ambiguous-routing policy into a reusable validator smoke command so future adapter changes cannot silently drift across Visual, Profile/Ghost, Claim, Timeline, Source Reference, and Human Review boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/routing-policy-regression-hardening.md`
- Regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Routing policy validator: `tools/fff-state.mjs`
- Source resolution artifact: `fff-ambiguous-routing-resolution-001`
- Source resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter matrix outputs: `artifacts/extraction-adapter-outputs/`
- Validation command: `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; routing policy regression smoke parsed `fff-routing-policy-regression-hardening-001`, checked 7 resolved rows, 60 source-pack rows, 6 adapter payloads, 72 adapter elements, and 0 failures; visual direct-Claim guard, human-review hold guard, Claim secondary-evidence rule, Timeline secondary-evidence rule, source_reference preservation, unsafe/unclear hold rule, and adapter drift readback passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Add one missing fixture class only if route-policy hardening later exposes drift.

## fff-broad-span-split-001

- Title: Fast Fiction Factory Broad Source-Span Split
- Purpose: Resolve the two broad source-span rows from `fff-source-span-quality-audit-001` by recording one narrower split and one explicit keep reason while preserving routing regression, source refs, review memory, model/API boundaries, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/broad-span-split.md`
- Split result: `artifacts/broad-span-split-result.json`
- Broad-span validator: `tools/fff-state.mjs`
- Source audit artifact: `fff-source-span-quality-audit-001`
- Source audit result: `artifacts/source-span-quality-audit-result.json`
- Routing policy regression artifact: `fff-routing-policy-regression-hardening-001`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validation command: `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json`
- Validation result: passed 2026-06-23T11:05:58+09:00; manifest validation command passed after remote fast-forward; broad-span split parsed `fff-source-span-quality-audit-001`, loaded 2 broad rows, split `local-x-visual-observatory` into narrower visual/profile and timeline snippets, kept `minutes-x-placeholder-proof-bait` with an explicit human-owned reason, preserved both source locators, preserved routing regression and model/API boundary evidence, adapter/source-span smoke remained passing, MkDocs strict build passed, and `git diff --check` passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Pick one weak span repair or one missing fixture class only after explicit need; do not reopen broad-span debt unless source output changes.

## fff-weak-span-repair-001

- Title: Fast Fiction Factory Weak Source-Span Repair
- Purpose: Resolve the six weak source-span rows from `fff-source-span-quality-audit-001` by recording stronger same-fixture source refs while preserving original locators, broad-span split results, routing policy regression, review memory, model/API boundaries, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/weak-span-repair.md`
- Repair result: `artifacts/weak-span-repair-result.json`
- Weak-span validator: `tools/fff-state.mjs`
- Source audit artifact: `fff-source-span-quality-audit-001`
- Source audit result: `artifacts/source-span-quality-audit-result.json`
- Broad-span split artifact: `fff-broad-span-split-001`
- Broad-span split result: `artifacts/broad-span-split-result.json`
- Routing policy regression artifact: `fff-routing-policy-regression-hardening-001`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validation command: `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json`
- Validation result: passed 2026-06-23T13:10:13+09:00; manifest validation command passed; weak-span repair smoke parsed `fff-source-span-quality-audit-001`, loaded 6 weak rows, repaired all 6 with stronger same-fixture source refs, preserved 6 original locators, preserved broad-span split and routing regression evidence, adapter/source-span smoke remained passing, MkDocs strict build passed, HTML script syntax check passed, and `git diff --check` passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Add one missing fixture class only after a concrete coverage need is named; do not reopen weak-span, broad-span, or ambiguous-routing debt unless source output changes.

## fff-missing-fixture-class-probe-001

- Title: Fast Fiction Factory Missing Fixture Class Probe
- Purpose: Add exactly one concrete missing fixture class, sparse bullet-only notes, after weak-span cleanup while preserving routing, source-span, model/API, review-memory, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/missing-fixture-class-probe.md`
- Probe result: `artifacts/missing-fixture-class-probe-result.json`
- Fixture memo: `artifacts/extraction-adapter-fixtures/sparse-bullet-notes.md`
- Fixture output: `artifacts/extraction-adapter-outputs/sparse-bullet-notes.json`
- Updated deterministic adapter: `tools/fff-extract-local.mjs`
- Updated state smoke: `tools/fff-state.mjs`
- Source-span review pack generator: `tools/fff-source-span-review-pack.mjs`
- Adapter matrix smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Weak-span repair result: `artifacts/weak-span-repair-result.json`
- Broad-span split result: `artifacts/broad-span-split-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-missing-fixture-class-probe artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/missing-fixture-class-probe-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; sparse fixture probe read at least 4 fixture outputs and now sees 5 fixture outputs, 60 matrix elements, 60 source-pack rows, 6 adapter payloads, 72 adapter elements, 12 sparse fixture elements, 11 sparse bullet lines, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held review defaults, 0 human-owned adopt suggestions, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Choose another remaining fixture class only after a concrete coverage need is named; do not reopen sparse notes, weak spans, broad spans, or ambiguous routing unless source output changes.

## fff-malformed-missing-span-guard-001

- Title: Fast Fiction Factory Malformed/Missing Source-Span Guard
- Purpose: Add exactly one negative validator guard class for missing, malformed, or unusable source-span evidence so invalid payloads cannot silently become accepted Profile, Claim, or Timeline routed candidates.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/malformed-missing-span-guard.md`
- Guard result: `artifacts/malformed-missing-span-guard-result.json`
- Negative fixture: `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Updated state validator: `tools/fff-state.mjs`
- Preserved missing fixture probe result: `artifacts/missing-fixture-class-probe-result.json`
- Preserved source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Preserved routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Preserved weak-span repair result: `artifacts/weak-span-repair-result.json`
- Preserved broad-span split result: `artifacts/broad-span-split-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-malformed-missing-span-guard artifacts/extraction-validator-smoke-result.json artifacts/malformed-missing-span-guard-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; malformed/missing source-span guard read 9 validator fixtures, 6 expected-invalid fixtures, 3 invalid guard elements, 5 source-span validation errors, 1 missing source-ref error, 0 accepted routed candidates, 0 non-held defaults, 60 preserved source-pack rows, 6 preserved adapter payloads, 72 preserved adapter elements, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Choose a different remaining fixture class only after a concrete coverage need is named; do not reopen malformed/missing spans, sparse notes, weak spans, broad spans, or ambiguous routing unless source output changes.

## fff-contradictory-claim-guard-001

- Title: Fast Fiction Factory Contradictory Claim Guard
- Purpose: Add exactly one local guard fixture for contradictory memo claims so reciprocal contradictory claim candidates are detected, source-backed, held for human review, and kept out of auto-canon or direct Claim Ledger acceptance.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/contradictory-claim-guard.md`
- Guard result: `artifacts/contradictory-claim-guard-result.json`
- Guard fixture: `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Updated state validator: `tools/fff-state.mjs`
- Preserved malformed/missing source-span guard result: `artifacts/malformed-missing-span-guard-result.json`
- Preserved missing fixture probe result: `artifacts/missing-fixture-class-probe-result.json`
- Preserved source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Preserved routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Preserved weak-span repair result: `artifacts/weak-span-repair-result.json`
- Preserved broad-span split result: `artifacts/broad-span-split-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; contradictory claim guard read 9 validator fixtures, 3 expected-valid fixtures, 6 expected-invalid fixtures, 2 linked conflicting claims, 1 reciprocal conflict pair, 2 held conflicting claims, 0 adopted/provisional conflicting claims, 0 direct accepted claim elements, 2 source-ref-preserved conflicting claims, 60 preserved source-pack rows, 6 preserved adapter payloads, 72 preserved adapter elements, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Preserve this as the active Review Hub identity while using provider-envelope readiness as auxiliary no-call evidence; do not reopen contradictory claims, malformed/missing spans, sparse notes, weak spans, broad spans, or ambiguous routing unless source output changes.

## fff-downstream-source-span-adoption-gate-001

- Title: Fast Fiction Factory Downstream Source-Span Adoption Gate
- Purpose: Add a deterministic readiness gate after malformed/missing span validation so only source-tracked, valid-span, safe-routed, review-held elements can be considered for future Profile, Claim, or Timeline adoption paths.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/downstream-source-span-adoption-gate.md`
- Gate result: `artifacts/downstream-source-span-adoption-gate-result.json`
- State validator: `tools/fff-state.mjs`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Malformed/missing span guard: `artifacts/malformed-missing-span-guard-result.json`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate artifacts/source-span-routing-review-pack.json artifacts/downstream-source-span-adoption-gate-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; downstream gate read 60 source-pack rows, reported 55 downstream Profile / Claim / Timeline review candidates, confirmed 55 source-tracked candidates, 0 malformed or missing-span candidates, 0 unsafe routing candidates, 28 held human-owned candidates, 0 non-held human-owned candidates, 0 accepted routed malformed-span candidates, 0 adopted downstream candidates, 6 adapter payloads, 72 adapter elements, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`.
- Next action: Keep this gate passing before any future adoption path or provider-backed adapter; use `fff-provider-envelope-readiness-no-call-001` as the no-call provider-envelope precondition before any provider implementation.

## fff-provider-envelope-readiness-no-call-001

- Title: Fast Fiction Factory Provider Envelope Readiness No-Call Gate
- Purpose: Define and validate the envelope shape a future provider adapter must satisfy before any model/API provider call, credential flow, provider endpoint, database persistence, publishing adapter, production sync, AI video generation, downstream adoption implementation, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/provider-envelope-readiness-no-call.md`
- Envelope example: `artifacts/provider-envelope-readiness-no-call.example.json`
- Readback result: `artifacts/provider-envelope-readiness-no-call-result.json`
- State validator: `tools/fff-state.mjs`
- Preserved active artifact: `fff-contradictory-claim-guard-001`
- Preserved model/API boundary: `fff-model-api-boundary-spec-001`
- Preserved malformed/missing source-span guard: `artifacts/malformed-missing-span-guard-result.json`
- Preserved contradictory claim guard: `artifacts/contradictory-claim-guard-result.json`
- Preserved downstream source-span adoption gate: `artifacts/downstream-source-span-adoption-gate-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call artifacts/provider-envelope-readiness-no-call.example.json artifacts/provider-envelope-readiness-no-call-result.json`
- Validation result: passed 2026-06-23; provider envelope readiness parsed the no-call fixture, confirmed no provider configured, no provider/model name, no endpoint, no external call attempted, no credentials touched, 4 carried Extraction Contract elements, 4 source-tracked elements, 2 human-owned elements held, 0 non-held human-owned elements, 0 visual direct Claim routes, 0 adopted/provisional elements, 0 adopted/provisional claims, and preserved the validator, malformed/missing, contradictory, downstream, source-pack, and model/API no-call gates.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no Review Card or Operator Observation Card is emitted.
- Next action: Choose explicit provider adapter implementation only after authorization for provider choice, credentials, and transport behavior, or choose remaining broad/multilingual fixture coverage if coverage remains the bottleneck.

## fff-provider-adapter-authorization-readiness-001

- Title: Fast Fiction Factory Provider Adapter Authorization Readiness
- Purpose: Record the authorization boundary before any real provider adapter work starts, separating local no-call readiness from provider choice, credentials, endpoint, transport, external call permission, persistence/publication, and production behavior.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/provider-adapter-authorization-readiness.md`
- Readback result: `artifacts/provider-adapter-authorization-readiness-result.json`
- Preserved provider envelope readiness: `artifacts/provider-envelope-readiness-no-call-result.json`
- Preserved model/API boundary: `artifacts/model-api-boundary-smoke-result.json`
- Preserved downstream scope lock: `artifacts/downstream-adoption-gate-scope-lock-result.json`
- Preserved contradictory claim guard: `artifacts/contradictory-claim-guard-result.json`
- Preserved malformed/missing source-span guard: `artifacts/malformed-missing-span-guard-result.json`
- Preserved routing regression: `artifacts/routing-policy-regression-hardening-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness artifacts/provider-envelope-readiness-no-call-result.json artifacts/provider-adapter-authorization-readiness-result.json`
- Validation result: provider adapter authorization readiness records 6 unauthorized items, 7 allowed no-call states, 6 future authorization triggers, 3 Decision Packet options, provider configured=false, external call=false, credentials touched=false, downstream adopted=0, held conflicting claims=2, malformed accepted=0, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Render gate: `L0 No Render`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no provider adapter, provider authorization implementation, credentials, endpoint, transport, model/API call, DB persistence, publishing, production sync, downstream adoption, or canon promotion is added.
- Next action: Real provider adapter implementation only after explicit authorization for provider choice, credentials, endpoint, transport behavior, external call permission, timeout, and retry policy.

## fff-remaining-fixture-coverage-one-class-001

- Title: Fast Fiction Factory Remaining Fixture Coverage One Class
- Purpose: Add exactly one remaining deterministic adapter fixture class, multilingual memo text, while keeping provider-envelope readiness no-call and preserving existing source-span, routing, malformed/missing-span, contradictory-claim, downstream, and human-owned decision gates.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/remaining-fixture-coverage-one-class.md`
- Readback result: `artifacts/remaining-fixture-coverage-one-class-result.json`
- Fixture memo: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`
- Fixture output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Updated deterministic adapter: `tools/fff-extract-local.mjs`
- Updated state smoke: `tools/fff-state.mjs`
- Source-span review pack generator: `tools/fff-source-span-review-pack.mjs`
- Adapter matrix smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Downstream gate result: `artifacts/downstream-source-span-adoption-gate-result.json`
- Provider envelope readiness result: `artifacts/provider-envelope-readiness-no-call-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-remaining-fixture-coverage-one-class artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/remaining-fixture-coverage-one-class-result.json`
- Validation result: passed 2026-06-23; multilingual fixture readback selected multilingual memo text over translated memo text and very broad source-span shape, raised the positive adapter matrix to 5 fixtures and 60 elements, confirmed 12 multilingual fixture elements with 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held defaults, 0 human-owned adopt suggestions, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; provider-envelope readiness remains no-call and no-credential.
- Next action: Choose explicit provider adapter implementation only after authorization, or choose translated memo text / very broad source-span shape only if coverage remains the bottleneck.

## fff-translated-memo-fixture-audit-001

- Title: Fast Fiction Factory Translated / Multilingual Memo Fixture Audit
- Purpose: Audit the existing multilingual memo fixture coverage and classify translated memo text as a policy-dependent gap without adding another fixture class, provider/API behavior, or canon decision.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/translated-memo-fixture-audit.md`
- Readback result: `artifacts/translated-memo-fixture-audit-result.json`
- Preserved multilingual fixture doc/result: `docs/review/remaining-fixture-coverage-one-class.md`, `artifacts/remaining-fixture-coverage-one-class-result.json`
- Preserved multilingual fixture memo/output: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Downstream scope-lock result: `artifacts/downstream-adoption-gate-scope-lock-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-translated-memo-fixture-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/translated-memo-fixture-audit-result.json`
- Validation result: translated memo fixture audit reads the downstream scope-lock, existing multilingual fixture coverage, source-span review pack, downstream gate, contradictory guard, malformed/missing guard, and provider no-call envelope; it records 0 translated fixtures added, translated memo text still present as a gap, 4 multilingual source-span elements preserved, 0 source-span mismatches, 0 missing source refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider configured, no external call attempted, no credentials touched, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no translated fixture, provider/API behavior, downstream adoption implementation, or canon promotion is added.
- Next action: Use `fff-very-broad-source-span-shape-audit-001` for the broad-shape readback; otherwise move to provider adapter implementation only after explicit authorization.

## fff-very-broad-source-span-shape-audit-001

- Title: Fast Fiction Factory Very Broad Source-Span Shape Audit
- Purpose: Audit the remaining very broad source-span shape fixture candidate without adding another fixture class, because current broad rows are already resolved by `fff-broad-span-split-001`.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/very-broad-source-span-shape-audit.md`
- Readback result: `artifacts/very-broad-source-span-shape-audit-result.json`
- Preserved translated memo audit: `artifacts/translated-memo-fixture-audit-result.json`
- Preserved broad-span split: `artifacts/broad-span-split-result.json`
- Preserved source-span quality audit: `artifacts/source-span-quality-audit-result.json`
- State validator: `tools/fff-state.mjs`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-very-broad-source-span-shape-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/very-broad-source-span-shape-audit-result.json`
- Validation result: very broad source-span shape audit reads the translated memo audit, source-span quality audit, broad-span split, source-span pack, routing regression, downstream gate, contradictory guard, malformed/missing guard, remaining fixture coverage, and provider no-call envelope; it records 0 broad fixtures added, 2 current broad rows resolved by split/keep, 0 source-span mismatches, 0 missing source refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider configured, no external call, no credentials touched, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no broad fixture, translated fixture, provider/API behavior, downstream adoption implementation, or canon promotion is added.
- Next action: Move to provider adapter implementation only after explicit authorization, or add a translated/broad fixture only after policy or source-output evidence creates concrete decision value.
