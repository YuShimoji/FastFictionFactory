# Content Production Blueprint

PROVISIONAL REVIEW PROFILE / NOT CANONICAL / NOT PRODUCTION-APPROVED

- artifact_id: fff-content-production-blueprint-001
- route: public/review/index.html?mode=blueprint
- source: fff-editorial-derivative-preview-001
- source derivative SHA256: 15a695b7336ce55f520878cb9a26a35d47994fa176ef57ac55bf231a9cc0b51c
- status: provisional_production_blueprint
- canvas: 1920x1080 (16:9)
- planning_timebase: 30fps
- scale: 180s / 6 beats / 19 shots / 20 subtitles / 6 narration segments / 3 thumbnail directions

## Content Contract

鐘のない塔が鳴る矛盾から、失われた時間と名前をめぐる調査線を提示する3分のミステリー／ロア候補。

Presented question: 時間を戻すのか、消えた名前を返すのか。

This package deliberately does not resolve: 鐘が鳴る原因 / トーマの生死と所在 / 真鍮の蛾の正体と機能 / 台帳の真正性と所有者 / 評議会の動機と責任 / ミラの最終選択とending truth.

## Creative Degrees of Freedom

- LOCKED: 12 fields. Source identity, order, timing, IDs, truth/rights state, the exact three wording changes, counts, and non-canonical state do not move.
- BOUNDED: 13 fields. Every production degree uses an enum or numeric budget plus pass/warn/fail readback.
- FREE: 4 low-risk micro-details. These cannot alter meaning, evidence, timing, truth, readability, rights, composition class, or asset count.

## Quantitative Readback

- narration: 778 characters; 3.78-4.7 chars/s; 4 project-local warnings
- subtitles: 4-10s; 9-19 characters; 1.11-2.75 chars/s; 0 warnings / 0 failures
- shots: 6-13s; average 9.47s
- acceptance matrix: 42 pass / 4 warn / 0 fail

Warnings do not rewrite source content. The smallest later correction is a voice rehearsal and, only if authorized after that evidence, a narrow pacing review.

## Package Files

- production-blueprint.json: authoritative machine-readable model
- beat-specs.csv: one quantitative row per beat
- shot-specs.csv: one constrained row per shot
- subtitle-metrics.csv: current duration, character, speed, and line-budget readback
- visual-system.md: provisional project-local visual constraints
- acceptance-matrix.csv: pass/warn/fail scope summary
- blueprint-package-manifest.json: SHA256 and byte-size inventory of the other seven files

## Boundaries

No actual asset is selected. No rights are cleared. Provider/API, credentials, external calls, generation, render, upload, publication, database persistence, final canon, and production approval remain closed.
