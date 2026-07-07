# Apply Decision Shell Guard Diet

`fff-apply-decision-shell-guard-diet-001` applies the Split-pane Decision Shell to the default local review route, `public/review/index.html?mode=brief`. The first review surface now asks one route decision first, keeps `Bridgeで確認` as the next action, and moves long context into drawers instead of making the reviewer scan a card wall before choosing what to do.

## What Changed

| Surface | Before this slice | Current state |
| --- | --- | --- |
| Brief route | Low-text console plus preserved Guided Flow and card shelves | Applied Decision Shell with left step rail, center active decision, governed right dock, and drawers |
| Layout Lab | Research-only comparison route | Preserved at `public/review/index.html?mode=layout-lab` as evidence |
| Bridge | Draft-to-Video handoff route | Preserved at `public/review/index.html?mode=bridge` and still the primary action |
| Evidence Vault | Optional deeper shelves | Preserved below the Shell and in the drawer language |

## Decision Shell Application

The applied Shell carries `data-applied-decision-shell="brief"` and `data-decision-flow-model-applied="true"`. Its current route, candidate, channel, five choices, six steps, six context rows, pins, notices, locks, and next action are defined in `decisionFlowModel`, then rendered by `renderDecisionFlowModel()`.

Selected candidate remains `designer-content-moth-investigation-3m`. Selected channel remains `designer-channel-mystery-lore`.

## Dock Governor

The right dock carries `data-dock-governor="true"`, `data-dock-max-visible="true"`, and `data-dock-overflow="drawer"`. Visible limits are pins 4, notices 3, locks 4, and context 4. Overflow rows are sent to the Guard drawer through `data-dock-overflow-list`, and the dock has a fixed max height with internal scroll.

## Safety Gate Diet

The top surface shows only a compact safety summary through `data-gate-display-budget="compact"`. Full gate detail lives in the Guard drawer through `safetyGateRegistry` and `data-safety-gate-registry="true"`.

True gates remain closed:

| Gate | State |
| --- | --- |
| provider/API | closed |
| credentials | closed |
| AI video | closed |
| render | closed |
| upload / public publishing | closed |
| database persistence | closed |
| final canon | closed |
| rights clearance | closed |

## Non-gate Whitelist

Non-gate whitelist items are deliberately narrow and local.

The slice explicitly allows only local, reversible work that does not cross production boundaries:

| Allowed non-gate work | Why it is safe here |
| --- | --- |
| local UI/layout changes | Static HTML review surface only |
| static JSON/readback updates | Local evidence package only |
| screenshots/contact sheets | Local visual proof, no publication |
| docs/status/manifest updates | Handoff and review clarity |
| local smoke checks | Regression guard |
| mock/pre-production planning | No canon, render, upload, or provider execution |

## Visual Evidence

Primary screenshot path: `artifacts/review-screens/brief-decision-shell-applied.png`.

The screenshot is local browser evidence for `public/review/index.html?mode=brief`. It complements the previous Layout Lab contact sheet and does not replace interactive review.

## Validation

Primary smoke:

```powershell
node tools/fff-state.mjs smoke-apply-decision-shell-guard-diet artifacts/apply-decision-shell-guard-diet-result.json artifacts/apply-decision-shell-guard-diet-result.json
```

The smoke checks Shell markers, model-driven rendering, Dock Governor limits, Safety Gate Diet registry, non-gate whitelist, card-wall demotion, route preservation, screenshot presence, and closed production gates.

## Not Being Decided

This slice does not configure providers, touch credentials, generate AI video, render production media, upload or publish, write to a database, clear rights, or make final canon decisions. It also does not remove the Layout Lab, Bridge, Guided Flow, Evidence Vault, Designer, Draft, Source, Project, or Artifacts routes.
