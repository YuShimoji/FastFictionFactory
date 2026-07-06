# Home Cockpit Metric Linking

`fff-home-cockpit-metric-linking-001` turns the default Review Brief route into the local Home Cockpit for the next human review. The goal is not to add production capability. It is to make the next user-side read feel like a small command surface: what to read now, what to open only if needed, and what remains locked.

## User Route

Open:

```text
public/review/index.html?mode=brief
```

Compatibility alias:

```text
public/review/index.html?mode=home
```

The no-query file route `public/review/index.html` also starts in the same Home Cockpit because the body default and JavaScript fallback are now `brief`. The Bridge remains separate at:

```text
public/review/index.html?mode=bridge
```

## What Changed

| Area | Before | Now |
| --- | --- | --- |
| Default review surface | Review Home Map lived as a separate `home` mode | `brief` is the Home Cockpit and `home` aliases to it |
| Primary path | Home, Brief, and Bridge could feel like separate first stops | Operator Track is Home Cockpit then Draft-to-Video Bridge |
| Shelf meaning | Seven shelf cards explained route/status/open triggers | Cards are grouped into Operator Track, Workbench, Evidence Vault, and Locked Lanes |
| Meters | Seven shelf-level meters | Nine actionable readiness meters plus shelf meters, each with a next action |
| Production gates | Locked in text and project status | Visible as Locked Lanes: provider/API, AI video, render, upload, final canon, rights clearance |

## Readiness Meters

The Home Cockpit exposes these review-readiness meters:

| Meter | State | Next Action |
| --- | --- | --- |
| 選択ルート | 4 / 5 | Read Bridge and accept / revise / reject the 3-minute mystery-lore route |
| ナレーション構成 | 4 / 5 | Decide whether the outline reads as a usable video spine |
| 字幕・画面テキスト | 3 / 5 | Choose whether subtitle rhythm needs the next refinement slice |
| 画面構成 | 3 / 5 | Decide whether visual cue detail is enough before production planning |
| サムネ案 | 2 / 5 | Consider thumbnail comparison as a small next refinement |
| 権利・素材 | 1 / 5 | Keep asset and rights work closed unless auditing evidence |
| 未決定の真相 | 1 / 5 | Confirm whether Toma fate / brass moth truth / Council motive should stay held |
| 証跡の健全性 | 4 / 5 | Open Evidence Vault only when a source or boundary concern appears |
| 公開・生成 Lane | 0 / 5 | Keep provider/API, AI video, render, upload, final canon, and rights clearance closed |

## Preserved Boundaries

This slice does not configure provider/API access, touch credentials, generate AI video, render production assets, upload publicly, clear rights, or make final canon decisions. It preserves the Draft-to-Video Bridge, Review Brief / dark-mode UX, One-story Draft Review Pack, Designer Dashboard, stabilization readback, and Contradictory Claim Guard as local readbacks only.

## Validation

Primary command:

```bash
node tools/fff-state.mjs smoke-home-cockpit-metric-linking artifacts/home-cockpit-metric-linking-result.json artifacts/home-cockpit-metric-linking-result.json
```

Regression commands kept relevant:

```bash
node tools/fff-state.mjs smoke-review-brief-dark-mode-ux artifacts/review-brief-dark-mode-ux-result.json artifacts/review-brief-dark-mode-ux-result.json
node tools/fff-state.mjs smoke-review-home-map-meters artifacts/review-home-map-meters-result.json artifacts/review-home-map-meters-result.json
node tools/fff-state.mjs smoke-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json artifacts/draft-to-video-planning-bridge-result.json
```
