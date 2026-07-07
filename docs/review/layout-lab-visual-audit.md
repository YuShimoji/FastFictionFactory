# Layout Lab Visual Audit

Artifact: `fff-layout-lab-visual-audit-001`

Current status note: the recommended split-pane Decision Shell has since been applied to `public/review/index.html?mode=brief` in `fff-apply-decision-shell-guard-diet-001`. This document remains source visual evidence.

## Purpose

This slice gives the reviewer visual evidence for the existing Layout Research Lab before the later follow-up applies the split-pane Decision Shell to the default `brief` route.

It packages screenshots for the research route and the preserved operator routes so the next decision can be made from actual rendered screens, not only static readback JSON.

## What Was Opened

The review UI was opened locally through Playwright using the Microsoft Edge channel:

- `public/review/index.html?mode=layout-lab`
- `public/review/index.html?mode=brief`
- `public/review/index.html?mode=bridge`

Bundled Playwright Chromium was not installed in the local browser cache, so the screenshot pass used the local Microsoft Edge channel. The pages were still opened as local `file://` review surfaces, and no external application service, model, provider, upload, render, or database was used.

## Screenshot Evidence

| Evidence | Path | What it proves |
| --- | --- | --- |
| Layout Lab first screen | `artifacts/review-screens/layout-lab.png` | The `layout-lab` route opens locally and shows the research context plus Card-first and Briefing Inbox alternatives. |
| Split-pane Decision Shell | `artifacts/review-screens/layout-lab-decision-shell.png` | The recommended shell is visible as left step rail, center active decision, right context dock, and bottom drawers. |
| Preserved Brief route | `artifacts/review-screens/brief-preserved.png` | The default `brief` route still opens with the Low-text Decision Console and supporting flow. |
| Preserved Bridge route | `artifacts/review-screens/bridge-preserved.png` | The `bridge` route still opens with the Bridge Decision Console and guided sequence. |
| Contact sheet | `artifacts/layout-lab-visual-audit-contact-sheet.png` | The four review screenshots can be compared quickly in one image. |

## What To Review

The human review target is the visual fit of the Layout Lab recommendation:

- whether the Split-pane Decision Shell is easier to judge than the Card-first baseline
- whether the left rail, active decision, right dock, and bottom drawers reduce the feeling of parallel card piles
- whether preserved `brief` and `bridge` still look usable enough to remain the operator routes until a later apply slice

## What Is Not Being Decided

This audit does not apply the Decision Shell to `brief`, does not replace the current review UI, does not expand Bridge content, and does not add script, subtitle, thumbnail, provider/API, video generation, render, upload, durable database, rights clearance, or final-canon behavior.

Toma fate, brass moth truth, Council motive, contradictory claim truth, and moth-key function remain human-owned and unresolved.

## Validation Commands

```powershell
node .\tools\fff-state.mjs smoke-layout-lab-visual-audit .\artifacts\layout-lab-visual-audit-result.json .\artifacts\layout-lab-visual-audit-result.json
node .\tools\fff-state.mjs smoke-layout-research-decision-shell .\artifacts\layout-research-decision-shell-result.json .\artifacts\layout-research-decision-shell-result.json
node .\tools\fff-state.mjs smoke-low-text-decision-console .\artifacts\low-text-decision-console-result.json .\artifacts\low-text-decision-console-result.json
node .\tools\fff-state.mjs smoke-guided-review-flow-workspace .\artifacts\guided-review-flow-workspace-result.json .\artifacts\guided-review-flow-workspace-result.json
node .\tools\fff-state.mjs smoke-bridge-refinement-overview-ribbon .\artifacts\bridge-refinement-overview-ribbon-result.json .\artifacts\bridge-refinement-overview-ribbon-result.json
node .\tools\fff-state.mjs smoke-home-cockpit-metric-linking .\artifacts\home-cockpit-metric-linking-result.json .\artifacts\home-cockpit-metric-linking-result.json
node .\tools\fff-state.mjs smoke-draft-to-video-planning-bridge .\artifacts\draft-to-video-planning-bridge-result.json .\artifacts\draft-to-video-planning-bridge-result.json
node .\tools\fff-state.mjs smoke-contradictory-claim-guard .\artifacts\extraction-validator-smoke-result.json .\artifacts\contradictory-claim-guard-result.json
```

## Later Follow-up

The follow-up implementation was completed as `fff-apply-decision-shell-guard-diet-001`: the split-pane Decision Shell is now applied to `public/review/index.html?mode=brief` while preserving the existing `bridge`, Evidence Vault, dark mode, readbacks, and closed production/provider/canon gates.
