# Review Workbench Component Contract

## Purpose

`fff-review-workbench-component-contract-001` converts the default `brief` first screen from a card-like collection of panels into a role-contracted Review Workbench. The slice keeps the applied Decision Shell as the source shell, but tightens the component boundaries so the reviewer sees one coordinated work surface: process rail on the left, active decision in the center, context dock on the right, and Evidence / Notes / Inspiration / Guard drawers below.

## User Review That Triggered It

The prior applied shell was visually cleaner than the card wall, but the user review found that each component still looked equally important and movable. The right-side list also looked likely to grow, and multiple components were trying to explain the whole situation with slightly different granularity. This slice treats that as a component architecture failure rather than a request for more explanatory text.

## Component Role Contract

`public/review/index.html` now includes `componentRoleContracts` with entries for `appHeader`, `routeNavigator`, `processRail`, `activeDecisionCanvas`, `contextDock`, `evidenceDrawer`, `notesDrawer`, `inspirationDrawer`, `guardDrawer`, and `legacyArchive`. Each entry defines `role`, `owns`, `must_not_show`, `max_visible_items`, `source_of_truth`, and `route_or_drawer`.

The root Workbench carries `data-component-role-contract="true"` and the Notes drawer renders a compact contract summary for inspection without making the first screen read like documentation.

## Single Source of Framing

The Workbench root carries `data-single-framing-source="active-decision-canvas"`. The active decision canvas is the only visible component that explains the current review frame. Header content is identity only, the compact route navigator owns navigation only, the process rail owns sequence only, and the Context Dock owns context only.

## Duplication Budget

The root carries `data-duplication-budget="true"`. The smoke measures first-screen visible text before preserved legacy shelves and verifies:

- current route explanation appears once;
- selected candidate ID appears at most twice;
- selected channel ID appears at most twice;
- `provider/API` appears at most once outside the Guard drawer;
- `final canon` appears at most once outside the Guard drawer;
- `Review Brief`, `Home Cockpit`, and `Guided Review Flow` do not compete as first-screen headings.

## Complement Rule

The root carries `data-component-complement-rule="true"`. Each component now states only what it owns: Workbench owns the active decision, Route Navigator owns navigation, Context Dock owns pins/context, Evidence Drawer owns evidence, and Guard Drawer owns gates. Components should not describe "everything except" another component's responsibility.

## Context Dock Limits

The Context Dock carries `data-context-dock-role="context-only"` and declares visible limits of context chips max 4, pins max 3, notices max 2, and lock summaries max 1. Overflow remains in drawers through the Dock Governor. The dock may show candidate, channel, phase/local state, current artifact pin, compact notices, and one lock summary, but it must not repeat route instructions, evidence explanations, or safety paragraphs.

## What Changed From The Card-Like Shell

The route navigation is now a compact strip with `data-route-nav-compact="true"` and no explanatory paragraphs. The old route summary grid was removed from the first screen. `How to open locally` moved behind `data-operator-utility-drawer="true"`. The Workbench Canvas uses one shared shell surface with light separators instead of thick bordered panels around every component.

## Preserved Routes

The following routes remain available:

- `public/review/index.html?mode=brief`
- `public/review/index.html?mode=bridge`
- `public/review/index.html?mode=layout-lab`
- `public/review/index.html?mode=designer`
- `public/review/index.html?mode=draft`
- `public/review/index.html?mode=source`
- `public/review/index.html?mode=project`
- `public/review/index.html?mode=artifacts`

## Safety Gate Handling

`safetyGateRegistry` remains in place and still records the true gate registry. Long safety text stays in the Guard drawer. The first screen shows at most one compact lock summary, so safety remains visible without dominating the active decision.

## Validation Commands

```powershell
node --check .\tools\fff-state.mjs
node .\tools\fff-state.mjs smoke-review-workbench-component-contract .\artifacts\review-workbench-component-contract-result.json .\artifacts\review-workbench-component-contract-result.json
# POSIX-style form used by the smoke readback:
node tools/fff-state.mjs smoke-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json artifacts/review-workbench-component-contract-result.json
node .\tools\fff-state.mjs smoke-apply-decision-shell-guard-diet .\artifacts\apply-decision-shell-guard-diet-result.json .\artifacts\apply-decision-shell-guard-diet-result.json
node .\tools\fff-state.mjs smoke-layout-lab-visual-audit .\artifacts\layout-lab-visual-audit-result.json .\artifacts\layout-lab-visual-audit-result.json
node .\tools\fff-state.mjs smoke-layout-research-decision-shell .\artifacts\layout-research-decision-shell-result.json .\artifacts\layout-research-decision-shell-result.json
node .\tools\fff-state.mjs smoke-low-text-decision-console .\artifacts\low-text-decision-console-result.json .\artifacts\low-text-decision-console-result.json
node .\tools\fff-state.mjs smoke-draft-to-video-planning-bridge .\artifacts\draft-to-video-planning-bridge-result.json .\artifacts\draft-to-video-planning-bridge-result.json
node .\tools\fff-state.mjs smoke-contradictory-claim-guard .\artifacts\extraction-validator-smoke-result.json .\artifacts\contradictory-claim-guard-result.json
```

## Known Limitations

This slice does not redesign Bridge, write storyboard flow, refine script/subtitle/thumbnail content, configure a provider/API, generate video, render, upload, change database persistence, make rights-clearance claims, or decide final canon. The Workbench improves first-screen role clarity; it does not make production decisions.

## Next Possible Slice

If the Workbench passes human review, the next narrow slice can advance one Bridge refinement lane, such as storyboard flow, narration wording, subtitle rhythm, thumbnail direction, or held-truth policy. If the Workbench still feels noisy, the next slice should audit first-screen visible text and remove one remaining low-value surface rather than adding another panel.
