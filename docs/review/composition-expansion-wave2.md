# Composition Expansion Wave 2

## Outcome

`fff-composition-expansion-wave2-001` is the active local/reference-only H0 composition package for Beat 5「保留された答え」and Beat 6「時刻か、名前か」. It makes exactly seven source-authorized shots concrete without changing the 180-second story, shot IDs, timing, narration, subtitles, truth state, rights state, asset-selection state, or canon state.

Wave 2 adds four newly acquired licensed local rasters and reuses eight inherited references by exact identity. The seven shots use sixteen image assignments, two or three per shot, and seven distinct composition classes. Together with Wave 1, Beat 2 Board, and Beat 4 Counterexample, concrete composition material now exists for 19 of 19 source shots across separate packages. An integrated 19-shot visual package has not been created.

## Exact Source Scope

| Beat | Shot | Time | Duration | Composition class |
| --- | --- | --- | ---: | --- |
| Beat 5 | `shot-b05-01` | `01:45–01:58` | 13s | `uncertain_person_fate_matrix` |
| Beat 5 | `shot-b05-02` | `01:58–02:11` | 13s | `static_object_function_triad` |
| Beat 5 | `shot-b05-03` | `02:11–02:23` | 12s | `institutional_motive_quadrant` |
| Beat 5 | `shot-b05-04` | `02:23–02:35` | 12s | `three_question_unresolved_return` |
| Beat 6 | `shot-b06-01` | `02:35–02:44` | 9s | `time_vs_name_equal_split` |
| Beat 6 | `shot-b06-02` | `02:44–02:52` | 8s | `blank_ledger_closure` |
| Beat 6 | `shot-b06-03` | `02:52–03:00` | 8s | `bellless_tower_closing_callback` |

The Production Storyboard Brief remains the narrative planning authority. The Production Execution Pack remains the operational timing and shot authority. Wave 2 transcribes the exact Beat 5/6 rows, two narration segments, and eight subtitle cues into a composition-only layer.

## Package and Access

- Standalone page: `artifacts/composition-expansion-wave2/composition-expansion-wave2.html`
- Canonical model: `artifacts/composition-expansion-wave2/composition-expansion-wave2.json`
- Reference inventory: `artifacts/composition-expansion-wave2/reference-sources.csv`
- Shot contract: `artifacts/composition-expansion-wave2/shot-composition-map.csv`
- Contact sheet: `artifacts/composition-expansion-wave2/composition-expansion-wave2-contact-sheet.jpg`
- Integrity manifest: `artifacts/composition-expansion-wave2/composition-expansion-wave2-manifest.json`
- Recorded validation: `artifacts/composition-expansion-wave2-result.json`
- Browser evidence: `artifacts/review-screens/composition-expansion-wave2-900x1200-dark.png` and `artifacts/review-screens/composition-expansion-wave2-1280x900-light.png`

## New Reference Acquisition

| Reference | Intended borrowing | Creator | License | Local normalized image |
| --- | --- | --- | --- | --- |
| `ref-w2-b05-s01-horizon-silhouette` | Anonymous distant silhouette only; no identity or fate claim | Chris Roe | CC0 1.0 | 1600×902 JPEG |
| `ref-w2-b05-fate-blank-card` | Blank face duplicated equally across candidates; hand/background meaning excluded | Corn cheese | CC BY-SA 4.0 | 1280×720 JPEG |
| `ref-w2-b05-s02-brass-plate` | Inert brass surface only; source object history and function excluded | U.S. Army Corps of Engineers Savannah District; photo by Jim Jobling | Public Domain, U.S. federal government work | 1280×960 JPEG |
| `ref-w2-b06-s02-closed-book` | Cover/page-edge closure only; title, content, and ownership excluded | J.Dncsn | CC BY-SA 3.0 | 1280×893 JPEG |

Each entry records its creator, source page, original media URL, license name and URL, retrieval date, original/acquired/normalized dimensions, local path, SHA256, perceptual hash, intended borrowing, and excluded source meaning. Normalization preserved aspect ratio, performed no upscaling, limited the longest edge to 1600 pixels, and removed EXIF metadata. All pairwise perceptual-hash distances among the four new references exceed the near-duplicate guard.

## Inherited Reference Identity

Wave 2 points to, and does not copy or modify, eight predecessor references:

- Beat 2 Board: metal butterfly brooch and 09:15 vintage watch
- Beat 4 Counterexample: card catalogue and closed meeting room
- Wave 1: blank book, ledger geometry, Harvard Observatory, and Kreiensen station

Their IDs, creator/source/license metadata, dimensions, paths, and SHA256 values are verified against the live predecessor models. A changed inherited identity is a validation failure.

## Composition and Candidate Balance

The seven layouts have distinct class and layout signatures. Each shot records crop, focus order, eye path, foreground/midground/background, placement, depth, motion continuity, staging condition, truth-safe guard, borrowing boundary, and asset summary.

Candidate-bearing shots deliberately avoid visual winners:

- `shot-b05-01`: four 25% fate candidates, equal 20px headings, identical borders/contrast/saturation/image prominence, no selected candidate.
- `shot-b05-02`: three 33.33% function candidates, equal 20px headings and neutral contrast, no selected candidate.
- `shot-b05-03`: four 25% institution-motive candidates, equal 20px headings, equal borders/filters/prominence, no selected candidate.
- `shot-b05-04`: three 33.33% unresolved questions with equal emphasis and no resolved-state indicator.
- `shot-b06-01`: 50/50 time-versus-name split, equal 22px headings, no visual-emphasis winner.

These structures enumerate uncertainty. They do not select a fate, function, motive, answer, official, culprit, time theory, or name theory.

## Continuity and Lineage

Beat 5 progresses from 人物の運命 → 対象物の機能 → 制度の動機 → 三つの未解決事項. Beat 6 progresses from 二つの候補 → 未記入の記録 → 冒頭の空枠. The final tower shot is a visual callback to `shot-b01-01`, not a new answer or canon claim.

Cross-package lineage is explicit for the Beat 2 moth/watch material, Beat 4 institutional archive/room material, Wave 1 ledger material, and the opening tower/station material. Reuse is composition lineage only; it is not production selection.

## Review and Truth Boundary

- Wave 2 human review: none
- Per-Beat external reviewer: not required
- Per-Beat blind review: discontinued
- Human gate immediately after Wave 2: false
- Next human review: `after_integrated_19_shot_visual_package`
- External reproducibility: not claimed
- Integrated 19-shot package: not created

Every reference and shot remains `reference_only=true`, `selected_for_production=false`, and `rights_cleared_claim=false`. Image/audio/video generation, provider configuration, credentials, production render, upload/publication, database persistence, production approval, and final canon remain closed.

## Validation

Normal validation is strictly read-only:

```powershell
node tools/fff-state.mjs validate-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json
```

Intentional smoke regeneration writes only the Wave 2 integrity manifest and result; it does not rewrite acquired references or predecessor files:

```powershell
node tools/fff-state.mjs smoke-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json
```

The result binds package integrity, exact source rows, reference identity, predecessor fingerprints, 56 fail-closed negative probes, theme/focus/print evidence, two viewport screenshots, and the full preserved read-only validation chain.

## Residual Work

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Integrated 19-shot visual package | Present all 19 already-concrete shots as one review object | Opens the deferred whole-story composition review, not production | Separate authorization; reuse exact accepted package identities; no new story/timing/truth/rights claims; preserve all predecessors | proposed / data only / not created | product owner + supervisor authorize; implementer packages | Issue a bounded integration execution contract |
| Whole-story human review | Judge coherence only after integration | May accept or request bounded composition repairs | Exact integrated artifact/hash; one review surface; no production or rights implication | blocked on integration by policy | product owner as formal reviewer | Review only the completed integrated package |
| Production asset and rights lane | Select actual media and establish usage authority | Could advance toward render readiness | Explicit new authority, asset-by-asset provenance and rights review, replacement policy, production acceptance | closed / not authorized | rights owner + production owner | Do not start from this artifact |
