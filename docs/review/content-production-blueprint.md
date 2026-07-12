# Content Production Blueprint

## Outcome

`fff-content-production-blueprint-001` converts the accepted three-wording derivative baseline into a quantitative local planning contract. It makes content identity, scale, creative limits, per-beat and per-shot requirements, and completion checks readable without treating audit history or file transfer as production instruction.

Primary route: `public/review/index.html?mode=blueprint`

The three accepted wording changes are a provisional working baseline only. The Blueprint is not canonical, production-approved, rights-cleared, asset-selected, generated, rendered, uploaded, published, or persisted to a database.

## Content Contract

The content is a three-minute mystery-lore investigation built around a bellless clock tower, Toma's memo, a brass moth, erased names, institutional pressure, competing explanations, and an unresolved closing choice. It promises an evidence-shaped question rather than an answer.

The Blueprint deliberately does not resolve Toma's fate, the brass moth's truth or function, the Council's motive, or whether the ending restores time or names. Those subjects remain `unresolved_human_owned`.

| Scale item | Locked value |
| --- | ---: |
| Runtime | 180 seconds |
| Beats | 6 |
| Narration segments | 6 |
| Subtitle cues | 20 |
| Shots | 19 |
| Thumbnail directions | 3 |
| Accepted authored wording changes | 3 |

Completion means the source identity and counts match, every bounded field uses a known term or numeric limit, every global/beat/shot/subtitle acceptance row has a result, all source packages remain byte-identical, and all production boundaries remain closed.

## Source Chain And Fingerprints

| Source | Identity / SHA256 |
| --- | --- |
| Blueprint source artifact | `fff-editorial-derivative-preview-001` |
| Derivative core fingerprint | `94729bb099e0f99eb8ac1170b8a4b5e3694c9970df3149552f8efcd53fceda44` |
| `editorial-handoff.derived.json` | `15a695b7336ce55f520878cb9a26a35d47994fa176ef57ac55bf231a9cc0b51c` |
| Derivative package manifest | `7232b87bc3f091a8d4aa4e89c218a9c28dfe1c9b324e434a21f18b4c85105577` |
| Accepted patch | `ded0174232dabf9d78d645836e24455152bd418eff2e49b6f4f2509066478885` |
| Handoff `editorial-handoff.json` | `c818d81a0d87796a8d61e7d16ff0448a9feb5422b6ee3e0d2989cebd907b3080` |
| Handoff `package-manifest.json` | `ffad571ed4abeb46e7d2b5f61f33f3fa4703173b3f8da2318e5d1c7248772971` |

Every byte under `artifacts/editorial-handoff/`, `artifacts/editorial-revision/`, and `artifacts/editorial-derivative/` is a protected input to this slice. Source pre/post size and SHA256 comparisons are required; Blueprint validation and negative probes must not mutate them.

## Access

- Blueprint: `public/review/index.html?mode=blueprint`
- Derivative source: `public/review/index.html?mode=derivative`
- Revision source: `public/review/index.html?mode=revision`
- Handoff source: `public/review/index.html?mode=handoff`
- Bridge context: `public/review/index.html?mode=bridge`
- Brief context: `public/review/index.html?mode=brief`

PowerShell:

```powershell
.\scripts\operator\open_review.ps1 -Mode blueprint
.\scripts\operator\open_review.ps1 -Mode blueprint -PrintUri
```

Git-provided shell:

```sh
./scripts/operator/open_review.sh --mode blueprint
./scripts/operator/open_review.sh --mode blueprint --print-uri
```

No argument remains Brief. Unknown or unsafe modes must fail rather than being interpolated into an open command.

## Provisional Review Profile

These values are reversible project-local planning constraints, not industry standards or a final export decision.

| Field | Value |
| --- | --- |
| Canvas | `1920x1080` |
| Aspect ratio | `16:9` |
| Planning timebase | `30fps` |
| Status | `provisional_review_profile` |
| Render authorized | `false` |
| Vertical export authorized | `false` |
| Title-safe margins | top/right/bottom/left `5% / 5% / 5% / 5%` |
| Subtitle-safe margins | top/right/bottom/left `5% / 7% / 8% / 7%` |

The profile may be replaced only by an explicit later format decision.

## Production Constraint Envelope

The machine-readable model declares `12` LOCKED fields, `13` BOUNDED field families, and `4` FREE micro-detail categories.

### LOCKED

- six-beat order, beat IDs, and exact 180-second windows;
- narration, subtitle, shot, and thumbnail IDs and totals;
- the exact three accepted wording changes;
- truth boundaries and human-owned unresolved states;
- rights notes, `asset_status=unselected`, and closed production flags; and
- source fingerprints and candidate/channel identity.

Changing a LOCKED value requires a separately authorized revision. Validation treats drift as failure.

### BOUNDED

Composition, shot scale, subject occupancy, focal zone, camera motion, transition, palette role, overlay amount, motif use, audio role, asset class, asset quantity, and information role must use controlled terms and explicit numeric or enumerated limits. Each receives a pass/warn/fail check. No shot may retain unrestricted freeform visual direction as its production contract.

### FREE

Only texture nuance, non-semantic decorative variation, minor easing within an approved motion class, and exact prop wear within an approved asset class may remain free. These details must not change story meaning, evidence relation, timing, truth, readability, rights state, composition class, or asset count.

## Controlled Vocabulary

The following exact project-local terms are validator-enforced.

| Vocabulary | Allowed values |
| --- | --- |
| `composition_class` | `environment_establishing`, `character_context`, `evidence_insert`, `object_detail`, `institutional_pressure`, `abstract_information`, `unresolved_choice`, `closing_question` |
| `shot_scale` | `wide`, `medium`, `close`, `extreme_close`, `graphic_fullframe` |
| `camera_motion` | `locked`, `slow_push`, `slow_pull`, `slow_pan`, `controlled_parallax`, `graphic_dissolve` |
| `transition` | `hard_cut`, `short_dissolve`, `match_cut`, `graphic_match`, `held_fade` |
| `palette_role` | `midnight_base`, `brass_accent`, `paper_neutral`, `warning_rust`, `uncertainty_cool`, `text_high_contrast` |
| `asset_class` | `environment`, `character_silhouette`, `prop`, `document_graphic`, `abstract_graphic`, `typography`, `audio_cue` |
| `information_role` | `hook`, `evidence`, `context`, `pressure`, `competing_hypothesis`, `unresolved_question`, `closing_prompt` |
| `focal_zone` | `center`, `center_left`, `center_right`, `upper_third`, `lower_third`, `split_frame`, `full_frame` |
| `overlay_text_mode` | `none`, `subtitle_only`, `single_label`, `subtitle_plus_single_label` |
| `audio_role` | `ambient_bed`, `mechanical_detail`, `tension_pulse`, `silence_hold`, `closing_resonance` |
| `motif` | `bellless_frame`, `brass_moth_and_9_17`, `fading_name_contours`, `translucent_divider`, `hold_labels`, `time_or_names_split` |

Unknown terms fail closed. Prose may explain a term but may not replace the controlled field.

## Provisional Visual System

### Palette

| Token | Color | Planning role |
| --- | --- | --- |
| `midnight_base` | `#111827` | primary dark field |
| `brass_accent` | `#C79A42` | moth, clock, and evidence emphasis |
| `paper_neutral` | `#E8E1D3` | memo and document surfaces |
| `warning_rust` | `#B4533C` | pressure or guard warning |
| `uncertainty_cool` | `#5B8DB8` | unresolved or competing interpretation |
| `text_high_contrast` | `#F8FAFC` | text on the midnight field |

Palette roles specify contrast intent; they do not select a licensed texture, image, or brand color system.

### Typography And Readability Budgets

No font is selected. The ranges below are for the provisional 1080p canvas.

| Role | Size range |
| --- | ---: |
| Display | 64-76 px |
| Heading | 42-52 px |
| Body | 30-38 px |
| Subtitle | 44-52 px |
| Label | 24-30 px |

- subject occupancy must remain within each shot's declared range and inside the global project bounds of `15%-80%`;
- simultaneous focal elements: maximum `2`;
- camera-motion classes: maximum `1` per shot;
- recurring motifs: maximum `1` per beat;
- overlay text: maximum `2` lines and `18` characters per line;
- `hard_cut`: maximum `3` consecutive uses;
- `short_dissolve`: maximum `1` per beat;
- `match_cut`: maximum `2` total;
- `graphic_match`: maximum `1` per beat; and
- `held_fade`: maximum `1` per beat.

Forbidden combinations include text outside the safe areas, more than two simultaneous focal elements, more than one motion class in a shot, overlay use above its line/character budget, a selected or rights-cleared asset claim, and any visual wording that presents an unresolved truth as settled.

## Quantitative Metrics Audit

Metrics are derived from the current Derivative content; content is not silently rewritten to force a pass.

### Narration

The package contains `778` narration characters. The project-local thresholds are pass at `<=4.50` characters/second, warn above `4.50` through `5.00`, and fail above `5.00`.

| Beat | Characters | Seconds | Characters/second | Result |
| --- | ---: | ---: | ---: | --- |
| 1 | 94 | 20 | 4.70 | warn |
| 2 | 127 | 30 | 4.23 | pass |
| 3 | 138 | 30 | 4.60 | warn |
| 4 | 116 | 25 | 4.64 | warn |
| 5 | 189 | 50 | 3.78 | pass |
| 6 | 114 | 25 | 4.56 | warn |

The range is `94-189` characters per beat and `3.78-4.70` characters/second. The four warnings are planning signals, not silent-edit triggers; the smallest later correction is a human editorial compression or a separately authorized timing revision.

### Shots And Subtitles

- shots per beat: `3, 3, 3, 3, 4, 3`;
- shot duration: `6-13` seconds, average `9.47` seconds;
- per-beat shot-duration ranges: Beat 1 `6-7`, Beat 2 `10`, Beat 3 `10`, Beat 4 `8-9`, Beat 5 `12-13`, Beat 6 `8-9` seconds;
- subtitle duration: `4-10` seconds;
- subtitle characters: `9-19`;
- subtitle speed: `1.11-2.75` characters/second;
- subtitle line count: `2`, with longest hinted line `11` characters.

All 20 subtitle cues pass the project-local budget of `<=3.00` characters/second, `<=2` lines, and `<=18` characters per line. A cue above `3.00` through `4.00` characters/second warns; above `4.00`, invalid timing, or a structural line-budget violation fails.

`production-blueprint.json`, `beat-specs.csv`, `shot-specs.csv`, and `subtitle-metrics.csv` are the authority for per-beat asset-class and information-role assignments. They describe required classes and quantities only; they do not select assets.

## Definition Of Done And Acceptance Matrix

| Scope | Template checks | Evaluated checks | Required coverage |
| --- | ---: | ---: | --- |
| Global | 13 | 13 | identity, status, counts/timing, locked/bounded completeness, known terms, no selected/cleared asset, no open production gate |
| Per beat | 10 | 60 | one primary and at most two supporting information goals, exact inventories, motif/palette, truth boundary, measurable completion |
| Per shot | 15 | 285 | required fields, contained timing, one composition/scale/transition, zero or one motion, occupancy, asset quantity, overlay allowance, truth-safe wording |
| Per subtitle | 5 | 100 | valid timing, line budget, character/speed metrics, pass/warn result |

The acceptance matrix contains `46` summary rows: `42 pass`, `4 warn`, and `0 fail`. Warnings are limited to narration pace and leave `passed=true` because no required assertion fails. `artifacts/content-production-blueprint-result.json` is the structured result authority and must expose failures separately from warnings.

## Eight-file Blueprint Package

Package root: `artifacts/production-blueprint/`

| File | Role |
| --- | --- |
| `README_BLUEPRINT.md` | Operator order, source identity, status, boundaries, and local use |
| `production-blueprint.json` | Canonical machine-readable profile, constraints, vocabularies, metrics, DoD, and boundary model |
| `beat-specs.csv` | Six quantitative beat contracts |
| `shot-specs.csv` | Nineteen quantitative shot contracts |
| `subtitle-metrics.csv` | Twenty cue-level timing/readability readbacks |
| `visual-system.md` | Project-local palette, typography, motion, transition, safe-area, motif, and forbidden-combination rules |
| `acceptance-matrix.csv` | Machine-readable global/beat/shot/subtitle pass/warn/fail summary |
| `blueprint-package-manifest.json` | Byte-size and SHA256 inventory of the other seven files; never self-hashed |

The package uses UTF-8 without BOM and LF endings. `.gitattributes` pins its Markdown, CSV, and JSON bytes for stable cross-platform hashes.

## UI Information Architecture

The Blueprint route has one ordered reading path:

1. `コンテンツ契約 / Content Contract`: identity, central question, deliberate non-resolution, total scale, profile, and overall DoD.
2. `制約範囲 / Constraint Envelope`: LOCKED, BOUNDED, and FREE.
3. `6ビート進行 / Six-beat Runway`: compact timing and count summary.
4. `選択ビート制作仕様 / Active Beat Production Spec`: current wording, quantitative beat/shot fields, and pass/warn/fail indicators.
5. `ユーティリティ / Utility Drawers`: one collapsed Change History, one collapsed Files / Export surface, and one collapsed Guards surface.

The active content shows current derived wording only. Change History owns provenance. Files / Export owns package links and hashes. Audit and transfer metadata do not enter the beat-dependent primary flow.

### Layout Stability Contract

At approximately `900x1200` CSS pixels:

- the top of the utility-drawer region may move no more than `8` CSS pixels across all six beats;
- the active canvas uses a stable height or internal scroll;
- the page has no horizontal scrolling;
- no package block follows variable beat-content height;
- Arrow/Home/End beat navigation and visible keyboard focus remain available; and
- Light, Dark, and Auto themes remain preserved.

Browser measurements are recorded in `artifacts/content-production-blueprint-result.json`: all six utility anchors measured `1880.171875` CSS pixels from the document top at a 900x1200 viewport, so maximum movement is `0` pixels against the `8`-pixel limit. The page had no horizontal overflow, the active canvas remained `560` CSS pixels tall with internal scroll, and Arrow/Home/End focus behavior passed. Screenshot evidence is `artifacts/review-screens/content-production-blueprint.png` (885x1180 content capture, 133623 bytes, SHA256 `2694f69af62466e5612e9021a6308c3bee8aca8aa133606a0c8c0a9f802afec9`).

## Derivative Route Correction

The same bounded slice corrects `mode=derivative` without changing its content or package:

- status and the three-change summary remain visible;
- the primary content no longer duplicates a complete Before/After diff;
- one collapsed Change History ledger owns provenance;
- one collapsed Files / Export drawer owns the portable package inventory, links, hashes, and downloads; and
- unrelated routes are not redesigned.

The validator requires one Change History owner, one Files / Export owner, zero duplicate primary diffs, and zero package inventories in beat-dependent primary content.

## Validation And Regeneration

Read-only validation:

```powershell
node .\tools\fff-state.mjs validate-content-production-blueprint .\artifacts\content-production-blueprint-result.json
```

Intentional package/result regeneration:

```powershell
node .\tools\fff-state.mjs smoke-content-production-blueprint .\artifacts\content-production-blueprint-result.json .\artifacts\content-production-blueprint-result.json
```

The validate command is strictly read-only and must reject an output path. The smoke command may write only the eight Blueprint package files and `artifacts/content-production-blueprint-result.json`. It must not rewrite Handoff, Revision, Derivative, or historical result artifacts. The root manifest health path uses `validate-*`, not `smoke-*`.

Targeted preserved-source checks:

```powershell
node .\tools\fff-state.mjs validate-editorial-derivative-preview .\artifacts\editorial-derivative-preview-result.json
node .\tools\fff-state.mjs validate-editorial-revision-roundtrip .\artifacts\editorial-revision-roundtrip-result.json
node .\tools\fff-state.mjs validate-bridge-editorial-handoff-pack .\artifacts\bridge-editorial-handoff-pack-result.json
```

## Fail-closed Negative Probes

All probes run without mutating protected artifacts.

| # | Probe | Required outcome |
| ---: | --- | --- |
| 1 | source fingerprint mismatch | reject |
| 2 | changed beat timing | reject |
| 3 | changed beat order | reject |
| 4 | missing shot | reject |
| 5 | fourth authored wording change | reject |
| 6 | unknown composition class | reject |
| 7 | unknown camera motion | reject |
| 8 | missing asset count | reject |
| 9 | unbounded freeform visual direction | reject |
| 10 | missing truth boundary | reject |
| 11 | selected asset | reject |
| 12 | rights-cleared claim | reject |
| 13 | final-canon promotion | reject |
| 14 | duplicate Change History owner | reject |
| 15 | package inventory in beat-dependent primary flow | reject |
| 16 | utility-anchor movement above 8 pixels | reject |
| 17 | missing acceptance criterion | reject |
| 18 | manifest hash mismatch | reject |

## Boundary Gates

- local-only quantitative planning: open;
- source, beat order, timing, and accepted wording baseline mutation: closed;
- story truth, ending choice, and final canon: closed;
- actual asset selection and rights clearance: closed;
- provider/API configuration, credentials, and external model calls: closed;
- image, audio, or video generation: closed;
- production render or media export: closed;
- upload, publication, and public release: closed; and
- durable database persistence: closed.

## Residual Work

| Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- |
| Human production-readiness review | Decides whether a separate creator can understand the scope, visual grammar, quantities, and completion conditions | Completed and validated H0 package plus freeform human review | H1 ready, not started; no approval implied | Human reviewer | Open `mode=blueprint` and review scope, shot grammar, visual system, and DoD |
| Narration pace review | Resolves four project-local warnings without hiding them | Human editorial judgment; any timing change requires separate authority | Open review debt; Beats 1, 3, 4, and 6 warn | Human editor | Prefer minimal wording compression; do not auto-rewrite or change timing |
| Blueprint-constrained asset and shot brief | Converts required classes into creator-facing proposals | Human acceptance of H1 plus a new bounded slice | H2 advisory only; not started | Future production-planning owner | Do not start from validator success alone |
| External creator consistency check | Tests whether another creator can produce a consistent proposal | Accepted Blueprint and separate creator output | H3 external gate; not started | Human production owner plus separate creator | Compare a future proposal against the acceptance matrix |
| Final format and typography | Replaces the provisional profile or selects licensed typography | Explicit format decision and licensing evidence | Deferred | Human production and rights owners | Keep the reversible 1080p profile and font-unselected state |
| Actual assets and rights | Selects media and proves usage rights | Asset inventory, provenance, and rights evidence | Closed | Asset / rights owner | Use a separate Asset / Rights Review lane |
| Multi-format export or ZIP | Reduces delivery friction | Observed delivery need and stable package contract | Deferred | Future operator-tooling owner | Add only after actual transfer friction is observed |
| Provider and production tooling | Generates, renders, uploads, publishes, or persists output | Separate provider, credential, transport, production, publication, and database authorization | Closed | Authorized production operator | Do not start from this Blueprint |
